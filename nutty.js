/* W.U.T.'s Cooking — "Getting Nutty" tab (UI). The math lives in calc.js. */
(function (root) {
  "use strict";
  const W = root.WUT, C = W.calc;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const N = (W.nutty = {});

  N.fresh = () => ({ us: true, open: {}, vals: {}, q: "" });
  const valsOf = (st, id) => (st.vals[id] = st.vals[id] || Object.assign({}, (C.calcById(id) || {}).defaults || {}));

  function field(st, calc, f) {
    const v = valsOf(st, calc.id), us = st.us, key = `${calc.id}.${f.k}`;
    const lab = (extra) => `<span>${esc(f.label)}${f.opt ? " <small>optional</small>" : ""}${extra ? ` <small>${extra}</small>` : ""}</span>`;
    const inpt = (k, ph, unit) => `<input type="text" inputmode="decimal" data-ny="${calc.id}.${k}" value="${esc(v[k] || "")}" placeholder="${esc(ph || "")}" autocomplete="off" aria-label="${esc(f.label)}${unit ? " " + unit : ""}">`;
    if (f.t === "wt") return `<label class="field">${lab(us ? "lb" : "kg")}${inpt(f.k, f.ph || (us ? "e.g. 150" : "e.g. 68"))}</label>`;
    if (f.t === "len") return `<label class="field">${lab(us ? "inches" : "cm")}${inpt(f.k, f.ph || (us ? "e.g. 32" : "e.g. 81"))}</label>`;
    if (f.t === "ht") {
      return us
        ? `<div class="field"><span>${esc(f.label)}${f.opt ? " <small>optional</small>" : ""}</span><div class="grid2">${inpt(f.k, "feet", "feet")}${inpt(f.k + "2", "inches", "inches")}</div></div>`
        : `<label class="field">${lab("cm")}${inpt(f.k, "e.g. 170")}</label>`;
    }
    if (f.t === "num") return `<label class="field">${lab()}${inpt(f.k, f.ph || "")}</label>`;
    if (f.t === "date") return `<label class="field">${lab()}<input type="date" data-ny="${calc.id}.${f.k}" value="${esc(v[f.k] || "")}"></label>`;
    if (f.t === "time") return `<label class="field">${lab()}<input type="time" data-ny="${calc.id}.${f.k}" value="${esc(v[f.k] || "")}"></label>`;
    if (f.t === "sel") {
      return `<label class="field">${lab()}<select data-ny="${calc.id}.${f.k}" ${f.rr ? "data-nyrr" : ""}>${f.opts.map(([o, l]) => `<option value="${esc(o)}" ${String(o) === String(v[f.k] == null ? "" : v[f.k]) ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>`;
    }
    return "";
  }

  const toneCls = (t) => (t ? ` t-${t}` : "");

  function scaleBar(s) {
    const span = s.max - s.min, pos = (x) => Math.max(0, Math.min(100, ((x - s.min) / span) * 100));
    let prev = s.min;
    const zones = s.zones.map((z) => {
      const to = Math.min(z.to, s.max), w = Math.max(0, pos(to) - pos(prev)); prev = to;
      return `<i class="z t-${z.tone}" style="width:${w}%"><b>${esc(z.label)}</b></i>`;
    }).join("");
    const shown = Math.round(s.value * 10) / 10;
    return `<div class="scale" role="img" aria-label="${esc(s.unit)}: ${shown}"><div class="zones">${zones}<span class="marker" style="left:${pos(s.value)}%"><em>${shown}</em></span></div><div class="ends"><span>${s.min}</span><span>${esc(s.unit)}</span><span>${s.max}+</span></div></div>`;
  }

  function result(st, calc) {
    const v = valsOf(st, calc.id);
    const touched = Object.keys(v).some((k) => v[k] !== "" && !(calc.defaults && calc.defaults[k] === v[k]));
    if (!touched) return `<p class="hint">Fill in the boxes above and your result shows up here.</p>`;
    let r;
    try { r = C.run(calc, v, st.us); } catch (e) { r = { error: "Something looks off in those numbers." }; }
    if (!r || r.error) return `<div class="note soft">${esc((r && r.error) || "Check your numbers.")}</div>`;
    return `${r.scale ? scaleBar(r.scale) : ""}<div class="nrows">${(r.rows || []).map(([l, val, tone]) => `<div class="nrow${toneCls(tone)}"><span>${esc(l)}</span><b>${esc(val)}</b></div>`).join("")}</div>${(r.notes || []).map((n) => `<p class="fine">${esc(n)}</p>`).join("")}`;
  }
  N.resultHtml = (st, id) => result(st, C.calcById(id));

  function calcCard(st, calc) {
    const open = !!st.open[calc.id];
    const head = `<button type="button" class="nhead" data-act="nytoggle" data-arg="${calc.id}" aria-expanded="${open}" aria-controls="ny-${calc.id}"><span class="nic" aria-hidden="true">${calc.icon}</span><span><b>${esc(calc.title)}</b><small>${esc(calc.desc)}</small></span><i aria-hidden="true">${open ? "−" : "+"}</i></button>`;
    if (!open) return `<div class="card ncard">${head}</div>`;
    const v = valsOf(st, calc.id), fs = C.fieldsOf(calc, v);
    const hasProfile = fs.some((f) => ["wt", "ht"].includes(f.t) || ["sex", "age"].includes(f.k));
    return `<div class="card ncard open">${head}<div class="nbody" id="ny-${calc.id}">
      ${hasProfile ? `<button type="button" class="pillbtn" data-act="nyprofile" data-arg="${calc.id}">😊 Fill in from my profile</button>` : ""}
      ${fs.map((f) => field(st, calc, f)).join("")}
      <div class="nres" id="ny-res-${calc.id}" aria-live="polite">${result(st, calc)}</div>
      <button type="button" class="btn ghost small" data-act="nyclear" data-arg="${calc.id}">Clear</button></div></div>`;
  }

  function refCard(st, ref) {
    const open = !!st.open[ref.id];
    const head = `<button type="button" class="nhead" data-act="nytoggle" data-arg="${ref.id}" aria-expanded="${open}"><span class="nic" aria-hidden="true">${ref.icon}</span><span><b>${esc(ref.title)}</b><small>Chart</small></span><i aria-hidden="true">${open ? "−" : "+"}</i></button>`;
    if (!open) return `<div class="card ncard">${head}</div>`;
    return `<div class="card ncard open">${head}<div class="nbody"><div class="tblwrap"><table class="ntable"><thead><tr>${ref.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${ref.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div>${ref.note ? `<p class="fine">${esc(ref.note)}</p>` : ""}</div></div>`;
  }

  N.view = function (st) {
    const q = (st.q || "").trim().toLowerCase();
    const match = (o) => !q || (o.title + " " + (o.kw || "") + " " + (o.desc || "") + " " + (o.rows ? o.rows.map((r) => r[0]).join(" ") : "")).toLowerCase().includes(q);
    const groups = C.GROUPS.map(([g, label, ic]) => {
      const list = C.CALCS.filter((c) => c.g === g && match(c));
      return list.length ? `<h2 class="ngroup">${ic} ${esc(label)}</h2>${list.map((c) => calcCard(st, c)).join("")}` : "";
    }).join("");
    const refs = C.REFS.filter(match);
    const none = !groups && !refs.length;
    return `<div class="page"><div class="hero"><div class="eyebrow">For the health nuts 🥜</div><h1>Getting Nutty</h1><p>Calculators, charts and converters. Tap one to open it.</p></div>
      <div class="seg" role="group" aria-label="Units">${["us", "metric"].map((u) => `<button type="button" class="chip${(u === "us") === st.us ? " on" : ""}" aria-pressed="${(u === "us") === st.us}" data-act="nyunits" data-arg="${u}">${u === "us" ? "US (lb, in)" : "Metric (kg, cm)"}</button>`).join("")}</div>
      <label class="field"><span class="sr">Search calculators and charts</span><input type="search" id="nySearch" data-ny="q" value="${esc(st.q)}" placeholder="Search: BMI, protein, A1C, zinc…" autocomplete="off"></label>
      ${groups}
      ${refs.length ? `<h2 class="ngroup">📊 Charts &amp; reference tables</h2>${refs.map((r) => refCard(st, r)).join("")}` : ""}
      ${none ? `<div class="card empty"><p>Nothing matches “${esc(st.q)}”. Try BMI, water, sleep or iron.</p></div>` : ""}
      <p class="fine">These tools are for learning and general information, not medical advice or diagnosis. Talk to a doctor or dietitian about your health.</p></div>`;
  };

  // ----- actions (called by app.js) -----
  N.toggle = (st, id) => { st.open[id] = !st.open[id]; };
  N.units = (st, u) => {
    const us = u === "us";
    if (us === st.us) return;
    for (const id in st.vals) { const c = C.calcById(id); if (c) st.vals[id] = C.convertVals(c, st.vals[id], us); }
    st.us = us;
  };
  N.clear = (st, id) => { delete st.vals[id]; };
  N.fillFromProfile = (st, id, profile) => {
    const calc = C.calcById(id), v = valsOf(st, id), m = W.toMetric(profile), age = W.effAge(profile);
    const sx = String(profile.sexTxt || profile.sex || "").toLowerCase();
    for (const f of C.fieldsOf(calc, v)) {
      if (f.t === "wt" && f.k === "w" && m.kg > 0) v.w = String(st.us ? Math.round(m.kg / C.LB * 10) / 10 : Math.round(m.kg * 10) / 10);
      if (f.t === "ht" && m.cm > 0) {
        if (st.us) { const t = Math.round(m.cm / C.IN * 10) / 10, ft = Math.floor(t / 12); v[f.k] = String(ft); v[f.k + "2"] = String(Math.round((t - ft * 12) * 10) / 10); }
        else v[f.k] = String(Math.round(m.cm));
      }
      if (f.k === "age" && age > 0) v.age = String(age);
      if (f.k === "sex" && (sx === "female" || sx === "male")) v.sex = sx === "female" ? "f" : "m";
    }
  };
  // typed input: "calcId.key" (or "q" for the search box). Returns "rr" when a full redraw is needed.
  N.input = (st, el) => {
    const p = el.dataset.ny;
    if (p === "q") { st.q = el.value; return "rr"; }
    const i = p.indexOf("."), id = p.slice(0, i), k = p.slice(i + 1), v = valsOf(st, id);
    v[k] = el.value;
    const calc = C.calcById(id);
    if (calc && el.tagName === "SELECT" && el.hasAttribute("data-nyrr")) {
      if (id === "convert" && k === "type") v.from = C.convertUnits(el.value)[0];
      return "rr";
    }
    return id;
  };
})(globalThis);
