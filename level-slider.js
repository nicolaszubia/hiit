(function () {
  "use strict";

  /**
   * Level-of-complexity slider (1 easy – 5 hardcore), shared by the sign-up modal and the profile form.
   * Keeps the readout text, aria-valuetext and thumb color (--level-color on the input's parent) in sync.
   */

  // Thumb color per level, green to red. Keep in sync with the --track gradient in styles.css.
  var LEVEL_COLORS = ["#3ecf8e", "#9bd84e", "#f5c542", "#f08a3c", "#ef4444"];

  function t(key) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : key;
  }

  function tf(key, vars) {
    return window.HiitI18n && window.HiitI18n.tf ? window.HiitI18n.tf(key, vars) : key;
  }

  /**
   * @param {HTMLInputElement} input  the range input
   * @param {HTMLElement} readout     element that shows "3 of 5 · Challenging"
   * @returns {{ render: function(): void }}  call render() after setting input.value from code
   */
  function bind(input, readout) {
    function render() {
      var n = parseInt(input.value, 10) || 3;
      var text = tf("onboard_level_value", { n: n, name: t("onboard_level_" + n) });
      readout.textContent = text;
      input.setAttribute("aria-valuetext", text);
      input.parentElement.style.setProperty("--level-color", LEVEL_COLORS[n - 1]);
    }

    input.addEventListener("input", render);
    window.addEventListener("hiit-langchange", render);
    render();
    return { render: render };
  }

  window.HiitLevelSlider = { bind: bind };
})();
