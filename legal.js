/* W.U.T.'s Cooking — legal, safety and privacy text. Plain data so it can be reviewed and edited in one place.
   NOTE FOR THE OWNER: this is a good-faith disclosure set, not legal advice. Have a lawyer in your jurisdiction review it
   before charging money or launching widely (see README "Before you launch commercially"). */
(function (root) {
  "use strict";
  const W = (root.WUT = root.WUT || {});
  W.LEGAL_VERSION = 2;
  // OWNER: put your support address here (e.g. "safety@yourdomain.com"). While it is empty the Report form
  // lets people copy their report instead of emailing it.
  W.SUPPORT_EMAIL = "";
  W.LEGAL_UPDATED = "November 2026";
  // OWNER: fill these in before launch. They appear in the Terms and Privacy Policy.
  W.OPERATOR_NAME = "";      // e.g. "Your Name LLC"
  W.OPERATOR_ADDRESS = "";   // mailing address (many laws require one)
  W.GOVERNING_STATE = "Florida";
  const who = () => W.OPERATOR_NAME || "the owner of W.U.T.'s Cooking";
  const contact = () => W.SUPPORT_EMAIL ? `<b>${W.SUPPORT_EMAIL}</b>` : "the <b>Report a problem</b> button in the App";

  // Short version shown on the first-run screen and in the footer
  W.LEGAL_SHORT = [
    "W.U.T.'s Cooking gives general food ideas and nutrition estimates. It is <b>not medical advice</b> and does not replace a doctor, dietitian or allergist.",
    "<b>Allergies:</b> we try to leave out foods you list, but we cannot guarantee any meal is free of an allergen. Always read ingredient labels and check every recipe yourself.",
    "Nutrition numbers are <b>estimates</b>. Health calculators are for learning, not diagnosis.",
    "<b>You must be 18 or older to use this App.</b>",
    "If you are pregnant or breastfeeding, have a medical condition, take medicine, or have a history of an eating disorder, talk to a qualified professional before changing how you eat.",
    "Food suggestions are not intended to diagnose, treat, cure or prevent any disease. These statements have not been evaluated by the US Food and Drug Administration."
  ];

  // Full terms: [heading, [paragraphs or "- bullet" lines]]
  const SECS = [
    ["Who we are and who may use the App", [
      "W.U.T.'s Cooking (the \"App\") is provided by " + "${WHO}" + ". Contact: ${CONTACT}.",
      "<b>You must be at least 18 years old to use the App.</b> It is not directed to children, and we do not knowingly allow anyone under 18 to use it. If you are under 18, please do not use the App. If you entered the wrong birthday, you can correct it. If you are a parent or guardian and believe a minor is using the App, please contact us or erase the App's data from their device (Profile, then Reset everything)."
    ]],
    ["Not medical advice", [
      "W.U.T.'s Cooking (the \"App\") is for general information and meal inspiration only. It is not medical, nutritional, dietetic, pharmaceutical or other professional advice, and it does not create a doctor-patient, dietitian-client or any other professional relationship.",
      "Nothing in the App is a diagnosis, treatment, cure or prevention of any disease or condition. Do not ignore professional advice, or delay getting it, because of something you saw in the App.",
      "Always talk to a qualified healthcare professional before making changes to your diet, especially if you have a health condition, take medication, are pregnant, breastfeeding or trying to conceive, are over 65, have kidney, liver, heart or blood-sugar conditions, or have ever had an eating disorder.",
      "In an emergency, call your local emergency number right away. Do not use the App for emergencies."
    ]],
    ["Allergies and food safety", [
      "The App tries to leave out ingredients and common allergens you select or type. <b>It cannot guarantee that any recipe, ingredient or meal is free of any allergen.</b>",
      "- Ingredient lists, brands and manufacturing processes change. Packaged foods may contain hidden ingredients or traces from cross-contact. Always read the label of every product you buy.",
      "- Allergen detection depends on the words in the ingredient list. It can miss an ingredient that is named in an unexpected way, and it cannot read photos or files you upload.",
      "- Recipes you add yourself are checked only by the text you type. Recipes with only a photo or file are not checked at all.",
      "- If you have a severe allergy, intolerance, celiac disease or have ever had anaphylaxis, speak with an allergist or doctor, and follow your own emergency plan. Never rely on this App alone.",
      "- The App asks you to confirm your allergy list once a week and shows an allergy reminder on your meals. Please keep your list up to date. The App only knows what you tell it.",
      "You are responsible for deciding whether a meal is safe for you and for anyone you cook for."
    ]],
    ["Health conditions, pregnancy, cycle and special groups", [
      "Choices about health conditions, pregnancy, breastfeeding, menstrual cycle, menopause, age and goals only adjust which general foods are suggested. They are not personalised medical or dietary prescriptions.",
      "- <b>Pregnancy and breastfeeding:</b> food safety and nutrient needs are specific to you. Follow your doctor or midwife. Avoiding certain foods in the App is a preference, not a complete or guaranteed safe list.",
      "- <b>Diabetes, kidney, liver, heart, thyroid, digestive and other conditions:</b> the App does not manage these conditions or replace your care plan. Some foods interact with medicine (for example vitamin K and blood thinners, or potassium with kidney disease and some blood-pressure medicines).",
      "- <b>Eating disorders:</b> if you have a history of one, or feel distressed about food, weight or calories, please talk to your care team before using calorie, macro or weight-related features.",
      "- <b>Under 18:</b> the App is for adults aged 18 or over and is not meant for children or teens, who have different nutrition needs.",
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
      "The short version: your information stays on your own device. We have no accounts, no servers that receive your data, no ads and no analytics. Read the full <b>Privacy Policy</b> (linked at the bottom of this page) for details and your rights."
    ]],
    ["Your recipes, sharing and content", [
      "Recipes, photos and files you add are your responsibility and stay on your device. We do not host, review or verify them. Do not add anything you do not have the right to use, or anything unlawful, harmful, defamatory or private about other people.",
      "You keep ownership of what you add. The App needs only to store and display it on your device, and you give us no other license because we never receive it.",
      "<b>Sharing:</b> the Share recipe button creates text that you send yourself through your own apps. Nothing is uploaded to us. Once you share something, we cannot take it back, and anyone you send it to can copy it. Shared recipes may carry mistakes or allergens. A recipe you receive from someone else is not reviewed by us and is checked for allergens only by the words in its ingredient list."
    ]],
    ["Health statements", [
      "Statements about foods and nutrients (for example \"foods for skin health\" or \"immune-supporting nutrients\") describe general roles of nutrients and are not claims that any food or the App will treat, cure, prevent or improve any condition or give any result. These statements have not been evaluated by the US Food and Drug Administration. Results differ from person to person."
    ]],
    ["Credits, copyright and takedowns", [
      "© 2026 ${WHO}. All rights reserved. The recipes, text, design and code in the App were created for the App. \"W.U.T.'s Cooking\" and \"Getting Nutty\" are names used by the App's owner.",
      "Food composition data comes from, and is adapted from, the US Department of Agriculture's FoodData Central, a public-domain resource, and from standard public health references. The App does not use third-party fonts, trackers or advertising.",
      "If you believe something in the App infringes your copyright or other rights, or you want something removed, contact ${CONTACT} with what it is, where you saw it and why. We will review it promptly and remove it where appropriate."
    ]],
    ["No warranty and limits on liability", [
      "To the fullest extent permitted by law, the App and everything in it are provided \"as is\" and \"as available\", without warranties of any kind, express or implied, including accuracy, completeness, fitness for a particular purpose, safety or non-infringement. We don't promise that the App will be error-free, uninterrupted, or that it will meet your needs or health goals.",
      "To the fullest extent permitted by law, the creators, owners and contributors of the App will not be liable for any injury, illness, allergic reaction, loss, damage or expense (direct, indirect, incidental, special, consequential or otherwise) that comes from using the App or relying on it, including any meal, ingredient, nutrition figure, calculator result or suggestion.",
      "By using the App you accept that you use it at your own risk and that you are responsible for your own decisions. Some places don't allow certain limits or exclusions, so parts of this section may not apply to you, and nothing here limits rights that cannot be limited under the law where you live."
    ]],
    ["Reporting a problem", [
      "If you think a recipe, ingredient, allergen note or nutrition figure is wrong or unsafe, please use the <b>Report a problem</b> button on the recipe page or in this notice. Reports go only where you choose to send them, and you decide whether to include your allergies and diet.",
      "A report is not an emergency line. If someone is having an allergic reaction or feels seriously unwell, call your local emergency number first."
    ]],
    ["Governing law and disputes", [
      "These terms are governed by the laws of the State of ${STATE}, USA, without regard to its conflict-of-law rules. You and we agree that any dispute that cannot be settled informally will be brought only in the state or federal courts located in ${STATE}, and you consent to those courts' jurisdiction, except where the law of the place you live gives you the right to bring a claim in your home courts or gives you rights that cannot be waived.",
      "Please contact us first and give us a chance to fix the problem before starting any legal action. If a court finds part of these terms unenforceable, the rest stays in effect."
    ]],
    ["Changes", [
      "We may change the App and this notice. If the changes are important, we'll ask you to review and accept them again. Continuing to use the App after a change means you accept the updated notice."
    ]]
  ];
  const fill = (t) => t.replace(/\$\{WHO\}/g, who()).replace(/\$\{CONTACT\}/g, contact()).replace(/\$\{STATE\}/g, W.GOVERNING_STATE);
  W.LEGAL_SECTIONS = SECS.map(([h, ps]) => [h, ps.map(fill)]);

  // ---- Privacy Policy (own page) ----
  const PRIV = [
    ["Summary", [
      "W.U.T.'s Cooking has no accounts and no servers that receive your information. What you enter stays in <b>your own browser or device</b>. We do not sell, share or rent personal information, and we run no ads, analytics, tracking cookies or third-party fonts.",
      "Provider: ${WHO}.${ADDR} Contact: ${CONTACT}. Last updated ${UPDATED}."
    ]],
    ["What the App stores on your device", [
      "- Profile details you choose to enter: name, birthday or age, sex, diet, allergies, health conditions, pregnancy or menstrual-cycle details, body measurements, goals and preferences.",
      "- Your meal plans, favorites, food log, shopping list, recipes you add, any photos or files you attach, and your Getting Nutty entries.",
      "- Some of this is <b>health information</b>, which many laws treat as sensitive. You choose whether to enter it, and everything is optional. By entering it, you choose to have it stored on your device so the App can work.",
      "- It is held in your browser's local storage on your device, not sent to us."
    ]],
    ["Who can see it", [
      "- <b>Only people with access to your device or browser.</b> Please protect your device with a passcode. Private windows, clearing site data or uninstalling can erase your data, and we cannot recover it.",
      "- <b>Hosting.</b> The App is delivered from GitHub Pages. When you load or update it, GitHub may receive technical data such as your IP address, browser type and the pages requested, under GitHub's own privacy statement. We do not receive your profile or any of the information above.",
      "- <b>Reports and emails you send.</b> If you use Report a problem or share a recipe, only what you choose to send goes where you choose to send it. A report may include your allergies and diet only if you tick the box. We use reports to respond and to fix problems, and keep them only as long as needed.",
      "- We do not use automated decision-making or profiling."
    ]],
    ["Your choices and rights", [
      "- <b>Access and portability:</b> Profile, then <b>Download my data</b> gives you a copy of everything the App holds, as a file.",
      "- <b>Correction:</b> change anything in Profile at any time.",
      "- <b>Deletion:</b> Profile, then <b>Reset everything</b> erases it from your device. Because we never receive your data, there is nothing for us to delete on our side.",
      "- <b>Withdraw consent:</b> stop using the App or erase your data at any time.",
      "- <b>If you are in the EU, UK or similar:</b> you have rights to access, correct, erase, restrict, object to and move your data, and to complain to your data-protection authority. Where we handle data at all, our basis is your consent (for health information) and our legitimate interest in running a safe App (for reports and hosting logs).",
      "- <b>If you are in California or another US state with a privacy law:</b> we do not sell or share personal information for advertising, and we do not collect sensitive personal information ourselves. You may ask what we hold, and the honest answer is none beyond reports you send us. You will not be treated differently for using these rights.",
      "- To ask a question or make a request, contact ${CONTACT}."
    ]],
    ["Children", [
      "The App is for people 18 and older. We do not knowingly collect information from anyone under 18, and we collect nothing from users at all. If a person under 18 has used the App, a parent or guardian can erase the App data (Profile, then Reset everything) or contact us.",
    ]],
    ["Security and where data goes", [
      "Data stays on your device, so its safety depends on your device's security. No method of storage is perfectly secure. The hosting provider may process technical data in the United States or elsewhere.",
    ]],
    ["If this changes", [
      "If we ever add accounts, sync, analytics or anything else that sends data off your device, we will update this policy first and ask for your consent where the law requires it. We will tell you about important changes in the App."
    ]]
  ];
  W.PRIVACY_SECTIONS = PRIV.map(([h, ps]) => [h, ps.map((t) => fill(t).replace(/\$\{ADDR\}/g, W.OPERATOR_ADDRESS ? " " + W.OPERATOR_ADDRESS + "." : "").replace(/\$\{UPDATED\}/g, W.LEGAL_UPDATED))]);
})(globalThis);
