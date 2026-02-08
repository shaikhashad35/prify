# PRify — Architecture Document

## System Architecture (Pure Frontend)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           BROWSER (Client-Side Only)                     │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                         UI LAYER (HTML/CSS)                        │ │
│  │                                                                    │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │ │
│  │  │ API Key     │  │ File Upload  │  │ PR Agenda Input          │ │ │
│  │  │ Input       │  │ Dropzone     │  │ Textarea                 │ │ │
│  │  └─────────────┘  └──────────────┘  └──────────────────────────┘ │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │              Progress Bar + Live Status Log                  │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │              Results Table + Download Button                  │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      JS SERVICE LAYER                              │ │
│  │                                                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │ │
│  │  │ excelService │  │ wikiService  │  │ geminiService          │  │ │
│  │  │              │  │              │  │                        │  │ │
│  │  │ • parse()    │  │ • fetchBio() │  │ • generateTweet()     │  │ │
│  │  │ • generate() │  │ • fallback() │  │ • buildPrompt()       │  │ │
│  │  └──────────────┘  └──────┬───────┘  └───────────┬────────────┘  │ │
│  │                           │                       │               │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │                   tweetOrchestrator                          │ │ │
│  │  │                                                              │ │ │
│  │  │  For each celebrity:                                         │ │ │
│  │  │    1. Fetch Wikipedia bio  ──▶  Wikipedia REST API           │ │ │
│  │  │    2. Build LLM prompt                                       │ │ │
│  │  │    3. Call Gemini API      ──▶  Gemini REST API              │ │ │
│  │  │    4. Collect result                                         │ │ │
│  │  │    5. Update progress UI                                     │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      UTILS LAYER                                   │ │
│  │                                                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │ │
│  │  │ validators   │  │ helpers      │  │ storage (localStorage) │  │ │
│  │  └──────────────┘  └──────────────┘  └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                    │                              │
                    ▼                              ▼
        ┌───────────────────┐          ┌────────────────────────┐
        │  Wikipedia REST   │          │  Google Gemini API     │
        │  API (Free)       │          │  (User's API Key)      │
        │  No Auth Required │          │  Free Tier: 15 RPM     │
        └───────────────────┘          └────────────────────────┘
```

---

## Data Flow

```
INPUT EXCEL                    PR AGENDA TEXT
    │                               │
    ▼                               │
┌──────────────┐                    │
│ SheetJS Parse │                   │
│ (in-browser)  │                   │
└──────┬───────┘                    │
       │                            │
       ▼                            │
┌──────────────┐                    │
│ CelebInput[] │                    │
│              │                    │
│ ┌──────────┐ │     Wikipedia      │     Gemini API
│ │ Celeb 1  │─┼──▶  REST API ──▶  Bio 1 ──┐
│ ├──────────┤ │                            │   ┌────────────┐
│ │ Celeb 2  │─┼──▶  REST API ──▶  Bio 2 ──┼──▶│ Build      │
│ ├──────────┤ │                            │   │ Prompt +   │──▶ Tweets[]
│ │ Celeb 3  │─┼──▶  REST API ──▶  Bio 3 ──┘   │ Call LLM   │
│ └──────────┘ │                                └────────────┘
└──────────────┘                                     │
                                                     ▼
                                              ┌─────────────┐
                                              │ Output Excel │
                                              │ Generated    │
                                              │ in-browser   │
                                              │ via SheetJS  │
                                              └──────┬──────┘
                                                     │
                                                     ▼
                                              ┌─────────────┐
                                              │  Download    │
                                              │  .xlsx file  │
                                              └─────────────┘
```

---

## File Structure

```
prify/
├── index.html                    # Single page app entry
├── assets/
│   ├── css/
│   │   └── styles.css            # All styles (CSS variables + responsive)
│   ├── js/
│   │   ├── app.js                # Main app initialization & event wiring
│   │   ├── services/
│   │   │   ├── excelService.js   # Parse input + generate output Excel
│   │   │   ├── wikiService.js    # Fetch celeb bio from Wikipedia API
│   │   │   ├── geminiService.js  # Call Gemini API for tweet generation
│   │   │   └── orchestrator.js   # Orchestrate full pipeline per celeb
│   │   ├── ui/
│   │   │   ├── formHandler.js    # Form validation & submission
│   │   │   ├── progressUI.js     # Progress bar & status log updates
│   │   │   └── resultsUI.js      # Render results table & download btn
│   │   └── utils/
│   │       ├── validators.js     # Input validation functions
│   │       ├── helpers.js        # Generic utility functions
│   │       └── storage.js        # localStorage wrapper for API key
├── docs/
│   ├── DESIGN_PLAN.md
│   ├── ARCHITECTURE.md
│   └── SETUP.md
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       └── deploy.yml
├── .vscode/
│   └── settings.json
├── .cursorrules
├── README.md
└── LICENSE
```

---

## External Dependencies (CDN)

| Library | Version | Purpose |
|---|---|---|
| SheetJS (xlsx) | 0.18.5 | Excel parse/generate in browser |

No npm, no build step, no bundler. Pure browser ES modules.

---

## Browser Storage

| Key | Storage | Purpose |
|---|---|---|
| `prify_gemini_key` | localStorage | User's Gemini API key (persisted) |
| (future) Campaign history | localStorage/IndexedDB | Past campaign data |

---

## API Rate Limiting Strategy

- Process celebrities **sequentially** (not parallel)
- **800ms delay** between Gemini API calls
- Wikipedia calls: **200ms delay** between each
- If rate limited (429): exponential backoff with 3 retries
- Show live progress: "Processing 3/10: Shah Rukh Khan..."

---

## Security Considerations

| Concern | Mitigation |
|---|---|
| API key exposure | Stored only in localStorage, never leaves browser |
| XSS via Excel data | All user content is textContent (not innerHTML) |
| CORS | Wikipedia API is CORS-friendly; Gemini API allows browser calls |
| Data privacy | Zero server-side storage; all processing is client-side |
