# PRify — GitHub Copilot Instructions

## Project Overview
PRify is a **pure frontend** (HTML/CSS/JS) web app hosted on GitHub Pages. It generates personalized PR tweets for celebrities using Wikipedia data + Google Gemini AI. There is **no backend, no build step, no npm**.

## Tech Stack
- **HTML5 + CSS3 + Vanilla JavaScript (ES Modules)**
- **SheetJS (xlsx)** via CDN for Excel parsing/generation in-browser
- **Wikipedia REST API** for fetching celebrity bios (no auth needed)
- **Google Gemini API** for AI tweet generation (user provides their own key)
- **GitHub Pages** for hosting

## Architecture Rules
- All code runs **client-side in the browser** — no Node.js, no server
- Use **ES Modules** (`import`/`export`) for all JS files
- Use **CDN imports** for SheetJS — no npm/bundler
- Gemini API key is stored in **localStorage** — never sent to any third-party server
- All Excel processing happens **in-browser** via SheetJS
- Use **textContent** (not innerHTML) for user-generated content to prevent XSS

## File Structure
```
prify/
├── index.html                    # Single page app
├── assets/
│   ├── css/styles.css            # Styles with CSS variables
│   └── js/
│       ├── app.js                # Main entry, event wiring
│       ├── services/
│       │   ├── excelService.js   # Parse/generate Excel
│       │   ├── wikiService.js    # Wikipedia REST API calls
│       │   ├── geminiService.js  # Gemini API calls
│       │   └── orchestrator.js   # Orchestrate pipeline per celeb
│       ├── ui/
│       │   ├── formHandler.js    # Form validation & submission
│       │   ├── progressUI.js     # Progress bar & status log
│       │   └── resultsUI.js      # Results table & download
│       └── utils/
│           ├── validators.js     # Input validation
│           ├── helpers.js        # Utility functions
│           └── storage.js        # localStorage wrapper
```

## Coding Conventions
- Use `const` by default, `let` when mutation needed, never `var`
- Use async/await for all asynchronous operations
- Use JSDoc comments for all exported functions
- Use descriptive function names: `fetchCelebrityBio()`, `generatePersonalizedTweet()`
- Keep functions small and single-purpose
- Handle errors gracefully — show user-friendly messages in the UI
- Use CSS variables for theming (defined in `:root`)

## Key APIs
- Wikipedia: `GET https://en.wikipedia.org/api/rest_v1/page/summary/{title}`
- Gemini: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={KEY}`

## Important Notes
- Process celebrities **sequentially** with delays to avoid rate limiting
- Always provide fallback data if Wikipedia fetch fails
- Tweet output must be ≤ 280 characters
- Never expose the API key in any network request to third-party servers
