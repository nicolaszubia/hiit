(function () {
  "use strict";

  var STORAGE_KEY = "hiit-theme";

  var THEME_TOGGLE_MARKUP =
    '<svg class="theme-toggle__icon theme-toggle__icon--moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
    '<svg class="theme-toggle__icon theme-toggle__icon--sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';

  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeStored(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }

  function resolvedTheme() {
    var s = readStored();
    if (s === "light" || s === "dark") return s;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    var t = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
  }

  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    var next = cur === "light" ? "dark" : "light";
    applyTheme(next);
    writeStored(next);
    syncToggleLabels();
  }

  function syncToggleLabels() {
    var isLight = document.documentElement.getAttribute("data-theme") === "light";
    var toDark = window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t("theme_to_dark") : "Switch to dark mode";
    var toLight = window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t("theme_to_light") : "Switch to light mode";
    var label = isLight ? toDark : toLight;
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  }

  function hydrateStaticToggles() {
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      if (btn.children.length === 0) {
        btn.innerHTML = THEME_TOGGLE_MARKUP;
      }
    });
    syncToggleLabels();
  }

  function createToggleButton() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.innerHTML = THEME_TOGGLE_MARKUP;
    syncToggleLabels();
    return btn;
  }

  applyTheme(resolvedTheme());

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".theme-toggle");
    if (!btn) return;
    e.preventDefault();
    toggleTheme();
  });

  document.addEventListener("DOMContentLoaded", hydrateStaticToggles);

  window.HiitTheme = {
    createToggleButton: createToggleButton,
    syncToggleLabels: syncToggleLabels,
  };

  window.addEventListener("hiit-langchange", syncToggleLabels);
})();
