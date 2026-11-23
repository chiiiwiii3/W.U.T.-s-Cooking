# Launch checklist

Not legal advice. Take this to a lawyer. Tick items off as you go.

## 1. Fill in the blanks (`legal.js`)
- [ ] `W.OPERATOR_NAME` (your business name)
- [ ] `W.OPERATOR_ADDRESS` (mailing address)
- [ ] `W.SUPPORT_EMAIL` (a monitored inbox)
- [ ] Raise `W.LEGAL_VERSION` so everyone re-accepts
- [ ] Re-read the Terms and Privacy Policy and check they still match what the app really does

## 2. Business and insurance
- [ ] Form an LLC (or similar) so claims go to the company
- [ ] Cyber liability and product/professional liability insurance
- [ ] Separate business bank account
- [ ] Trademark search for "W.U.T.'s Cooking" and "Getting Nutty"

## 3. Professional review
- [ ] Lawyer: Terms, liability limit, Florida governing law, arbitration question, privacy policy
- [ ] Registered dietitian: recipes, nutrition numbers, calculators, goal wording
- [ ] Allergist or food-safety reviewer: allergy logic and warnings
- [ ] Written sign-off from each, saved with the date

## 4. Accounts and access
- [ ] Two-factor on GitHub (authenticator or hardware key, not SMS) and recovery codes stored offline
- [ ] Two-factor on email, domain registrar and any host
- [ ] Branch protection on `main`, no force-push
- [ ] Secret scanning and private vulnerability reporting on
- [ ] HTTPS enforced in Pages settings
- [ ] Domain auto-renew on and registrar locked

## 5. Testing before launch
- [ ] Run all tests in the repo's test scripts
- [ ] Screen-reader test (VoiceOver and TalkBack) and color-contrast check
- [ ] Test on iPhone Safari, Android Chrome and desktop
- [ ] Free scan (Mozilla Observatory, WebPageTest)
- [ ] Ask someone outside the project to try to break it

## 6. Marketing and claims
- [ ] No "allergy-safe", "cures", "treats", "doctor-approved" or similar
- [ ] No fake or unverified reviews. Disclose paid or free-product endorsements
- [ ] Don't market to anyone under 18
- [ ] Only use images and recipe text you own or have a license for
- [ ] Keep the "not medical advice" and FDA lines visible

## 7. If you add any of these later, stop and get advice first
- [ ] Accounts or cloud sync
- [ ] Analytics, ads, crash reporting or any third-party script
- [ ] Payments or subscriptions (tax/VAT, cancellation rules, store rules)
- [ ] Anything that sends health data off the device

## 8. After launch (monthly)
- [ ] Read every report from "Report a problem" and log it (see `INCIDENT_RESPONSE.md`)
- [ ] Re-check USDA-based data and recipes you changed
- [ ] Review GitHub access list and security alerts
- [ ] Re-confirm legal text still matches the app
