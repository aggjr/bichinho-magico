/**
 * Pixel Play — áudio procedural (Web Audio API)
 * Ambientes por bioma + “vozes” por família de PIXEL e humor.
 */
(() => {
  "use strict";

  const STORAGE_MUTE = "pixelplay-muted";

  let ctx = null;
  let master = null;
  let ambientBus = null;
  let voiceBus = null;
  let sfxBus = null;
  let muted = false;
  let unlocked = false;
  let currentBiome = null;
  let ambientHandles = [];
  let ambientTimer = null;
  let lastVoiceAt = 0;
  let lastMoodKey = "";

  try {
    muted = localStorage.getItem(STORAGE_MUTE) === "1";
  } catch (_) { /* ignore */ }

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.85;
    master.connect(ctx.destination);

    ambientBus = ctx.createGain();
    ambientBus.gain.value = 0.32;
    ambientBus.connect(master);

    voiceBus = ctx.createGain();
    voiceBus.gain.value = 0.55;
    voiceBus.connect(master);

    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.45;
    sfxBus.connect(master);
    return ctx;
  }

  function unlock() {
    const c = ensure();
    if (!c) return;
    if (c.state === "suspended") c.resume().catch(() => {});
    unlocked = true;
    if (currentBiome) startAmbient(currentBiome, true);
  }

  function setMuted(on) {
    muted = !!on;
    try { localStorage.setItem(STORAGE_MUTE, muted ? "1" : "0"); } catch (_) {}
    const c = ensure();
    if (master) {
      const t = c.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.linearRampToValueAtTime(muted ? 0 : 0.85, t + 0.12);
    }
    if (!muted && unlocked && currentBiome) startAmbient(currentBiome, true);
    if (muted) stopAmbient();
    document.documentElement.dataset.sound = muted ? "off" : "on";
    const btn = document.getElementById("btnMute");
    if (btn) {
      btn.setAttribute("aria-pressed", muted ? "true" : "false");
      btn.title = muted ? "Som desligado (ligar)" : "Som ligado (desligar)";
      btn.querySelector(".i").textContent = muted ? "🔇" : "🔊";
    }
  }

  function toggleMute() {
    unlock();
    setMuted(!muted);
  }

  function noiseBuffer(seconds = 1.5) {
    const c = ensure();
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function envGain(bus, t0, a, hold, r, peak = 1) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), t0 + a);
    g.gain.setValueAtTime(Math.max(0.001, peak), t0 + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + hold + r);
    g.connect(bus);
    return g;
  }

  function tone(freq, dur, type, bus, peak = 0.2, slideTo = null) {
    if (!ctx || muted) return;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo != null) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    const g = envGain(bus, t0, 0.02, Math.max(0.01, dur * 0.55), dur * 0.4, peak);
    o.connect(g);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  function noiseBurst(bus, dur, peak, filterFreq, type = "bandpass", q = 1) {
    if (!ctx || muted) return;
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(Math.max(0.2, dur + 0.1));
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = filterFreq;
    f.Q.value = q;
    const g = envGain(bus, t0, 0.01, dur * 0.3, dur * 0.7, peak);
    src.connect(f);
    f.connect(g);
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  function stopAmbient() {
    if (ambientTimer) {
      clearInterval(ambientTimer);
      ambientTimer = null;
    }
    ambientHandles.forEach((stop) => {
      try { stop(); } catch (_) {}
    });
    ambientHandles = [];
  }

  /** Camadas contínuas + eventos esparsos por bioma */
  const AMBIENT = {
    meadow: {
      bed(t) {
        tone(220, 2.2, "sine", ambientBus, 0.04);
        tone(330, 2.4, "triangle", ambientBus, 0.025);
      },
      tick() {
        if (Math.random() < 0.45) tone(1200 + Math.random() * 900, 0.08, "sine", ambientBus, 0.03);
        if (Math.random() < 0.25) tone(800 + Math.random() * 400, 0.12, "triangle", ambientBus, 0.02);
      },
    },
    garden: {
      bed() {
        tone(262, 2.5, "sine", ambientBus, 0.035);
        tone(392, 2.2, "triangle", ambientBus, 0.02);
      },
      tick() {
        tone(1400 + Math.random() * 800, 0.06, "sine", ambientBus, 0.035);
        if (Math.random() < 0.35) tone(900 + Math.random() * 500, 0.05, "triangle", ambientBus, 0.02);
      },
    },
    jungle: {
      bed() {
        noiseBurst(ambientBus, 1.8, 0.04, 400, "lowpass", 0.7);
        tone(110, 2.5, "sine", ambientBus, 0.03);
      },
      tick() {
        if (Math.random() < 0.5) tone(600 + Math.random() * 1000, 0.15, "sawtooth", ambientBus, 0.015, 400 + Math.random() * 200);
        if (Math.random() < 0.3) tone(1800 + Math.random() * 600, 0.05, "sine", ambientBus, 0.025);
      },
    },
    savanna: {
      bed() {
        noiseBurst(ambientBus, 2.2, 0.035, 500, "lowpass", 0.5);
        tone(98, 3, "sine", ambientBus, 0.03);
      },
      tick() {
        if (Math.random() < 0.35) tone(700 + Math.random() * 300, 0.25, "triangle", ambientBus, 0.02, 500);
        if (Math.random() < 0.2) tone(1400, 0.08, "sine", ambientBus, 0.02);
      },
    },
    farm: {
      bed() {
        tone(130, 2.4, "sine", ambientBus, 0.03);
        noiseBurst(ambientBus, 1.5, 0.025, 700, "bandpass", 0.8);
      },
      tick() {
        if (Math.random() < 0.4) tone(400 + Math.random() * 200, 0.2, "square", ambientBus, 0.012);
        if (Math.random() < 0.25) tone(900 + Math.random() * 400, 0.1, "sine", ambientBus, 0.02);
      },
    },
    pond: {
      bed() {
        noiseBurst(ambientBus, 2, 0.04, 900, "lowpass", 0.6);
        tone(180, 2.5, "sine", ambientBus, 0.03);
      },
      tick() {
        noiseBurst(ambientBus, 0.15 + Math.random() * 0.2, 0.04, 1200 + Math.random() * 800, "bandpass", 2);
      },
    },
    water: {
      bed() {
        noiseBurst(ambientBus, 2.4, 0.05, 600, "lowpass", 0.5);
        tone(90, 3, "sine", ambientBus, 0.04);
      },
      tick() {
        noiseBurst(ambientBus, 0.2, 0.045, 800 + Math.random() * 1200, "bandpass", 1.5);
        if (Math.random() < 0.4) tone(500 + Math.random() * 400, 0.3, "sine", ambientBus, 0.02, 200);
      },
    },
    marina: {
      bed() {
        noiseBurst(ambientBus, 2.2, 0.045, 350, "lowpass", 0.4);
        tone(140, 2.8, "sine", ambientBus, 0.03);
      },
      tick() {
        if (Math.random() < 0.35) tone(500 + Math.random() * 200, 0.4, "triangle", ambientBus, 0.02);
        noiseBurst(ambientBus, 0.25, 0.03, 1000, "highpass", 0.7);
      },
    },
    arctic: {
      bed() {
        noiseBurst(ambientBus, 2.5, 0.04, 2000, "highpass", 0.5);
        tone(220, 3, "sine", ambientBus, 0.025);
      },
      tick() {
        if (Math.random() < 0.4) tone(1600 + Math.random() * 800, 0.35, "sine", ambientBus, 0.02, 900);
      },
    },
    cave: {
      bed() {
        tone(55, 3, "sine", ambientBus, 0.05);
        noiseBurst(ambientBus, 2, 0.03, 200, "lowpass", 0.8);
      },
      tick() {
        if (Math.random() < 0.3) tone(300 + Math.random() * 120, 0.6, "triangle", ambientBus, 0.02, 180);
        if (Math.random() < 0.2) noiseBurst(ambientBus, 0.2, 0.025, 2500, "bandpass", 3);
      },
    },
    burrow: {
      bed() {
        noiseBurst(ambientBus, 2, 0.04, 180, "lowpass", 0.9);
        tone(70, 2.5, "sine", ambientBus, 0.03);
      },
      tick() {
        if (Math.random() < 0.4) noiseBurst(ambientBus, 0.12, 0.03, 400, "bandpass", 2);
      },
    },
    cozy: {
      bed() {
        tone(196, 2.8, "sine", ambientBus, 0.03);
        tone(247, 2.6, "triangle", ambientBus, 0.02);
      },
      tick() {
        if (Math.random() < 0.25) tone(523, 0.15, "sine", ambientBus, 0.015);
      },
    },
    garage: {
      bed() {
        noiseBurst(ambientBus, 2, 0.03, 120, "lowpass", 0.7);
        tone(60, 2.5, "sawtooth", ambientBus, 0.015);
      },
      tick() {
        if (Math.random() < 0.3) tone(180 + Math.random() * 40, 0.15, "square", ambientBus, 0.012);
        if (Math.random() < 0.15) noiseBurst(ambientBus, 0.08, 0.02, 3000, "bandpass", 4);
      },
    },
    station: {
      bed() {
        tone(80, 2.5, "sine", ambientBus, 0.035);
        noiseBurst(ambientBus, 1.8, 0.025, 250, "lowpass", 0.6);
      },
      tick() {
        if (Math.random() < 0.25) {
          // apito longe
          tone(680, 0.35, "sine", ambientBus, 0.03, 520);
        }
        if (Math.random() < 0.2) noiseBurst(ambientBus, 0.2, 0.02, 150, "lowpass", 1);
      },
    },
    airfield: {
      bed() {
        noiseBurst(ambientBus, 2.2, 0.04, 400, "lowpass", 0.5);
        tone(95, 2.5, "sawtooth", ambientBus, 0.012);
      },
      tick() {
        if (Math.random() < 0.3) tone(220, 0.8, "sawtooth", ambientBus, 0.015, 160);
        if (Math.random() < 0.2) tone(900, 0.1, "sine", ambientBus, 0.02);
      },
    },
    space: {
      bed() {
        tone(90, 3.2, "sine", ambientBus, 0.04);
        tone(180, 3, "triangle", ambientBus, 0.02);
      },
      tick() {
        if (Math.random() < 0.4) tone(400 + Math.random() * 600, 0.7, "sine", ambientBus, 0.025, 200 + Math.random() * 100);
        if (Math.random() < 0.2) noiseBurst(ambientBus, 0.3, 0.02, 4000, "bandpass", 2);
      },
    },
    lab: {
      bed() {
        tone(110, 2.4, "square", ambientBus, 0.012);
        tone(165, 2.2, "sine", ambientBus, 0.02);
      },
      tick() {
        if (Math.random() < 0.4) tone(600 + Math.random() * 800, 0.08, "square", ambientBus, 0.015);
        if (Math.random() < 0.3) noiseBurst(ambientBus, 0.12, 0.025, 1500, "bandpass", 3);
      },
    },
  };

  function startAmbient(biome, force = false) {
    const c = ensure();
    if (!c || muted) {
      currentBiome = biome;
      return;
    }
    if (!force && biome === currentBiome && ambientTimer) return;
    stopAmbient();
    currentBiome = biome;
    if (!unlocked) return;
    const pack = AMBIENT[biome] || AMBIENT.meadow;
    pack.bed();
    ambientTimer = setInterval(() => {
      if (muted || !unlocked) return;
      pack.tick();
      if (Math.random() < 0.2) pack.bed();
    }, 1600 + Math.random() * 900);
  }

  function setBiome(biome) {
    startAmbient(biome || "meadow");
  }

  // ---------- Famílias de voz ----------
  const FAMILY = {
    unicorn: "magic",
    dino: "dino",
    kitty: "cat",
    floide: "cat",
    tini: "dog",
    duck: "bird",
    pig: "pig",
    mole: "critter",
    bat: "bat",
    seal: "seal",
    monkey: "monkey",
    axolotl: "aqua",
    bee: "insect",
    butterfly: "insect",
    nini: "insect",
    lilica: "critter",
    elephant: "elephant",
    lion: "lion",
    racer: "car",
    botcar: "car",
    rocket: "rocket",
    heli: "heli",
    plane: "plane",
    train: "train",
    tractor: "tractor",
    boat: "boat",
    slime: "slime",
  };

  function hornTune(notes, gap = 0.12, peak = 0.22) {
    let t = ctx.currentTime;
    notes.forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
      o.connect(g);
      g.connect(voiceBus);
      o.start(t);
      o.stop(t + 0.14);
      t += gap;
    });
  }

  function engineRev(angry = false) {
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(angry ? 70 : 90, t0);
    o.frequency.linearRampToValueAtTime(angry ? 220 : 160, t0 + 0.35);
    if (angry) o.frequency.linearRampToValueAtTime(60, t0 + 0.55);
    const g = envGain(voiceBus, t0, 0.05, 0.25, angry ? 0.35 : 0.25, angry ? 0.22 : 0.14);
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = angry ? 900 : 600;
    o.connect(f);
    f.connect(g);
    o.start(t0);
    o.stop(t0 + 0.7);
    if (angry) noiseBurst(voiceBus, 0.2, 0.08, 200, "lowpass", 1);
  }

  function softChirp(base, count, up = true) {
    for (let i = 0; i < count; i++) {
      const f = up ? base * (1 + i * 0.12) : base * (1 - i * 0.08);
      setTimeout(() => tone(f, 0.09, "sine", voiceBus, 0.18), i * 90);
    }
  }

  function growl(base = 90) {
    tone(base, 0.45, "sawtooth", voiceBus, 0.16, base * 0.7);
    noiseBurst(voiceBus, 0.35, 0.06, base * 2, "lowpass", 1);
  }

  function whimper(base = 320) {
    tone(base, 0.35, "triangle", voiceBus, 0.14, base * 0.75);
    setTimeout(() => tone(base * 0.9, 0.3, "sine", voiceBus, 0.1, base * 0.65), 160);
  }

  function blub() {
    noiseBurst(voiceBus, 0.15, 0.1, 700, "bandpass", 2);
    tone(240, 0.2, "sine", voiceBus, 0.12, 120);
  }

  function VOICES(family, mood) {
    switch (family) {
      case "car":
        if (mood === "happy") return () => hornTune([440, 554, 659, 880]);
        if (mood === "mad") return () => engineRev(true);
        if (mood === "sad" || mood === "sick") return () => {
          tone(120, 0.5, "sawtooth", voiceBus, 0.1, 70);
          setTimeout(() => tone(90, 0.4, "sawtooth", voiceBus, 0.08, 50), 280);
        };
        if (mood === "sleep") return () => tone(60, 0.8, "sine", voiceBus, 0.06);
        return () => hornTune([392, 392], 0.16, 0.12);
      case "boat":
        if (mood === "happy") return () => hornTune([330, 392, 523], 0.18, 0.2);
        if (mood === "mad") return () => {
          noiseBurst(voiceBus, 0.4, 0.12, 180, "lowpass", 0.8);
          tone(80, 0.5, "sawtooth", voiceBus, 0.12, 140);
        };
        if (mood === "sad" || mood === "sick") return () => tone(220, 0.6, "sine", voiceBus, 0.1, 140);
        return () => hornTune([294], 0.2, 0.14);
      case "train":
        if (mood === "happy") return () => hornTune([392, 330, 392, 523], 0.14, 0.18);
        if (mood === "mad") return () => {
          tone(100, 0.3, "square", voiceBus, 0.12);
          noiseBurst(voiceBus, 0.35, 0.1, 200, "lowpass", 1);
        };
        return () => tone(480, 0.35, "sine", voiceBus, 0.14, 360);
      case "plane":
      case "heli":
        if (mood === "happy") return () => {
          tone(180, 0.5, "sawtooth", voiceBus, 0.1, 260);
          setTimeout(() => hornTune([660, 880], 0.12, 0.12), 200);
        };
        if (mood === "mad") return () => engineRev(true);
        return () => tone(140, 0.45, "sawtooth", voiceBus, 0.09, 170);
      case "rocket":
        if (mood === "happy") return () => {
          tone(200, 0.4, "sawtooth", voiceBus, 0.12, 600);
          noiseBurst(voiceBus, 0.35, 0.08, 800, "bandpass", 1);
        };
        if (mood === "mad") return () => {
          noiseBurst(voiceBus, 0.5, 0.14, 300, "lowpass", 0.7);
          tone(90, 0.5, "sawtooth", voiceBus, 0.14, 40);
        };
        return () => tone(300, 0.35, "sine", voiceBus, 0.1, 500);
      case "tractor":
        if (mood === "happy") return () => hornTune([262, 330, 392], 0.16, 0.16);
        if (mood === "mad") return () => engineRev(true);
        return () => tone(90, 0.4, "sawtooth", voiceBus, 0.1);
      case "lion":
        if (mood === "happy") return () => softChirp(280, 3, true);
        if (mood === "mad") return () => growl(75);
        if (mood === "sad" || mood === "sick") return () => whimper(200);
        if (mood === "sleep") return () => tone(90, 0.7, "sine", voiceBus, 0.07);
        return () => growl(100);
      case "cat":
        if (mood === "happy") return () => softChirp(700, 3, true);
        if (mood === "mad") return () => tone(500, 0.35, "sawtooth", voiceBus, 0.14, 280);
        if (mood === "sad" || mood === "sick") return () => whimper(500);
        return () => softChirp(600, 2, false);
      case "dog":
        if (mood === "happy") return () => {
          tone(420, 0.1, "square", voiceBus, 0.16);
          setTimeout(() => tone(520, 0.1, "square", voiceBus, 0.14), 120);
        };
        if (mood === "mad") return () => tone(180, 0.35, "sawtooth", voiceBus, 0.16);
        if (mood === "sad" || mood === "sick") return () => whimper(360);
        return () => tone(400, 0.12, "square", voiceBus, 0.12);
      case "bird":
        if (mood === "happy") return () => softChirp(900, 4, true);
        if (mood === "mad") return () => softChirp(600, 3, false);
        return () => softChirp(800, 2, true);
      case "insect":
        if (mood === "happy") return () => {
          tone(900, 0.15, "square", voiceBus, 0.08);
          setTimeout(() => tone(1100, 0.15, "square", voiceBus, 0.07), 100);
        };
        if (mood === "mad") return () => tone(700, 0.35, "sawtooth", voiceBus, 0.1, 500);
        return () => tone(1000, 0.2, "square", voiceBus, 0.06);
      case "aqua":
      case "seal":
        if (mood === "happy") return () => { blub(); setTimeout(blub, 140); };
        if (mood === "mad") return () => tone(160, 0.4, "sine", voiceBus, 0.14, 80);
        if (mood === "sad" || mood === "sick") return () => whimper(260);
        return () => blub();
      case "slime":
        if (mood === "happy") return () => {
          noiseBurst(voiceBus, 0.2, 0.1, 600, "bandpass", 2);
          tone(300, 0.2, "sine", voiceBus, 0.12, 450);
        };
        if (mood === "mad") return () => noiseBurst(voiceBus, 0.35, 0.12, 250, "lowpass", 1);
        return () => noiseBurst(voiceBus, 0.18, 0.08, 500, "bandpass", 2);
      case "dino":
        if (mood === "happy") return () => softChirp(200, 3, true);
        if (mood === "mad") return () => growl(60);
        return () => tone(150, 0.35, "sawtooth", voiceBus, 0.12, 120);
      case "elephant":
        if (mood === "happy") return () => tone(280, 0.45, "sine", voiceBus, 0.14, 420);
        if (mood === "mad") return () => tone(180, 0.5, "sawtooth", voiceBus, 0.16, 100);
        return () => tone(240, 0.4, "sine", voiceBus, 0.12, 180);
      case "monkey":
        if (mood === "happy") return () => softChirp(500, 4, true);
        if (mood === "mad") return () => softChirp(350, 3, false);
        return () => softChirp(450, 2, true);
      case "pig":
        if (mood === "happy") return () => softChirp(350, 3, true);
        if (mood === "mad") return () => growl(120);
        return () => tone(280, 0.25, "sawtooth", voiceBus, 0.12);
      case "bat":
        if (mood === "happy") return () => softChirp(1200, 3, true);
        if (mood === "mad") return () => tone(900, 0.3, "sawtooth", voiceBus, 0.1, 600);
        return () => tone(1100, 0.15, "sine", voiceBus, 0.08);
      case "magic":
        if (mood === "happy") return () => hornTune([523, 659, 784, 1046], 0.1, 0.12);
        if (mood === "mad") return () => tone(300, 0.4, "triangle", voiceBus, 0.12, 180);
        return () => tone(600, 0.3, "sine", voiceBus, 0.1, 800);
      case "critter":
      default:
        if (mood === "happy") return () => softChirp(480, 3, true);
        if (mood === "mad") return () => growl(140);
        if (mood === "sad" || mood === "sick") return () => whimper(300);
        if (mood === "sleep") return () => tone(160, 0.6, "sine", voiceBus, 0.06);
        return () => softChirp(400, 2, true);
    }
  }

  function speak(speciesId, mood, { force = false } = {}) {
    const c = ensure();
    if (!c || muted || !unlocked) return;
    const now = performance.now();
    const key = `${speciesId}:${mood}`;
    if (!force && key === lastMoodKey && now - lastVoiceAt < 2200) return;
    if (!force && now - lastVoiceAt < 450) return;
    lastVoiceAt = now;
    lastMoodKey = key;
    const family = FAMILY[speciesId] || "critter";
    const fn = VOICES(family, mood || "neutral");
    try { fn(); } catch (_) {}
  }

  function cue(name, speciesId) {
    const c = ensure();
    if (!c || muted || !unlocked) return;
    switch (name) {
      case "hatch":
        tone(400, 0.15, "sine", sfxBus, 0.2);
        setTimeout(() => tone(600, 0.15, "sine", sfxBus, 0.18), 100);
        setTimeout(() => tone(800, 0.25, "triangle", sfxBus, 0.2), 200);
        break;
      case "crack":
        noiseBurst(sfxBus, 0.12, 0.12, 2000, "bandpass", 3);
        break;
      case "feed":
        tone(320, 0.08, "sine", sfxBus, 0.12);
        setTimeout(() => tone(280, 0.08, "sine", sfxBus, 0.1), 90);
        setTimeout(() => tone(360, 0.1, "sine", sfxBus, 0.1), 180);
        break;
      case "drink":
        noiseBurst(sfxBus, 0.2, 0.08, 900, "bandpass", 2);
        break;
      case "bath":
        for (let i = 0; i < 4; i++) setTimeout(() => noiseBurst(sfxBus, 0.1, 0.06, 1400, "highpass", 1), i * 80);
        break;
      case "pet":
        tone(660, 0.12, "sine", sfxBus, 0.12);
        setTimeout(() => tone(880, 0.15, "sine", sfxBus, 0.1), 100);
        break;
      case "play":
        hornTune([523, 659, 784], 0.1, 0.1);
        break;
      case "sleep":
        tone(220, 0.4, "sine", sfxBus, 0.08, 160);
        setTimeout(() => tone(180, 0.5, "sine", sfxBus, 0.06, 120), 300);
        break;
      case "wake":
        tone(520, 0.15, "triangle", sfxBus, 0.12);
        setTimeout(() => tone(780, 0.2, "triangle", sfxBus, 0.1), 120);
        break;
      case "heal":
        tone(400, 0.12, "sine", sfxBus, 0.1);
        setTimeout(() => tone(600, 0.12, "sine", sfxBus, 0.1), 100);
        setTimeout(() => tone(800, 0.18, "sine", sfxBus, 0.12), 200);
        break;
      case "urgency":
        speak(speciesId, "sad", { force: true });
        break;
      case "ui":
        tone(700, 0.05, "sine", sfxBus, 0.06);
        break;
      default:
        break;
    }
  }

  function tickNeeds(speciesId, needs) {
    if (!needs || !speciesId || muted || !unlocked) return;
    const now = performance.now();
    if (now - lastVoiceAt < 5000) return;
    const lows = ["hunger", "thirst", "love", "energy", "hygiene", "health"].filter((k) => needs[k] < 28);
    if (!lows.length) return;
    if (needs.health < 28) speak(speciesId, "sick", { force: true });
    else if (needs.love < 22 || needs.hunger < 22) speak(speciesId, "sad", { force: true });
    else speak(speciesId, "neutral", { force: true });
  }

  // UI mute + unlock
  function bindUI() {
    document.documentElement.dataset.sound = muted ? "off" : "on";
    const unlockOnce = () => unlock();
    ["pointerdown", "keydown", "touchstart"].forEach((ev) => {
      window.addEventListener(ev, unlockOnce, { once: true, passive: true });
    });
    const btn = document.getElementById("btnMute");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleMute();
      });
      btn.querySelector(".i").textContent = muted ? "🔇" : "🔊";
      btn.setAttribute("aria-pressed", muted ? "true" : "false");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindUI);
  } else {
    bindUI();
  }

  window.PixelAudio = {
    unlock,
    setMuted,
    toggleMute,
    isMuted: () => muted,
    setBiome,
    speak,
    cue,
    tickNeeds,
  };
})();
