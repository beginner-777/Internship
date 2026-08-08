Synapse SEO

Capstone Track

FE2 — SEO Audit Dashboard

Target User

The primary user is a freelance web developer or small startup team preparing a public marketing page for launch. Secondary users include website owners and product teams who need a fast, explainable first-pass SEO audit without paying for an enterprise crawler.

Problem

SEO tools often split technical checks, content observations, performance proxies, and recommendations across dense tables. Their scores can be opaque, and AI features may hide whether a model actually ran. Users struggle to understand which weaknesses are connected and what to fix first.

Solution

SYNAPSE SEO securely retrieves one public HTML page, extracts available evidence, applies explicit checks, derives ten category scores, and maps the result into a navigable 3D neural system. When configured, Google Gemini converts the compact structured audit into validated strategic guidance. When it is not available, the same interface uses clearly labeled deterministic recommendations.

Core Flow

User enters an HTTP/HTTPS website URL.

Client performs basic syntax validation.

Server validates protocol, hostname, port, DNS resolution, and private-address safety.

Server retrieves a bounded response with timeout and redirect limits.

Engine parses HTML and checks root robots.txt and sitemap.xml.

Engine samples up to five internal links and extracts evidence.

Scoring engine creates category scores, overall score, and issues.

If configured, Gemini receives compact structured audit data and returns JSON.

AI response is schema-validated; failures use honest Demo Analysis.

Dashboard, 3D neural web, issue explorer, action plan, and report render the same audit object.

Screens

/ — Immediate 3D system, value statement, URL command interface, scanning transition

/audit — Stored/live audit dashboard with category rail, neural web, AI panel, issue summary, action matrix

/issues — Severity/category filters, expandable issue evidence, local reviewed state

/reports — Eleven-section professional audit, print/export and downloadable standalone HTML

/explore — Four clearly labeled sample audits

/about — Method, AI behavior, visualization, stack, evidence, and limits

Data Sources

User-provided public URL

Returned public HTML

HTTP status, final URL, selected response headers, response time, response bytes

Title, meta description, canonical, robots meta, Open Graph

HTML language, headings, visible text, links, images and alt attributes

JSON-LD structured data

Root robots.txt

Root sitemap.xml and sitemap declarations in robots.txt

No Search Console, Analytics, ranking, backlink, or authenticated data is claimed.

AI Feature

Google Gemini API via the official @google/genai SDK. The server selects a compatible Gemini Flash model only after local analysis. It sends category scores, compact signal summaries, failed issues, and limitations—not unlimited raw HTML. Gemini is instructed to act as a technical SEO consultant and its response is constrained by a JSON schema, normalized, and validated before display.

Expected validated output:

Executive summary

Priority issues

Opportunities

Recommendations

Impact/effort action plan

Per-category insight text

Technology Stack

Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Three.js, React Three Fiber, Drei, Framer Motion, official Google Gen AI SDK, Cheerio, Zod, Vitest.

Next.js was selected because its server routes keep crawling, SSRF protection, and the Gemini key off the client while the App Router supports a responsive product interface. React Three Fiber and Drei provide the data-driven 3D neural map; Cheerio performs bounded HTML extraction, Zod validates AI output, and Vitest protects deterministic audit/scoring behavior.

SEO Scoring Method

Each of ten categories starts at 100. Evidence-based failed checks subtract fixed penalties; scores are clamped at zero. Status bands are healthy (80–100), warning (55–79), and critical (0–54).

Overall weighted formula:

Σ(category score × category weight) / 100

Weights: Technical 14, Content 12, Metadata 14, Links 8, Performance 12, Indexability 14, Accessibility 8, Mobile 7, Structured Data 5, Security 6.

Scores are reproducible for the same extracted signals. No randomness is used. Passed checks do not inflate scores above 100.

Security

HTTP/HTTPS only; embedded credentials and nonstandard ports blocked

Localhost, internal suffixes, metadata hosts, private/loopback/link-local/reserved IPs blocked

DNS checked before every initial or redirected request

Manual redirects capped at four

Primary request timeout 10 seconds

HTML response cap 2 MB; auxiliary requests use smaller caps

Basic in-memory rate limit: six audits per minute per forwarded client identity

Ten-minute in-memory audit cache prevents unnecessary repeated Gemini calls

API key read only from server-side process.env.GEMINI_API_KEY

No raw backend or Gemini errors returned to the browser

AI response schema and length validation

Production hardening note: shared cache/rate infrastructure and enforced outbound network policy are recommended for multi-instance or high-assurance deployments.

Free/Demo Mode

If the key is missing, quota is exhausted, Gemini is unavailable, or returned JSON is invalid, the application creates deterministic guidance from actual local issues and shows DEMO ANALYSIS. It never claims Gemini ran. Sample audits are separately labeled.

Limitations

One HTML page per audit

No client-side JavaScript rendering

Up to five internal links sampled

Basic robots interpretation

Response timing is a server observation, not Core Web Vitals

No full accessibility conformance test

No rich-result eligibility guarantee

In-memory limits/cache reset between server instances or restarts

Out of Scope

Google ranking guarantees

Search Console data without authentication

Enterprise backlink databases

Full internet or full-site crawling

Paid competitor intelligence

Guaranteed traffic predictions

Search manipulation

Automated publishing

Black-hat SEO automation

Acceptance Criteria

URL syntax validation and public destination enforcement

Server-side HTML acquisition with timeout, size, and redirect limits

Metadata, headings, text, images, links, Open Graph, JSON-LD, robots, sitemap, mobile, HTTPS, response, and header extraction

Deterministic category and overall scoring

Evidence-based critical, warning, and passed checks

Real Gemini request when a valid key succeeds

Compact AI payload and schema-validated AI response

Honest, clearly labeled deterministic fallback

Interactive data-driven 3D SEO Neural Web

Hover, selection, camera focus, orbit, zoom, pan, and reset

Accessible category list and text alternatives to 3D

Cinematic non-spinner scan state

Issues, report, explore, and about routes

Action plan and impact/effort matrix

Downloadable and printable report

Responsive and reduced-motion behavior

.env.example, secret exclusion, README, and modular TypeScript source