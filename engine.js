/* W.U.T.'s Cooking — the "brain": nutrition math, allergy/diet filtering,
   meal-plan generation and shopping lists. No DOM code in here, so it can be tested in Node. */
(function (root) {
  "use strict";
  const W = root.WUT;
  const { ING, RECIPES, BLOOD_RULES, MICRO_LABELS, CATS } = W;

  // ---------- small helpers ----------
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function daysBetween(a, b) {
    const pa = a.split("-").map(Number), pb = b.split("-").map(Number);
    return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
  }

  // ---------- nutrition ----------
  function sumNutrition(lines) {
    const t = { cal: 0, p: 0, c: 0, f: 0, fi: 0, mi: {} };
    for (const [id, amt] of lines) {
      const g = ING[id];
      const k = g.u === "ea" ? amt : amt / 100;
      t.cal += g.per[0] * k; t.p += g.per[1] * k; t.c += g.per[2] * k; t.f += g.per[3] * k; t.fi += g.per[4] * k;
      for (const m in g.mi) t.mi[m] = (t.mi[m] || 0) + g.mi[m] * k;
    }
    return t;
  }

  // Pre-compute tags for every built-in recipe.
  for (const r of RECIPES) {
    const gs = r.ing.map(([id]) => ING[id]);
    const has = (t) => gs.some((g) => g.t === t);
    const meat = has("meat"), fish = has("fish"), shell = has("shellfish"), dairy = has("dairy"), egg = has("egg");
    r.allergens = [...new Set(gs.flatMap((g) => g.a || []))];
    r.base = sumNutrition(r.ing);
    r.net = r.base.c - r.base.fi;
    r.ids = r.ing.map((x) => x[0]);
    r.o3 = gs.some((g) => g.o3);
    r.aiCount = gs.filter((g) => g.ai).length;
    r.gsCount = {};
    gs.forEach((g) => (g.gs || []).forEach((k) => { r.gsCount[k] = (r.gsCount[k] || 0) + 1; }));
    r.na = gs.reduce((n, g) => n + (g.hiNa || 0), 0);
    r.nVeg = gs.filter((g) => g.cat === "Produce").length;
    r.pricey = gs.filter((g) => ["salmon", "beef", "shrimp", "walnuts", "feta"].some((k) => ING[k] === g)).length;
    r.tags = {
      vegan: !(meat || fish || shell || dairy || egg),
      vegetarian: !(meat || fish || shell),
      pescatarian: !meat,
      red: gs.some((g) => g.red),
      paleo: !gs.some((g) => g.np),
      gf: !r.allergens.includes("gluten"),
      df: !r.allergens.includes("dairy"),
      kosher: !shell && !(meat && dairy),
      wholefoods: !gs.some((g) => g.proc),
      keto: r.net <= 12,
      lowcarb: r.net <= 25
    };
  }
  const RECIPE_MAP = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

  function recipeById(id, st) {
    return RECIPE_MAP[id] || ((st && st.myRecipes) || []).find((x) => x.id === id) || null;
  }
  // Nutrition for a recipe at a portion size (user recipes only know what the user typed).
  function nutr(r, portion = 1) {
    if (r.user) {
      const n = r.nut || {};
      const known = !!(n.cal || n.p || n.c || n.f);
      return { cal: (n.cal || 0) * portion, p: (n.p || 0) * portion, c: (n.c || 0) * portion, f: (n.f || 0) * portion, fi: 0, mi: {}, known };
    }
    const b = r.base, mi = {};
    for (const m in b.mi) mi[m] = b.mi[m] * portion;
    return { cal: b.cal * portion, p: b.p * portion, c: b.c * portion, f: b.f * portion, fi: b.fi * portion, mi, known: true };
  }
  function richIn(n, max = 3) {
    return Object.entries(n.mi)
      .filter(([, v]) => v >= 20)
      .sort((a, b) => b[1] - a[1])
      .slice(0, max)
      .map(([k, v]) => ({ k, label: MICRO_LABELS[k], pct: Math.round(v) }));
  }

  // ---------- allergies (always a HARD filter) ----------
  function allergyTerms(raw) {
    const a = String(raw || "").toLowerCase().trim();
    const cats = new Set();
    if (/peanut|groundnut/.test(a)) cats.add("peanuts");
    if (/tree\s*nut|almond|walnut|cashew|pecan|pistachio|hazelnut|macadamia/.test(a)) cats.add("tree nuts");
    if (/^nuts?$/.test(a)) { cats.add("tree nuts"); cats.add("peanuts"); }
    if (/dairy|milk|lactose|cheese|yogurt|yoghurt|whey|casein/.test(a)) cats.add("dairy");
    if (/\begg/.test(a)) cats.add("eggs");
    if (/\bfish\b|salmon|\bcod\b|tuna|anchov|sardine|tilapia|halibut/.test(a)) cats.add("fish");
    if (/shellfish|shrimp|prawn|crab|lobster|crustacean|mollus|clam|oyster|mussel|scallop/.test(a)) cats.add("shellfish");
    if (/\bsoy|soya|edamame|tofu/.test(a)) cats.add("soy");
    if (/gluten|wheat|celiac|coeliac|barley|\brye\b/.test(a)) cats.add("gluten");
    if (/sesame|tahini/.test(a)) cats.add("sesame");
    const words = new Set();
    const SYN = [
      [/citrus/, ["lemon", "lime", "orange", "grapefruit"]], [/nightshade/, ["tomato", "pepper", "eggplant", "potato"]],
      [/poultry/, ["chicken", "turkey", "duck"]], [/red meat|mammal|alpha/, ["beef", "pork", "lamb"]],
      [/allium|onion|garlic/, ["onion", "garlic", "shallot", "leek"]], [/legume/, ["lentil", "chickpea", "bean", "pea "]],
      [/berr/, ["blueberr", "strawberr", "raspberr", "blackberr"]], [/\bseeds?\b/, ["chia", "flax", "sunflower seed", "pumpkin seed", "hemp"]],
      [/corn|maize/, ["corn", "polenta", "cornmeal"]], [/coconut/, ["coconut"]], [/\boats?\b/, ["oat"]], [/mustard/, ["mustard"]],
      [/celery/, ["celery", "celeriac"]], [/sulfite|sulphite/, ["wine", "dried apricot"]], [/lupin/, ["lupin"]], [/\bpork\b/, ["pork", "bacon", "ham"]]
    ];
    for (const [re, ws] of SYN) if (re.test(a)) ws.forEach((x) => words.add(x));
    if (a.length >= 3) {
      words.add(a);
      words.add(a.replace(/ies$/, "y"));
      words.add(a.replace(/es$/, ""));
      words.add(a.replace(/s$/, ""));
    }
    return { cats, words: [...words].filter((w) => w.length >= 3) };
  }
  function allergyHits(r, allergies) {
    const hits = [];
    const names = r.user ? (r.ingLines || []).map((s) => s.toLowerCase()) : r.ing.map(([id]) => ING[id].n.toLowerCase());
    for (const raw of allergies || []) {
      if (!String(raw).trim() || /^(none|no|n\/a)$/i.test(String(raw).trim())) continue;
      const { cats, words } = allergyTerms(raw);
      let hit = false;
      if (!r.user) for (const c of cats) if (r.allergens.includes(c)) hit = true;
      if (!hit) hit = words.some((w) => names.some((n) => n.includes(w)));
      if (hit) hits.push(raw);
    }
    return hits;
  }

  // ---------- diets (HARD rules; blood type + goals are soft) ----------
  function dietAllows(r, diet) {
    const t = r.tags;
    switch (diet) {
      case "vegan": return t.vegan;
      case "vegetarian": return t.vegetarian;
      case "pescatarian": return t.pescatarian;
      case "keto": return t.keto;
      case "lowcarb": return t.lowcarb;
      case "paleo": return t.paleo;
      case "glutenfree": return t.gf;
      case "dairyfree": return t.df;
      case "kosher": return t.kosher;
      case "mediterranean": return !t.red;
      case "wholefoods": return t.wholefoods;
      default: return true;
    }
  }
  const abo = (bt) => String(bt || "").replace(/[+-]/g, "");

  // ---------- targets ----------
  // ---------- effective profile values (a typed value beats the dropdown) ----------
  function effAge(pr, now) {
    now = now || new Date();
    const y = +pr.bdY, m = +pr.bdM, d = +pr.bdD;
    if (y && m && d) {
      const dt = new Date(y, m - 1, d);
      if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
        let a = now.getFullYear() - y;
        if (now.getMonth() < m - 1 || (now.getMonth() === m - 1 && now.getDate() < d)) a--;
        if (a >= 0 && a <= 120) return a;
      }
    }
    const t = parseFloat(pr.ageTxt);
    if (t > 0 && t <= 120) return Math.floor(t);
    const sel = parseFloat(pr.age);
    return sel > 0 ? sel : NaN;
  }
  function parseHeightText(txt, us) {
    const t = String(txt || "").toLowerCase().trim();
    if (!t) return NaN;
    let m = t.match(/^(\d+(?:\.\d+)?)\s*(?:'|ft|feet|foot|-|\s)\s*(\d+(?:\.\d+)?)?\s*(?:"|in|inch|inches)?$/);
    if (m && (m[2] !== undefined || /'|ft|feet|foot/.test(t))) {
      const ft = parseFloat(m[1]), inch = parseFloat(m[2] || 0);
      if (ft >= 3 && ft <= 8) return (ft * 12 + inch) * 2.54;
    }
    const n = parseFloat(t);
    if (!(n > 0)) return NaN;
    if (/cm$/.test(t)) return n;
    if (/m$/.test(t) && n < 3) return n * 100;
    if (n >= 100 && n <= 250) return n;           // looks like cm
    if (n >= 1 && n <= 2.6) return n * 100;       // metres
    if (n >= 48 && n <= 96) return n * 2.54;      // inches
    if (n >= 3 && n <= 8) return n * 12 * 2.54;   // feet
    return NaN;
  }
  function toMetric(pr) {
    const us = pr.units !== "metric";
    let w = parseFloat(pr.weightTxt);
    if (!(w > 0)) w = parseFloat(pr.weight);
    const kg = us ? w * 0.45359237 : w;
    let cm = parseHeightText(pr.heightTxt, us);
    if (!(cm > 0)) {
      const sel = String(pr.heightSel || "");
      const m = sel.match(/^(\d+)-(\d+)$/);
      if (m) cm = (+m[1] * 12 + +m[2]) * 2.54;
      else if (parseFloat(sel) > 0) cm = parseFloat(sel);
      else if (us) { // saved by an older version of the app
        const ft = parseFloat(pr.heightFt) || 0, inch = parseFloat(pr.heightIn) || 0;
        cm = ft || inch ? (ft * 12 + inch) * 2.54 : NaN;
      } else cm = parseFloat(pr.heightCm);
    }
    return { kg, cm };
  }
  const DIET_WORDS = [
    [/vegan/, "vegan"], [/vegetarian|veggie/, "vegetarian"], [/pesc(?:a|e)tarian/, "pescatarian"], [/flexitarian/, "flexitarian"],
    [/keto/, "keto"], [/low[- ]?carb/, "lowcarb"], [/mediterranean/, "mediterranean"], [/paleo/, "paleo"],
    [/gluten/, "glutenfree"], [/dairy[- ]?free|no dairy/, "dairyfree"], [/halal/, "halal"], [/kosher/, "kosher"],
    [/high[- ]?protein/, "highprotein"], [/anti[- ]?inflam/, "antiinflam"], [/whole[- ]?foods?/, "wholefoods"],
    [/blood\s*type/, "bloodtype"], [/omnivore|carnivore|anything|everything|no restrict/, "omni"]
  ];
  function effDiet(pr) {
    const t = String(pr.dietTxt || "").toLowerCase();
    if (t) for (const [re, id] of DIET_WORDS) if (re.test(t)) return id;
    return pr.diet || "unsure";
  }
  function effBlood(pr) {
    const t = String(pr.bloodTypeTxt || "").toUpperCase().replace(/\s|POSITIVE|NEGATIVE/g, (x) => (x === "POSITIVE" ? "+" : x === "NEGATIVE" ? "-" : ""));
    return /^(AB|A|B|O)[+-]?$/.test(t) ? t : pr.bloodType;
  }
  // ---------- conditions ----------
  const SERIOUS = /kidney|dialysis|pregnan|breastfeeding|postpartum|eating disorder|cancer|chemotherapy|transplant|liver disease|cirrhosis|hepatitis|heart failure|type 1|gestational|bariatric|crohn|colitis|gastroparesis|swallowing|epilepsy|sickle|hemochromatosis|recent surgery|metabolic/i;
  function condFlags(conds) {
    const list = (conds || []).map((c) => String(c).toLowerCase());
    const has = (re) => list.some((c) => re.test(c));
    return {
      gluten: has(/celiac|gluten/), dairy: has(/lactose/), ed: has(/eating disorder/),
      serious: (conds || []).some((c) => SERIOUS.test(c))
    };
  }
  // Allergies the planner must respect: the ones you picked, plus ones implied by conditions.
  function effAllergies(st) {
    const a = [...(st.profile.allergies || [])], f = condFlags(st.profile.conditions);
    if (f.gluten && !a.includes("gluten")) a.push("gluten");
    if (f.dairy && !a.includes("dairy")) a.push("dairy");
    return a;
  }
  function bodyGoal(st) {
    const b = st.goals.body;
    if (condFlags(st.profile.conditions).ed) return "maintain"; // never push weight-loss targets
    return b === "healthy" ? "maintain" : b;
  }

  // ---------- pregnancy & menstrual cycle (only when sex = female) ----------
  const isFemale = (pr) => pr.sex === "female";
  const CYCLE_NAMES = { menstrual: "period (menstrual phase)", follicular: "after your period (follicular phase)", ovulation: "around ovulation", luteal: "before your period (luteal phase)" };
  // Which phase are we in on plan day `off`? A last-period date makes it automatic; otherwise the phase you picked.
  function cycleInfo(pr, off = 0) {
    if (!isFemale(pr) || pr.repro === "pregnant" || pr.repro === "breastfeeding" || pr.repro === "menopause") return null;
    const len = clamp(parseInt(pr.cycleLen, 10) || 28, 21, 40);
    if (pr.periodDate && /^\d{4}-\d{2}-\d{2}$/.test(pr.periodDate)) {
      const now = new Date(); now.setDate(now.getDate() + off);
      const since = daysBetween(pr.periodDate, ymd(now));
      if (since >= 0 && since < 400) {
        const d = since % len, ov = len - 14;
        const phase = d < 5 ? "menstrual" : d < ov - 1 ? "follicular" : d <= ov + 1 ? "ovulation" : "luteal";
        return { phase, day: d + 1, len, name: CYCLE_NAMES[phase], auto: true };
      }
    }
    return CYCLE_NAMES[pr.cycle] ? { phase: pr.cycle, name: CYCLE_NAMES[pr.cycle], auto: false } : null;
  }
  const reproCal = (pr) => {
    if (!isFemale(pr)) return 0;
    if (pr.repro === "pregnant") return { 2: 340, 3: 450 }[pr.trimester] || 0;
    if (pr.repro === "breastfeeding") return 330;
    return 0;
  };

  // ---------- targets ----------
  function estimateCalories(st) {
    const pr = st.profile, age = effAge(pr), { kg, cm } = toMetric(pr);
    const body = bodyGoal(st);
    const notes = [];
    if (!(age >= 18 && age <= 100)) {
      if (age < 18) notes.push("Calorie targets aren't tuned for under 18, so we used a general 2,000 kcal. Check with a doctor or dietitian.");
      return { cal: 2000, estimated: false, notes };
    }
    if (!(kg >= 30 && kg <= 300 && cm >= 120 && cm <= 230)) return { cal: 2000, estimated: false, notes };
    const sex = pr.sex || (/^(m|male|man)$/i.test(String(pr.sexTxt || "").trim()) ? "male" : /^(f|female|woman)$/i.test(String(pr.sexTxt || "").trim()) ? "female" : "");
    const sexAdj = sex === "male" ? 5 : sex === "female" ? -161 : -78;
    const bmr = 10 * kg + 6.25 * cm - 5 * age + sexAdj;
    let cal = bmr * 1.4; // light-to-moderate activity
    const adj = { lose: -400, lose_slow: -250, gain: 350, muscle: 250, endurance: 150, recomp: 0 }[body] || 0;
    cal = Math.max(1200, Math.round((cal + adj) / 10) * 10);
    return { cal, estimated: true, notes };
  }

  function resolveTargets(st) {
    const tg = st.targets || {};
    const num = (v) => { const n = parseFloat(v); return n > 0 ? n : NaN; };
    const est = estimateCalories(st);
    const diet = effDiet(st.profile), body = bodyGoal(st);
    let cal = num(tg.cal);
    const userCal = cal > 0;
    if (!userCal) { cal = est.cal + reproCal(st.profile); const ci = cycleInfo(st.profile); if (ci && ci.phase === "luteal") cal += 100; }
    let ratio = { p: 0.2, c: 0.45, f: 0.35 };
    if (body === "muscle" || body === "gain") ratio = { p: 0.25, c: 0.45, f: 0.3 };
    if (body === "lose" || body === "lose_slow") ratio = { p: 0.28, c: 0.37, f: 0.35 };
    if (body === "recomp") ratio = { p: 0.3, c: 0.4, f: 0.3 };
    if (body === "endurance") ratio = { p: 0.2, c: 0.55, f: 0.25 };
    if (diet === "highprotein") ratio = { p: 0.33, c: 0.37, f: 0.3 };
    if (diet === "lowcarb") ratio = { p: 0.3, c: 0.25, f: 0.45 };
    if (diet === "keto") ratio = { p: 0.22, c: 0.06, f: 0.72 };
    const out = {
      cal: Math.round(cal),
      p: Math.round(num(tg.p) || (cal * ratio.p) / 4),
      c: Math.round(num(tg.c) || (cal * ratio.c) / 4),
      f: Math.round(num(tg.f) || (cal * ratio.f) / 9),
      auto: { cal: !userCal, p: !(num(tg.p) > 0), c: !(num(tg.c) > 0), f: !(num(tg.f) > 0) },
      estimated: !userCal && est.estimated,
      notes: [...est.notes]
    };
    if (condFlags(st.profile.conditions).ed) out.notes.push("Because of your eating-disorder history we won't use weight-loss targets. Please build your meal plan together with your care team.");
    const pr = st.profile;
    if (isFemale(pr) && pr.repro === "pregnant") out.notes.push("Pregnancy: we favor folate, iron, calcium, choline, iodine and omega-3, and steer away from tuna and feta. Always use pasteurized dairy, cook fish and eggs through, and check your plan with your doctor or midwife." + (reproCal(pr) ? ` We added about ${reproCal(pr)} kcal for your trimester.` : ""));
    if (isFemale(pr) && pr.repro === "breastfeeding") out.notes.push("Breastfeeding: we added about 330 kcal and favor calcium, iodine, choline and omega-3. Check your plan with your doctor.");
    if (out.cal < 1200) out.notes.push("Targets under 1,200 kcal a day should only be followed with a doctor or dietitian.");
    return out;
  }

  // ---------- scoring (soft preferences) ----------
  function goalWeights(st, off = 0) {
    const g = st.goals, w = { micro: {}, src: {}, lowNa: 0, fiber: 0, protein: 0, o3: 0, netcarb: 0, quick: 0, plants: 0, fast: 0, simple: 0, meatless: 0, veg: 0, budget: 0 };
    const add = (k, v) => { if (W.TRACKED.includes(k)) w.micro[k] = (w.micro[k] || 0) + v; else if (k === "Na") w.lowNa += v; else w.src[k] = (w.src[k] || 0) + v; };
    (g.micros || []).forEach((m) => { if (m === "o3") w.o3 += 2; else if (m === "fiber") w.fiber += 0.6; else add(m, 1.5); });
    const BEAUTY = {
      skin: () => { add("C", 1); add("A", 1); add("E", 0.8); add("Zn", 0.5); w.o3 += 1; },
      clear: () => { add("A", 1); w.o3 += 1; w.fiber += 0.2; },
      aging: () => { add("C", 1.2); add("A", 1); w.o3 += 1; w.protein += 0.3; },
      tone: () => { add("C", 1.5); add("A", 0.5); },
      hydrate: () => { add("K", 1); add("C", 1); add("Mg", 0.5); },
      hair: () => { add("Fe", 1); add("B12", 1); add("B7", 0.8); add("Zn", 0.8); w.protein += 0.5; },
      shine: () => { w.o3 += 1.5; w.protein += 0.3; add("Fe", 0.5); },
      nails: () => { add("Mg", 1); add("Ca", 1); add("B7", 0.8); w.protein += 0.5; },
      eyes: () => { add("A", 1.5); add("C", 0.5); add("Zn", 0.5); add("E", 0.5); },
      teeth: () => { add("Ca", 1.2); add("D", 1); add("C", 0.5); },
      puffy: () => { add("K", 1.2); add("Mg", 0.6); w.fiber += 0.3; }
    };
    const WELL = {
      energy: () => { add("B12", 1); add("Fe", 1); add("Mg", 1); add("B1", 0.4); add("B2", 0.4); add("B3", 0.4); add("B6", 0.4); },
      digestion: () => { w.fiber += 0.5; },
      gut: () => { w.fiber += 0.6; },
      heart: () => { add("K", 1); add("Mg", 1); w.fiber += 0.3; w.o3 += 1; },
      bones: () => { add("Ca", 1.5); add("D", 1); add("Mg", 1); add("VK", 0.8); },
      immunity: () => { add("C", 1); add("D", 1); add("Fe", 0.6); add("A", 0.6); add("Zn", 0.8); add("Se", 0.8); },
      sleep: () => { add("Mg", 1.2); add("K", 0.6); },
      mood: () => { add("Mg", 1); add("B12", 0.8); add("B6", 0.6); add("B9", 0.6); w.o3 += 1; },
      focus: () => { w.o3 += 1.2; add("B12", 0.8); add("Fe", 0.6); add("Choline", 0.8); },
      bloodsugar: () => { w.fiber += 0.5; w.netcarb += 0.08; add("Mg", 0.8); },
      bp: () => { add("K", 1.2); add("Mg", 1); w.lowNa += 0.8; },
      inflam: () => { w.o3 += 1.5; add("C", 0.8); w.fiber += 0.3; },
      joints: () => { w.o3 += 1.5; add("C", 1); },
      cholesterol: () => { w.fiber += 0.5; w.o3 += 1; },
      hormones: () => { add("Mg", 1); w.fiber += 0.3; w.o3 += 0.5; },
      pms: () => { add("Mg", 1); add("Ca", 0.8); add("B6", 0.8); },
      menopause: () => { add("Ca", 1.2); add("D", 1); add("Mg", 0.8); },
      recovery: () => { w.protein += 0.5; add("Mg", 0.8); add("K", 0.8); },
      metabolism: () => { w.protein += 0.4; w.fiber += 0.3; add("Fe", 0.5); }
    };
    const pr = st.profile;
    if (isFemale(pr)) {
      if (pr.repro === "pregnant") { add("B9", 2); add("Fe", 1.5); add("Ca", 1); add("Choline", 1.2); add("I", 1); add("D", 0.8); add("Mg", 0.5); w.o3 += 1; w.fiber += 0.3; w.preg = 1; }
      else if (pr.repro === "breastfeeding") { add("Ca", 1); add("I", 1); add("Choline", 1); add("B12", 0.8); add("D", 0.8); w.o3 += 1; w.protein += 0.3; }
      else if (pr.repro === "menopause") { add("Ca", 1.2); add("D", 1); add("Mg", 0.8); w.protein += 0.3; }
      else {
        if (pr.repro === "trying") { add("B9", 2); add("Fe", 1); add("Zn", 1); add("D", 0.8); w.o3 += 1; }
        const ci = cycleInfo(pr, off);
        if (ci) ({
          menstrual: () => { add("Fe", 1.5); add("C", 0.8); add("Mg", 0.8); w.o3 += 0.5; },
          follicular: () => { w.protein += 0.2; w.fiber += 0.3; add("B9", 0.5); },
          ovulation: () => { w.fiber += 0.5; add("C", 0.8); add("Zn", 0.8); },
          luteal: () => { add("Mg", 1.2); add("Ca", 0.8); add("B6", 0.8); w.fiber += 0.3; }
        })[ci.phase]();
      }
    }
    (g.beauty || []).forEach((b) => BEAUTY[b] && BEAUTY[b]());
    (g.wellness || []).forEach((x) => WELL[x] && WELL[x]());
    (g.lifestyle || []).forEach((x) => {
      if (x === "quick") w.quick += 1; if (x === "plants") w.plants += 1; if (x === "hiprot") w.protein += 0.9;
      if (x === "fastest") w.fast += 1; if (x === "simple") w.simple += 1; if (x === "meatless") w.meatless += 1;
      if (x === "veggies") w.veg += 1; if (x === "budget") w.budget += 1;
      if (x === "fiber") w.fiber += 0.8; if (x === "lowcarb") w.netcarb += 0.12; if (x === "fish") w.o3 += 1;
    });
    for (const c of st.profile.conditions || []) {
      const s = c.toLowerCase();
      if (/diabetes|insulin|metabolic|pcos|obesity/.test(s)) { w.fiber += 0.4; w.netcarb += 0.08; }
      if (/blood pressure|hypertension|heart|atrial|stroke/.test(s)) { add("K", 1); add("Mg", 1); w.fiber += 0.2; w.lowNa += 0.8; }
      if (/cholesterol|triglycerides|fatty liver/.test(s)) { w.fiber += 0.4; w.o3 += 1; }
      if (/iron|anemia/.test(s)) add("Fe", 2);
      if (/b12/.test(s)) add("B12", 2);
      if (/vitamin d/.test(s)) add("D", 2);
      if (/osteopor|osteopenia/.test(s)) { add("Ca", 1.5); add("D", 1.2); add("Mg", 0.8); }
      if (/arthritis|fibromyalgia|lupus|inflammation|psoriasis|eczema/.test(s)) { w.o3 += 1; add("C", 0.6); }
      if (/constipation|diverticul/.test(s)) w.fiber += 0.4;
      if (/migraine|depress|anxiety|brain fog|adhd/.test(s)) { w.o3 += 0.8; add("Mg", 0.6); }
      if (/muscle loss|sarcopenia|underweight/.test(s)) w.protein += 0.6;
    }
    const body = bodyGoal(st);
    if (body === "lose" || body === "lose_slow") { w.fiber += 0.3; w.protein += 0.4; }
    if (body === "muscle" || body === "gain") w.protein += 0.8;
    if (body === "recomp") w.protein += 0.9;
    if (body === "endurance") { add("K", 0.8); add("Mg", 0.8); add("Fe", 0.6); }
    return w;
  }
  const SHARE = { Breakfast: 0.25, Lunch: 0.35, Dinner: 0.4 };
  function portionFor(r, T, slot) {
    return clamp(Math.round(((T.cal * SHARE[slot]) / r.base.cal) * 4) / 4, 0.5, 2.5);
  }
  function scoreRecipe(r, st, T, slot, W_) {
    const portion = portionFor(r, T, slot);
    const n = nutr(r, portion);
    let s = 0;
    // match macro balance to targets
    const tp = (T.p * 4) / T.cal, tc = (T.c * 4) / T.cal, tf = (T.f * 9) / T.cal;
    const rp = (n.p * 4) / n.cal, rc = (n.c * 4) / n.cal, rf = (n.f * 9) / n.cal;
    s -= 12 * (Math.abs(rp - tp) + Math.abs(rc - tc) + Math.abs(rf - tf));
    for (const m in W_.micro) s += W_.micro[m] * Math.min(3, (n.mi[m] || 0) / 15);
    s += n.fi * W_.fiber * 0.4 + n.p * W_.protein * 0.1 + (r.o3 ? W_.o3 * 1.5 : 0);
    s -= Math.max(0, r.net - 20) * W_.netcarb;
    const diet = effDiet(st.profile);
    if (diet === "flexitarian" && r.tags.vegetarian) s += 3;
    if (diet === "highprotein") s += n.p * 0.1;
    if (diet === "antiinflam") s += Math.min(6, r.aiCount * 1.5) + (r.o3 ? 2 : 0);
    if (diet === "mediterranean") {
      if (r.ids.includes("salmon") || r.ids.includes("cod") || r.ids.includes("tuna")) s += 2;
      if (r.ids.some((i) => ["lentils", "chickpeas", "blackbeans"].includes(i))) s += 1.5;
      if (r.ids.includes("oliveoil")) s += 1;
    }
    if (diet === "bloodtype") {
      const rule = BLOOD_RULES[abo(effBlood(st.profile))];
      if (rule) {
        s += 2 * r.ids.filter((i) => rule.prefer.includes(i)).length;
        s -= 7 * r.ids.filter((i) => rule.avoid.includes(i)).length;
      }
    }
    for (const k in W_.src) s += W_.src[k] * Math.min(3, r.gsCount[k] || 0) * 0.9;
    if (W_.lowNa) s -= W_.lowNa * r.na * 2.2;
    if (W_.quick && r.time) s += r.time <= 25 ? 3 * W_.quick : -Math.min(4, (r.time - 25) / 6) * W_.quick;
    if (W_.plants) s += (r.tags.vegan ? 3 : r.tags.vegetarian ? 2 : 0) * W_.plants;
    if (W_.fast && r.time) s += r.time <= 15 ? 4 * W_.fast : -Math.min(5, (r.time - 15) / 5) * W_.fast;
    if (W_.simple) s += (r.ing.length <= 6 ? 3 : r.ing.length <= 8 ? 1 : -Math.min(4, r.ing.length - 8)) * W_.simple;
    if (W_.meatless) s += (r.tags.vegetarian ? 4 : -4) * W_.meatless;
    if (W_.veg) s += Math.min(5, r.nVeg) * 1.2 * W_.veg;
    if (W_.budget) s -= r.pricey * 3 * W_.budget;
    if (W_.preg) { if (r.ids.includes("tuna")) s -= 6; if (r.ids.includes("feta")) s -= 4; }
    return s;
  }

  // Which of the nutrients you picked does this recipe deliver? (amount for tracked ones, "good source" for the rest)
  function goalMatches(r, st, portion) {
    const out = [], picked = (st.goals.micros || []);
    const n = r.user ? null : nutr(r, portion || 1);
    for (const k of picked) {
      if (k === "o3") { if (r.o3) out.push({ k, label: W.NUTRIENT_LABEL.o3 }); }
      else if (k === "fiber") { if (n && n.fi >= 8) out.push({ k, label: "Fiber", pct: Math.round(n.fi) + " g" }); }
      else if (k === "Na") { if (!r.user && r.na === 0) out.push({ k, label: "Low in sodium" }); }
      else if (W.TRACKED.includes(k)) { if (n && n.mi[k] >= 15) out.push({ k, label: MICRO_LABELS[k], pct: Math.round(n.mi[k]) + "%" }); }
      else if (!r.user && (r.gsCount[k] || 0) > 0) out.push({ k, label: MICRO_LABELS[k] || W.NUTRIENT_LABEL[k], src: true });
    }
    return out;
  }

  // ---------- plan generation ----------
  function recipeAllowed(r, st) {
    return dietAllows(r, effDiet(st.profile)) && allergyHits(r, effAllergies(st)).length === 0;
  }
  function generatePlan(st, opts = {}) {
    const days = clamp(Math.round(st.planLen || 7), 1, 60);
    const seed = opts.seed != null ? opts.seed : (Date.now() ^ ((Math.random() * 1e9) | 0)) & 0x7fffffff;
    const rnd = mulberry32(seed);
    const T = resolveTargets(st);
    const slots = ["Breakfast", "Lunch", "Dinner"];
    const pools = {};
    for (const slot of slots) pools[slot] = RECIPES.filter((r) => r.meal === slot && recipeAllowed(r, st));
    const used = { Breakfast: {}, Lunch: {}, Dinner: {} };
    const items = [], missing = [];
    for (const slot of slots) if (!pools[slot].length) missing.push(slot);
    for (let d = 0; d < days; d++) {
      const W_ = goalWeights(st, d);
      for (const slot of slots) {
        const pool = pools[slot];
        if (!pool.length) continue;
        let best = null, bestScore = -Infinity;
        for (const r of pool) {
          const last = used[slot][r.id];
          const gap = last === undefined ? 99 : d - last;
          const s = scoreRecipe(r, st, T, slot, W_) - Math.max(0, 4 - gap) * 4 + rnd() * 1.5;
          if (s > bestScore) { bestScore = s; best = r; }
        }
        used[slot][best.id] = d;
        items.push({ day: d, slot, rid: best.id, portion: portionFor(best, T, slot) });
      }
    }
    return { id: "p" + seed, seed, start: ymd(opts.now || new Date()), days, items, missing };
  }
  // Swap ONE meal (a given day + slot) for a different, safe one. Everything else stays as it is.
  function swapMeal(st, dayIdx, slot, opts = {}) {
    const plan = st.plan;
    const it = plan && plan.items.find((i) => i.day === dayIdx && i.slot === slot);
    if (!it) return { ok: false, reason: "missing" };
    const T = resolveTargets(st), W_ = goalWeights(st, dayIdx), rnd = mulberry32(opts.seed != null ? opts.seed : (Date.now() ^ ((Math.random() * 1e9) | 0)) & 0x7fffffff);
    const pool = RECIPES.filter((r) => r.meal === slot && r.id !== it.rid && recipeAllowed(r, st));
    if (!pool.length) return { ok: false, reason: "none" };
    const usage = {};
    for (const x of plan.items) if (x.slot === slot) usage[x.rid] = (usage[x.rid] || 0) + 1;
    const near = (r) => plan.items.some((x) => x.slot === slot && x.rid === r.id && Math.abs(x.day - dayIdx) <= 1);
    let best = null, bestScore = -Infinity;
    for (const r of pool) {
      const sc = scoreRecipe(r, st, T, slot, W_) - (usage[r.id] || 0) * 2.5 - (near(r) ? 6 : 0) + rnd() * 5;
      if (sc > bestScore) { bestScore = sc; best = r; }
    }
    const before = { rid: it.rid, portion: it.portion };
    it.rid = best.id; it.portion = portionFor(best, T, slot);
    return { ok: true, before, after: { rid: it.rid, portion: it.portion } };
  }
  // Where are we in the plan today?
  function planPosition(plan, now) {
    const d = daysBetween(plan.start, ymd(now || new Date()));
    return { offset: d, over: d >= plan.days, idx: ((d % plan.days) + plan.days) % plan.days };
  }

  // ---------- quantity formatting ----------
  function fmtFrac(x) {
    const q = Math.max(0.25, Math.round(x * 4) / 4);
    const whole = Math.floor(q), f = q - whole;
    const sym = { 0: "", 0.25: "¼", 0.5: "½", 0.75: "¾" }[f];
    return (whole ? String(whole) : "") + (whole && sym ? " " : "") + sym;
  }
  function fmtG(g) {
    const r = g < 20 ? Math.max(1, Math.round(g)) : g < 100 ? Math.round(g / 5) * 5 : Math.round(g / 10) * 10;
    if (r >= 450) return `${r} g (≈ ${(r / 454).toFixed(1).replace(/\.0$/, "")} lb)`;
    if (r >= 60) return `${r} g (≈ ${Math.round(r / 28.35)} oz)`;
    return `${r} g`;
  }
  function fmtMl(ml) {
    if (ml >= 120) { const cups = ml / 240; return `${Math.round(ml / 10) * 10} ml (≈ ${fmtFrac(cups)} cup${cups > 1.1 ? "s" : ""})`; }
    if (ml >= 15) return `${Math.round(ml)} ml (≈ ${fmtFrac(ml / 15)} tbsp)`;
    return `${Math.max(1, Math.round(ml))} ml (≈ ${fmtFrac(ml / 5)} tsp)`;
  }
  const plural = (label, n) => (n > 1 ? (label === "dozen" ? "dozen" : label + "s") : label);
  // Line for a recipe: {qty, label}
  function fmtRecipeLine(id, amt) {
    const g = ING[id];
    if (g.u === "ea") return { qty: `${fmtFrac(amt)} ${amt <= 1 ? g.ea[0] : g.ea[1]}`, label: "" };
    return { qty: g.u === "g" ? fmtG(amt) : fmtMl(amt), label: g.n };
  }
  // Text for the shopping list: what to get
  function fmtShopQty(id, amt) {
    const g = ING[id];
    if (g.u === "ea") {
      const n = Math.max(1, Math.ceil(amt - 1e-9));
      let s = `${n} ${n === 1 ? g.ea[0] : g.ea[1]}`;
      if (g.pack) { const packs = Math.ceil(n / g.pack.size); s += ` (buy ${packs} ${plural(g.pack.label, packs)})`; }
      return s;
    }
    return g.u === "g" ? fmtG(amt) : fmtMl(amt);
  }

  // ---------- shopping list ----------
  function shoppingList(st, windowDays, now) {
    const plan = st.plan;
    if (!plan || !plan.items.length) return { groups: [], pantry: [], count: 0, days: windowDays, planDays: 0, repeats: false };
    const { idx } = planPosition(plan, now);
    const byDay = {};
    for (const it of plan.items) (byDay[it.day] = byDay[it.day] || []).push(it);
    const totals = {}, pantry = new Set();
    for (let i = 0; i < windowDays; i++) {
      for (const it of byDay[(idx + i) % plan.days] || []) {
        const r = recipeById(it.rid, st);
        if (!r || r.user) continue;
        for (const [id, amt] of r.ing) {
          const t = (totals[id] = totals[id] || { amt: 0, uses: new Set() });
          t.amt += amt * it.portion;
          t.uses.add(r.name);
        }
        (r.pantry || []).forEach((p) => pantry.add(p));
      }
    }
    const groups = CATS.map((cat) => ({
      cat,
      items: Object.entries(totals)
        .filter(([id]) => ING[id].cat === cat)
        .map(([id, t]) => ({ id, name: ING[id].n, qty: fmtShopQty(id, t.amt), buy: ING[id].buy, uses: [...t.uses] }))
        .sort((a, b) => a.name.localeCompare(b.name))
    })).filter((g) => g.items.length);
    return {
      groups, pantry: [...pantry].sort(), count: groups.reduce((n, g) => n + g.items.length, 0),
      days: windowDays, planDays: plan.days, repeats: windowDays > plan.days
    };
  }

  Object.assign(W, {
    clamp, ymd, daysBetween, recipeById, nutr, richIn, allergyHits, dietAllows, recipeAllowed,
    resolveTargets, generatePlan, planPosition, shoppingList, fmtFrac, fmtG, fmtMl,
    fmtRecipeLine, fmtShopQty, goalWeights, cycleInfo, abo, swapMeal, goalMatches, effAge, effDiet, effBlood, effAllergies, condFlags, toMetric, parseHeightText, bodyGoal
  });
})(globalThis);
