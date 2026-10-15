(function () {
  "use strict";

  /**
   * Home-page modal for new accounts: level of complexity (1–5 slider).
   * Opens 3 seconds after landing on the home page while the profile has no level yet.
   */

  var DELAY_MS = 3000;

  var modal;
  var levelInput;

  function $(id) {
    return document.getElementById(id);
  }

  function needsOnboarding() {
    var u = window.HiitUser;
    if (!u || !u.isSessionActive()) return false;
    var p = u.loadProfile();
    return !p || !p.level;
  }

  function open() {
    // inert keeps keyboard focus and screen readers inside the modal.
    document.querySelectorAll("body > :not(#onboard-modal):not(script)").forEach(function (el) {
      el.inert = true;
    });
    modal.hidden = false;
    document.documentElement.classList.add("onboard-modal-open");
    levelInput.focus();
  }

  function close() {
    document.querySelectorAll("body > [inert]").forEach(function (el) {
      el.inert = false;
    });
    modal.hidden = true;
    document.documentElement.classList.remove("onboard-modal-open");
  }

  document.addEventListener("DOMContentLoaded", function () {
    modal = $("onboard-modal");
    levelInput = $("onboard-level");
    var levelText = $("onboard-level-text");
    if (!modal || !levelInput || !levelText) return;

    window.HiitLevelSlider.bind(levelInput, levelText);
    $("form-onboard").addEventListener("submit", function (e) {
      e.preventDefault();
      window.HiitUser.saveOnboarding({ level: parseInt(levelInput.value, 10) });
      close();
    });

    if (needsOnboarding()) window.setTimeout(open, DELAY_MS);
  });
})();
