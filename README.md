# AutoGrant Landing Page

Grant automation for nonprofits — built inside the tools you already use.

## Project structure

```
├── index.html          Main page
├── css/styles.css      Styles
├── js/main.js          Interactivity (calculator, process tabs, scroll effects)
├── assets/
│   ├── demo.mp4        Climate Resolve workflow demo
│   └── team-photo.jpg  Team photo
└── slides/             Climate Resolve presentation slides (add your JPGs here)
    ├── climate-resolve-1.jpg
    ├── climate-resolve-2.jpg
    ├── climate-resolve-3.jpg
    └── climate-resolve-4.jpg
```

## Local preview

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

## Adding your presentation slides

Drop four images into `slides/` named:

- `climate-resolve-1.jpg`
- `climate-resolve-2.jpg`
- `climate-resolve-3.jpg`
- `climate-resolve-4.jpg`

The page tries `.jpg` first and falls back to the SVG placeholders until your files are added.

## Deploy

Works on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). No build step — just upload the folder or connect this repo.

For **GitHub Pages**: Settings → Pages → deploy from `main` branch, root directory.
