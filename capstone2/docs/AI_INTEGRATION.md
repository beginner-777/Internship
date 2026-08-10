# AI integration

## SDK and endpoint

`lib/gemini.ts` uses the official `@google/genai` SDK and the Gemini Interactions API. It is protected by `import "server-only"`. The browser calls only the Next.js `POST /api/analyze` route. Interactions use `store: false`, so TRACE AI does not request server-side conversation persistence.

## Prompt boundary

The system instruction defines logs and notes as untrusted evidence. Embedded role changes, commands, requests for secrets, and tool instructions are ignored. The model is told to:

- use supplied evidence only;
- separate observation from inference;
- keep root causes as hypotheses unless proved;
- avoid invented timestamps, services, metrics, relationships, or customer impact;
- quote only short fragments;
- state insufficient evidence;
- identify healthy evidence explicitly;
- return JSON only; and
- never claim an action was executed.

## Structured output

Zod generates the JSON Schema supplied through `response_format`. Before transmission, unsupported draft metadata and string-length keywords are removed to match Gemini's supported JSON Schema subset. If Gemini rejects server-side schema enforcement with HTTP 400, TRACE AI makes a controlled Interactions API retry in JSON mode, supplies the same exact schema as a prompt contract, and accepts the result only after `JSON.parse` and full Zod validation. Confidence constraints, enums, array limits, and string limits therefore remain enforced independently of model behavior.

## Repair policy

If output is malformed or violates the schema, the server makes one controlled request that re-analyzes the original evidence and asks for schema-valid JSON. The invalid response is not trusted as source material. A second failure returns `INVALID_RESPONSE`; it is not replaced with fabricated AI output.

## Failure normalization

Authentication, rate limit, safety rejection, timeout, malformed response, upstream availability, and unknown server failures are converted into plain-language safe codes. Server logging includes only a generated request ID and normalized code, never the key or complete evidence.

## Fallback modes

- **Demo Analysis:** no key is configured; an algorithmic local result is returned and explicitly labelled as not live Gemini.
- **Basic local analysis — not an AI analysis:** the user chooses a client-side rule-based fallback after an error or while offline.
