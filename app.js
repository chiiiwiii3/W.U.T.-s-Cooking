const KEY="wuts_cooking_state";
const foods=[
 {name:"Golden Berry Protein Oats",meal:"Breakfast",food:"🥣",cal:480,p:34,c:61,f:12,fiber:10,vitC:28,pot:22,ingredients:["rolled oats","plant protein","blueberries","banana","chia seeds","cinnamon"],diet:["vegan","vegetarian","pescatarian","omnivore","keto"],tags:["protein","fiber","potassium"]},
 {name:"Avocado Egg Power Bowl",meal:"Breakfast",food:"🥑",cal:520,p:31,c:42,f:25,fiber:11,vitC:22,pot:25,ingredients:["eggs","avocado","spinach","tomato","brown rice"],diet:["vegetarian","pescatarian","omnivore"],tags:["protein","skin"]},
 {name:"Mediterranean Salmon Bowl",meal:"Lunch",food:"🐟",cal:640,p:48,c:54,f:23,fiber:12,vitC:44,pot:31,ingredients:["salmon","quinoa","cucumber","tomato","spinach","lemon"],diet:["pescatarian","omnivore"],tags:["protein","omega3","skin"]},
 {name:"Herbed Chicken Sweet Potato",meal:"Dinner",food:"🍗",cal:690,p:57,c:58,f:21,fiber:13,vitC:70,pot:39,ingredients:["chicken breast","sweet potato","broccoli","garlic","olive oil"],diet:["omnivore"],tags:["protein","potassium","hair"]},
 {name:"Lentil Quinoa Garden Bowl",meal:"Lunch",food:"🥗",cal:560,p:29,c:82,f:12,fiber:19,vitC:62,pot:34,ingredients:["lentils","quinoa","spinach","pepper","carrot","lemon"],diet:["vegan","vegetarian","pescatarian","omnivore"],tags:["fiber","iron","potassium"]},
 {name:"Tofu Sesame Veggie Stir Fry",meal:"Dinner",food:"🍜",cal:610,p:37,c:55,f:24,fiber:9,vitC:95,pot:29,ingredients:["tofu","broccoli","bell pepper","brown rice","ginger","sesame"],diet:["vegan","vegetarian","pescatarian"],tags:["protein","vitC"]},
 {name:"Coconut Chia Protein Cup",meal:"Breakfast",food:"🥥",cal:390,p:30,c:31,f:17,fiber:13,vitC:9,pot:18,ingredients:["chia seeds","coconut milk","plant protein","strawberries"],diet:["vegan","vegetarian","pescatarian","omnivore"],tags:["fiber","protein","skin"]}
];

const bloodFramework={
 O:{preferred:["lean meats","fish","vegetables","fruit"],avoid:["wheat","corn","peanuts"],label:"Type O framework"},
 A:{preferred:["vegetables","whole grains","plant proteins"],avoid:["red meat"],label:"Type A framework"},
 B:{preferred:["vegetables","fish","dairy"],avoid:["corn","peanuts"],label:"Type B framework"},
 AB:{preferred:["vegetables","fish","tofu"],avoid:["processed meats"],label:"Type AB framework"}
};

let state=JSON.parse(localStorage.getItem(KEY)||"null")||{
 profile:{name:"",age:"",height:"",weight:"",sex:"",ethnicity:"",bloodType:"",diet:"omnivore",allergies:[],conditions:[],likes:[]},
 goals:[],targets:{cal:2000,protein:140,carbs:220,fat:70,fiber:30},days:1,plan:[],favorites:[],myRecipes:[],screen:"onboarding",onboardStep:1
};
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const app=document.getElementById("app");
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const toast=m=>{let x=document.createElement("div");x.className="toast";x.textContent=m;document.body.appendChild(x);setTimeout(()=>x.remove(),2200)};
function toggle(arr,val){state.profile[arr]=state.profile[arr].includes(val)?state.profile[arr].filter(x=>x!==val):[...state.profile[arr],val];save();render()}
function generate(){
 const diet=state.profile.diet, allergy=state.profile.allergies;
 let pool=foods.filter(f=>f.diet.includes(diet));
 if(!pool.length) pool=foods.filter(f=>f.diet.includes("omnivore"));
 const bad=allergy.map(a=>a.toLowerCase());
 pool=pool.filter(f=>!f.ingredients.some(i=>bad.some(a=>i.includes(a))));
 let days=[];
 for(let d=0;d<state.days;d++){
   let meals=["Breakfast","Lunch","Dinner"].map((m,idx)=>{
     let candidates=pool.filter(f=>f.meal===m);
     if(state.goals.includes("protein")) candidates.sort((a,b)=>b.p-a.p);
     else candidates.sort((a,b)=>(b.tags.some(t=>state.goals.includes(t))?1:0)-(a.tags.some(t=>state.goals.includes(t))?1:0));
     return {...(candidates[(d+idx)%Math.max(candidates.length,1)]||pool[0]),day:d+1};
   });
   days.push(...meals);
 }
 state.plan=days;save();toast("New personalized plan generated");state.screen="home";render()
}
function shell(content){
 app.innerHTML=`<div class="shell"><div class="top"><div class="brand">Nourish<span>AI</span></div><div class="pill">${esc(state.profile.diet||"omnivore")}</div></div>${content}${state.screen!=="onboarding"?nav():""}</div>`;
}
function nav(){
 return `<div class="nav">
 <button class="${state.screen==="home"?"active":""}" onclick="go('home')"><i>⌂</i>Home</button>
 <button class="${state.screen==="plan"?"active":""}" onclick="go('plan')"><i>◈</i>Plan</button>
 <button class="${state.screen==="recipes"?"active":""}" onclick="go('recipes')"><i>♨</i>Recipes</button>
 <button class="${state.screen==="shopping"?"active":""}" onclick="go('shopping')"><i>🛒</i>Shopping</button>
 <button class="${state.screen==="profile"?"active":""}" onclick="go('profile')"><i>◉</i>Profile</button></div>`
}
function go(s){state.screen=s;save();render()}
function onboarding(){
 const p=state.profile;
 if(state.onboardStep===1)return shell(`<div class="page"><div class="hero"><div class="eyebrow">Welcome</div><h1>Meals designed around you.</h1><p>Build a personalized meal-prep system around your goals, nutrition targets, allergies and food preferences.</p></div>
 <div class="card">
 ${field("Name","name",p.name,"text","Your name")}
 <div class="grid">${field("Age","age",p.age,"number","")} ${field("Weight","weight",p.weight,"number","")}</div>
 <div class="grid">${field("Height","height",p.height,"text","e.g. 5'11\"")} ${field("Sex","sex",p.sex,"text","Optional")}</div>
 ${field("Ethnicity","ethnicity",p.ethnicity,"text","Optional")}
 ${field("Blood type","bloodType",p.bloodType,"select","",["","O","A","B","AB"])}
 <button class="btn" onclick="nextOnboard()">Continue →</button></div></div>`);
 if(state.onboardStep===2)return shell(`<div class="page"><div class="hero"><div class="eyebrow">Preferences</div><h1>Tell us what you eat.</h1></div>
 <div class="card"><div class="field"><label>Diet preference</label><div class="chips">${["omnivore","vegan","vegetarian","pescatarian","keto","paleo","mediterranean"].map(x=>`<button class="chip ${p.diet===x?"on":""}" onclick="setDiet('${x}')">${x}</button>`).join("")}</div></div>
 <div class="field"><label>Blood Type Diet framework</label><p style="color:#b9adb0;font-size:12px">Optional preference. Your selected blood type can be used as a dietary framework.</p><div class="chips">${["none","strict","moderate","flexible"].map(x=>`<button class="chip ${p.bloodFramework===x?"on":""}" onclick="setBF('${x}')">${x}</button>`).join("")}</div></div>
 <div class="field"><label>Allergies — hard exclusions</label><div class="chips">${["peanuts","tree nuts","dairy","eggs","fish","shellfish","soy","gluten","sesame"].map(x=>`<button class="chip ${p.allergies.includes(x)?"on":""}" onclick="toggle('allergies','${x}')">${x}</button>`).join("")}</div></div>
 <div class="field"><label>Health considerations</label><div class="chips">${["diabetes","high blood pressure","high cholesterol","digestive concerns","iron deficiency"].map(x=>`<button class="chip ${p.conditions.includes(x)?"on":""}" onclick="toggle('conditions','${x}')">${x}</button>`).join("")}</div></div>
 <button class="btn" onclick="nextOnboard()">Continue →</button></div></div>`);
 return shell(`<div class="page"><div class="hero"><div class="eyebrow">Goals</div><h1>What are you working toward?</h1><p>Choose as many as you want.</p></div><div class="card"><div class="chips">${["weight loss","weight gain","maintenance","muscle","protein","fiber","potassium","iron","calcium","magnesium","omega3","vitamin D","skin","hair","nails","energy","recovery"].map(x=>`<button class="chip ${state.goals.includes(x)?"on":""}" onclick="toggleGoal('${x}')">${x}</button>`).join("")}</div>
 <hr style="border-color:#3b3337;margin:20px 0"><div class="grid">${field("Calories","cal",state.targets.cal,"number","/day","target")} ${field("Protein","protein",state.targets.protein,"number","g","target")}</div><div class="grid">${field("Carbs","carbs",state.targets.carbs,"number","g","target")} ${field("Fiber","fiber",state.targets.fiber,"number","g","target")}</div>
 <button class="btn" onclick="finishOnboard()">✨ Create my meal plan</button></div></div>`)
}
function field(label,key,val,type="text",ph="",group="profile",opts=[]){
 if(type==="select")return `<div class="field"><label>${label}</label><select onchange="setField('${group}','${key}',this.value)">${opts.map(o=>`<option ${o===val?"selected":""} value="${o}">${o||"Choose..."}</option>`).join("")}</select></div>`;
 return `<div class="field"><label>${label}</label><input type="${type}" value="${esc(val)}" placeholder="${ph}" onchange="setField('${group}','${key}',this.value)"></div>`
}
function setField(group,key,v){if(group==="target")state.targets[key]=+v;else state.profile[key]=v;save()}
function setDiet(x){state.profile.diet=x;save();render()}
function setBF(x){state.profile.bloodFramework=x;save();render()}
function toggleGoal(x){state.goals=state.goals.includes(x)?state.goals.filter(a=>a!==x):[...state.goals,x];save();render()}
function nextOnboard(){state.onboardStep++;save();render()}
function finishOnboard(){state.days=1;generate()}
function home(){
 if(!state.plan.length)generate();
 const meals=state.plan.filter(x=>x.day===1), total=meals.reduce((a,b)=>({cal:a.cal+b.cal,p:a.p+b.p,c:a.c+b.c}),{cal:0,p:0,c:0});
 let pct=Math.min(100,Math.round(total.cal/state.targets.cal*100));
 return shell(`<div class="page"><div class="hero"><div class="eyebrow">Today's plan</div><h1>Good ${new Date().getHours()<12?"morning":new Date().getHours()<18?"afternoon":"evening"}, ${esc(state.profile.name||"friend")}.</h1><p>Your meals are personalized around your current profile and restrictions.</p></div>
 <div class="card"><div class="ring" style="--pct:${pct}%"><div class="inside"><strong>${total.cal}</strong><small>/ ${state.targets.cal} kcal</small></div></div><div class="stats"><div class="stat">Protein<b>${total.p}g</b></div><div class="stat">Carbs<b>${total.c}g</b></div><div class="stat">Fiber<b>${meals.reduce((a,b)=>a+b.fiber,0)}g</b></div></div></div>
 ${meals.map(m=>mealCard(m)).join("")}
 <div class="card"><h3>✨ New plan</h3><p style="color:#b9adb0">Refresh your meals for a day, week, month or custom duration.</p><div class="grid"><select id="days" style="background:#171517;color:white;border:1px solid #3b3337;border-radius:13px;padding:12px"><option value="1">1 day</option><option value="3">3 days</option><option value="7">1 week</option><option value="14">2 weeks</option><option value="30">1 month</option></select><button class="btn small" onclick="newPlan()">Generate</button></div></div>
 <button class="btn secondary" onclick="installApp()">📱 Add W.U.T.'s Cooking to Home Screen</button></div>`)
}
function mealCard(m){return `<div class="card meal" onclick="openRecipe(${state.plan.indexOf(m)})"><div class="food">${m.food}</div><div class="eyebrow">${m.meal} • Day ${m.day}</div><h3>${esc(m.name)}</h3><p style="color:#b9adb0">${m.cal} kcal • ${m.p}g protein • ${m.c}g carbs</p><div class="stats"><div class="stat">Fiber<b>${m.fiber}g</b></div><div class="stat">Vitamin C<b>${m.vitC}%</b></div><div class="stat">Potassium<b>${m.pot}%</b></div></div></div>`}
function newPlan(){state.days=+document.getElementById("days").value;generate()}
function plan(){
 const by=[...Array(state.days||1)].map((_,i)=>state.plan.filter(x=>x.day===i+1));
 return shell(`<div class="page"><div class="hero"><div class="eyebrow">Meal plan</div><h1>${state.days} day${state.days>1?"s":""}</h1></div>${by.map((ms,i)=>`<div class="card"><h3>Day ${i+1}</h3>${ms.map(m=>`<div style="padding:10px 0;border-bottom:1px solid #3b3337" onclick="openRecipe(${state.plan.indexOf(m)})"><b>${m.food} ${m.meal}</b><br><span style="color:#b9adb0">${m.name} • ${m.cal} kcal • ${m.p}g protein</span></div>`).join("")}</div>`).join("")}</div>`)
}
function recipes(){
 const all=[...foods,...state.myRecipes], fav=state.favorites;
 return shell(`<div class="page"><div class="hero"><div class="eyebrow">Kitchen</div><h1>Recipes</h1><p>Save favorites or add your own recipes.</p></div><button class="btn" onclick="addRecipe()">＋ Add my recipe</button>${all.map((r,i)=>`<div class="card" onclick="openRecipeData(${i})"><div class="eyebrow">${r.meal||"My Recipe"}</div><h3>${r.food||"🍽️"} ${esc(r.name)}</h3><p style="color:#b9adb0">${r.cal||0} kcal • ${r.p||0}g protein • ${r.c||0}g carbs</p><button class="btn secondary small" onclick="event.stopPropagation();favRecipe('${esc(r.name)}')">${fav.includes(r.name)?"♥ Saved":"♡ Favorite"}</button></div>`).join("")}</div>`)
}
function openRecipe(i){openRecipeData(state.plan[i])}
function openRecipeData(r){
 if(typeof r==="number")r=[...foods,...state.myRecipes][r];
 state.recipe=r;state.screen="recipe";render()
}
function recipe(){
 const r=state.recipe; if(!r)return recipes();
 return shell(`<div class="page"><button class="back" onclick="go('home')">← Back</button><div class="hero"><div class="eyebrow">${r.meal||"Recipe"}</div><div class="recipe-title">${r.food||"🍽️"} ${esc(r.name)}</div><p>${r.cal||0} calories • ${r.p||0}g protein • ${r.c||0}g carbs • ${r.fiber||0}g fiber</p></div>
 <div class="card"><h3>Ingredients</h3><ul class="list">${(r.ingredients||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
 <div class="card"><h3>How to cook</h3>${(r.steps||["Prep ingredients and cook according to the recipe.","Cook until food reaches a safe internal temperature.","Portion into containers."]).map((x,i)=>`<div class="step"><div class="num">${i+1}</div><div>${esc(x)}</div></div>`).join("")}</div>
 <div class="card"><h3>Storage</h3><p style="color:#d9ced0">${esc(r.storage||"Refrigerate promptly in sealed containers. Follow safe food-storage guidance for the specific ingredients.")}</p><h3>Reheating</h3><p style="color:#d9ced0">Reheat until thoroughly hot; add a splash of water when appropriate to prevent drying.</p></div></div>`)
}
function favRecipe(n){if(state.favorites.includes(n))state.favorites=state.favorites.filter(x=>x!==n);else state.favorites.push(n);save();render()}
function addRecipe(){
 const n=prompt("Recipe name?");if(!n)return;
 const ing=prompt("Ingredients, separated by commas?")||"";
 const cal=+(prompt("Calories per serving?")||0), p=+(prompt("Protein grams?")||0), c=+(prompt("Carbs grams?")||0);
 state.myRecipes.push({name:n,food:"🍽️",meal:"My Recipe",cal,p,c,fiber:0,ingredients:ing.split(",").map(x=>x.trim()).filter(Boolean),steps:["Prepare ingredients.","Cook using your preferred method until safely done.","Portion and store." ]});
 save();render();toast("Recipe added")
}
function shopping(){
 const counts={};state.plan.forEach(m=>(m.ingredients||[]).forEach(i=>counts[i]=(counts[i]||0)+1));
 return shell(`<div class="page"><div class="hero"><div class="eyebrow">Prep smarter</div><h1>Shopping list</h1><p>Ingredients are consolidated across your current plan.</p></div><div class="card">${Object.entries(counts).map(([k,v])=>`<label style="display:block;padding:11px 0;border-bottom:1px solid #3b3337"><input type="checkbox"> ${esc(k)} <span style="float:right;color:#b9adb0">${v} recipe use${v>1?"s":""}</span></label>`).join("")}</div></div>`)
}
function profile(){
 const p=state.profile;
 return shell(`<div class="page"><div class="hero"><div class="eyebrow">Your profile</div><h1>${esc(p.name||"Profile")}</h1></div><div class="card">${field("Name","name",p.name)}${field("Age","age",p.age,"number")}${field("Height","height",p.height)}${field("Weight","weight",p.weight,"number")}${field("Blood type","bloodType",p.bloodType,"select","",["","O","A","B","AB"])}<div class="field"><label>Diet</label><div class="chips">${["omnivore","vegan","vegetarian","pescatarian","keto","paleo","mediterranean"].map(x=>`<button class="chip ${p.diet===x?"on":""}" onclick="setDiet('${x}')">${x}</button>`).join("")}</div></div><div class="field"><label>Allergies</label><div class="chips">${p.allergies.map(x=>`<span class="chip on">${esc(x)}</span>`).join("")||"<span style='color:#b9adb0'>None selected</span>"}</div></div><button class="btn secondary" onclick="state.onboardStep=2;state.screen='onboarding';save();render()">Edit preferences</button></div></div>`)
}
function render(){
 if(state.screen==="onboarding")return onboarding();
 if(state.screen==="home")return home();
 if(state.screen==="plan")return plan();
 if(state.screen==="recipes")return recipes();
 if(state.screen==="recipe")return recipe();
 if(state.screen==="shopping")return shopping();
 if(state.screen==="profile")return profile();
}
let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e});
function installApp(){if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}else toast("Use your browser menu → Add to Home screen")}
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
render();
