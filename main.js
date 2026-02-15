document.addEventListener("DOMContentLoaded", () => {
  
  let appState = {
    selectedClass: null,
    selectedSubclass: null,
    characterLevel: 1,
    abilityMod: 3, 
    activeTab: "spellbook", 
    usedSlots: {},
    preparedSpells: [] 
  };

  let selectedSpellLevel = null;

  const el = {
    classBtns: document.getElementById("classButtons"),
    subSection: document.getElementById("subclassSection"),
    subTitle: document.getElementById("subclassTitle"),
    subBtns: document.getElementById("subclassButtons"),
    levelInput: document.getElementById("levelInput"),
    modInput: document.getElementById("modInput"),
    btnMinus: document.getElementById("btnMinus"),
    btnPlus: document.getElementById("btnPlus"),
    milestone: document.getElementById("milestoneDisplay"),
    known: document.getElementById("spellsKnownDisplay"),
    limitDisplay: document.getElementById("limitDisplay"),
    appTabs: document.getElementById("appTabs"),
    tabSpellbook: document.getElementById("tabSpellbook"),
    tabTracker: document.getElementById("tabTracker"),
    viewSpellbook: document.getElementById("view-spellbook"),
    viewTracker: document.getElementById("view-tracker"),
    filter1: document.getElementById("filterContainer1"), 
    filter2: document.getElementById("filterContainer2"), 
    listSpellbook: document.getElementById("list-spellbook"),
    listTracker: document.getElementById("list-tracker"), 
    listSelection: document.getElementById("list-selection"), 
    emptyTrackerMsg: document.getElementById("emptyTrackerMsg"),
    slotTracker: document.getElementById("slotTracker"),
    btnRest: document.getElementById("btnRest")
  };

  const classes = ["Wizard", "Cleric", "Druid", "Bard", "Sorcerer", "Paladin", "Ranger", "Artificer", "Warlock"];

  const subclassData = {
    Cleric: { label: "Select Divine Domain", options: ["Life", "Light", "War", "Trickery", "Tempest", "Nature", "Knowledge"] },
    Sorcerer: { label: "Select Sorcerous Origin", options: ["Draconic Bloodline", "Wild Magic", "Divine Soul", "Storm Sorcery"] },
    Warlock: { label: "Select Otherworldly Patron", options: ["The Fiend", "The Archfey", "The Great Old One", "The Hexblade"] }
  };

  const subclassSpells = {
    Cleric: {
      Life: ["Bless", "Cure Wounds", "Lesser Restoration", "Spiritual Weapon", "Revivify", "Death Ward", "Mass Cure Wounds", "Raise Dead"],
      Light: ["Burning Hands", "Faerie Fire", "Flaming Sphere", "Scorching Ray", "Fireball", "Wall of Fire", "Flame Strike"],
      War: ["Divine Favor", "Shield of Faith", "Magic Weapon", "Spiritual Weapon", "Crusader's Mantle", "Spirit Guardians", "Freedom of Movement", "Stoneskin", "Flame Strike"],
      Trickery: ["Charm Person", "Disguise Self", "Mirror Image", "Pass Without Trace", "Blink", "Dispel Magic", "Dimension Door", "Polymorph", "Dominate Person"],
      Tempest: ["Fog Cloud", "Thunderwave", "Gust of Wind", "Shatter", "Call Lightning", "Sleet Storm", "Control Water", "Ice Storm", "Destructive Wave"],
      Nature: ["Animal Friendship", "Speak with Animals", "Barkskin", "Spike Growth", "Plant Growth", "Wind Wall", "Dominate Beast", "Grasping Vine", "Insect Plague"],
      Knowledge: ["Command", "Identify", "Augury", "Suggestion", "Nondetection", "Speak with Dead", "Arcane Eye", "Confusion", "Legend Lore", "Scrying"]
    },
    Warlock: {
      "The Fiend": ["Burning Hands", "Command", "Blindness/Deafness", "Scorching Ray", "Fireball", "Stinking Cloud", "Fire Shield", "Wall of Fire", "Flame Strike", "Hallow"],
      "The Archfey": ["Faerie Fire", "Sleep", "Calm Emotions", "Phantasmal Force", "Blink", "Plant Growth", "Dominate Beast", "Greater Invisibility", "Dominate Person", "Seeming"],
      "The Great Old One": ["Dissonant Whispers", "Tasha's Hideous Laughter", "Detect Thoughts", "Phantasmal Force", "Clairvoyance", "Sending", "Dominate Beast", "Evard's Black Tentacles", "Dominate Person", "Telekinesis"],
      "The Hexblade": ["Shield", "Wrathful Smite", "Blur", "Branding Smite", "Blink", "Elemental Weapon", "Phantasmal Killer", "Staggering Smite", "Banishing Smite", "Cone of Cold"]
    },
    Sorcerer: { "Draconic Bloodline": [], "Wild Magic": [], "Divine Soul": [], "Storm Sorcery": [] }
  };

  const spellSlotTable = [
    [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0], 
    [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0], 
    [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0], [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,0,0,0], 
    [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,0], 
    [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1], [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1]
  ];

  const spellProgression = {
    Wizard: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
    Cleric: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
    Druid:  [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
    Bard:   [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
    Sorcerer:[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
    Paladin:[0,0,1,1,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4],
    Ranger: [0,0,1,1,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4],
    Artificer:[0,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5],
    Warlock:[1,1,2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5]
  };

  const spellsKnownTable = {
    Bard: [4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22],
    Sorcerer: [2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15],
    Warlock: [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],
    Ranger: [0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11]
  };

  function calculateLimit() {
    const cls = appState.selectedClass;
    const lvl = appState.characterLevel;
    const mod = appState.abilityMod;
    if (!cls) return 0;
    if (spellsKnownTable[cls]) return spellsKnownTable[cls][lvl - 1];
    if (["Wizard", "Cleric", "Druid"].includes(cls)) return Math.max(1, lvl + mod);
    if (cls === "Paladin" || cls === "Artificer") return Math.max(1, Math.floor(lvl / 2) + mod);
    return 99; 
  }

  window.switchTab = function(tabName) {
    appState.activeTab = tabName;
    renderTabs();
  }

  function renderTabs() {
    if (appState.activeTab === 'spellbook') {
      el.tabSpellbook.className = "tab-btn active";
      el.tabTracker.className = "tab-btn";
      el.viewSpellbook.classList.remove("hidden");
      el.viewTracker.classList.add("hidden");
      renderSpellbookList(); 
    } else {
      el.tabSpellbook.className = "tab-btn";
      el.tabTracker.className = "tab-btn active";
      el.viewSpellbook.classList.add("hidden");
      el.viewTracker.classList.remove("hidden");
      renderSlotTracker();
      renderCastList(); 
      renderSelectionList(); 
    }
  }

  window.togglePrepare = function(spellName, checkbox) {
    const limit = calculateLimit();
    const currentCount = appState.preparedSpells.length;
    const isSelected = appState.preparedSpells.includes(spellName);
    if (!isSelected) {
      if (currentCount >= limit) {
        alert(`Limit reached!`);
        checkbox.checked = false;
        return;
      }
      appState.preparedSpells.push(spellName);
    } else {
      const idx = appState.preparedSpells.indexOf(spellName);
      if (idx > -1) appState.preparedSpells.splice(idx, 1);
    }
    renderCastList();
    renderSelectionList();
  }

  function calculateSlots(cls, level) {
    if (cls === "Warlock") {
      const warlockSlots = [1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4];
      return { type: "Pact", level: spellProgression.Warlock[level - 1], count: warlockSlots[level - 1] };
    }
    let effectiveLevel = level;
    if (cls === "Paladin" || cls === "Ranger") effectiveLevel = Math.floor(level / 2);
    if (cls === "Artificer") effectiveLevel = Math.ceil(level / 2);
    if (effectiveLevel < 1) return []; 
    return spellSlotTable[effectiveLevel - 1].map((count, i) => ({ level: i + 1, count: count })).filter(s => s.count > 0);
  }

  window.toggleSlot = function(lvl, index) {
    const key = `l${lvl}_i${index}`;
    if (appState.usedSlots[key]) delete appState.usedSlots[key];
    else appState.usedSlots[key] = true;
    renderSlotTracker();
    renderCastList();
  }

  window.castSpell = function(spellLevel) {
    const slots = calculateSlots(appState.selectedClass, appState.characterLevel);
    if (appState.selectedClass === "Warlock") {
      for (let i = 0; i < slots.count; i++) {
          const key = `pact_i${i}`;
          if (!appState.usedSlots[key]) {
              appState.usedSlots[key] = true;
              renderSlotTracker(); renderCastList(); return;
          }
      }
    } else {
      for (let s of slots) {
          if (s.level >= spellLevel) {
              for (let i = 0; i < s.count; i++) {
                  const key = `l${s.level}_i${i}`;
                  if (!appState.usedSlots[key]) {
                      appState.usedSlots[key] = true;
                      renderSlotTracker(); renderCastList(); return;
                  }
              }
          }
      }
    }
  }

  function renderSlotTracker() {
    el.slotTracker.innerHTML = "";
    if (!appState.selectedClass) return;
    const slots = calculateSlots(appState.selectedClass, appState.characterLevel);
    if (appState.selectedClass === "Warlock") {
      const div = document.createElement("div");
      div.className = "bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col gap-2";
      div.innerHTML = `<div class="text-xs font-bold uppercase text-accent">Pact Magic (Level ${slots.level})</div>`;
      const bubbles = document.createElement("div");
      bubbles.className = "flex gap-2";
      for (let i = 0; i < slots.count; i++) {
          const key = `pact_i${i}`;
          const isUsed = appState.usedSlots[key];
          const bubble = document.createElement("div");
          bubble.className = `slot-bubble ${isUsed ? 'used' : 'available'}`;
          bubble.onclick = () => { if(isUsed) delete appState.usedSlots[key]; else appState.usedSlots[key] = true; renderSlotTracker(); renderCastList(); };
          bubbles.appendChild(bubble);
      }
      div.appendChild(bubbles);
      el.slotTracker.appendChild(div);
    } else {
      if (slots.length === 0) el.slotTracker.innerHTML = `<p class="text-xs text-muted text-center w-full">No spell slots.</p>`;
      slots.forEach(slot => {
          const div = document.createElement("div");
          div.className = "bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2";
          div.innerHTML = `<div class="text-[10px] font-black uppercase text-slate-500">Level ${slot.level}</div>`;
          const bubbles = document.createElement("div");
          bubbles.className = "flex gap-2";
          for (let i = 0; i < slot.count; i++) {
              const key = `l${slot.level}_i${i}`;
              const isUsed = appState.usedSlots[key];
              const bubble = document.createElement("div");
              bubble.className = `slot-bubble ${isUsed ? 'used' : 'available'}`;
              bubble.onclick = () => toggleSlot(slot.level, i);
              bubbles.appendChild(bubble);
          }
          div.appendChild(bubbles);
          el.slotTracker.appendChild(div);
      });
    }
  }

  function getSpellsForClass() {
    if (!appState.selectedClass || typeof spells === 'undefined') return [];
    const maxLvl = spellProgression[appState.selectedClass][appState.characterLevel - 1];
    if ((appState.selectedClass === "Paladin" || appState.selectedClass === "Ranger") && appState.characterLevel < 2) return [];
    const classSubData = subclassSpells[appState.selectedClass];
    const extraSpells = (appState.selectedSubclass && classSubData && classSubData[appState.selectedSubclass]) ? classSubData[appState.selectedSubclass] : [];
    return spells.filter(spell => {
      if (!spell.class) return false;
      const classes = spell.class.split(",").map(c => c.trim());
      const spellLvl = parseInt(spell.level);
      if (spellLvl > maxLvl) return false;
      if (selectedSpellLevel !== null && spellLvl !== selectedSpellLevel) return false;
      const isClassSpell = classes.includes(appState.selectedClass);
      const isSubclassSpell = extraSpells && extraSpells.includes(spell.name);
      const isDivineSoul = appState.selectedClass === "Sorcerer" && appState.selectedSubclass === "Divine Soul" && classes.includes("Cleric");
      return isClassSpell || isSubclassSpell || isDivineSoul;
    });
  }

  function renderSpellbookList() {
    el.listSpellbook.innerHTML = "";
    const filtered = getSpellsForClass();
    if (filtered.length === 0) {
      el.listSpellbook.innerHTML = `<div class="text-center py-8"><p class='text-muted italic'>No spells.</p></div>`;
      return;
    }
    filtered.forEach(spell => el.listSpellbook.appendChild(createCardHTML(spell, "read-only")));
  }

  function renderCastList() {
    el.listTracker.innerHTML = "";
    const allSpells = getSpellsForClass();
    const classSubData = subclassSpells[appState.selectedClass];
    const extraSpells = (appState.selectedSubclass && classSubData && classSubData[appState.selectedSubclass]) ? classSubData[appState.selectedSubclass] : [];
    const readySpells = allSpells.filter(spell => {
      if (parseInt(spell.level) === 0) return true;
      if (extraSpells.includes(spell.name)) return true;
      return appState.preparedSpells.includes(spell.name);
    });
    if (readySpells.length === 0) el.emptyTrackerMsg.classList.remove("hidden");
    else {
      el.emptyTrackerMsg.classList.add("hidden");
      readySpells.forEach(spell => el.listTracker.appendChild(createCardHTML(spell, "cast")));
    }
  }

  function renderSelectionList() {
    el.listSelection.innerHTML = "";
    const limit = calculateLimit();
    const current = appState.preparedSpells.length;
    el.limitDisplay.textContent = `${current}/${limit} Selected`;
    el.limitDisplay.className = current >= limit ? "text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded" : "text-[10px] font-black bg-slate-200 text-slate-700 px-2 py-1 rounded";
    const allSpells = getSpellsForClass();
    const classSubData = subclassSpells[appState.selectedClass];
    const extraSpells = (appState.selectedSubclass && classSubData && classSubData[appState.selectedSubclass]) ? classSubData[appState.selectedSubclass] : [];
    allSpells.filter(spell => parseInt(spell.level) !== 0 && !extraSpells.includes(spell.name)).forEach(spell => {
      const isChecked = appState.preparedSpells.includes(spell.name);
      const disabled = !isChecked && current >= limit;
      const div = document.createElement("div");
      div.className = "flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition";
      div.innerHTML = `<div class="flex items-center gap-3"><input type="checkbox" class="spell-checkbox" ${isChecked ? "checked" : ""} ${disabled ? "disabled" : ""} onchange="togglePrepare('${spell.name}', this)"><div><div class="font-bold text-sm text-dark ${disabled ? 'text-stone-400' : ''}">${spell.name}</div><div class="text-[10px] text-stone-500 uppercase">Level ${spell.level}</div></div></div>`;
      el.listSelection.appendChild(div);
    });
  }

  function createCardHTML(spell, type) {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition duration-200";
    const spellLvl = parseInt(spell.level);
    const isCantrip = spellLvl === 0;
    
    const hasSomatic = spell.components.includes("S");
    const hasMaterial = spell.components.includes("M");
    const needsFreeHand = hasSomatic || hasMaterial;
    const handText = needsFreeHand ? "1-Handed" : "0-Hands";
    const handColor = needsFreeHand ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";

    let action = "";
    if (type === "cast") {
       let canCast = isCantrip;
       if (!isCantrip) {
          const slots = calculateSlots(appState.selectedClass, appState.characterLevel);
          if (appState.selectedClass === "Warlock") {
             if (spellLvl <= slots.level) {
                 let used = 0; for(let k in appState.usedSlots) if(k.startsWith("pact")) used++;
                 if (used < slots.count) canCast = true;
             }
          } else {
             for (let s of slots) {
                if (s.level >= spellLvl) {
                   let used = 0; for(let i=0; i<s.count; i++) if(appState.usedSlots[`l${s.level}_i${i}`]) used++;
                   if (used < s.count) { canCast = true; break; }
                }
             }
          }
       }
       const btnClass = canCast ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-100 text-slate-400 cursor-not-allowed";
       action = isCantrip 
         ? `<span class="text-[10px] font-black text-slate-400 bg-slate-200/50 px-3 py-1 rounded uppercase tracking-tighter">Cantrip</span>`
         : `<button onclick="castSpell(${spell.level})" class="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition ${btnClass}" ${!canCast ? 'disabled' : ''}>Cast</button>`;
    } else action = `<span class="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded">Ref</span>`;

    const desc = spell.effect
      .replace(/\b(\d*d\d+)\b/g, m => `<span class="bg-slate-100 text-slate-900 font-bold px-1.5 py-0.5 rounded border border-slate-200 text-xs">${m}</span>`)
      .replace(/\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+Save\b/gi, (match, ability) => {
          const short = ability.substring(0,3).toUpperCase();
          return `<span class="text-sky-600 font-black uppercase text-[10px] tracking-wider">${short} Save</span>`;
      });

    card.innerHTML = `<div class="space-y-3"><div class="flex justify-between items-start"><div class="flex flex-col"><h3 class="text-lg font-black text-slate-900 leading-tight">${spell.name}</h3><span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">${isCantrip ? "Cantrip" : "Level " + spell.level}</span></div>${action}</div><div class="flex flex-wrap gap-2 items-center"><span class="bg-slate-50 px-3 py-1 rounded border border-slate-100 text-[10px] font-bold text-slate-500 uppercase">${spell.castingTime}</span><span class="bg-slate-50 px-3 py-1 rounded border border-slate-100 text-[10px] font-bold text-slate-500 uppercase">${spell.range}</span><span class="bg-slate-50 px-3 py-1 rounded border border-slate-100 text-[10px] font-bold text-slate-500 uppercase">${spell.duration}</span><span class="text-[9px] font-black px-2 py-1 rounded uppercase ${handColor} tracking-tighter shadow-sm border border-black/5">${handText}</span><span class="text-[10px] font-bold text-sky-500 px-2 py-1 bg-sky-50 rounded border border-sky-100">${spell.components}</span></div><p class="text-sm mt-1 text-slate-600 leading-relaxed font-medium">${desc}</p></div>`;
    return card;
  }

  function updateUI() {
    el.levelInput.value = appState.characterLevel;
    el.btnMinus.disabled = appState.characterLevel <= 1;
    el.btnPlus.disabled = appState.characterLevel >= 20;
    const milestones = { 1: "Class Features", 4: "ASI", 8: "ASI", 12: "ASI", 16: "ASI", 19: "ASI" };
    el.milestone.textContent = milestones[appState.characterLevel] || "";
    if (appState.selectedClass) el.known.innerHTML = `<strong>Max Spells:</strong> ${calculateLimit()}`;
    buildSpellLevelButtons();
    renderTabs();
  }

  function renderSubclassUI(cls) {
    const data = subclassData[cls];
    if (!data) { el.subSection.classList.add("hidden"); return false; }
    el.subSection.classList.remove("hidden");
    el.subTitle.textContent = data.label;
    el.subBtns.innerHTML = "";
    data.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "px-3 py-2 rounded-lg text-xs font-bold shadow-sm border border-b-2 bg-white text-slate-600 border-slate-200 hover:border-sky-500 hover:text-sky-600 transition-all";
      if (appState.selectedSubclass === opt) btn.className = "px-3 py-2 rounded-lg text-xs font-bold shadow-md bg-sky-500 text-white border-b-4 border-sky-700 transform -translate-y-0.5";
      btn.onclick = () => { appState.selectedSubclass = opt; renderSubclassUI(cls); el.appTabs.classList.remove("hidden"); updateUI(); };
      el.subBtns.appendChild(btn);
    });
    return true;
  }

  function buttonBase() { return `w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold shadow-sm border border-slate-200 bg-white text-slate-600 hover:border-sky-500 hover:text-sky-600 hover:shadow-md transition-all`; }
  
  function setActive(container, activeBtn) {
    [...container.children].forEach(btn => {
      btn.className = buttonBase();
      if (btn.dataset.isLast === "true") btn.classList.add("col-span-2", "md:col-span-1");
    });
    activeBtn.className = `w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold shadow-md bg-slate-900 text-white border-b-4 border-sky-600 transform -translate-y-0.5 transition-all`;
    if (activeBtn.dataset.isLast === "true") activeBtn.classList.add("col-span-2", "md:col-span-1");
  }

  classes.forEach((cls, index) => {
    const btn = document.createElement("button");
    btn.innerHTML = `<span>${cls}</span>`;
    btn.className = buttonBase();
    if (index === classes.length - 1) { btn.dataset.isLast = "true"; btn.classList.add("col-span-2", "md:col-span-1"); }
    btn.onclick = () => {
      appState.selectedClass = cls;
      appState.selectedSubclass = null; 
      appState.preparedSpells = [];
      appState.usedSlots = {};
      setActive(el.classBtns, btn);
      if (!renderSubclassUI(cls)) el.appTabs.classList.remove("hidden");
      else el.appTabs.classList.add("hidden"); 
      updateUI();
    };
    el.classBtns.appendChild(btn);
  });

  el.levelInput.addEventListener("change", (e) => {
    let val = parseInt(e.target.value);
    appState.characterLevel = isNaN(val) ? 1 : Math.min(20, Math.max(1, val)); updateUI();
  });
  el.modInput.addEventListener("change", (e) => { appState.abilityMod = parseInt(e.target.value); updateUI(); });
  el.btnMinus.onclick = () => { if (appState.characterLevel > 1) { appState.characterLevel--; updateUI(); }};
  el.btnPlus.onclick = () => { if (appState.characterLevel < 20) { appState.characterLevel++; updateUI(); }};
  el.btnRest.onclick = () => { if(confirm("Take a Long Rest?")) { appState.usedSlots = {}; renderSlotTracker(); renderCastList(); }};

  function setFilterActive(container, activeBtn) {
     [...container.children].forEach(btn => { 
       btn.className = "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm border border-slate-200 bg-white text-slate-500 hover:border-sky-500 hover:text-sky-600 transition-all"; 
     });
     activeBtn.className = `px-3 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-md bg-sky-500 text-white border-b-2 border-sky-700 transform -translate-y-0.5 transition-all`;
  }

  function buildSpellLevelButtons() {
    [el.filter1, el.filter2].forEach(container => {
        if(!container) return;
        container.innerHTML = "";
        if (!appState.selectedClass) return;
        const maxSpellLevel = spellProgression[appState.selectedClass][appState.characterLevel - 1];
        const allBtn = document.createElement("button");
        allBtn.textContent = "All";
        allBtn.className = "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm border border-slate-200 bg-white text-slate-500";
        allBtn.onclick = () => { selectedSpellLevel = null; setFilterActive(container, allBtn); renderTabs(); };
        container.appendChild(allBtn);
        for (let i = 0; i <= maxSpellLevel; i++) {
          const btn = document.createElement("button");
          btn.textContent = i === 0 ? "Cantrip" : `Level ${i}`;
          btn.className = "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm border border-slate-200 bg-white text-slate-500";
          btn.onclick = () => { selectedSpellLevel = i; setFilterActive(container, btn); renderTabs(); };
          container.appendChild(btn);
        }
    });
  }

  // --- NEW IMPORT LOGIC ---
  window.importCharacterJSON = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        
        // Basic check
        if (!data.className || !data.level) {
          alert("Invalid character file format.");
          return;
        }

        // Mapping: Calculator uses lowercase 'fighter', Spellbook uses 'Fighter'
        const clsMap = {
            "fighter": "Fighter", "barbarian": "Barbarian", "rogue": "Rogue", 
            "monk": "Monk", "ranger": "Ranger", "paladin": "Paladin", 
            "cleric": "Cleric", "druid": "Druid", "wizard": "Wizard", 
            "sorcerer": "Sorcerer", "warlock": "Warlock", "bard": "Bard", "artificer": "Artificer"
        };
        const formattedClass = clsMap[data.className.toLowerCase()] || 
                               (data.className.charAt(0).toUpperCase() + data.className.slice(1));

        // 1. Update State
        appState.selectedClass = formattedClass;
        appState.characterLevel = parseInt(data.level);
        appState.abilityMod = parseInt(data.abilityMod);
        
        // Reset sub-selections to be safe
        appState.selectedSubclass = null;
        appState.preparedSpells = [];
        appState.usedSlots = {};

        // 2. Update Input Fields
        el.levelInput.value = appState.characterLevel;
        el.modInput.value = appState.abilityMod;

        // 3. Trigger Visual Class Button Selection
        // Find the button with the matching text and click it (or simulate click)
        const btns = el.classBtns.querySelectorAll("button");
        let found = false;
        btns.forEach(btn => {
            // Reset style first
            btn.className = buttonBase();
            if (btn.dataset.isLast === "true") btn.classList.add("col-span-2", "md:col-span-1");

            // Activate if match
            if (btn.textContent.trim() === formattedClass) {
                setActive(el.classBtns, btn);
                found = true;
            }
        });

        if (found) {
            // Check if we need to show Subclass UI or jump straight to spells
            if (renderSubclassUI(formattedClass)) {
                el.appTabs.classList.add("hidden"); 
            } else {
                el.appTabs.classList.remove("hidden");
            }
            updateUI();
            alert(`Imported: Level ${appState.characterLevel} ${formattedClass}`);
        } else {
            alert(`Class "${formattedClass}" not found in Spellbook.`);
        }

      } catch (err) {
        console.error(err);
        alert("Error reading file. Make sure it's a valid JSON export.");
      }
    };
    reader.readAsText(file);
  };
  
  updateUI();
});
