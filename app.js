/**
 * VIRTUAL OFRENDA — APPLICATION CONTROLLER
 * Día de los Muertos Altar & Ghost in the Machine
 * Offline Web Audio, Particle Physics, & Local Ollama Integration
 */

(function () {
  'use strict';

  // --- 1. LOCAL STORAGE STATE & SEED DATA ---
  const STORAGE_SOULS = 'virtual_ofrenda_souls_v2';
  const STORAGE_OFFERINGS = 'virtual_ofrenda_offerings_v2';

  const defaultSouls = [
    {
      id: 'dennis-ritchie',
      name: 'Dennis Ritchie',
      years: '1941 – 2011',
      category: 'pioneer',
      photo: '',
      eulogy: 'Architect of the C language and Unix. In the silence of our terminals and the foundation of all modern computation, your quiet ghost lingers forever.',
      offerings: ['ANSI C Standard', 'PDP-11 manual', 'Black Coffee'],
      lit: true
    },
    {
      id: 'ada-lovelace',
      name: 'Ada Lovelace',
      years: '1815 – 1852',
      category: 'pioneer',
      photo: '',
      eulogy: 'The enchantress of numbers who foresaw algorithmic music, poetry, and machine intelligence long before the first silicon circuit was drawn.',
      offerings: ['Analytical Engine Notes', 'Marigolds', 'Poetry'],
      lit: true
    }
  ];

  let souls = [];
  let placedOfferings = [];

  function loadState() {
    const rawSouls = localStorage.getItem(STORAGE_SOULS);
    souls = rawSouls ? JSON.parse(rawSouls) : defaultSouls;

    const rawOff = localStorage.getItem(STORAGE_OFFERINGS);
    placedOfferings = rawOff ? JSON.parse(rawOff) : [
      { id: 'off-1', type: 'pan', name: 'Pan de Muerto', emoji: '🍞', tier: 2 },
      { id: 'off-2', type: 'marigold', name: 'Marigolds', emoji: '🌼', tier: 2 },
      { id: 'off-3', type: 'floppy', name: 'Floppy Disk', emoji: '💾', tier: 2 }
    ];
  }

  function saveState() {
    localStorage.setItem(STORAGE_SOULS, JSON.stringify(souls));
    localStorage.setItem(STORAGE_OFFERINGS, JSON.stringify(placedOfferings));
  }

  // --- 2. SYNTHESIZED WEB AUDIO ENGINE (ZERO EXTERNAL ASSETS) ---
  class AltarAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.masterGain = null;
      this.droneOsc1 = null;
      this.droneOsc2 = null;
      this.lfo = null;
      this.noiseNode = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    setVolume(val) {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(parseFloat(val), this.ctx.currentTime, 0.05);
      }
    }

    startDrone() {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Root Drone: 108Hz (Sacred Harmonic Frequency)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(108, this.ctx.currentTime);

      // Fifth Harmonic: 162Hz
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(162, this.ctx.currentTime);

      // LFO for slow atmospheric breathing
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // slow cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(4.0, this.ctx.currentTime);
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.droneOsc1.frequency);

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      this.droneOsc1.connect(droneGain);
      this.droneOsc2.connect(droneGain);
      droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.lfo.start();

      this.startCandleCrackle();
      this.isPlaying = true;
    }

    startCandleCrackle() {
      // Pink/Brown noise bandpass synthesis for flickering candle hearth
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      noise.start();
      this.noiseNode = noise;
    }

    stopDrone() {
      if (!this.isPlaying) return;
      try {
        if (this.droneOsc1) this.droneOsc1.stop();
        if (this.droneOsc2) this.droneOsc2.stop();
        if (this.lfo) this.lfo.stop();
        if (this.noiseNode) this.noiseNode.stop();
      } catch (e) {
        console.warn(e);
      }
      this.isPlaying = false;
    }

    playChime(freq = 528) {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.5);
    }
  }

  const audio = new AltarAudioEngine();

  // --- 3. DUAL-LAYER ATMOSPHERE CANVAS: CEMPASÚCHIL PETALS & COPAL SMOKE ---
  const canvas = document.getElementById('atmosphereCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const petals = [];
  const smokeParticles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Petal {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : -20;
      this.size = 7 + Math.random() * 9;
      this.speedY = 0.8 + Math.random() * 1.4;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.8;
      this.color = Math.random() > 0.3 ? '#ff9900' : '#ff5500';
      this.alpha = 0.5 + Math.random() * 0.45;
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) + this.speedX;
      this.rotation += this.rotSpeed;
      if (this.y > height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class SmokeParticle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 20;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = -0.7 - Math.random() * 0.8;
      this.radius = 4 + Math.random() * 5;
      this.alpha = 0.22;
      this.growth = 0.08;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.radius += this.growth;
      this.alpha -= 0.0018;
    }
    draw() {
      ctx.save();
      ctx.fillStyle = '#bfa3d9';
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate Initial Petals
  for (let i = 0; i < 45; i++) {
    petals.push(new Petal());
  }

  function renderAtmosphere() {
    ctx.clearRect(0, 0, width, height);

    // Update & Draw Cempasúchil Petals
    petals.forEach(p => {
      p.update();
      p.draw();
    });

    // Spawn Copal smoke near bottom altar tier
    if (Math.random() < 0.25) {
      smokeParticles.push(new SmokeParticle(width * 0.5, height - 120));
    }

    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      const sp = smokeParticles[i];
      sp.update();
      sp.draw();
      if (sp.alpha <= 0) smokeParticles.splice(i, 1);
    }

    requestAnimationFrame(renderAtmosphere);
  }
  requestAnimationFrame(renderAtmosphere);

  // --- 4. ALTAR RENDERING & ILLUMINATION LOGIC ---
  const lightField = document.getElementById('lightField');
  const soulsGrid = document.getElementById('soulsGrid');
  const tier2Offerings = document.getElementById('tier2Offerings');
  const activeOfferingCounter = document.getElementById('activeOfferingCounter');

  function updateAltarIllumination() {
    const litSoulsCount = souls.filter(s => s.lit).length;
    const baseLight = 0.06;
    const candleFactor = litSoulsCount * 0.035;
    const totalGlow = Math.min(0.42, baseLight + candleFactor);

    lightField.style.background = `radial-gradient(circle at 50% 35%, rgba(255, 140, 0, ${totalGlow}) 0%, rgba(10, 5, 16, 0.96) 80%)`;
  }

  function renderAltar() {
    // Render Souls in Tier 1
    soulsGrid.innerHTML = '';
    souls.forEach(soul => {
      const card = document.createElement('div');
      card.className = 'soul-card';
      card.id = `card-${soul.id}`;

      const tagsHtml = (soul.offerings || [])
        .map(t => `<span class="soul-tag">🌼 ${escapeHtml(t.trim())}</span>`)
        .join('');

      card.innerHTML = `
        <div class="soul-top-bar">
          <span class="candle-votive ${soul.lit ? '' : 'unlit'}" data-id="${soul.id}" title="${soul.lit ? 'Flama encendida' : 'Click to light candle'}">🕯️</span>
          <button class="btn-mini remove-soul" data-id="${soul.id}" title="Remove soul from altar">&times;</button>
        </div>
        <div class="soul-frame">
          ${soul.photo
            ? `<img src="${soul.photo}" alt="${escapeHtml(soul.name)}" />`
            : `<span class="soul-frame-placeholder">${soul.category === 'companion' ? '🐾' : soul.category === 'pioneer' ? '💾' : '💀'}</span>`}
        </div>
        <h3 class="soul-title">${escapeHtml(soul.name)}</h3>
        <div class="soul-years">${escapeHtml(soul.years || 'Eterno')}</div>
        <div class="soul-eulogy">"${escapeHtml(soul.eulogy)}"</div>
        <div class="soul-tags">${tagsHtml}</div>
        <div class="soul-card-actions">
          <button class="btn-mini keepsake-btn" data-id="${soul.id}">🖨️ Keepsake</button>
          <button class="btn-mini bell-btn" data-id="${soul.id}">🔔 Bell Chime</button>
        </div>
      `;
      soulsGrid.appendChild(card);
    });

    // Render Placed Offerings in Tier 2
    tier2Offerings.innerHTML = '';
    placedOfferings.forEach(item => {
      const el = document.createElement('div');
      el.className = 'placed-offering';
      el.innerHTML = `
        <span style="font-size: 1.3rem;">${item.emoji}</span>
        <span style="font-size: 0.8rem; font-family: var(--font-sans); color: var(--marigold);">${escapeHtml(item.name)}</span>
        <span class="remove-offering" data-id="${item.id}" title="Remove offering">&times;</span>
      `;
      tier2Offerings.appendChild(el);
    });

    activeOfferingCounter.textContent = `Offerings Placed: ${placedOfferings.length}`;
    updateAltarIllumination();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t));
  }

  // --- 5. INTERACTIVE OFFERINGS (TAP & DRAG-AND-DROP) ---
  const deckItems = document.querySelectorAll('.deck-item');
  const altarTiers = document.querySelectorAll('.altar-tier');

  deckItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        type: item.dataset.type,
        name: item.querySelector('.item-name').textContent,
        emoji: item.querySelector('.item-emoji').textContent
      }));
    });

    // Click / Tap to automatically add to Tier 2
    item.addEventListener('click', () => {
      addOffering({
        type: item.dataset.type,
        name: item.querySelector('.item-name').textContent,
        emoji: item.querySelector('.item-emoji').textContent
      }, 2);
    });
  });

  altarTiers.forEach(tier => {
    tier.addEventListener('dragover', (e) => {
      e.preventDefault();
      tier.classList.add('tier-hover');
    });
    tier.addEventListener('dragleave', () => {
      tier.classList.remove('tier-hover');
    });
    tier.addEventListener('drop', (e) => {
      e.preventDefault();
      tier.classList.remove('tier-hover');
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        addOffering(data, parseInt(tier.dataset.tier, 10));
      } catch (err) {
        console.warn('Drop parse error', err);
      }
    });
  });

  function addOffering(itemData, tierNum) {
    placedOfferings.push({
      id: 'off-' + Date.now(),
      type: itemData.type,
      name: itemData.name,
      emoji: itemData.emoji,
      tier: tierNum
    });
    audio.playChime(640);
    saveState();
    renderAltar();
  }

  // Remove individual placed offering
  tier2Offerings.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-offering')) {
      const id = e.target.dataset.id;
      placedOfferings = placedOfferings.filter(o => o.id !== id);
      saveState();
      renderAltar();
    }
  });

  // Toggle Candle Flames on Soul Cards
  soulsGrid.addEventListener('click', (e) => {
    const candle = e.target.closest('.candle-votive');
    if (candle) {
      const id = candle.dataset.id;
      const s = souls.find(x => x.id === id);
      if (s) {
        s.lit = !s.lit;
        audio.playChime(s.lit ? 720 : 360);
        saveState();
        renderAltar();
      }
      return;
    }

    const removeBtn = e.target.closest('.remove-soul');
    if (removeBtn) {
      const id = removeBtn.dataset.id;
      if (confirm('Return this soul to the beyond?')) {
        souls = souls.filter(x => x.id !== id);
        saveState();
        renderAltar();
      }
      return;
    }

    const keepsakeBtn = e.target.closest('.keepsake-btn');
    if (keepsakeBtn) {
      const id = keepsakeBtn.dataset.id;
      const soul = souls.find(x => x.id === id);
      if (soul) openKeepsake(soul);
      return;
    }

    const bellBtn = e.target.closest('.bell-btn');
    if (bellBtn) {
      audio.playChime(880);
    }
  });

  // Element Tier: Votive Rack Candles
  const votiveRack = document.getElementById('votiveRack');
  votiveRack.addEventListener('click', (e) => {
    const candle = e.target.closest('.votive-candle');
    if (candle) {
      candle.classList.toggle('unlit');
      const isLit = !candle.classList.contains('unlit');
      audio.playChime(isLit ? 660 : 330);
    }
  });

  // --- 6. AI POETRY & CALAVERITA SYNTHESIS (LOCAL OLLAMA + PROCEDURAL FALLBACK) ---
  const soulNameInput = document.getElementById('soulName');
  const soulCategoryInput = document.getElementById('soulCategory');
  const soulEulogyArea = document.getElementById('soulEulogy');
  const ollamaHostInput = document.getElementById('ollamaHost');
  const ollamaModelInput = document.getElementById('ollamaModel');

  async function queryLocalOllama(systemPrompt, userPrompt) {
    const host = ollamaHostInput.value.trim() || 'http://localhost:11434';
    const model = ollamaModelInput.value.trim() || 'llama3.2:1b';

    const resp = await fetch(`${host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
        options: { temperature: 0.85, num_predict: 90 }
      })
    });
    if (!resp.ok) throw new Error('Ollama offline');
    const data = await resp.json();
    return data.response.trim();
  }

  // Procedural Poetry Fallbacks (Instant offline execution without Ollama)
  function proceduralPoem(style, name, category) {
    const n = name || 'Nuestro Ser Querido';
    if (style === 'calaverita') {
      return `Llegó la Catrina Catrina buscando el compás,\ny al ver a ${n} le dijo: ¡no escaparás!\nMas con mariposas y pan de azahar,\nsu alegre memoria no deja de brillar.`;
    } else if (style === 'cyberpunk') {
      return `0xDECEASED: While hardware crumbles and threads terminate,\n${n}'s core logic persists within our open state.\nA ghost in the silicon, unfettered by time,\nCompiled in memory, enduring and sublime.`;
    } else {
      return `In honor of ${n}, whose steps illuminated our path and whose warmth remains tenderly woven into our days. The journey beyond is long, but tonight, your flame burns bright upon our altar.`;
    }
  }

  async function triggerPoemGeneration(style) {
    const name = soulNameInput.value.trim();
    const cat = soulCategoryInput.value;
    const originalText = soulEulogyArea.value;

    soulEulogyArea.value = '🕯️ Channelling verses through the veil...';

    const systemPrompt = `You are a bilingual poet honoring spirits on Día de los Muertos and the "Ghost in the Machine" open innovation memorial. Write a short 3-line tribute. Keep it concise, heartfelt, and poetic.`;
    const userPrompt = `Write a ${style} verse for ${name || 'an honored soul'} who is a ${cat}.`;

    try {
      const generated = await queryLocalOllama(systemPrompt, userPrompt);
      soulEulogyArea.value = generated;
    } catch (err) {
      // Fallback seamlessly to built-in generator
      soulEulogyArea.value = proceduralPoem(style, name, cat);
    }
  }

  document.getElementById('genCalaveritaBtn').addEventListener('click', () => triggerPoemGeneration('calaverita'));
  document.getElementById('genCyberpunkBtn').addEventListener('click', () => triggerPoemGeneration('cyberpunk'));
  document.getElementById('genSolemnBtn').addEventListener('click', () => triggerPoemGeneration('solemn'));

  // Photo Upload Client-Side Image Compression (prevents localStorage overflows)
  const photoFileInput = document.getElementById('photoFile');
  const photoDataUrl = document.getElementById('photoDataUrl');

  photoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = (h * maxDim) / w;
          w = maxDim;
        } else if (h > maxDim) {
          w = (w * maxDim) / h;
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        photoDataUrl.value = canvas.toDataURL('image/jpeg', 0.8);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // --- 7. MODALS, TOOLBAR, & KEEPSAKE CONTROLS ---
  const soulModal = document.getElementById('soulModal');
  const addSoulBtn = document.getElementById('addSoulBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const soulForm = document.getElementById('soulForm');

  addSoulBtn.addEventListener('click', () => {
    soulForm.reset();
    photoDataUrl.value = '';
    soulModal.classList.add('active');
  });

  [closeModalBtn, cancelModalBtn].forEach(b => {
    b.addEventListener('click', () => soulModal.classList.remove('active'));
  });

  soulForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = soulNameInput.value.trim();
    const years = document.getElementById('soulYears').value.trim();
    const category = soulCategoryInput.value;
    const eulogy = soulEulogyArea.value.trim();
    const offeringsRaw = document.getElementById('soulOfferings').value.trim();
    const offerings = offeringsRaw ? offeringsRaw.split(',').filter(Boolean) : [];

    souls.unshift({
      id: 'soul-' + Date.now(),
      name,
      years,
      category,
      photo: photoDataUrl.value || '',
      eulogy,
      offerings,
      lit: true
    });

    audio.playChime(784);
    saveState();
    renderAltar();
    soulModal.classList.remove('active');
  });

  // Audio Toolbar Toggle & Volume
  const toggleMusicBtn = document.getElementById('toggleMusicBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');
  const volumeSlider = document.getElementById('volumeSlider');

  toggleMusicBtn.addEventListener('click', () => {
    if (audio.isPlaying) {
      audio.stopDrone();
      soundIcon.textContent = '🔇';
      soundLabel.textContent = 'Atmospheric Drone (Off)';
    } else {
      audio.startDrone();
      soundIcon.textContent = '🕯️';
      soundLabel.textContent = 'Atmospheric Drone (Active)';
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    audio.setVolume(e.target.value);
  });

  // JSON Export / Import
  document.getElementById('exportBtn').addEventListener('click', () => {
    const bundle = { souls, placedOfferings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ofrenda-memorial-archive-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bundle = JSON.parse(event.target.result);
        if (bundle.souls) souls = bundle.souls;
        if (bundle.placedOfferings) placedOfferings = bundle.placedOfferings;
        saveState();
        renderAltar();
        alert('Memorial archive successfully restored.');
      } catch (err) {
        alert('Invalid JSON archive format.');
      }
    };
    reader.readAsText(file);
  });

  // Keepsake Parchment Modal
  const keepsakeModal = document.getElementById('keepsakeModal');
  const closeKeepsakeBtn = document.getElementById('closeKeepsakeBtn');
  const printCardBtn = document.getElementById('printCardBtn');

  function openKeepsake(soul) {
    document.getElementById('kName').textContent = soul.name;
    document.getElementById('kYears').textContent = soul.years || 'Recuerdo Eterno';
    document.getElementById('kEulogy').textContent = `"${soul.eulogy}"`;

    const photoWrap = document.getElementById('kPhotoWrap');
    const photoImg = document.getElementById('kPhoto');
    if (soul.photo) {
      photoImg.src = soul.photo;
      photoWrap.style.display = 'block';
    } else {
      photoWrap.style.display = 'none';
    }

    const offWrap = document.getElementById('kOfferings');
    offWrap.innerHTML = (soul.offerings || []).map(o => `<span>🌼 ${escapeHtml(o.trim())}</span>`).join('');

    keepsakeModal.classList.add('active');
  }

  closeKeepsakeBtn.addEventListener('click', () => keepsakeModal.classList.remove('active'));
  printCardBtn.addEventListener('click', () => window.print());

  // Initial Load
  loadState();
  renderAltar();
})();
