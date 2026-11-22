/* W.U.T.'s Cooking — legal, safety and privacy text. Plain data so it can be reviewed and edited in one place.
   NOTE FOR THE OWNER: this is a good-faith disclosure set, not legal advice. Have a lawyer in your jurisdiction review it
   before charging money or launching widely (see README "Before you launch commercially"). */
(function (root) {
  "use strict";
  const W = (root.WUT = root.WUT || {});
  W.LEGAL_VERSION = 1;
  W.LEGAL_UPDATED = "November 2026";

  // Short version shown on the first-run screen and in the footer
  W.LEGAL_SHORT = [
    "W.U.T.'s Cooking gives general food ideas and nutrition estimates. It is <b>not medical advice</b> and does not replace a doctor, dietitian or allergist.",
    "<b>Allergies:</b> we try to leave out foods you list, but we cannot guarantee any meal is free of an allergen. Always read ingredient labels and check every recipe yourself.",
    "Nutrition numbers are <b>estimates</b>. Health calculators are for learning, not diagnosis.",
    "If you are pregnant or breastfeeding, have a medical condition, take medicine, have a history of an eating disorder, or are under 18, talk to a qualified professional before changing how you eat."
  ];

  // Full terms: [heading, [paragraphs or "- bullet" lines]]
  W.LEGAL_SECTIONS = [
    ["Not medical advice", [
      "W.U.T.'s Cooking (the \"App\") is for general information and meal inspiration only. It is not medical, nutritional, dietetic, pharmaceutical or other professional advice, and it does not create a doctor-patient, dietitian-client or any other professional relationship.",
      "Nothing in the App is a diagnosis, treatment, cure or prevention of any disease or condition. Do not ignore professional advice, or delay getting it, because of something you saw in the App.",
      "Always talk to a qualified healthcare professional before making changes to your diet, especially if you have a health condition, take medication, are pregnant, breastfeeding or trying to conceive, are under 18 or over 65, have kidney, liver, heart or blood-sugar conditions, or have ever had an eating disorder.",
      "In an emergency, call your local emergency number right away. Do not use the App for emergencies."
    ]],
    ["Allergies and food safety", [
      "The App tries to leave out ingredients and common allergens you select or type. <b>It cannot guarantee that any recipe, ingredient or meal is free of any allergen.</b>",
      "- Ingredient lists, brands and manufacturing processes change. Packaged foods may contain hidden ingredients or traces from cross-contact. Always read the label of every product you buy.",
      "- Allergen detection depends on the words in the ingredient list. It can miss an ingredient that is named in an unexpected way, and it cannot read photos or files you upload.",
      "- Recipes you add yourself are checked only by the text you type. Recipes with only a photo or file are not checked at all.",
      "- If you have a severe allergy, intolerance, celiac disease or have ever had anaphylaxis, speak with an allergist or doctor, and follow your own emergency plan. Never rely on this App alone.",
      "You are responsible for deciding whether a meal is safe for you and for anyone you cook for."
    ]],
    ["Health conditions, pregnancy, cycle and special groups", [
      "Choices about health conditions, pregnancy, breastfeeding, menstrual cycle, menopause, age and goals only adjust which general foods are suggested. They are not personalised medical or dietary prescriptions.",
      "- <b>Pregnancy and breastfeeding:</b> food safety and nutrient needs are specific to you. Follow your doctor or midwife. Avoiding certain foods in the App is a preference, not a complete or guaranteed safe list.",
      "- <b>Diabetes, kidney, liver, heart, thyroid, digestive and other conditions:</b> the App does not manage these conditions or replace your care plan. Some foods interact with medicine (for example vitamin K and blood thinners, or potassium with kidney disease and some blood-pressure medicines).",
      "- <b>Eating disorders:</b> if you have a history of one, or feel distressed about food, weight or calories, please talk to your care team before using calorie, macro or weight-related features.",
      "- <b>Under 18:</b> the App is for adults aged 18 or over. If you are younger, please use it only with a parent, guardian or doctor.",
      "The App does not recommend supplements, and vitamin and mineral \"boosts\" only mean the App favors foods that are good sources. Do not take high-dose supplements without medical advice."
    ]],
    ["Nutrition numbers and calculators", [
      "Calories, macros, vitamins and minerals are estimates calculated from average food data, mainly from USDA FoodData Central. Real foods vary by brand, season, ripeness, cooking method and portion size. Weights shown are raw or dry unless stated.",
      "Some values (and the \"good source\" labels for nutrients that don't have exact amounts) are approximations or judgment calls and may contain errors. Daily Values follow US FDA labeling references and may not match the guidance in your country.",
      "The Getting Nutty tab (BMI, body fat, calorie, macro, heart-rate, blood-pressure, cholesterol, blood-sugar, pregnancy and other calculators, charts and converters) is for education and general information. These tools use population-level formulas and cannot account for your individual situation. BMI and similar measures can be misleading for athletes, older adults, pregnant people, children and people of different ethnic backgrounds. Results are not a diagnosis. Please discuss any health reading with a doctor."
    ]],
    ["Diets and labels", [
      "- Diet choices such as vegan, vegetarian, pescatarian, keto, paleo, gluten-free, dairy-free, halal, kosher and others are general filters based on ingredient lists. They are <b>not certifications</b>. Halal and kosher also depend on how food is sourced and prepared; always buy certified products if that matters to you. Some products contain trace alcohol or animal-derived ingredients that the App cannot detect.",
      "- The <b>blood type diet</b> is a popular idea that lacks strong scientific support. It is used only as a soft preference and should not be treated as health advice.",
      "- \"Gluten-free\" in the App is not a guarantee for people with celiac disease. Check labels and certification."
    ]],
    ["Cooking, storage and kitchen safety", [
      "Cooking, handling and storage tips are general guidance. Follow food-safety rules from your local authority. Typical guidance: cook poultry and ground turkey to 165 °F (74 °C), ground beef to 160 °F (71 °C), fish and whole cuts of meat to 145 °F (63 °C), and eggs until the whites and yolks are firm; refrigerate cooked food within 2 hours; reheat leftovers until steaming hot; when in doubt, throw it out.",
      "Storage times are estimates, not guarantees. Stay safe around heat, knives, hot oil and appliances. Wash hands and surfaces, and keep raw meat, fish and eggs away from ready-to-eat food. People who are pregnant, elderly, very young or have weak immune systems are at higher risk from foodborne illness."
    ]],
    ["Your data and privacy", [
      "- Your profile, health details, goals, plans, food log, favorites, recipes and any photos or files you add are saved <b>only in your own browser or device</b> (local storage). The App does not have accounts and does not send this information to us or to any server we control.",
      "- Because it is stored on your device, clearing your browser data, uninstalling the app or using a private window can erase it, and anyone who uses your device may see it. Please don't enter anything you aren't comfortable having on your device.",
      "- The App loads fonts from Google Fonts, and it is hosted on GitHub Pages. Those services may receive technical information such as your IP address and browser type when the page loads, under their own privacy policies.",
      "- We do not sell your data and do not run ads or analytics in the App. If we add accounts, sync or analytics in the future, we will update this notice and ask for your consent where required.",
      "- You can delete everything at any time from Profile, then Reset everything."
    ]],
    ["Your recipes and content", [
      "Recipes, photos and files you add are your responsibility. Don't upload anything you don't have the right to use, or anything unlawful, harmful or private about other people. We don't review or verify them."
    ]],
    ["No warranty and limits on liability", [
      "To the fullest extent permitted by law, the App and everything in it are provided \"as is\" and \"as available\", without warranties of any kind, express or implied, including accuracy, completeness, fitness for a particular purpose, safety or non-infringement. We don't promise that the App will be error-free, uninterrupted, or that it will meet your needs or health goals.",
      "To the fullest extent permitted by law, the creators, owners and contributors of the App will not be liable for any injury, illness, allergic reaction, loss, damage or expense (direct, indirect, incidental, special, consequential or otherwise) that comes from using the App or relying on it, including any meal, ingredient, nutrition figure, calculator result or suggestion.",
      "By using the App you accept that you use it at your own risk and that you are responsible for your own decisions. Some places don't allow certain limits or exclusions, so parts of this section may not apply to you, and nothing here limits rights that cannot be limited under the law where you live."
    ]],
    ["Changes", [
      "We may change the App and this notice. If the changes are important, we'll ask you to review and accept them again. Continuing to use the App after a change means you accept the updated notice."
    ]]
  ];
})(globalThis);
