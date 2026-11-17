# W.U.T.'s Cooking

**W.U.T. = What's Ur Type?**

A mobile-first meal-prep and recipe app (installable PWA). Tell it about yourself and your goals, and it builds a breakfast / lunch / dinner plan for a day, a week, a month or any number of days, with recipes, storage tips and a shopping list.

## Features
- **4 skippable setup screens** (each with Back and Skip): profile, food profile, goals, optional nutrition targets
- **Profile:** name, birthday, age, sex, height, weight (US or metric), ethnicity, blood type (incl. "I'm not sure"), allergies, diet and health conditions. Every question is a dropdown with an optional type-in box underneath, and a typed value wins over the dropdown
- **114 health conditions** in a grouped dropdown (heart, diabetes, digestive, thyroid, pregnancy, mental health and more) plus a type-in box. Celiac disease and lactose intolerance automatically exclude gluten and dairy
- **18 diet options** including "I'm not sure", vegan, vegetarian, pescatarian, keto, paleo, Mediterranean, gluten-free, dairy-free, halal, kosher and **Blood type diet**
- **Allergies are always a hard rule.** Pick from the list or type your own (e.g. kiwi)
- **Goals:** 8 body goals, vitamin & mineral boosts, 11 beauty & aesthetics goals, 19 wellness goals, and everyday-eating goals (quick meals, more plants, extra protein)
- **Nutrition targets are optional.** Leave calories, protein, carbs and fat blank and they're estimated from your profile; portions are sized to hit the target
- **Home:** meal of the day with calories, protein, carbs, fat, fiber and vitamin/mineral highlights; **Ate it** and **Add to favorites** buttons; today's intake ring; **Previous intake** log; **New plan** dropdown (1 day to 2 months, or custom days); **Add to Home Screen**
- **Recipes tab:** only your favorites and recipes you've added; add your own recipes
- **Recipe pages:** scaled ingredient amounts, step-by-step cooking, fridge/freezer storage and reheating
- **Shopping list:** for a day, a week or 2 weeks, with how much to buy and what kind, grouped by store section, with check-offs and copy-to-clipboard

## How it works
- `data.js`: ingredient catalog (nutrition, allergens, buying tips) and 27 recipes built from it
- `engine.js`: nutrition math, allergy/diet filtering, plan generation, shopping lists (no DOM code)
- `app.js`: the interface
- Everything is saved on the device in `localStorage`. There's no server and no account.

Calories, macros and vitamins are computed from the ingredient list, so they are approximate. This is general food inspiration, not medical advice. The blood type diet is a popular idea without strong scientific support, so it is only used as a soft preference.

## GitHub Pages
**Settings → Pages → Deploy from a branch → main → /(root)**. Installing to the Home Screen needs the https address GitHub Pages provides.

## Developing
Open `index.html` through any static server (e.g. `npx http-server`). A service worker caches the files for offline use. It fetches fresh files first, so changes show up on reload.
