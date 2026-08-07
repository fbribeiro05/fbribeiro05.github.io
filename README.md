# Deploying to GitHub Pages

This is a static site — plain HTML/CSS/JS, no build step, no dependencies.

## First-time setup

1. Create a new repository on GitHub (public, since GitHub Pages on the free
   plan requires a public repo unless you have GitHub Pro/Team).
2. From this folder, push everything to it:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, choose `main` and `/ (root)`, then **Save**.
6. Wait a minute or two, then your site will be live at:
   `https://<your-username>.github.io/<your-repo>/`

## Updating the site later

```bash
git add .
git commit -m "Update site"
git push
```

GitHub Pages redeploys automatically a minute or two after each push.

## Before going live — checklist

- [ ] Add real photos: `assets/images/hero.jpg` and anything in
      `assets/images/gallery/` you want to swap or add. Also identify the 3
      unused photos (`GPC_PHOTOS_NB-*.jpg`) if you want them in the gallery.
- [ ] Add a favicon and Open Graph image if you haven't already
      (`assets/images/favicon.png`, `assets/images/social-share.jpg` — both
      already in place, replace if you want different ones).
- [ ] Fill in the three payment placeholders directly in `index.html`,
      search for `FRANCISCO:` comments:
  - TWINT phone number (`#twint-number`)
  - Real IBAN + account holder name (`#iban`, `#account-holder`)
  - Real PayPal.me link (the `href="#"` on the PayPal button)
- [ ] Get a native speaker to proofread the German and Portuguese copy in
      `js/translations.js` (the `de` and `pt` objects).
- [ ] Double-check the GBP → CHF / EUR exchange rates in
      `js/translations.js` (`window.CURRENCY_CONFIG`) are current, and
      update the "as of [Month]" rate note text in the same file
      (`hero.rateNote` key, all four languages) to match.
- [ ] Update `window.CAMPAIGN.raisedGBP` in `js/translations.js` whenever
      the amount raised changes — the progress bar and stats read from
      this value.
- [ ] Confirm the testimonial trims still feel right (brief §5).
- [ ] Write real gallery captions if you want something more personal than
      "Show — Role, Year" (currently in `js/translations.js`, the
      `gallery.caption.*` keys).

## Local preview

No build step needed — just open `index.html` directly in a browser, or
serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
# fbribeiro05.github.io
