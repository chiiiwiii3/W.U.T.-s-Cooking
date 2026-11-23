# W.U.T.'s Cooking

**W.U.T. = What's Ur Type?**

A mobile-first meal-prep and recipe app (installable PWA). Tell it about yourself and your goals, and it builds a breakfast / lunch / dinner plan for a day, a week, a month or any number of days, with recipes, storage tips and a shopping list.

## Features
- **Pregnancy & menstrual-cycle catering** (appears when you pick female): pregnancy by trimester, breastfeeding, trying to conceive, menopause, or your cycle phase. Add your last period date and each plan day follows your cycle automatically
- **13 short setup screens** (14 for female), one category each (basics, measurements, ethnicity & blood type, diet, allergies, health conditions, body goal, vitamins, minerals, beauty, wellness, everyday eating, targets). Every screen has Back and Skip, plus "Skip the rest and build my plan"
- **Profile:** name, birthday, age, sex, height, weight (US or metric), ethnicity, blood type (incl. "I'm not sure"), allergies, diet and health conditions. Height and weight are dropdowns; ethnicity and diet also have an optional type-in box, and a typed value wins over the dropdown
- **114 health conditions** in a grouped dropdown (heart, diabetes, digestive, thyroid, pregnancy, mental health and more) plus a type-in box. Celiac disease and lactose intolerance automatically exclude gluten and dairy
- **18 diet options** including "I'm not sure", vegan, vegetarian, pescatarian, keto, paleo, Mediterranean, gluten-free, dairy-free, halal, kosher and **Blood type diet**
- **Allergies are always a hard rule.** Pick from the list or type your own (e.g. kiwi)
- **Goals:** 8 body goals, boosts for all 14 vitamins, 13 minerals, omega-3 and fiber (exact % for 8 tracked nutrients, "good source" matching for the rest), 11 beauty & aesthetics goals, 19 wellness goals, and everyday-eating goals (quick meals, more plants, extra protein)
- **Nutrition targets are optional.** Leave calories, protein, carbs and fat blank and they're estimated from your profile; portions are sized to hit the target
- **Home:** meal of the day with calories, protein, carbs, fat, fiber and vitamin/mineral highlights; **Ate it** and **Add to favorites** buttons; today's intake ring; **Previous intake** log; **New plan** dropdown (1 day to 2 months, or custom days); **Add to Home Screen**
- **Swap any meal:** 🔄 Swap on Home and on every meal of every day in Plan gives a different safe meal for just that day, with Undo
- **Recipes tab:** only your favorites and recipes you've added; add your own recipes with photos or files (pictures are shrunk and stored on the device)
- **Getting Nutty tab 🥜:** 22 calculators (BMI, body fat, TDEE, macros, protein, water, calories burned, heart-rate zones, one-rep max, pace, sleep cycles, blood pressure, cholesterol, A1C, pregnancy, unit converter and more) with color charts, plus 10 reference charts. US or metric
- **Recipe pages:** scaled ingredient amounts, step-by-step cooking, fridge/freezer storage and reheating
- **Shopping list:** for a day, a week or 2 weeks, with how much to buy and what kind, grouped by store section, with check-offs and copy-to-clipboard

## How it works
- `data.js`: ingredient catalog (nutrition, allergens, buying tips) and the first 27 recipes
- `data2.js`: recipe pack 2 (more ingredients and 65 more recipes, 92 in total)
- `calc.js`: health calculators and reference charts (pure math)
- `nutty.js`: the Getting Nutty screen
- `engine.js`: nutrition math, allergy/diet filtering, plan generation, shopping lists (no DOM code)
- `app.js`: the interface
- Everything is saved on the device in `localStorage`. There's no server and no account.

Calories, macros and vitamins are computed from the ingredient list, so they are approximate. Ingredient values were checked against USDA FoodData Central (SR Legacy and Foundation records) in November 2026; a few entries (asparagus, shrimp, oils, tortilla, bread) rest on secondary pages or a judgment about which USDA record matches, and the vitamin/mineral "good source" tags use a 10% of Daily Value per 100 g cutoff. This is general food inspiration, not medical advice. The blood type diet is a popular idea without strong scientific support, so it is only used as a soft preference.

## GitHub Pages
**Settings → Pages → Deploy from a branch → main → /(root)**. Installing to the Home Screen needs the https address GitHub Pages provides.

## Developing
Open `index.html` through any static server (e.g. `npx http-server`). A service worker caches the files for offline use. It fetches fresh files first, so changes show up on reload.

## Legal, safety & privacy (in the app)
- **First-run acceptance screen** (18+ confirmation and agreement to the notice; re-asked whenever `WUT.LEGAL_VERSION` in `legal.js` is raised)
- **Terms, Privacy & Safety page** (`legal.js`): not medical advice, allergy limits, pregnancy/conditions/eating disorders/under-18, nutrition and calculator limits, diet labels (halal/kosher/blood type), cooking safety, privacy (data stays on the device; Google Fonts and GitHub Pages see IP addresses), user content, no warranty and limitation of liability
- Warnings next to the allergy and health-condition inputs, and a disclaimer + link in the Home and Profile footers

## Before you launch commercially
This text is a good-faith set of disclosures, **not legal advice, and it cannot guarantee you won't be sued**. Before charging money:
1. Have a lawyer review `legal.js` (Florida governing law is already written in; ask them about disclaimers, the liability limit and whether to add arbitration). **Fill in `W.OPERATOR_NAME`, `W.OPERATOR_ADDRESS` and `W.SUPPORT_EMAIL` at the top of `legal.js`**, then raise `W.LEGAL_VERSION` so everyone re-accepts.
   - Also in the app now: separate Privacy Policy page, Download my data / Reset everything, 18+ only (under-18 birthdays are blocked), weekly allergy re-confirmation, Report a problem, Share/Import recipe (text only, nothing is uploaded), system fonts only (no Google Fonts), credits and takedown contact. Run a screen-reader and contrast check before launch.
2. Add a real contact address for safety reports, and a way to report a bad or unsafe recipe.
3. If you add accounts, sync, analytics, payments or AI features, update the privacy section and get consent as required (GDPR, CCPA, Washington My Health My Data, etc.).
4. Get a registered dietitian to review the health-condition, pregnancy and cycle logic, and consider product-liability / professional-liability insurance.
5. Keep the USDA-based nutrition data cited, and re-check it when you add recipes.

## Security
See [SECURITY.md](SECURITY.md) for the protections built in (CSP, escaping, upload checks, optional PIN lock) and a GitHub account checklist.
