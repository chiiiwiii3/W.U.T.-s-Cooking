/* W.U.T.'s Cooking — "Getting Nutty": health calculators, converters and reference charts.
   Pure math, no DOM, so it can be tested in Node. Every calculator gets values in METRIC (kg, cm)
   no matter which units the person typed in. For education only; not medical advice. */
(function (root) {
  "use strict";
  const W = (root.WUT = root.WUT || {});
  const C = (W.calc = {});

  const LB = 0.45359237, IN = 2.54;
  const kgToLb = (kg) => kg / LB;
  const r1 = (n) => Math.round(n * 10) / 10;
  const r0 = Math.round;
  const fix = (n, d = 1) => (Number.isFinite(n) ? n.toFixed(d).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "") : "?");
  const kgStr = (kg) => `${fix(kgToLb(kg))} lb (${fix(kg)} kg)`;
  const cmStr = (cm) => { const t = cm / IN, ft = Math.floor(t / 12); return `${ft} ft ${fix(t - ft * 12)} in (${fix(cm, 0)} cm)`; };
  const lenStr = (cm) => `${fix(cm / IN)} in (${fix(cm)} cm)`;
  const clock = (mins) => { mins = ((mins % 1440) + 1440) % 1440; let h = Math.floor(mins / 60), m = Math.round(mins % 60); if (m === 60) { m = 0; h = (h + 1) % 24; } return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
  const hms = (sec) => { sec = Math.round(sec); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0"); };
  const bad = (msg) => ({ error: msg });
  const has = (...xs) => xs.every((x) => Number.isFinite(x) && x > 0);
  Object.assign(C, { LB, IN, kgStr, cmStr, hms, clock });

  // ---------- reference zones for the colored scale bars ----------
  const Z = (list) => list.map(([to, label, tone]) => ({ to, label, tone }));

  // ================= BODY & WEIGHT =================
  function bmiCalc(v) {
    if (!has(v.w, v.h)) return bad("Enter your weight and height.");
    const m = v.h / 100, bmi = v.w / (m * m), asian = v.ref === "asian";
    const cut = asian ? { under: 18.5, ok: 22.9, over: 27.4 } : { under: 18.5, ok: 24.9, over: 29.9 };
    let cat, tone;
    if (bmi < 18.5) { cat = "Underweight"; tone = "low"; }
    else if (bmi <= cut.ok) { cat = "Healthy weight"; tone = "good"; }
    else if (bmi <= cut.over) { cat = asian ? "Overweight (increased risk)" : "Overweight"; tone = "warn"; }
    else { cat = asian ? "Obese (high risk)" : bmi < 35 ? "Obesity, class 1" : bmi < 40 ? "Obesity, class 2" : "Obesity, class 3"; tone = "bad"; }
    const lo = 18.5 * m * m, hi = (asian ? 22.9 : 24.9) * m * m;
    const rows = [["Your BMI", fix(bmi), tone], ["Category", cat, tone], ["Healthy weight range for your height", `${kgStr(lo)} to ${kgStr(hi)}`]];
    if (v.w > hi) rows.push(["To reach the top of the healthy range", `lose about ${kgStr(v.w - hi)}`]);
    else if (v.w < lo) rows.push(["To reach the bottom of the healthy range", `gain about ${kgStr(lo - v.w)}`]);
    else rows.push(["You're inside the healthy range", "✓"]);
    rows.push(["BMI Prime (BMI ÷ 25)", fix(bmi / 25, 2)]);
    return {
      rows, scale: { value: bmi, min: 15, max: 40, unit: "BMI", zones: Z(asian ? [[18.5, "Under", "low"], [22.9, "Healthy", "good"], [27.4, "Over", "warn"], [40, "Obese", "bad"]] : [[18.5, "Under", "low"], [24.9, "Healthy", "good"], [29.9, "Over", "warn"], [40, "Obese", "bad"]]) },
      notes: ["BMI is a screening number, not a diagnosis. It can't tell muscle from fat, and it ignores where fat is stored.", "For anyone under 20, doctors use BMI-for-age percentile charts instead of these adult ranges."]
    };
  }
  function idealWeight(v) {
    if (!has(v.h)) return bad("Enter your height.");
    if (v.sex !== "m" && v.sex !== "f") return bad("Choose male or female.");
    const inch = v.h / IN, over = Math.max(0, inch - 60), male = v.sex === "m", m = v.h / 100;
    const f = { Devine: male ? 50 + 2.3 * over : 45.5 + 2.3 * over, Robinson: male ? 52 + 1.9 * over : 49 + 1.7 * over, Miller: male ? 56.2 + 1.41 * over : 53.1 + 1.36 * over, Hamwi: male ? 48 + 2.7 * over : 45.5 + 2.2 * over };
    const rows = Object.entries(f).map(([k, kg]) => [`${k} formula`, kgStr(kg)]);
    rows.push(["Healthy BMI range (18.5 to 24.9)", `${kgStr(18.5 * m * m)} to ${kgStr(24.9 * m * m)}`]);
    return { rows, notes: ["These old formulas were built for hospital drug dosing, so treat them as rough guides. Frame, muscle and age all matter."] };
  }
  function bodyFat(v) {
    const male = v.sex === "m";
    if (v.sex !== "m" && v.sex !== "f") return bad("Choose male or female.");
    if (!has(v.h, v.neck, v.waist) || (!male && !has(v.hip))) return bad(male ? "Enter height, neck and waist." : "Enter height, neck, waist and hip.");
    const d = male ? v.waist - v.neck : v.waist + v.hip - v.neck;
    if (d <= 0) return bad("Waist must be larger than neck. Re-measure.");
    const dens = male ? 1.0324 - 0.19077 * Math.log10(d) + 0.15456 * Math.log10(v.h) : 1.29579 - 0.35004 * Math.log10(d) + 0.221 * Math.log10(v.h);
    const bf = 495 / dens - 450;
    if (!(bf > 1 && bf < 70)) return bad("Those numbers don't give a believable result. Re-measure and try again.");
    const bands = male ? [[6, "Essential fat", "low"], [14, "Athletic", "good"], [18, "Fit", "good"], [25, "Average", "warn"], [45, "Higher", "bad"]] : [[14, "Essential fat", "low"], [21, "Athletic", "good"], [25, "Fit", "good"], [32, "Average", "warn"], [55, "Higher", "bad"]];
    const hit = bands.find(([to]) => bf < to) || bands[bands.length - 1];
    const rows = [["Estimated body fat", fix(bf) + "%", hit[2]], ["Category (ACE)", hit[1], hit[2]]];
    if (has(v.w)) rows.push(["Fat mass", kgStr((v.w * bf) / 100)], ["Lean mass", kgStr(v.w - (v.w * bf) / 100)]);
    return { rows, scale: { value: bf, min: male ? 2 : 10, max: male ? 40 : 50, unit: "% fat", zones: Z(bands.map(([to, l, t]) => [Math.min(to, male ? 40 : 50), l, t])) }, notes: ["US Navy tape method. It's usually within a few percentage points, and measuring in the same spot each time matters most."] };
  }
  function whr(v) {
    if (v.sex !== "m" && v.sex !== "f") return bad("Choose male or female.");
    if (!has(v.waist)) return bad("Enter your waist measurement.");
    const male = v.sex === "m", rows = [];
    const lim = male ? 102 : 88;
    rows.push(["Waist size", lenStr(v.waist), v.waist > lim ? "bad" : "good"], ["Waist-size risk", v.waist > lim ? `Above ${lenStr(lim)}: higher health risk` : `At or under ${lenStr(lim)}: lower risk`, v.waist > lim ? "bad" : "good"]);
    let scale;
    if (has(v.hip)) { const r = v.waist / v.hip, cut = male ? 0.9 : 0.85; rows.push(["Waist-to-hip ratio", fix(r, 2), r > cut ? "bad" : "good"], ["WHO guideline", r > cut ? `Above ${cut}: abdominal obesity` : `At or under ${cut}: lower risk`]); }
    if (has(v.h)) {
      const r = v.waist / v.h, cat = r < 0.4 ? "Very lean" : r < 0.5 ? "Healthy" : r < 0.6 ? "Increased risk" : "High risk", tone = r < 0.4 ? "low" : r < 0.5 ? "good" : r < 0.6 ? "warn" : "bad";
      rows.push(["Waist-to-height ratio", fix(r, 2), tone], ["Category", cat, tone], ["Rule of thumb", "keep your waist under half your height"]);
      scale = { value: r, min: 0.3, max: 0.7, unit: "waist ÷ height", zones: Z([[0.4, "Lean", "low"], [0.5, "Healthy", "good"], [0.6, "Risk", "warn"], [0.7, "High", "bad"]]) };
    }
    return { rows, scale, notes: ["Measure at the narrowest point of the waist (or at the belly button if it's hard to tell) and the widest part of the hips."] };
  }
  function leanMass(v) {
    if (!has(v.w, v.h)) return bad("Enter weight and height.");
    if (v.sex !== "m" && v.sex !== "f") return bad("Choose male or female.");
    const male = v.sex === "m", ratio = v.w / v.h;
    const boer = male ? 0.407 * v.w + 0.267 * v.h - 19.2 : 0.252 * v.w + 0.473 * v.h - 48.3;
    const james = male ? 1.1 * v.w - 128 * ratio * ratio : 1.07 * v.w - 148 * ratio * ratio;
    const hume = male ? 0.3281 * v.w + 0.33929 * v.h - 29.5336 : 0.29569 * v.w + 0.41813 * v.h - 43.2933;
    const rows = [["Boer formula", `${kgStr(boer)} (${fix(100 - (boer / v.w) * 100)}% fat)`], ["James formula", `${kgStr(james)} (${fix(100 - (james / v.w) * 100)}% fat)`], ["Hume formula", `${kgStr(hume)} (${fix(100 - (hume / v.w) * 100)}% fat)`]];
    return { rows, notes: ["Lean body mass is everything that isn't fat: muscle, bone, organs and water."] };
  }
  function bsa(v) {
    if (!has(v.w, v.h)) return bad("Enter weight and height.");
    return { rows: [["Mosteller", fix(Math.sqrt((v.h * v.w) / 3600), 2) + " m²"], ["DuBois & DuBois", fix(0.007184 * Math.pow(v.w, 0.425) * Math.pow(v.h, 0.725), 2) + " m²"]], notes: ["Body surface area is used in medicine to dose some drugs. The average adult is about 1.7 m²."] };
  }
  function goalDate(v) {
    if (!has(v.w, v.goal, v.rate)) return bad("Enter your current weight, goal weight and weekly change.");
    const diff = v.goal - v.w;
    if (Math.abs(diff) < 0.05) return { rows: [["You're already at your goal", "✓"]] };
    const weeks = Math.abs(diff) / v.rate, d = new Date(); d.setDate(d.getDate() + Math.round(weeks * 7));
    const kcal = (v.rate * 7700) / 7, pct = (v.rate / v.w) * 100;
    const rows = [[diff < 0 ? "To lose" : "To gain", kgStr(Math.abs(diff))], ["Time", `${fix(weeks)} weeks (about ${fix(weeks / 4.345)} months)`], ["Estimated date", d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })], [diff < 0 ? "Daily calorie deficit needed" : "Daily calorie surplus needed", `about ${r0(kcal)} kcal`]];
    const notes = ["Uses roughly 7,700 kcal per kg (3,500 per lb) of body weight. Real progress is bumpy, so treat it as a guide."];
    if (diff < 0 && pct > 1) notes.unshift("⚠️ Losing more than about 1% of your body weight per week is usually too fast to keep up or keep off.");
    if (diff < 0 && kcal > 1000) notes.unshift("⚠️ A deficit over 1,000 kcal a day is aggressive. Check with a doctor or dietitian.");
    return { rows, notes };
  }

  // ================= CALORIES & MACROS =================
  const ACT = [["1.2", "Sedentary (desk job, little exercise)"], ["1.375", "Light (exercise 1–3 days a week)"], ["1.55", "Moderate (3–5 days a week)"], ["1.725", "Very active (6–7 days a week)"], ["1.9", "Extra active (hard training or physical job)"]];
  C.ACTIVITY = ACT;
  function tdee(v) {
    if (!has(v.w, v.h, v.age)) return bad("Enter weight, height and age.");
    if (v.sex !== "m" && v.sex !== "f") return bad("Choose male or female.");
    const male = v.sex === "m", f = v.formula || "mifflin";
    let bmr, name;
    if (f === "harris") { bmr = male ? 88.362 + 13.397 * v.w + 4.799 * v.h - 5.677 * v.age : 447.593 + 9.247 * v.w + 3.098 * v.h - 4.33 * v.age; name = "Harris-Benedict (revised)"; }
    else if (f === "katch") { if (!(v.bf > 2 && v.bf < 60)) return bad("Katch-McArdle needs your body-fat % (try the Body fat calculator)."); bmr = 370 + 21.6 * (v.w * (1 - v.bf / 100)); name = "Katch-McArdle"; }
    else { bmr = 10 * v.w + 6.25 * v.h - 5 * v.age + (male ? 5 : -161); name = "Mifflin-St Jeor"; }
    const factor = parseFloat(v.act) || 1.375, td = bmr * factor, floor = male ? 1500 : 1200;
    const rows = [["Formula", name], ["BMR (calories at complete rest)", `${r0(bmr)} kcal/day`], ["TDEE (calories you burn per day)", `${r0(td)} kcal/day`, "good"]];
    const t = [["Lose slowly (about ½ lb / 0.25 kg a week)", -250], ["Lose (about 1 lb / 0.5 kg a week)", -500], ["Gain slowly (about ½ lb / 0.25 kg a week)", 250], ["Gain (about 1 lb / 0.5 kg a week)", 500]];
    for (const [l, d] of t) rows.push([l, `${Math.max(floor, r0(td + d))} kcal/day`]);
    return { rows, notes: ["Estimates can be off by 10 percent or more. Track for 2–3 weeks and adjust.", `We don't suggest going below ${floor} kcal/day without a doctor or dietitian.`] };
  }
  const PRESETS = { balanced: [50, 20, 30, "Balanced"], highprotein: [35, 35, 30, "High-protein"], lowcarb: [25, 35, 40, "Low-carb"], keto: [5, 20, 75, "Keto"], lowfat: [60, 20, 20, "Low-fat"], mediterranean: [45, 18, 37, "Mediterranean"] };
  C.PRESETS = PRESETS;
  function macros(v) {
    if (!has(v.cal)) return bad("Enter your daily calories.");
    let [c, p, f, name] = PRESETS[v.preset] || [v.c, v.p, v.f, "Custom"];
    if (!PRESETS[v.preset]) { c = v.c; p = v.p; f = v.f; if (![c, p, f].every((n) => Number.isFinite(n) && n >= 0)) return bad("Enter carb, protein and fat percentages."); if (Math.abs(c + p + f - 100) > 0.5) return bad(`Your percentages add up to ${r0(c + p + f)}%. They need to total 100%.`); }
    const g = { c: (v.cal * c) / 100 / 4, p: (v.cal * p) / 100 / 4, f: (v.cal * f) / 100 / 9 };
    const rows = [["Split", `${name}: ${c}% carbs / ${p}% protein / ${f}% fat`], ["Carbs", `${r0(g.c)} g per day (${r0(g.c / 3)} g per meal across 3 meals)`], ["Protein", `${r0(g.p)} g per day (${r0(g.p / 3)} g per meal)`], ["Fat", `${r0(g.f)} g per day (${r0(g.f / 3)} g per meal)`], ["Fiber target", `${r0((v.cal / 1000) * 14)} g per day (14 g per 1,000 kcal)`]];
    return { rows, notes: ["Carbs and protein are 4 kcal per gram; fat is 9. Alcohol is 7."] };
  }
  const PROT = { general: [0.8, 1.0, "General healthy adult"], older: [1.0, 1.2, "Adults over 65"], endurance: [1.2, 1.6, "Endurance training"], strength: [1.6, 2.2, "Building muscle / strength training"], loss: [1.6, 2.4, "Losing fat and keeping muscle"], pregnant: [1.1, 1.3, "Pregnancy (2nd/3rd trimester)"] };
  C.PROTEIN_GOALS = Object.entries(PROT).map(([k, x]) => [k, x[2]]);
  function protein(v) {
    if (!has(v.w)) return bad("Enter your weight.");
    const t = PROT[v.goal] || PROT.general, lo = t[0] * v.w, hi = t[1] * v.w;
    return { rows: [["Your goal", t[2]], ["Protein per kg of body weight", `${t[0]} to ${t[1]} g`], ["Daily protein", `${r0(lo)} to ${r0(hi)} g`, "good"], ["Per meal (3 meals)", `${r0(lo / 3)} to ${r0(hi / 3)} g`], ["Per meal (4 meals)", `${r0(lo / 4)} to ${r0(hi / 4)} g`]], notes: ["People with kidney disease should get their protein target from a doctor or dietitian."] };
  }
  function water(v) {
    if (!has(v.w)) return bad("Enter your weight.");
    const base = 35 * v.w, ex = ((v.mins || 0) / 30) * 355, hot = v.hot === "yes" ? 500 : 0, tot = base + ex + hot;
    const oz = (ml) => `${fix(ml / 29.5735, 0)} oz`;
    return { rows: [["Baseline (35 ml per kg)", `${fix(base / 1000, 2)} L (${oz(base)})`], ["Exercise", `${fix(ex / 1000, 2)} L (${oz(ex)})`], ["Hot weather", `${fix(hot / 1000, 2)} L`], ["Total fluids per day", `${fix(tot / 1000, 1)} L (${oz(tot)}, about ${r0(tot / 237)} cups)`, "good"]], notes: ["Includes all drinks, and about 20% of your water comes from food. Needs vary. Thirst and pale-yellow urine are good signals. If you have heart or kidney disease, ask your doctor first."] };
  }

  // ================= FITNESS =================
  const METS = [["Walking, slow (2 mph)", 2.8], ["Walking, moderate (3 mph)", 3.5], ["Walking, brisk (4 mph)", 5.0], ["Hiking", 6.0], ["Running, 5 mph (12 min/mile)", 8.3], ["Running, 6 mph (10 min/mile)", 9.8], ["Running, 7.5 mph (8 min/mile)", 12.3], ["Cycling, easy (under 10 mph)", 4.0], ["Cycling, moderate (12–14 mph)", 8.0], ["Swimming laps, easy", 5.8], ["Swimming laps, hard", 9.8], ["Yoga (hatha)", 2.5], ["Pilates", 3.0], ["Strength training (general)", 3.5], ["Strength training (vigorous)", 6.0], ["HIIT / circuit training", 8.0], ["Aerobics / dance fitness", 6.5], ["Elliptical", 5.0], ["Rowing machine (moderate)", 4.8], ["Jump rope", 11.8], ["Stair climbing machine", 9.0], ["Basketball (game)", 8.0], ["Soccer (casual)", 7.0], ["Tennis (singles)", 8.0], ["Gardening", 3.8], ["Housework", 3.3]];
  C.METS = METS;
  function met(v) {
    const m = METS[parseInt(v.act, 10)];
    if (!m || !has(v.mins, v.w)) return bad("Choose an activity, minutes and your weight.");
    const kcal = (m[1] * v.w * v.mins) / 60;
    return { rows: [["Activity", m[0]], ["MET value", String(m[1])], ["Calories burned", `about ${r0(kcal)} kcal`, "good"], ["Per hour", `about ${r0(m[1] * v.w)} kcal`]], notes: ["Calories = MET × body weight (kg) × hours. MET values come from the Compendium of Physical Activities and are averages."] };
  }
  function hrZones(v) {
    if (!has(v.age)) return bad("Enter your age.");
    const max1 = 220 - v.age, max2 = 208 - 0.7 * v.age, max = max2, rest = v.rhr > 0 ? v.rhr : null;
    const zones = [["Zone 1: very light (warm-up)", 0.5, 0.6], ["Zone 2: light (easy, burns fat)", 0.6, 0.7], ["Zone 3: moderate (aerobic)", 0.7, 0.8], ["Zone 4: hard (threshold)", 0.8, 0.9], ["Zone 5: maximum effort", 0.9, 1.0]];
    const bpm = (p) => r0(rest ? rest + p * (max - rest) : p * max);
    const rows = [["Max heart rate (Tanaka: 208 − 0.7 × age)", `${r0(max2)} bpm`], ["Max heart rate (classic: 220 − age)", `${max1} bpm`]];
    if (rest) rows.push(["Heart-rate reserve", `${r0(max - rest)} bpm`]);
    for (const [n, a, b] of zones) rows.push([n, `${bpm(a)} to ${bpm(b)} bpm`]);
    return { rows, notes: [rest ? "Zones use the Karvonen method with your resting heart rate." : "Add your resting heart rate for more personal (Karvonen) zones.", "Formulas are averages, so real max heart rate varies by 10–12 bpm between people."] };
  }
  function oneRM(v) {
    if (!has(v.lift, v.reps)) return bad("Enter the weight you lifted and how many reps.");
    if (v.reps > 20) return bad("Estimates are only reliable up to about 10 reps. Use 20 or fewer.");
    const epley = v.reps === 1 ? v.lift : v.lift * (1 + v.reps / 30), brz = v.reps < 37 ? (v.lift * 36) / (37 - v.reps) : NaN, lom = v.lift * Math.pow(v.reps, 0.1);
    const avg = (epley + brz + lom) / 3, F = (kg) => `${fix(kgToLb(kg))} lb (${fix(kg)} kg)`;
    const rows = [["Epley", F(epley)], ["Brzycki", F(brz)], ["Lombardi", F(lom)], ["Average estimated 1-rep max", F(avg), "good"]];
    for (const [pct, rp] of [[95, 2], [90, 4], [85, 6], [80, 8], [75, 10], [70, 12], [65, 15], [60, 20]]) rows.push([`${pct}% of max (about ${rp} reps)`, F((avg * pct) / 100)]);
    return { rows, notes: ["Only try a true 1-rep max with a spotter and good form."] };
  }
  C.parseTime = (hh, mm, ss) => (parseFloat(hh) || 0) * 3600 + (parseFloat(mm) || 0) * 60 + (parseFloat(ss) || 0);
  function pace(v) {
    const sec = (v.hh || 0) * 3600 + (v.mm || 0) * 60 + (v.ss || 0);
    if (!has(v.dist) || !(sec > 0)) return bad("Enter a distance and a time.");
    const km = v.du === "mi" ? v.dist * 1.609344 : v.dist, mi = km / 1.609344;
    const rows = [["Pace per kilometer", hms(sec / km) + " /km"], ["Pace per mile", hms(sec / mi) + " /mi"], ["Speed", `${fix(km / (sec / 3600), 2)} km/h (${fix(mi / (sec / 3600), 2)} mph)`, "good"]];
    for (const [n, d] of [["5K", 5], ["10K", 10], ["Half marathon", 21.0975], ["Marathon", 42.195]]) rows.push([`Predicted ${n} (Riegel)`, hms(sec * Math.pow(d / km, 1.06))]);
    return { rows, notes: ["Race predictions assume similar training for the longer distance, and they get less accurate the further they stretch from your input."] };
  }
  function steps(v) {
    if (!has(v.steps, v.h)) return bad("Enter your steps and height.");
    if (v.sex !== "m" && v.sex !== "f") return bad("Choose male or female.");
    const stride = v.h * (v.sex === "m" ? 0.415 : 0.413), km = (v.steps * stride) / 100000;
    return { rows: [["Stride length", `about ${fix(stride, 0)} cm (${fix(stride / IN)} in)`], ["Distance", `${fix(km, 2)} km (${fix(km / 1.609344, 2)} miles)`, "good"], ["10,000 steps", `${fix((10000 * stride) / 100000, 1)} km (${fix((10000 * stride) / 160934.4, 1)} miles)`]], notes: ["Stride is estimated from height (about 41% of it), so real distance varies with how you walk."] };
  }
  function sleep(v) {
    if (!/^\d{1,2}:\d{2}$/.test(v.time || "")) return bad("Pick a time.");
    const [h, m] = v.time.split(":").map(Number), t = h * 60 + m, FALL = 15, rows = [];
    if (v.mode === "bed") for (const c of [4, 5, 6]) rows.push([`${c} cycles (${fix(c * 1.5)} h of sleep)`, "wake at " + clock(t + FALL + c * 90), c >= 5 ? "good" : "warn"]);
    else for (const c of [6, 5, 4]) rows.push([`${c} cycles (${fix(c * 1.5)} h of sleep)`, "go to bed at " + clock(t - FALL - c * 90), c >= 5 ? "good" : "warn"]);
    return { rows, notes: ["Sleep runs in cycles of about 90 minutes. Waking at the end of a cycle often feels easier. We assume 15 minutes to fall asleep.", "Most adults need 7 to 9 hours."] };
  }

  // ================= HEART & BLOOD =================
  function bp(v) {
    if (!has(v.sys, v.dia)) return bad("Enter both numbers.");
    if (v.sys <= v.dia) return bad("The top number (systolic) should be bigger than the bottom (diastolic).");
    let cat, tone;
    if (v.sys > 180 || v.dia > 120) { cat = "Hypertensive crisis: get medical care now"; tone = "bad"; }
    else if (v.sys >= 140 || v.dia >= 90) { cat = "High blood pressure, stage 2"; tone = "bad"; }
    else if (v.sys >= 130 || v.dia >= 80) { cat = "High blood pressure, stage 1"; tone = "warn"; }
    else if (v.sys >= 120) { cat = "Elevated"; tone = "warn"; }
    else if (v.sys < 90 || v.dia < 60) { cat = "Low (ask your doctor if you feel dizzy or faint)"; tone = "low"; }
    else { cat = "Normal"; tone = "good"; }
    return { rows: [["Reading", `${v.sys}/${v.dia} mmHg`], ["Category (AHA/ACC 2017)", cat, tone], ["Pulse pressure", `${v.sys - v.dia} mmHg`], ["Mean arterial pressure", `${r0(v.dia + (v.sys - v.dia) / 3)} mmHg`]], scale: { value: v.sys, min: 80, max: 200, unit: "systolic mmHg", zones: Z([[90, "Low", "low"], [120, "Normal", "good"], [130, "Elevated", "warn"], [140, "Stage 1", "warn"], [180, "Stage 2", "bad"], [200, "Crisis", "bad"]]) }, notes: ["One reading doesn't diagnose anything. Doctors look at several readings taken at rest on different days."] };
  }
  function cholesterol(v) {
    const k = v.unit === "mmol" ? { c: 38.67, t: 88.57 } : { c: 1, t: 1 };
    const tc = v.tc * k.c, ldl = v.ldl * k.c, hdl = v.hdl * k.c, tg = v.tg * k.t, male = v.sex === "m", rows = [];
    if (!(tc > 0 || ldl > 0 || hdl > 0 || tg > 0)) return bad("Enter at least one result.");
    const add = (name, val, bands) => { const b = bands.find(([to]) => val < to); rows.push([name, `${r0(val)} mg/dL`, b[2]], ["", b[1], b[2]]); };
    if (tc > 0) add("Total cholesterol", tc, [[200, "Desirable (under 200)", "good"], [240, "Borderline high (200–239)", "warn"], [1e9, "High (240 or more)", "bad"]]);
    if (ldl > 0) add("LDL (the 'bad' one)", ldl, [[100, "Optimal (under 100)", "good"], [130, "Near optimal (100–129)", "good"], [160, "Borderline high (130–159)", "warn"], [190, "High (160–189)", "bad"], [1e9, "Very high (190 or more)", "bad"]]);
    if (hdl > 0) { const low = male ? 40 : 50; add("HDL (the 'good' one)", hdl, [[low, `Low (under ${low}): a risk factor`, "bad"], [60, "Acceptable", "warn"], [1e9, "Protective (60 or more)", "good"]]); }
    if (tg > 0) add("Triglycerides", tg, [[150, "Normal (under 150)", "good"], [200, "Borderline high (150–199)", "warn"], [500, "High (200–499)", "bad"], [1e9, "Very high (500 or more)", "bad"]]);
    if (tc > 0 && hdl > 0) { rows.push(["Total ÷ HDL ratio", fix(tc / hdl, 1), tc / hdl < 5 ? "good" : "bad"], ["Non-HDL cholesterol", `${r0(tc - hdl)} mg/dL`, tc - hdl < 130 ? "good" : "warn"]); if (!(ldl > 0) && tg > 0 && tg < 400) rows.push(["Estimated LDL (Friedewald)", `${r0(tc - hdl - tg / 5)} mg/dL`]); }
    return { rows, notes: ["Targets depend on your other risk factors. Your doctor may set lower goals for you. Fasting is not always required for a lipid panel."] };
  }
  function glucose(v) {
    const k = v.unit === "mmol" ? 18.016 : 1, f = v.fpg * k, pp = v.pp * k, avg = v.avg * k, rows = [];
    if (!(f > 0 || v.a1c > 0 || pp > 0 || avg > 0)) return bad("Enter at least one result.");
    let scale;
    if (f > 0) { const b = f < 70 ? ["Low (under 70)", "low"] : f < 100 ? ["Normal (70–99)", "good"] : f < 126 ? ["Prediabetes range (100–125)", "warn"] : ["Diabetes range (126 or more)", "bad"]; rows.push(["Fasting glucose", `${r0(f)} mg/dL (${fix(f / 18.016, 1)} mmol/L)`, b[1]], ["", b[0], b[1]]); scale = { value: f, min: 60, max: 160, unit: "fasting mg/dL", zones: Z([[70, "Low", "low"], [100, "Normal", "good"], [126, "Pre", "warn"], [160, "Diabetes range", "bad"]]) }; }
    if (v.a1c > 0) { const a = v.a1c, b = a < 5.7 ? ["Normal (under 5.7%)", "good"] : a < 6.5 ? ["Prediabetes range (5.7–6.4%)", "warn"] : ["Diabetes range (6.5% or more)", "bad"]; rows.push(["A1C", fix(a, 1) + "%", b[1]], ["", b[0], b[1]], ["Estimated average glucose (eAG)", `${r0(28.7 * a - 46.7)} mg/dL (${fix((28.7 * a - 46.7) / 18.016, 1)} mmol/L)`]); if (!scale) scale = { value: a, min: 4, max: 10, unit: "A1C %", zones: Z([[5.7, "Normal", "good"], [6.5, "Pre", "warn"], [10, "Diabetes range", "bad"]]) }; }
    if (pp > 0) { const b = pp < 140 ? ["Normal (under 140)", "good"] : pp < 200 ? ["Prediabetes range (140–199)", "warn"] : ["Diabetes range (200 or more)", "bad"]; rows.push(["2 hours after eating or a glucose drink", `${r0(pp)} mg/dL`, b[1]], ["", b[0], b[1]]); }
    if (avg > 0) rows.push(["Estimated A1C from your average glucose", fix((avg + 46.7) / 28.7, 1) + "%"]);
    return { rows, scale, notes: ["Ranges are from the American Diabetes Association. Only a doctor can diagnose diabetes, which needs repeat or confirming tests."] };
  }
  function pregnancy(v) {
    if (!v.lmp) return bad("Pick the first day of your last period.");
    const lmp = new Date(v.lmp + "T00:00:00"), now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (!(lmp <= t0)) return bad("That date is in the future.");
    const days = Math.round((t0 - lmp) / 86400000), due = new Date(lmp.getTime() + 280 * 86400000), wk = Math.floor(days / 7);
    const rows = [["Due date", due.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), "good"], ["Gestational age", `${wk} weeks, ${days % 7} days`], ["Trimester", wk < 14 ? "First" : wk < 28 ? "Second" : "Third"], ["Days to go", String(Math.max(0, 280 - days))]];
    if (days > 300) rows.push(["Note", "That's well past a typical pregnancy length. Check the date."]);
    if (has(v.w, v.h)) { const bmi = v.w / ((v.h / 100) ** 2), g = bmi < 18.5 ? [28, 40] : bmi < 25 ? [25, 35] : bmi < 30 ? [15, 25] : [11, 20]; rows.push(["Pre-pregnancy BMI", fix(bmi)], ["Recommended total weight gain (IOM)", `${g[0]} to ${g[1]} lb (${fix(g[0] * LB)} to ${fix(g[1] * LB)} kg)`]); }
    return { rows, notes: ["Due dates are estimates (only about 4% of babies arrive on the day). Dating by ultrasound may change yours.", "Weight-gain guidance is for a single baby. Your care team will personalize it."] };
  }

  // ================= CONVERTER =================
  const LINEAR = {
    weight: { label: "Weight", base: "kg", units: { kg: 1, g: 0.001, mg: 1e-6, lb: LB, oz: 0.028349523125, stone: 6.35029318 } },
    length: { label: "Length / height", base: "m", units: { m: 1, cm: 0.01, mm: 0.001, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 } },
    volume: { label: "Volume (cooking)", base: "ml", units: { ml: 1, l: 1000, tsp: 4.92892159, tbsp: 14.78676478, "fl oz": 29.5735296, cup: 236.588236, pint: 473.176473, quart: 946.352946, gallon: 3785.411784 } },
    energy: { label: "Energy (food)", base: "kcal", units: { kcal: 1, kJ: 1 / 4.184, "cal (small)": 0.001 } },
    glucose: { label: "Blood glucose", base: "mg/dL", units: { "mg/dL": 1, "mmol/L": 18.016 } },
    cholesterol: { label: "Cholesterol (total, LDL, HDL)", base: "mg/dL", units: { "mg/dL": 1, "mmol/L": 38.67 } },
    triglycerides: { label: "Triglycerides", base: "mg/dL", units: { "mg/dL": 1, "mmol/L": 88.57 } },
    vitD: { label: "Vitamin D", base: "mcg", units: { mcg: 1, IU: 0.025 } },
    vitA: { label: "Vitamin A", base: "mcg RAE", units: { "mcg RAE": 1, "IU retinol": 0.3, "IU beta-carotene (supplement)": 0.15, "IU beta-carotene (food)": 0.05 } },
    vitE: { label: "Vitamin E", base: "mg", units: { "mg alpha-tocopherol": 1, "IU natural (d-alpha)": 0.67, "IU synthetic (dl-alpha)": 0.9 } },
    sodium: { label: "Sodium ↔ salt", base: "mg sodium", units: { "mg sodium": 1, "g sodium": 1000, "mg salt": 0.4, "g salt": 400, "tsp salt (about 6 g)": 2400 } },
    temperature: { label: "Temperature", special: true, units: { "°C": 0, "°F": 0, K: 0 } },
    speed: { label: "Speed / running pace", special: true, units: { "km/h": 0, mph: 0, "min per km": 0, "min per mile": 0 } }
  };
  C.CONVERT_TYPES = Object.entries(LINEAR).map(([k, x]) => [k, x.label]);
  C.convertUnits = (type) => Object.keys((LINEAR[type] || LINEAR.weight).units);
  function convert(v) {
    const T = LINEAR[v.type] || LINEAR.weight, x = v.val;
    if (!Number.isFinite(x)) return bad("Enter a number.");
    const from = T.units[v.from] !== undefined ? v.from : Object.keys(T.units)[0], rows = [];
    if (v.type === "temperature") {
      const c = from === "°C" ? x : from === "°F" ? ((x - 32) * 5) / 9 : x - 273.15;
      rows.push(["°C", fix(c, 2)], ["°F", fix((c * 9) / 5 + 32, 2)], ["K", fix(c + 273.15, 2)]);
      return { rows: rows.filter(([u]) => u !== from), notes: ["Normal body temperature is about 98.6 °F (37 °C)."] };
    }
    if (v.type === "speed") {
      if (x <= 0) return bad("Enter a number above zero.");
      const kmh = from === "km/h" ? x : from === "mph" ? x * 1.609344 : from === "min per km" ? 60 / x : 96.56064 / x;
      const out = { "km/h": fix(kmh, 2), mph: fix(kmh / 1.609344, 2), "min per km": hms(3600 / kmh), "min per mile": hms(5793.6384 / kmh) };
      return { rows: Object.entries(out).filter(([u]) => u !== from) };
    }
    const base = x * T.units[from];
    for (const [u, f] of Object.entries(T.units)) if (u !== from) rows.push([u, fix(base / f, Math.abs(base / f) < 10 ? 3 : 2)]);
    const notes = [];
    if (v.type === "vitA" || v.type === "vitE" || v.type === "vitD") notes.push("IU is not a fixed weight, since it depends on the vitamin and form. These are the official NIH conversions.");
    if (v.type === "sodium") notes.push("Salt is about 40% sodium. The limit for most adults is about 2,300 mg sodium, close to 1 teaspoon of salt.");
    if (v.type === "cholesterol" || v.type === "triglycerides") notes.push("Cholesterol and triglycerides use different factors. Pick the right row.");
    return { rows, notes };
  }

  // ================= calculator registry =================
  const SEX = { k: "sex", t: "sel", label: "Sex", opts: [["", "Choose…"], ["f", "Female"], ["m", "Male"]] };
  const WT = { k: "w", t: "wt", label: "Weight" }, HT = { k: "h", t: "ht", label: "Height" }, AGE = { k: "age", t: "num", label: "Age", min: 10, max: 110, ph: "years" };
  const LEN = (k, label, opt) => ({ k, t: "len", label, opt });
  C.GROUPS = [["body", "Body & weight", "🧍"], ["cal", "Calories & nutrition", "🥗"], ["fit", "Fitness & activity", "🏃"], ["heart", "Heart, blood & pregnancy", "❤️"], ["conv", "Converters", "🔁"]];
  C.CALCS = [
    { id: "bmi", g: "body", icon: "⚖️", title: "BMI calculator", desc: "Body mass index with a chart, healthy range and how much to lose or gain.", kw: "bmi body mass index overweight underweight obese healthy weight chart", fields: [WT, HT, { k: "ref", t: "sel", label: "Cut-offs", opts: [["who", "Standard (WHO)"], ["asian", "Asian-specific (lower cut-offs)"]] }], run: bmiCalc },
    { id: "ideal", g: "body", icon: "🎯", title: "Ideal body weight", desc: "Devine, Robinson, Miller and Hamwi formulas.", kw: "ideal weight devine robinson miller hamwi", fields: [HT, SEX], run: idealWeight },
    { id: "bodyfat", g: "body", icon: "📏", title: "Body fat % (tape measure)", desc: "US Navy method with ACE categories, fat mass and lean mass.", kw: "body fat percentage navy tape measure lean mass", fields: [SEX, HT, WT, LEN("neck", "Neck"), LEN("waist", "Waist (at the navel)"), LEN("hip", "Hip (women only, widest part)", true)], run: bodyFat },
    { id: "whr", g: "body", icon: "🍎", title: "Waist, hip & height ratios", desc: "Waist-to-hip, waist-to-height and waist-size risk.", kw: "waist hip ratio whr whtr apple pear belly fat risk", fields: [SEX, LEN("waist", "Waist"), LEN("hip", "Hip (optional)", true), Object.assign({}, HT, { opt: true })], run: whr },
    { id: "lbm", g: "body", icon: "💪", title: "Lean body mass", desc: "Boer, James and Hume formulas.", kw: "lean body mass lbm muscle fat free", fields: [WT, HT, SEX], run: leanMass },
    { id: "bsa", g: "body", icon: "🧬", title: "Body surface area", desc: "Mosteller and DuBois, used in medicine.", kw: "body surface area bsa mosteller dubois", fields: [WT, HT], run: bsa },
    { id: "goal", g: "body", icon: "📅", title: "Goal weight date", desc: "How long to reach your goal at a steady weekly pace.", kw: "goal weight date timeline weeks lose gain how long", fields: [WT, { k: "goal", t: "wt", label: "Goal weight" }, { k: "rate", t: "wt", label: "Change per week", ph: "e.g. 1" }], run: goalDate },

    { id: "tdee", g: "cal", icon: "🔥", title: "BMR & daily calories (TDEE)", desc: "Calories you burn at rest and per day, plus lose/gain targets.", kw: "bmr tdee calories maintenance metabolism mifflin harris katch burn", fields: [SEX, AGE, WT, HT, { k: "act", t: "sel", label: "Activity level", opts: ACT }, { k: "formula", t: "sel", label: "Formula", opts: [["mifflin", "Mifflin-St Jeor (most accurate for most)"], ["harris", "Harris-Benedict (revised)"], ["katch", "Katch-McArdle (needs body-fat %)"]] }, { k: "bf", t: "num", label: "Body fat % (Katch only)", opt: true, ph: "e.g. 22" }], run: tdee, defaults: { act: "1.375" } },
    { id: "macros", g: "cal", icon: "🥩", title: "Macro calculator", desc: "Turn calories into grams of carbs, protein and fat.", kw: "macros macronutrients carbs protein fat grams keto split", fields: [{ k: "cal", t: "num", label: "Daily calories", ph: "e.g. 2000" }, { k: "preset", t: "sel", label: "Split", opts: [...Object.entries(PRESETS).map(([k, x]) => [k, `${x[3]} (${x[0]}C / ${x[1]}P / ${x[2]}F)`]), ["custom", "Custom (fill in the % below)"]] }, { k: "c", t: "num", label: "Custom carbs %", opt: true }, { k: "p", t: "num", label: "Custom protein %", opt: true }, { k: "f", t: "num", label: "Custom fat %", opt: true }], run: macros, defaults: { preset: "balanced" } },
    { id: "protein", g: "cal", icon: "🍗", title: "Protein needs", desc: "Daily protein by goal, per kg of body weight.", kw: "protein intake grams muscle building rda", fields: [WT, { k: "goal", t: "sel", label: "Goal", opts: C.PROTEIN_GOALS }], run: protein, defaults: { goal: "general" } },
    { id: "water", g: "cal", icon: "💧", title: "Water intake", desc: "Daily fluids adjusted for exercise and heat.", kw: "water hydration fluids drink intake", fields: [WT, { k: "mins", t: "num", label: "Exercise minutes per day", opt: true, ph: "e.g. 30" }, { k: "hot", t: "sel", label: "Hot weather?", opts: [["no", "No"], ["yes", "Yes"]] }], run: water, defaults: { hot: "no" } },

    { id: "met", g: "fit", icon: "🔥", title: "Calories burned (MET)", desc: "Estimate calories burned for 26 activities.", kw: "calories burned exercise met activity walking running cycling swimming", fields: [{ k: "act", t: "sel", label: "Activity", opts: METS.map((m, i) => [String(i), `${m[0]} (MET ${m[1]})`]) }, { k: "mins", t: "num", label: "Minutes", ph: "e.g. 30" }, WT], run: met, defaults: { act: "1" } },
    { id: "hr", g: "fit", icon: "💓", title: "Heart-rate zones", desc: "Max heart rate and training zones (with Karvonen).", kw: "heart rate zones max hr karvonen cardio target training", fields: [AGE, { k: "rhr", t: "num", label: "Resting heart rate (optional)", opt: true, ph: "bpm" }], run: hrZones },
    { id: "orm", g: "fit", icon: "🏋️", title: "One-rep max", desc: "Estimate your max lift from a set, with a % chart.", kw: "one rep max 1rm lifting strength epley brzycki", fields: [{ k: "lift", t: "wt", label: "Weight lifted" }, { k: "reps", t: "num", label: "Reps completed", ph: "e.g. 5" }], run: oneRM },
    { id: "pace", g: "fit", icon: "⏱️", title: "Running pace & race predictor", desc: "Pace, speed and predicted race times.", kw: "pace running speed 5k 10k marathon race predictor min per mile", fields: [{ k: "dist", t: "num", label: "Distance", ph: "e.g. 5" }, { k: "du", t: "sel", label: "Distance unit", opts: [["km", "kilometers"], ["mi", "miles"]] }, { k: "hh", t: "num", label: "Hours", opt: true }, { k: "mm", t: "num", label: "Minutes" }, { k: "ss", t: "num", label: "Seconds", opt: true }], run: pace, defaults: { du: "km" } },
    { id: "steps", g: "fit", icon: "👣", title: "Steps to distance", desc: "Turn steps into miles or kilometers.", kw: "steps distance pedometer walking miles stride", fields: [{ k: "steps", t: "num", label: "Steps", ph: "e.g. 10000" }, HT, SEX], run: steps },
    { id: "sleep", g: "fit", icon: "😴", title: "Sleep cycle calculator", desc: "Best bedtimes or wake-up times in 90-minute cycles.", kw: "sleep cycles bedtime wake up rem", fields: [{ k: "mode", t: "sel", label: "I know my…", opts: [["wake", "wake-up time (find bedtime)"], ["bed", "bedtime (find wake-up time)"]] }, { k: "time", t: "time", label: "Time" }], run: sleep, defaults: { mode: "wake", time: "07:00" } },

    { id: "bp", g: "heart", icon: "🩺", title: "Blood pressure checker", desc: "AHA categories with a color chart.", kw: "blood pressure bp systolic diastolic hypertension reading", fields: [{ k: "sys", t: "num", label: "Top number (systolic)", ph: "e.g. 118" }, { k: "dia", t: "num", label: "Bottom number (diastolic)", ph: "e.g. 76" }], run: bp },
    { id: "chol", g: "heart", icon: "🧪", title: "Cholesterol checker", desc: "Total, LDL, HDL, triglycerides, ratios and estimated LDL.", kw: "cholesterol ldl hdl triglycerides lipid panel ratio", fields: [{ k: "unit", t: "sel", label: "Units", opts: [["mgdl", "mg/dL (US)"], ["mmol", "mmol/L (UK, Canada, EU)"]] }, SEX, { k: "tc", t: "num", label: "Total cholesterol", opt: true }, { k: "ldl", t: "num", label: "LDL", opt: true }, { k: "hdl", t: "num", label: "HDL", opt: true }, { k: "tg", t: "num", label: "Triglycerides", opt: true }], run: cholesterol, defaults: { unit: "mgdl" } },
    { id: "gluc", g: "heart", icon: "🩸", title: "Blood sugar & A1C", desc: "Fasting glucose, A1C, post-meal, and A1C ↔ average glucose.", kw: "blood sugar glucose a1c diabetes prediabetes fasting eag", fields: [{ k: "unit", t: "sel", label: "Glucose units", opts: [["mgdl", "mg/dL (US)"], ["mmol", "mmol/L (UK, Canada, EU)"]] }, { k: "fpg", t: "num", label: "Fasting glucose", opt: true }, { k: "a1c", t: "num", label: "A1C %", opt: true, ph: "e.g. 5.4" }, { k: "pp", t: "num", label: "2 hours after eating", opt: true }, { k: "avg", t: "num", label: "Average glucose (for estimated A1C)", opt: true }], run: glucose, defaults: { unit: "mgdl" } },
    { id: "preg", g: "heart", icon: "🤰", title: "Pregnancy due date & weight gain", desc: "Due date, week of pregnancy, trimester and recommended weight gain.", kw: "pregnancy due date weeks trimester weight gain lmp", fields: [{ k: "lmp", t: "date", label: "First day of last period" }, Object.assign({}, WT, { label: "Pre-pregnancy weight (optional)", opt: true }), Object.assign({}, HT, { opt: true })], run: pregnancy },

    {
      id: "convert", g: "conv", icon: "🔁", title: "Unit converter", desc: "Weight, length, cooking volume, calories, temperature, glucose, cholesterol, vitamin IU ↔ mcg, sodium ↔ salt and running pace.", kw: "convert conversion converter lb kg cm inches cups ml celsius fahrenheit mmol iu mcg sodium salt kj",
      fields: (vals) => [{ k: "type", t: "sel", label: "What are you converting?", opts: C.CONVERT_TYPES, rr: true }, { k: "val", t: "num", label: "Value", ph: "e.g. 150", step: "any" }, { k: "from", t: "sel", label: "From", opts: C.convertUnits(vals.type || "weight").map((u) => [u, u]) }],
      run: convert, defaults: { type: "weight", from: "lb" }
    }
  ];
  C.calcById = (id) => C.CALCS.find((c) => c.id === id);
  C.fieldsOf = (calc, vals) => (typeof calc.fields === "function" ? calc.fields(vals || {}) : calc.fields);

  // ---------- value plumbing (strings the person typed -> canonical metric numbers) ----------
  const num = (x) => (x === "" || x == null ? NaN : parseFloat(x));
  C.canon = function (calc, vals, us) {
    const v = {};
    for (const f of C.fieldsOf(calc, vals)) {
      const raw = vals[f.k];
      if (f.t === "wt") { const n = num(raw); v[f.k] = us ? n * LB : n; }
      else if (f.t === "len") { const n = num(raw); v[f.k] = us ? n * IN : n; }
      else if (f.t === "ht") { if (us) { const ft = num(raw), inch = num(vals[f.k + "2"]); v[f.k] = Number.isFinite(ft) || Number.isFinite(inch) ? ((Number.isFinite(ft) ? ft : 0) * 12 + (Number.isFinite(inch) ? inch : 0)) * IN : NaN; } else v[f.k] = num(raw); }
      else if (f.t === "num") v[f.k] = num(raw);
      else v[f.k] = raw == null ? "" : String(raw);
    }
    // the converter's "unit" selects on cholesterol/glucose use these string values
    return v;
  };
  C.run = (calc, vals, us) => calc.run(C.canon(calc, vals, us));
  // Move typed values between US and metric when the person flips the unit switch
  C.convertVals = function (calc, vals, toUs) {
    const out = Object.assign({}, vals), rnd = (n, d = 1) => String(Math.round(n * 10 ** d) / 10 ** d);
    for (const f of C.fieldsOf(calc, vals)) {
      if (f.t === "wt" || f.t === "len") { const n = num(vals[f.k]); if (Number.isFinite(n)) out[f.k] = rnd(toUs ? (f.t === "wt" ? n / LB : n / IN) : (f.t === "wt" ? n * LB : n * IN)); }
      else if (f.t === "ht") {
        if (toUs) { const cm = num(vals[f.k]); if (Number.isFinite(cm)) { const t = cm / IN, ft = Math.floor(t / 12); out[f.k] = String(ft); out[f.k + "2"] = rnd(t - ft * 12); } }
        else { const ft = num(vals[f.k]), inch = num(vals[f.k + "2"]); if (Number.isFinite(ft) || Number.isFinite(inch)) { out[f.k] = rnd(((Number.isFinite(ft) ? ft : 0) * 12 + (Number.isFinite(inch) ? inch : 0)) * IN, 0); delete out[f.k + "2"]; } }
      }
    }
    return out;
  };

  // ================= reference charts (static) =================
  const healthyWeightRows = () => { const rows = []; for (let inch = 58; inch <= 78; inch += 2) { const m = (inch * IN) / 100, lo = 18.5 * m * m, hi = 24.9 * m * m; rows.push([`${Math.floor(inch / 12)}′ ${inch % 12}″ (${r0(inch * IN)} cm)`, `${r0(kgToLb(lo))}–${r0(kgToLb(hi))} lb`, `${r0(lo)}–${r0(hi)} kg`]); } return rows; };
  const DV = [["Vitamin A", "900 mcg RAE"], ["Vitamin B1 (thiamin)", "1.2 mg"], ["Vitamin B2 (riboflavin)", "1.3 mg"], ["Vitamin B3 (niacin)", "16 mg NE"], ["Vitamin B5 (pantothenic acid)", "5 mg"], ["Vitamin B6", "1.7 mg"], ["Vitamin B7 (biotin)", "30 mcg"], ["Vitamin B9 (folate)", "400 mcg DFE"], ["Vitamin B12", "2.4 mcg"], ["Vitamin C", "90 mg"], ["Vitamin D", "20 mcg (800 IU)"], ["Vitamin E", "15 mg"], ["Vitamin K", "120 mcg"], ["Choline", "550 mg"], ["Calcium", "1,300 mg"], ["Chromium", "35 mcg"], ["Copper", "0.9 mg"], ["Iodine", "150 mcg"], ["Iron", "18 mg"], ["Magnesium", "420 mg"], ["Manganese", "2.3 mg"], ["Molybdenum", "45 mcg"], ["Phosphorus", "1,250 mg"], ["Potassium", "4,700 mg"], ["Selenium", "55 mcg"], ["Sodium (limit)", "2,300 mg"], ["Zinc", "11 mg"], ["Chloride", "2,300 mg"]];
  const GUIDE = [
    ["Vitamin A", "Vision, skin, immune function", "Sweet potato, carrots, spinach, liver, eggs"], ["Vitamin B1 (thiamin)", "Turns carbs into energy; nerves", "Whole grains, lentils, beans, pork, seeds"],
    ["Vitamin B2 (riboflavin)", "Energy, skin, eyes", "Eggs, dairy, mushrooms, spinach, almonds"], ["Vitamin B3 (niacin)", "Energy, digestion, skin", "Chicken, turkey, tuna, peanuts, mushrooms"],
    ["Vitamin B5 (pantothenic acid)", "Makes energy and hormones", "Avocado, mushrooms, eggs, chicken, sweet potato"], ["Vitamin B6", "Mood, brain, protein metabolism", "Chickpeas, salmon, chicken, bananas, potatoes"],
    ["Vitamin B7 (biotin)", "Hair, skin and nails, metabolism", "Eggs, salmon, nuts, avocado, sweet potato"], ["Vitamin B9 (folate)", "Cell growth, vital in pregnancy", "Leafy greens, lentils, beans, asparagus, fortified grains"],
    ["Vitamin B12", "Nerves, red blood cells, energy", "Fish, meat, eggs, dairy. Vegans need a supplement or fortified foods"], ["Vitamin C", "Immunity, collagen, helps absorb iron", "Peppers, citrus, strawberries, broccoli, kiwi"],
    ["Vitamin D", "Bones, immunity, mood", "Sunlight, salmon, eggs, fortified milk"], ["Vitamin E", "Antioxidant for skin and cells", "Nuts, seeds, olive oil, avocado, spinach"],
    ["Vitamin K", "Blood clotting, bone health", "Kale, spinach, broccoli, greens"], ["Choline", "Brain, liver, memory", "Eggs, beef, chicken, salmon, soy"],
    ["Calcium", "Bones, teeth, muscles", "Dairy, fortified plant milk, tofu, kale, sardines"], ["Chromium", "Helps insulin work", "Broccoli, whole grains, meat, bananas"],
    ["Copper", "Iron use, collagen, nerves", "Shellfish, nuts, seeds, beans, mushrooms"], ["Iodine", "Thyroid and metabolism", "Fish, dairy, eggs, iodized salt, seaweed"],
    ["Iron", "Carries oxygen in blood", "Red meat, lentils, spinach, fortified cereal. Pair with vitamin C"], ["Magnesium", "Sleep, muscles, nerves, blood pressure", "Pumpkin seeds, almonds, spinach, beans, whole grains"],
    ["Manganese", "Bones, metabolism, antioxidant", "Oats, brown rice, nuts, beans, tea"], ["Molybdenum", "Enzymes that process food and toxins", "Legumes, grains, nuts"],
    ["Phosphorus", "Bones, energy storage", "Dairy, fish, meat, beans, nuts"], ["Potassium", "Blood pressure, muscles, fluid balance", "Bananas, potatoes, beans, spinach, yogurt"],
    ["Selenium", "Thyroid, antioxidant", "Brazil nuts, tuna, eggs, shrimp"], ["Zinc", "Immunity, wound healing, skin", "Oysters, beef, pumpkin seeds, lentils, chickpeas"],
    ["Sodium", "Fluid balance, nerves. Most people get too much", "Salt, processed foods, soy sauce, bread, cheese"], ["Omega-3 (EPA/DHA)", "Heart, brain, inflammation", "Salmon, sardines, mackerel, walnuts, chia, flax"]
  ];
  C.REFS = [
    { id: "r-bmi", icon: "⚖️", title: "BMI chart", kw: "bmi chart categories underweight overweight obese", head: ["BMI", "Category (WHO)", "Asian cut-offs"], rows: [["Under 18.5", "Underweight", "Underweight"], ["18.5 – 24.9", "Healthy weight", "18.5 – 22.9 healthy"], ["25 – 29.9", "Overweight", "23 – 27.4 overweight"], ["30 – 34.9", "Obesity, class 1", "27.5 and up obese"], ["35 – 39.9", "Obesity, class 2", ""], ["40 and up", "Obesity, class 3", ""]], note: "Adults 20 and older. Children and teens use BMI-for-age percentile charts." },
    { id: "r-hw", icon: "📐", title: "Healthy weight by height", kw: "healthy weight height chart table", head: ["Height", "Healthy weight (lb)", "(kg)"], rows: healthyWeightRows(), note: "Range for BMI 18.5 to 24.9." },
    { id: "r-bf", icon: "📏", title: "Body fat % chart", kw: "body fat percentage chart categories ace", head: ["Category", "Women", "Men"], rows: [["Essential fat", "10–13%", "2–5%"], ["Athletes", "14–20%", "6–13%"], ["Fitness", "21–24%", "14–17%"], ["Average", "25–31%", "18–24%"], ["Obese", "32% and up", "25% and up"]], note: "American Council on Exercise (ACE) categories." },
    { id: "r-waist", icon: "🍎", title: "Waist & ratio risk chart", kw: "waist circumference whr whtr risk chart", head: ["Measure", "Women", "Men"], rows: [["Waist: higher risk above", "35 in (88 cm)", "40 in (102 cm)"], ["Waist-to-hip ratio: risk above", "0.85", "0.90"], ["Waist-to-height ratio", "Under 0.5 is healthy", "Under 0.5 is healthy"]] },
    { id: "r-bp", icon: "🩺", title: "Blood pressure chart", kw: "blood pressure chart categories hypertension", head: ["Category", "Top (systolic)", "Bottom (diastolic)"], rows: [["Normal", "under 120", "and under 80"], ["Elevated", "120–129", "and under 80"], ["High, stage 1", "130–139", "or 80–89"], ["High, stage 2", "140 or more", "or 90 or more"], ["Crisis (seek care now)", "over 180", "and/or over 120"]], note: "AHA/ACC 2017 guidelines for adults." },
    { id: "r-chol", icon: "🧪", title: "Cholesterol chart", kw: "cholesterol chart ldl hdl triglycerides ranges", head: ["Test (mg/dL)", "Good", "Borderline", "High"], rows: [["Total", "under 200", "200–239", "240+"], ["LDL", "under 100", "130–159", "160+ (190+ very high)"], ["HDL", "60+ (protective)", "40–59 men / 50–59 women", "under 40 men / 50 women (low)"], ["Triglycerides", "under 150", "150–199", "200+ (500+ very high)"]], note: "To convert to mmol/L: cholesterol × 0.0259, triglycerides × 0.0113." },
    { id: "r-glu", icon: "🩸", title: "Blood sugar & A1C chart", kw: "blood sugar glucose a1c chart diabetes prediabetes eag", head: ["Test", "Normal", "Prediabetes", "Diabetes range"], rows: [["Fasting glucose", "70–99 mg/dL", "100–125", "126+"], ["2 hours after eating (OGTT)", "under 140", "140–199", "200+"], ["A1C", "under 5.7%", "5.7–6.4%", "6.5%+"], ["A1C 5% = avg glucose", "97 mg/dL", "", ""], ["A1C 6% = avg glucose", "126 mg/dL", "", ""], ["A1C 7% = avg glucose", "154 mg/dL", "", ""], ["A1C 8% = avg glucose", "183 mg/dL", "", ""], ["A1C 9% = avg glucose", "212 mg/dL", "", ""], ["A1C 10% = avg glucose", "240 mg/dL", "", ""]], note: "American Diabetes Association ranges. A diagnosis needs a doctor." },
    { id: "r-vitals", icon: "🌡️", title: "Normal vital signs (adults)", kw: "vital signs normal range resting heart rate temperature oxygen respiration", head: ["Vital sign", "Typical range"], rows: [["Resting heart rate", "60–100 bpm (athletes can be 40–60)"], ["Blood pressure", "under 120/80 mmHg"], ["Breathing rate", "12–20 breaths per minute"], ["Body temperature", "97–99 °F (36.1–37.2 °C)"], ["Oxygen saturation", "95–100%"], ["Sleep", "7–9 hours"]] },
    { id: "r-dv", icon: "📋", title: "Daily Values (FDA label values)", kw: "daily values dv rda vitamins minerals recommended intake nutrition label", head: ["Nutrient", "Daily Value (adults)"], rows: DV, note: "The 100% reference on US Nutrition Facts labels. Your own needs depend on age, sex and health." },
    { id: "r-guide", icon: "📖", title: "Vitamin & mineral guide", kw: "vitamin mineral guide food sources what does", head: ["Nutrient", "What it does", "Good food sources"], rows: GUIDE }
  ];
})(globalThis);
