document.addEventListener("DOMContentLoaded", () => {
  
  /* --- STATE (Resets on Refresh) --- */
  let appState = {
    selectedClass: null,
    selectedSubclass: null,
    characterLevel: 1,
    abilityMod: 3, // Default +3
    activeTab: "spellbook", 
    usedSlots: {},
    preparedSpells: [] 
  };

  let selectedSpellLevel = null;

  /* --- DOM ELEMENTS --- */
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

  /* --- DATA --- */
  const classes = ["Wizard", "Cleric", "Druid", "Bard", "Sorcerer", "Paladin", "Ranger", "Artificer", "Warlock"];
  
  // Simplified icons
  const classIcons = {
    Wizard: `<path d="M4.5 2a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-1zM6 6H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm13-3l-2.5 2.5 1 4 3.5 1-3.5 1-1 4-2.5-2.5-4-1 4-1 2.5-2.5 1-4 3.5-1-3.5-1z"/>`,
    Cleric: `<circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-2.5-6.5l-1.5 1.5M6.5 17.5l-1.5 1.5M17.5 6.5l1.5-1.5M6.5 6.5l-1.5-1.5" />`,
    Druid: `<path d="M12 2L5.5 8.5a5.5 5.5 0 0 0 7.78 7.78l1.22-1.22 1.22 1.22a5.5 5.5 0 0 0 7.78-7.78L12 2z" />`,
    Bard: `<path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />`,
    Sorcerer: `<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />`,
    Paladin: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />`,
    Ranger: `<path d="M12 2l-2 6h4l-2-6zm-6 8l-2 6h4l-2-6zm12 0l-2 6h4l-2-6z" />`,
    Artificer: `<circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />`,
    Warlock: `<path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0zm10-2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />`
  };

  const subclassData = {
    Cleric: { label: "Select Divine Domain", options: ["Life", "Light", "War", "Trickery", "Tempest", "Nature", "Knowledge"] },
    Sorcerer: { label: "Select Sorcerous Origin", options: ["Draconic Bloodline", "Wild Magic", "Divine Soul", "Storm Sorcery"] },
    Warlock: { label: "Select Otherworldly Patron", options: ["The Fiend", "The Archfey", "The Great Old One", "The Hexblade"] }
  };

  // SAFETY FIX: Added empty arrays for Sorcerer to prevent crash
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

  /* --- LOGIC: LIMITS --- */
  function calculateLimit() {
    const cls = appState.selectedClass;
    const lvl = appState.characterLevel;
    const mod = appState.abilityMod;

    if (!cls) return 0;

    // Known Casters
    if (spellsKnownTable[cls]) {
      return spellsKnownTable[cls][lvl - 1];
    }
    // Prepared Casters
    if (["Wizard", "Cleric", "Druid"].includes(cls)) {
      return Math.max(1, lvl + mod);
    }
    if (cls === "Paladin") {
      return Math.max(1, Math.floor(lvl / 2) + mod);
    }
    if (cls === "Artificer") {
      return Math.max(1, Math.floor(lvl / 2) + mod);
    }
    return 99; // Fallback
  }

  /* --- TABS --- */
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
      renderSpellbookList(); // View 1
    } else {
      el.tabSpellbook.className = "tab-btn";
      el.tabTracker.className = "tab-btn active";
      el.viewSpellbook.classList.add("hidden");
      el.viewTracker.classList.remove("hidden");
      
      renderSlotTracker();
      renderCastList(); // View 2 Top
      renderSelectionList(); // View 2 Bottom
    }
  }

  /* --- SPELL PREPARATION --- */
  window.togglePrepare = function(spellName, checkbox) {
    const limit = calculateLimit();
    const currentCount = appState.preparedSpells.length;
    const isSelected = appState.preparedSpells.includes(spellName);

    if (!isSelected) {
      // Trying to add
      if (currentCount >= limit) {
        alert(`You can only prepare/know ${limit} spells at this level!`);
        checkbox.checked = false; // Undo check
        return;
      }
      appState.preparedSpells.push(spellName);
    } else {
      // Trying to remove
      const idx = appState.preparedSpells.indexOf(spellName);
      if (idx > -1) appState.preparedSpells.splice(idx, 1);
    }
    
    // Refresh UI
    renderCastList();
    renderSelectionList(); // Re-render to update counts/disabled states
  }

  /* --- SLOT LOGIC --- */
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
    renderCastList(); // Update button states
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

  /* --- RENDERERS --- */
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
      if (slots.length === 0) el.slotTracker.innerHTML = `<p class="text-xs text-muted text-center w-full">No spell slots available.</p>`;
      slots.forEach(slot => {
          const div = document.createElement("div");
          div.className = "bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col gap-2";
          div.innerHTML = `<div class="text-xs font-bold uppercase text-stone-500">Level ${slot.level}</div>`;
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

  // Helper to get filtered list
  function getSpellsForClass() {
    if (!appState.selectedClass || typeof spells === 'undefined') return [];
    
    const maxLvl = spellProgression[appState.selectedClass][appState.characterLevel - 1];
    
    // Paladin/Ranger Lvl 1 Fix
    if ((appState.selectedClass === "Paladin" || appState.selectedClass === "Ranger") && appState.characterLevel < 2) return [];

    const classSubData = subclassSpells[appState.selectedClass];
    const extraSpells = (appState.selectedSubclass && classSubData && classSubData[appState.selectedSubclass]) 
                        ? classSubData[appState.selectedSubclass] : [];

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

  // --- View 1: Spellbook (Read Only) ---
  function renderSpellbookList() {
    el.listSpellbook.innerHTML = "";
    const filtered = getSpellsForClass();
    if (filtered.length === 0) {
      el.listSpellbook.innerHTML = `<div class="text-center py-8"><p class='text-muted italic'>No spells found.</p></div>`;
      return;
    }
    filtered.forEach(spell => {
      // Just basic info card
      const card = createCardHTML(spell, "read-only");
      el.listSpellbook.appendChild(card);
    });
  }

  // --- View 2A: Cast List (Only Prepared/Auto) ---
  function renderCastList() {
    el.listTracker.innerHTML = "";
    const allSpells = getSpellsForClass();
    
    const classSubData = subclassSpells[appState.selectedClass];
    const extraSpells = (appState.selectedSubclass && classSubData && classSubData[appState.selectedSubclass]) 
                        ? classSubData[appState.selectedSubclass] : [];

    const readySpells = allSpells.filter(spell => {
      // Cantrips & Subclass spells are always ready
      if (parseInt(spell.level) === 0) return true;
      if (extraSpells.includes(spell.name)) return true;
      // Otherwise must be prepared
      return appState.preparedSpells.includes(spell.name);
    });

    if (readySpells.length === 0) {
      el.emptyTrackerMsg.classList.remove("hidden");
    } else {
      el.emptyTrackerMsg.classList.add("hidden");
      readySpells.forEach(spell => {
        const card = createCardHTML(spell, "cast");
        el.listTracker.appendChild(card);
      });
    }
  }

  // --- View 2B: Selection List (Checkboxes) ---
  function renderSelectionList() {
    el.listSelection.innerHTML = "";
    
    // Update Limit Counter
    const limit = calculateLimit();
    const current = appState.preparedSpells.length;
    el.limitDisplay.textContent = `${current}/${limit} Selected`;
    el.limitDisplay.className = current >= limit ? "text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded" : "text-xs font-bold bg-stone-100 text-stone-600 px-2 py-1 rounded";

    const allSpells = getSpellsForClass();
    const classSubData = subclassSpells[appState.selectedClass];
    const extraSpells = (appState.selectedSubclass && classSubData && classSubData[appState.selectedSubclass]) 
                        ? classSubData[appState.selectedSubclass] : [];

    // Filter out Cantrips & Subclass spells (they are auto-prepared)
    const selectableSpells = allSpells.filter(spell => {
      const isCantrip = parseInt(spell.level) === 0;
      const isAuto = extraSpells.includes(spell.name);
      return !isCantrip && !isAuto;
    });

    selectableSpells.forEach(spell => {
      const isChecked = appState.preparedSpells.includes(spell.name);
      const isFull = current >= limit;
      // Disable unchecked boxes if full
      const disabled = !isChecked && isFull;

      const div = document.createElement("div");
      div.className = "flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition";
      div.innerHTML = `
        <div class="flex items-center gap-3">
           <input type="checkbox" class="spell-checkbox" ${isChecked ? "checked" : ""} ${disabled ? "disabled" : ""} onchange="togglePrepare('${spell.name}', this)">
           <div>
             <div class="font-bold text-sm text-dark ${disabled ? 'text-stone-400' : ''}">${spell.name}</div>
             <div class="text-[10px] text-stone-500">Level ${spell.level} • ${spell.school}</div>
           </div>
        </div>
      `;
      el.listSelection.appendChild(div);
    });
  }

  function createCardHTML(spell, type) {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl p-5 border border-stone-200 shadow-sm transition duration-200";
    const spellLvl = parseInt(spell.level);
    const isCantrip = spellLvl === 0;
    
    let action = "";
    
    if (type === "cast") {
       let canCast = isCantrip;
       if (!isCantrip) {
          const slots = calculateSlots(appState.selectedClass, appState.characterLevel);
          // Simple check if ANY slot available >= level
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
       const btnClass = canCast ? "bg-accent text-white hover:bg-sky-600" : "bg-stone-100 text-stone-400 cursor-not-allowed";
       action = isCantrip 
         ? `<span class="text-xs font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded">Cantrip</span>`
         : `<button onclick="castSpell(${spell.level})" class="px-4 py-1 rounded-full text-xs font-bold transition ${btnClass}" ${!canCast ? 'disabled' : ''}>Cast</button>`;
    } else {
       // Read only
       action = `<span class="text-xs font-bold text-stone-400">Ref</span>`;
    }

    // Highlight Mechanic
    const desc = spell.effect
      .replace(/\b(\d*d\d+)\b/g, m => `<span class="bg-stone-100 text-dark font-bold px-1.5 py-0.5 rounded border border-stone-200 text-xs">${m}</span>`)
      .replace(/\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+Save\b/gi, (match, ability) => {
          const short = ability.substring(0,3).toUpperCase();
          return `<span class="text-accent font-bold uppercase text-xs tracking-wider">${short} Save</span>`;
      });

    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-start">
            <div class="flex flex-col">
                <h3 class="text-lg font-bold text-dark flex items-center gap-2">${spell.name}</h3>
                <span class="text-xs font-bold text-stone-400">${isCantrip ? "Cantrip" : "Level " + spell.level}</span>
            </div>
            ${action}
        </div>
        <div class="text-xs text-stone-500 font-medium flex flex-wrap gap-2 items-center">
          <span class="bg-stone-50 px-2 py-1 rounded border border-stone-100">${spell.castingTime}</span>
          <span>•</span>
          <span class="bg-stone-50 px-2 py-1 rounded border border-stone-100">${spell.range}</span>
          <span>•</span>
          <span class="bg-stone-50 px-2 py-1 rounded border border-stone-100">${spell.duration}</span>
        </div>
        <p class="text-sm mt-1 text-stone-600 leading-relaxed">${desc}</p>
      </div>`;
    return card;
  }

  /* --- UI UPDATES & INIT --- */
  function updateUI() {
    el.levelInput.value = appState.characterLevel;
    el.btnMinus.disabled = appState.characterLevel <= 1;
    el.btnPlus.disabled = appState.characterLevel >= 20;
    
    // Milestones
    const milestones = { 1: "Class Features", 4: "ASI", 8: "ASI", 12: "ASI", 16: "ASI", 19: "ASI" };
    el.milestone.textContent = milestones[appState.characterLevel] || "";
    
    // Spells Known Text
    if (!appState.selectedClass) return;
    const limit = calculateLimit();
    el.known.innerHTML = `<strong>Max Spells:</strong> ${limit}`;

    // Filters
    buildSpellLevelButtons();
    
    // Tabs
    renderTabs();
  }

  function renderSubclassUI(cls) {
    const data = subclassData[cls];
    if (!data) { el.subSection.classList.add("hidden"); return false; }
    el.subSection.classList.remove("hidden");
    el.subTitle.textContent = data.label;
    el.subBtns.innerHTML = "";
    if (!appState.selectedSubclass) { el.appTabs.classList.add("hidden"); }
    data.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "px-3 py-2 rounded-lg text-xs font-bold shadow-sm border border-b-2 select-none bg-white text-stone-600 border-stone-200 hover:border-accent hover:text-accent hover:shadow transition-all duration-200";
      if (appState.selectedSubclass === opt) btn.className = "px-3 py-2 rounded-lg text-xs font-bold shadow-md bg-accent text-white border-b-4 border-sky-600 transform -translate-y-0.5 transition-all duration-200 select-none";
      btn.onclick = () => {
        appState.selectedSubclass = opt;
        // No Save
        renderSubclassUI(cls); 
        el.appTabs.classList.remove("hidden");
        updateUI(); 
      };
      el.subBtns.appendChild(btn);
    });
    return true;
  }

  function buttonBase() { return `w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold shadow-sm border border-b-2 select-none bg-white text-stone-600 border-stone-200 hover:border-accent hover:text-accent hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`; }
  
  function setActive(container, activeBtn) {
    [...container.children].forEach(btn => {
      btn.className = buttonBase();
      if (btn.dataset.isLast === "true") btn.classList.add("col-span-2", "md:col-span-1");
      const svg = btn.querySelector("svg");
      if (svg) svg.classList.remove("text-white");
    });
    activeBtn.className = `w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold shadow-md bg-accent text-white border-b-4 border-sky-600 transform -translate-y-0.5 transition-all duration-200 select-none`;
    if (activeBtn.dataset.isLast === "true") activeBtn.classList.add("col-span-2", "md:col-span-1");
  }

  classes.forEach((cls, index) => {
    const btn = document.createElement("button");
    const iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${classIcons[cls] || '<circle cx="12" cy="12" r="10" />'}</svg>`;
    btn.innerHTML = `${iconHtml} <span>${cls}</span>`;
    btn.className = buttonBase();
    if (index === classes.length - 1) { btn.dataset.isLast = "true"; btn.classList.add("col-span-2", "md:col-span-1"); }
    btn.onclick = () => {
      appState.selectedClass = cls;
      appState.selectedSubclass = null; 
      // Reset prepared on class change
      appState.preparedSpells = [];
      appState.usedSlots = {};
      
      setActive(el.classBtns, btn);
      
      const needsSub = renderSubclassUI(cls);
      if (!needsSub) el.appTabs.classList.remove("hidden");
      else el.appTabs.classList.add("hidden"); 
      
      updateUI();
    };
    el.classBtns.appendChild(btn);
  });

  // Events
  el.levelInput.addEventListener("change", (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1; if (val > 20) val = 20;
    appState.characterLevel = val; updateUI();
  });
  el.modInput.addEventListener("change", (e) => {
    let val = parseInt(e.target.value);
    appState.abilityMod = val; updateUI();
  });
  el.btnMinus.onclick = () => { if (appState.characterLevel > 1) { appState.characterLevel--; updateUI(); }};
  el.btnPlus.onclick = () => { if (appState.characterLevel < 20) { appState.characterLevel++; updateUI(); }};
  el.btnRest.onclick = () => { if(confirm("Take a Long Rest?")) { appState.usedSlots = {}; renderSlotTracker(); renderCastList(); }};

  function setFilterActive(container, activeBtn) {
     [...container.children].forEach(btn => { 
       btn.className = "px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-b-2 select-none bg-white text-stone-600 border-stone-200 hover:border-accent hover:text-accent hover:shadow transition-all duration-200"; 
     });
     activeBtn.className = `px-4 py-2 rounded-lg text-sm font-bold shadow-md bg-accent text-white border-b-4 border-sky-600 transform -translate-y-0.5 transition-all duration-200 select-none`;
  }

  function buildSpellLevelButtons() {
    [el.filter1, el.filter2].forEach(container => {
        if(!container) return;
        container.innerHTML = "";
        if (!appState.selectedClass) return;
        const maxSpellLevel = spellProgression[appState.selectedClass][appState.characterLevel - 1];
        
        const allBtn = document.createElement("button");
        allBtn.textContent = "All";
        allBtn.className = "px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-b-2 select-none bg-white text-stone-600 border-stone-200 hover:border-accent hover:text-accent hover:shadow transition-all duration-200";
        allBtn.onclick = () => { selectedSpellLevel = null; setFilterActive(container, allBtn); renderTabs(); };
        container.appendChild(allBtn);

        for (let i = 0; i <= maxSpellLevel; i++) {
          const btn = document.createElement("button");
          btn.textContent = i === 0 ? "Cantrip" : `Level ${i}`;
          btn.className = "px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-b-2 select-none bg-white text-stone-600 border-stone-200 hover:border-accent hover:text-accent hover:shadow transition-all duration-200";
          btn.onclick = () => { selectedSpellLevel = i; setFilterActive(container, btn); renderTabs(); };
          container.appendChild(btn);
        }
    });
  }

  updateUI();
});