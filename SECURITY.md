# Security

W.U.T.'s Cooking is a static web app. It has no server, accounts or database. Everything a user enters stays in their own browser.

## Built-in protections
- Content Security Policy (in `index.html`): only the app's own scripts run, nothing loads from other sites, no plugins, no form posts.
- No third-party scripts, fonts, analytics or trackers. Referrer is not sent.
- All user text is escaped before it is shown. Stored files are re-checked on load (allowed types only, well-formed data URLs). Imported shared recipes are length-limited and text-only.
- Clickjacking guard: the app breaks out of, or hides itself inside, other sites' frames.
- Prototype-pollution guard when reading saved data.
- Optional PIN app lock (PBKDF2-SHA-256, salted, 150k iterations, with lockout after 5 wrong tries). It hides the app on a shared or lost phone. It does **not** encrypt stored data.
- Service worker caches only same-origin, successful responses.

## Reporting a vulnerability
Email the address set in `W.SUPPORT_EMAIL` (`legal.js`), or use "Report a problem" in the app. Please give us reasonable time to fix before you share details publicly.

## Owner checklist (GitHub)
- Turn on two-factor authentication for the GitHub account.
- Branch protection on `main`, and require pull requests if others contribute.
- Enable Secret scanning and Private vulnerability reporting (Settings, Security).
- Enforce HTTPS in Settings, Pages.
- Never commit API keys. If you later add a backend, keep secrets on the server only.
