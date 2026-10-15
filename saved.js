(function () {
  "use strict";

  var STORAGE_KEY = "hiit-saved-sessions";

  function tr(key, fallback) {
    var v = window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : null;
    return v && v !== key ? v : fallback;
  }

  function loadIds() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (e) {
      return [];
    }
  }

  function saveIds(ids) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      /* quota / private mode */
    }
  }

  function isSaved(id) {
    return loadIds().indexOf(String(id)) !== -1;
  }

  /** @returns {boolean} true if the session is saved after the call */
  function toggle(id) {
    var key = String(id);
    var ids = loadIds();
    var i = ids.indexOf(key);
    if (i === -1) ids.push(key);
    else ids.splice(i, 1);
    saveIds(ids);
    document.dispatchEvent(new CustomEvent("hiit-saved-change"));
    return i === -1;
  }

  function savedCards() {
    if (typeof window.getCardById !== "function") return [];
    return loadIds()
      .map(function (id) {
        return window.getCardById(id);
      })
      .filter(Boolean);
  }

  var BOOKMARK_PATH = '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>';

  function bookmarkSvg(cls) {
    return (
      '<svg class="' +
      cls +
      '" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      BOOKMARK_PATH +
      "</svg>"
    );
  }

  /* ---------- Save button on a session page ---------- */

  function createSaveButton(cardId) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "save-session-btn";
    btn.innerHTML =
      bookmarkSvg("save-session-btn__icon") + '<span class="save-session-btn__label"></span>';

    function sync() {
      var saved = isSaved(cardId);
      btn.classList.toggle("save-session-btn--saved", saved);
      btn.setAttribute("aria-pressed", saved ? "true" : "false");
      btn.querySelector(".save-session-btn__label").textContent = saved
        ? tr("saved_btn_saved", "Saved")
        : tr("saved_btn_save", "Save session");
    }

    btn.addEventListener("click", function () {
      toggle(cardId);
    });
    document.addEventListener("hiit-saved-change", sync);
    sync();
    return btn;
  }

  window.HiitSaved = {
    isSaved: isSaved,
    toggle: toggle,
    getSavedIds: loadIds,
    getSavedCards: savedCards,
    createSaveButton: createSaveButton,
  };
})();
