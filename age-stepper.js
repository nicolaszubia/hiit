(function () {
  "use strict";

  /**
   * Age field shown as − N + (the input is typeable). Bounds come from the input's min/max.
   * @param {{ input: HTMLInputElement, dec: HTMLButtonElement, inc: HTMLButtonElement, error: HTMLElement }} els
   * @returns {{ value: function(): (number|null), validate: function(): boolean }}
   */
  function bind(els) {
    var input = els.input;
    var min = parseInt(input.min, 10);
    var max = parseInt(input.max, 10);
    var lastValid = parseInt(input.value, 10);
    var errorShown = false;

    function tf(key, vars) {
      return window.HiitI18n && window.HiitI18n.tf ? window.HiitI18n.tf(key, vars) : key;
    }

    /** The typed age as an integer, or null when empty, non-numeric or out of range. */
    function value() {
      var raw = input.value.trim();
      if (!/^\d+$/.test(raw)) return null;
      var n = parseInt(raw, 10);
      return n >= min && n <= max ? n : null;
    }

    function renderError() {
      els.error.textContent = errorShown ? tf("onboard_err_age", { min: min, max: max }) : "";
    }

    function clearError() {
      errorShown = false;
      renderError();
    }

    function sync() {
      var n = value();
      if (n !== null) lastValid = n;
      els.dec.disabled = lastValid <= min;
      els.inc.disabled = lastValid >= max;
    }

    function step(delta) {
      var base = value();
      if (base === null) base = lastValid;
      input.value = String(Math.min(max, Math.max(min, base + delta)));
      clearError();
      sync();
    }

    els.dec.addEventListener("click", function () {
      step(-1);
    });
    els.inc.addEventListener("click", function () {
      step(1);
    });
    input.addEventListener("input", function () {
      clearError();
      sync();
    });
    input.addEventListener("blur", function () {
      if (!input.value.trim()) input.value = String(lastValid);
      sync();
    });
    window.addEventListener("hiit-langchange", renderError);
    sync();

    return {
      value: value,
      /** Shows the error and focuses the input when the age is not valid. */
      validate: function () {
        if (value() !== null) return true;
        errorShown = true;
        renderError();
        input.focus();
        return false;
      },
    };
  }

  window.HiitAgeStepper = { bind: bind };
})();
