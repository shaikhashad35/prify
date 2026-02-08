# PRify — Design Plan

## 1. Product Overview

**PRify** is a pure frontend platform for PR agencies to generate personalized, celebrity-specific PR tweets at scale. Instead of sending the same copy-paste message to every celebrity (which audiences easily spot as a PR stunt), PRify crafts unique tweets tailored to each celebrity's public persona using AI.

**Hosted on GitHub Pages — zero backend, zero cost.**

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Vanilla HTML5 + CSS3 + JavaScript (ES Modules) | Zero build step, instant deploy |
| **Excel Parsing** | SheetJS (xlsx) via CDN | Parse & generate Excel in-browser |
| **Wikipedia Data** | Wikipedia REST API | Free, no auth needed, CORS-friendly |
| **LLM / AI** | Google Gemini API (free tier) | User provides their own API key |
| **Hosting** | GitHub Pages | Free, automatic deploys |
| **Styling** | Custom CSS + CSS Variables | Lightweight, no framework overhead |

---

## 3. User Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PR AGENCY USER FLOW                         │
│                                                                     │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────────────────┐  │
│  │  STEP 1   │    │    STEP 2     │    │        STEP 3            │  │
│  │  Enter    │───▶│  Upload       │───▶│  Enter PR Agenda         │  │
│  │  Gemini   │    │  Excel File   │    │  Text                    │  │
│  │  API Key  │    │              │    │                          │  │
│  └──────────┘    └──────────────┘    └────────────┬─────────────┘  │
│                                                    │                │
│                                                    ▼                │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────────────────┐  │
│  │  STEP 6   │    │    STEP 5     │    │        STEP 4            │  │
│  │  Download │◀───│  Review       │◀───│  System processes        │  │
│  │  Output   │    │  Results on   │    │  each celeb:             │  │
│  │  Excel    │    │  Screen       │    │  Wikipedia → Gemini      │  │
│  └──────────┘    └──────────────┘    └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Input / Output Spec

### 4.1 Input Excel Format

| Column | Required | Example |
|---|---|---|
| Name | ✅ | `Shah Rukh Khan` |
| Contact | ✅ | `srk@email.com` or `+91-9999999999` |
| Wikipedia Link | ✅ | `https://en.wikipedia.org/wiki/Shah_Rukh_Khan` |

### 4.2 Input PR Agenda (Text Field)

> *"Promote the upcoming clean water initiative by XYZ Foundation launching on March 15. Highlight the importance of clean drinking water in rural India."*

### 4.3 Output Excel Format

| Name | Contact | Wikipedia Link | Generated Tweet | Status |
|---|---|---|---|---|
| Shah Rukh Khan | srk@email.com | (link) | *"As someone who grew up in Delhi..."* | ✅ Success |
| Virat Kohli | virat@email.com | (link) | *"Discipline on the field taught me..."* | ✅ Success |

---

## 5. API Integrations

### 5.1 Wikipedia REST API (No Auth)
```
GET https://en.wikipedia.org/api/rest_v1/page/summary/{title}
```
- Free, no API key needed
- CORS-friendly
- Returns: title, extract (summary), description

### 5.2 Google Gemini API (User's Key)
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}
```
- User enters their own free API key
- Key stored in browser localStorage (never sent to any server)
- Free tier: 15 RPM, 1M tokens/day

---

## 6. Prompt Engineering Strategy

```
SYSTEM: You are a PR copywriting specialist who writes authentic
        social media posts for celebrities.

USER:
  Celebrity: {name}
  Background: {wikipedia_summary}
  Description: {wikipedia_description}
  PR Agenda: {agenda}

  Instructions:
  1. Write a tweet (≤ 280 chars) promoting the agenda
  2. Sound like {name} naturally wrote it
  3. Reference specific details from their background
  4. Avoid PR clichés like "excited to announce"
  5. Include 1-2 natural hashtags
  6. Return ONLY the tweet text
```

---

## 7. Error Handling

| Scenario | Handling |
|---|---|
| No file uploaded | Show validation error |
| Wrong file format | Show "Only .xlsx supported" |
| Missing columns | Show which columns are missing |
| Empty PR agenda | Show validation error |
| Wikipedia fetch fails | Use fallback: search by name, or generic bio |
| Gemini API fails | Show error per celebrity, allow retry |
| Invalid API key | Show clear error message |
| Rate limit hit | Process sequentially with delay |

---

## 8. Security

- **API Key**: Stored only in browser localStorage, never transmitted to any third party
- **No Backend**: All processing happens client-side
- **No Data Storage**: Nothing is stored on any server
- **Excel Files**: Processed entirely in-browser, never uploaded anywhere

---

## 9. Future Scope (v2+)

| Feature | Description |
|---|---|
| Celebrity Onboarding | Celeb profiles stored in IndexedDB |
| Campaign History | Track past campaigns in localStorage |
| Tone Customization | Formal, casual, humorous presets |
| Multi-platform | Instagram, LinkedIn, not just Twitter |
| Template Library | Save & reuse prompt templates |
| Bulk Retry | Retry failed celebrities only |
| Dark Mode | Theme toggle |
| PWA Support | Installable as desktop app |
