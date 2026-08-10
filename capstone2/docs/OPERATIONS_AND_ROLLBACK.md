# Operations and rollback

## Health

`GET /api/health` returns service status, current time, and whether the server has an AI key configured. It never returns the key.

## Safe logging

Analysis failures log a generated request ID and normalized error code. Complete evidence, structured model output, and credentials are not intentionally logged.

## Operational triage

- Rising `RATE_LIMITED`: distinguish application rate limiting from Gemini quota.
- Rising `AUTH_FAILED`: validate the server secret and API access; rotate only through the hosting secret manager.
- Rising `TIMEOUT`: inspect model latency and incident input size.
- Rising `INVALID_RESPONSE`: verify model/schema compatibility before changing validation.
- WebGL reports: confirm the CSS fallback and workflow remain intact before treating as an incident.

## Rollback

1. Identify the last deployment that passed the smoke checklist.
2. Promote or redeploy that immutable Vercel deployment.
3. Keep or restore the compatible `GEMINI_MODEL` value in server settings.
4. Verify `/api/health` and run the sample investigation.
5. Confirm missing-key, error, local fallback, refresh, and print flows.
6. Document the failed version and cause before forward-fixing.

Source rollback and secret rollback are separate operations. Never place a previous API key in source to reproduce a deployment.
