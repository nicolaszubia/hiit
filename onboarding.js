(function () {
  "use strict";

  /**
   * Sign-up onboarding modal: age (− N +) and level of complexity (1–5 slider).
   * Shown by auth.js right after the account is created; saving sends the user to the home page.
   */

  var modal;
  var form;
  var ageInput;
  var decBtn;
  var incBtn;
  var ageError;
  var levelInput;
  var minAge;
  var maxAge;
  var lastValidAge;
  var ageErrorShown = false;

  function $(id) {
    return document.getElementById(id);
  }

  function tf(key, vars) {
    return window.HiitI18n && window.HiitI18n.tf ? window.HiitI18n.tf(key, vars) : key;
  }

  /** The typed age as an integer, or null when empty, non-numeric or out of range. */
  function parseAge() {
    var raw = ageInput.value.trim();
    if (!/^\d+$/.test(raw)) return null;
    var n = parseInt(raw, 10);
    return n >= minAge && n <= maxAge ? n : null;
  }

  function syncStepper() {
    var n = parseAge();
    if (n !== null) lastValidAge = n;
    decBtn.disabled = lastValidAge <= minAge;
    incBtn.disabled = lastValidAge >= maxAge;
  }

  function renderAgeError() {
    ageError.textContent = ageErrorShown ? tf("onboard_err_age", { min: minAge, max: maxAge }) : "";
  }

  function clearAgeError() {
    ageErrorShown = false;
    renderAgeError();
  }

  function stepAge(delta) {
    var base = parseAge();
    if (base === null) base = lastValidAge;
    ageInput.value = String(Math.min(maxAge, Math.max(minAge, base + delta)));
    clearAgeError();
    syncStepper();
  }

  function open() {
    if (!modal) return;
    var page = document.querySelector(".auth-split");
    // inert keeps keyboard focus and screen readers inside the modal.
    if (page) page.inert = true;
    modal.hidden = false;
    document.documentElement.classList.add("onboard-modal-open");
    syncStepper();
    ageInput.focus();
    ageInput.select();
  }

  function onSubmit(e) {
    e.preventDefault();
    var age = parseAge();
    if (age === null) {
      ageErrorShown = true;
      renderAgeError();
      ageInput.focus();
      return;
    }
    window.HiitUser.saveOnboarding(String(age), parseInt(levelInput.value, 10));
    window.location.replace("index.html");
  }

  document.addEventListener("DOMContentLoaded", function () {
    modal = $("onboard-modal");
    form = $("form-onboard");
    ageInput = $("onboard-age");
    decBtn = $("onboard-age-dec");
    incBtn = $("onboard-age-inc");
    ageError = $("onboard-age-error");
    levelInput = $("onboard-level");
    var levelText = $("onboard-level-text");
    if (!modal || !form || !ageInput || !decBtn || !incBtn || !ageError || !levelInput || !levelText) {
      modal = null;
      return;
    }

    minAge = parseInt(ageInput.min, 10);
    maxAge = parseInt(ageInput.max, 10);
    lastValidAge = parseInt(ageInput.value, 10);

    decBtn.addEventListener("click", function () {
      stepAge(-1);
    });
    incBtn.addEventListener("click", function () {
      stepAge(1);
    });
    ageInput.addEventListener("input", function () {
      clearAgeError();
      syncStepper();
    });
    ageInput.addEventListener("blur", function () {
      if (!ageInput.value.trim()) ageInput.value = String(lastValidAge);
      syncStepper();
    });
    window.HiitLevelSlider.bind(levelInput, levelText);
    form.addEventListener("submit", onSubmit);

    window.addEventListener("hiit-langchange", renderAgeError);
  });

  window.HiitOnboarding = { open: open };
})();
