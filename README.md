# WordPress Developer Portfolio (Multi-page)

A professional, animated, and GitHub-hostable multi-page portfolio website built with plain HTML, CSS, and JavaScript.

## Pages included

- `index.html` (Home)
- `about.html` (About Me)
- `services.html` (Services)
- `projects.html` (Projects)
- `contact.html` (Contact Us)
- `toc.html` (Terms and Conditions)
- `privacy.html` (Privacy Policy)

## Local run

Open `index.html` directly in a browser, or use a local server:

```bash
# Python 3
python -m http.server 5500
```

Then visit `http://localhost:5500`.

## Customize quickly

- Update your name and brand text across pages
- Replace project cards with real company/client projects
- Update timeline, services, and contact details
- Replace contact email and location in `contact.html`
- Add your hero image as one of these names in `assets/`:
  - `profile.jpg` (recommended)
  - `profile.jpeg`
  - `profile.png`
  - `profile.webp`

## Enable contact form email (GitHub Pages)

This project includes a CTA form on `contact.html`.

1. Create a free form at [Formspree](https://formspree.io/).
2. Copy your endpoint URL (example: `https://formspree.io/f/abcxyzpq`).
3. In `contact.html`, set:
   - `data-formspree-endpoint="https://formspree.io/f/abcxyzpq"`
4. Deploy again to GitHub Pages.

After this, form submissions will be sent to your email inbox.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Push this folder content to the `main` branch.
3. In GitHub repo settings, go to **Pages**.
4. Set Source to **Deploy from a branch**.
5. Select `main` branch and `/ (root)` folder.
6. Save and wait 1-2 minutes for the URL.

## Performance notes

- No heavy framework runtime
- Uses `IntersectionObserver` and `requestAnimationFrame`
- Motion respects `prefers-reduced-motion`
- Minimal JS with GPU-friendly transforms
