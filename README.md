# Sticky Notes Company Dashboard

Simple GitHub Pages website that turns daily OpenClaw company-report output into clickable sticky notes.

## Files
- `index.html` — page structure
- `style.css` — sticky note layout and styling
- `script.js` — loads the JSON and renders notes/details
- `data/companies.json` — the company data source

## How it works
The page fetches `data/companies.json` and creates one sticky note per company.
Clicking a note opens the details panel.

## How to update it each day
Your OpenClaw flow only needs to overwrite `data/companies.json` with new companies.

Each company should look like this:

```json
{
  "id": "unique-id",
  "name": "Company Name",
  "sector": "AI",
  "summary": "One short useful summary.",
  "round": "Seed",
  "amount": "$4M",
  "location": "Calgary, Canada",
  "reportDate": "2026-03-15",
  "color": "yellow",
  "notes": "Extra notes from OpenClaw.",
  "links": [
    { "label": "Company site", "url": "https://example.com" },
    { "label": "Article", "url": "https://example.com/article" }
  ]
}
```

## GitHub Pages setup
1. Create a GitHub repo.
2. Upload all files.
3. Go to repo **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the main branch and root folder.
6. Save. GitHub will give you a live URL.

## Best simple automation
If OpenClaw is generating a report already, the easiest method is:
1. Have OpenClaw output a JSON array in this exact format.
2. Commit that JSON file into the repo each day.
3. GitHub Pages will show the newest notes.

## Important note
If you open `index.html` directly from your computer, the JSON fetch may fail in some browsers.
Use GitHub Pages or a local server.
