(function () {
  "use strict";

  /**
   * Fire (🔥) like indicator for session cards and the session detail page.
   * One like per person per session: the first click adds one, a second click removes it.
   *
   * The counts are local for now: this site has no server, so each count only reflects likes made
   * in this browser (0 or 1). To share counts across everyone, replace load() / save() / count()
   * with calls to a shared backend; the buttons and events do not need to change.
   */

  var STORAGE_KEY = "hiit-likes";
  var liked = load();

  function load() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(liked));
    } catch (e) {
      /* ignore */
    }
  }

  function isLiked(id) {
    return liked[String(id)] === true;
  }

  function count(id) {
    return isLiked(id) ? 1 : 0;
  }

  function tf(key, vars) {
    return window.HiitI18n && window.HiitI18n.tf ? window.HiitI18n.tf(key, vars) : key;
  }

  function formatCount(n) {
    try {
      return new Intl.NumberFormat("es", { notation: "compact" }).format(n);
    } catch (e) {
      return String(n);
    }
  }

  function syncButton(btn) {
    var id = btn.getAttribute("data-like-id");
    var on = isLiked(id);
    var n = count(id);
    var label = tf(on ? "like_btn_unlike" : "like_btn_like", { n: n });
    btn.classList.toggle("like-btn--liked", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
    btn.querySelector(".like-btn__count").textContent = formatCount(n);
  }

  function syncAll() {
    document.querySelectorAll(".like-btn[data-like-id]").forEach(syncButton);
  }

  function toggle(id) {
    var key = String(id);
    if (liked[key]) delete liked[key];
    else liked[key] = true;
    save();
    syncAll();
  }

  /**
   * @param {string|number} cardId
   * @param {{ large?: boolean }} [opts]
   * @returns {HTMLButtonElement}
   */
  function createButton(cardId, opts) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "like-btn" + (opts && opts.large ? " like-btn--lg" : "");
    btn.setAttribute("data-like-id", String(cardId));
    btn.innerHTML =
      '<span class="like-btn__flame" aria-hidden="true">🔥</span><span class="like-btn__count"></span>';
    syncButton(btn);
    return btn;
  }

  // One delegated listener serves every button, including cards that are re-rendered on each search.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".like-btn[data-like-id]") : null;
    if (!btn) return;
    e.preventDefault();
    toggle(btn.getAttribute("data-like-id"));
    if (btn.classList.contains("like-btn--liked")) {
      btn.classList.remove("like-btn--pop");
      void btn.offsetWidth; // restart the animation on rapid re-likes
      btn.classList.add("like-btn--pop");
    }
  });

  // Likes made in another tab.
  window.addEventListener("storage", function (e) {
    if (e.key !== STORAGE_KEY) return;
    liked = load();
    syncAll();
  });

  window.addEventListener("hiit-langchange", syncAll);

  window.HiitLikes = {
    createButton: createButton,
    isLiked: isLiked,
    count: count,
    toggle: toggle,
  };
})();
