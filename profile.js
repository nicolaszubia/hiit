(function () {
  "use strict";

  function tr(key, fallback) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : fallback;
  }

  function $(id) {
    return document.getElementById(id);
  }

  function applySessionLayout() {
    var gate = $("profile-gate");
    var content = $("profile-content");
    var sessionOk = window.HiitUser && window.HiitUser.isSessionActive && window.HiitUser.isSessionActive();
    if (!gate || !content) return;
    if (sessionOk) {
      gate.hidden = true;
      content.hidden = false;
    } else {
      gate.hidden = false;
      content.hidden = true;
    }
  }

  function applyEmailFieldState() {
    var input = $("profile-email");
    var hint = $("profile-email-hint");
    if (!input) return;
    var accEmail = window.HiitUser && window.HiitUser.getAccountEmail ? window.HiitUser.getAccountEmail() : "";
    if (accEmail) {
      input.readOnly = true;
      input.value = accEmail;
      input.setAttribute("aria-readonly", "true");
      if (hint) hint.hidden = false;
    } else {
      input.readOnly = false;
      input.removeAttribute("aria-readonly");
      if (hint) hint.hidden = true;
    }
  }

  var levelSlider = null;

  function fillForm() {
    if (!window.HiitUser || !window.HiitUser.loadProfile) return;
    var p = window.HiitUser.loadProfile();
    var accEmail = window.HiitUser.getAccountEmail ? window.HiitUser.getAccountEmail() : "";
    var map = {
      "profile-first-name": p ? p.firstName : "",
      "profile-last-name": p ? p.lastName : "",
      "profile-age": p ? p.age : "",
      "profile-gender": p ? p.gender : "",
      "profile-country": p ? p.country : "",
      "profile-email": accEmail || (p ? p.email : ""),
      "profile-phone": p ? p.phone : "",
    };
    Object.keys(map).forEach(function (id) {
      var el = $(id);
      if (el) el.value = map[id] != null ? String(map[id]) : "";
    });
    var level = $("profile-level");
    if (level) {
      level.value = String(p && p.level ? p.level : 3);
      if (levelSlider) levelSlider.render();
    }
    var health = $("profile-health");
    if (health) {
      health.checked = !!(p && p.healthCondition);
      $("profile-health-notes").hidden = !health.checked;
      $("profile-health-notes").value = p && p.healthNotes ? p.healthNotes : "";
    }
    applyEmailFieldState();
  }

  function basicEmailOk(s) {
    if (!s.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
  }

  document.addEventListener("DOMContentLoaded", function () {
    applySessionLayout();
    if (!window.HiitUser || !window.HiitUser.isSessionActive || !window.HiitUser.isSessionActive()) {
      return;
    }

    var levelInput = $("profile-level");
    var levelText = $("profile-level-text");
    if (levelInput && levelText && window.HiitLevelSlider) {
      levelSlider = window.HiitLevelSlider.bind(levelInput, levelText);
    }
    fillForm();
    if ($("profile-health")) {
      $("profile-health").addEventListener("change", function () {
        $("profile-health-notes").hidden = !this.checked;
      });
    }

    var form = $("profile-form");
    var status = $("profile-status");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) {
        status.textContent = "";
        status.classList.remove("profile-status--error");
      }

      var accEmail = window.HiitUser.getAccountEmail ? window.HiitUser.getAccountEmail() : "";
      var email = accEmail || (($("profile-email") && $("profile-email").value) || "");
      if (!basicEmailOk(email)) {
        if (status) {
          status.textContent = tr(
            "profile_err_email",
            "Please enter a valid email address or leave it blank."
          );
          status.classList.add("profile-status--error");
        }
        return;
      }

      var data = {
        firstName: ($("profile-first-name") && $("profile-first-name").value) || "",
        lastName: ($("profile-last-name") && $("profile-last-name").value) || "",
        age: ($("profile-age") && $("profile-age").value) || "",
        level: levelInput ? levelInput.value : undefined,
        healthCondition: $("profile-health") ? $("profile-health").checked : undefined,
        healthNotes: $("profile-health-notes") ? $("profile-health-notes").value : undefined,
        gender: ($("profile-gender") && $("profile-gender").value) || "",
        country: ($("profile-country") && $("profile-country").value) || "",
        email: email.trim(),
        phone: ($("profile-phone") && $("profile-phone").value) || "",
      };

      window.HiitUser.saveProfile(data);

      if (window.HiitUserMenu && window.HiitUserMenu.syncAll) {
        window.HiitUserMenu.syncAll();
      }

      if (status) {
        status.textContent = tr("profile_saved", "Profile saved.");
        status.classList.remove("profile-status--error");
      }
    });
  });
})();
