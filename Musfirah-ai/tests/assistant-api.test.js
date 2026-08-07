import assert from 'node:assert/strict';
import { after, test } from 'node:test';

process.env.GEMINI_API_KEY = 'test-only-key';
process.env.NODE_ENV = 'test';

const originalFetch = globalThis.fetch;

globalThis.fetch = async () => ({
  ok: true,
  status: 200,
  async json() {
    return {
      model: 'gemini-test-model',
      steps: [
        {
          type: 'model_output',
          content: [{ type: 'text', text: 'Verified test response.' }],
        },
      ],
    };
  },
});

const { default: handler } = await import('../api/assistant.js');

after(() => {
  globalThis.fetch = originalFetch;
  delete process.env.GEMINI_API_KEY;
  delete process.env.NODE_ENV;
});

function createRequest({
  method = 'POST',
  body = { messages: [{ role: 'user', content: 'What are her frontend skills?' }] },
  ip = '203.0.113.10',
  origin = 'https://portfolio.example',
} = {}) {
  return {
    method,
    body,
    headers: {
      'content-type': 'application/json',
      host: 'portfolio.example',
      origin,
      'x-forwarded-for': ip,
    },
    socket: { remoteAddress: ip },
    on() {},
    off() {},
  };
}

function createResponse() {
  const headers = new Map();

  return {
    body: undefined,
    statusCode: 200,
    writableEnded: false,
    setHeader(name, value) {
      headers.set(name.toLowerCase(), value);
    },
    getHeader(name) {
      return headers.get(name.toLowerCase());
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      this.writableEnded = true;
      return this;
    },
  };
}

async function invoke(options) {
  const response = createResponse();
  await handler(createRequest(options), response);
  return response;
}

test('allows only POST requests', async () => {
  const response = await invoke({ method: 'GET' });
  assert.equal(response.statusCode, 405);
  assert.equal(response.body.code, 'METHOD_NOT_ALLOWED');
  assert.equal(response.getHeader('allow'), 'POST');
});

test('rejects cross-origin browser requests', async () => {
  const response = await invoke({
    ip: '203.0.113.11',
    origin: 'https://attacker.example',
  });
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.code, 'ORIGIN_NOT_ALLOWED');
});

test('rejects empty and oversized prompts with safe validation errors', async () => {
  const empty = await invoke({
    ip: '203.0.113.12',
    body: { messages: [{ role: 'user', content: '   ' }] },
  });
  assert.equal(empty.statusCode, 400);
  assert.equal(empty.body.code, 'VALIDATION_ERROR');

  const oversized = await invoke({
    ip: '203.0.113.13',
    body: { messages: [{ role: 'user', content: 'a'.repeat(1_001) }] },
  });
  assert.equal(oversized.statusCode, 400);
  assert.equal(oversized.body.code, 'VALIDATION_ERROR');
});

test('returns a finite Gemini response without exposing the server key', async () => {
  const response = await invoke({ ip: '203.0.113.14' });
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.answer, 'Verified test response.');
  assert.equal(response.body.source, 'gemini');
  assert.doesNotMatch(JSON.stringify(response.body), /test-only-key/);
});

test('enforces a maximum of 10 requests per minute per IP', async () => {
  const ip = '203.0.113.15';
  const responses = [];

  for (let index = 0; index < 11; index += 1) {
    responses.push(await invoke({ ip }));
  }

  assert.equal(responses[9].statusCode, 200);
  assert.equal(responses[10].statusCode, 429);
  assert.equal(responses[10].body.code, 'RATE_LIMITED');
  assert.match(responses[10].body.error, /Rate limit exceeded/i);
  assert.equal(responses[10].getHeader('ratelimit-remaining'), '0');
});

