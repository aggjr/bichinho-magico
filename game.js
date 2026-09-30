(() => {
  "use strict";

  const DEMO = {
    dayLengthMs: 120_000,
    growthIntervalMs: 45_000,
    idealMin: 48,
    idealMax: 66,
    hatchSeconds: 4,
  };

  const ART = "assets/pets/";
  const STAGE_LABELS = ["Ovo", "Bebê", "Criança", "Jovem", "Adulto"];
  const STAGE_SCALE = [1, 0.8, 0.87, 0.94, 1];

  // focus: necessidades candidatas a serem dobradas (1 ou 2 sorteadas ao nascer)
  // growthMs: tempo base por fase (já mais lento para a criança aproveitar)
  const SPECIES = [
    {
      id: "unicorn", ready: true, name: "Unicórnio", he: "ela", names: ["Luna"],
      food: "🍓", foodName: "morango", glow: "rgba(230,180,255,.6)",
      stages: { 1: "newborn", 2: "baby", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall"], skit: "wobble", adultSkit: "rear",
      sleepStages: ["child", "adult"],
      focus: ["love", "energy"],
      profile: { hunger: 0.9, thirst: 0.9, hygiene: 0.75, love: 1.2, energy: 1.05, growthMs: 80_000 },
    },
    {
      id: "dino", ready: true, name: "Dinossauro", he: "ele", names: ["Freely"],
      food: "🍉", foodName: "melancia", glow: "rgba(170,255,190,.55)",
      stages: { 1: "newborn", 2: "baby", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "fly"], skit: "fly", childSkit: "fly",
      sleepStages: ["child", "adult"],
      focus: ["hunger", "thirst"],
      profile: { hunger: 1.15, thirst: 1.05, hygiene: 1.0, love: 0.95, energy: 1.0, growthMs: 70_000 },
    },
    {
      id: "kitty", ready: true, name: "Gatinho", he: "ele", names: ["Flofy"],
      food: "🐟", foodName: "peixinho", glow: "rgba(255,190,120,.6)",
      stages: { 1: "newborn", 2: "baby", 3: "child", 4: "child" },
      poses: ["plead", "eat", "sleep", "fall", "bed"], skit: "bed",
      sleepStages: ["child"],
      focus: ["love", "energy"],
      profile: { hunger: 0.95, thirst: 0.9, hygiene: 0.85, love: 1.15, energy: 1.1, growthMs: 75_000 },
    },
    {
      id: "duck", ready: true, name: "Patinho", he: "ele", names: ["Tobi"],
      food: "🌽", foodName: "milhinho", glow: "rgba(255,230,100,.65)",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "fly"], skit: "fly", childSkit: "fly",
      sleepStages: ["child", "adult"],
      focus: ["thirst", "hygiene"],
      profile: { hunger: 1.0, thirst: 1.15, hygiene: 1.1, love: 1.0, energy: 0.95, growthMs: 72_000 },
    },
    {
      id: "pig", ready: true, name: "Porquinho", he: "ele", names: ["Pigma"],
      food: "🍎", foodName: "maçã", glow: "rgba(255,190,170,.65)",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "mud"], skit: "mud",
      sleepStages: ["child", "adult"],
      focus: ["hygiene", "hunger"],
      profile: { hunger: 1.1, thirst: 1.0, hygiene: 1.2, love: 1.0, energy: 0.9, growthMs: 74_000 },
    },
    {
      id: "mole", ready: true, name: "Toupeira", he: "ela", names: ["Toty"],
      food: "🍄", foodName: "cogumelinho", glow: "rgba(210,170,120,.6)",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "dig"], skit: "dig",
      sleepStages: ["child", "adult"],
      focus: ["hygiene", "love"],
      profile: { hunger: 1.05, thirst: 1.0, hygiene: 1.15, love: 1.05, energy: 1.0, growthMs: 76_000 },
    },
    {
      id: "racer", ready: true, name: "Carrinho", he: "ele", names: ["Turbo"],
      food: "🔧", foodName: "peçinhas", glow: "rgba(255,120,100,.65)",
      diet: "machine",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "turbo"], skit: "turbo", childSkit: "turbo", adultSkit: "turbo",
      sleepStages: ["child", "adult"],
      focus: ["hunger", "thirst"],
      profile: { hunger: 1.2, thirst: 1.25, hygiene: 1.1, love: 1.0, energy: 1.05, growthMs: 78_000 },
    },
    {
      id: "botcar", ready: true, name: "Transformers", he: "ele", names: ["Bolt"],
      food: "🔩", foodName: "parafusos", glow: "rgba(120,180,255,.65)",
      diet: "machine",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "car"], skit: "transform", childSkit: "transform", adultSkit: "transform",
      sleepStages: ["child", "adult"],
      focus: ["hunger", "energy"],
      profile: { hunger: 1.15, thirst: 1.2, hygiene: 0.85, love: 0.95, energy: 1.15, growthMs: 82_000 },
    },
    {
      id: "rocket", ready: true, name: "Foguete", he: "ele", names: ["Foguinho"],
      food: "🔧", foodName: "peçinhas", glow: "rgba(255,140,100,.65)",
      diet: "machine",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "launch"], skit: "launch", childSkit: "launch", adultSkit: "launch",
      focus: ["hunger", "energy"],
      profile: { hunger: 1.15, thirst: 1.2, hygiene: 0.9, love: 1.0, energy: 1.2, growthMs: 80_000 },
    },
    {
      id: "heli", ready: true, name: "Helicóptero", he: "ele", names: ["Hélio"],
      food: "🔩", foodName: "parafusos", glow: "rgba(100,180,255,.65)",
      diet: "machine",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "hover"], skit: "hover", childSkit: "hover", adultSkit: "hover",
      focus: ["thirst", "energy"],
      profile: { hunger: 1.1, thirst: 1.2, hygiene: 1.0, love: 1.0, energy: 1.15, growthMs: 78_000 },
    },
    {
      id: "train", ready: true, name: "Trem", he: "ele", names: ["Chuflinho"],
      food: "🔧", foodName: "peçinhas", glow: "rgba(255,100,100,.65)",
      diet: "machine",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "chug"], skit: "chug", childSkit: "chug", adultSkit: "chug",
      focus: ["hunger", "thirst"],
      profile: { hunger: 1.2, thirst: 1.15, hygiene: 1.05, love: 0.95, energy: 1.1, growthMs: 82_000 },
    },
    {
      id: "tractor", ready: true, name: "Trator", he: "ele", names: ["Toto"],
      food: "🔩", foodName: "parafusos", glow: "rgba(255,180,80,.65)",
      diet: "machine",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "plough"], skit: "plough", childSkit: "plough", adultSkit: "plough",
      focus: ["hygiene", "hunger"],
      profile: { hunger: 1.15, thirst: 1.15, hygiene: 1.25, love: 1.0, energy: 1.05, growthMs: 80_000 },
    },
    {
      id: "boat", ready: true, name: "Barco", he: "ele", names: ["Marinho"],
      food: "🔧", foodName: "peçinhas", glow: "rgba(80,200,200,.65)",
      diet: "machine",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "sail"], skit: "sail", childSkit: "sail", adultSkit: "sail",
      focus: ["thirst", "hygiene"],
      profile: { hunger: 1.05, thirst: 1.2, hygiene: 1.15, love: 1.05, energy: 1.0, growthMs: 76_000 },
    },
    {
      id: "plane", ready: true, name: "Avião", he: "ele", names: ["Asinha"],
      food: "🔩", foodName: "parafusos", glow: "rgba(120,190,255,.65)",
      diet: "machine",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "fall", "loop"], skit: "loop", childSkit: "loop", adultSkit: "loop",
      focus: ["energy", "hunger"],
      profile: { hunger: 1.1, thirst: 1.15, hygiene: 0.95, love: 1.0, energy: 1.2, growthMs: 78_000 },
    },
    {
      id: "slime", ready: true, name: "Slime", he: "ele", names: ["Goo"],
      food: "🍮", foodName: "geleinha", glow: "rgba(120,200,255,.65)",
      stages: { 1: "newborn", 2: "newborn", 3: "child", 4: "adult" },
      poses: ["plead", "eat", "sleep", "bounce"], skit: "bounce", childSkit: "bounce", adultSkit: "bounce",
      focus: ["hunger", "love"],
      profile: { hunger: 1.2, thirst: 1.1, hygiene: 0.7, love: 1.15, energy: 1.05, growthMs: 74_000 },
      variants: {
        blue: { he: "ele", names: ["Azulito", "Goo"], glow: "rgba(100,180,255,.65)" },
        green: { he: "ele", names: ["Verde", "Blob"], glow: "rgba(90,210,120,.65)" },
        pink: { he: "ela", names: ["Rosa", "Melly"], glow: "rgba(255,150,200,.65)" },
        lilac: { he: "ela", names: ["Lila", "Puff"], glow: "rgba(200,160,255,.65)" },
      },
    },
    {
      id: "bunny", name: "Coelhinha", he: "ela", names: ["Algodão", "Pipoca"],
      food: "🥕", foodName: "cenoura", glow: "rgba(255,210,230,.6)",
      stages: { 1: "baby", 2: "baby", 3: "child", 4: "adult" }, poses: [],
      focus: ["hunger", "love"],
      profile: { hunger: 1.15, thirst: 1.0, hygiene: 0.8, love: 1.1, energy: 1.0, growthMs: 70_000 },
    },
    {
      id: "robot", name: "Robôzinho", he: "ele", names: ["Bip", "Chip"],
      food: "🔋", foodName: "bateria", glow: "rgba(120,240,255,.6)",
      stages: { 1: "baby", 2: "baby", 3: "child", 4: "adult" }, poses: [],
      focus: ["hunger", "energy"],
      profile: { hunger: 1.2, thirst: 0.5, hygiene: 0.4, love: 0.9, energy: 1.15, growthMs: 78_000 },
    },
    {
      id: "hamster", name: "Hamster", he: "ele", names: ["Bolinha", "Paçoca"],
      food: "🌻", foodName: "semente", glow: "rgba(255,210,140,.6)",
      stages: { 1: "baby", 2: "baby", 3: "child", 4: "adult" }, poses: [],
      focus: ["hunger", "energy"],
      profile: { hunger: 1.2, thirst: 1.05, hygiene: 1.0, love: 1.05, energy: 1.1, growthMs: 68_000 },
    },
    {
      id: "panda", name: "Panda", he: "ele", names: ["Mochi", "Bambu"],
      food: "🎋", foodName: "bambu", glow: "rgba(255,255,255,.6)",
      stages: { 1: "baby", 2: "baby", 3: "child", 4: "child" }, poses: [],
      focus: ["hunger", "energy"],
      profile: { hunger: 1.2, thirst: 1.0, hygiene: 0.9, love: 1.0, energy: 1.1, growthMs: 90_000 },
    },
    {
      id: "puppy", name: "Cachorrinho", he: "ele", names: ["Mel", "Toby"],
      food: "🦴", foodName: "ossinho", glow: "rgba(255,210,150,.6)",
      stages: { 1: "baby", 2: "baby", 3: "child", 4: "child" }, poses: [],
      focus: ["love", "energy"],
      profile: { hunger: 1.05, thirst: 1.05, hygiene: 1.05, love: 1.2, energy: 1.1, growthMs: 72_000 },
    },
    {
      id: "dragon", name: "Dragãozinho", he: "ele", names: ["Faísca", "Draco"],
      food: "🌶️", foodName: "pimentinha", glow: "rgba(255,150,120,.6)",
      stages: { 1: "baby", 2: "baby", 3: "child", 4: "child" }, poses: [],
      focus: ["hunger", "thirst"],
      profile: { hunger: 1.25, thirst: 1.2, hygiene: 1.0, love: 1.0, energy: 1.05, growthMs: 85_000 },
    },
    {
      id: "fox", name: "Raposinha", he: "ela", names: ["Canela", "Floco"],
      food: "🫐", foodName: "frutinha", glow: "rgba(255,170,90,.6)",
      stages: { 1: "baby", 2: "baby", 3: "child", 4: "child" }, poses: [],
      focus: ["energy", "hunger"],
      profile: { hunger: 1.05, thirst: 1.0, hygiene: 0.95, love: 0.9, energy: 1.15, growthMs: 74_000 },
    },
  ];

  const BASE_RATES = { hunger: 0.38, thirst: 0.42, hygiene: 0.18, love: 0.3, energy: 0.24 };

  const TRAIT_LINES = {
    hunger: { icon: "🍎", text: "Eu sinto muita fome!" },
    thirst: { icon: "💧", text: "Eu preciso beber muita água!" },
    hygiene: { icon: "🛁", text: "Eu me sujo muito!" },
    love: { icon: "💗", text: "Eu preciso de muito carinho!" },
    energy: { icon: "🌙", text: "Eu preciso dormir muito!" },
  };

  const TRAIT_LINES_MACHINE = {
    hunger: { icon: "🔧", text: "Eu preciso de muitas peças!" },
    thirst: { icon: "⛽", text: "Eu preciso de muito óleo!" },
    hygiene: { icon: "🧽", text: "Eu fico bem enlameado!" },
    love: { icon: "💗", text: "Eu preciso de muito carinho!" },
    energy: { icon: "🔋", text: "Eu preciso recarregar muito!" },
  };

  const NEEDS = {
    hunger: { key: "2", icon: "🍓", text: (p) => `${p} está com fome! Aperte 🍓 Comer` },
    thirst: { key: "3", icon: "💧", text: (p) => `${p} está com sede! Aperte 💧 Beber` },
    hygiene: { key: "4", icon: "🛁", text: (p) => `${p} está sujinho! Aperte 🛁 Banho` },
    love: { key: "5", icon: "💗", text: (p) => `${p} quer colo! Aperte 🤗 Carinho` },
    energy: { key: "6", icon: "🌙", text: (p) => `${p} está com soninho… Aperte 🌙 Dormir` },
  };

  const NEEDS_MACHINE = {
    hunger: { key: "2", icon: "🔧", text: (p) => `${p} precisa de peças! Aperte 🔧 Peças` },
    thirst: { key: "3", icon: "⛽", text: (p) => `${p} precisa de óleo! Aperte ⛽ Óleo` },
    hygiene: { key: "4", icon: "🧽", text: (p) => `${p} está sujo de lama! Aperte 🛁 Banho` },
    love: { key: "5", icon: "💗", text: (p) => `${p} quer colo! Aperte 🤗 Carinho` },
    energy: { key: "6", icon: "🔋", text: (p) => `${p} precisa recarregar… Aperte 🌙 Dormir` },
  };

  function isMachine() {
    return state.species?.diet === "machine";
  }
  function needsMap() {
    return isMachine() ? NEEDS_MACHINE : NEEDS;
  }
  function traitLines() {
    return isMachine() ? TRAIT_LINES_MACHINE : TRAIT_LINES;
  }

  const $ = (id) => document.getElementById(id);
  const el = {
    app: $("app"), fx: $("fx"), avatar: $("avatar"), petName: $("petName"), petStage: $("petStage"),
    traitBanner: $("traitBanner"),
    clockIcon: $("clockIcon"), clockTime: $("clockTime"),
    actor: $("actor"), actorMove: $("actorMove"), actorImg: $("actorImg"), actorFx: $("actorFx"), actorGlow: $("actorGlow"),
    bubble: $("bubble"), wish: $("wish"), wishIcon: $("wishIcon"), guide: $("guide"),
    thermoLabel: $("thermoLabel"), thermoKnob: $("thermoKnob"), hatchFill: $("hatchFill"), thermoHint: $("thermoHint"),
    btn1Icon: $("btn1Icon"), btn1Text: $("btn1Text"),
    growthFill: $("growthFill"), growthSteps: $("growthSteps"), flash: $("flash"), projectiles: $("projectiles"),
  };
  const buttons = Object.fromEntries([...document.querySelectorAll(".btn")].map((b) => [b.dataset.key, b]));
  const gauges = Object.fromEntries([...document.querySelectorAll(".gauge")].map((g) => [g.dataset.need, g]));

  const state = {
    phase: "egg", stage: 0, species: null, name: "",
    temp: 22, rubbing: false, idealMs: 0, eggCrack: 0,
    needs: { hunger: 80, thirst: 80, hygiene: 85, love: 75, energy: 90 },
    over: { hunger: 0, thirst: 0, hygiene: 0, love: 0 },
    mood: "neutral", moodLock: 0, sleeping: false,
    pose: null, busy: false, nextSkit: Infinity,
    growthIntervalMs: DEMO.growthIntervalMs, lackMs: 0,
    boosts: { hunger: 1, thirst: 1, hygiene: 1, love: 1, energy: 1 },
    strongTraits: [],
    hatchBag: [],
    variant: null,
    dayStart: performance.now(), lastGrowth: performance.now(), last: performance.now(),
    fxTimer: 0, preview: null,
  };

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function readySpecies() {
    return SPECIES.filter((s) => s.ready);
  }

  // Sorteio justo: todos os bichinhos liberados saem uma vez antes de repetir.
  function pickHatchSpecies() {
    const ready = readySpecies();
    if (!ready.length) return SPECIES[0];
    if (!state.hatchBag.length) {
      state.hatchBag = ready.map((s) => s.id);
      // Embaralha
      for (let i = state.hatchBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.hatchBag[i], state.hatchBag[j]] = [state.hatchBag[j], state.hatchBag[i]];
      }
    }
    const id = state.hatchBag.pop();
    try {
      localStorage.setItem("bichinho-hatch-bag", JSON.stringify(state.hatchBag));
    } catch (_) { /* ignore */ }
    return ready.find((s) => s.id === id) || ready[0];
  }

  try {
    const saved = JSON.parse(localStorage.getItem("bichinho-hatch-bag") || "[]");
    if (Array.isArray(saved)) state.hatchBag = saved.filter((id) => readySpecies().some((s) => s.id === id));
  } catch (_) { /* ignore */ }

  function rollStrongTraits(sp) {
    const pool = [...(sp.focus || ["hunger", "love"])];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const count = Math.random() < 0.45 ? 1 : 2;
    const picked = pool.slice(0, Math.min(count, pool.length));
    const boosts = { hunger: 1, thirst: 1, hygiene: 1, love: 1, energy: 1 };
    picked.forEach((k) => { boosts[k] = 2; });
    const lines = traitLinesFor(sp);
    return {
      boosts,
      strongTraits: picked,
      phrases: picked.map((k) => lines[k]),
    };
  }

  function traitLinesFor(sp) {
    return sp?.diet === "machine" ? TRAIT_LINES_MACHINE : TRAIT_LINES;
  }

  function traitBannerText() {
    if (!state.strongTraits?.length) return "";
    const lines = traitLines();
    return state.strongTraits
      .map((k) => `${lines[k].icon} ${lines[k].text}`)
      .join("  ·  ");
  }

  function applyDietUI() {
    const machine = isMachine();
    const hungerIcon = machine ? "🔧" : (state.species?.food || "🍓");
    const thirstIcon = machine ? "⛽" : "💧";
    const $ih = $("iconHunger"); const $lh = $("labelHunger");
    const $it = $("iconThirst"); const $lt = $("labelThirst");
    const $b2i = $("btn2Icon"); const $b2t = $("btn2Text");
    const $b3i = $("btn3Icon"); const $b3t = $("btn3Text");
    if ($ih) $ih.textContent = hungerIcon;
    if ($lh) $lh.textContent = machine ? "Peças" : "Fome";
    if ($it) $it.textContent = thirstIcon;
    if ($lt) $lt.textContent = machine ? "Óleo" : "Sede";
    if ($b2i) $b2i.textContent = hungerIcon;
    if ($b2t) $b2t.textContent = machine ? "Peças" : "Comer";
    if ($b3i) $b3i.textContent = thirstIcon;
    if ($b3t) $b3t.textContent = machine ? "Óleo" : "Beber";
  }

  function renderTraitBanner() {
    if (!el.traitBanner) return;
    if (state.phase !== "pet" || !state.strongTraits?.length) {
      el.traitBanner.hidden = true;
      return;
    }
    el.traitBanner.hidden = false;
    el.traitBanner.textContent = traitBannerText();
  }

  // ---------- Art selection ----------
  function hasPose(pose) {
    if (!state.species?.poses?.includes(pose)) return false;
    // Poses especiais de máquina / slime valem em qualquer fase
    if (["car", "turbo", "launch", "hover", "chug", "plough", "sail", "loop", "bounce"].includes(pose)) return true;
    return state.stage === 1;
  }
  function artKey(sp) {
    if (sp?.variants && state.variant) return `${sp.id}_${state.variant}`;
    return sp.id;
  }
  function baseArt(sp, stage) {
    return `${ART}${artKey(sp)}_${sp.stages[stage]}.webp`;
  }
  function sleepArt(sp, stage) {
    const key = sp.stages[stage];
    const ak = artKey(sp);
    if ((sp.sleepStages || []).includes(key)) return `${ART}${ak}_${key}_sleep.webp`;
    if (sp.poses.includes("sleep")) return `${ART}${ak}_sleep.webp`;
    return null;
  }
  function wantsSomething() {
    const n = state.needs;
    return n.hunger < 40 || n.thirst < 40 || n.love < 40 || n.hygiene < 30;
  }
  function currentArt() {
    const sp = state.species;
    const ak = artKey(sp);
    if (state.sleeping) {
      const s = sleepArt(sp, state.stage);
      if (s) return s;
    }
    if (state.pose && hasPose(state.pose)) return `${ART}${ak}_${state.pose}.webp`;
    if (!state.busy && state.mood !== "mad" && wantsSomething() && hasPose("plead")) return `${ART}${ak}_plead.webp`;
    return baseArt(sp, state.stage);
  }
  function preload(sp) {
    const variants = sp.variants ? Object.keys(sp.variants) : [null];
    variants.forEach((v) => {
      const prev = state.variant;
      if (v) state.variant = v;
      const ak = artKey(sp);
      const list = [1, 2, 3, 4].map((s) => baseArt(sp, s))
        .concat(sp.poses.map((p) => `${ART}${ak}_${p}.webp`))
        .concat((sp.sleepStages || []).map((k) => `${ART}${ak}_${k}_sleep.webp`));
      list.forEach((src) => { const i = new Image(); i.src = src; });
      state.variant = prev;
    });
  }

  function pickVariant(sp) {
    if (!sp?.variants) return null;
    const q = new URLSearchParams(location.search);
    const forced = q.get("color") || q.get("variant");
    if (forced && sp.variants[forced]) return forced;
    return pick(Object.keys(sp.variants));
  }
  function applyVariant(sp, variant) {
    state.variant = variant;
    if (!variant || !sp?.variants?.[variant]) return;
    const v = sp.variants[variant];
    sp.he = v.he || sp.he;
    if (v.glow) sp.glow = v.glow;
  }

  // ---------- Particles ----------
  const ctx = el.fx.getContext("2d");
  const motes = [];
  function resizeFx() {
    const r = el.fx.getBoundingClientRect();
    el.fx.width = r.width * devicePixelRatio;
    el.fx.height = r.height * devicePixelRatio;
  }
  function spawnMote(isBurst = false, x, y) {
    const w = el.fx.width, h = el.fx.height, d = devicePixelRatio;
    motes.push({
      x: x ?? Math.random() * w, y: y ?? h * (0.35 + Math.random() * 0.6),
      vx: (Math.random() - 0.5) * (isBurst ? 6 : 0.4) * d,
      vy: (isBurst ? -Math.random() * 6 : -Math.random() * 0.5 - 0.1) * d,
      r: (isBurst ? 2 + Math.random() * 3 : 1 + Math.random() * 2.2) * d,
      life: 0, max: isBurst ? 60 + Math.random() * 40 : 240 + Math.random() * 200,
      hue: isBurst ? 40 + Math.random() * 300 : 45 + Math.random() * 20, burst: isBurst,
    });
  }
  for (let i = 0; i < 40; i++) spawnMote();
  function drawFx() {
    ctx.clearRect(0, 0, el.fx.width, el.fx.height);
    ctx.globalCompositeOperation = "lighter";
    const night = el.app.dataset.period === "night";
    for (let i = motes.length - 1; i >= 0; i--) {
      const m = motes[i];
      m.life++;
      m.x += m.vx + Math.sin((m.life + i * 20) / 40) * 0.3;
      m.y += m.vy;
      if (m.burst) m.vy += 0.08 * devicePixelRatio;
      const a = Math.sin(Math.PI * (m.life / m.max)) * (night ? 1 : 0.7);
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
      g.addColorStop(0, `hsla(${m.hue},100%,85%,${a})`);
      g.addColorStop(1, `hsla(${m.hue},100%,70%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
      ctx.fill();
      if (m.life >= m.max) { motes.splice(i, 1); if (!m.burst) spawnMote(); }
    }
    ctx.globalCompositeOperation = "source-over";
  }
  function burst(n = 60, yFrac = 0.55) {
    const r = el.actor.getBoundingClientRect(), f = el.fx.getBoundingClientRect();
    const cx = (r.left + r.width / 2 - f.left) * devicePixelRatio;
    const cy = (r.top + r.height * yFrac - f.top) * devicePixelRatio;
    for (let i = 0; i < n; i++) spawnMote(true, cx, cy);
  }

  // ---------- DOM FX ----------
  function fx(cls, content, o = {}) {
    const n = document.createElement("span");
    n.className = `fx ${cls}`;
    n.textContent = content || "";
    n.style.left = `${o.x ?? 50}%`;
    n.style.top = `${o.y ?? 40}%`;
    if (o.dx != null) n.style.setProperty("--dx", `${o.dx}px`);
    if (o.rot != null) n.style.setProperty("--rot", `${o.rot}deg`);
    if (o.size) n.style.setProperty("--s", `${o.size}px`);
    if (o.font) n.style.fontSize = o.font;
    el.actorFx.appendChild(n);
    setTimeout(() => n.remove(), o.ttl ?? 2600);
  }
  function rain(symbols, count = 6, cls = "float", yMin = 30) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => fx(cls, pick(symbols), {
        x: 25 + Math.random() * 50, y: yMin + Math.random() * 30,
        dx: (Math.random() - 0.5) * 120, rot: (Math.random() - 0.5) * 40,
      }), i * 90);
    }
  }
  function say(text, ms = 2200) {
    el.bubble.hidden = false;
    el.bubble.textContent = text;
    el.bubble.style.animation = "none";
    void el.bubble.offsetWidth;
    el.bubble.style.animation = "";
    clearTimeout(say.t);
    say.t = setTimeout(() => (el.bubble.hidden = true), ms);
  }
  function flash() {
    el.flash.classList.remove("go");
    void el.flash.offsetWidth;
    el.flash.classList.add("go");
  }
  function playMove(cls, ms) {
    el.actorMove.className = "actor-move";
    void el.actorMove.offsetWidth;
    el.actorMove.classList.add(cls);
    return wait(ms);
  }

  // Emoji flies from a button to the pet's mouth.
  function throwTo(fromKey, emoji, ms = 700) {
    const dev = el.app.getBoundingClientRect();
    const b = buttons[fromKey].getBoundingClientRect();
    const a = el.actorImg.getBoundingClientRect();
    const n = document.createElement("span");
    n.className = "projectile";
    n.textContent = emoji;
    el.projectiles.appendChild(n);
    const x0 = b.left + b.width / 2 - dev.left - 24, y0 = b.top - dev.top;
    const scale = STAGE_SCALE[state.stage];
    const x1 = a.left + a.width / 2 - dev.left - 24;
    const y1 = a.bottom - dev.top - a.height * scale * 0.62;
    n.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(0.6) rotate(0deg)` },
      { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 120}px) scale(1.3) rotate(180deg)`, offset: 0.5 },
      { transform: `translate(${x1}px, ${y1}px) scale(0.5) rotate(340deg)`, opacity: 0.2 },
    ], { duration: ms, easing: "cubic-bezier(.3,.7,.4,1)" });
    return wait(ms - 40).then(() => n.remove());
  }

  function setMood(m, lockMs = 0) {
    if (state.mood !== m) {
      state.mood = m;
      el.actor.dataset.mood = m;
      if (m === "happy") { el.actorImg.style.animation = "none"; void el.actorImg.offsetWidth; el.actorImg.style.animation = ""; }
    }
    if (lockMs) state.moodLock = performance.now() + lockMs;
  }

  // ---------- Rendering ----------
  function renderActor() {
    if (state.phase === "egg" || state.phase === "hatching") {
      const crack = state.eggCrack || 0;
      el.actorImg.src = crack <= 0 ? `${ART}egg.webp`
        : crack === 1 ? `${ART}egg_crack1.webp`
        : crack === 2 ? `${ART}egg_crack2.webp`
        : crack === 3 ? `${ART}egg_crack3.webp`
        : `${ART}egg_broken.webp`;
      el.actorImg.style.scale = "1";
      return;
    }
    const src = currentArt();
    if (!el.actorImg.src.endsWith(src)) el.actorImg.src = src;
    el.actorImg.style.scale = String(STAGE_SCALE[state.stage]);
    el.actorGlow.style.background = `radial-gradient(circle at 50% 80%, ${state.species.glow}, transparent 60%)`;
  }
  function renderHeader() {
    if (!state.species) return;
    el.avatar.style.backgroundImage = `url(${baseArt(state.species, 1)})`;
    el.petName.textContent = state.name;
    el.petStage.textContent = `${state.species.name} · ${STAGE_LABELS[state.stage]}`;
    applyDietUI();
    renderTraitBanner();
  }
  function renderGrowth(frac = 0) {
    el.growthFill.style.width = `${clamp(((state.stage + frac) / 4) * 100, 0, 100)}%`;
    el.growthSteps.querySelectorAll("li").forEach((li) => {
      const i = Number(li.dataset.i);
      li.classList.toggle("done", i < state.stage);
      li.classList.toggle("now", i === state.stage);
    });
  }
  function renderNeeds() {
    for (const [k, g] of Object.entries(gauges)) {
      const v = state.needs[k];
      g.style.setProperty("--v", (v / 100).toFixed(3));
      g.classList.toggle("low", v < 35 && v >= 18);
      g.classList.toggle("crit", v < 18);
    }
  }
  function renderEgg() {
    const t = state.temp;
    el.thermoKnob.style.left = `${t}%`;
    const heat = clamp((t - 30) / 60, 0, 1), cold = clamp((40 - t) / 30, 0, 1);
    el.actorImg.style.filter =
      `drop-shadow(0 18px 18px rgba(40,10,50,.28)) drop-shadow(0 0 ${10 + heat * 40}px rgba(255,${Math.round(200 - heat * 150)},${Math.round(120 - heat * 100)},${0.2 + heat * 0.7})) ` +
      `saturate(${1 + heat * 0.6 - cold * 0.3}) hue-rotate(${-heat * 25 + cold * 25}deg) brightness(${1 + heat * 0.08})`;
    let label, hint;
    if (t < DEMO.idealMin - 12) { label = "Frio 🥶"; hint = "Brrr… o ovinho está gelado"; }
    else if (t < DEMO.idealMin) { label = "Morninho"; hint = "Quase lá!"; }
    else if (t <= DEMO.idealMax) { label = "Perfeito ✨"; hint = "Isso! Tem alguém se mexendo aí dentro…"; }
    else if (t <= DEMO.idealMax + 12) { label = "Quente!"; hint = "Cuidado, está esquentando demais"; }
    else { label = "Muito quente 🔥"; hint = "Ai! Deixe esfriar um pouquinho"; }
    el.thermoLabel.textContent = label;
    el.thermoHint.textContent = hint;
    el.hatchFill.style.width = `${clamp((state.idealMs / (DEMO.hatchSeconds * 1000)) * 100, 0, 100)}%`;
  }

  // ---------- Guide: always tell the child what to do next ----------
  function setGuide(text, wantedKey = null, wishIcon = null, urgent = false) {
    if (el.guide.textContent !== text) {
      el.guide.textContent = text;
      el.guide.style.animation = "none";
      void el.guide.offsetWidth;
      el.guide.style.animation = "";
    }
    el.guide.classList.toggle("urgent", urgent);
    Object.entries(buttons).forEach(([k, b]) => b.classList.toggle("wanted", k === wantedKey));
    el.wish.hidden = !wishIcon;
    if (wishIcon && el.wishIcon.textContent !== wishIcon) el.wishIcon.textContent = wishIcon;
  }

  function updateGuide() {
    if (state.phase === "egg") {
      const t = state.temp;
      if (t > DEMO.idealMax + 4) return setGuide("Muito quente! Pare de esfregar ✋", null, null, true);
      if (t >= DEMO.idealMin) {
        const pct = clamp(state.idealMs / (DEMO.hatchSeconds * 1000), 0, 1);
        if (pct > 0.65) return setGuide("Está rachando! Continue com cuidado… 🥚", "1", null, true);
        if (pct > 0.3) return setGuide("Algo se mexe lá dentro… ✨", "1");
        return setGuide("Perfeito! Continue devagarinho 💛", "1");
      }
      return setGuide("Esfregue o ovo com o dedo para aquecer! 👆", "1");
    }
    if (state.phase === "hatching") return setGuide("O ovo está quebrando… surpresa! ✨");
    const p = state.name;
    if (state.busy) return;
    if (state.sleeping) {
      const day = el.app.dataset.period === "day";
      return setGuide(day && state.needs.energy > 90 ? `${p} já descansou! Aperte ☀️ Acordar` : `Shhh… ${p} está dormindo 💤`, day && state.needs.energy > 90 ? "1" : null);
    }
    if (state.mood === "mad") return setGuide(`${p} está nervoso! Cuida dele agora! 💢`, null, "😤", true);
    if (state.mood === "sad") {
      const n = state.needs;
      const worst = ["hunger", "thirst", "hygiene", "love", "energy"].sort((a, b) => n[a] - n[b])[0];
      const need = needsMap()[worst];
      const icon = worst === "hunger" ? state.species.food : need.icon;
      const sadHunger = isMachine() ? `Quer ${state.species.foodName}!` : `Quer ${state.species.foodName}!`;
      return setGuide(`${p} está triste… ${worst === "hunger" ? sadHunger : need.text(p)}`, need.key, icon, true);
    }

    const n = state.needs;
    const night = el.app.dataset.period === "night";
    // Limiares um pouco mais baixos no traço forte do animal
    const pr = state.species.profile || {};
    const limits = {
      hunger: pr.hunger > 1.3 || state.boosts?.hunger > 1 ? 50 : 42,
      thirst: pr.thirst > 1.3 || state.boosts?.thirst > 1 ? 50 : 42,
      hygiene: pr.hygiene > 1.3 || state.boosts?.hygiene > 1 ? 42 : 32,
      love: pr.love > 1.3 || state.boosts?.love > 1 ? 50 : 42,
      energy: night ? 60 : (pr.energy > 1.2 || state.boosts?.energy > 1 ? 32 : 24),
    };
    let worst = null;
    for (const k of Object.keys(limits)) {
      if (n[k] < limits[k] && (!worst || n[k] - limits[k] < n[worst] - limits[worst])) worst = k;
    }
    if (worst) {
      const need = needsMap()[worst];
      const icon = worst === "hunger" ? state.species.food : need.icon;
      const text = worst === "hunger"
        ? (isMachine() ? `${p} precisa de peças! Aperte ${state.species.food} Peças` : `${p} está com fome! Aperte ${state.species.food} Comer`)
        : need.text(p);
      return setGuide(text, need.key, icon, n[worst] < 25);
    }
    if (night) return setGuide(`Está de noite… hora de nanar? 🌙`, "6", "🌙");
    setGuide(`${p} está feliz! Faça carinho passando o dedo 💕`);
  }

  // ---------- Clumsy baby skits ----------
  async function skit(kind) {
    if (state.busy || state.sleeping || state.phase !== "pet") return;
    state.busy = true;
    const p = state.name;
    try {
      if (kind === "fly") {
        state.pose = "fly"; renderActor();
        say(state.stage === 1 ? "Vou voaaar! 🪽" : "Agora vai!", 1600);
        await playMove("fly", 1600);
        await playMove("drop", 450);
        state.pose = "fall"; renderActor();
        playMove("splat", 600);
        burst(30, 0.9);
        rain(["⭐", "💫"], 4, "float", 20);
        say("Ops! 😵‍💫", 1800);
        await wait(2200);
      } else if (kind === "wobble") {
        say("Upa… upa…", 1400);
        await playMove("wobble", 1400);
        state.pose = "fall"; renderActor();
        playMove("splat", 600);
        rain(["⭐", "✨"], 3, "float", 20);
        say("Caí! Hihihi 🙈", 1800);
        await wait(2200);
      } else if (kind === "bed") {
        state.pose = "bed"; renderActor();
        say("Miau?", 1300);
        await playMove("wobble", 1400);
        state.pose = "fall"; renderActor();
        await playMove("tumble", 700);
        playMove("splat", 600);
        rain(["⭐", "💫"], 3, "float", 20);
        say("Miaaau! 🙃", 1800);
        await wait(2000);
      } else if (kind === "mud") {
        state.pose = "mud"; renderActor();
        say("Lama! Lama! 🐷", 1600);
        await playMove("wobble", 1400);
        rain(["🟤", "✨", "🤎"], 6);
        say("Hihihi, que gostoso!", 1800);
        await wait(2000);
        state.pose = "fall"; renderActor();
        playMove("splat", 600);
        rain(["⭐", "💫"], 3, "float", 20);
        say("Ops! Escorreguei! 🙈", 1800);
        await wait(1800);
      } else if (kind === "dig") {
        state.pose = "dig"; renderActor();
        say("Vou cavar! 🕳️", 1500);
        await playMove("wobble", 1600);
        rain(["🟤", "✨", "🍄"], 6);
        say("Achado! Hihi", 1600);
        await wait(1600);
        state.pose = "fall"; renderActor();
        playMove("splat", 600);
        rain(["⭐", "💫"], 3, "float", 20);
        say("Ops! Cavei demais! 🙈", 1800);
        await wait(1800);
      } else if (kind === "turbo") {
        state.pose = state.stage >= 3 && state.species.poses.includes("turbo") ? "turbo" : null;
        renderActor();
        say(state.stage === 1 ? "Vruum? 🍼" : "VRUUUM! 🏁", 1500);
        await playMove("wobble", 700);
        await playMove("rear", 1200);
        rain(["💨", "⭐", "🔥"], 8);
        say(state.stage >= 4 ? "Escapamento ligado! 🔥" : "Quase voei!", 1800);
        await wait(1600);
      } else if (kind === "transform") {
        say("Transformar! ⚡", 1200);
        state.pose = "car"; renderActor();
        await playMove("wobble", 900);
        rain(["⚡", "✨", "🔩"], 8);
        say("Agora sou carro! 🚗", 1400);
        await wait(1600);
        state.pose = null; renderActor();
        await playMove("rear", 1000);
        rain(["⚡", "🤖"], 5);
        say("E de volta a robô! 🤖", 1600);
        await wait(1400);
      } else if (kind === "launch") {
        state.pose = state.species.poses.includes("launch") ? "launch" : null;
        renderActor();
        say(state.stage === 1 ? "3… 2… 1…? 🍼" : "3… 2… 1… DECOLAR! 🚀", 1600);
        await playMove("rear", 1400);
        rain(["🚀", "⭐", "💨"], 10);
        say("Quase fui pra lua!", 1800);
        await wait(1600);
      } else if (kind === "hover") {
        state.pose = state.species.poses.includes("hover") ? "hover" : null;
        renderActor();
        say("Trrr trrr! 🚁", 1400);
        await playMove("wobble", 1200);
        rain(["💨", "✨"], 8);
        say("Olha eu no ar!", 1600);
        await wait(1400);
      } else if (kind === "chug") {
        state.pose = state.species.poses.includes("chug") ? "chug" : null;
        renderActor();
        say("Chuf chuf chuf! 🚂", 1500);
        await playMove("wobble", 1400);
        rain(["💨", "⭐"], 8);
        say("Expresso mágico!", 1600);
        await wait(1400);
      } else if (kind === "plough") {
        state.pose = state.species.poses.includes("plough") ? "plough" : null;
        renderActor();
        say("Vrum vrum na fazenda! 🚜", 1500);
        await playMove("wobble", 1300);
        rain(["🌾", "🟤", "✨"], 8);
        say("Terra prontinha!", 1600);
        await wait(1400);
      } else if (kind === "sail") {
        state.pose = state.species.poses.includes("sail") ? "sail" : null;
        renderActor();
        say("Vento na vela! ⛵", 1500);
        await playMove("wobble", 1300);
        rain(["🌊", "💨", "✨"], 8);
        say("Iupi, navegando!", 1600);
        await wait(1400);
      } else if (kind === "loop") {
        state.pose = state.species.poses.includes("loop") ? "loop" : null;
        renderActor();
        say("Looping! ✈️", 1400);
        await playMove("rear", 1400);
        rain(["☁️", "⭐", "💨"], 10);
        say("Uhuuuul!", 1600);
        await wait(1400);
      } else if (kind === "bounce") {
        state.pose = state.species.poses.includes("bounce") ? "bounce" : null;
        renderActor();
        say("Ploing ploing! 🍮", 1400);
        await playMove("wobble", 700);
        await playMove("rear", 900);
        rain(["✨", "💜", "💚", "💙"], 10);
        say("Sou todinho gelinho!", 1600);
        await wait(1400);
      } else if (kind === "rear") {
        say("Iiiirrí! 🌈", 1600);
        rain(["✨", "🌈", "⭐"], 8);
        await playMove("rear", 1400);
      }
    } finally {
      state.pose = null;
      el.actorMove.className = "actor-move";
      state.busy = false;
      setMood("happy", 1200);
      renderActor();
      state.nextSkit = performance.now() + 14000 + Math.random() * 10000;
    }
    void p;
  }
  function skitForStage() {
    const sp = state.species;
    if (state.stage === 1 && sp.skit) return sp.skit;
    if ((state.stage === 2 || state.stage === 3) && sp.childSkit) return sp.childSkit;
    if (state.stage === 4 && sp.adultSkit) return sp.adultSkit;
    return null;
  }

  // ---------- Game flow ----------
  function setEggCrack(level, withShake = true) {
    if (state.eggCrack === level) return;
    state.eggCrack = level;
    renderActor();
    if (withShake && level > 0) {
      el.actor.classList.remove("crack-shake");
      void el.actor.offsetWidth;
      el.actor.classList.add("crack-shake");
      burst(8 + level * 6, 0.45);
    }
  }

  async function hatch(species) {
    if (state.phase === "hatching") return;
    state.phase = "hatching";
    state.rubbing = false;
    el.actor.classList.remove("rubbing");
    el.actor.classList.add("hatching");
    el.app.dataset.phase = "hatching";
    updateGuide();

    // Escolhe o bichinho em segredo — o jogador ainda não vê.
    species = species || pickHatchSpecies();
    applyVariant(species, pickVariant(species));
    preload(species);
    const rolled = rollStrongTraits(species);

    const steps = [
      { crack: 1, say: "Crec…", ms: 900 },
      { crack: 2, say: "Crec… crec…", ms: 1100 },
      { crack: 3, say: "Está nascendo! ✨", ms: 1300 },
      { crack: 4, say: "…", ms: 700 },
    ];
    for (const step of steps) {
      setEggCrack(step.crack, true);
      say(step.say, step.ms);
      await wait(step.ms);
    }

    el.actor.classList.remove("hatching");
    el.actor.classList.add("hatch-burst");
    flash();
    burst(140, 0.5);
    await wait(500);

    Object.assign(state, {
      phase: "pet", stage: 1, species, name: pick((state.variant && species.variants?.[state.variant]?.names) || species.names),
      lastGrowth: performance.now(), eggCrack: 0, pose: null, lackMs: 0,
      boosts: rolled.boosts,
      strongTraits: rolled.strongTraits,
      growthIntervalMs: Math.round((species.profile?.growthMs || DEMO.growthIntervalMs) * (0.92 + Math.random() * 0.16)),
    });
    el.app.dataset.phase = "pet";
    el.actor.classList.remove("hatch-burst", "crack-shake");
    el.actorImg.style.filter = "";
    renderActor(); renderHeader(); renderGrowth();
    Object.values(buttons).forEach((b) => (b.disabled = false));
    el.btn1Icon.textContent = "☀️";
    el.btn1Text.textContent = "Acordar";
    setMood("happy", 2000);
    rain(["✨", "💖", "⭐"], 10);
    say(`Surpresa! Eu sou ${state.name}! 💖`, 2600);
    setTimeout(() => {
      const line = rolled.phrases.map((p) => p.text).join(" ");
      say(line, 4200);
    }, 2700);
    state.nextSkit = performance.now() + 3200;
  }

  function grow() {
    if (state.stage >= 4) return;
    state.stage++;
    flash();
    burst(90);
    renderActor(); renderHeader(); renderGrowth();
    setMood("happy", 2000);
    rain(["⭐", "✨", "🌟"], 8);
    say(state.stage === 4 ? "Cresci todinho! 🌟" : "Olha como eu cresci!", 2600);
    state.needs.love = clamp(state.needs.love + 15, 0, 100);
    state.nextSkit = performance.now() + 5000;
  }

  const stageNeedMult = () => 0.75 + state.stage * 0.3;

  function decayRates() {
    const stage = stageNeedMult();
    const pr = state.species?.profile || {};
    const b = state.boosts || {};
    return {
      hunger: BASE_RATES.hunger * stage * (pr.hunger || 1) * (b.hunger || 1),
      thirst: BASE_RATES.thirst * stage * (pr.thirst || 1) * (b.thirst || 1),
      hygiene: BASE_RATES.hygiene * stage * (pr.hygiene || 1) * (b.hygiene || 1),
      love: BASE_RATES.love * stage * (pr.love || 1) * (b.love || 1),
      energy: state.sleeping ? -5 : BASE_RATES.energy * stage * (pr.energy || 1) * (b.energy || 1),
    };
  }

  async function care(kind) {
    if (state.phase !== "pet") return;
    if (state.sleeping && kind !== "wake") { say("Shhh… zzz", 1400); rain(["💤"], 2, "zzz"); return; }
    if (state.busy && kind !== "wake") return;
    const n = state.needs;
    const boost = 12 + state.stage * 4;
    const tooMuch = (key, limit, msg) => {
      if (n[key] <= limit) return false;
      state.over[key]++;
      setMood("mad", 1800);
      rain(["💢", "😤"], 3);
      say(msg, 2000);
      return true;
    };
    const relieve = (key) => { state.over[key] = Math.max(0, state.over[key] - 1); };

    if (kind === "feed") {
      if (tooMuch("hunger", 92, isMachine() ? "Já tenho peças demais! 🔧" : "Minha barriguinha tá cheia! 😣")) return;
      state.busy = true;
      await throwTo("2", state.species.food);
      n.hunger = clamp(n.hunger + boost + 8, 0, 100);
      relieve("hunger");
      state.pose = "eat"; renderActor();
      el.actor.dataset.mood = "neutral";
      playMove("munch", 2200);
      say(isMachine() ? `Clinc clanc! Amo ${state.species.foodName}! 🔧` : `Nham nham! Amo ${state.species.foodName}! 😋`, 2200);
      for (let i = 0; i < 5; i++) setTimeout(() => fx("float", pick(["✨", state.species.food, "💛"]), { x: 40 + Math.random() * 20, y: 45, dx: (Math.random() - 0.5) * 90 }), i * 300);
      await wait(2300);
      state.pose = null; state.busy = false;
    } else if (kind === "drink") {
      if (tooMuch("thirst", 92, isMachine() ? "Tanque cheio! ⛽" : "Chega de água! 💦")) return;
      state.busy = true;
      await throwTo("3", isMachine() ? "⛽" : (state.stage <= 2 ? "🍼" : "🥛"));
      n.thirst = clamp(n.thirst + boost + 10, 0, 100);
      relieve("thirst");
      playMove("munch", 1500);
      rain(isMachine() ? ["⛽", "🛢️", "✨"] : ["💧", "💦"], 5);
      say(isMachine() ? pick(["Glup de óleo!", "Motor feliz!", "Abastecido!"]) : pick(["Glub glub glub!", "Ahhh, geladinho!", "Hmmm, que bom!"]), 2000);
      await wait(1500);
      state.busy = false;
    } else if (kind === "bath") {
      if (tooMuch("hygiene", 90, "Já estou limpinho!")) return;
      n.hygiene = clamp(n.hygiene + 35, 0, 100);
      relieve("hygiene");
      for (let i = 0; i < 14; i++) setTimeout(() => fx("bubble-soap", "", { x: 15 + Math.random() * 70, y: 30 + Math.random() * 55, dx: (Math.random() - 0.5) * 80, size: 16 + Math.random() * 34 }), i * 70);
      playMove("wobble", 1400);
      say(pick(["Splash! 🫧", "Cosquinha! Hihi", "Cheirosinho!"]));
    } else if (kind === "pet") {
      if (tooMuch("love", 94, "Ai, chega de apertar! 😤")) return;
      n.love = clamp(n.love + boost, 0, 100);
      relieve("love");
      rain(["💖", "💗", "💕", "🥰"], 7);
      say(pick(["Hihihi!", "Te amo! 💖", "Mais um abraço!", "Rrrrrr… 😊"]));
    } else if (kind === "sleep") {
      if (!state.sleeping) {
        state.sleeping = true;
        state.pose = null;
        state.busy = false;
        setMood("sleep");
        say("Boa noite… 🌙", 2200);
      }
      renderActor(); renderNeeds();
      return;
    } else if (kind === "wake") {
      if (!state.sleeping) { say("Já estou acordado!", 1400); return; }
      state.sleeping = false;
      rain(["☀️", "✨"], 4);
      say("Bom dia!! ☀️", 2000);
    }
    setMood("happy", 1600);
    state.lackMs = Math.max(0, state.lackMs - 4000);
    renderActor();
    renderNeeds();
  }

  function evaluateMood(now) {
    if (now < state.moodLock || state.busy) return;
    if (state.sleeping) return setMood("sleep");
    const n = state.needs;
    if (Object.values(state.over).some((v) => v > 2)) return setMood("mad");

    const lows = ["hunger", "thirst", "hygiene", "love", "energy"].filter((k) => n[k] < 35);
    const crits = ["hunger", "thirst", "hygiene", "love", "energy"].filter((k) => n[k] < 18);

    if (crits.length >= 1 || lows.length >= 2 || state.lackMs > 12_000) {
      return setMood("mad"); // nervoso
    }
    if (lows.length >= 1 || n.hunger < 28 || n.thirst < 28 || n.love < 25 || n.energy < 22 || n.hygiene < 22) {
      return setMood("sad");
    }
    if (n.hunger > 60 && n.thirst > 60 && n.love > 55 && n.hygiene > 50) return setMood("happy");
    setMood("neutral");
  }

  function updateClock() {
    const now = new Date();
    el.clockTime.textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    if (state.preview?.period) el.app.dataset.period = state.preview.period;
    else {
      const p = ((performance.now() - state.dayStart) % DEMO.dayLengthMs) / DEMO.dayLengthMs;
      el.app.dataset.period = p > 0.75 || p < 0.1 ? "night" : p > 0.6 ? "dusk" : "day";
    }
    const period = el.app.dataset.period;
    el.clockIcon.textContent = period === "night" ? "🌙" : period === "dusk" ? "🌅" : "☀️";
  }

  // ---------- Loop ----------
  function tick(now) {
    const dt = Math.min(0.1, (now - state.last) / 1000);
    state.last = now;
    if (!tick.c || now - tick.c > 300) { tick.c = now; updateClock(); updateGuide(); }

    if (state.phase === "egg" && !state.preview) {
      state.temp = clamp(state.temp + (state.rubbing ? 20 : -7) * dt, 10, 100);
      const ideal = state.temp >= DEMO.idealMin && state.temp <= DEMO.idealMax;
      state.idealMs = ideal ? state.idealMs + dt * 1000 : Math.max(0, state.idealMs - dt * 600);
      if (state.rubbing && Math.random() < 0.3) burst(1);
      // Rachaduras aparecem aos poucos enquanto mantém a temperatura ideal
      const pct = state.idealMs / (DEMO.hatchSeconds * 1000);
      if (pct >= 0.85) setEggCrack(2, state.eggCrack < 2);
      else if (pct >= 0.4) setEggCrack(1, state.eggCrack < 1);
      else if (pct < 0.2) setEggCrack(0, false);
      renderEgg();
      if (state.idealMs >= DEMO.hatchSeconds * 1000) hatch(state.forceSpecies);
    } else if (state.phase === "pet") {
      if (!state.preview) {
        const rates = decayRates();
        for (const [k, r] of Object.entries(rates)) state.needs[k] = clamp(state.needs[k] - r * dt, 0, 100);
        for (const k of Object.keys(state.over)) state.over[k] = Math.max(0, state.over[k] - 0.15 * dt);

        const lacking = Object.values(state.needs).some((v) => v < 35);
        state.lackMs = lacking ? state.lackMs + dt * 1000 : Math.max(0, state.lackMs - dt * 2000);

        if (state.stage < 4) {
          const frac = (now - state.lastGrowth) / state.growthIntervalMs;
          if (frac >= 1) {
            state.lastGrowth = now;
            // Cada fase seguinte usa o perfil do animal ± um pouquinho de aleatório
            const base = state.species.profile?.growthMs || DEMO.growthIntervalMs;
            state.growthIntervalMs = Math.round(base * (0.9 + Math.random() * 0.2));
            grow();
          } else renderGrowth(frac);
        }
        if (now > state.nextSkit) {
          const s = skitForStage();
          if (s) skit(s); else state.nextSkit = Infinity;
        }
      }
      renderNeeds();
      evaluateMood(now);
      if (!state.busy) renderActor();

      state.fxTimer -= dt;
      if (state.fxTimer <= 0) {
        state.fxTimer = 0.9;
        if (state.mood === "sad") {
          fx("tear", "💧", { x: 40, y: 45, dx: -10 });
          fx("tear", "💧", { x: 58, y: 45, dx: 10 });
          if (Math.random() < 0.14) say(pick(["Buááá…", "Estou triste…", "Me ajuda?", "Preciso de você…"]), 1800);
        }
        if (state.mood === "mad") {
          fx("float", "💨", { x: 30, y: 40, dx: -40 });
          fx("float", "💢", { x: 65, y: 35, dx: 20 });
          if (Math.random() < 0.12) say(pick(["Humpf!", "Estou nervoso!", "Não aguento mais!", "Cuida de mim! 💢"]), 1800);
        }
        if (state.mood === "sleep") fx("zzz", "Z", { x: 58, y: 45, font: `${1.4 + Math.random()}rem` });
      }
    }

    drawFx();
    requestAnimationFrame(tick);
  }

  // ---------- Input ----------
  const actions = { 1: () => care("wake"), 2: () => care("feed"), 3: () => care("drink"), 4: () => care("bath"), 5: () => care("pet"), 6: () => care("sleep") };
  function press(key) {
    const b = buttons[key];
    if (!b || b.disabled) return;
    b.classList.add("pressed");
    if (key === "1" && state.phase === "egg") return setRub(true);
    actions[key]?.();
  }
  function release(key) {
    buttons[key]?.classList.remove("pressed");
    if (key === "1") setRub(false);
  }
  function setRub(on) {
    if (state.phase !== "egg") return;
    state.rubbing = on;
    el.actor.classList.toggle("rubbing", on);
  }

  addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (/^[1-6]$/.test(e.key)) press(e.key);
    if (e.key === "0") {
      try { localStorage.removeItem("bichinho-hatch-bag"); } catch (_) {}
      location.href = "index.html";
      return;
    }
    if (e.key === "9" && state.phase === "pet") { state.lastGrowth = performance.now(); grow(); }
    if (e.key === "8" && state.phase === "pet") { const s = skitForStage(); if (s) skit(s); }
    if (e.key === "7" && state.phase === "pet") { Object.assign(state.needs, { hunger: 15, thirst: 30, love: 25 }); }
  });
  addEventListener("keyup", (e) => { if (/^[1-6]$/.test(e.key)) release(e.key); });
  Object.entries(buttons).forEach(([k, b]) => {
    b.addEventListener("pointerdown", (e) => { e.preventDefault(); press(k); });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => b.addEventListener(ev, () => release(k)));
  });

  let dragging = false, lastPt = null, petAccum = 0;
  el.actor.addEventListener("pointerdown", (e) => { dragging = true; lastPt = [e.clientX, e.clientY]; el.actor.setPointerCapture(e.pointerId); setRub(true); });
  el.actor.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const d = Math.hypot(e.clientX - lastPt[0], e.clientY - lastPt[1]);
    lastPt = [e.clientX, e.clientY];
    if (state.phase === "egg") state.temp = clamp(state.temp + Math.min(d, 30) * 0.06, 10, 100);
    else if (state.phase === "pet") { petAccum += d; if (petAccum > 260) { petAccum = 0; care("pet"); } }
  });
  ["pointerup", "pointercancel"].forEach((ev) => el.actor.addEventListener(ev, () => { dragging = false; setRub(false); }));
  el.wish.addEventListener("click", () => { const k = [...Object.entries(buttons)].find(([, b]) => b.classList.contains("wanted"))?.[0]; if (k) press(k), release(k); });
  addEventListener("resize", resizeFx);

  // ---------- Preview (?species=dino&stage=1&pose=plead&period=day) ----------
  function applyPreview() {
    const q = new URLSearchParams(location.search);
    const sp = SPECIES.find((s) => s.id === q.get("species"));
    if (q.get("hatch") != null) { state.forceSpecies = sp; return; }
    if (!q.size) return;
    state.preview = { period: q.get("period") || "day" };
    if (q.get("egg") != null) {
      state.temp = Number(q.get("egg")) || 57;
      state.idealMs = 2600;
      renderEgg();
      return;
    }
    Object.assign(state, { phase: "pet", species: sp || SPECIES[0], stage: clamp(Number(q.get("stage")) || 1, 1, 4) });
    applyVariant(state.species, pickVariant(state.species));
    state.name = q.get("name") || pick((state.variant && state.species.variants?.[state.variant]?.names) || state.species.names);
    const rolled = rollStrongTraits(state.species);
    if (q.get("trait")) {
      const keys = q.get("trait").split(",").filter((k) => TRAIT_LINES[k] || TRAIT_LINES_MACHINE[k]);
      if (keys.length) {
        rolled.strongTraits = keys;
        rolled.boosts = { hunger: 1, thirst: 1, hygiene: 1, love: 1, energy: 1 };
        keys.forEach((k) => { rolled.boosts[k] = 2; });
      }
    }
    state.boosts = rolled.boosts;
    state.strongTraits = rolled.strongTraits;
    state.growthIntervalMs = state.species.profile?.growthMs || DEMO.growthIntervalMs;
    state.lackMs = 0;
    el.app.dataset.phase = "pet";
    Object.values(buttons).forEach((b) => (b.disabled = false));
    el.btn1Icon.textContent = "☀️";
    el.btn1Text.textContent = "Acordar";
    Object.assign(state.needs, { hunger: Number(q.get("hunger") ?? 70), thirst: 62, hygiene: 80, love: 70, energy: 64 });
    state.pose = q.get("pose");
    if (state.pose === "sleep") { state.sleeping = true; state.pose = null; }
    renderActor(); renderHeader(); renderNeeds(); renderGrowth(0.35);
    setMood(q.get("mood") || "neutral");
    if (q.get("say")) say(q.get("say"), 1e9);
  }

  resizeFx();
  ["egg", "egg_crack1", "egg_crack2", "egg_crack3", "egg_broken"].forEach((n) => {
    const i = new Image();
    i.src = `${ART}${n}.webp`;
  });
  renderActor();
  renderEgg();
  renderGrowth();
  applyPreview();
  if (!state.preview) say("Tem um ovinho aqui! 🥚", 3000);
  requestAnimationFrame(tick);
})();
