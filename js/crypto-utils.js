/* ============================================================
   Crypto Utility Functions
   ============================================================ */

const CryptoUtils = {
  // --- Caesar / ROT ---
  caesarEncrypt(text, shift) {
    return text.split('').map(ch => {
      if (ch >= 'A' && ch <= 'Z') return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
      if (ch >= 'a' && ch <= 'z') return String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26 + 26) % 26 + 97);
      return ch;
    }).join('');
  },



  charToEncodings(ch) {
    const code = ch.charCodeAt(0);
    return {
      char: ch,
      decimal: code,
      binary: code.toString(2).padStart(8, '0'),
      hex: code.toString(16).padStart(2, '0').toUpperCase(),
      base64: btoa(ch),
    };
  },

  // --- Modular arithmetic for RSA ---
  modPow(base, exp, mod) {
    base = BigInt(base); exp = BigInt(exp); mod = BigInt(mod);
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
      if (exp % 2n === 1n) result = (result * base) % mod;
      exp = exp / 2n;
      base = (base * base) % mod;
    }
    return Number(result);
  },

  modInverse(a, m) {
    let [old_r, r] = [a, m];
    let [old_s, s] = [1, 0];
    while (r !== 0) {
      const q = Math.floor(old_r / r);
      [old_r, r] = [r, old_r - q * r];
      [old_s, s] = [s, old_s - q * s];
    }
    return ((old_s % m) + m) % m;
  },

  // --- LCG bs ---
  lcg(seed, a, c, m) {
    return (a * seed + c) % m;
  },



  // --- Frequency analysis ---
  letterFrequency(text) {
    const freq = {};
    for (let i = 0; i < 26; i++) freq[String.fromCharCode(65 + i)] = 0;
    let total = 0;
    for (const ch of text.toUpperCase()) {
      if (ch >= 'A' && ch <= 'Z') { freq[ch]++; total++; }
    }
    for (const k in freq) freq[k] = total > 0 ? freq[k] / total : 0;
    return freq;
  },

  // English letter frequency 
  englishFrequency: {
    A: 0.082, B: 0.015, C: 0.028, D: 0.043, E: 0.127,
    F: 0.022, G: 0.020, H: 0.061, I: 0.070, J: 0.002,
    K: 0.008, L: 0.040, M: 0.024, N: 0.067, O: 0.075,
    P: 0.019, Q: 0.001, R: 0.060, S: 0.063, T: 0.091,
    U: 0.028, V: 0.010, W: 0.023, X: 0.002, Y: 0.020, Z: 0.001
  },

  // Simple hash (djb2) 
  simpleHash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & 0xFFFFFFFF;
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  },

  // Avalanche demo: flip one bit
  flipBit(str, pos) {
    const chars = str.split('');
    const idx = pos % str.length;
    chars[idx] = String.fromCharCode(chars[idx].charCodeAt(0) ^ 1);
    return chars.join('');
  }
};
