/* W.U.T.'s Cooking — food data.
   Every recipe is built from the ingredient catalog below, so calories, macros,
   vitamins/minerals, allergens, diet tags and the shopping list are all computed
   from the same numbers (nothing is typed in twice).
   Nutrition is per 100 g / 100 ml (u:"g"/"ml") or per 1 item (u:"ea").
   per = [calories, protein g, carbs g, fat g, fiber g]
   mi  = % of Daily Value for A, C, D, B12, Fe (iron), Ca, K, Mg
   Values are approximate (USDA-style averages) — good for planning, not for medical use. */
(function (root) {
  "use strict";
  const W = (root.WUT = root.WUT || {});

  W.MICRO_LABELS = {
    A: "Vitamin A", C: "Vitamin C", D: "Vitamin D", B12: "Vitamin B12",
    Fe: "Iron", Ca: "Calcium", K: "Potassium", Mg: "Magnesium"
  };

  W.CATS = ["Produce", "Meat & Seafood", "Dairy, Eggs & Tofu", "Grains, Beans & Bread", "Oils, Nuts & Pantry"];

  const ING = {
    // ---------- Produce ----------
    avocado: { n: "Avocados", u: "ea", ea: ["avocado", "avocados"], cat: "Produce", per: [240, 3, 13, 22, 10], mi: { C: 13, K: 15, Mg: 14, Fe: 4, Ca: 2 }, buy: "Ripe-but-firm Hass avocados. If they're hard, buy a few days ahead and let them ripen on the counter." },
    banana: { n: "Bananas", u: "ea", ea: ["banana", "bananas"], cat: "Produce", per: [105, 1.3, 27, 0.4, 3], mi: { K: 9, Mg: 8, C: 11 }, buy: "Bananas that are yellow with a few brown freckles." },
    lemon: { n: "Lemons", u: "ea", ea: ["lemon", "lemons"], cat: "Produce", per: [17, 0.6, 5, 0.2, 1.6], mi: { C: 34, K: 2 }, buy: "Fresh lemons (limes work too)." },
    blueberries: { n: "Blueberries", u: "g", cat: "Produce", per: [57, 0.7, 14, 0.3, 2.4], mi: { C: 11, K: 2 }, ai: true, buy: "Fresh or frozen unsweetened blueberries. Frozen is cheaper and keeps for months." },
    strawberries: { n: "Strawberries", u: "g", cat: "Produce", per: [32, 0.7, 8, 0.3, 2], mi: { C: 65, K: 3, Mg: 3 }, buy: "Fresh or frozen unsweetened strawberries." },
    spinach: { n: "Baby spinach", u: "g", cat: "Produce", per: [23, 2.9, 3.6, 0.4, 2.2], mi: { A: 52, C: 31, Fe: 15, Ca: 8, K: 12, Mg: 19 }, ai: true, buy: "Baby spinach. The pre-washed bag or tub is easiest (a typical bag is 142–170 g)." },
    kale: { n: "Kale", u: "g", cat: "Produce", per: [35, 2.9, 4.4, 1.5, 4.1], mi: { A: 50, C: 103, Ca: 12, K: 7, Mg: 8, Fe: 8 }, ai: true, buy: "Curly or lacinato (Tuscan) kale. Strip the tough stems before weighing." },
    greens: { n: "Salad greens or lettuce", u: "g", cat: "Produce", per: [17, 1.4, 3.3, 0.2, 1.8], mi: { A: 41, C: 20, K: 5, Ca: 3, Fe: 6 }, buy: "Romaine hearts, butter lettuce or a mixed-greens bag. Big whole leaves work best for wraps." },
    broccoli: { n: "Broccoli", u: "g", cat: "Produce", per: [34, 2.8, 7, 0.4, 2.6], mi: { C: 99, A: 3, Ca: 4, Fe: 4, K: 7, Mg: 5 }, ai: true, buy: "Fresh crowns or a bag of frozen florets (frozen works great for roasting and stir-fries)." },
    bellpepper: { n: "Bell peppers", u: "g", cat: "Produce", per: [31, 1, 6, 0.3, 2.1], mi: { C: 140, A: 17, K: 4, Mg: 3 }, buy: "Any color; red are the sweetest. One large pepper is about 150–200 g. For stuffed peppers, pick large flat-bottomed ones." },
    tomato: { n: "Tomatoes", u: "g", cat: "Produce", per: [18, 0.9, 3.9, 0.2, 1.2], mi: { C: 16, A: 5, K: 5 }, buy: "Ripe Roma/plum tomatoes or cherry tomatoes. One medium tomato is about 120 g." },
    cucumber: { n: "Cucumbers", u: "g", cat: "Produce", per: [15, 0.7, 3.6, 0.1, 0.5], mi: { K: 3, C: 4, Mg: 3 }, buy: "English (seedless) or Persian cucumbers. One English cucumber is about 300 g." },
    carrot: { n: "Carrots", u: "g", cat: "Produce", per: [41, 0.9, 10, 0.2, 2.8], mi: { A: 93, K: 7, C: 7, Mg: 3 }, buy: "Whole carrots (not baby-cut). One medium carrot is about 60 g." },
    zucchini: { n: "Zucchini", u: "g", cat: "Produce", per: [17, 1.2, 3.1, 0.3, 1], mi: { C: 20, K: 6, Mg: 4, A: 1 }, buy: "Medium, firm zucchini with shiny skin. One medium is about 200 g." },
    cauliflower: { n: "Cauliflower", u: "g", cat: "Produce", per: [25, 1.9, 5, 0.3, 2], mi: { C: 53, K: 6, Mg: 4 }, buy: "One head of cauliflower (about 600–800 g), or a bag of pre-riced cauliflower." },
    mushrooms: { n: "Mushrooms", u: "g", cat: "Produce", per: [22, 3.1, 3.3, 0.3, 1], mi: { K: 7, Mg: 2, Fe: 3 }, buy: "White or cremini (baby bella) mushrooms." },
    onion: { n: "Onions", u: "g", cat: "Produce", per: [40, 1.1, 9, 0.1, 1.7], mi: { C: 8, K: 3 }, buy: "Yellow onions. One medium onion is about 150 g." },
    garlic: { n: "Garlic", u: "ea", ea: ["garlic clove", "garlic cloves"], cat: "Produce", per: [4, 0.2, 1, 0, 0.1], mi: {}, pack: { size: 10, label: "head" }, buy: "Fresh garlic. One head holds about 10 cloves." },
    ginger: { n: "Fresh ginger", u: "g", cat: "Produce", per: [80, 1.8, 18, 0.8, 2], mi: { K: 9, Mg: 10 }, ai: true, buy: "Fresh ginger root. A thumb-sized piece is about 25 g." },
    sweetpotato: { n: "Sweet potatoes", u: "g", cat: "Produce", per: [86, 1.6, 20, 0.1, 3], mi: { A: 79, C: 3, K: 7, Mg: 6, Ca: 3 }, buy: "Orange-fleshed sweet potatoes, firm with no soft spots. One medium is about 200 g." },

    // ---------- Meat & seafood ----------
    chickenbreast: { n: "Chicken breast", u: "g", cat: "Meat & Seafood", per: [120, 22.5, 0, 2.6, 0], mi: { B12: 13, K: 8, Mg: 7, Fe: 2 }, t: "meat", buy: "Boneless, skinless chicken breasts (about 170–225 g each). Raw weight." },
    turkey: { n: "Lean ground turkey", u: "g", cat: "Meat & Seafood", per: [150, 19, 0, 8, 0], mi: { B12: 50, K: 5, Mg: 5, Fe: 6 }, t: "meat", buy: "Lean ground turkey (93% lean). Fresh or frozen; raw weight." },
    beef: { n: "Lean beef (sirloin or flank)", u: "g", cat: "Meat & Seafood", per: [145, 22, 0, 6, 0], mi: { B12: 88, Fe: 13, K: 7, Mg: 6 }, t: "meat", red: true, buy: "Sirloin or flank steak trimmed lean, or pre-sliced stir-fry beef. Raw weight." },
    salmon: { n: "Salmon fillets", u: "g", cat: "Meat & Seafood", per: [208, 20, 0, 13, 0], mi: { D: 55, B12: 130, K: 8, Mg: 6 }, t: "fish", a: ["fish"], o3: true, ai: true, buy: "Salmon fillets, wild-caught or farmed, skin-on or skinless. Fresh or frozen both work. One fillet is about 150–170 g." },
    cod: { n: "Cod fillets (or other mild white fish)", u: "g", cat: "Meat & Seafood", per: [82, 18, 0, 0.7, 0], mi: { B12: 38, K: 9, Mg: 8, D: 5 }, t: "fish", a: ["fish"], buy: "Skinless cod fillets, or haddock/pollock. Fresh or frozen." },
    tuna: { n: "Canned tuna in water", u: "g", cat: "Meat & Seafood", per: [116, 26, 0, 1, 0], mi: { D: 10, B12: 100, K: 5, Mg: 7, Fe: 8 }, t: "fish", a: ["fish"], buy: "Canned light/skipjack tuna in water. A 142 g (5 oz) can holds about 110 g drained." },
    shrimp: { n: "Raw shrimp (peeled & deveined)", u: "g", cat: "Meat & Seafood", per: [85, 20, 0.2, 0.5, 0], mi: { B12: 46, Ca: 4, K: 4, Mg: 9, Fe: 3 }, t: "shellfish", a: ["shellfish"], buy: "Large raw shrimp, peeled and deveined. Frozen is fine; thaw overnight in the fridge." },

    // ---------- Dairy, eggs & tofu ----------
    eggs: { n: "Large eggs", u: "ea", ea: ["large egg", "large eggs"], cat: "Dairy, Eggs & Tofu", per: [72, 6.3, 0.4, 4.8, 0], mi: { A: 9, D: 6, B12: 20, Fe: 5, Ca: 2, K: 1 }, t: "egg", a: ["eggs"], pack: { size: 12, label: "dozen" }, buy: "Large eggs. Pasture-raised or omega-3 enriched if you like." },
    greekyogurt: { n: "Plain Greek yogurt", u: "g", cat: "Dairy, Eggs & Tofu", per: [73, 10, 4, 2, 0], mi: { Ca: 9, B12: 25, K: 3, Mg: 3 }, t: "dairy", a: ["dairy"], np: true, buy: "Plain, unsweetened Greek yogurt (2% or full-fat tastes best). A big tub is usually 750 g–1 kg." },
    feta: { n: "Feta cheese", u: "g", cat: "Dairy, Eggs & Tofu", per: [264, 14, 4, 21, 0], mi: { Ca: 38, B12: 60, A: 14, K: 2 }, t: "dairy", a: ["dairy"], np: true, buy: "Block feta in brine tastes better than pre-crumbled. A standard block is about 200 g." },
    tofu: { n: "Extra-firm tofu", u: "g", cat: "Dairy, Eggs & Tofu", per: [144, 17, 3, 9, 2], mi: { Ca: 27, Fe: 15, Mg: 14, K: 5 }, a: ["soy"], np: true, buy: "Extra-firm or firm plain tofu in a water-packed block (not silken). One block is usually 400–450 g (14–16 oz)." },
    plantmilk: { n: "Unsweetened plant milk", u: "ml", cat: "Dairy, Eggs & Tofu", per: [20, 0.8, 2, 1, 0.3], mi: { Ca: 14, D: 12 }, proc: true, buy: "Unsweetened plant milk that fits your allergies: oat, coconut-blend or pea-protein milk. (Almond milk contains tree nuts; soy milk contains soy.)" },
    coconutmilk: { n: "Canned full-fat coconut milk", u: "ml", cat: "Dairy, Eggs & Tofu", per: [197, 2, 3, 21, 0], mi: { Fe: 9, Mg: 9, K: 5 }, buy: "Canned full-fat coconut milk (shake the can well). A standard can is 400 ml." },

    // ---------- Grains, beans & bread ----------
    oats: { n: "Rolled oats", u: "g", cat: "Grains, Beans & Bread", per: [379, 13, 68, 6.5, 10], mi: { Fe: 26, Mg: 33, K: 9, Ca: 4 }, a: ["gluten"], np: true, buy: "Old-fashioned (rolled) oats, not instant. Choose certified gluten-free oats if you avoid gluten. Weight is dry." },
    quinoa: { n: "Quinoa (dry)", u: "g", cat: "Grains, Beans & Bread", per: [368, 14, 64, 6, 7], mi: { Fe: 26, Mg: 47, K: 12, Ca: 4 }, np: true, buy: "White, red or tri-color quinoa. Look for pre-rinsed, or rinse it yourself. Weight is dry, before cooking." },
    brownrice: { n: "Brown rice (dry)", u: "g", cat: "Grains, Beans & Bread", per: [370, 8, 77, 3, 3.5], mi: { Mg: 34, Fe: 8, K: 5 }, np: true, buy: "Long- or short-grain brown rice. Weight is dry, before cooking (it roughly triples when cooked)." },
    lentils: { n: "Dry lentils", u: "g", cat: "Grains, Beans & Bread", per: [352, 25, 63, 1, 11], mi: { Fe: 42, Mg: 29, K: 14, Ca: 3 }, np: true, buy: "Dry green or brown lentils; they hold their shape when cooked. Weight is dry." },
    chickpeas: { n: "Canned chickpeas", u: "g", cat: "Grains, Beans & Bread", per: [139, 7, 23, 2.8, 6], mi: { Fe: 16, Mg: 11, K: 4, Ca: 4 }, np: true, buy: "Canned chickpeas (garbanzo beans), low-sodium if you can. Drained weight shown: one 425 g (15 oz) can holds about 250 g drained." },
    blackbeans: { n: "Canned black beans", u: "g", cat: "Grains, Beans & Bread", per: [91, 6, 16, 0.3, 6], mi: { Fe: 11, Mg: 10, K: 6, Ca: 3 }, np: true, buy: "Canned black beans, low-sodium if you can. Drained weight shown: one 425 g (15 oz) can holds about 250 g drained." },
    bread: { n: "Whole-grain bread", u: "ea", ea: ["slice of whole-grain bread", "slices of whole-grain bread"], cat: "Grains, Beans & Bread", per: [100, 4, 18, 1.5, 3], mi: { Fe: 6, Mg: 6, K: 2 }, a: ["gluten"], np: true, proc: true, pack: { size: 16, label: "loaf" }, buy: "100% whole-grain or sprouted bread (a gluten-free loaf if you avoid gluten)." },
    tortilla: { n: "Whole-wheat tortillas", u: "ea", ea: ["whole-wheat tortilla", "whole-wheat tortillas"], cat: "Grains, Beans & Bread", per: [140, 4, 24, 3.5, 3], mi: { Ca: 6, Fe: 8 }, a: ["gluten"], np: true, proc: true, pack: { size: 8, label: "pack" }, buy: "Burrito-size whole-wheat or whole-grain tortillas (gluten-free if needed)." },

    // ---------- Oils, nuts & pantry ----------
    oliveoil: { n: "Extra-virgin olive oil", u: "ml", cat: "Oils, Nuts & Pantry", per: [810, 0, 0, 92, 0], mi: {}, ai: true, buy: "Extra-virgin olive oil. One small bottle (500 ml) goes a long way." },
    sesameoil: { n: "Toasted sesame oil", u: "ml", cat: "Oils, Nuts & Pantry", per: [810, 0, 0, 92, 0], mi: {}, a: ["sesame"], buy: "Toasted sesame oil, a small bottle is plenty." },
    soysauce: { n: "Low-sodium soy sauce", u: "ml", cat: "Oils, Nuts & Pantry", per: [63, 8, 5, 0.1, 0.8], mi: {}, a: ["soy", "gluten"], np: true, proc: true, buy: "Low-sodium soy sauce (use tamari if you avoid gluten)." },
    maple: { n: "Pure maple syrup", u: "ml", cat: "Oils, Nuts & Pantry", per: [260, 0, 67, 0.1, 0], mi: {}, proc: true, buy: "Pure maple syrup, not pancake syrup." },
    cinnamon: { n: "Ground cinnamon", u: "g", cat: "Oils, Nuts & Pantry", per: [247, 4, 81, 1.2, 53], mi: { Ca: 77, Fe: 44 }, buy: "Ground cinnamon." },
    chia: { n: "Chia seeds", u: "g", cat: "Oils, Nuts & Pantry", per: [486, 17, 42, 31, 34], mi: { Ca: 49, Fe: 43, Mg: 80, K: 9 }, o3: true, ai: true, buy: "Plain black or white chia seeds (baking or health-food aisle)." },
    walnuts: { n: "Walnuts", u: "g", cat: "Oils, Nuts & Pantry", per: [654, 15, 14, 65, 7], mi: { Mg: 38, K: 9, Fe: 16, Ca: 10 }, a: ["tree nuts"], o3: true, ai: true, buy: "Raw walnut halves or pieces." },
    peanutbutter: { n: "Natural peanut butter", u: "g", cat: "Oils, Nuts & Pantry", per: [588, 25, 20, 50, 6], mi: { Mg: 37, K: 14, Fe: 11, Ca: 6 }, a: ["peanuts"], np: true, buy: "Natural peanut butter with just peanuts (and maybe salt)." },
    tahini: { n: "Tahini (sesame paste)", u: "g", cat: "Oils, Nuts & Pantry", per: [595, 17, 21, 54, 9], mi: { Ca: 33, Fe: 40, Mg: 23, K: 9 }, a: ["sesame"], buy: "Pure sesame tahini, runny and well stirred. Stir the jar before measuring." }
  };

  const STORE_DEFAULT_REHEAT = "Reheat until steaming hot all the way through (165 °F / 74 °C).";

  // Each recipe is ONE serving. ing = [ingredientId, amount in the ingredient's unit (g / ml / each)]
  const RECIPES = [
    // ================= BREAKFAST =================
    {
      id: "b-oats", meal: "Breakfast", name: "Golden Berry Overnight Oats", emoji: "🥣", time: 5,
      ing: [["oats", 50], ["chia", 10], ["plantmilk", 200], ["blueberries", 80], ["banana", 1], ["maple", 10], ["cinnamon", 1]],
      pantry: ["Vanilla extract (optional)"],
      steps: [
        "In a jar or lidded container, stir together the oats, chia seeds, plant milk, maple syrup and cinnamon.",
        "Cover and refrigerate for at least 6 hours, ideally overnight, until thick and creamy.",
        "Slice the banana and add it with the blueberries just before eating so the fruit stays fresh.",
        "If it's too thick, loosen it with a splash of plant milk."
      ],
      store: { fridge: "Up to 4 days (leave the fruit off until serving).", freezer: "Not recommended. The texture turns watery.", tip: "Make 4 jars at once on Sunday and you have breakfast for most of the week." }
    },
    {
      id: "b-parfait", meal: "Breakfast", name: "Greek Yogurt Berry Parfait", emoji: "🍓", time: 5,
      ing: [["greekyogurt", 200], ["blueberries", 100], ["chia", 10], ["walnuts", 15], ["cinnamon", 1]],
      pantry: [],
      steps: [
        "Spoon half of the yogurt into a glass or jar.",
        "Add half of the blueberries, then the rest of the yogurt.",
        "Top with the remaining berries, chia seeds, chopped walnuts and a dusting of cinnamon."
      ],
      store: { fridge: "2–3 days assembled; keep the walnuts separate so they stay crunchy.", freezer: "Not recommended.", tip: "Pack it in a jar for grab-and-go mornings." }
    },
    {
      id: "b-toast", meal: "Breakfast", name: "Avocado Egg Toast Stack", emoji: "🥑", time: 12,
      ing: [["bread", 2], ["avocado", 0.5], ["eggs", 2], ["tomato", 80], ["spinach", 30], ["oliveoil", 5], ["lemon", 0.25]],
      pantry: ["Salt", "Black pepper", "Chili flakes (optional)"],
      steps: [
        "Heat the olive oil in a nonstick pan over medium heat. Crack in the eggs, cover, and cook 3–4 minutes until the whites are fully set (longer if you like firm yolks).",
        "Toast the bread while the eggs cook.",
        "Mash the avocado with a squeeze of lemon, a pinch of salt and pepper.",
        "Spread the avocado on the toast, pile on spinach and sliced tomato, and top each slice with an egg."
      ],
      store: { fridge: "Best eaten fresh. Hard-boiled eggs keep 7 days in the shell; lemony mashed avocado keeps about 1 day airtight.", freezer: "Not recommended.", tip: "Prep the components, then assemble in 2 minutes each morning." }
    },
    {
      id: "b-scramble", meal: "Breakfast", name: "Mushroom Spinach Feta Scramble", emoji: "🍳", time: 12,
      ing: [["eggs", 3], ["spinach", 60], ["mushrooms", 80], ["feta", 30], ["oliveoil", 10], ["tomato", 50]],
      pantry: ["Salt", "Black pepper"],
      steps: [
        "Slice the mushrooms and cook them in the olive oil over medium-high heat for 4–5 minutes until browned.",
        "Add the spinach and stir for about 1 minute until wilted.",
        "Whisk the eggs with a pinch of salt and pepper, pour them in, and stir gently for 2–3 minutes until set with no liquid egg left.",
        "Take the pan off the heat and fold in the crumbled feta and chopped tomato."
      ],
      store: { fridge: "3–4 days in an airtight container.", freezer: "Not recommended.", tip: "Reheat gently in the microwave in 30-second bursts so the eggs stay tender." }
    },
    {
      id: "b-tofuwrap", meal: "Breakfast", name: "Tofu Scramble Breakfast Wrap", emoji: "🌯", time: 20,
      ing: [["tofu", 150], ["tortilla", 1], ["spinach", 40], ["bellpepper", 60], ["onion", 30], ["oliveoil", 10]],
      pantry: ["Turmeric", "Ground cumin", "Salt", "Black pepper", "Nutritional yeast (optional)"],
      steps: [
        "Drain the tofu and press it between clean towels for 10 minutes, then crumble it with your hands.",
        "Heat the olive oil in a skillet over medium heat. Cook the diced onion and bell pepper for 4 minutes.",
        "Add the tofu with ½ tsp turmeric, ½ tsp cumin, salt and pepper. Cook 5–6 minutes until golden and fairly dry, then stir in the spinach until wilted.",
        "Warm the tortilla, fill it with the scramble, fold in the sides and roll."
      ],
      store: { fridge: "Filling keeps 4 days; wrapped burritos keep 3 days.", freezer: "Wrapped in foil, up to 2 months. Thaw overnight in the fridge.", tip: "Make 4–6 wraps in one go and freeze them for instant breakfasts." }
    },
    {
      id: "b-chia", meal: "Breakfast", name: "Coconut Chia Pudding with Strawberries", emoji: "🥥", time: 5,
      ing: [["chia", 35], ["coconutmilk", 150], ["strawberries", 60], ["cinnamon", 1]],
      pantry: ["Vanilla extract (optional)"],
      steps: [
        "Whisk the chia seeds, coconut milk, cinnamon and a drop of vanilla in a jar.",
        "Let it sit 5 minutes, then whisk again to break up any clumps.",
        "Cover and refrigerate at least 4 hours or overnight until set like pudding.",
        "Top with sliced strawberries before serving."
      ],
      store: { fridge: "Up to 4 days.", freezer: "Not recommended.", tip: "Rich and filling. A little goes a long way, so a small jar is plenty." }
    },
    {
      id: "b-hash", meal: "Breakfast", name: "Sweet Potato Breakfast Hash", emoji: "🍠", time: 25,
      ing: [["sweetpotato", 200], ["eggs", 2], ["bellpepper", 80], ["onion", 50], ["spinach", 40], ["oliveoil", 10]],
      pantry: ["Smoked paprika", "Salt", "Black pepper"],
      steps: [
        "Dice the sweet potato into ½-inch (1 cm) cubes.",
        "Heat the olive oil in a large skillet over medium-high heat. Cook the sweet potato for 10–12 minutes, stirring now and then, until tender and browned.",
        "Add the onion and bell pepper with paprika, salt and pepper and cook 4 more minutes, then stir in the spinach.",
        "Make two wells in the hash, crack in the eggs, cover, and cook 3–5 minutes until the whites are set."
      ],
      store: { fridge: "The hash base keeps 4 days (cook the eggs fresh each time).", freezer: "Hash base freezes up to 2 months.", tip: "Cook a big batch of hash on prep day and just fry eggs in the morning." }
    },
    {
      id: "b-pbbowl", meal: "Breakfast", name: "Peanut Butter Banana Oat Bowl", emoji: "🍌", time: 10,
      ing: [["oats", 60], ["plantmilk", 200], ["banana", 1], ["peanutbutter", 20], ["chia", 5], ["cinnamon", 1]],
      pantry: [],
      steps: [
        "Simmer the oats and plant milk in a small pot over medium heat for about 5 minutes, stirring, until creamy.",
        "Stir in the chia seeds and cinnamon.",
        "Pour into a bowl, top with sliced banana, and drizzle with peanut butter (warm it 10 seconds in the microwave to make it pourable)."
      ],
      store: { fridge: "4 days in a sealed container.", freezer: "Single portions freeze up to 3 months.", tip: "Reheat with a splash of milk to bring back the creamy texture." }
    },
    {
      id: "b-muffins", meal: "Breakfast", name: "Veggie Egg Muffins", emoji: "🧁", time: 30,
      ing: [["eggs", 3], ["spinach", 40], ["bellpepper", 40], ["mushrooms", 40], ["oliveoil", 5]],
      pantry: ["Salt", "Black pepper"],
      steps: [
        "Heat the oven to 375 °F (190 °C) and grease a muffin tin.",
        "Sauté the chopped mushrooms and bell pepper in the olive oil for 3 minutes.",
        "Whisk the eggs with salt and pepper, then stir in the cooked veggies and spinach.",
        "Pour into the muffin cups until about ¾ full (3 cups per serving) and bake 18–20 minutes until set and a knife comes out clean."
      ],
      store: { fridge: "4 days in an airtight container.", freezer: "Up to 2 months. Thaw overnight, or microwave from frozen.", tip: "The ultimate meal-prep breakfast: bake 12 at once." }
    },

    // ================= LUNCH =================
    {
      id: "l-salmonquinoa", meal: "Lunch", name: "Mediterranean Salmon Quinoa Bowl", emoji: "🐟", time: 30,
      ing: [["salmon", 150], ["quinoa", 60], ["cucumber", 100], ["tomato", 100], ["spinach", 40], ["lemon", 0.5], ["oliveoil", 10]],
      pantry: ["Dried oregano", "Salt", "Black pepper"],
      steps: [
        "Rinse the quinoa, then simmer it with twice its volume of water for 12–15 minutes until the water is absorbed. Fluff with a fork.",
        "Season the salmon with salt and pepper. Sear skin-side down in a little of the oil for 4 minutes per side, or bake at 400 °F (200 °C) for 12–15 minutes, until it flakes and reaches 145 °F (63 °C).",
        "Chop the cucumber and tomato and toss with the spinach, lemon juice, remaining olive oil and oregano.",
        "Build the bowl: quinoa, salad, then the salmon on top."
      ],
      store: { fridge: "3 days. Keep the salad and dressing separate from the salmon and quinoa.", freezer: "Cooked salmon freezes up to 2 months but softens; quinoa freezes well.", tip: "Eat cold or warm the salmon gently. High heat makes it dry." }
    },
    {
      id: "l-lentilquinoa", meal: "Lunch", name: "Lentil Quinoa Garden Bowl", emoji: "🥗", time: 35,
      ing: [["lentils", 60], ["quinoa", 40], ["spinach", 50], ["bellpepper", 80], ["carrot", 60], ["lemon", 0.5], ["oliveoil", 10]],
      pantry: ["Ground cumin", "Salt", "Black pepper"],
      steps: [
        "Rinse the lentils and simmer in 3× their volume of water for 20–25 minutes until tender but still holding their shape. Drain.",
        "Cook the quinoa as usual (twice its volume of water, 12–15 minutes).",
        "Shred the carrot and dice the bell pepper.",
        "Toss the lentils, quinoa, vegetables and spinach with the lemon juice, olive oil, cumin, salt and pepper."
      ],
      store: { fridge: "Up to 5 days.", freezer: "The lentils and quinoa freeze up to 3 months. Add fresh veggies after thawing.", tip: "Tastes even better the next day once the lemon and cumin soak in." }
    },
    {
      id: "l-chickenwrap", meal: "Lunch", name: "Chicken Avocado Lettuce Wraps", emoji: "🥬", time: 20,
      ing: [["chickenbreast", 160], ["avocado", 0.5], ["greens", 80], ["tomato", 80], ["oliveoil", 10], ["lemon", 0.5]],
      pantry: ["Paprika", "Garlic powder", "Salt", "Black pepper"],
      steps: [
        "Season the chicken with paprika, garlic powder, salt and pepper.",
        "Cook in the olive oil over medium heat for 5–6 minutes per side until it reaches 165 °F (74 °C). Rest 5 minutes, then slice.",
        "Mash the avocado with the lemon juice and a pinch of salt.",
        "Spread avocado on big lettuce leaves, add chicken and tomato, and fold or roll."
      ],
      store: { fridge: "Cooked chicken keeps 3–4 days. Assemble the wraps fresh.", freezer: "Sliced cooked chicken freezes up to 3 months.", tip: "Cook a big batch of chicken on prep day and assemble wraps in a minute." }
    },
    {
      id: "l-tunachickpea", meal: "Lunch", name: "Tuna Chickpea Salad Bowl", emoji: "🥙", time: 10,
      ing: [["tuna", 100], ["chickpeas", 120], ["cucumber", 80], ["tomato", 80], ["greens", 40], ["oliveoil", 10], ["lemon", 0.5]],
      pantry: ["Dried oregano", "Salt", "Black pepper"],
      steps: [
        "Drain and rinse the chickpeas, and drain the tuna.",
        "Whisk the olive oil, lemon juice, oregano, salt and pepper in a large bowl.",
        "Add the chickpeas, chopped cucumber and tomato, greens and flaked tuna and toss to coat."
      ],
      store: { fridge: "3 days in an airtight container.", freezer: "Not recommended.", tip: "No cooking at all. Perfect for a quick lunch prep." }
    },
    {
      id: "l-burritobowl", meal: "Lunch", name: "Black Bean Sweet Potato Burrito Bowl", emoji: "🌮", time: 45,
      ing: [["blackbeans", 120], ["sweetpotato", 150], ["brownrice", 50], ["bellpepper", 60], ["tomato", 80], ["avocado", 0.5], ["lemon", 0.5], ["oliveoil", 10]],
      pantry: ["Ground cumin", "Chili powder", "Salt"],
      steps: [
        "Simmer the brown rice in twice its volume of water for about 40 minutes until tender.",
        "Dice the sweet potato, toss with olive oil, cumin, chili powder and salt, and roast at 425 °F (220 °C) for 20–25 minutes.",
        "Warm the drained black beans in a small pot.",
        "Build the bowl with rice, beans, sweet potato, diced pepper and tomato. Top with avocado and a squeeze of lemon."
      ],
      store: { fridge: "4 days (keep the avocado separate).", freezer: "Rice, beans and sweet potato freeze up to 3 months.", tip: "Freeze flat in zip bags to thaw in minutes." }
    },
    {
      id: "l-greekchicken", meal: "Lunch", name: "Greek Chicken Quinoa Salad", emoji: "🥗", time: 30,
      ing: [["chickenbreast", 140], ["quinoa", 50], ["cucumber", 80], ["tomato", 80], ["feta", 25], ["oliveoil", 10], ["lemon", 0.5]],
      pantry: ["Dried oregano", "Garlic powder", "Salt", "Black pepper"],
      steps: [
        "Cook the quinoa in twice its volume of water for 12–15 minutes and let it cool slightly.",
        "Season the chicken with oregano, garlic powder, salt and pepper. Pan-cook in a little oil 5–6 minutes per side to 165 °F (74 °C), rest, then dice.",
        "Whisk the rest of the olive oil with lemon juice. Toss with the quinoa, cucumber and tomato.",
        "Top with the chicken and crumbled feta."
      ],
      store: { fridge: "3–4 days; keep the dressing on the side if you can.", freezer: "Not recommended (cucumber and feta get watery).", tip: "Great cold straight from the fridge." }
    },
    {
      id: "l-shrimpbowl", meal: "Lunch", name: "Garlic Shrimp Cauliflower Rice Bowl", emoji: "🍤", time: 20,
      ing: [["shrimp", 150], ["cauliflower", 200], ["avocado", 0.5], ["oliveoil", 10], ["lemon", 0.25], ["garlic", 2]],
      pantry: ["Smoked paprika", "Salt", "Black pepper"],
      steps: [
        "Pulse the cauliflower florets in a food processor until rice-sized (or use pre-riced cauliflower).",
        "Heat half the oil and cook the minced garlic for 30 seconds. Add the seasoned shrimp and cook 2–3 minutes per side until pink and opaque. Set aside.",
        "Cook the cauliflower rice in the remaining oil for 5 minutes until just tender.",
        "Serve topped with the shrimp, sliced avocado and a squeeze of lemon."
      ],
      store: { fridge: "3 days.", freezer: "Cauliflower rice freezes 3 months; cooked shrimp is best fresh.", tip: "Don't overcook the shrimp. They turn rubbery when reheated, so warm gently." }
    },
    {
      id: "l-friedrice", meal: "Lunch", name: "Veggie Egg Fried Rice", emoji: "🍚", time: 25,
      ing: [["brownrice", 70], ["eggs", 2], ["broccoli", 80], ["carrot", 50], ["onion", 30], ["soysauce", 15], ["sesameoil", 5], ["garlic", 1]],
      pantry: ["Black pepper"],
      steps: [
        "Cook the rice ahead and cool it (cold rice fries better).",
        "Scramble the eggs in a hot pan, then set them aside.",
        "Stir-fry the onion, garlic, diced carrot and small broccoli florets in the sesame oil for 4–5 minutes.",
        "Add the rice and soy sauce and stir-fry 3 minutes, then fold the eggs back in."
      ],
      store: { fridge: "Cool the rice within 1 hour of cooking and keep it up to 3 days.", freezer: "Up to 2 months.", tip: "Never leave cooked rice at room temperature longer than 2 hours." }
    },
    {
      id: "l-chickpeakale", meal: "Lunch", name: "Crispy Chickpea & Kale Power Salad", emoji: "🥬", time: 30,
      ing: [["chickpeas", 150], ["kale", 80], ["avocado", 0.5], ["tahini", 15], ["lemon", 0.5], ["carrot", 40], ["oliveoil", 10]],
      pantry: ["Smoked paprika", "Garlic powder", "Salt"],
      steps: [
        "Pat the chickpeas very dry, toss with half the olive oil, paprika, garlic powder and salt, and roast at 425 °F (220 °C) for 20–25 minutes, shaking the pan halfway, until crisp.",
        "Massage the chopped kale with the remaining oil, half the lemon juice and a pinch of salt for 1 minute to soften it.",
        "Whisk the tahini with the rest of the lemon juice and 1–2 tablespoons of water into a creamy dressing.",
        "Top the kale with shredded carrot, sliced avocado, crispy chickpeas and the dressing."
      ],
      store: { fridge: "Salad base and dressing keep 3 days; store the crispy chickpeas separately.", freezer: "Not recommended.", tip: "Keep roasted chickpeas in an open-ish container so they stay crunchy." }
    },

    // ================= DINNER =================
    {
      id: "d-chickentray", meal: "Dinner", name: "Herbed Chicken & Sweet Potato Tray Bake", emoji: "🍗", time: 45,
      ing: [["chickenbreast", 180], ["sweetpotato", 200], ["broccoli", 120], ["oliveoil", 15], ["garlic", 2]],
      pantry: ["Dried rosemary or thyme", "Salt", "Black pepper"],
      steps: [
        "Heat the oven to 425 °F (220 °C).",
        "Cube the sweet potato, toss with half the oil, salt and herbs, and roast on a sheet pan for 10 minutes.",
        "Rub the chicken with the remaining oil, minced garlic, herbs, salt and pepper. Add it to the pan with the broccoli.",
        "Roast 20–25 minutes more until the chicken reaches 165 °F (74 °C). Rest 5 minutes before slicing."
      ],
      store: { fridge: "4 days in airtight containers.", freezer: "Up to 3 months.", tip: "One pan, minimal cleanup, perfect for a Sunday batch." }
    },
    {
      id: "d-tofustirfry", meal: "Dinner", name: "Tofu Sesame Veggie Stir-Fry", emoji: "🍜", time: 35,
      ing: [["tofu", 175], ["broccoli", 120], ["bellpepper", 80], ["brownrice", 50], ["ginger", 8], ["garlic", 2], ["soysauce", 15], ["sesameoil", 5], ["oliveoil", 5]],
      pantry: ["Sesame seeds (optional)", "Black pepper"],
      steps: [
        "Press the tofu for 15 minutes, then cut it into cubes. Start the brown rice (about 40 minutes).",
        "Pan-fry the tofu in the olive oil over medium-high heat for 8–10 minutes until golden on all sides. Set aside.",
        "Mix the soy sauce, grated ginger, minced garlic and a splash of water for the sauce.",
        "Stir-fry the broccoli and pepper for 4 minutes, return the tofu, add the sauce and toss for 1 minute. Finish with the sesame oil and serve over rice."
      ],
      store: { fridge: "4 days.", freezer: "Cooked rice freezes 2 months; the stir-fry itself is best kept in the fridge.", tip: "Pressing the tofu is the secret to crispy, not soggy." }
    },
    {
      id: "d-codgreens", meal: "Dinner", name: "Lemon Garlic Baked Cod with Greens", emoji: "🍋", time: 30,
      ing: [["cod", 200], ["zucchini", 150], ["kale", 60], ["oliveoil", 15], ["lemon", 1], ["garlic", 2]],
      pantry: ["Salt", "Black pepper"],
      steps: [
        "Heat the oven to 400 °F (200 °C). Pat the cod dry and set it on a lined baking sheet.",
        "Top with minced garlic, lemon zest and juice, 1 tablespoon of the oil, salt and pepper.",
        "Slice the zucchini into half-moons, toss with some oil and arrange around the fish. Bake 12–15 minutes until the cod flakes easily (145 °F / 63 °C).",
        "Sauté the kale in the remaining oil with a pinch of salt for 3 minutes and serve alongside."
      ],
      store: { fridge: "3 days.", freezer: "Up to 2 months, but the texture softens.", tip: "Frozen cod works great. Thaw overnight in the fridge first." }
    },
    {
      id: "d-turkeyskillet", meal: "Dinner", name: "Turkey & Veggie Skillet", emoji: "🥘", time: 25,
      ing: [["turkey", 180], ["zucchini", 150], ["mushrooms", 100], ["tomato", 60], ["onion", 30], ["oliveoil", 10], ["garlic", 2]],
      pantry: ["Italian seasoning", "Salt", "Black pepper"],
      steps: [
        "Heat the oil in a large skillet and brown the turkey 6–8 minutes, breaking it up, until no pink remains (165 °F / 74 °C).",
        "Add the diced onion and mushrooms and cook 4 minutes.",
        "Add the zucchini and minced garlic and cook 3 minutes.",
        "Stir in the chopped tomatoes and Italian seasoning for 2–3 minutes. Season to taste."
      ],
      store: { fridge: "4 days.", freezer: "Up to 3 months.", tip: "Great spooned over greens or rice." }
    },
    {
      id: "d-shrimpzoodles", meal: "Dinner", name: "Garlic Shrimp & Zucchini Noodles", emoji: "🦐", time: 20,
      ing: [["shrimp", 200], ["zucchini", 250], ["tomato", 50], ["oliveoil", 15], ["garlic", 3], ["lemon", 0.25]],
      pantry: ["Red pepper flakes (optional)", "Salt", "Black pepper"],
      steps: [
        "Spiralize the zucchini or peel it into long ribbons.",
        "Sauté the minced garlic in the oil for 30 seconds. Add the shrimp and cook 2–3 minutes per side until pink and opaque. Remove them.",
        "Toss the zucchini noodles in the same pan for just 2 minutes. They release water, so don't overcook.",
        "Add the halved tomatoes, lemon juice and shrimp, season and serve right away."
      ],
      store: { fridge: "3 days; store the zucchini noodles separately if you can, since they get watery.", freezer: "Not recommended.", tip: "Best made fresh — it only takes 20 minutes." }
    },
    {
      id: "d-beefbroccoli", meal: "Dinner", name: "Beef & Broccoli Rice Bowl", emoji: "🥩", time: 40,
      ing: [["beef", 160], ["broccoli", 150], ["brownrice", 60], ["ginger", 8], ["garlic", 2], ["soysauce", 20], ["sesameoil", 5], ["oliveoil", 5]],
      pantry: ["Black pepper"],
      steps: [
        "Slice the beef thinly against the grain and marinate with the soy sauce, grated ginger and minced garlic for 10 minutes. Start the rice (about 40 minutes).",
        "Sear the beef in hot olive oil for 1–2 minutes per side until browned. Remove it from the pan.",
        "Stir-fry the broccoli with a splash of water for 3–4 minutes until bright green and crisp-tender.",
        "Return the beef, drizzle with sesame oil and serve over the rice."
      ],
      store: { fridge: "3–4 days.", freezer: "Up to 2–3 months.", tip: "Slice beef when it's slightly frozen for easy thin cuts." }
    },
    {
      id: "d-chickpeacurry", meal: "Dinner", name: "Coconut Chickpea Curry", emoji: "🍛", time: 40,
      ing: [["chickpeas", 150], ["coconutmilk", 80], ["spinach", 80], ["sweetpotato", 100], ["tomato", 100], ["onion", 50], ["ginger", 8], ["garlic", 2], ["brownrice", 40], ["oliveoil", 5]],
      pantry: ["Curry powder", "Turmeric", "Salt"],
      steps: [
        "Start the brown rice (about 40 minutes).",
        "Sauté the diced onion in the olive oil for 4 minutes. Add the garlic, grated ginger and 2 tsp curry powder and stir 1 minute.",
        "Add the diced sweet potato, chopped tomatoes, chickpeas, coconut milk and ½ cup (120 ml) water. Simmer 15–20 minutes until the sweet potato is tender.",
        "Stir in the spinach for 1–2 minutes, season, and serve over the rice."
      ],
      store: { fridge: "Up to 5 days.", freezer: "The curry freezes 3 months; cook the rice fresh.", tip: "Curry flavors deepen overnight, so leftovers are even better." }
    },
    {
      id: "d-salmontray", meal: "Dinner", name: "Baked Salmon with Roasted Cauliflower & Broccoli", emoji: "🐠", time: 30,
      ing: [["salmon", 170], ["cauliflower", 120], ["broccoli", 80], ["oliveoil", 15], ["lemon", 0.25], ["garlic", 2]],
      pantry: ["Salt", "Black pepper"],
      steps: [
        "Heat the oven to 425 °F (220 °C). Toss the cauliflower and broccoli with two-thirds of the oil, salt and pepper and roast for 10 minutes.",
        "Push the veggies aside, add the salmon, and brush it with the minced garlic mixed with the remaining oil.",
        "Roast 10–12 minutes until the salmon reaches 145 °F (63 °C) and flakes easily.",
        "Squeeze the lemon over everything before serving."
      ],
      store: { fridge: "3 days.", freezer: "Veggies freeze well; cooked salmon up to 2 months (softer).", tip: "Cover the salmon loosely and reheat on low so it stays moist." }
    },
    {
      id: "d-stuffedpeppers", meal: "Dinner", name: "Lentil Stuffed Peppers", emoji: "🫑", time: 55,
      ing: [["bellpepper", 300], ["lentils", 70], ["tomato", 100], ["onion", 40], ["spinach", 40], ["oliveoil", 10], ["garlic", 2]],
      pantry: ["Ground cumin", "Smoked paprika", "Salt", "Black pepper"],
      steps: [
        "Heat the oven to 375 °F (190 °C). Halve the peppers and remove the seeds.",
        "Simmer the lentils in plenty of water for 20–25 minutes until tender, then drain.",
        "Sauté the diced onion and garlic in the oil for 4 minutes. Add the chopped tomato, cumin, paprika and spinach and cook 2 minutes, then stir in the lentils.",
        "Fill the pepper halves, set them in a baking dish with 2 tablespoons of water, cover with foil and bake 25–30 minutes. Uncover for the last 5 minutes."
      ],
      store: { fridge: "4 days.", freezer: "Wrap individually; up to 3 months.", tip: "Thaw overnight in the fridge, then reheat covered so they don't dry out." }
    }
  ];

  W.ING = ING;
  W.RECIPES = RECIPES;
  W.REHEAT = STORE_DEFAULT_REHEAT;

  // ---- Diet options (shown in a dropdown) ----
  W.DIETS = [
    { id: "unsure", label: "I'm not sure", desc: "No problem! We'll start with balanced, varied meals. You can change this anytime in Profile." },
    { id: "omni", label: "No restrictions (omnivore)", desc: "Meat, fish, dairy, eggs and plants are all on the table." },
    { id: "vegetarian", label: "Vegetarian", desc: "No meat, poultry or fish. Eggs and dairy are fine." },
    { id: "vegan", label: "Vegan", desc: "Plants only: no meat, fish, eggs or dairy." },
    { id: "pescatarian", label: "Pescatarian", desc: "No meat or poultry, but fish and seafood are included." },
    { id: "flexitarian", label: "Flexitarian (mostly plants)", desc: "Mostly vegetarian meals, with some meat or fish." },
    { id: "keto", label: "Keto", desc: "Very low carb, higher fat (about 12 g net carbs or fewer per meal)." },
    { id: "lowcarb", label: "Low-carb", desc: "Lower carbs than usual (about 25 g net carbs or fewer per meal)." },
    { id: "mediterranean", label: "Mediterranean", desc: "Fish, legumes, vegetables and olive oil. No red meat." },
    { id: "paleo", label: "Paleo", desc: "No grains, legumes, dairy or soy." },
    { id: "wholefoods", label: "Whole-foods", desc: "Skips processed items like bread, tortillas, soy sauce and plant milks." },
    { id: "glutenfree", label: "Gluten-free", desc: "Meals without wheat, barley, rye or regular oats." },
    { id: "dairyfree", label: "Dairy-free", desc: "No milk, yogurt or cheese." },
    { id: "halal", label: "Halal", desc: "No pork or alcohol in any meal. Buy certified halal meat." },
    { id: "kosher", label: "Kosher", desc: "No shellfish and no meat-and-dairy combos. Buy kosher-certified products." },
    { id: "highprotein", label: "High-protein", desc: "Meals chosen to be extra rich in protein." },
    { id: "antiinflam", label: "Anti-inflammatory", desc: "Leans on salmon, berries, leafy greens, olive oil, ginger and walnuts." },
    { id: "bloodtype", label: "Blood type diet", desc: "Favors foods popularly suggested for your ABO blood type. It's a popular idea, but strong scientific evidence for it is lacking." }
  ];

  // ---- Blood type diet (soft preferences; ingredient ids) ----
  W.BLOOD_RULES = {
    O: { prefer: ["beef", "chickenbreast", "salmon", "cod", "spinach", "kale", "broccoli", "sweetpotato", "walnuts", "oliveoil"], avoid: ["oats", "bread", "tortilla", "lentils", "blackbeans", "peanutbutter", "greekyogurt", "feta"] },
    A: { prefer: ["tofu", "lentils", "blackbeans", "salmon", "spinach", "kale", "broccoli", "carrot", "blueberries", "oliveoil", "walnuts", "peanutbutter"], avoid: ["beef", "chickenbreast", "turkey", "greekyogurt", "feta", "tomato"] },
    B: { prefer: ["salmon", "cod", "eggs", "greekyogurt", "feta", "oats", "sweetpotato", "kale", "spinach", "broccoli", "carrot", "beef"], avoid: ["chickenbreast", "lentils", "peanutbutter", "tahini", "tomato", "shrimp"] },
    AB: { prefer: ["tofu", "salmon", "cod", "greekyogurt", "feta", "lentils", "broccoli", "spinach", "eggs", "oliveoil", "walnuts"], avoid: ["chickenbreast", "beef", "blackbeans", "tahini"] }
  };

  W.BLOOD_TYPES = [["", "Choose..."], ["unknown", "I'm not sure"], ["O+", "O+"], ["O-", "O−"], ["A+", "A+"], ["A-", "A−"], ["B+", "B+"], ["B-", "B−"], ["AB+", "AB+"], ["AB-", "AB−"]];
  W.COMMON_ALLERGIES = ["peanuts", "tree nuts", "dairy", "eggs", "fish", "shellfish", "soy", "gluten", "sesame"];
  // ---------- every vitamin & mineral ----------
  // Nutrients with exact amounts in our food data (% of Daily Value, see ING.mi):
  W.TRACKED = ["A", "C", "D", "B12", "Fe", "Ca", "K", "Mg"];
  // For the rest we use well-known GOOD FOOD SOURCES (qualitative, not exact amounts).
  W.SOURCES = {
    B1: ["oats", "brownrice", "quinoa", "lentils", "blackbeans", "chickpeas", "bread", "peanutbutter", "tahini", "chia"],
    B2: ["eggs", "greekyogurt", "feta", "mushrooms", "spinach", "salmon", "beef"],
    B3: ["chickenbreast", "turkey", "tuna", "salmon", "beef", "peanutbutter", "mushrooms", "brownrice"],
    B5: ["avocado", "mushrooms", "eggs", "chickenbreast", "greekyogurt", "sweetpotato", "lentils", "salmon", "beef", "broccoli"],
    B6: ["banana", "chickpeas", "chickenbreast", "turkey", "salmon", "tuna", "beef", "sweetpotato", "avocado"],
    B7: ["eggs", "salmon", "avocado", "sweetpotato", "walnuts", "peanutbutter"],
    B9: ["spinach", "kale", "greens", "lentils", "chickpeas", "blackbeans", "avocado", "broccoli", "quinoa", "strawberries", "bread", "tortilla"],
    E: ["avocado", "spinach", "oliveoil", "peanutbutter", "sweetpotato", "bellpepper"],
    VK: ["kale", "spinach", "broccoli", "greens", "oliveoil", "avocado"],
    Choline: ["eggs", "beef", "chickenbreast", "turkey", "salmon", "cod", "shrimp", "broccoli", "cauliflower", "quinoa", "tofu"],
    Cr: ["broccoli", "banana", "oats", "bread", "beef", "turkey"],
    Cu: ["mushrooms", "lentils", "chickpeas", "quinoa", "oats", "walnuts", "tahini", "shrimp", "chia", "tofu"],
    I: ["cod", "shrimp", "tuna", "eggs", "greekyogurt", "feta", "salmon"],
    Mn: ["oats", "brownrice", "quinoa", "chia", "spinach", "chickpeas", "lentils", "walnuts", "tofu", "blueberries"],
    Mo: ["lentils", "blackbeans", "chickpeas", "oats", "quinoa", "brownrice", "tofu"],
    P: ["salmon", "tuna", "chickenbreast", "turkey", "beef", "eggs", "greekyogurt", "lentils", "oats", "quinoa", "chia", "tofu", "peanutbutter"],
    Se: ["tuna", "shrimp", "cod", "salmon", "eggs", "chickenbreast", "turkey", "beef", "brownrice"],
    Zn: ["beef", "lentils", "chickpeas", "blackbeans", "quinoa", "oats", "tofu", "tahini", "peanutbutter", "chia", "shrimp", "turkey", "eggs"]
  };
  for (const k in W.SOURCES) for (const id of W.SOURCES[k]) { if (!ING[id]) throw new Error("bad source id " + id); (ING[id].gs = ING[id].gs || []).push(k); }
  // Salty ingredients (used by the "keep sodium low" boost); number = how salty
  const HI_NA = { soysauce: 2, feta: 1, tuna: 1, bread: 0.8, tortilla: 1 };
  for (const id in HI_NA) ING[id].hiNa = HI_NA[id];

  // [key, label, short benefit]
  W.VITAMINS = [
    ["A", "Vitamin A", "vision, skin, immunity"], ["B1", "Vitamin B1 (thiamin)", "energy from carbs, nerves"], ["B2", "Vitamin B2 (riboflavin)", "energy, skin, eyes"],
    ["B3", "Vitamin B3 (niacin)", "energy, skin, digestion"], ["B5", "Vitamin B5 (pantothenic acid)", "energy, hormones"], ["B6", "Vitamin B6", "mood, brain, metabolism"],
    ["B7", "Vitamin B7 (biotin)", "hair, skin, nails"], ["B9", "Vitamin B9 (folate)", "cell growth, pregnancy"], ["B12", "Vitamin B12", "energy, nerves, blood"],
    ["C", "Vitamin C", "immunity, collagen, skin"], ["D", "Vitamin D", "bones, immunity, mood"], ["E", "Vitamin E", "skin, antioxidant"],
    ["VK", "Vitamin K", "blood clotting, bones"], ["Choline", "Choline", "brain, liver, memory"]
  ];
  W.MINERALS = [
    ["Ca", "Calcium", "bones, teeth, muscles"], ["Cr", "Chromium", "blood sugar balance"], ["Cu", "Copper", "iron use, collagen"], ["I", "Iodine", "thyroid, metabolism"],
    ["Fe", "Iron", "energy, red blood cells"], ["Mg", "Magnesium", "sleep, muscles, nerves"], ["Mn", "Manganese", "bones, metabolism"], ["Mo", "Molybdenum", "enzymes, detox"],
    ["P", "Phosphorus", "bones, energy"], ["K", "Potassium", "blood pressure, muscles"], ["Se", "Selenium", "thyroid, antioxidant"], ["Zn", "Zinc", "immunity, skin, healing"],
    ["Na", "Lower sodium", "keeps meals low in salt"]
  ];
  W.OTHER_NUTRIENTS = [["o3", "Omega-3", "heart, brain, skin"], ["fiber", "Fiber", "digestion, fullness"]];
  W.NUTRIENT_LABEL = Object.fromEntries([...W.VITAMINS, ...W.MINERALS, ...W.OTHER_NUTRIENTS].map(([k, l]) => [k, l]));
  Object.assign(W.MICRO_LABELS, { B1: "Vitamin B1", B2: "Vitamin B2", B3: "Vitamin B3", B5: "Vitamin B5", B6: "Vitamin B6", B7: "Biotin", B9: "Folate", E: "Vitamin E", VK: "Vitamin K", Choline: "Choline", Cr: "Chromium", Cu: "Copper", I: "Iodine", Mn: "Manganese", Mo: "Molybdenum", P: "Phosphorus", Se: "Selenium", Zn: "Zinc" });

  W.ETHNICITIES = [
    "American Indian or Alaska Native", "Arab / Middle Eastern", "Black / African American", "African (Sub-Saharan)",
    "Caribbean", "East Asian (Chinese, Japanese, Korean...)", "South Asian (Indian, Pakistani, Bangladeshi...)",
    "Southeast Asian (Filipino, Vietnamese, Thai...)", "Central Asian", "Hispanic / Latino", "Native Hawaiian or Pacific Islander",
    "North African", "White / European", "Mixed / multiracial", "Other", "Prefer not to say"
  ];

  // Full range of conditions, grouped for the dropdown (nothing here is required)
  W.CONDITION_GROUPS = [
    { g: "Heart & circulation", items: ["High blood pressure (hypertension)", "Low blood pressure", "High cholesterol", "High triglycerides", "Heart disease / coronary artery disease", "Heart failure", "Irregular heartbeat (atrial fibrillation)", "Past heart attack or stroke", "Poor circulation / peripheral artery disease", "Blood clots (DVT) or varicose veins"] },
    { g: "Diabetes & metabolism", items: ["Type 2 diabetes", "Type 1 diabetes", "Prediabetes", "Gestational diabetes", "Insulin resistance", "Metabolic syndrome", "PCOS (polycystic ovary syndrome)", "Obesity", "Underweight / unintentional weight loss", "Fatty liver disease (NAFLD)", "Gout / high uric acid"] },
    { g: "Digestive", items: ["Celiac disease", "Non-celiac gluten sensitivity", "Lactose intolerance", "IBS (irritable bowel syndrome)", "Crohn's disease", "Ulcerative colitis", "GERD / acid reflux", "Gastritis or stomach ulcer", "Gastroparesis", "Diverticulitis", "Chronic constipation", "Chronic diarrhea", "Gallstones / gallbladder problems", "SIBO", "Food intolerances (general)", "Bariatric surgery (gastric bypass or sleeve)", "Difficulty chewing or swallowing"] },
    { g: "Kidney, liver & urinary", items: ["Chronic kidney disease", "Kidney stones", "Dialysis", "Liver disease / cirrhosis", "Hepatitis", "Frequent urinary tract infections"] },
    { g: "Thyroid & hormones", items: ["Hypothyroidism", "Hyperthyroidism", "Hashimoto's thyroiditis", "Graves' disease", "Adrenal problems", "Low testosterone", "Menopause / perimenopause", "Endometriosis", "Irregular periods", "Trying to conceive / fertility concerns"] },
    { g: "Pregnancy & postpartum", items: ["Pregnant", "Breastfeeding", "Postpartum recovery"] },
    { g: "Bones, joints & muscles", items: ["Osteoporosis / osteopenia", "Osteoarthritis", "Rheumatoid arthritis", "Fibromyalgia", "Chronic pain", "Muscle loss (sarcopenia)", "Chronic fatigue syndrome"] },
    { g: "Autoimmune & immune", items: ["Lupus", "Multiple sclerosis", "Psoriasis", "Eczema", "Frequent colds / weak immunity", "HIV", "Long COVID"] },
    { g: "Lungs & breathing", items: ["Asthma", "COPD", "Sleep apnea", "Chronic sinus problems", "Seasonal allergies / hay fever"] },
    { g: "Blood & nutrient levels", items: ["Iron-deficiency anemia", "Vitamin B12 deficiency", "Vitamin D deficiency", "Low folate", "Sickle cell disease", "Hemochromatosis (iron overload)"] },
    { g: "Brain & mental health", items: ["Migraines", "Epilepsy", "Parkinson's disease", "Alzheimer's / dementia", "ADHD", "Autism", "Anxiety", "Depression", "Insomnia", "Brain fog", "PTSD", "Bipolar disorder"] },
    { g: "Eating & body image", items: ["Eating disorder (current or past)"] },
    { g: "Skin, hair, eyes & teeth", items: ["Acne", "Rosacea", "Hair loss / thinning", "Dandruff / scalp problems", "Brittle nails", "Very dry skin", "Eye disease (glaucoma or macular degeneration)", "Cataracts", "Gum disease"] },
    { g: "Cancer, surgery & transplant", items: ["Cancer (in treatment)", "Cancer survivor", "Chemotherapy or radiation", "Recent surgery", "Organ transplant"] },
    { g: "Other", items: ["Histamine intolerance", "Chronic inflammation", "Seasonal depression (SAD)", "Smoker", "Frequent dehydration"] }
  ];
  W.CONDITIONS = W.CONDITION_GROUPS.flatMap((x) => x.items);

  W.GOALS = {
    body: [
      ["lose", "Lose weight"], ["lose_slow", "Lose weight slowly & gently"], ["gain", "Gain weight"], ["muscle", "Build muscle"],
      ["recomp", "Lose fat & build muscle"], ["endurance", "Fuel endurance / athletic performance"], ["maintain", "Maintain my weight"], ["healthy", "Just eat healthier (no weight goal)"]
    ],
    micros: [...W.VITAMINS, ...W.MINERALS, ...W.OTHER_NUTRIENTS].map(([k, l]) => [k, l]),
    beauty: [
      ["skin", "Glowing skin"], ["clear", "Clearer skin"], ["aging", "Anti-aging / fewer wrinkles"], ["tone", "Even skin tone"], ["hydrate", "Hydrated, dewy skin"],
      ["hair", "Hair growth"], ["shine", "Shiny, healthy hair"], ["nails", "Strong nails"], ["eyes", "Bright, healthy eyes"], ["teeth", "Healthy teeth & gums"], ["puffy", "Less puffiness & bloating"]
    ],
    wellness: [
      ["energy", "More energy"], ["digestion", "Better digestion"], ["gut", "Gut health"], ["heart", "Heart health"], ["bones", "Bone health"], ["immunity", "Stronger immunity"],
      ["sleep", "Better sleep"], ["mood", "Mood & stress support"], ["focus", "Focus & brain health"], ["bloodsugar", "Steady blood sugar"], ["bp", "Healthy blood pressure"],
      ["inflam", "Less inflammation"], ["joints", "Joint support"], ["cholesterol", "Healthy cholesterol"], ["hormones", "Hormone balance"], ["pms", "Easier PMS"],
      ["menopause", "Menopause support"], ["recovery", "Workout recovery"], ["metabolism", "Healthy metabolism"]
    ],
    lifestyle: [["quick", "Quick meals (about 25 min or less)"], ["plants", "Eat more plants"], ["hiprot", "Extra protein"]]
  };
})(globalThis);
