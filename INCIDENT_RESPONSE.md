# Incident and report handling

Not legal advice. Have your lawyer review this plan before launch.

## Roles
- **Owner:** decides, communicates, signs off on fixes.
- **Contact inbox:** the address in `W.SUPPORT_EMAIL`. Check it daily.
- Write down your lawyer's and insurer's phone numbers here: ______________

## A. Problem reports (allergen, wrong recipe, wrong numbers)
1. Log it within 1 business day in a private log (date, recipe ID, what was reported, who was told). Do not store the reporter's health details longer than needed.
2. **Allergen or safety report: act the same day.**
   - Check the recipe and ingredient data. Reproduce the problem.
   - If confirmed, remove or fix the recipe, push the fix and bump the cache version in `sw.js`.
   - If someone was hurt, tell your insurer and lawyer before replying in writing.
3. Reply to the reporter: thank them, say what you checked and what you changed. Do not admit fault or give medical advice. Tell them to see a doctor if they feel unwell.
4. Add a test so it can't come back. Record the fix and date in the log.
5. If several people are affected, post a notice in the app (a banner) and consider a re-acceptance by raising `W.LEGAL_VERSION`.

## B. Security incident (account takeover, defaced site, malicious code in the repo)
1. **Contain (first hour):**
   - Change the GitHub password, revoke all sessions, tokens and SSH keys, and re-enable two-factor.
   - Disable GitHub Pages (Settings, Pages) if the live site may be serving bad code.
   - Check recent commits and the Actions log. Revert to the last known good commit.
2. **Investigate:** what changed, when, and whether any user could have been exposed. Because the app has no server and stores data only on-device, a defaced page is the main risk. Look for injected scripts or links.
3. **Recover:** restore good code, redeploy, bump the cache version, re-enable Pages, and confirm the site loads clean in a private window.
4. **Notify (see C).**
5. **Learn:** note the cause and the fix, and update the checklist.

## C. If personal data may have been exposed
The app holds no user data on your side, so this is unlikely unless you later add accounts, sync or analytics. If it happens:
1. Call your lawyer and insurer immediately. Many policies require prompt notice.
2. Work out who is affected, which data, and where they live. Breach laws depend on location.
3. Typical deadlines (confirm with your lawyer): EU/UK GDPR notice to the regulator within **72 hours** of becoming aware; US state laws, including Florida (generally within 30 days to individuals), vary; health-data rules may be stricter.
4. Tell affected people in plain language: what happened, what data, what you did, what they should do, and how to reach you.
5. Keep a written record of the facts, decisions and timing.

## D. Legal or takedown requests
- Copyright or content complaint: acknowledge within 2 business days, review, remove if valid, keep a copy of the request.
- Government or regulator letter: do not reply alone. Send it to your lawyer the same day.
- Data requests from users (access, delete): the app already offers **Download my data** and **Reset everything**. Reply within 30 days confirming that no copy exists on your side.

## E. Incident log template
| Date | Type | Summary | Who was told | Action taken | Closed |
|------|------|---------|--------------|--------------|--------|
|      |      |         |              |              |        |
