(function () {
  "use strict";

  var MIN_PASSWORD = 8;

  function tr(key, fallback) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : fallback;
  }

  function tf(key, vars, fallback) {
    if (window.HiitI18n && window.HiitI18n.tf) return window.HiitI18n.tf(key, vars);
    return fallback;
  }

  function $(id) {
    return document.getElementById(id);
  }

  function basicEmailOk(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
  }

  function showPanel(mode) {
    var loginEl = $("auth-panel-login");
    var signupEl = $("auth-panel-signup");
    var forgotEl = $("auth-panel-forgot");
    if (!loginEl || !signupEl || !forgotEl) return;
    loginEl.hidden = mode !== "login";
    signupEl.hidden = mode !== "signup";
    forgotEl.hidden = mode !== "forgot";
    var focusId = mode === "login" ? "login-email" : mode === "forgot" ? "forgot-email" : "signup-email";
    $(focusId) && $(focusId).focus();
    history.replaceState(null, "", "auth.html#" + mode);
  }

  function resolveInitialMode() {
    var h = (window.location.hash || "").toLowerCase();
    if (h === "#login") return "login";
    if (h === "#signup") return "signup";
    if (h === "#forgot") return "forgot";
    if (window.HiitUser && window.HiitUser.loadAccount && window.HiitUser.loadAccount()) {
      return "login";
    }
    return "signup";
  }

  document.addEventListener("DOMContentLoaded", function () {
    showPanel(resolveInitialMode());

    document.querySelectorAll("[data-auth-show]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showPanel(btn.getAttribute("data-auth-show"));
      });
    });

    window.addEventListener("hashchange", function () {
      var m = resolveInitialMode();
      showPanel(m);
    });

    var formLogin = $("form-login");
    var errLogin = $("login-error");
    if (formLogin) {
      formLogin.addEventListener("submit", function (e) {
        e.preventDefault();
        if (errLogin) errLogin.textContent = "";
        var email = ($("login-email") && $("login-email").value) || "";
        var password = ($("login-password") && $("login-password").value) || "";
        if (!basicEmailOk(email)) {
          if (errLogin) errLogin.textContent = tr("auth_err_email", "Enter a valid email.");
          return;
        }
        if (!password) {
          if (errLogin) errLogin.textContent = tr("auth_err_password", "Enter your password.");
          return;
        }
        window.HiitUser.login(email, password).then(
          function (res) {
            if (res.ok) {
              window.location.replace("index.html");
              return;
            }
            if (errLogin) errLogin.textContent = res.error || tr("auth_err_login", "Could not log in.");
          },
          function () {
            if (errLogin) {
              errLogin.textContent = tr(
                "auth_err_login_unexpected",
                "Login failed unexpectedly. Try again, or use an external browser at the same URL."
              );
            }
          }
        );
      });
    }

    var formForgot = $("form-forgot");
    var errForgot = $("forgot-error");
    if (formForgot) {
      formForgot.addEventListener("submit", function (e) {
        e.preventDefault();
        if (errForgot) errForgot.textContent = "";
        var email = ($("forgot-email") && $("forgot-email").value) || "";
        var p1 = ($("forgot-password") && $("forgot-password").value) || "";
        var p2 = ($("forgot-password-confirm") && $("forgot-password-confirm").value) || "";
        if (!basicEmailOk(email)) {
          if (errForgot) errForgot.textContent = tr("auth_err_email", "Enter a valid email.");
          return;
        }
        if (p1.length < MIN_PASSWORD) {
          if (errForgot) {
            errForgot.textContent = tf(
              "auth_err_password_min",
              { n: MIN_PASSWORD },
              "Password must be at least " + MIN_PASSWORD + " characters."
            );
          }
          return;
        }
        if (p1 !== p2) {
          if (errForgot) errForgot.textContent = tr("auth_err_password_match", "Passwords do not match.");
          return;
        }
        window.HiitUser.resetPassword(email, p1).then(
          function (res) {
            if (res.ok) {
              window.location.replace("index.html");
              return;
            }
            if (errForgot) {
              errForgot.textContent =
                res.error && res.error.indexOf("No account") === 0
                  ? tr("auth_err_reset_no_account", res.error)
                  : res.error || tr("auth_err_reset_unexpected", "Could not reset the password. Try again.");
            }
          },
          function () {
            if (errForgot) errForgot.textContent = tr("auth_err_reset_unexpected", "Could not reset the password. Try again.");
          }
        );
      });
    }

    var formSignup = $("form-signup");
    var errSignup = $("signup-error");
    if (formSignup) {
      formSignup.addEventListener("submit", function (e) {
        e.preventDefault();
        if (errSignup) errSignup.textContent = "";
        var email = ($("signup-email") && $("signup-email").value) || "";
        var p1 = ($("signup-password") && $("signup-password").value) || "";
        var p2 = ($("signup-password-confirm") && $("signup-password-confirm").value) || "";
        if (!basicEmailOk(email)) {
          if (errSignup) errSignup.textContent = tr("auth_err_email", "Enter a valid email.");
          return;
        }
        if (p1.length < MIN_PASSWORD) {
          if (errSignup) {
            errSignup.textContent = tf(
              "auth_err_password_min",
              { n: MIN_PASSWORD },
              "Password must be at least " + MIN_PASSWORD + " characters."
            );
          }
          return;
        }
        if (p1 !== p2) {
          if (errSignup) errSignup.textContent = tr("auth_err_password_match", "Passwords do not match.");
          return;
        }
        window.HiitUser.register(email, p1).then(
          function (res) {
            if (res.ok) {
              // New accounts finish onboarding (age + level) in a modal, which then sends them home.
              window.HiitOnboarding.open();
              return;
            }
            if (errSignup) errSignup.textContent = res.error || tr("auth_err_signup", "Could not sign up.");
          },
          function () {
            if (errSignup) {
              errSignup.textContent = tr(
                "auth_err_signup_unexpected",
                "Sign up failed unexpectedly. Try again, or use an external browser at the same URL."
              );
            }
          }
        );
      });
    }
  });
})();
