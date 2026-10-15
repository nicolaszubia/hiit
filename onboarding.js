(function () {
  "use strict";

  /**
   * Sign-up step 1 (before the account is created): name, gender, age (− N +), level (1–5 slider)
   * and health condition. auth.js creates the account in step 2 and saves collect() to the profile.
   */

  var step = 1;
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

  function t(key) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : key;
  }

  function tf(key, vars) {
    return window.HiitI18n && window.HiitI18n.tf ? window.HiitI18n.tf(key, vars) : key;
  }

  function val(id) {
    return $(id).value.trim();
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

  function showError(key, focusId) {
    $("onboard-error").textContent = t(key);
    $(focusId).focus();
  }

  /** Validates step 1; shows the first problem found. */
  function validate() {
    $("onboard-error").textContent = "";
    if (!val("onboard-first-name") || !val("onboard-last-name")) {
      showError("onboard_err_required", val("onboard-first-name") ? "onboard-last-name" : "onboard-first-name");
      return false;
    }
    if (!$("onboard-gender").value) {
      showError("onboard_err_gender", "onboard-gender");
      return false;
    }
    if (parseAge() === null) {
      ageErrorShown = true;
      renderAgeError();
      ageInput.focus();
      return false;
    }
    return true;
  }

  function renderStepCounts() {
    $("signup-step-count-1").textContent = tf("signup_step", { n: 1 });
    $("signup-step-count-2").textContent = tf("signup_step", { n: 2 });
  }

  function showStep(n) {
    step = n;
    $("signup-error").textContent = "";
    $("signup-step-1").hidden = n !== 1;
    $("signup-step-2").hidden = n !== 2;
    var focusId = n === 1 ? "onboard-first-name" : "signup-email";
    $(focusId).focus();
  }

  /** Step 1 -> step 2 when the data is valid. */
  function next() {
    if (validate()) showStep(2);
  }

  /** Fields to save to the profile once the account exists. */
  function collect() {
    var health = $("onboard-health").checked;
    return {
      firstName: val("onboard-first-name"),
      lastName: val("onboard-last-name"),
      gender: $("onboard-gender").value,
      age: String(parseAge()),
      level: parseInt(levelInput.value, 10),
      healthCondition: health,
      healthNotes: health ? val("onboard-health-notes") : "",
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    ageInput = $("onboard-age");
    if (!ageInput || !$("signup-step-1")) return;
    decBtn = $("onboard-age-dec");
    incBtn = $("onboard-age-inc");
    ageError = $("onboard-age-error");
    levelInput = $("onboard-level");

    minAge = parseInt(ageInput.min, 10);
    maxAge = parseInt(ageInput.max, 10);
    lastValidAge = parseInt(ageInput.value, 10);
    syncStepper();
    renderStepCounts();

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
    window.HiitLevelSlider.bind(levelInput, $("onboard-level-text"));
    $("onboard-health").addEventListener("change", function () {
      $("onboard-health-notes").hidden = !this.checked;
      if (this.checked) $("onboard-health-notes").focus();
    });
    $("signup-next").addEventListener("click", next);
    $("signup-back").addEventListener("click", function () {
      showStep(1);
    });
  });

  window.HiitOnboarding = {
    getStep: function () {
      return step;
    },
    next: next,
    collect: collect,
  };
})();
