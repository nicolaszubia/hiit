(function () {
  "use strict";

  /**
   * Local demo auth only: credentials live in localStorage (readable on device).
   * SHA-256 when Web Crypto is available; weak fallback otherwise. No salt — not production-safe.
   */

  var PROFILE_KEY = "hiit-profile";
  var ACCOUNT_KEY = "hiit-account";
  var SESSION_KEY = "hiit-session";
  var SESSION_VALUE = "active";

  function loadProfile() {
    try {
      var raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function normalizeEmail(email) {
    return String(email || "")
      .trim()
      .toLowerCase();
  }

  function loadAccount() {
    try {
      var raw = localStorage.getItem(ACCOUNT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return null;
      if (!parsed.email || !parsed.passwordHash) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveAccount(account) {
    try {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    } catch (e) {}
  }

  function clearAccount() {
    try {
      localStorage.removeItem(ACCOUNT_KEY);
    } catch (e) {}
  }

  function startSession() {
    try {
      localStorage.setItem(SESSION_KEY, SESSION_VALUE);
      return localStorage.getItem(SESSION_KEY) === SESSION_VALUE;
    } catch (e) {
      return false;
    }
  }

  function endSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function isSessionActive() {
    try {
      return localStorage.getItem(SESSION_KEY) === SESSION_VALUE;
    } catch (e) {
      return false;
    }
  }

  /**
   * SHA-256 (UTF-8 bytes) in pure JS so login/signup match in Cursor Simple Browser,
   * file://, and any context where crypto.subtle is missing or rejects.
   */
  function sha256HexFromBytes(bytes) {
    var K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var L = bytes.length;
    var nPad = (64 - ((L + 1 + 8) % 64)) % 64;
    var total = L + 1 + nPad + 8;
    var m = new Uint8Array(total);
    m.set(bytes);
    m[L] = 0x80;
    var bitLen = L * 8;
    var dv = new DataView(m.buffer);
    dv.setUint32(total - 8, Math.floor(bitLen / 0x100000000), false);
    dv.setUint32(total - 4, bitLen >>> 0, false);

    function rotr(n, x) {
      x = x >>> 0;
      return (((x >>> n) | (x << (32 - n))) >>> 0);
    }
    function ch(x, y, z) {
      return ((x & y) ^ (~x & z)) >>> 0;
    }
    function maj(x, y, z) {
      return ((x & y) ^ (x & z) ^ (y & z)) >>> 0;
    }
    function sig0(x) {
      return (rotr(2, x) ^ rotr(13, x) ^ rotr(22, x)) >>> 0;
    }
    function sig1(x) {
      return (rotr(6, x) ^ rotr(11, x) ^ rotr(25, x)) >>> 0;
    }
    function gam0(x) {
      return (rotr(7, x) ^ rotr(18, x) ^ (x >>> 3)) >>> 0;
    }
    function gam1(x) {
      return (rotr(17, x) ^ rotr(19, x) ^ (x >>> 10)) >>> 0;
    }

    var i;
    var j;
    for (i = 0; i < total; i += 64) {
      var w = new Uint32Array(64);
      for (j = 0; j < 16; j++) {
        w[j] =
          (m[i + j * 4] << 24) | (m[i + j * 4 + 1] << 16) | (m[i + j * 4 + 2] << 8) | m[i + j * 4 + 3];
        w[j] >>>= 0;
      }
      for (j = 16; j < 64; j++) {
        w[j] = (gam1(w[j - 2]) + w[j - 7] + gam0(w[j - 15]) + w[j - 16]) >>> 0;
      }
      var a = H[0],
        b = H[1],
        c = H[2],
        d = H[3],
        e = H[4],
        f = H[5],
        g = H[6],
        h = H[7];
      for (j = 0; j < 64; j++) {
        var T1 = (h + sig1(e) + ch(e, f, g) + K[j] + w[j]) >>> 0;
        var T2 = (sig0(a) + maj(a, b, c)) >>> 0;
        h = g;
        g = f;
        f = e;
        e = (d + T1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (T1 + T2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0;
      H[1] = (H[1] + b) >>> 0;
      H[2] = (H[2] + c) >>> 0;
      H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0;
      H[5] = (H[5] + f) >>> 0;
      H[6] = (H[6] + g) >>> 0;
      H[7] = (H[7] + h) >>> 0;
    }
    var hex = "";
    for (i = 0; i < 8; i++) {
      hex += ("00000000" + H[i].toString(16)).slice(-8);
    }
    return hex;
  }

  function legacyDemoHash(password) {
    var h = 5381;
    for (var i = 0; i < password.length; i++) {
      h = (h * 33) ^ password.charCodeAt(i);
    }
    return "demo-" + (h >>> 0).toString(16);
  }

  /**
   * @param {string} password
   * @returns {Promise<string>}
   */
  function hashPassword(password) {
    var enc = new TextEncoder().encode(password);
    return Promise.resolve(sha256HexFromBytes(enc));
  }

  function getAccountEmail() {
    var acc = loadAccount();
    return acc ? String(acc.email) : "";
  }

  function saveProfile(data) {
    var accEmail = getAccountEmail();
    var emailOut =
      isSessionActive() && accEmail ? accEmail : String(data.email || "").trim();
    var o = {
      firstName: String(data.firstName || "").trim(),
      lastName: String(data.lastName || "").trim(),
      age: String(data.age || "").trim(),
      gender: String(data.gender || "").trim(),
      country: String(data.country || "").trim(),
      email: emailOut,
      phone: String(data.phone || "").trim(),
      signedIn: true,
    };
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(o));
    } catch (e) {}
    return o;
  }

  function clearProfile() {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch (e) {}
  }

  function isSignedIn() {
    return isSessionActive();
  }

  function getInitials() {
    var p = loadProfile();
    var a = p ? (p.firstName || "").trim().charAt(0) : "";
    var b = p ? (p.lastName || "").trim().charAt(0) : "";
    var s = (a + b).toUpperCase();
    if (s) return s;
    var em = (p && (p.email || "").trim()) || getAccountEmail();
    var e = em.charAt(0);
    return e ? e.toUpperCase() : "";
  }

  function displayName() {
    var p = loadProfile();
    if (p) {
      var fn = (p.firstName || "").trim();
      var ln = (p.lastName || "").trim();
      if (fn || ln) return (fn + " " + ln).trim();
      if ((p.email || "").trim()) return (p.email || "").trim();
    }
    var ae = getAccountEmail();
    return ae || "";
  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ ok: boolean, error?: string }>}
   */
  function register(email, password) {
    var norm = normalizeEmail(email);
    if (!norm) return Promise.resolve({ ok: false, error: "Email is required." });
    if (loadAccount()) {
      return Promise.resolve({ ok: false, error: "An account already exists on this device. Log in instead." });
    }
    return hashPassword(password).then(function (hash) {
      saveAccount({ email: norm, passwordHash: hash });
      if (!startSession()) {
        return {
          ok: false,
          error: "Could not save your session. This preview browser may block storage — try Chrome or Safari at http://127.0.0.1:8766",
        };
      }
      return { ok: true };
    });
  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ ok: boolean, error?: string }>}
   */
  function login(email, password) {
    var norm = normalizeEmail(email);
    var acc = loadAccount();
    if (!acc) {
      return Promise.resolve({ ok: false, error: "No account found. Sign up first." });
    }
    if (normalizeEmail(acc.email) !== norm) {
      return Promise.resolve({ ok: false, error: "Email or password is incorrect." });
    }
    return hashPassword(password).then(function (hash) {
      var okHash = hash === acc.passwordHash;
      if (!okHash && String(acc.passwordHash).indexOf("demo-") === 0) {
        okHash = legacyDemoHash(password) === acc.passwordHash;
      }
      if (!okHash) {
        return { ok: false, error: "Email or password is incorrect." };
      }
      if (!startSession()) {
        return {
          ok: false,
          error: "Could not save your session. This preview browser may block storage — try Chrome or Safari at http://127.0.0.1:8766",
        };
      }
      return { ok: true };
    });
  }

  /**
   * Local-only recovery: there is no server to email a link, so the account email on this
   * device is the proof. Sets a new password and starts a session.
   * @param {string} email
   * @param {string} newPassword
   * @returns {Promise<{ ok: boolean, error?: string }>}
   */
  function resetPassword(email, newPassword) {
    var acc = loadAccount();
    if (!acc || normalizeEmail(acc.email) !== normalizeEmail(email)) {
      return Promise.resolve({ ok: false, error: "No account with that email on this device." });
    }
    return hashPassword(newPassword).then(function (hash) {
      saveAccount({ email: acc.email, passwordHash: hash });
      if (!startSession()) {
        return { ok: false, error: "Could not save your session. Check that this browser allows storage." };
      }
      return { ok: true };
    });
  }

  window.HiitUser = {
    resetPassword: resetPassword,
    loadProfile: loadProfile,
    saveProfile: saveProfile,
    clearProfile: clearProfile,
    loadAccount: loadAccount,
    getAccountEmail: getAccountEmail,
    isSignedIn: isSignedIn,
    isSessionActive: isSessionActive,
    startSession: startSession,
    endSession: endSession,
    register: register,
    login: login,
    hashPassword: hashPassword,
    normalizeEmail: normalizeEmail,
    clearAccount: clearAccount,
    getInitials: getInitials,
    displayName: displayName,
  };
})();
