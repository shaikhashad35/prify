# PRify — Setup Guide

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A free Google Gemini API key
- That's it! No Node.js, no npm, no build tools needed.

---

## Getting Your Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — you'll paste it into PRify's UI

> **Free Tier Limits:** 15 requests/minute, 1 million tokens/day  
> This is plenty for processing 50-100 celebrities per session.

---

## Running Locally

### Option 1: Direct File Open
Simply open `index.html` in your browser. That's it!

> ⚠️ Some browsers block ES module imports from `file://`. If you see errors, use Option 2.

### Option 2: Local HTTP Server (Recommended)

Using Python (built into macOS/Linux):
```bash
cd prify/
python3 -m http.server 8080
# Open http://localhost:8080
```

Using Node.js (if installed):
```bash
npx serve .
# Open http://localhost:3000
```

Using VS Code:
- Install the **Live Server** extension
- Right-click `index.html` → "Open with Live Server"

---

## Deploying to GitHub Pages (Free Hosting)

### Step 1: Create GitHub Repository
```bash
cd prify/
git init
git add .
git commit -m "Initial commit - PRify v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prify.git
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repo on GitHub
2. **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / `/ (root)`
5. Click **Save**

### Step 3: Access Your Site
Your site will be live at:
```
https://YOUR_USERNAME.github.io/prify/
```

> Deployment takes 1-2 minutes. The included GitHub Actions workflow (`.github/workflows/deploy.yml`) handles this automatically on every push.

---

## Preparing Your Input Excel File

Create an `.xlsx` file with these columns:

| Name | Contact | Wikipedia Link |
|---|---|---|
| Shah Rukh Khan | srk@email.com | https://en.wikipedia.org/wiki/Shah_Rukh_Khan |
| Virat Kohli | virat@bcci.tv | https://en.wikipedia.org/wiki/Virat_Kohli |
| Priyanka Chopra | pc@email.com | https://en.wikipedia.org/wiki/Priyanka_Chopra |

### Column Name Flexibility
PRify accepts multiple header variations:
- **Name:** `Name`, `name`, `Celebrity Name`, `CelebName`
- **Contact:** `Contact`, `Email`, `Phone`, `Contact Info`
- **Wikipedia:** `Wikipedia Link`, `WikipediaLink`, `Wikipedia`, `Wiki`, `Wikipedia URL`

---

## Troubleshooting

| Issue | Solution |
|---|---|
| "CORS error" when opening file | Use a local HTTP server (see Option 2 above) |
| "Invalid API key" | Double-check your Gemini key at aistudio.google.com |
| Wikipedia fetch fails | Ensure the Wikipedia URL is a valid English Wikipedia link |
| Rate limit errors | Wait 60 seconds and try again with fewer celebrities |
| Excel not parsing | Ensure file is `.xlsx` format (not `.csv` or `.xls`) |
