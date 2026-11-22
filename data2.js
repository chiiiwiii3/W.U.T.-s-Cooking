/* W.U.T.'s Cooking — recipe pack 2.
   Adds ingredients and recipes to the catalog in data.js (load this file right after it).
   Ingredient nutrition is entered as raw USDA-style values per 100 g / 100 ml (or per item for u:"ea")
   in this order: [vit A mcg RAE, vit C mg, vit D mcg, B12 mcg, iron mg, calcium mg, potassium mg, magnesium mg]
   and converted to % Daily Value below. Values are rounded averages: good for planning, not medical use.
   Rules kept from pack 1: no pork, no alcohol (so every recipe stays halal-safe), no honey (so vegan tags stay right). */
(function (root) {
  "use strict";
  const W = root.WUT, ING = W.ING, RECIPES = W.RECIPES;

  const KEYS = ["A", "C", "D", "B12", "Fe", "Ca", "K", "Mg"], DVS = [900, 90, 20, 2.4, 18, 1300, 4700, 420];
  const dv = (raw) => { const o = {}; raw.forEach((x, i) => { const p = Math.round((x / DVS[i]) * 100); if (p >= 1) o[KEYS[i]] = p; }); return o; };
  const P = "Produce", M = "Meat & Seafood", D = "Dairy, Eggs & Tofu", G = "Grains, Beans & Bread", O = "Oils, Nuts & Pantry";
  // add(id, name, unit, category, per[kcal, protein, carbs, fat, fiber], rawMicros, extra, buyTip)
  const add = (id, n, u, cat, per, raw, extra, buy) => { if (ING[id]) throw new Error("duplicate ingredient " + id); ING[id] = Object.assign({ n, u, cat, per, mi: dv(raw), buy }, extra || {}); };

  // ---------- produce ----------
  add("potato", "White potatoes (Yukon Gold or russet)", "g", P, [77, 2, 17.5, 0.1, 2.2], [0, 19.7, 0, 0, 0.81, 12, 421, 23], {}, "Yukon Gold or russet potatoes, firm with no green patches or sprouts. Leave the skin on for the fiber.");
  add("cabbage", "Green cabbage", "g", P, [25, 1.3, 5.8, 0.1, 2.5], [5, 36.6, 0, 0, 0.47, 40, 170, 12], {}, "A small, heavy head of green cabbage with tight leaves. Pre-shredded coleslaw mix (no dressing) works too.");
  add("brusselssprouts", "Brussels sprouts", "g", P, [43, 3.4, 9, 0.3, 3.8], [38, 85, 0, 0, 1.4, 42, 389, 23], {}, "Small, bright green, tight Brussels sprouts. Fresh or frozen both work.");
  add("asparagus", "Asparagus", "g", P, [20, 2.2, 3.9, 0.1, 2.1], [38, 5.6, 0, 0, 2.14, 24, 202, 14], {}, "Medium-thin asparagus with firm tips. Snap off the woody ends.");
  add("greenbeans", "Green beans", "g", P, [31, 1.8, 7, 0.2, 2.7], [35, 12.2, 0, 0, 1, 37, 211, 25], {}, "Fresh green beans that snap cleanly, or frozen plain green beans.");
  add("peas", "Green peas (frozen)", "g", P, [81, 5.4, 14.5, 0.4, 5.7], [38, 40, 0, 0, 1.47, 25, 244, 33], { np: true }, "A bag of plain frozen green peas. Cook from frozen.");
  add("corn", "Sweet corn kernels (frozen)", "g", P, [98, 3.3, 23.5, 0.8, 2.8], [12, 7.2, 0, 0, 0.68, 4, 294, 32], { np: true }, "Plain frozen sweet corn, no sauce or butter.");
  add("eggplant", "Eggplant", "g", P, [25, 1, 6, 0.2, 3], [1, 2.2, 0, 0, 0.23, 9, 229, 14], {}, "A firm, glossy eggplant that feels heavy for its size.");
  add("butternut", "Butternut squash", "g", P, [45, 1, 11.7, 0.1, 2], [532, 21, 0, 0, 0.7, 48, 352, 34], {}, "A butternut squash with a hard, matte skin, or pre-cut cubes to save time.");
  add("beets", "Beets", "g", P, [43, 1.6, 9.6, 0.2, 2.8], [2, 4.9, 0, 0, 0.8, 16, 325, 23], {}, "Firm beets with smooth skin. Pre-cooked, vacuum-packed plain beets save time.");
  add("celery", "Celery", "g", P, [14, 0.7, 3, 0.2, 1.6], [22, 3.1, 0, 0, 0.2, 40, 260, 11], {}, "Crisp celery stalks.");
  add("tomatoescanned", "Canned diced tomatoes (no salt added)", "g", P, [16, 0.8, 3.5, 0.3, 1.9], [22, 12.6, 0, 0, 0.57, 33, 191, 10], {}, "Canned diced tomatoes with no salt added. A standard 400 g (14 oz) can is about 3 portions of sauce.");
  add("apple", "Apples", "ea", P, [95, 0.5, 25, 0.3, 4.4], [5, 8.4, 0, 0, 0.2, 11, 195, 9], { ea: ["medium apple", "medium apples"] }, "Crisp apples such as Honeycrisp, Gala or Granny Smith.");
  add("orange", "Oranges", "ea", P, [62, 1.2, 15.4, 0.2, 3.1], [14, 69.7, 0, 0, 0.1, 52, 237, 13], { ea: ["orange", "oranges"] }, "Heavy, firm navel oranges.");
  add("kiwi", "Kiwi", "ea", P, [42, 0.8, 10, 0.4, 2.1], [4, 64, 0, 0, 0.2, 24, 215, 11], { ea: ["kiwi", "kiwis"] }, "Kiwis that give slightly when pressed.");
  add("raspberries", "Raspberries", "g", P, [52, 1.2, 12, 0.7, 6.5], [2, 26.2, 0, 0, 0.7, 25, 151, 22], {}, "Fresh or frozen raspberries. Frozen is cheaper and great for smoothies and chia jars.");
  add("mango", "Mango", "g", P, [60, 0.8, 15, 0.4, 1.6], [54, 36.4, 0, 0, 0.16, 11, 168, 10], {}, "Ripe mango that smells sweet at the stem, or frozen mango chunks. One mango gives about 200 g of flesh.");
  add("bokchoy", "Bok choy", "g", P, [17, 1, 3.5, 0.2, 1.3], [223, 30.3, 0, 0, 0.44, 62, 228, 14], {}, "Baby or regular bok choy with crisp white stems and deep green leaves.");
  add("scallions", "Scallions (green onions)", "g", P, [32, 1.8, 7.3, 0.2, 2.6], [50, 18.8, 0, 0, 1.48, 72, 276, 20], {}, "A bunch of scallions with bright green tops.");

  // ---------- meat & seafood ----------
  add("chickenthigh", "Chicken thighs (boneless, skinless)", "g", M, [149, 18.6, 0, 7.9, 0], [0, 0, 0.1, 0.4, 0.6, 6, 272, 22], { t: "meat" }, "Boneless, skinless chicken thighs (about 110–150 g each). Raw weight.");
  add("groundbeef", "Lean ground beef (93% lean)", "g", M, [152, 21, 0, 7, 0], [0, 0, 0.1, 2.5, 2.3, 10, 320, 20], { t: "meat", red: true }, "93% lean ground beef. Raw weight. Use within 2 days or freeze.");
  add("tilapia", "Tilapia fillets (or other mild white fish)", "g", M, [96, 20, 0, 1.7, 0], [0, 0, 3.1, 1.58, 0.6, 10, 302, 27], { t: "fish", a: ["fish"] }, "Skinless tilapia fillets, fresh or frozen. Catfish or haddock also work.");
  add("sardines", "Canned sardines (in water or olive oil)", "g", M, [208, 24.6, 0, 11.5, 0], [32, 0, 4.8, 8.9, 2.9, 382, 397, 39], { t: "fish", a: ["fish"], o3: true, ai: true, hiNa: 0.8 }, "Canned boneless sardines in water or olive oil. A standard tin is about 90–120 g drained.");

  // ---------- dairy, eggs & soy ----------
  add("milk", "Milk (2%)", "ml", D, [50, 3.3, 4.8, 2, 0], [47, 0, 1.2, 0.45, 0, 120, 150, 11], { t: "dairy", a: ["dairy"], np: true }, "2% milk, or any milk you like. 1 liter is about 4 cups.");
  add("cottagecheese", "Cottage cheese (2%)", "g", D, [84, 11, 4.3, 2.3, 0], [69, 0, 0, 0.42, 0.13, 103, 120, 9], { t: "dairy", a: ["dairy"], np: true, hiNa: 0.5 }, "Low-fat (2%) cottage cheese. Look for brands with the shortest ingredient list.");
  add("mozzarella", "Part-skim mozzarella", "g", D, [254, 24.3, 2.8, 15.9, 0], [127, 0, 0.3, 0.82, 0.22, 782, 84, 23], { t: "dairy", a: ["dairy"], np: true, hiNa: 0.5 }, "Part-skim mozzarella: a ball in water or low-moisture block, or shredded.");
  add("parmesan", "Parmesan cheese", "g", D, [392, 35.8, 3.2, 25, 0], [207, 0, 0, 1.2, 0.8, 1184, 92, 44], { t: "dairy", a: ["dairy"], np: true, hiNa: 1 }, "A wedge of real Parmesan to grate. A little goes a long way.");
  add("tempeh", "Tempeh", "g", D, [192, 20, 7.6, 11, 4], [0, 0, 0, 0, 2.7, 111, 412, 81], { a: ["soy"], np: true }, "Plain soy tempeh, found near the tofu. A 227 g (8 oz) block is about 2 portions.");
  add("edamame", "Shelled edamame (frozen)", "g", D, [121, 11.9, 8.9, 5.2, 5.2], [9, 6.1, 0, 0, 2.1, 60, 482, 64], { a: ["soy"], np: true }, "Frozen shelled edamame (soybeans). Cook from frozen.");

  // ---------- grains & beans ----------
  add("pasta", "Whole-wheat pasta (dry)", "g", G, [350, 14, 72, 2.5, 10], [0, 0, 0, 0, 3.6, 40, 405, 143], { a: ["gluten"], np: true, proc: true }, "Whole-wheat spaghetti, penne or rotini. Weight is dry. Use a gluten-free pasta if you avoid gluten.");
  add("ricenoodles", "Rice noodles (dry)", "g", G, [364, 3.4, 80, 0.6, 1.6], [0, 0, 0, 0, 0.3, 6, 30, 22], { np: true, proc: true }, "Flat or thin dry rice noodles (gluten-free). Check the label that they are only rice and water. Weight is dry.");
  add("ricewhite", "White rice (dry)", "g", G, [365, 7.1, 80, 0.7, 1.3], [0, 0, 0, 0, 0.8, 28, 115, 25], { np: true }, "Jasmine or basmati rice. Weight is dry (it roughly triples when cooked).");
  add("whitebeans", "Canned white beans (cannellini)", "g", G, [114, 7, 20, 0.5, 5.5], [0, 0, 0, 0, 2.6, 60, 270, 38], { np: true }, "Canned cannellini or great northern beans, low-sodium if you can. Drained weight shown: a 425 g can is about 250 g drained.");
  add("kidneybeans", "Canned kidney beans", "g", G, [124, 8, 21.5, 1.1, 5.5], [0, 0.2, 0, 0, 1.5, 57, 277, 28], { np: true }, "Canned red kidney beans, low-sodium if you can. Drained weight shown: a 425 g can is about 250 g drained.");
  add("cornTortilla", "Corn tortillas", "ea", G, [52, 1.4, 10.7, 0.7, 1.5], [0, 0, 0, 0, 0.4, 45, 40, 19], { ea: ["corn tortilla", "corn tortillas"], np: true, proc: true, pack: { size: 30, label: "pack" } }, "Soft corn tortillas made with just corn, lime and water.");

  // ---------- nuts, seeds & pantry ----------
  add("almonds", "Almonds", "g", O, [579, 21, 22, 50, 12.5], [0, 0, 0, 0, 3.7, 269, 733, 270], { a: ["tree nuts"], ai: true }, "Raw or dry-roasted unsalted almonds.");
  add("cashews", "Cashews", "g", O, [553, 18, 30, 44, 3.3], [0, 0, 0, 0, 6.7, 37, 660, 292], { a: ["tree nuts"] }, "Raw or dry-roasted unsalted cashews.");
  add("pumpkinseeds", "Pumpkin seeds (pepitas)", "g", O, [559, 30, 11, 49, 6], [0, 0, 0, 0, 8.8, 46, 809, 592], {}, "Hulled, unsalted pepitas (green pumpkin seeds).");
  add("sunflowerseeds", "Sunflower seeds", "g", O, [584, 21, 20, 51, 8.6], [0, 0, 0, 0, 5.2, 78, 645, 325], {}, "Hulled, unsalted sunflower seeds.");
  add("flax", "Ground flaxseed", "g", O, [534, 18, 29, 42, 27], [0, 0, 0, 0, 5.7, 255, 813, 392], { o3: true, ai: true }, "Ground flaxseed (flax meal). Keep it in the fridge after opening.");
  add("broth", "Low-sodium vegetable broth", "ml", O, [6, 0.3, 1.2, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], {}, "Low-sodium or no-salt-added vegetable broth. A 1 liter carton covers about 4 portions.");

  // ---------- extra food-source tags for the vitamin & mineral boosts ----------
  const SRC = {
    B1: ["pasta", "sunflowerseeds", "peas", "edamame", "kidneybeans", "flax", "pumpkinseeds", "cashews"],
    B2: ["milk", "cottagecheese", "parmesan", "almonds", "tempeh", "sardines", "mozzarella", "sunflowerseeds"],
    B3: ["chickenthigh", "tilapia", "sardines", "groundbeef", "sunflowerseeds", "almonds", "tempeh", "peas", "pasta", "pumpkinseeds"],
    B5: ["sunflowerseeds", "chickenthigh", "groundbeef"],
    B6: ["potato", "chickenthigh", "groundbeef", "kidneybeans", "sunflowerseeds", "flax"],
    B7: ["almonds", "sardines"],
    B9: ["asparagus", "brusselssprouts", "peas", "edamame", "beets", "whitebeans", "kidneybeans", "cabbage", "bokchoy", "sunflowerseeds", "flax", "orange", "mango", "pumpkinseeds"],
    E: ["almonds", "sunflowerseeds", "butternut", "pumpkinseeds"],
    VK: ["brusselssprouts", "asparagus", "cabbage", "greenbeans", "bokchoy", "scallions", "peas", "kiwi", "celery", "cashews"],
    Choline: ["edamame", "chickenthigh", "groundbeef", "sardines"],
    Cr: ["potato", "groundbeef", "pasta"],
    Cu: ["cashews", "sunflowerseeds", "pumpkinseeds", "almonds", "potato", "kidneybeans", "whitebeans", "flax", "edamame", "tempeh", "pasta"],
    I: ["milk", "cottagecheese", "sardines"],
    Mn: ["pasta", "pumpkinseeds", "sunflowerseeds", "almonds", "flax", "cashews", "raspberries", "edamame", "kidneybeans", "whitebeans", "tempeh", "ricewhite"],
    Mo: ["whitebeans", "kidneybeans", "edamame", "peas"],
    P: ["cottagecheese", "mozzarella", "parmesan", "tilapia", "sardines", "chickenthigh", "groundbeef", "pumpkinseeds", "sunflowerseeds", "almonds", "cashews", "flax", "tempeh", "edamame", "kidneybeans", "pasta"],
    Se: ["tilapia", "sardines", "chickenthigh", "groundbeef", "cottagecheese", "pasta", "sunflowerseeds", "ricewhite", "cashews", "flax", "mozzarella", "parmesan"],
    Zn: ["groundbeef", "pumpkinseeds", "cashews", "sunflowerseeds", "almonds", "flax", "kidneybeans", "edamame", "tempeh", "parmesan", "chickenthigh", "pasta"]
  };
  for (const k in SRC) for (const id of SRC[k]) { if (!ING[id]) throw new Error("bad source id " + id); (ING[id].gs = ING[id].gs || []).push(k); W.SOURCES[k].push(id); }

  // ---------- recipe helper (every recipe is ONE serving) ----------
  const FR = (fridge, freezer, tip) => ({ fridge, freezer, tip });
  const NOFREEZE = "Not recommended. The texture suffers.";
  const R = (id, meal, name, emoji, time, ing, pantry, steps, store) => RECIPES.push({ id, meal, name, emoji, time, ing, pantry, steps, store });

  // ================= BREAKFAST =================
  R("b-appleoats", "Breakfast", "Apple Cinnamon Walnut Oatmeal", "🍎", 10,
    [["oats", 50], ["plantmilk", 200], ["apple", 1], ["walnuts", 10], ["chia", 5], ["cinnamon", 1.5]], ["Pinch of salt"],
    ["Dice the apple. Simmer the oats, plant milk, cinnamon and a pinch of salt in a small pot for about 5 minutes, stirring, until creamy.", "Stir in half of the apple and the chia seeds and cook 1 more minute.", "Pour into a bowl and top with the rest of the apple and the chopped walnuts."],
    FR("4 days in a sealed container (add the walnuts fresh).", "Single portions freeze up to 3 months.", "Reheat with a splash of milk to bring back the creaminess."));
  R("b-cottagemango", "Breakfast", "Cottage Cheese Mango Bowl", "🥭", 5,
    [["cottagecheese", 170], ["mango", 100], ["pumpkinseeds", 10], ["chia", 5]], [],
    ["Spoon the cottage cheese into a bowl.", "Top with diced mango, pumpkin seeds and chia seeds."],
    FR("Best fresh. The cottage cheese keeps 5 days once opened (check the date on the tub).", NOFREEZE, "Use frozen mango chunks, thawed, to keep this quick all year."));
  R("b-beanburrito", "Breakfast", "Black Bean Egg Breakfast Burrito", "🌯", 15,
    [["tortilla", 1], ["eggs", 2], ["blackbeans", 70], ["bellpepper", 50], ["spinach", 30], ["oliveoil", 5]], ["Ground cumin", "Salt", "Black pepper"],
    ["Warm the olive oil in a skillet over medium heat and cook the diced bell pepper for 3 minutes. Add the black beans and cumin and heat through.", "Add the spinach until wilted, then pour in the whisked eggs with a pinch of salt and pepper. Stir gently 2–3 minutes until fully set.", "Spoon into the warm tortilla, fold in the sides and roll."],
    FR("Filling keeps 4 days; wrapped burritos keep 3 days.", "Wrap in foil and freeze up to 2 months. Thaw overnight, then reheat until steaming hot.", "Make 4–6 and freeze them for ready-made breakfasts."));
  R("b-sweetpotatotoast", "Breakfast", "Sweet Potato Toast with Avocado & Egg", "🍠", 20,
    [["sweetpotato", 150], ["avocado", 0.5], ["eggs", 1], ["spinach", 20], ["pumpkinseeds", 5], ["lemon", 0.25]], ["Salt", "Black pepper"],
    ["Slice the sweet potato lengthwise into 2 slabs about ½ inch (1 cm) thick. Toast in a toaster on high 2 to 3 rounds, or roast at 425 °F (220 °C) for 15 minutes, flipping once, until tender.", "Mash the avocado with the lemon juice, salt and pepper.", "Fry or poach the egg until the white is fully set.", "Top the sweet potato with spinach, avocado, the egg and pumpkin seeds."],
    FR("Cooked sweet potato slabs keep 4 days. Build fresh.", "Cooked slabs freeze up to 2 months.", "Toast a batch of slabs on Sunday for quick breakfasts."));
  R("b-greensmoothie", "Breakfast", "Green Protein Smoothie", "🥤", 5,
    [["spinach", 40], ["banana", 1], ["greekyogurt", 150], ["plantmilk", 150], ["flax", 10]], [],
    ["Add the plant milk, yogurt, spinach, banana and flax to a blender in that order.", "Blend on high 45 to 60 seconds until completely smooth. Add a few ice cubes if you like it colder."],
    FR("Up to 24 hours in a sealed jar, stirred before drinking.", "Pour into ice cube trays and freeze. Blend the cubes with a splash of milk.", "Freeze the banana in chunks for a thicker, frostier smoothie."));
  R("b-berrysmoothiebowl", "Breakfast", "Berry Peanut Butter Smoothie Bowl", "🫐", 8,
    [["banana", 1], ["raspberries", 80], ["plantmilk", 120], ["peanutbutter", 15], ["chia", 10], ["pumpkinseeds", 10]], [],
    ["Blend the frozen banana, raspberries, plant milk and peanut butter until thick and smooth. Add only a splash of milk at a time so it stays spoonable.", "Pour into a bowl and top with chia and pumpkin seeds."],
    FR("Best fresh. Leftover blend keeps a few hours in the fridge.", "Freeze the blended base in a tub up to 1 month, then let it soften 10 minutes.", "Slice and freeze bananas ahead of time."));
  R("b-quinoaporridge", "Breakfast", "Warm Apple Almond Quinoa Bowl", "🥣", 25,
    [["quinoa", 60], ["plantmilk", 200], ["apple", 1], ["almonds", 15], ["cinnamon", 1], ["maple", 5]], [],
    ["Rinse the quinoa. Simmer it with the plant milk and cinnamon, covered, for 15 to 18 minutes until soft and the liquid is mostly absorbed.", "Stir in half of the diced apple and the maple syrup.", "Serve topped with the rest of the apple and chopped almonds."],
    FR("4 days in a sealed container.", "Up to 3 months in single portions.", "Make a double batch of quinoa and use half for lunch bowls."));
  R("b-salmonegg", "Breakfast", "Salmon & Spinach Egg Scramble", "🍳", 15,
    [["eggs", 2], ["salmon", 80], ["spinach", 40], ["avocado", 0.5], ["oliveoil", 5], ["lemon", 0.25]], ["Salt", "Black pepper"],
    ["Cut the salmon into small cubes. Cook in the olive oil over medium heat 3 to 4 minutes until it flakes and is opaque all the way through (145 °F / 63 °C).", "Add the spinach until wilted, then pour in the eggs whisked with salt and pepper. Stir gently 2 to 3 minutes until fully set.", "Serve with sliced avocado and a squeeze of lemon."],
    FR("2 days in an airtight container.", NOFREEZE, "Use leftover baked salmon from dinner and just warm it through."));
  R("b-yogurtorange", "Breakfast", "Orange Yogurt Crunch Cup", "🍊", 5,
    [["greekyogurt", 200], ["orange", 1], ["sunflowerseeds", 15], ["flax", 10], ["maple", 5]], [],
    ["Peel the orange and cut it into segments.", "Layer the yogurt in a glass with the orange, sunflower seeds and flaxseed.", "Finish with a small drizzle of maple syrup."],
    FR("2 days assembled (add the seeds just before eating to keep them crunchy).", NOFREEZE, "Zest a little of the orange peel into the yogurt for extra flavor."));
  R("b-tofumushroom", "Breakfast", "Savory Tofu Mushroom Skillet", "🍄", 20,
    [["tofu", 150], ["mushrooms", 100], ["spinach", 40], ["onion", 20], ["oliveoil", 10]], ["Turmeric", "Ground cumin", "Salt", "Black pepper"],
    ["Press the tofu between towels for 10 minutes, then crumble it.", "Cook the sliced mushrooms and diced onion in the olive oil over medium-high heat for 5 minutes until browned.", "Add the tofu with ½ tsp turmeric, a pinch of cumin, salt and pepper and cook 5 minutes until golden, then fold in the spinach until wilted."],
    FR("4 days in an airtight container.", "Up to 2 months.", "Roll it into a tortilla for a portable breakfast."));
  R("b-potatoskillet", "Breakfast", "Crispy Potato & Veggie Egg Skillet", "🥔", 25,
    [["potato", 200], ["eggs", 2], ["onion", 40], ["bellpepper", 60], ["oliveoil", 10]], ["Smoked paprika", "Salt", "Black pepper"],
    ["Dice the potato into small ½-inch (1 cm) cubes. Cook in the olive oil in a large skillet over medium-high heat 10 to 12 minutes, stirring now and then, until golden and tender.", "Add the onion, bell pepper, paprika, salt and pepper and cook 4 minutes.", "Make two wells, crack in the eggs, cover and cook 3 to 5 minutes until the whites are set."],
    FR("Potato base keeps 4 days (cook the eggs fresh).", "Base freezes up to 2 months.", "Parboil the cubes the night before to speed things up."));
  R("b-cottagetoast", "Breakfast", "Cottage Cheese Tomato Cucumber Toast", "🍅", 8,
    [["bread", 2], ["cottagecheese", 100], ["tomato", 100], ["cucumber", 50], ["oliveoil", 5]], ["Black pepper", "Dried oregano"],
    ["Toast the bread.", "Spread each slice with cottage cheese.", "Top with sliced tomato and cucumber, a drizzle of olive oil, black pepper and oregano."],
    FR("Best fresh. Keep components separate for up to 3 days.", NOFREEZE, "Swap in sliced radishes for crunch."));
  R("b-bananapancakes", "Breakfast", "Banana Oat Blender Pancakes", "🥞", 15,
    [["oats", 50], ["banana", 1], ["eggs", 2], ["cinnamon", 1], ["blueberries", 60], ["oliveoil", 5]], ["Baking powder (a pinch)"],
    ["Blend the oats, banana, eggs, cinnamon and baking powder until smooth. Let the batter rest 5 minutes.", "Heat a nonstick pan over medium heat with a little of the oil. Pour small pancakes and cook 2 to 3 minutes per side until set and golden.", "Serve topped with blueberries."],
    FR("Cooked pancakes keep 4 days.", "Freeze with parchment between them up to 2 months. Reheat in a toaster.", "Use certified gluten-free oats if you avoid gluten."));
  R("b-tempehhash", "Breakfast", "Tempeh Sweet Potato Hash", "🍠", 25,
    [["tempeh", 100], ["sweetpotato", 120], ["kale", 40], ["onion", 30], ["oliveoil", 10]], ["Smoked paprika", "Salt", "Black pepper"],
    ["Dice the sweet potato small and cook it in the olive oil over medium-high heat for 10 minutes until nearly tender.", "Crumble in the tempeh and add the diced onion. Cook 5 more minutes until browned.", "Add the chopped kale, paprika, salt and pepper and cook 2 to 3 minutes until the kale wilts."],
    FR("4 days in an airtight container.", "Up to 2 months.", "A hearty vegan breakfast that also works cold in a lunchbox."));
  R("b-turkeypatties", "Breakfast", "Turkey & Spinach Breakfast Patties", "🥩", 20,
    [["turkey", 120], ["spinach", 30], ["onion", 20], ["tomato", 100], ["oliveoil", 5]], ["Dried sage", "Salt", "Black pepper"],
    ["Finely chop the spinach and onion and mix them into the turkey with sage, salt and pepper. Shape into 2 patties.", "Cook in the olive oil over medium heat 5 to 6 minutes per side until no pink remains and the center reaches 165 °F (74 °C).", "Serve with sliced tomato."],
    FR("Cooked patties keep 4 days.", "Freeze cooked patties up to 3 months.", "Double the batch and freeze for fast breakfasts."));
  R("b-pbappletoast", "Breakfast", "Peanut Butter Apple Cinnamon Toast", "🍞", 8,
    [["bread", 2], ["peanutbutter", 25], ["apple", 1], ["chia", 5], ["cinnamon", 1]], [],
    ["Toast the bread and spread with peanut butter.", "Top with thin apple slices, chia seeds and a dusting of cinnamon."],
    FR("Best fresh.", NOFREEZE, "Pair with a glass of milk or plant milk for extra protein."));
  R("b-riceedamame", "Breakfast", "Savory Rice & Edamame Egg Bowl", "🍚", 20,
    [["brownrice", 50], ["edamame", 80], ["eggs", 1], ["scallions", 20], ["soysauce", 8], ["oliveoil", 5]], [],
    ["Cook the brown rice (or warm leftover rice).", "Simmer the edamame in a little water 4 minutes and drain.", "Fry the egg in the oil until the white is fully set.", "Layer rice, edamame and egg in a bowl, then top with sliced scallions and the soy sauce."],
    FR("Rice and edamame keep 4 days.", "Rice freezes well up to 3 months.", "A great use for leftover rice from dinner."));
  R("b-chiaraspberry", "Breakfast", "Raspberry Almond Chia Jar", "🍓", 5,
    [["chia", 30], ["plantmilk", 200], ["raspberries", 60], ["almonds", 15], ["maple", 5]], [],
    ["Stir the chia, plant milk and maple syrup in a jar. Wait 5 minutes and stir again to prevent clumps.", "Refrigerate at least 4 hours or overnight.", "Top with raspberries and chopped almonds."],
    FR("4 days.", NOFREEZE, "Make 3 jars at once for the work week."));
  R("b-kiwiyogurt", "Breakfast", "Kiwi Yogurt Seed Cup", "🥝", 5,
    [["greekyogurt", 180], ["kiwi", 2], ["pumpkinseeds", 15], ["oats", 20]], ["Ground cinnamon (optional)"],
    ["Peel and slice the kiwis.", "Layer the yogurt, kiwi, oats and pumpkin seeds in a glass or jar."],
    FR("Assembled 1 day (oats soften).", NOFREEZE, "Use rolled oats raw: they soften in the yogurt like overnight oats."));
  R("b-asparagusomelet", "Breakfast", "Asparagus Mushroom Mozzarella Omelet", "🍳", 15,
    [["eggs", 3], ["asparagus", 80], ["mushrooms", 40], ["mozzarella", 30], ["oliveoil", 5]], ["Salt", "Black pepper"],
    ["Slice the asparagus thin and the mushrooms, then cook in half of the oil for 4 minutes until tender.", "Whisk the eggs with salt and pepper. Heat the remaining oil in a nonstick pan over medium heat and pour in the eggs.", "As the edges set, lift them so the raw egg runs underneath. When nearly set, add the veggies and cheese, fold, and cook 1 more minute until no liquid egg remains."],
    FR("2 days.", NOFREEZE, "Blanch the asparagus ahead and keep it ready for omelets."));
  R("b-savoryoats", "Breakfast", "Savory Spinach Egg Oatmeal", "🥣", 12,
    [["oats", 50], ["broth", 200], ["spinach", 40], ["eggs", 1], ["scallions", 15], ["mushrooms", 40], ["oliveoil", 5]], ["Black pepper", "Pinch of salt"],
    ["Sauté the sliced mushrooms in the oil for 4 minutes.", "Simmer the oats in the broth 5 minutes until creamy, then stir in the spinach.", "Fry or poach the egg until the white is fully set.", "Top the oats with mushrooms, egg, sliced scallions and black pepper."],
    FR("Oats base keeps 4 days.", "Oats base freezes up to 3 months.", "Think of it like congee: savory, warming and filling."));

  // ================= LUNCH =================
  R("l-lemonthighbowl", "Lunch", "Lemon Chicken Thigh Rice Bowl", "🍋", 30,
    [["chickenthigh", 150], ["brownrice", 60], ["cucumber", 80], ["tomato", 80], ["lemon", 0.5], ["oliveoil", 10]], ["Dried oregano", "Salt", "Black pepper"],
    ["Cook the brown rice.", "Season the chicken with oregano, salt and pepper. Cook in half of the oil over medium heat 6 to 7 minutes per side until the center reaches 165 °F (74 °C). Rest 3 minutes and slice.", "Toss the diced cucumber and tomato with the lemon juice and the remaining oil.", "Build the bowl: rice, chicken, salad."],
    FR("3 to 4 days, with the salad stored separately.", "Cooked chicken and rice freeze up to 2 months.", "Thighs stay juicier than breast when reheated."));
  R("l-tuscansoup", "Lunch", "Tuscan White Bean & Kale Soup", "🍲", 35,
    [["whitebeans", 120], ["kale", 60], ["carrot", 50], ["celery", 40], ["onion", 40], ["tomatoescanned", 100], ["broth", 250], ["oliveoil", 10], ["garlic", 2]], ["Dried thyme", "Salt", "Black pepper"],
    ["Cook the diced onion, carrot and celery in the olive oil over medium heat for 6 minutes. Add the minced garlic for 30 seconds.", "Add the tomatoes, beans, broth and thyme. Simmer 15 minutes.", "Stir in the chopped kale and cook 5 more minutes. Season with salt and pepper."],
    FR("5 days.", "Up to 3 months.", "Even better the next day. Great packed in a thermos."));
  R("l-tomatolentil", "Lunch", "Roasted Tomato Lentil Soup", "🍅", 40,
    [["lentils", 50], ["tomatoescanned", 150], ["carrot", 50], ["onion", 40], ["broth", 250], ["spinach", 30], ["oliveoil", 5]], ["Ground cumin", "Salt", "Black pepper"],
    ["Cook the diced onion and carrot in the olive oil for 5 minutes.", "Add the rinsed lentils, tomatoes, broth and cumin. Simmer 20 to 25 minutes until the lentils are tender.", "Stir in the spinach until wilted and season to taste."],
    FR("5 days.", "Up to 3 months.", "Blend half the soup for a creamier texture."));
  R("l-tunawhitebean", "Lunch", "Tuna White Bean Salad", "🥗", 10,
    [["tuna", 100], ["whitebeans", 100], ["greens", 60], ["cucumber", 60], ["tomato", 80], ["lemon", 0.5], ["oliveoil", 10]], ["Dried oregano", "Salt", "Black pepper"],
    ["Drain and rinse the beans. Drain the tuna.", "Toss the beans, tuna, cucumber and tomato with the lemon juice, olive oil, oregano, salt and pepper.", "Serve over the greens."],
    FR("2 days (keep the greens separate).", NOFREEZE, "Limit tuna to a few times a week, as it contains some mercury."));
  R("l-chickenpasta", "Lunch", "Chicken & Broccoli Whole-Wheat Pasta", "🍝", 25,
    [["pasta", 70], ["chickenbreast", 120], ["broccoli", 100], ["tomato", 100], ["parmesan", 10], ["oliveoil", 10], ["garlic", 1]], ["Salt", "Black pepper"],
    ["Cook the pasta in salted water, adding the broccoli florets for the last 3 minutes. Drain.", "Cut the chicken into strips and cook in the oil 5 to 6 minutes until no pink remains (165 °F / 74 °C). Add the garlic for 30 seconds and the chopped tomato for 2 minutes.", "Toss everything together and finish with the grated Parmesan."],
    FR("4 days.", "Up to 2 months (without the Parmesan).", "Add a splash of water when reheating."));
  R("l-turkeytacobowl", "Lunch", "Turkey Taco Bowl", "🌮", 25,
    [["turkey", 120], ["blackbeans", 80], ["corn", 50], ["greens", 60], ["tomato", 60], ["avocado", 0.5], ["lemon", 0.25], ["oliveoil", 5]], ["Ground cumin", "Chili powder", "Salt"],
    ["Brown the turkey in the oil 6 to 8 minutes, breaking it up, until no pink remains (165 °F / 74 °C). Stir in cumin, chili powder and salt.", "Warm the beans and corn together.", "Build the bowl on the greens with turkey, beans and corn, tomato and avocado, finished with a squeeze of lemon."],
    FR("4 days (store avocado separately).", "Cooked turkey and beans freeze up to 3 months.", "Cook a double batch of turkey for dinner."));
  R("l-greekchickpea", "Lunch", "Greek Chickpea Salad", "🥙", 12,
    [["chickpeas", 120], ["cucumber", 100], ["tomato", 100], ["feta", 40], ["onion", 20], ["oliveoil", 10], ["lemon", 0.5]], ["Dried oregano", "Black pepper"],
    ["Drain and rinse the chickpeas.", "Combine with the diced cucumber, tomato and thinly sliced onion.", "Dress with the lemon juice, olive oil, oregano and pepper, then top with crumbled feta."],
    FR("3 days.", NOFREEZE, "Feta is salty. Taste before adding salt."));
  R("l-sardinesmash", "Lunch", "Sardine Avocado Smash on Greens", "🐟", 10,
    [["sardines", 90], ["avocado", 0.5], ["greens", 60], ["cucumber", 60], ["lemon", 0.5], ["oliveoil", 5]], ["Black pepper"],
    ["Drain the sardines and mash them with the avocado and lemon juice, keeping some chunks.", "Arrange the greens and sliced cucumber on a plate.", "Spoon the smash on top and finish with olive oil and pepper."],
    FR("1 day (avocado browns).", NOFREEZE, "Spread on toast if you want it more filling. Rich in omega-3 and calcium."));
  R("l-tofunoodlesalad", "Lunch", "Peanut Tofu Rice Noodle Salad", "🍜", 20,
    [["ricenoodles", 50], ["tofu", 120], ["carrot", 60], ["cucumber", 60], ["cabbage", 60], ["peanutbutter", 15], ["soysauce", 10], ["lemon", 0.5]], ["Warm water (to thin the sauce)"],
    ["Soak or boil the noodles per the package, rinse in cold water and drain.", "Press the tofu 10 minutes, cube it and pan-fry in a little oil until golden.", "Whisk the peanut butter, soy sauce, lemon juice and a splash of warm water into a sauce.", "Toss the noodles with shredded carrot, cucumber and cabbage, top with tofu and drizzle with sauce."],
    FR("3 days (keep the sauce separate).", NOFREEZE, "Pack the sauce on the side so the noodles don't get soggy."));
  R("l-eggsaladcups", "Lunch", "Egg Salad Lettuce Cups", "🥚", 20,
    [["eggs", 3], ["greekyogurt", 40], ["celery", 30], ["greens", 60], ["lemon", 0.25]], ["Dijon mustard (1 tsp)", "Salt", "Black pepper"],
    ["Hard-boil the eggs: cover with cold water, bring to a boil, turn off the heat, cover and let sit 11 minutes. Cool in ice water and peel.", "Chop the eggs and mix with the yogurt, diced celery, lemon juice, mustard, salt and pepper.", "Spoon into lettuce leaves."],
    FR("3 days.", NOFREEZE, "Hard-boiled eggs keep a week in the shell, so batch-cook them."));
  R("l-salmonpotato", "Lunch", "Salmon & Potato Green Bean Salad", "🥔", 30,
    [["salmon", 120], ["potato", 150], ["greenbeans", 80], ["eggs", 1], ["lemon", 0.5], ["oliveoil", 10]], ["Salt", "Black pepper"],
    ["Boil the diced potato 10 minutes, adding the green beans for the last 4 minutes. Drain.", "Bake the salmon at 400 °F (200 °C) for 12 to 15 minutes until it flakes and reaches 145 °F (63 °C).", "Hard-boil the egg 10 minutes and halve it.", "Toss the potatoes and beans with olive oil, lemon, salt and pepper, then top with flaked salmon and egg."],
    FR("2 days.", NOFREEZE, "Good served cold, which makes it an easy packed lunch."));
  R("l-beefricebowl", "Lunch", "Ground Beef & Cabbage Rice Bowl", "🍚", 25,
    [["groundbeef", 110], ["brownrice", 60], ["cabbage", 80], ["carrot", 50], ["scallions", 15], ["soysauce", 10], ["oliveoil", 5]], ["Ground ginger"],
    ["Cook the rice.", "Brown the beef in the oil 5 to 6 minutes until no pink remains (160 °F / 71 °C). Add the shredded cabbage and carrot and stir-fry 4 minutes.", "Stir in the soy sauce and ginger, then serve over the rice with sliced scallions."],
    FR("4 days.", "Up to 3 months.", "Use shredded coleslaw mix to save time."));
  R("l-currylentil", "Lunch", "Golden Lentil & Sweet Potato Soup", "🍛", 40,
    [["lentils", 60], ["sweetpotato", 100], ["carrot", 60], ["onion", 40], ["coconutmilk", 60], ["broth", 250], ["spinach", 30]], ["Ground turmeric", "Ground cumin", "Ground coriander", "Ground ginger", "Salt"],
    ["Cook the diced onion and carrot in a splash of broth for 5 minutes. Add the spices and stir 30 seconds.", "Add the rinsed lentils, diced sweet potato and the broth. Simmer 25 minutes until tender.", "Stir in the coconut milk and spinach and warm through."],
    FR("5 days.", "Up to 3 months.", "Creamy and mildly spiced, so it's a good starter curry."));
  R("l-tempehrice", "Lunch", "Ginger Tempeh Bok Choy Rice Bowl", "🥢", 25,
    [["tempeh", 110], ["brownrice", 60], ["bokchoy", 100], ["carrot", 40], ["soysauce", 10], ["ginger", 5], ["oliveoil", 5]], [],
    ["Cook the brown rice.", "Slice the tempeh and brown it in the oil for 3 to 4 minutes per side.", "Add the sliced bok choy, grated carrot, ginger and soy sauce and stir-fry 3 minutes.", "Serve over the rice."],
    FR("4 days.", "Up to 2 months.", "Steam the tempeh 10 minutes first if you find it bitter."));
  R("l-capresechickpea", "Lunch", "Mozzarella Tomato Chickpea Salad", "🍅", 10,
    [["mozzarella", 50], ["tomato", 150], ["chickpeas", 80], ["greens", 40], ["oliveoil", 10], ["lemon", 0.5]], ["Dried basil", "Black pepper"],
    ["Slice or tear the mozzarella and chop the tomatoes.", "Toss the chickpeas, tomatoes and greens with olive oil, lemon, basil and pepper.", "Top with mozzarella."],
    FR("2 days.", NOFREEZE, "Peak flavor in tomato season."));
  R("l-turkeywrap", "Lunch", "Turkey Avocado Veggie Wrap", "🌯", 15,
    [["tortilla", 1], ["turkey", 100], ["avocado", 0.5], ["greens", 40], ["tomato", 50], ["cucumber", 40], ["oliveoil", 5]], ["Salt", "Black pepper"],
    ["Cook the ground turkey in the oil 5 to 6 minutes until no pink remains (165 °F / 74 °C). Season and cool.", "Mash the avocado onto the tortilla and layer the greens, tomato, cucumber and turkey.", "Roll tightly, tucking in the sides."],
    FR("2 days wrapped in foil.", "Freeze the cooked turkey filling up to 3 months.", "Use leftover turkey patties from breakfast."));
  R("l-butternutquinoa", "Lunch", "Roasted Butternut Quinoa Salad", "🎃", 40,
    [["butternut", 150], ["quinoa", 50], ["kale", 40], ["pumpkinseeds", 15], ["oliveoil", 10], ["lemon", 0.5]], ["Salt", "Black pepper"],
    ["Toss the cubed squash with half the oil, salt and pepper. Roast at 425 °F (220 °C) for 25 minutes until caramelized.", "Cook the quinoa.", "Massage the chopped kale with lemon juice and remaining oil for 1 minute.", "Combine everything and top with pumpkin seeds."],
    FR("4 days.", "Squash and quinoa freeze up to 2 months.", "A fully plant-based lunch rich in magnesium and vitamin A."));
  R("l-codtacos", "Lunch", "Cod Cabbage Tacos", "🌮", 20,
    [["cod", 120], ["cornTortilla", 3], ["cabbage", 60], ["avocado", 0.5], ["lemon", 0.5], ["oliveoil", 5]], ["Ground cumin", "Salt", "Black pepper"],
    ["Season the cod with cumin, salt and pepper. Cook in the oil 3 to 4 minutes per side until it flakes and reaches 145 °F (63 °C).", "Shred the cabbage and toss with lemon juice and salt.", "Warm the tortillas in a dry pan. Fill with flaked fish, slaw and avocado."],
    FR("2 days (assemble fresh).", NOFREEZE, "Naturally gluten-free."));
  R("l-edamameslaw", "Lunch", "Edamame Crunch Slaw Bowl", "🥗", 20,
    [["edamame", 120], ["cabbage", 80], ["carrot", 50], ["quinoa", 40], ["peanutbutter", 10], ["soysauce", 8], ["lemon", 0.5]], ["Warm water (to thin the dressing)"],
    ["Cook the quinoa. Simmer the edamame 4 minutes and drain.", "Whisk the peanut butter, soy sauce, lemon juice and warm water into a dressing.", "Toss the shredded cabbage and carrot with the quinoa and edamame, then dress."],
    FR("4 days.", NOFREEZE, "High in protein, plant-based."));
  R("l-lemontilapia", "Lunch", "Lemon Tilapia with Rice & Peas", "🐠", 25,
    [["tilapia", 130], ["ricewhite", 50], ["peas", 80], ["lemon", 0.5], ["oliveoil", 10]], ["Salt", "Black pepper"],
    ["Cook the rice. Simmer the peas 3 minutes.", "Season the tilapia and cook in the oil 3 to 4 minutes per side until opaque and flaking (145 °F / 63 °C).", "Squeeze lemon over the fish and serve with the rice and peas."],
    FR("2 days.", "Cooked fish freezes up to 2 months.", "Use any mild white fish."));
  R("l-chickensweetpotato", "Lunch", "Chicken & Sweet Potato Power Bowl", "🍠", 35,
    [["chickenbreast", 130], ["sweetpotato", 150], ["spinach", 40], ["avocado", 0.5], ["oliveoil", 10]], ["Smoked paprika", "Salt", "Black pepper"],
    ["Roast the cubed sweet potato with half the oil, paprika, salt and pepper at 425 °F (220 °C) for 25 minutes.", "Season the chicken and pan-cook in the rest of the oil 6 to 7 minutes per side until 165 °F (74 °C). Rest and slice.", "Build the bowl: spinach, sweet potato, chicken and avocado."],
    FR("4 days (avocado fresh).", "Chicken and sweet potato freeze up to 2 months.", "Batch cook the chicken for several meals."));

  // ================= DINNER =================
  R("d-thighspotatobeans", "Dinner", "Sheet-Pan Chicken Thighs, Potatoes & Green Beans", "🍗", 45,
    [["chickenthigh", 160], ["potato", 200], ["greenbeans", 100], ["oliveoil", 10], ["lemon", 0.5], ["garlic", 2]], ["Dried thyme", "Salt", "Black pepper"],
    ["Heat the oven to 425 °F (220 °C). Toss the cubed potatoes with half the oil, salt, pepper and thyme and roast 15 minutes.", "Add the chicken thighs, green beans and garlic tossed in the remaining oil. Roast 20 to 25 minutes until the chicken reaches 165 °F (74 °C).", "Finish with lemon juice."],
    FR("4 days.", "Up to 2 months.", "One pan, minimal washing up."));
  R("d-turkeymeatballs", "Dinner", "Turkey Meatballs with Zucchini & Tomato Sauce", "🍝", 40,
    [["turkey", 130], ["oats", 15], ["eggs", 1], ["zucchini", 150], ["tomatoescanned", 150], ["onion", 30], ["garlic", 1], ["oliveoil", 5]], ["Dried oregano", "Salt", "Black pepper"],
    ["Mix the turkey, oats, egg, half the grated onion, salt, pepper and oregano. Roll into small balls.", "Cook the rest of the onion and the garlic in the oil, add the tomatoes and simmer 10 minutes.", "Add the meatballs, cover and simmer 15 to 18 minutes until they reach 165 °F (74 °C). Add the spiralized or sliced zucchini for the last 3 minutes."],
    FR("4 days.", "Meatballs in sauce freeze up to 3 months.", "Use gluten-free oats if needed."));
  R("d-beefcabbage", "Dinner", "Ginger Beef & Cabbage Stir-Fry", "🥩", 20,
    [["beef", 130], ["cabbage", 150], ["carrot", 50], ["ginger", 5], ["soysauce", 10], ["oliveoil", 10], ["scallions", 15]], [],
    ["Slice the beef thin against the grain. Heat half the oil in a hot wok or skillet and sear the beef 2 to 3 minutes. Remove.", "Stir-fry the cabbage, carrot and ginger in the remaining oil for 4 to 5 minutes.", "Return the beef with the soy sauce and cook 1 to 2 minutes until it reaches 145 °F (63 °C). Top with scallions."],
    FR("3 days.", "Up to 2 months.", "Low carb. Serve over rice if you want a heartier plate."));
  R("d-salmonasparagus", "Dinner", "Lemon Salmon with Asparagus & Potatoes", "🐟", 35,
    [["salmon", 150], ["asparagus", 120], ["potato", 150], ["lemon", 0.5], ["oliveoil", 10]], ["Salt", "Black pepper", "Dried dill (optional)"],
    ["Roast the cubed potatoes tossed in half the oil at 425 °F (220 °C) for 15 minutes.", "Add the salmon and the asparagus tossed in the remaining oil. Roast 12 to 15 minutes until the salmon flakes and reaches 145 °F (63 °C).", "Season with salt, pepper and lemon."],
    FR("2 days.", "Cooked salmon freezes up to 2 months.", "Rich in omega-3, vitamin D and folate."));
  R("d-eggplantchickpea", "Dinner", "Eggplant Chickpea Tomato Stew", "🍆", 40,
    [["eggplant", 150], ["chickpeas", 100], ["tomatoescanned", 150], ["onion", 40], ["garlic", 2], ["spinach", 30], ["oliveoil", 10]], ["Ground cumin", "Smoked paprika", "Salt", "Black pepper"],
    ["Cube the eggplant and cook in the oil over medium-high heat 8 minutes until golden. Add the onion and garlic for 3 minutes.", "Add the tomatoes, chickpeas and spices and simmer 15 to 20 minutes until thick.", "Stir in the spinach and season."],
    FR("5 days.", "Up to 3 months.", "Serve with rice or bread."));
  R("d-tempehstirfry", "Dinner", "Tempeh Broccoli Pepper Stir-Fry", "🥦", 25,
    [["tempeh", 130], ["broccoli", 120], ["bellpepper", 80], ["brownrice", 60], ["soysauce", 10], ["ginger", 5], ["oliveoil", 10]], [],
    ["Cook the brown rice.", "Cube the tempeh and brown it in half the oil 4 to 5 minutes. Remove.", "Stir-fry the broccoli, bell pepper and ginger in the remaining oil 5 minutes.", "Return the tempeh, add the soy sauce and serve over rice."],
    FR("4 days.", "Up to 2 months.", "A vegan, high-protein weeknight dinner."));
  R("d-tilapiasprouts", "Dinner", "Baked Tilapia with Roasted Brussels Sprouts & Squash", "🐠", 35,
    [["tilapia", 150], ["brusselssprouts", 150], ["butternut", 100], ["oliveoil", 10], ["lemon", 0.5]], ["Salt", "Black pepper"],
    ["Toss the halved sprouts and cubed squash in half the oil, salt and pepper. Roast at 425 °F (220 °C) for 15 minutes.", "Add the seasoned tilapia fillets brushed with the remaining oil and bake 10 to 12 minutes until they flake and reach 145 °F (63 °C).", "Serve with lemon."],
    FR("2 days.", "Roasted vegetables freeze up to 2 months.", "A low-fat, high-protein dinner with no onion or garlic."));
  R("d-threebeanchili", "Dinner", "Three-Bean Veggie Chili", "🌶️", 40,
    [["kidneybeans", 80], ["blackbeans", 80], ["tomatoescanned", 200], ["onion", 50], ["bellpepper", 80], ["carrot", 40], ["oliveoil", 5]], ["Chili powder", "Ground cumin", "Salt"],
    ["Cook the diced onion, bell pepper and carrot in the oil 6 minutes.", "Add the spices and stir 30 seconds, then the drained beans and tomatoes.", "Simmer 20 to 25 minutes until thick."],
    FR("5 days.", "Up to 3 months.", "Great with a sprinkle of Greek yogurt or avocado."));
  R("d-beefzucchini", "Dinner", "Cheesy Beef & Zucchini Skillet", "🧀", 25,
    [["groundbeef", 130], ["zucchini", 150], ["mushrooms", 80], ["spinach", 40], ["tomatoescanned", 60], ["mozzarella", 30], ["oliveoil", 5]], ["Dried oregano", "Salt", "Black pepper"],
    ["Brown the beef in the oil 5 to 6 minutes until no pink remains (160 °F / 71 °C).", "Add the sliced zucchini and mushrooms and cook 5 minutes, then the tomatoes, spinach and oregano.", "Top with mozzarella, cover and cook 2 minutes until melted."],
    FR("4 days.", "Up to 2 months (cheese texture softens).", "Low carb and ready in one pan."));
  R("d-garlicshrimpasparagus", "Dinner", "Lemon Garlic Shrimp & Asparagus", "🍤", 15,
    [["shrimp", 150], ["asparagus", 150], ["oliveoil", 10], ["lemon", 0.5], ["garlic", 2]], ["Salt", "Black pepper"],
    ["Heat the oil in a skillet over medium-high heat and cook the asparagus 4 minutes.", "Add the shrimp and sliced garlic. Cook 2 to 3 minutes per side until pink and opaque.", "Finish with lemon juice, salt and pepper."],
    FR("2 days.", NOFREEZE, "Very low carb."));
  R("d-chickennoodlestirfry", "Dinner", "Chicken Bok Choy Rice Noodle Stir-Fry", "🍜", 25,
    [["chickenbreast", 130], ["ricenoodles", 50], ["bokchoy", 100], ["carrot", 50], ["ginger", 5], ["soysauce", 10], ["oliveoil", 10]], [],
    ["Soak or boil the noodles per the package and drain.", "Stir-fry the sliced chicken in half the oil 5 to 6 minutes until no pink remains (165 °F / 74 °C). Remove.", "Stir-fry the carrot, bok choy and ginger in the rest of the oil 3 to 4 minutes, then add the noodles, chicken and soy sauce and toss until hot."],
    FR("3 days.", NOFREEZE, "Gluten-free if you use tamari."));
  R("d-lentilbutternutstew", "Dinner", "Hearty Lentil & Butternut Stew", "🥣", 45,
    [["lentils", 60], ["butternut", 150], ["kale", 50], ["onion", 40], ["carrot", 40], ["broth", 250], ["tomatoescanned", 80], ["oliveoil", 5]], ["Ground cumin", "Dried thyme", "Salt", "Black pepper"],
    ["Cook the diced onion and carrot in the oil 5 minutes.", "Add the rinsed lentils, cubed squash, tomatoes, broth and spices. Simmer 25 minutes until tender.", "Stir in the chopped kale and cook 5 minutes."],
    FR("5 days.", "Up to 3 months.", "Full of fiber, iron and vitamin A. Fully plant-based."));
  R("d-codwhitebean", "Dinner", "Baked Cod with Tomatoes & White Beans", "🐟", 30,
    [["cod", 150], ["whitebeans", 100], ["tomatoescanned", 150], ["spinach", 40], ["onion", 30], ["oliveoil", 10], ["garlic", 2]], ["Dried oregano", "Salt", "Black pepper"],
    ["Cook the diced onion and garlic in the oil 4 minutes. Add the tomatoes, beans and oregano and simmer 8 minutes.", "Stir in the spinach, nestle in the cod and spoon sauce over it. Cover and simmer 8 to 10 minutes until the fish flakes and reaches 145 °F (63 °C)."],
    FR("2 days.", "Sauce freezes up to 3 months (cook fish fresh).", "Mediterranean-style, high in protein and fiber."));
  R("d-turkeyzucchiniboats", "Dinner", "Turkey Zucchini Boats", "🥒", 40,
    [["zucchini", 250], ["turkey", 120], ["tomatoescanned", 100], ["mozzarella", 40], ["onion", 30], ["oliveoil", 5]], ["Dried oregano", "Salt", "Black pepper"],
    ["Halve the zucchini lengthwise and scoop out the centers, leaving a ½-inch (1 cm) shell. Chop the scooped flesh.", "Cook the onion, turkey and zucchini flesh in the oil 6 to 8 minutes until no pink remains. Add the tomatoes and oregano.", "Fill the shells, top with mozzarella and bake at 400 °F (200 °C) for 20 minutes until the turkey filling reaches 165 °F (74 °C)."],
    FR("4 days.", "Up to 2 months.", "Low carb."));
  R("d-edamametofubowl", "Dinner", "Tofu Edamame Ginger Stir-Fry Bowl", "🍚", 25,
    [["tofu", 120], ["edamame", 80], ["broccoli", 100], ["carrot", 40], ["brownrice", 50], ["soysauce", 10], ["ginger", 5], ["oliveoil", 10]], [],
    ["Cook the brown rice. Press the tofu 10 minutes and cube.", "Pan-fry the tofu in half the oil until golden on all sides.", "Stir-fry the broccoli, carrot, edamame and ginger in the remaining oil 5 minutes, then add the tofu and soy sauce."],
    FR("4 days.", "Up to 2 months.", "Fully plant-based and rich in protein."));
  R("d-sardinepasta", "Dinner", "Sardine & Tomato Whole-Wheat Pasta", "🍝", 25,
    [["pasta", 70], ["sardines", 90], ["tomatoescanned", 150], ["spinach", 40], ["oliveoil", 5], ["garlic", 2]], ["Dried oregano", "Black pepper"],
    ["Cook the pasta in salted water and drain.", "Warm the oil with the garlic 30 seconds, add the tomatoes and simmer 8 minutes.", "Flake in the sardines and add the spinach until wilted. Toss with the pasta."],
    FR("3 days.", "Sauce freezes up to 3 months.", "A budget-friendly source of omega-3, calcium and vitamin D."));
  R("d-chickensweetpotatosprouts", "Dinner", "Chicken, Sweet Potato & Brussels Sprouts Tray Bake", "🍠", 40,
    [["chickenbreast", 140], ["sweetpotato", 180], ["brusselssprouts", 100], ["oliveoil", 10]], ["Smoked paprika", "Salt", "Black pepper"],
    ["Heat the oven to 425 °F (220 °C). Roast the cubed sweet potato tossed in half the oil, paprika, salt and pepper for 15 minutes.", "Add the halved sprouts and chicken breast brushed with the rest of the oil. Roast 20 to 25 minutes until the chicken reaches 165 °F (74 °C). Rest 5 minutes before slicing."],
    FR("4 days.", "Up to 2 months.", "No onion or garlic needed."));
  R("d-beefsweetpotatoskillet", "Dinner", "Beef & Sweet Potato Skillet", "🍠", 30,
    [["groundbeef", 120], ["sweetpotato", 150], ["bellpepper", 60], ["onion", 30], ["spinach", 40], ["oliveoil", 5]], ["Smoked paprika", "Ground cumin", "Salt", "Black pepper"],
    ["Cook the diced sweet potato in the oil 8 to 10 minutes until nearly tender.", "Add the beef, onion and pepper and cook 6 to 7 minutes until no pink remains (160 °F / 71 °C).", "Stir in the spices and spinach until wilted."],
    FR("4 days.", "Up to 3 months.", "A high-iron, high-protein one-pan meal."));
  R("d-lentilbolognese", "Dinner", "Mushroom Lentil Bolognese over Zucchini Noodles", "🍄", 40,
    [["lentils", 60], ["mushrooms", 100], ["tomatoescanned", 200], ["onion", 40], ["carrot", 40], ["zucchini", 200], ["oliveoil", 10]], ["Dried oregano", "Salt", "Black pepper"],
    ["Finely chop the onion, carrot and mushrooms and cook in the oil 8 minutes.", "Add the rinsed lentils, tomatoes and oregano with 150 ml water. Simmer 25 minutes until the lentils are tender.", "Spiralize the zucchini, sauté 2 minutes, and top with the bolognese."],
    FR("5 days (sauce).", "Sauce freezes up to 3 months.", "Plant-based. Serve over pasta if you prefer."));
  R("d-peaparmquinoa", "Dinner", "Creamy Pea & Parmesan Quinoa", "🌱", 30,
    [["quinoa", 70], ["peas", 100], ["parmesan", 15], ["spinach", 40], ["broth", 200], ["onion", 30], ["oliveoil", 10]], ["Black pepper"],
    ["Cook the diced onion in the oil 4 minutes. Add the rinsed quinoa and broth, cover and simmer 15 minutes.", "Stir in the peas and spinach for 3 minutes.", "Finish with grated Parmesan and pepper."],
    FR("4 days.", "Up to 2 months (without the cheese).", "Vegetarian."));
  R("d-salmonbeets", "Dinner", "Roasted Salmon with Beets & Greens", "🥬", 45,
    [["salmon", 140], ["beets", 150], ["kale", 50], ["oliveoil", 10], ["lemon", 0.5]], ["Salt", "Black pepper"],
    ["Roast the diced beets tossed in half the oil, salt and pepper at 425 °F (220 °C) for 25 to 30 minutes until tender.", "Add the salmon and bake 12 to 15 minutes until it flakes and reaches 145 °F (63 °C).", "Massage the kale with the remaining oil and lemon juice and serve under the salmon and beets."],
    FR("2 days.", "Roasted beets freeze up to 2 months.", "Pre-cooked plain beets cut the time to 20 minutes."));
  R("d-cauliflowerrice", "Dinner", "Chicken Cauliflower Fried 'Rice'", "🥦", 25,
    [["chickenbreast", 130], ["cauliflower", 200], ["eggs", 1], ["peas", 50], ["carrot", 40], ["soysauce", 10], ["oliveoil", 10]], [],
    ["Pulse the cauliflower in a food processor into rice-sized pieces.", "Stir-fry the diced chicken in half the oil 5 to 6 minutes until no pink remains (165 °F / 74 °C). Remove.", "Scramble the egg in the pan until fully set. Add the cauliflower, peas and carrot and cook 5 minutes, then return the chicken and add the soy sauce."],
    FR("4 days.", "Up to 2 months.", "Low carb, no onion or garlic."));
  R("d-shrimpnoodlebowl", "Dinner", "Ginger Shrimp Rice Noodle Bowl", "🍤", 25,
    [["shrimp", 130], ["ricenoodles", 50], ["bokchoy", 100], ["carrot", 40], ["ginger", 5], ["soysauce", 8], ["oliveoil", 5]], [],
    ["Cook the noodles and drain.", "Stir-fry the carrot, bok choy and ginger in the oil 3 minutes.", "Add the shrimp and cook 2 to 3 minutes until pink and opaque, then toss with the noodles and soy sauce."],
    FR("2 days.", NOFREEZE, "Gluten-free if you use tamari."));
})(globalThis);
