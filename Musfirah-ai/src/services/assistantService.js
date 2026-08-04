const ASSISTANT_ENDPOINT = '/api/assistant';

export async function requestAssistantResponse(messages, signal) {
  const response = await fetch(ASSISTANT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || typeof payload.answer !== 'string') {
    const error = new Error(payload.error || 'The live assistant is unavailable.');
    error.code = payload.code || 'ASSISTANT_ERROR';
    throw error;
  }

  return payload;
}
