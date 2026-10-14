(function () {
  "use strict";

  var STORAGE_KEY = "hiit-saved-sessions";

  function tr(key, fallback) {
    var v = window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : null;
    return v && v !== key ? v : fallback;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  /* ---------- Header menu (bookmark icon + dropdown) ---------- */

  function closeMenu(root) {
    var d = root.querySelector(".saved-menu__dropdown");
    var t = root.querySelector(".saved-menu__trigger");
    if (d) d.hidden = true;
    if (t) t.setAttribute("aria-expanded", "false");
  }

  function renderList(root) {
    var cards = savedCards();
    var count = root.querySelector(".saved-menu__count");
    var list = root.querySelector(".saved-menu__list");
    var empty = root.querySelector(".saved-menu__empty");
    var title = root.querySelector(".saved-menu__heading");
    var trigger = root.querySelector(".saved-menu__trigger");

    title.textContent = tr("saved_heading", "Saved sessions");
    empty.textContent = tr("saved_empty", "No saved sessions yet. Tap Save session on any session to keep it here.");
    trigger.setAttribute("aria-label", tr("saved_menu_aria", "Saved sessions"));
    count.textContent = String(cards.length);
    count.hidden = cards.length === 0;
    empty.hidden = cards.length > 0;
    list.hidden = cards.length === 0;

    list.innerHTML = cards
      .map(function (c) {
        return (
          '<li><a class="saved-menu__item" href="detail.html?id=' +
          encodeURIComponent(c.id) +
          '" role="menuitem"><span class="saved-menu__item-id">#' +
          escapeHtml(c.id) +
          '</span><span class="saved-menu__item-title">' +
          escapeHtml(c.title) +
          (c.subtitle ? ' <span class="saved-menu__item-sub">' + escapeHtml(c.subtitle) + "</span>" : "") +
          "</span></a></li>"
        );
      })
      .join("");
  }

  function createMenu() {
    var root = document.createElement("div");
    root.className = "saved-menu";
    root.setAttribute("data-saved-menu", "");
    root.innerHTML =
      '<button type="button" class="saved-menu__trigger header-badges-link" aria-haspopup="true" aria-expanded="false">' +
      bookmarkSvg("header-badges-link__icon") +
      '<span class="saved-menu__count" hidden></span></button>' +
      '<div class="saved-menu__dropdown" hidden>' +
      '<p class="saved-menu__heading"></p>' +
      '<p class="saved-menu__empty"></p>' +
      '<ul class="saved-menu__list" role="menu"></ul>' +
      "</div>";

    var trigger = root.querySelector(".saved-menu__trigger");
    var dropdown = root.querySelector(".saved-menu__dropdown");

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dropdown.hidden;
      if (open) renderList(root);
      dropdown.hidden = !open;
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    dropdown.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    document.addEventListener("click", function () {
      closeMenu(root);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !dropdown.hidden) {
        closeMenu(root);
        trigger.focus();
      }
    });
    document.addEventListener("hiit-saved-change", function () {
      renderList(root);
    });
    window.addEventListener("hiit-langchange", function () {
      renderList(root);
    });
    window.addEventListener("storage", function (e) {
      if (e.key === STORAGE_KEY) renderList(root);
    });

    renderList(root);
    return root;
  }

  /* Insert the menu just before the badges link on every page that has one.
     The detail page rebuilds its header on language change, so keep watching. */
  function mountMenus() {
    document.querySelectorAll("a.header-badges-link").forEach(function (link) {
      var prev = link.previousElementSibling;
      if (prev && prev.hasAttribute("data-saved-menu")) return;
      link.parentNode.insertBefore(createMenu(), link);
    });
  }

  function init() {
    mountMenus();
    if (window.MutationObserver) {
      new MutationObserver(mountMenus).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.HiitSaved = {
    isSaved: isSaved,
    toggle: toggle,
    getSavedIds: loadIds,
    createSaveButton: createSaveButton,
  };
})();
