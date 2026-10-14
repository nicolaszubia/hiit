(function () {
  "use strict";

  function tt(key, fallback) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : fallback;
  }

  function userIconSvg() {
    return (
      '<svg class="user-menu__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    );
  }

  function langPillClass(code) {
    var cur = window.HiitI18n && window.HiitI18n.getLang ? window.HiitI18n.getLang() : "en";
    var active = cur === code ? " user-menu__lang-pill--active" : "";
    return "user-menu__lang-pill" + active;
  }

  function createUserMenuMarkup() {
    return (
      '<button type="button" class="user-menu__trigger" aria-haspopup="true" aria-expanded="false" aria-label="' +
      escapeAttr(tt("menu_account", "Account menu")) +
      '">' +
      '<span class="user-menu__avatar" data-user-avatar></span>' +
      userIconSvg() +
      "</button>" +
      '<div class="user-menu__dropdown" role="menu" hidden>' +
      '<div class="user-menu__lang" role="group" aria-labelledby="user-menu-lang-h">' +
      '<span id="user-menu-lang-h" class="user-menu__lang-heading">' +
      escapeHtml(tt("menu_language", "Language")) +
      "</span>" +
      '<div class="user-menu__lang-row">' +
      '<button type="button" class="' +
      langPillClass("en") +
      '" data-hiit-set-lang="en" role="menuitem">' +
      escapeHtml(tt("lang_english", "English")) +
      "</button>" +
      '<button type="button" class="' +
      langPillClass("es") +
      '" data-hiit-set-lang="es" role="menuitem">' +
      escapeHtml(tt("lang_spanish", "Español")) +
      "</button>" +
      "</div></div>" +
      '<a href="auth.html#login" class="user-menu__item user-menu__item--guest" role="menuitem">' +
      escapeHtml(tt("menu_log_in", "Log in")) +
      "</a>" +
      '<a href="auth.html#signup" class="user-menu__item user-menu__item--guest" role="menuitem">' +
      escapeHtml(tt("menu_sign_up", "Sign up")) +
      "</a>" +
      '<a href="badges.html" class="user-menu__item" role="menuitem">' +
      escapeHtml(tt("menu_badges", "Badges")) +
      "</a>" +
      '<a href="profile.html" class="user-menu__item user-menu__item--authed" role="menuitem">' +
      escapeHtml(tt("menu_profile", "Profile")) +
      "</a>" +
      '<button type="button" class="user-menu__item user-menu__item--danger user-menu__item--authed" role="menuitem" data-user-logout>' +
      escapeHtml(tt("menu_log_out", "Log out")) +
      "</button>" +
      "</div>"
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function syncLangPillsInRoot(root) {
    if (!root) return;
    var cur = window.HiitI18n && window.HiitI18n.getLang ? window.HiitI18n.getLang() : "en";
    root.querySelectorAll("[data-hiit-set-lang].user-menu__lang-pill").forEach(function (btn) {
      var code = btn.getAttribute("data-hiit-set-lang");
      btn.classList.toggle("user-menu__lang-pill--active", code === cur);
    });
  }

  function refreshMenuTextInRoot(root) {
    if (!root || !window.HiitI18n || !window.HiitI18n.t) return;
    var t = window.HiitI18n.t;
    var trigger = root.querySelector(".user-menu__trigger");
    if (trigger) trigger.setAttribute("aria-label", t("menu_account"));
    var h = root.querySelector("#user-menu-lang-h");
    if (h) h.textContent = t("menu_language");
    var pills = root.querySelectorAll(".user-menu__lang-row [data-hiit-set-lang]");
    if (pills[0]) pills[0].textContent = t("lang_english");
    if (pills[1]) pills[1].textContent = t("lang_spanish");
    var items = root.querySelectorAll(".user-menu__item");
    items.forEach(function (el) {
      var href = el.getAttribute("href") || "";
      if (href.indexOf("auth.html#login") !== -1) el.textContent = t("menu_log_in");
      else if (href.indexOf("auth.html#signup") !== -1) el.textContent = t("menu_sign_up");
      else if (href === "badges.html") el.textContent = t("menu_badges");
      else if (href === "profile.html") el.textContent = t("menu_profile");
      else if (el.hasAttribute("data-user-logout")) el.textContent = t("menu_log_out");
    });
    syncLangPillsInRoot(root);
  }

  function syncAvatar(root) {
    var av = root.querySelector("[data-user-avatar]");
    var icon = root.querySelector(".user-menu__icon");
    var initials = window.HiitUser && window.HiitUser.getInitials ? window.HiitUser.getInitials() : "";
    var signedIn = window.HiitUser && window.HiitUser.isSignedIn ? window.HiitUser.isSignedIn() : false;
    if (!av || !icon) return;
    if (initials) {
      av.textContent = initials;
      av.classList.add("user-menu__avatar--initials");
      av.hidden = false;
      icon.hidden = true;
    } else {
      av.textContent = "";
      av.classList.remove("user-menu__avatar--initials");
      av.hidden = true;
      icon.hidden = false;
    }
    root.querySelectorAll(".user-menu__item--guest").forEach(function (el) {
      el.hidden = signedIn;
    });
    root.querySelectorAll(".user-menu__item--authed").forEach(function (el) {
      el.hidden = !signedIn;
    });
    var logoutBtn = root.querySelector("[data-user-logout]");
    if (logoutBtn) {
      logoutBtn.disabled = !signedIn;
      logoutBtn.setAttribute("aria-disabled", signedIn ? "false" : "true");
    }
  }

  function closeMenu(root) {
    var t = root.querySelector(".user-menu__trigger");
    var d = root.querySelector(".user-menu__dropdown");
    if (!t || !d) return;
    t.setAttribute("aria-expanded", "false");
    d.hidden = true;
  }

  function openMenu(root) {
    var t = root.querySelector(".user-menu__trigger");
    var d = root.querySelector(".user-menu__dropdown");
    if (!t || !d) return;
    t.setAttribute("aria-expanded", "true");
    d.hidden = false;
  }

  function toggleMenu(root) {
    var d = root.querySelector(".user-menu__dropdown");
    if (!d) return;
    if (d.hidden) openMenu(root);
    else closeMenu(root);
  }

  function initMenu(root) {
    if (!root || root.getAttribute("data-user-menu-init") === "1") return;
    var trigger = root.querySelector(".user-menu__trigger");
    var dropdown = root.querySelector(".user-menu__dropdown");
    if (!trigger || !dropdown) return;

    root.setAttribute("data-user-menu-init", "1");
    root.classList.add("user-menu");

    var logoutBtn = root.querySelector("[data-user-logout]");

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu(root);
    });

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        if (logoutBtn.disabled) return;
        if (window.HiitUser && window.HiitUser.endSession) window.HiitUser.endSession();
        window.location.replace("auth.html#login");
      });
    }

    dropdown.querySelectorAll(
      'a[href="profile.html"], a[href="badges.html"], a[href^="auth.html"]'
    ).forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(root);
      });
    });

    syncAvatar(root);
    syncLangPillsInRoot(root);
  }

  function onDocClick(e) {
    document.querySelectorAll(".user-menu").forEach(function (root) {
      if (!root.contains(e.target)) closeMenu(root);
    });
  }

  function onKeydown(e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".user-menu").forEach(closeMenu);
  }

  function hydrateAndInit() {
    document.querySelectorAll("[data-user-menu]").forEach(function (root) {
      if (!root.querySelector(".user-menu__trigger")) {
        root.innerHTML = createUserMenuMarkup();
      }
      initMenu(root);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    hydrateAndInit();
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeydown);
  });

  window.HiitUserMenu = {
    createElement: function () {
      var el = document.createElement("div");
      el.setAttribute("data-user-menu", "");
      el.innerHTML = createUserMenuMarkup();
      initMenu(el);
      return el;
    },
    syncAll: function () {
      document.querySelectorAll(".user-menu").forEach(syncAvatar);
    },
    refreshMenuText: function () {
      document.querySelectorAll(".user-menu").forEach(refreshMenuTextInRoot);
    },
    syncLangPills: function () {
      document.querySelectorAll(".user-menu").forEach(syncLangPillsInRoot);
    },
  };

  window.addEventListener("hiit-langchange", function () {
    document.querySelectorAll(".user-menu").forEach(refreshMenuTextInRoot);
  });
})();
