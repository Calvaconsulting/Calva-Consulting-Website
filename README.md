# Calva Consulting — website

A fast, single-page marketing site. No build step, no dependencies — just three files.

```
index.html    → structure & content
styles.css    → all styling (colors, type, layout)
script.js     → interactions (canvas, cursor, reveals, form)
```

## View it
Double-click `index.html`, or serve the folder:
```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Customize it (everything you need is marked `[EDIT]`)
Open `index.html` and search for `[EDIT]`. Each one is a placeholder:
- **Hero** — tagline summary, founding year, the three stats
- **Services** — the three service cards (titles, blurbs, bullets)
- **Work** — swap for real case studies / results
- **About** — your name, bio, photo, and facts (the bio is the most important paragraph)
- **Contact** — reply time and your real email address

### Brand colors
All colors live at the top of `styles.css` under `:root`:
```
--accent: #d8563a;   /* the vermilion — change this to reshape the whole vibe */
--pine:   #23433c;
--ink / --paper / ...
```

### Real photo
Replace the `.about__photo` placeholder block in `index.html` with an `<img>`.

### Wire up the contact form
It currently validates and shows a message but doesn't send. Point it at
[Formspree](https://formspree.io), a serverless function, or a `mailto:` — see the
comment in `script.js`.

## Notes
- Fonts (Fraunces + Inter) load from Google Fonts, so an internet connection is
  needed for the intended typography; there's a system-serif/sans fallback otherwise.
- Fully responsive, keyboard-accessible, and respects `prefers-reduced-motion`.
