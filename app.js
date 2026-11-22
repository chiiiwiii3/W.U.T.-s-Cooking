/* W.U.T.'s Cooking — the app (UI only). Food data is in data.js, the brain is in engine.js. */
(function () {
  "use strict";
  const W = window.WUT;
  const KEY = "wuts_cooking_v3";
  const $app = document.getElementById("app");

  // ---------- helpers ----------
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const today = () => W.ymd(new Date());
  const COMMON = W.COMMON_ALLERGIES;
  const MAX_FILES = 3, MAX_FILE = 1.5e6;
  const SLOT_EMOJI = { Breakfast: "🍳", Lunch: "🥪", Dinner: "🍲", Snack: "🍎" };

  function defaults() {
    return {
      v: 3, screen: "onboarding", step: 1, view: null, back: "home", legalV: 0, legalCheck: false, legalAge: false,
      profile: { name: "", bdM: "", bdD: "", bdY: "", age: "", ageTxt: "", sex: "", sexTxt: "", repro: "", trimester: "", cycle: "", periodDate: "", cycleLen: "28", units: "us", weight: "", weightTxt: "", heightSel: "", heightTxt: "", heightFt: "", heightIn: "", heightCm: "", ethnicity: "", ethnicityTxt: "", bloodType: "", bloodTypeTxt: "", diet: "unsure", dietTxt: "", allergies: [], conditions: [] },
      goals: { body: "", micros: [], beauty: [], wellness: [], lifestyle: [] },
      targets: { cal: "", p: "", c: "", f: "" },
      planLen: 7, lenCustom: false,
      newLen: "7", newLenCustom: "",
      plan: null, favorites: [], myRecipes: [], log: [],
      shop: { win: 1, checked: {} }, filter: "all", undo: null,
      nutty: W.nutty.fresh(),
      draft: { name: "", meal: "Lunch", ingredients: "", steps: "", storage: "", cal: "", p: "", c: "", f: "", files: [] }
    };
  }
  function load() {
    const d = defaults();
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 3) {
        if (s.profile) { s.profile.ageTxt = ""; s.profile.sexTxt = ""; s.profile.bloodTypeTxt = "";
          const wt = parseFloat(s.profile.weightTxt); if (wt > 0 && !s.profile.weight) s.profile.weight = String(Math.round(wt)); s.profile.weightTxt = ""; s.profile.heightTxt = ""; }
        for (const k in s) d[k] = d[k] && typeof d[k] === "object" && !Array.isArray(d[k]) && s[k] && typeof s[k] === "object" ? Object.assign(d[k], s[k]) : s[k];
      }
    } catch (e) { /* first run or storage blocked */ }
    if (d.legalV < W.LEGAL_VERSION) { d.legalAge = false; d.legalCheck = false; }
    return d;
  }
  let state = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; } }

  function getPath(path) { return path.split(".").reduce((o, k) => (o == null ? o : o[k]), state); }
  function setPath(path, v) {
    const ks = path.split("."), last = ks.pop();
    const o = ks.reduce((a, k) => a[k], state);
    o[last] = v;
  }
  function toast(msg) {
    let box = document.getElementById("toasts");
    if (!box) { box = document.createElement("div"); box.id = "toasts"; box.setAttribute("role", "status"); box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; box.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }
  const portionText = (p) => (p === 1 ? "1 serving" : `${W.fmtFrac(p)} servings`);
  const dietLabel = () => (W.DIETS.find((d) => d.id === W.effDiet(state.profile)) || W.DIETS[0]).label;
  const dietPillText = () => (W.effDiet(state.profile) === "unsure" ? "Diet: Balanced mix" : "Diet: " + dietLabel());
  const dateLabel = (ymd) => { const p = ymd.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }); };

  // ---------- form builders ----------
  function inp(label, path, o = {}) {
    const t = o.type || "text";
    return `<label class="field"><span>${esc(label)}</span><input type="${t}" ${t === "number" ? 'inputmode="decimal"' : ""} ${o.min != null ? `min="${o.min}"` : ""} ${o.max != null ? `max="${o.max}"` : ""} data-bind="${path}" value="${esc(getPath(path))}" placeholder="${esc(o.ph || "")}" autocomplete="off"></label>`;
  }
  function sel(label, path, options, rr) {
    const cur = getPath(path);
    return `<label class="field"><span>${esc(label)}</span><select data-bind="${path}" ${rr ? "data-rr" : ""}>${options.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(cur) ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>`;
  }
  function chip(label, on, act, arg, extra = "") {
    return `<button type="button" class="chip${on ? " on" : ""}" aria-pressed="${on ? "true" : "false"}" data-act="${act}" data-arg="${esc(arg)}" ${extra}>${esc(label)}</button>`;
  }
  const stat = (label, val, unit) => `<div class="stat"><b>${val}${unit || ""}</b><span>${label}</span></div>`;

  // ---------- onboarding / profile form sections ----------
  // ----- option lists for the dropdowns -----
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const rng = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const withChoose = (list, text) => [["", text || "Choose…"], ...list];
  const ageOpts = () => withChoose(rng(13, 100).map((n) => [String(n), n + " years"]));
  const weightOpts = (us) => withChoose(us ? rng(80, 450).map((n) => [String(n), `${n} lb (${Math.round(n * 0.45359237)} kg)`]) : rng(35, 200).map((n) => [String(n), `${n} kg (${Math.round(n / 0.45359237)} lb)`]));
  const heightOpts = (us) => {
    if (!us) return withChoose(rng(100, 230).map((c) => [String(c), `${c} cm (${Math.floor(Math.round(c / 2.54) / 12)} ft ${Math.round(c / 2.54) % 12} in)`]));
    const out = [];
    for (let ft = 3; ft <= 7; ft++) for (let i = 0; i < 12; i++) out.push([`${ft}-${i}`, `${ft} ft ${i} in (${Math.round((ft * 12 + i) * 2.54)} cm)`]);
    return withChoose(out);
  };
  const selBare = (path, options, label) => {
    const cur = String(getPath(path));
    return `<select aria-label="${esc(label)}" data-bind="${path}" data-rr>${options.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === cur ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  };
  // A dropdown with an optional type-in box underneath (a typed value wins over the dropdown)
  function combo(label, selPath, options, txtPath, o = {}) {
    return `<div class="combo">${sel(label, selPath, options, !!o.rr)}${inp(o.typedLabel || "Or type your own (optional)", txtPath, { ph: o.ph || "", type: o.type || "text" })}</div>`;
  }
  function bodyBasics() {
    const p = state.profile;
    const age = W.effAge(p), bdSet = p.bdM && p.bdD && p.bdY;
    const bdOk = bdSet && (() => { const y = +p.bdY, m = +p.bdM, d = +p.bdD, dt = new Date(y, m - 1, d); return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d; })();
    const yr = new Date().getFullYear();
    const bdNote = bdSet ? (bdOk ? `<p class="hint">🎂 That makes you <b>${age}</b> years old.</p>` : `<div class="note">That date doesn't exist. Please check the month and day.</div>`) : "";
    return `
      ${inp("What should we call you?", "profile.name", { ph: "Your name" })}
      <div class="group"><div class="label">Birthday <small>optional</small></div>
        <div class="grid3">${selBare("profile.bdM", withChoose(MONTHS.map((m, i) => [String(i + 1), m]), "Month"), "Birth month")}${selBare("profile.bdD", withChoose(rng(1, 31).map((n) => [String(n), String(n)]), "Day"), "Birth day")}${selBare("profile.bdY", withChoose(rng(yr - 110, yr).reverse().map((n) => [String(n), String(n)]), "Year"), "Birth year")}</div>
        ${bdNote}</div>
      ${sel("Age", "profile.age", ageOpts(), true)}
      <p class="hint">If you add your birthday we'll use it for your age.</p>
      ${sel("Sex (used for calorie estimates)", "profile.sex", [["", "Prefer not to say"], ["female", "Female"], ["male", "Male"], ["other", "Other / non-binary"]], true)}
      ${state.profile.sex === "female" ? `<p class="hint">🌸 Since you picked female, you'll get a short extra screen for pregnancy and your menstrual cycle. It's optional.</p>` : ""}
      <p class="hint">Everything here is optional, and it stays on your device.</p>`;
  }
  function bodyMeasure() {
    const p = state.profile, us = p.units === "us";
    return `
      <div class="seg" role="group" aria-label="Units">${chip("US (lb, ft/in)", us, "units", "us")}${chip("Metric (kg, cm)", !us, "units", "metric")}</div>
      ${sel("Height", "profile.heightSel", heightOpts(us), true)}
      ${sel(us ? "Weight (lb)" : "Weight (kg)", "profile.weight", weightOpts(us), true)}
      <p class="hint">Used only to estimate calories and portions. Skip it if you'd rather not say.</p>`;
  }
  function bodyRepro() {
    const p = state.profile, ci = W.cycleInfo(p), preg = p.repro === "pregnant";
    const cyc = !["pregnant", "breastfeeding", "menopause"].includes(p.repro);
    return `
      ${sel("Is any of this true right now?", "profile.repro", [["", "None of these"], ["pregnant", "I'm pregnant"], ["breastfeeding", "I'm breastfeeding"], ["trying", "Trying to conceive"], ["menopause", "Perimenopause / menopause"]], true)}
      ${preg ? `${sel("Trimester", "profile.trimester", [["", "Not sure"], ["1", "First (weeks 1–13)"], ["2", "Second (weeks 14–27)"], ["3", "Third (week 28 on)"]], true)}
        <div class="note soft">🤰 We'll favor folate, iron, calcium, choline, iodine and omega-3 and steer away from tuna and feta. Please check your plan with your doctor or midwife.</div>` : ""}
      ${p.repro === "breastfeeding" ? `<div class="note soft">🍼 We'll add calories and favor calcium, iodine, choline and omega-3.</div>` : ""}
      ${cyc ? `<div class="group"><div class="label">Menstrual cycle <small>optional</small></div>
        ${sel("Where are you in your cycle?", "profile.cycle", [["", "Not tracking / skip"], ["menstrual", "On my period"], ["follicular", "After my period"], ["ovulation", "Around ovulation"], ["luteal", "Before my period (PMS)"]], true)}
        ${inp("First day of your last period", "profile.periodDate", { type: "date" })}
        ${sel("Usual cycle length", "profile.cycleLen", rng(21, 40).map((n) => [String(n), n + " days" + (n === 28 ? " (typical)" : "")]), true)}
        <p class="hint">Add the date and each day of your plan follows your cycle on its own (iron and C during your period, magnesium and calcium before it). Otherwise we use the phase you picked.</p>
        ${ci ? `<div class="note soft">🌸 Today you're ${esc(ci.name)}${ci.auto ? ` (day ${ci.day})` : ""}.</div>` : ""}</div>` : ""}`;
  }
  function bodyEthno() {
    const p = state.profile;
    return `
      ${combo("Ethnicity", "profile.ethnicity", withChoose(W.ETHNICITIES.map((e) => [e, e])), "profile.ethnicityTxt", { rr: true, ph: "Describe it your way" })}
      ${sel("Blood type", "profile.bloodType", W.BLOOD_TYPES, true)}
      <p class="hint">Everything here is optional, and it stays on your device.</p>`;
  }
  function condDropdown() {
    const have = state.profile.conditions;
    return `<label class="field"><span class="sr">Add a health condition</span><select data-chg="addCond" aria-label="Add a health condition"><option value="">＋ Choose a condition to add…</option>${W.CONDITION_GROUPS.map((g) => `<optgroup label="${esc(g.g)}">${g.items.map((c) => `<option value="${esc(c)}" ${have.includes(c) ? "disabled" : ""}>${esc(c)}${have.includes(c) ? " ✓" : ""}</option>`).join("")}</optgroup>`).join("")}</select></label>`;
  }
  function bodyDiet() {
    const p = state.profile, dId = W.effDiet(p), d = W.DIETS.find((x) => x.id === dId) || W.DIETS[0];
    const needBT = dId === "bloodtype" && !/^(AB|A|B|O)[+-]?$/.test(String(W.effBlood(p) || ""));
    return `
      ${combo("Diet preference", "profile.diet", W.DIETS.map((x) => [x.id, x.label]), "profile.dietTxt", { rr: true, ph: "e.g. mostly vegan, no pork", typedLabel: "Describe your diet (optional)" })}
      <p class="hint">${esc(d.desc)}</p>
      ${p.dietTxt.trim() ? `<p class="hint">${W.effDiet(Object.assign({}, p, { dietTxt: "" })) !== dId ? `We read what you typed as <b>${esc(d.label)}</b>.` : "We saved your note. We couldn't match it to a diet, so your dropdown choice is used."}</p>` : ""}
      ${needBT ? `<div class="note">Blood type diet needs your blood type. Pick it on the ethnicity and blood type screen, or choose “I'm not sure” and we'll keep meals balanced.</div>` : ""}
      <p class="hint">Not sure? Pick <b>I'm not sure</b>. We'll mix a bit of everything and you can change it any time.</p>`;
  }
  function bodyAllergies() {
    const p = state.profile, custom = p.allergies.filter((a) => !COMMON.includes(a));
    const f = W.condFlags(p.conditions);
    const extraAllergy = [f.gluten ? "gluten (from your condition)" : "", f.dairy ? "dairy (from your condition)" : ""].filter(Boolean);
    return `
      <div class="group"><div class="label">Allergies <small>we never include these</small></div>
        <div class="chips">${COMMON.map((a) => chip(a, p.allergies.includes(a), "allergy", a)).join("")}</div>
        <div class="addrow"><input id="allergyInput" type="text" placeholder="Other allergy? Type it (e.g. kiwi)" autocomplete="off" aria-label="Add another allergy"><button type="button" class="btn small" data-act="addAllergy">Add</button></div>
        ${custom.length ? `<div class="chips">${custom.map((a) => `<button type="button" class="chip on removable" data-act="rmAllergy" data-arg="${esc(a)}" aria-label="Remove ${esc(a)}">${esc(a)} ✕</button>`).join("")}</div>` : ""}
        <p class="hint">Tap any that apply. Not listed? Type it below.</p>
        <div class="note">⚠️ We can't guarantee any meal is allergen-free. Always read ingredient labels and check every recipe yourself. If your allergy is severe, talk to an allergist.</div>
        ${extraAllergy.length ? `<p class="hint">Also avoiding: ${esc(extraAllergy.join(", "))}.</p>` : ""}
      </div>`;
  }
  function bodyConditions() {
    const p = state.profile, f = W.condFlags(p.conditions);
    return `
      <div class="group"><div class="label">Health conditions <small>optional · pick as many as apply</small></div>
        ${condDropdown()}
        ${p.conditions.length ? `<div class="chips">${p.conditions.map((c) => `<button type="button" class="chip on removable" data-act="rmCond" data-arg="${esc(c)}" aria-label="Remove ${esc(c)}">${esc(c)} ✕</button>`).join("")}</div>` : `<p class="hint">None selected. That's fine, or skip this.</p>`}
        <div class="addrow"><input id="condInput" type="text" placeholder="Condition not listed? Type it" autocomplete="off" aria-label="Add another health condition"><button type="button" class="btn small" data-act="addCondTxt">Add</button></div>
        <div class="note soft">This isn't medical advice. Choosing a condition only nudges which general foods we suggest. Please follow your doctor's guidance.</div>
        ${f.serious ? `<div class="note">One or more of your conditions needs medical guidance. Please review any meal plan with your doctor or dietitian.</div>` : ""}
        ${f.ed ? `<div class="note">We'll keep calories at a maintenance level and won't push weight-loss goals. Please plan with your care team.</div>` : ""}
      </div>`;
  }
  const goalGroup = (title, key, list, multi, hint) => `<div class="group"><div class="label">${title}</div>${hint ? `<p class="hint">${hint}</p>` : ""}<div class="chips">${list.map(([v, l]) => chip(l, multi ? (state.goals[key] || []).includes(v) : state.goals.body === v, "goal", v, `data-group="${key}"`)).join("")}</div></div>`;
  const pick = (keys) => W.GOALS.micros.filter(([k]) => keys.includes(k));
  const vitKeys = () => W.VITAMINS.map((x) => x[0]), minKeys = () => [...W.MINERALS.map((x) => x[0]), ...W.OTHER_NUTRIENTS.map((x) => x[0])];
  const nutriNote = `<p class="fine">We track exact amounts for ${W.TRACKED.map((k) => W.NUTRIENT_LABEL[k]).join(", ")}. For the others we favor foods that are a <b>good source</b>, since exact amounts aren't in our food data.</p>`;
  const bodyGoalStep = () => goalGroup("Body goal <small>pick one, or none</small>", "body", W.GOALS.body, false) + `<p class="hint">Pick as many as you like, or none at all.</p>`;
  const bodyVitamins = () => goalGroup("Vitamins <small>pick any</small>", "micros", pick(vitKeys()), true) + nutriNote;
  const bodyMinerals = () => goalGroup("Minerals, omega-3 &amp; fiber <small>pick any</small>", "micros", pick(minKeys()), true) + nutriNote;
  const bodyBeauty = () => goalGroup("Beauty &amp; aesthetics <small>pick any</small>", "beauty", W.GOALS.beauty, true);
  const bodyWellness = () => goalGroup("Wellness <small>pick any</small>", "wellness", W.GOALS.wellness, true);
  const bodyLife = () => goalGroup("Everyday eating <small>pick any</small>", "lifestyle", W.GOALS.lifestyle, true);
  function body4() {
    const T = W.resolveTargets(state), ph = (k, u) => (T.auto[k] ? `≈ ${T[k]}${u} (auto)` : "");
    const lens = [[1, "1 day"], [7, "1 week"], [14, "2 weeks"], [30, "1 month"]];
    const pl = Number(state.planLen);
    return `
      <div class="note soft">🧁 Don't know your numbers? <b>Leave these blank</b> and we'll estimate them from your profile and goals.</div>
      <div class="grid2">${inp("Calories per day", "targets.cal", { type: "number", ph: ph("cal", "") })}${inp("Protein (g)", "targets.p", { type: "number", ph: ph("p", "") })}</div>
      <div class="grid2">${inp("Carbs (g)", "targets.c", { type: "number", ph: ph("c", "") })}${inp("Fat (g)", "targets.f", { type: "number", ph: ph("f", "") })}</div>
      ${T.notes.map((n) => `<div class="note">${esc(n)}</div>`).join("")}
      <div class="group"><div class="label">How long should your meal prep last?</div>
        <div class="chips">${lens.map(([n, l]) => chip(l, !state.lenCustom && pl === n, "len", String(n))).join("")}${chip("Custom", state.lenCustom, "len", "custom")}</div>
        ${state.lenCustom ? inp("Number of days (1–60)", "planLen", { type: "number", min: 1, max: 60 }) : ""}
      </div>`;
  }

  // ---------- 3D chef squirrel ----------
  // Layers: shadow on the floor, then tilt (follows finger/mouse) > float (bobbing/swaying) > spin (tap) > image.
  function mascot(cls) {
    return `<button type="button" class="mascot3d ${cls || ""}" data-act="spin" aria-label="Chef squirrel. Tap to make him spin"><span class="m-shadow"></span><span class="m-tilt"><span class="m-float"><span class="m-spin"><img src="icons/wut-squirrel.webp" alt="" width="420" height="630" draggable="false"></span></span></span></button>`;
  }

  const STEPS = [
    { e: "Hello", t: "Let's meet you!", s: "Your name and age. Skip anything you like.", b: bodyBasics },
    { e: "Measurements", t: "Height & weight", s: "Helps us estimate your calories. Totally optional.", b: bodyMeasure },
    { e: "Background", t: "Ethnicity & blood type", s: "Optional. Blood type matters only if you choose the blood type diet.", b: bodyEthno },
    { e: "Diet", t: "How do you like to eat?", s: "Vegan, keto, blood type diet… or “I'm not sure”.", b: bodyDiet },
    { e: "Allergies", t: "Anything to avoid?", s: "We will never put these in your meals.", b: bodyAllergies },
    { e: "Health", t: "Health conditions", s: "Optional. Pick any that apply so meals can fit you.", b: bodyConditions },
    { e: "Her health", t: "Pregnancy & cycle", s: "Optional. We'll cater meals to where you are.", b: bodyRepro, show: () => state.profile.sex === "female" },
    { e: "Goals", t: "Your body goal", s: "One main goal, or skip.", b: bodyGoalStep },
    { e: "Vitamins", t: "Vitamin boosts", s: "Pick the vitamins you want more of.", b: bodyVitamins },
    { e: "Minerals", t: "Mineral boosts", s: "Minerals, omega-3 and fiber.", b: bodyMinerals },
    { e: "Beauty", t: "Beauty & aesthetics", s: "Skin, hair, nails and glow.", b: bodyBeauty },
    { e: "Wellness", t: "Wellness goals", s: "Energy, sleep, mood and more.", b: bodyWellness },
    { e: "Everyday", t: "Everyday eating", s: "Quick, simple, budget, more veggies, fish and more.", b: bodyLife },
    { e: "Nutrition & length", t: "Almost ready!", s: "Targets are optional, so skip if you're unsure.", b: body4 }
  ];
  const visSteps = () => STEPS.filter((x) => !x.show || x.show());
  function onboarding() {
    const VS = visSteps(), NSTEPS = VS.length;
    const n = Math.min(NSTEPS, Math.max(1, Number(state.step) || 1)), i = VS[n - 1];
    return `<div class="page">
      <div class="steps" role="img" aria-label="Step ${n} of ${NSTEPS}">${VS.map((_, k) => `<i class="${k < n ? "on" : ""}"></i>`).join("")}</div>
      <p class="stepcount">Step ${n} of ${NSTEPS}</p>
      <div class="hero hasmascot">${mascot()}<div class="eyebrow">${i.e}</div><h1>${i.t}</h1><p>${i.s}</p></div>
      <div class="card">${i.b()}</div>
      <button class="btn" data-act="next">${n === NSTEPS ? "✨ Create my meal prep" : "Continue →"}</button>
      <div class="row2">${n > 1 ? `<button class="btn ghost" data-act="back">← Back</button>` : "<span></span>"}<button class="btn ghost" data-act="skip">Skip</button></div>
      ${n < NSTEPS ? `<button class="linkish center" data-act="skipall">Skip the rest and build my plan →</button>` : ""}
    </div>`;
  }

  // ---------- plan helpers ----------
  function ensurePlan() { if (!state.plan) { state.plan = W.generatePlan(state); save(); } }
  function makePlan(len) {
    state.planLen = Math.min(60, Math.max(1, Math.round(Number(len)) || 7));
    state.plan = W.generatePlan(state);
    save();
  }
  const logKey = (slot, rid) => `${today()}|${slot}|${rid}`;
  const isAte = (slot, rid) => state.log.some((l) => l.key === logKey(slot, rid));
  const missingNotes = () => (state.plan && state.plan.missing.length
    ? `<div class="note">We couldn't find a safe ${state.plan.missing.join(" / ").toLowerCase()} for your diet and allergies. Try a different diet in Profile, or add your own recipe.</div>` : "");

  function actionButtons(rid, slot, portion) {
    const ate = isAte(slot, rid), fav = state.favorites.includes(rid);
    const d = `data-rid="${esc(rid)}" data-slot="${esc(slot)}" data-portion="${portion}"`;
    return `<button type="button" class="pillbtn ate${ate ? " on" : ""}" aria-pressed="${ate}" data-act="ate" ${d}>${ate ? "✓ Ate it" : "🍽️ Ate it"}</button>
      <button type="button" class="pillbtn fav${fav ? " on" : ""}" aria-pressed="${fav}" data-act="fav" data-rid="${esc(rid)}">${fav ? "♥ Favorited" : "♡ Add to favorites"}</button>`;
  }
  function goalTags(r, portion) {
    const m = W.goalMatches(r, state, portion);
    return m.length ? `<div class="tags goal">Matches your goals ${m.map((x) => `<span class="tag g">${esc(x.label)}${x.pct ? " " + esc(x.pct) : " ✓"}</span>`).join("")}</div>` : "";
  }
  function undoBar() {
    const u = state.undo;
    return u ? `<div class="undobar" role="status"><span>Swapped ${esc(u.slot.toLowerCase())} for <b>${esc(u.name)}</b></span><button type="button" data-act="undoSwap">Undo</button></div>` : "";
  }
  function mealCard(it) {
    const r = W.recipeById(it.rid, state), n = W.nutr(r, it.portion);
    const names = r.ing.map(([id]) => W.ING[id].n.replace(/ \(.*\)/, ""));
    const rich = W.richIn(n).map((x) => `<span class="tag">${x.label} ${x.pct}%</span>`).join("");
    return `<article class="card meal">
      <div class="sticker" aria-hidden="true">${r.emoji}</div>
      <div class="eyebrow">${it.slot} · ${portionText(it.portion)} · ${r.time} min</div>
      <h3><button class="linkish" data-act="open" data-rid="${esc(r.id)}" data-portion="${it.portion}" data-slot="${esc(it.slot)}">${esc(r.name)}</button></h3>
      <div class="stats">${stat("kcal", Math.round(n.cal))}${stat("protein", Math.round(n.p), "g")}${stat("carbs", Math.round(n.c), "g")}${stat("fat", Math.round(n.f), "g")}${stat("fiber", Math.round(n.fi), "g")}</div>
      ${rich ? `<div class="tags">Rich in ${rich}</div>` : ""}
      <p class="ings"><b>Ingredients:</b> ${esc(names.slice(0, 5).join(", "))}${names.length > 5 ? ` +${names.length - 5} more` : ""}</p>
      ${goalTags(r, it.portion)}
      <div class="btnrow">${actionButtons(r.id, it.slot, it.portion)}<button type="button" class="pillbtn" data-act="open" data-rid="${esc(r.id)}" data-portion="${it.portion}" data-slot="${esc(it.slot)}">📖 Recipe</button><button type="button" class="pillbtn" data-act="swap" data-day="${it.day}" data-slot="${esc(it.slot)}" aria-label="Swap ${esc(it.slot)} for a different meal">🔄 Swap</button></div>
    </article>`;
  }

  // ---------- legal, safety & privacy ----------
  const para = (t) => (t.startsWith("- ") ? `<li>${t.slice(2)}</li>` : `<p>${t}</p>`);
  const legalBody = () => W.LEGAL_SECTIONS.map(([h, ps]) => {
    let out = `<h3>${esc(h)}</h3>`, inList = false;
    ps.forEach((t) => { const li = t.startsWith("- "); if (li && !inList) { out += "<ul>"; inList = true; } if (!li && inList) { out += "</ul>"; inList = false; } out += para(t); });
    return out + (inList ? "</ul>" : "");
  }).join("");
  const legalLink = () => `<button type="button" class="linkish center" data-act="go" data-arg="legal">Terms, privacy &amp; safety</button>`;
  function legalGate() {
    return `<div class="page"><div class="hero hasmascot">${mascot()}<div class="eyebrow">Before we start</div><h1>Please read this</h1><p>It's short, and it matters for your safety.</p></div>
      <div class="card legal"><ul>${W.LEGAL_SHORT.map((t) => `<li>${t}</li>`).join("")}</ul>
        <p class="fine"><button type="button" class="linkish" data-act="legalFull">Read the full Terms, Privacy &amp; Safety notice</button></p></div>
      <label class="shopitem consent"><input type="checkbox" data-act="legalAge" ${state.legalAge ? "checked" : ""}><span>I am 18 or older, or I'm using this with a parent, guardian or doctor.</span></label>
      <label class="shopitem consent"><input type="checkbox" data-act="legalCheck" ${state.legalCheck ? "checked" : ""}><span>I have read and agree to the Terms, Privacy &amp; Safety notice. I understand this is not medical advice and I will check allergens myself.</span></label>
      <button class="btn" data-act="acceptLegal">I understand. Continue</button></div>`;
  }
  function legalScreen() {
    return `<div class="page"><button class="back" data-act="closeLegal">← Back</button><div class="hero"><div class="eyebrow">Last updated ${esc(W.LEGAL_UPDATED)}</div><h1 class="small">Terms, privacy &amp; safety</h1></div>
      <div class="card legal">${legalBody()}</div></div>`;
  }
  const safetyFoot = `<p class="fine">W.U.T.'s Cooking gives general food ideas, not medical advice. Nutrition numbers are estimates. Always check ingredient labels for allergens.</p>`;

  // ---------- screens ----------
  function home() {
    const plan = state.plan, pos = W.planPosition(plan), T = W.resolveTargets(state);
    const items = plan.items.filter((i) => i.day === pos.idx);
    const hr = new Date().getHours(), greet = hr < 12 ? "morning" : hr < 18 ? "afternoon" : "evening";
    const eaten = state.log.filter((l) => l.date === today()).reduce((a, l) => ({ cal: a.cal + l.cal, p: a.p + l.p, c: a.c + l.c, f: a.f + l.f }), { cal: 0, p: 0, c: 0, f: 0 });
    const planned = items.reduce((a, it) => { const n = W.nutr(W.recipeById(it.rid, state), it.portion); return { cal: a.cal + n.cal, p: a.p + n.p, c: a.c + n.c, f: a.f + n.f }; }, { cal: 0, p: 0, c: 0, f: 0 });
    const pct = Math.min(100, Math.round((eaten.cal / T.cal) * 100));
    const bar = (label, v, t) => `<div class="bar"><div class="barhead"><span>${label}</span><span>${Math.round(v)} / ${t} g</span></div><div class="track"><i style="width:${Math.min(100, (v / t) * 100)}%"></i></div></div>`;
    const done = isInstalled();
    return `<div class="page">
      <div class="hero hasmascot">${mascot()}<div class="eyebrow">Meal of the day · ${esc(dateLabel(today()))}</div><h1>Good ${greet}, ${esc(state.profile.name || "friend")}!</h1>
      <p>Day ${pos.idx + 1} of your ${plan.days}-day meal prep.</p></div>
      ${pos.over ? `<div class="note">Your ${plan.days}-day plan has finished, so we're repeating it. Tap <b>New plan</b> below for fresh meals.</div>` : ""}
      ${missingNotes()}${undoBar()}
      ${(() => { const p = state.profile, ci = W.cycleInfo(p, pos.idx); return p.repro === "pregnant" ? `<div class="note soft">🤰 Meals today lean on folate, iron, calcium and choline. Please check your plan with your doctor or midwife.</div>` : ci ? `<div class="note soft">🌸 Today you're ${esc(ci.name)}. Meals lean on what helps at this point.</div>` : ""; })()}
      <div class="card ringcard">
        <div class="ring" style="--pct:${pct}%" role="img" aria-label="${Math.round(eaten.cal)} of ${T.cal} calories eaten"><div class="inside"><strong>${Math.round(eaten.cal)}</strong><small>of ${T.cal} kcal eaten</small></div></div>
        <p class="center muted">Planned today: ${Math.round(planned.cal)} kcal · ${Math.round(planned.p)}g protein${T.estimated ? " · target estimated from your profile" : ""}</p>
        ${bar("Protein", eaten.p, T.p)}${bar("Carbs", eaten.c, T.c)}${bar("Fat", eaten.f, T.f)}
      </div>
      ${items.map(mealCard).join("")}
      ${history()}
      <div class="card"><h3>✨ New plan</h3><p class="muted">Refresh your meals for a day, a week, a month or any number of days.</p>
        <div class="grid2">${sel("Plan length", "newLen", [["1", "1 day"], ["3", "3 days"], ["7", "1 week"], ["14", "2 weeks"], ["21", "3 weeks"], ["30", "1 month"], ["60", "2 months"], ["custom", "Custom days…"]], true)}
        ${state.newLen === "custom" ? inp("Days (1–60)", "newLenCustom", { type: "number", min: 1, max: 60 }) : "<span></span>"}</div>
        <button class="btn" data-act="newplan">🔄 Generate new plan</button><button class="btn ghost" data-act="go" data-arg="profile">Edit goals &amp; profile</button></div>
      ${done ? "" : `<button class="btn alt" data-act="install">📱 Add to Home Screen</button>`}
      ${safetyFoot}${legalLink()}
    </div>`;
  }
  function history() {
    const byDate = {};
    state.log.forEach((l, i) => { (byDate[l.date] = byDate[l.date] || []).push({ l, i }); });
    const dates = Object.keys(byDate).sort().reverse().slice(0, 7);
    if (!dates.length) return `<div class="card"><h3>📒 Previous intake</h3><p class="muted">Tap <b>Ate it</b> on a meal and it will show up here, so you can see what you actually ate.</p></div>`;
    return `<div class="card"><h3>📒 Previous intake</h3>${dates.map((d) => {
      const tot = byDate[d].reduce((a, x) => a + x.l.cal, 0);
      return `<div class="day"><div class="dayhead"><b>${d === today() ? "Today" : esc(dateLabel(d))}</b><span>${tot} kcal</span></div>${byDate[d].map(({ l, i }) => `<div class="logrow"><span>${esc(l.slot)} · ${esc(l.name)}</span><span>${l.cal} kcal <button class="x" data-act="unlog" data-arg="${i}" aria-label="Remove from log">✕</button></span></div>`).join("")}</div>`;
    }).join("")}</div>`;
  }

  function planScreen() {
    const plan = state.plan, pos = W.planPosition(plan), T = W.resolveTargets(state);
    const days = [];
    for (let d = 0; d < plan.days; d++) {
      const its = plan.items.filter((i) => i.day === d);
      const sp = plan.start.split("-").map(Number), dt = new Date(sp[0], sp[1] - 1, sp[2] + d);
      const kcal = its.reduce((a, it) => a + W.nutr(W.recipeById(it.rid, state), it.portion).cal, 0);
      const isToday = !pos.over && d === pos.idx;
      days.push(`<div class="card${isToday ? " today" : ""}"><div class="dayhead"><b>Day ${d + 1} · ${dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}${isToday ? " (today)" : ""}</b><span>${Math.round(kcal)} kcal</span></div>
        ${its.map((it) => { const r = W.recipeById(it.rid, state), n = W.nutr(r, it.portion);
          return `<div class="planrow"><button class="linkish" data-act="open" data-rid="${esc(r.id)}" data-portion="${it.portion}" data-slot="${esc(it.slot)}"><span class="pe">${r.emoji}</span><span><b>${it.slot}</b> · ${esc(r.name)}<br><small>${portionText(it.portion)} · ${Math.round(n.cal)} kcal · ${Math.round(n.p)}g protein</small></span></button><button class="pillbtn swap" data-act="swap" data-day="${d}" data-slot="${esc(it.slot)}" aria-label="Swap ${esc(it.slot)} on day ${d + 1}">🔄 Swap</button>${isToday ? `<button class="pillbtn ate${isAte(it.slot, r.id) ? " on" : ""}" data-act="ate" data-rid="${esc(r.id)}" data-slot="${esc(it.slot)}" data-portion="${it.portion}">${isAte(it.slot, r.id) ? "✓" : "Ate it"}</button>` : ""}</div>`; }).join("")}</div>`);
    }
    return `<div class="page"><div class="hero"><div class="eyebrow">Meal prep</div><h1>${plan.days} day${plan.days > 1 ? "s" : ""} of meals</h1><p>Daily target about ${T.cal} kcal · ${T.p}g protein. Portions are sized to hit it.</p></div>${missingNotes()}${undoBar()}<p class="hint">Don't like a meal? Tap <b>🔄 Swap</b> to get a different one for just that day.</p>${days.join("")}</div>`;
  }

  function savedRecipes() {
    const favs = state.favorites.map((id) => W.recipeById(id, state)).filter(Boolean);
    const mine = state.myRecipes;
    const f = state.filter;
    let list = f === "fav" ? favs : f === "mine" ? mine : [...mine, ...favs.filter((r) => !r.user)];
    return { list, favs, mine };
  }
  function recipes() {
    const { list, favs, mine } = savedRecipes(), f = state.filter;
    const cards = list.map((r) => {
      const n = W.nutr(r, 1), hits = r.user ? W.allergyHits(r, state.profile.allergies) : [];
      return `<article class="card meal"><div class="sticker" aria-hidden="true">${r.emoji}</div>
        <div class="eyebrow">${esc(r.meal)}${r.user ? " · My recipe" : ""}${r.user && (r.files || []).length ? " · 📎" + r.files.length : ""}</div>
        ${r.user && (r.files || []).find((f) => f.type.startsWith("image/")) ? `<img class="rthumb" src="${r.files.find((f) => f.type.startsWith("image/")).data}" alt="">` : ""}
        <h3><button class="linkish" data-act="open" data-rid="${esc(r.id)}" data-portion="1" data-slot="Extra">${esc(r.name)}</button></h3>
        ${n.known ? `<div class="stats">${stat("kcal", Math.round(n.cal))}${stat("protein", Math.round(n.p), "g")}${stat("carbs", Math.round(n.c), "g")}${stat("fat", Math.round(n.f), "g")}</div>` : `<p class="muted">No nutrition added.</p>`}
        ${hits.length ? `<div class="note">⚠️ May contain: ${esc(hits.join(", "))}</div>` : ""}
        <div class="btnrow">${actionButtons(r.id, "Extra", 1)}<button type="button" class="pillbtn" data-act="open" data-rid="${esc(r.id)}" data-portion="1" data-slot="Extra">📖 Recipe</button></div></article>`;
    }).join("");
    const empty = f === "mine"
      ? "You haven't added any recipes yet. Tap “Add my recipe” to start your cookbook."
      : f === "fav" ? "No favorites yet. Tap ♡ Add to favorites on any meal and it will appear here."
      : "Your cookbook is empty. Favorite meals from your plan or add your own recipes. Only those show up here.";
    return `<div class="page"><div class="hero"><div class="eyebrow">Kitchen</div><h1>My Recipes</h1><p>Your favorites and the recipes you've added.</p></div>
      <button class="btn" data-act="go" data-arg="add">＋ Add my recipe</button>
      <div class="chips pad">${chip(`All saved`, f === "all", "filter", "all")}${chip(`Favorites (${favs.length})`, f === "fav", "filter", "fav")}${chip(`Mine (${mine.length})`, f === "mine", "filter", "mine")}</div>
      ${cards || `<div class="empty card">${mascot("inline")}<p>${empty}</p></div>`}</div>`;
  }

  function addScreen() {
    return `<div class="page"><button class="back" data-act="go" data-arg="recipes">← Back</button>
      <div class="hero"><div class="eyebrow">Cookbook</div><h1>Add my recipe</h1></div>
      <div class="card">${inp("Recipe name", "draft.name", { ph: "e.g. Grandma's chili" })}
      ${sel("Meal", "draft.meal", [["Breakfast", "Breakfast"], ["Lunch", "Lunch"], ["Dinner", "Dinner"], ["Snack", "Snack"]])}
      <label class="field"><span>Ingredients <small>one per line, with amounts</small></span><textarea rows="5" data-bind="draft.ingredients" placeholder="2 cups black beans&#10;1 onion, diced">${esc(state.draft.ingredients)}</textarea></label>
      <label class="field"><span>Instructions <small>one step per line</small></span><textarea rows="5" data-bind="draft.steps" placeholder="Chop the onion.&#10;Simmer everything 30 minutes.">${esc(state.draft.steps)}</textarea></label>
      <label class="field"><span>How to store it <small>optional</small></span><textarea rows="2" data-bind="draft.storage" placeholder="Fridge 4 days, freezer 3 months">${esc(state.draft.storage)}</textarea></label>
      <div class="label">Nutrition per serving <small>optional, skip if you don't know</small></div>
      <div class="grid2">${inp("Calories", "draft.cal", { type: "number" })}${inp("Protein (g)", "draft.p", { type: "number" })}</div>
      <div class="grid2">${inp("Carbs (g)", "draft.c", { type: "number" })}${inp("Fat (g)", "draft.f", { type: "number" })}</div></div>
      <div class="card"><div class="label">Photos &amp; files <small>optional · a photo of the recipe card or dish, a PDF…</small></div>
        <div class="uploadrow"><label class="btn small upl">📷 Take photo<input type="file" accept="image/*" capture="environment" data-file hidden></label><label class="btn small upl">🖼️ Choose picture or file<input type="file" accept="image/*,application/pdf,.pdf,.txt,.doc,.docx" multiple data-file hidden></label></div>
        ${state.draft.files.length ? `<div class="thumbs">${state.draft.files.map((f, i) => `<div class="thumb">${f.type.startsWith("image/") ? `<img src="${f.data}" alt="${esc(f.name)}">` : `<span class="doc">📄<small>${esc(f.name)}</small></span>`}<button type="button" class="x" data-act="rmFile" data-arg="${i}" aria-label="Remove ${esc(f.name)}">✕</button></div>`).join("")}</div>` : ""}
        <p class="fine">Saved on this device only. Up to ${MAX_FILES} files, ${Math.round(MAX_FILE / 1e6 * 10) / 10} MB each. We can't check photos for allergens, so check those yourself.</p></div>
      <button class="btn" data-act="saveRecipe">Save recipe</button><button class="btn ghost" data-act="go" data-arg="recipes">Cancel</button></div>`;
  }

  function recipeView() {
    const v = state.view, r = W.recipeById(v.rid, state), n = W.nutr(r, v.portion), cook = v.cook || 1;
    const rich = W.richIn(n).map((x) => `<span class="tag">${x.label} ${x.pct}%</span>`).join("");
    const hits = W.allergyHits(r, state.profile.allergies);
    const ings = r.user ? r.ingLines.map((l) => `<li>${esc(l)}</li>`).join("")
      : r.ing.map(([id, amt]) => { const l = W.fmtRecipeLine(id, amt * v.portion * cook); return `<li><b>${esc(l.qty)}</b> ${esc(l.label)}</li>`; }).join("");
    const steps = (r.steps || []).map((s, i) => `<div class="step"><div class="num">${i + 1}</div><div>${esc(s)}</div></div>`).join("");
    const st = r.user
      ? `<p>${esc(r.storage || "No storage notes added. Refrigerate leftovers within 2 hours.")}</p>`
      : `<p><b>🧊 Fridge:</b> ${esc(r.store.fridge)}</p><p><b>❄️ Freezer:</b> ${esc(r.store.freezer)}</p><p><b>♨️ Reheating:</b> ${esc(W.REHEAT)}</p><p class="tip">💡 ${esc(r.store.tip)}</p>`;
    return `<div class="page"><button class="back" data-act="closeView">← Back</button>
      <div class="hero"><div class="bigemoji" aria-hidden="true">${r.emoji}</div><div class="eyebrow">${esc(r.meal)}${r.time ? ` · ${r.time} min` : ""}</div><h1 class="small">${esc(r.name)}</h1></div>
      ${hits.length ? `<div class="note">⚠️ May contain something you avoid: ${esc(hits.join(", "))}</div>` : ""}
      ${n.known ? `<div class="stats">${stat("kcal", Math.round(n.cal))}${stat("protein", Math.round(n.p), "g")}${stat("carbs", Math.round(n.c), "g")}${stat("fat", Math.round(n.f), "g")}${r.user ? "" : stat("fiber", Math.round(n.fi), "g")}</div>` : ""}
      ${rich ? `<div class="tags">Rich in ${rich}</div>` : ""}
      ${!r.user && r.allergens.length ? `<p class="fine">Contains: ${esc(r.allergens.join(", "))}</p>` : ""}
      <div class="btnrow">${actionButtons(r.id, v.slot || "Extra", v.portion)}</div>
      ${r.user ? "" : `<div class="card"><div class="label">Batch size <small>each serving here is ${portionText(v.portion)}</small></div><div class="chips">${[1, 2, 4, 6, 8].map((k) => chip(k === 1 ? "1 serving" : k + " servings", cook === k, "cook", String(k))).join("")}</div>
      <p class="fine">Amounts are as bought: raw or dry weight.</p></div>`}
      ${r.user && (r.files || []).length ? `<div class="card"><h3>📎 Photos &amp; files</h3><div class="thumbs big">${r.files.map((f) => f.type.startsWith("image/") ? `<a href="${f.data}" target="_blank" rel="noopener"><img src="${f.data}" alt="${esc(f.name)}"></a>` : `<a class="doc" href="${f.data}" download="${esc(f.name)}">📄 ${esc(f.name)}</a>`).join("")}</div>${hits.length === 0 && !r.ingLines.length ? `<p class="fine">Allergens can't be checked in photos. Please check the recipe yourself.</p>` : ""}</div>` : ""}
      <div class="card"><h3>🛒 Ingredients</h3><ul class="list">${ings}</ul>${!r.user && r.pantry && r.pantry.length ? `<p class="fine"><b>Pantry:</b> ${esc(r.pantry.join(", "))}</p>` : ""}</div>
      <div class="card"><h3>👩‍🍳 How to cook</h3>${steps || "<p class='muted'>No steps added.</p>"}</div>
      <div class="card"><h3>📦 Storing</h3>${st}</div>
      ${r.user ? `<button class="btn ghost danger" data-act="delRecipe" data-rid="${esc(r.id)}">Delete this recipe</button>` : ""}</div>`;
  }

  function shop() {
    const win = state.shop.win, S = W.shoppingList(state, win);
    const labels = { 1: "Day", 7: "Week", 14: "2 Weeks" };
    const chk = state.shop.checked;
    const groups = S.groups.map((g) => `<div class="card"><h3>${esc(g.cat)}</h3>${g.items.map((it) => {
      const k = win + ":" + it.id, on = !!chk[k];
      return `<label class="shopitem${on ? " done" : ""}"><input type="checkbox" data-act="shopcheck" data-arg="${esc(k)}" ${on ? "checked" : ""}><span><b>${esc(it.name)}</b><br><span class="qty">Get about ${esc(it.qty)}</span><br><small>${esc(it.buy)}</small><br><small class="used">For: ${esc(it.uses.slice(0, 3).join(", "))}${it.uses.length > 3 ? ` +${it.uses.length - 3} more` : ""}</small></span></label>`;
    }).join("")}</div>`).join("");
    return `<div class="page"><div class="hero"><div class="eyebrow">Prep smarter</div><h1>Shopping list</h1><p>Exact amounts and what to look for, for the meals in your plan.</p></div>
      <div class="chips pad">${[1, 7, 14].map((n) => chip(labels[n], win === n, "shopwin", String(n))).join("")}</div>
      ${S.repeats ? `<div class="note soft">Your plan covers ${S.planDays} day${S.planDays > 1 ? "s" : ""}, so this list repeats it to fill ${S.days} days.</div>` : ""}
      ${S.count ? `<p class="muted">${S.count} items for ${win === 1 ? "today" : win + " days"}, starting today.</p>${groups}
        ${S.pantry.length ? `<div class="card"><h3>🧂 Check your pantry</h3><p class="muted">Not counted above. You'll likely need small amounts of: ${esc(S.pantry.join(", "))}, plus salt and pepper.</p></div>` : ""}
        <p class="fine">Amounts are raw or dry weights as you buy them. Cooked rice, quinoa and lentils weigh more.</p>
        <button class="btn" data-act="shopcopy">📋 Copy list</button><button class="btn ghost" data-act="shopclear">Clear checkmarks</button>`
        : `<div class="empty card">${mascot("inline")}<p>No meals to shop for yet. Make a plan first.</p></div>`}</div>`;
  }

  function profile() {
    const card = (title, ...bs) => `<div class="card"><h3>${title}</h3>${bs.map((b) => b()).join("")}</div>`;
    return `<div class="page"><div class="hero"><div class="eyebrow">Your profile</div><h1>${esc(state.profile.name || "Profile")}</h1><p>Change anything, then rebuild your plan.</p></div>
      ${card("About you", bodyBasics)}${card("Height &amp; weight", bodyMeasure)}${card("Ethnicity &amp; blood type", bodyEthno)}${card("Diet", bodyDiet)}${card("Allergies", bodyAllergies)}${card("Health conditions", bodyConditions)}${state.profile.sex === "female" ? card("Pregnancy &amp; cycle", bodyRepro) : ""}
      ${card("Body goal", bodyGoalStep)}${card("Vitamin boosts", bodyVitamins)}${card("Mineral boosts", bodyMinerals)}${card("Beauty &amp; aesthetics", bodyBeauty)}${card("Wellness", bodyWellness)}${card("Everyday eating", bodyLife)}
      ${card("Targets &amp; plan length", body4)}
      <button class="btn" data-act="rebuild">✨ Save &amp; rebuild my plan</button>
      <button class="btn ghost danger" data-act="reset">Reset everything</button>${safetyFoot}${legalLink()}</div>`;
  }

  function top() {
    return `<header class="top"><div class="brand">W.U.T.<span>'s Cooking</span><small>What's Ur Type?</small></div>${state.screen === "onboarding" || state.legalV < W.LEGAL_VERSION ? "" : `<button type="button" class="pill" data-act="go" data-arg="profile" title="Your diet. Tap to change it" aria-label="${esc(dietPillText())}. Tap to change your diet">${esc(dietPillText())}</button>`}</header>`;
  }
  function nav() {
    const cur = state.screen === "recipe" || state.screen === "add" ? "recipes" : state.screen;
    const b = (id, ic, l) => `<button class="${cur === id ? "active" : ""}" data-act="go" data-arg="${id}" ${cur === id ? 'aria-current="page"' : ""} ${id === "nutty" ? 'aria-label="Getting Nutty"' : ""}><i>${ic}</i>${l}</button>`;
    return `<nav class="nav" aria-label="Main">${b("home", "🏠", "Home")}${b("plan", "📅", "Plan")}${b("recipes", "❤️", "Recipes")}${b("shop", "🛒", "Shop")}${b("nutty", "🥜", "Nutty")}${b("profile", "😊", "Profile")}</nav>`;
  }

  function render(keep) {
    const y = window.scrollY;
    let html;
    const gated = state.legalV < W.LEGAL_VERSION && state.screen !== "legal";
    if (gated) html = legalGate();
    else if (state.screen === "legal") html = legalScreen();
    else if (state.screen === "onboarding") html = onboarding();
    else {
      ensurePlan();
      if (state.screen === "recipe" && !(state.view && W.recipeById(state.view.rid, state))) state.screen = "home";
      const map = { home, plan: planScreen, recipes, recipe: recipeView, add: addScreen, shop, profile, nutty: () => W.nutty.view(state.nutty) };
      html = (map[state.screen] || home)();
    }
    $app.innerHTML = `<div class="shell">${top()}${html}${state.screen === "onboarding" || gated || state.screen === "legal" ? "" : nav()}</div>`;
    window.scrollTo(0, keep ? y : 0);
  }
  function go(screen) { state.screen = screen; state.undo = null; save(); render(); }

  // ---------- actions ----------
  const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  function finishOnboarding() {
    makePlan(state.planLen);
    state.screen = "home"; save(); render();
    toast("Your meal prep is ready! 🎉");
  }
  function addAllergies() {
    const el = document.getElementById("allergyInput");
    if (!el) return;
    const items = el.value.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (!items.length) return;
    const a = state.profile.allergies;
    items.forEach((x) => { if (!a.includes(x)) a.push(x); });
    save(); render(true);
    const n = document.getElementById("allergyInput"); if (n) n.focus();
  }
  function logMeal(rid, slot, portion) {
    const key = logKey(slot, rid), i = state.log.findIndex((l) => l.key === key);
    if (i >= 0) { state.log.splice(i, 1); toast("Removed from your log"); }
    else {
      const r = W.recipeById(rid, state), n = W.nutr(r, portion);
      state.log.push({ key, date: today(), slot, rid, name: r.name, portion, cal: Math.round(n.cal), p: Math.round(n.p), c: Math.round(n.c), f: Math.round(n.f), ts: Date.now() });
      toast(["Yum! Logged 🎉", "Nom nom, logged! 😋", "Nice choice! ✅"][state.log.length % 3]);
    }
    save(); render(true);
  }
  function shopText() {
    const S = W.shoppingList(state, state.shop.win);
    return `W.U.T.'s Cooking shopping list (${state.shop.win === 1 ? "today" : state.shop.win + " days"})\n\n` + S.groups.map((g) => g.cat.toUpperCase() + "\n" + g.items.map((i) => `- ${i.name}: ${i.qty}`).join("\n")).join("\n\n");
  }

  const ACT = {
    go: (a) => { if (a === "legal" && state.screen !== "legal") state.legalPrev = state.screen; go(a); },
    legalFull: () => { if (state.screen !== "legal") state.legalPrev = state.screen; go("legal"); },
    closeLegal: () => go(state.legalPrev && state.legalPrev !== "legal" ? state.legalPrev : (state.legalV >= W.LEGAL_VERSION ? "home" : "onboarding")),
    legalAge: (a, el) => { state.legalAge = el.checked; save(); render(true); },
    legalCheck: (a, el) => { state.legalCheck = el.checked; save(); render(true); },
    acceptLegal: () => {
      if (!state.legalAge || !state.legalCheck) { toast("Please tick both boxes to continue"); return; }
      state.legalV = W.LEGAL_VERSION; state.legalAcceptedAt = new Date().toISOString(); save(); render(); },
    back: () => { state.step = Math.max(1, state.step - 1); save(); render(); },
    next: () => { if (state.step < visSteps().length) { state.step++; save(); render(); } else finishOnboarding(); },
    skip: () => ACT.next(),
    skipall: () => finishOnboarding(),
    swap: (a, el) => {
      const day = Number(el.dataset.day), slot = el.dataset.slot;
      const r = W.swapMeal(state, day, slot);
      if (!r.ok) { toast(r.reason === "none" ? "No other safe option for that meal" : "Couldn't find that meal"); return; }
      const nr = W.recipeById(r.after.rid, state);
      state.undo = { day, slot, before: r.before, name: nr.name };
      save(); render(true); toast("Swapped! 🔄");
    },
    undoSwap: () => {
      const u = state.undo; if (!u) return;
      const it = state.plan.items.find((i) => i.day === u.day && i.slot === u.slot);
      if (it) { it.rid = u.before.rid; it.portion = u.before.portion; }
      state.undo = null; save(); render(true); toast("Put it back ↩️");
    },
    nytoggle: (a) => { W.nutty.toggle(state.nutty, a); save(); render(true); },
    nyunits: (a) => { W.nutty.units(state.nutty, a); save(); render(true); },
    nyclear: (a) => { W.nutty.clear(state.nutty, a); save(); render(true); },
    nyprofile: (a) => { W.nutty.fillFromProfile(state.nutty, a, state.profile); save(); render(true); toast("Filled in from your profile"); },
    units: (a) => {
      const p = state.profile;
      if (p.units === a) return;
      const m = W.toMetric(p);
      p.units = a; p.weightTxt = ""; p.heightTxt = "";
      p.weight = m.kg >= 30 && m.kg <= 300 ? String(a === "metric" ? Math.round(m.kg) : Math.round(m.kg / 0.45359237)) : "";
      if (m.cm >= 100 && m.cm <= 230) {
        if (a === "metric") p.heightSel = String(Math.round(m.cm));
        else { const t = Math.round(m.cm / 2.54); p.heightSel = `${Math.floor(t / 12)}-${t % 12}`; }
      } else p.heightSel = "";
      save(); render(true);
    },
    addCond: (a) => { if (a && !state.profile.conditions.includes(a)) { state.profile.conditions.push(a); save(); } render(true); },
    rmCond: (a) => { state.profile.conditions = state.profile.conditions.filter((x) => x !== a); save(); render(true); },
    addCondTxt: () => {
      const el = document.getElementById("condInput"), v = el ? el.value.trim() : "";
      if (!v) return;
      if (!state.profile.conditions.some((c) => c.toLowerCase() === v.toLowerCase())) state.profile.conditions.push(v);
      save(); render(true);
      const n = document.getElementById("condInput"); if (n) n.focus();
    },
    allergy: (a) => { state.profile.allergies = toggleIn(state.profile.allergies, a); save(); render(true); },
    addAllergy: addAllergies,
    rmAllergy: (a) => { state.profile.allergies = state.profile.allergies.filter((x) => x !== a); save(); render(true); },
    cond: (a) => { state.profile.conditions = toggleIn(state.profile.conditions, a); save(); render(true); },
    goal: (a, el) => {
      const g = el.dataset.group;
      if (g === "body") state.goals.body = state.goals.body === a ? "" : a;
      else state.goals[g] = toggleIn(state.goals[g] || [], a);
      save(); render(true);
    },
    len: (a) => { if (a === "custom") { state.lenCustom = true; } else { state.lenCustom = false; state.planLen = Number(a); } save(); render(true); },
    newplan: () => {
      const n = state.newLen === "custom" ? parseInt(state.newLenCustom, 10) : parseInt(state.newLen, 10);
      if (!(n >= 1)) { toast("Enter a number of days (1–60)"); return; }
      state.undo = null; makePlan(n); render(); toast("New plan ready ✨");
    },
    rebuild: () => { state.undo = null; makePlan(state.planLen); state.screen = "home"; save(); render(); toast("Plan rebuilt ✨"); },
    reset: () => { if (confirm("Erase your profile, plan, recipes and food log from this device?")) { state = defaults(); save(); render(); } },
    ate: (a, el) => logMeal(el.dataset.rid, el.dataset.slot || "Extra", Number(el.dataset.portion) || 1),
    unlog: (a) => { state.log.splice(Number(a), 1); save(); render(true); },
    fav: (a, el) => {
      const id = el.dataset.rid, on = state.favorites.includes(id);
      state.favorites = on ? state.favorites.filter((x) => x !== id) : [...state.favorites, id];
      save(); render(true); toast(on ? "Removed from favorites" : "Saved to your Recipes ♥");
    },
    open: (a, el) => { state.back = state.screen === "recipe" ? state.back : state.screen; state.view = { rid: el.dataset.rid, portion: Number(el.dataset.portion) || 1, slot: el.dataset.slot || "Extra", cook: 1 }; go("recipe"); },
    closeView: () => go(state.back || "home"),
    cook: (a) => { state.view.cook = Number(a); render(true); },
    filter: (a) => { state.filter = a; save(); render(true); },
    shopwin: (a) => { state.shop.win = Number(a); save(); render(true); },
    shopcheck: (a, el) => { state.shop.checked[a] = el.checked; save(); render(true); },
    shopclear: () => { state.shop.checked = {}; save(); render(true); },
    shopcopy: () => {
      const t = shopText();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => toast("List copied 📋"), () => toast("Couldn't copy. Select the list manually."));
      else toast("Copy isn't available in this browser");
    },
    saveRecipe: () => {
      const d = state.draft, name = d.name.trim(), lines = (s) => s.split("\n").map((x) => x.trim()).filter(Boolean);
      const ing = lines(d.ingredients);
      if (!name) { toast("Give your recipe a name first"); return; }
      const steps = lines(d.steps);
      if (!ing.length && !steps.length && !d.files.length) { toast("Add ingredients, steps, or a photo/file"); return; }
      const num = (v) => { const n = parseFloat(v); return n >= 0 ? n : 0; };
      const id = "u" + Date.now();
      state.myRecipes.push({ id, user: true, name, meal: d.meal, emoji: SLOT_EMOJI[d.meal] || "🍽️", ingLines: ing, steps, storage: d.storage.trim(), files: d.files.slice(), nut: { cal: num(d.cal), p: num(d.p), c: num(d.c), f: num(d.f) } });
      const ok = save();
      if (!ok) { state.myRecipes.pop(); toast("Not enough storage for these files. Remove one and try again."); return; }
      state.draft = defaults().draft; state.filter = "all"; state.screen = "recipes"; save(); render(); toast("Recipe added to your cookbook ✅");
    },
    rmFile: (a) => { state.draft.files.splice(Number(a), 1); save(); render(true); },
    delRecipe: (a, el) => {
      if (!confirm("Delete this recipe?")) return;
      const id = el.dataset.rid;
      state.myRecipes = state.myRecipes.filter((r) => r.id !== id);
      state.favorites = state.favorites.filter((x) => x !== id);
      go("recipes");
    },
    spin: (a, el) => {
      const sp = el.querySelector(".m-spin");
      if (!sp) return;
      sp.classList.remove("go"); void sp.offsetWidth; sp.classList.add("go");
      const lines = ["Let's cook! 👨‍🍳", "Wheee! 🌀", "Nuts about meal prep! 🌰", "Eat your veggies! 🥦"];
      toast(lines[Math.floor(Math.random() * lines.length)]);
    },
    install: () => installApp(),
    closeModal: () => closeModal()
  };

  // ---------- events ----------
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || el.matches("input[type=checkbox]")) return;
    const f = ACT[el.dataset.act];
    if (f) { e.preventDefault(); f(el.dataset.arg, el); }
  });
  // ---- recipe uploads ----
  const readFile = (file) => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(file); });
  function shrinkImage(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1000 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
        const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("bad image")); };
      img.src = url;
    });
  }
  async function addFiles(list) {
    for (const file of Array.from(list)) {
      if (state.draft.files.length >= MAX_FILES) { toast(`Up to ${MAX_FILES} files per recipe`); break; }
      try {
        let data, type = file.type || "application/octet-stream", name = file.name || "photo.jpg";
        if (type.startsWith("image/")) { data = await shrinkImage(file); type = "image/jpeg"; name = name.replace(/\.[^.]+$/, "") + ".jpg"; }
        else { if (file.size > MAX_FILE) { toast(`${name} is too big (max ${Math.round(MAX_FILE / 1e5) / 10} MB)`); continue; } data = await readFile(file); }
        if (data.length > MAX_FILE * 1.4) { toast(`${name} is too big`); continue; }
        state.draft.files.push({ name, type, data, size: file.size });
      } catch (err) { toast("Couldn't read that file"); }
    }
    if (!save()) { state.draft.files.pop(); toast("Not enough storage for that file"); }
    render(true);
  }
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.matches && el.matches("input[type=file][data-file]")) { addFiles(el.files); return; }
    if (el.dataset && el.dataset.ny !== undefined) { if (el.tagName === "SELECT" || el.type === "date" || el.type === "time") nyChange(el); return; }
    if (el.matches && el.matches("input[type=checkbox][data-act]")) { ACT[el.dataset.act](el.dataset.arg, el); return; }
    if (el.dataset && el.dataset.chg && ACT[el.dataset.chg]) { ACT[el.dataset.chg](el.value, el); return; }
    if (el.dataset && el.dataset.bind && el.tagName === "SELECT") {
      setPath(el.dataset.bind, el.value); save();
      if (el.dataset.rr !== undefined) render(true);
    }
  });
  function nyChange(el) {
    const r = W.nutty.input(state.nutty, el);
    save();
    if (r === "rr") {
      const isSearch = el.id === "nySearch", pos = isSearch ? el.selectionStart : 0;
      render(true);
      if (isSearch) { const n = document.getElementById("nySearch"); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (e2) { /* ignore */ } } }
    } else { const box = document.getElementById("ny-res-" + r); if (box) box.innerHTML = W.nutty.resultHtml(state.nutty, r); }
  }
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.ny !== undefined && el.tagName !== "SELECT") { nyChange(el); return; }
    if (el.dataset && el.dataset.bind && el.tagName !== "SELECT") { setPath(el.dataset.bind, el.value); save(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.id === "allergyInput") { e.preventDefault(); addAllergies(); }
    if (e.key === "Enter" && e.target.id === "condInput") { e.preventDefault(); ACT.addCondTxt(); }
    if (e.key === "Escape") closeModal();
  });


  // ---------- squirrel tilts toward your finger / mouse ----------
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let tiltRaf = 0, tiltX = 0, tiltY = 0;
  function applyTilt() {
    tiltRaf = 0;
    document.querySelectorAll(".mascot3d").forEach((m) => {
      const r = m.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = Math.max(-1, Math.min(1, (tiltX - cx) / 260)), dy = Math.max(-1, Math.min(1, (tiltY - cy) / 260));
      m.style.setProperty("--ry", (dx * 24).toFixed(1) + "deg");
      m.style.setProperty("--rx", (-dy * 14).toFixed(1) + "deg");
    });
  }
  function resetTilt() {
    document.querySelectorAll(".mascot3d").forEach((m) => { m.style.setProperty("--ry", "0deg"); m.style.setProperty("--rx", "0deg"); });
  }
  if (!reduceMotion) {
    document.addEventListener("pointermove", (e) => { tiltX = e.clientX; tiltY = e.clientY; if (!tiltRaf) tiltRaf = requestAnimationFrame(applyTilt); }, { passive: true });
    document.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") setTimeout(resetTilt, 600); });
    document.addEventListener("pointerleave", resetTilt);
  }

  // ---------- add to home screen ----------
  let deferredPrompt = null;
  const isInstalled = () => (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener("appinstalled", () => { deferredPrompt = null; if (state.screen === "home") render(true); toast("Installed! 🎉"); });
  function closeModal() { const m = document.getElementById("modal"); if (m) m.remove(); }
  function installApp() {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; return; }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const how = ios
      ? "<ol><li>Tap the <b>Share</b> button (the square with an arrow) in Safari.</li><li>Scroll and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>. Done! 🎉</li></ol>"
      : "<ol><li>Open your browser menu (<b>⋮</b> or <b>⋯</b>).</li><li>Tap <b>Install app</b> or <b>Add to Home screen</b>.</li><li>Confirm. Done! 🎉</li></ol>";
    closeModal();
    const d = document.createElement("div");
    d.className = "modal"; d.id = "modal";
    d.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="Add to Home Screen"><div class="bigemoji">📱</div><h3>Add W.U.T.'s Cooking to your Home Screen</h3>${how}<button class="btn" data-act="closeModal">Got it</button></div>`;
    document.body.appendChild(d);
  }

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register("sw.js").catch(() => {});
  render();
})();
