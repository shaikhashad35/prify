# 🚀 PRify

**AI-powered PR tweet generator — personalized celebrity messaging**

PRify helps PR agencies generate authentic, personalized tweets for celebrities. Instead of sending generic copy-paste messages (which audiences easily spot as PR stunts), PRify crafts unique tweets tailored to each celebrity's persona using their Wikipedia profile + Google Gemini AI.

---

## ✨ How It Works

1. **Enter** your free Google Gemini API key
2. **Upload** an Excel file with celebrity names, contacts & Wikipedia links
3. **Write** your PR agenda (what you want to promote)
4. **Click Generate** — PRify fetches each celeb's bio from Wikipedia and crafts a personalized tweet using AI
5. **Download** the output Excel with a "Message" column — ready to send!

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 + CSS3 + JavaScript (ES Modules) |
| Excel Parsing | SheetJS (xlsx) via CDN |
| Wikipedia Data | Wikipedia REST API (free, no auth) |
| AI / LLM | Google Gemini API (free tier) |
| Hosting | GitHub Pages (free) |

**Zero backend. Zero build step. Zero cost.**

---

## 📋 Input Excel Format

| Name | Contact | Wikipedia Link |
|---|---|---|
| Shah Rukh Khan | srk@email.com | https://en.wikipedia.org/wiki/Shah_Rukh_Khan |
| Virat Kohli | virat@bcci.tv | https://en.wikipedia.org/wiki/Virat_Kohli |

---

## 🚀 Quick Start

### Run Locally
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/prify.git
cd prify

# Start a local server (pick one)
python3 -m http.server 8080        # Python
npx serve .                         # Node.js
# Or use VS Code Live Server extension
```

Open `http://localhost:8080` in your browser.

### Get Gemini API Key (Free)
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Paste it into PRify's UI

---

## 📖 Documentation

| Document | Description |
|---|---|
| [Design Plan](docs/DESIGN_PLAN.md) | Product design, user flows, specs |
| [Architecture](docs/ARCHITECTURE.md) | System architecture, data flow, file structure |
| [Setup Guide](docs/SETUP.md) | Local dev, deployment, troubleshooting |

---

## 🔒 Privacy & Security

- **Your API key** stays in your browser's localStorage — never sent to any server
- **Your data** is processed entirely client-side — nothing is uploaded anywhere
- **No backend, no database, no tracking**

---

## 🗺️ Roadmap

- [ ] Celebrity onboarding & profile management
- [ ] Campaign history & tracking
- [ ] Tone customization (formal, casual, humorous)
- [ ] Multi-platform support (Instagram, LinkedIn)
- [ ] Billing & agency plans
- [ ] Dark mode
- [ ] PWA support

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file.
