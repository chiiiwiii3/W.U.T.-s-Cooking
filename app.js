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
  const SLOT_EMOJI = { Breakfast: "🍳", Lunch: "🥪", Dinner: "🍲", Snack: "🍎" };

  function defaults() {
    return {
      v: 3, screen: "onboarding", step: 1, view: null, back: "home",
      profile: { name: "", age: "", sex: "", units: "us", weight: "", heightFt: "", heightIn: "", heightCm: "", ethnicity: "", bloodType: "", diet: "unsure", allergies: [], conditions: [] },
      goals: { body: "", micros: [], beauty: [], wellness: [] },
      targets: { cal: "", p: "", c: "", f: "" },
      planLen: 7, lenCustom: false,
      newLen: "7", newLenCustom: "",
      plan: null, favorites: [], myRecipes: [], log: [],
      shop: { win: 1, checked: {} }, filter: "all",
      draft: { name: "", meal: "Lunch", ingredients: "", steps: "", storage: "", cal: "", p: "", c: "", f: "" }
    };
  }
  function load() {
    const d = defaults();
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 3) {
        for (const k in s) d[k] = d[k] && typeof d[k] === "object" && !Array.isArray(d[k]) && s[k] && typeof s[k] === "object" ? Object.assign(d[k], s[k]) : s[k];
      }
    } catch (e) { /* first run or storage blocked */ }
    return d;
  }
  let state = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } }

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
  const dietLabel = () => (W.DIETS.find((d) => d.id === state.profile.diet) || W.DIETS[0]).label;
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
  function body1() {
    const p = state.profile, us = p.units === "us";
    return `
      ${inp("What should we call you?", "profile.name", { ph: "Your name" })}
      <div class="grid2">${inp("Age", "profile.age", { type: "number", min: 1, max: 120, ph: "years" })}
      ${sel("Sex (for calorie estimates)", "profile.sex", [["", "Prefer not to say"], ["female", "Female"], ["male", "Male"], ["other", "Other"]])}</div>
      <div class="seg" role="group" aria-label="Units">${chip("US (lb, ft/in)", us, "units", "us")}${chip("Metric (kg, cm)", !us, "units", "metric")}</div>
      <div class="grid2">
        ${us ? `${inp("Height (ft)", "profile.heightFt", { type: "number", min: 3, max: 8, ph: "ft" })}${inp("Height (in)", "profile.heightIn", { type: "number", min: 0, max: 11, ph: "in" })}` : `${inp("Height (cm)", "profile.heightCm", { type: "number", min: 100, max: 250, ph: "cm" })}<span></span>`}
      </div>
      ${inp(us ? "Weight (lb)" : "Weight (kg)", "profile.weight", { type: "number", min: 1, max: 700, ph: us ? "lb" : "kg" })}
      ${inp("Ethnicity (optional)", "profile.ethnicity", { ph: "Optional" })}
      ${sel("Blood type", "profile.bloodType", W.BLOOD_TYPES, true)}
      <p class="hint">Everything here is optional, and it stays on your device.</p>`;
  }
  function body2() {
    const p = state.profile, d = W.DIETS.find((x) => x.id === p.diet) || W.DIETS[0];
    const custom = p.allergies.filter((a) => !COMMON.includes(a));
    const needBT = p.diet === "bloodtype" && (!p.bloodType || p.bloodType === "unknown");
    const serious = p.conditions.some((c) => /kidney|pregnant/i.test(c));
    return `
      ${sel("Diet preference", "profile.diet", W.DIETS.map((x) => [x.id, x.label]), true)}
      <p class="hint">${esc(d.desc)}</p>
      ${needBT ? `<div class="note">Blood type diet needs your blood type. Pick it here, or choose “I'm not sure” and we'll keep meals balanced.</div>${sel("Blood type", "profile.bloodType", W.BLOOD_TYPES, true)}` : ""}
      <div class="group"><div class="label">Allergies <small>we never include these</small></div>
        <div class="chips">${COMMON.map((a) => chip(a, p.allergies.includes(a), "allergy", a)).join("")}</div>
        <div class="addrow"><input id="allergyInput" type="text" placeholder="Other allergy? Type it (e.g. kiwi)" autocomplete="off" aria-label="Add another allergy"><button type="button" class="btn small" data-act="addAllergy">Add</button></div>
        ${custom.length ? `<div class="chips">${custom.map((a) => `<button type="button" class="chip on removable" data-act="rmAllergy" data-arg="${esc(a)}" aria-label="Remove ${esc(a)}">${esc(a)} ✕</button>`).join("")}</div>` : ""}
      </div>
      <div class="group"><div class="label">Health conditions <small>optional</small></div>
        <div class="chips">${W.CONDITIONS.map((c) => chip(c, p.conditions.includes(c), "cond", c)).join("")}</div>
        ${serious ? `<div class="note">Please review any meal plan with your doctor or dietitian.</div>` : ""}
      </div>`;
  }
  function body3() {
    const g = state.goals, G = W.GOALS;
    const grp = (title, key, list, multi) => `<div class="group"><div class="label">${title}</div><div class="chips">${list.map(([v, l]) => chip(l, multi ? g[key].includes(v) : g.body === v, "goal", v, `data-group="${key}"`)).join("")}</div></div>`;
    return `${grp("Body goal", "body", G.body, false)}${grp("Vitamin &amp; mineral boosts", "micros", G.micros, true)}${grp("Beauty &amp; aesthetics", "beauty", G.beauty, true)}${grp("Wellness", "wellness", G.wellness, true)}
      <p class="hint">Pick as many as you like, or none at all.</p>`;
  }
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

  const STEP_INFO = [
    null,
    { e: "Hello", t: "Let's meet you!", s: "A few quick questions so your meals fit you.", b: body1 },
    { e: "Food profile", t: "What do you eat?", s: "We'll keep every meal safe and on-diet.", b: body2 },
    { e: "Goals", t: "What are you aiming for?", s: "Pick goals and we'll favor foods that help.", b: body3 },
    { e: "Nutrition & length", t: "Almost ready!", s: "Targets are optional, so skip if you're unsure.", b: body4 }
  ];
  function onboarding() {
    const n = state.step, i = STEP_INFO[n];
    return `<div class="page">
      <div class="steps" aria-label="Step ${n} of 4">${[1, 2, 3, 4].map((k) => `<i class="${k <= n ? "on" : ""}"></i>`).join("")}</div>
      <div class="hero hasmascot"><img class="mascot" src="icons/wut-squirrel.webp" alt="W.U.T.'s chef squirrel" width="96" height="143"><div class="eyebrow">${i.e}</div><h1>${i.t}</h1><p>${i.s}</p></div>
      <div class="card">${i.b()}</div>
      <button class="btn" data-act="next">${n === 4 ? "✨ Create my meal prep" : "Continue →"}</button>
      <div class="row2">${n > 1 ? `<button class="btn ghost" data-act="back">← Back</button>` : "<span></span>"}<button class="btn ghost" data-act="skip">Skip</button></div>
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
      <div class="btnrow">${actionButtons(r.id, it.slot, it.portion)}<button type="button" class="pillbtn" data-act="open" data-rid="${esc(r.id)}" data-portion="${it.portion}" data-slot="${esc(it.slot)}">📖 Recipe</button></div>
    </article>`;
  }

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
      <div class="hero hasmascot"><img class="mascot" src="icons/wut-squirrel.webp" alt="W.U.T.'s chef squirrel" width="96" height="143"><div class="eyebrow">Meal of the day · ${esc(dateLabel(today()))}</div><h1>Good ${greet}, ${esc(state.profile.name || "friend")}!</h1>
      <p>Day ${pos.idx + 1} of your ${plan.days}-day meal prep.</p></div>
      ${pos.over ? `<div class="note">Your ${plan.days}-day plan has finished, so we're repeating it. Tap <b>New plan</b> below for fresh meals.</div>` : ""}
      ${missingNotes()}
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
      <p class="fine">W.U.T.'s Cooking offers general food ideas, not medical advice. Nutrition numbers are estimates.</p>
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
          return `<div class="planrow"><button class="linkish" data-act="open" data-rid="${esc(r.id)}" data-portion="${it.portion}" data-slot="${esc(it.slot)}"><span class="pe">${r.emoji}</span><span><b>${it.slot}</b> · ${esc(r.name)}<br><small>${portionText(it.portion)} · ${Math.round(n.cal)} kcal · ${Math.round(n.p)}g protein</small></span></button>${isToday ? `<button class="pillbtn ate${isAte(it.slot, r.id) ? " on" : ""}" data-act="ate" data-rid="${esc(r.id)}" data-slot="${esc(it.slot)}" data-portion="${it.portion}">${isAte(it.slot, r.id) ? "✓" : "Ate it"}</button>` : ""}</div>`; }).join("")}</div>`);
    }
    return `<div class="page"><div class="hero"><div class="eyebrow">Meal prep</div><h1>${plan.days} day${plan.days > 1 ? "s" : ""} of meals</h1><p>Daily target about ${T.cal} kcal · ${T.p}g protein. Portions are sized to hit it.</p></div>${missingNotes()}${days.join("")}</div>`;
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
        <div class="eyebrow">${esc(r.meal)}${r.user ? " · My recipe" : ""}</div>
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
      ${cards || `<div class="empty card"><img class="emptyimg" src="icons/wut-squirrel.webp" alt="" width="110" height="164"><p>${empty}</p></div>`}</div>`;
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
        : `<div class="empty card"><img class="emptyimg" src="icons/wut-squirrel.webp" alt="" width="110" height="164"><p>No meals to shop for yet. Make a plan first.</p></div>`}</div>`;
  }

  function profile() {
    return `<div class="page"><div class="hero"><div class="eyebrow">Your profile</div><h1>${esc(state.profile.name || "Profile")}</h1><p>Change anything, then rebuild your plan.</p></div>
      <div class="card"><h3>About you</h3>${body1()}</div>
      <div class="card"><h3>Food profile</h3>${body2()}</div>
      <div class="card"><h3>Goals</h3>${body3()}</div>
      <div class="card"><h3>Targets &amp; plan length</h3>${body4()}</div>
      <button class="btn" data-act="rebuild">✨ Save &amp; rebuild my plan</button>
      <button class="btn ghost danger" data-act="reset">Reset everything</button></div>`;
  }

  function top() {
    return `<header class="top"><div class="brand">W.U.T.<span>'s Cooking</span><small>What's Ur Type?</small></div>${state.screen === "onboarding" ? "" : `<div class="pill">${esc(dietLabel())}</div>`}</header>`;
  }
  function nav() {
    const cur = state.screen === "recipe" || state.screen === "add" ? "recipes" : state.screen;
    const b = (id, ic, l) => `<button class="${cur === id ? "active" : ""}" data-act="go" data-arg="${id}" ${cur === id ? 'aria-current="page"' : ""}><i>${ic}</i>${l}</button>`;
    return `<nav class="nav" aria-label="Main">${b("home", "🏠", "Home")}${b("plan", "📅", "Plan")}${b("recipes", "❤️", "Recipes")}${b("shop", "🛒", "Shop")}${b("profile", "😊", "Profile")}</nav>`;
  }

  function render(keep) {
    const y = window.scrollY;
    let html;
    if (state.screen === "onboarding") html = onboarding();
    else {
      ensurePlan();
      if (state.screen === "recipe" && !(state.view && W.recipeById(state.view.rid, state))) state.screen = "home";
      const map = { home, plan: planScreen, recipes, recipe: recipeView, add: addScreen, shop, profile };
      html = (map[state.screen] || home)();
    }
    $app.innerHTML = `<div class="shell">${top()}${html}${state.screen === "onboarding" ? "" : nav()}</div>`;
    window.scrollTo(0, keep ? y : 0);
  }
  function go(screen) { state.screen = screen; save(); render(); }

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
    go: (a) => go(a),
    back: () => { state.step = Math.max(1, state.step - 1); save(); render(); },
    next: () => { if (state.step < 4) { state.step++; save(); render(); } else finishOnboarding(); },
    skip: () => ACT.next(),
    units: (a) => { state.profile.units = a; save(); render(true); },
    allergy: (a) => { state.profile.allergies = toggleIn(state.profile.allergies, a); save(); render(true); },
    addAllergy: addAllergies,
    rmAllergy: (a) => { state.profile.allergies = state.profile.allergies.filter((x) => x !== a); save(); render(true); },
    cond: (a) => { state.profile.conditions = toggleIn(state.profile.conditions, a); save(); render(true); },
    goal: (a, el) => {
      const g = el.dataset.group;
      if (g === "body") state.goals.body = state.goals.body === a ? "" : a;
      else state.goals[g] = toggleIn(state.goals[g], a);
      save(); render(true);
    },
    len: (a) => { if (a === "custom") { state.lenCustom = true; } else { state.lenCustom = false; state.planLen = Number(a); } save(); render(true); },
    newplan: () => {
      const n = state.newLen === "custom" ? parseInt(state.newLenCustom, 10) : parseInt(state.newLen, 10);
      if (!(n >= 1)) { toast("Enter a number of days (1–60)"); return; }
      makePlan(n); render(); toast("New plan ready ✨");
    },
    rebuild: () => { makePlan(state.planLen); state.screen = "home"; save(); render(); toast("Plan rebuilt ✨"); },
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
      if (!ing.length) { toast("Add at least one ingredient"); return; }
      const num = (v) => { const n = parseFloat(v); return n >= 0 ? n : 0; };
      const id = "u" + Date.now();
      state.myRecipes.push({ id, user: true, name, meal: d.meal, emoji: SLOT_EMOJI[d.meal] || "🍽️", ingLines: ing, steps: lines(d.steps), storage: d.storage.trim(), nut: { cal: num(d.cal), p: num(d.p), c: num(d.c), f: num(d.f) } });
      state.draft = defaults().draft; state.filter = "all"; state.screen = "recipes"; save(); render(); toast("Recipe added to your cookbook ✅");
    },
    delRecipe: (a, el) => {
      if (!confirm("Delete this recipe?")) return;
      const id = el.dataset.rid;
      state.myRecipes = state.myRecipes.filter((r) => r.id !== id);
      state.favorites = state.favorites.filter((x) => x !== id);
      go("recipes");
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
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.matches && el.matches("input[type=checkbox][data-act]")) { ACT[el.dataset.act](el.dataset.arg, el); return; }
    if (el.dataset && el.dataset.bind && el.tagName === "SELECT") {
      setPath(el.dataset.bind, el.value); save();
      if (el.dataset.rr !== undefined) render(true);
    }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.bind && el.tagName !== "SELECT") { setPath(el.dataset.bind, el.value); save(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.id === "allergyInput") { e.preventDefault(); addAllergies(); }
    if (e.key === "Escape") closeModal();
  });

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
