/* ============================================================
   Animations - Reusable animation controllers
   ============================================================ */

const Animations = {

  // --- Step-through controller ---
  initStepThroughs() {
    document.querySelectorAll('.step-container').forEach(container => {
      const steps = container.querySelectorAll('.step-content > div');
      const nextBtn = container.querySelector('.btn-step-next');
      const prevBtn = container.querySelector('.btn-step-prev');
      const resetBtn = container.querySelector('.btn-reset');
      const indicator = container.querySelector('.step-indicator');
      let current = 0;

      const show = (idx) => {
        steps.forEach((s, i) => s.classList.toggle('active', i === idx));
        if (indicator) indicator.textContent = `${idx + 1} / ${steps.length}`;
        if (prevBtn) prevBtn.disabled = idx === 0;
        if (nextBtn) nextBtn.disabled = idx === steps.length - 1;
      };

      if (nextBtn) nextBtn.addEventListener('click', () => { if (current < steps.length - 1) show(++current); });
      if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) show(--current); });
      if (resetBtn) resetBtn.addEventListener('click', () => { current = 0; show(0); });

      show(0);
    });
  },

  // --- Reveal on scroll ---
  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('.lecture-section').forEach(el => observer.observe(el));
  },

  // --- Caesar wheel ---
  initCaesarWheel() {
    const wheel = document.getElementById('caesar-wheel');
    if (!wheel) return;

    const slider = document.getElementById('caesar-shift');
    const output = document.getElementById('caesar-output');
    const shiftLabel = document.getElementById('caesar-shift-label');
    const plaintext = 'HELLO WORLD';

    const update = () => {
      const shift = parseInt(slider.value);
      if (shiftLabel) shiftLabel.textContent = shift;
      if (output) output.textContent = CryptoUtils.caesarEncrypt(plaintext, shift);

      // Rotate outer ring of SVG wheel (use SVG native transform for reliability)
      const outerRing = wheel.querySelector('.outer-ring');
      if (outerRing) outerRing.setAttribute('transform', `rotate(${shift * (360 / 26)}, 150, 150)`);
    };

    if (slider) {
      slider.addEventListener('input', update);
      update();
    }
  },

  // --- Frequency analysis bars ---
  initFreqAnalysis() {
    const container = document.getElementById('freq-analysis');
    if (!container) return;

    const input = container.querySelector('.freq-input');
    const barsContainer = container.querySelector('.histogram');
    if (!barsContainer || !input) return;

    const updateBars = () => {
      const text = input.value || 'SAMPLE TEXT';
      const freq = CryptoUtils.letterFrequency(text);
      const bars = barsContainer.querySelectorAll('.bar');
      bars.forEach((bar, i) => {
        const letter = String.fromCharCode(65 + i);
        const pct = freq[letter] * 100;
        bar.style.height = `${Math.max(pct * 8, 2)}px`;
        bar.title = `${letter}: ${(pct).toFixed(1)}%`;
      });
    };

    input.addEventListener('input', updateBars);
    updateBars();
  },

  // --- AES round animation ---
  initAESAnimation() {
    const container = document.getElementById('aes-round-anim');
    if (!container) return;

    const steps = container.querySelectorAll('.aes-step');
    let current = -1;

    const animateNext = () => {
      current = (current + 1) % steps.length;
      steps.forEach((s, i) => s.classList.toggle('active', i <= current));
    };

    const btn = container.querySelector('.btn-step');
    if (btn) btn.addEventListener('click', animateNext);
  },

  // --- Vigenere step animation ---
  initVigenereAnim() {
    const container = document.getElementById('vigenere-anim');
    if (!container) return;

    const plaintext = 'ATTACKATDAWN';
    const key = 'LEMON';
    const cells = container.querySelectorAll('.vig-cell');
    const resultCells = container.querySelectorAll('.vig-result');
    let step = -1;

    const showStep = () => {
      step = Math.min(step + 1, plaintext.length - 1);
      for (let i = 0; i <= step; i++) {
        if (cells[i]) cells[i].classList.add('revealed');
        if (resultCells[i]) {
          const p = plaintext.charCodeAt(i) - 65;
          const k = key.charCodeAt(i % key.length) - 65;
          resultCells[i].textContent = String.fromCharCode((p + k) % 26 + 65);
          resultCells[i].classList.add('revealed');
        }
      }
    };

    const btn = container.querySelector('.btn-step');
    if (btn) btn.addEventListener('click', showStep);
  },

  // --- LCG animation ---
  updateLCGScatter() {
    const canvas = document.getElementById('lcg-scatter');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';

    const a = 89, c = 2, m = 101;
    let seed = 42;
    const values = [seed];
    for (let i = 0; i < 500; i++) {
        seed = CryptoUtils.lcg(seed, a, c, m);
        values.push(seed);

    }


    for (let i = 0; i < values.length - 1; i++) {

      const x = (values[i] / m) * w;
      const y = (values[i + 1] / m) * h;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // --- Avalanche effect demo ---
  initAvalanche() {
    const container = document.getElementById('avalanche-demo');
    if (!container) return;

    const input = container.querySelector('.avalanche-input');
    const hash1El = container.querySelector('.hash-original');
    const hash2El = container.querySelector('.hash-flipped');
    const diffEl = container.querySelector('.hash-diff');

    const update = () => {
      const text = input.value || 'Hello';
      const flipped = CryptoUtils.flipBit(text, 0);
      const h1 = CryptoUtils.simpleHash(text);
      const h2 = CryptoUtils.simpleHash(flipped);

      if (hash1El) hash1El.textContent = h1;
      if (hash2El) hash2El.textContent = h2;

      // Count differing bits
      const v1 = parseInt(h1, 16);
      const v2 = parseInt(h2, 16);
      let diff = v1 ^ v2;
      let bits = 0;
      while (diff) { bits += diff & 1; diff >>= 1; }
      if (diffEl) diffEl.textContent = `${bits} bits differ`;
    };

    if (input) {
      input.addEventListener('input', update);
      update();
    }
  },

  // --- XOR visual demo ---
  initXORDemo() {
    const container = document.getElementById('xor-demo');
    if (!container) return;

    const inputA = container.querySelector('.xor-input-a');
    const inputB = container.querySelector('.xor-input-b');
    const resultEl = container.querySelector('.xor-result');

    const update = () => {
      const a = parseInt(inputA.value, 2) || 0;
      const b = parseInt(inputB.value, 2) || 0;
      const r = a ^ b;
      if (resultEl) resultEl.textContent = r.toString(2).padStart(8, '0');
    };

    if (inputA) inputA.addEventListener('input', update);
    if (inputB) inputB.addEventListener('input', update);
  },

  // --- RSA live example ---
  initRSADemo() {
    const container = document.getElementById('rsa-demo');
    if (!container) return;

    const computeBtn = container.querySelector('.btn-rsa-compute');
    if (!computeBtn) return;

    computeBtn.addEventListener('click', () => {
      const p = parseInt(container.querySelector('.rsa-p').value) || 61;
      const q = parseInt(container.querySelector('.rsa-q').value) || 53;
      const e = parseInt(container.querySelector('.rsa-e').value) || 17;
      const msg = parseInt(container.querySelector('.rsa-msg').value) || 65;

      const n = p * q;
      const phi = (p - 1) * (q - 1);
      const d = CryptoUtils.modInverse(e, phi);
      const encrypted = CryptoUtils.modPow(msg, e, n);
      const decrypted = CryptoUtils.modPow(encrypted, d, n);

      const results = container.querySelector('.rsa-results');
      if (results) {
        results.innerHTML = `
          <div class="formula-step revealed"><span class="formula-step-num">1</span><div><strong>n = p * q</strong> = ${p} * ${q} = <span class="text-cyan">${n}</span></div></div>
          <div class="formula-step revealed"><span class="formula-step-num">2</span><div><strong>phi(n) = (p-1)(q-1)</strong> = ${p - 1} * ${q - 1} = <span class="text-cyan">${phi}</span></div></div>
          <div class="formula-step revealed"><span class="formula-step-num">3</span><div><strong>d = e^-1 mod phi(n)</strong> = ${e}^-1 mod ${phi} = <span class="text-cyan">${d}</span></div></div>
          <div class="formula-step revealed"><span class="formula-step-num">4</span><div><strong>Encrypt: c = m<sup>e</sup> mod n</strong> = ${msg}<sup>${e}</sup> mod ${n} = <span class="text-pink">${encrypted}</span></div></div>
          <div class="formula-step revealed"><span class="formula-step-num">5</span><div><strong>Decrypt: m = c<sup>d</sup> mod n</strong> = ${encrypted}<sup>${d}</sup> mod ${n} = <span class="text-green">${decrypted}</span></div></div>
        `;
      }
    });
  },

  // --- Encoding converter ---
  initEncodingConverter() {
    const input = document.getElementById('encoding-input');
    if (!input) return;

    const update = () => {
      const ch = input.value.charAt(0) || 'A';
      const enc = CryptoUtils.charToEncodings(ch);
      const dec = document.getElementById('enc-decimal');
      const bin = document.getElementById('enc-binary');
      const hex = document.getElementById('enc-hex');
      const b64 = document.getElementById('enc-base64');
      if (dec) dec.textContent = enc.decimal;
      if (bin) bin.textContent = enc.binary;
      if (hex) hex.textContent = enc.hex;
      if (b64) b64.textContent = enc.base64;
    };

    input.addEventListener('input', update);
    update();
  },

  // --- Initialize all ---
  initAll() {
    this.initScrollReveal();
    this.initStepThroughs();
    this.initCaesarWheel();
    this.initFreqAnalysis();
    this.initAESAnimation();
    this.initVigenereAnim();
    this.updateLCGScatter();
    this.initAvalanche();
    this.initXORDemo();
    this.initRSADemo();
    this.initEncodingConverter();
  }
};
