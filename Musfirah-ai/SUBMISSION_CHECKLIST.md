# Checkpoint 2 submission checklist

Complete these account-level steps after extracting the final source ZIP.

## 1. Rotate the exposed Gemini key

The original uploaded project archive contained `.env.local` and Vercel environment files. Delete or disable that Gemini key in Google AI Studio and create a fresh key. Never place the new key inside the project folder or GitHub repository.

## 2. Create the production rate limiter

1. Open [Upstash Console](https://console.upstash.com/).
2. Create a free Redis database near the Vercel deployment region.
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the REST API section.
4. Keep both values private.

## 3. Create a clean GitHub repository

1. Extract this ZIP into a new folder.
2. Confirm `.env.local`, `.vercel`, `node_modules` and `dist` are absent.
3. Run `npm install` and `npm run check`.
4. Create a new GitHub repository and push the source as the clean initial history.
5. Confirm GitHub does not display any real Gemini or Upstash credential.

## 4. Deploy on Vercel

1. Import the clean GitHub repository into Vercel.
2. Select Vite, keep the build command as `npm run build`, and use `dist` as the output directory.
3. Add these variables for Production and Preview:

   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` = `gemini-3.6-flash`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `APP_ORIGIN` = the final `https://...vercel.app` URL

4. Deploy or redeploy after saving the variables.

## 5. Update production references

If the new URL is different from the previous project URL, update it in:

- `README.md`
- `index.html` canonical and Open Graph URL
- `public/robots.txt`
- `public/sitemap.xml`

Run `npm run check` and redeploy after editing these references.

## 6. Add README screenshots

Capture the live deployment and add:

- `docs/screenshots/home.png`
- `docs/screenshots/assistant.png`
- `docs/screenshots/mobile.png`

Replace the temporary Screenshots note in `README.md` with a two- or three-image table.

## 7. Final production test

- Open every route and hard-refresh it.
- Ask the assistant a verified portfolio question.
- Confirm the response is returned by Gemini.
- Send 11 requests from the same connection and confirm the last request shows the friendly rate-limit message.
- Check the layout in Chrome, Firefox, Edge and a mobile browser.
- Verify the resume download.
- Confirm the browser console contains no unexpected errors.

## 8. Submit

Submit:

1. Public Vercel production URL
2. GitHub repository URL containing the final README

