(function () {
  "use strict";

  var STORAGE_KEY = "hiit-promo-banner-dismissed-badges";
  var outer = document.getElementById("promo-banner-outer");
  var banner = document.getElementById("promo-banner");
  var closeBtn = document.querySelector(".promo-banner__close");

  if (!outer || !banner || !closeBtn) return;

  function dismiss() {
    outer.setAttribute("hidden", "");
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      /* private mode / quota */
    }
    var search = document.getElementById("dashboard-search");
    if (search && typeof search.focus === "function") {
      search.focus();
    }
  }

  try {
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      return;
    }
  } catch (e) {
    /* show banner if storage unavailable */
  }

  outer.removeAttribute("hidden");

  closeBtn.addEventListener("click", dismiss);

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || outer.hasAttribute("hidden")) return;
    if (!banner.contains(document.activeElement)) return;
    e.preventDefault();
    dismiss();
  });
})();
