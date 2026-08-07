const ASSISTANT_ENDPOINT = '/api/assistant';

export async function requestAssistantResponse(messages, signal) {
  const response = await fetch(ASSISTANT_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
    signal,
    credentials: 'same-origin',
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || typeof payload.answer !== 'string') {
    const error = new Error(payload.error || 'The live assistant is unavailable.');
    error.code = payload.code || 'ASSISTANT_ERROR';
    error.retryAfter = Number(payload.retryAfter || response.headers.get('Retry-After') || 0);
    error.requestId = payload.requestId || response.headers.get('X-Request-ID') || undefined;
    throw error;
  }

  return payload;
}
