(function () {
  "use strict";

  function tr(key, fallback) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : fallback;
  }

  function tfs(key, vars, fallback) {
    if (window.HiitI18n && window.HiitI18n.tf) return window.HiitI18n.tf(key, vars);
    return fallback;
  }

  function badgeTitle(id, en) {
    return tr("badge_" + id + "_title", en);
  }

  function badgeDesc(id, en) {
    return tr("badge_" + id + "_desc", en);
  }

  var BADGE_MEDAL_SVG =
    '<svg class="badge-tile__medal" width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M12 2l2.6 7.4H22l-6.2 4.6 2.4 7.4L12 16.7 5.8 21.4l2.4-7.4L2 9.4h7.4L12 2z"/></svg>';

  var DEFINITIONS = [
    {
      id: "first_finish",
      title: "First finish",
      desc: "Complete any workout with every exercise checked.",
      test: function (s) {
        return s.totalCompletions >= 1;
      },
    },
    {
      id: "triple_threat",
      title: "Triple threat",
      desc: "Log 3 full session finishes.",
      test: function (s) {
        return s.totalCompletions >= 3;
      },
    },
    {
      id: "ten_club",
      title: "Ten club",
      desc: "Log 10 full session finishes.",
      test: function (s) {
        return s.totalCompletions >= 10;
      },
    },
    {
      id: "twenty_five",
      title: "Quarter stack",
      desc: "Log 25 full session finishes.",
      test: function (s) {
        return s.totalCompletions >= 25;
      },
    },
    {
      id: "mix_three",
      title: "Mix it up",
      desc: "Finish 3 different sessions (by card).",
      test: function (s) {
        return s.uniqueSessionsCompleted >= 3;
      },
    },
    {
      id: "mix_seven",
      title: "Broad sampler",
      desc: "Finish 7 different sessions.",
      test: function (s) {
        return s.uniqueSessionsCompleted >= 7;
      },
    },
    {
      id: "mix_ten",
      title: "Deck runner",
      desc: "Finish 10 different sessions.",
      test: function (s) {
        return s.uniqueSessionsCompleted >= 10;
      },
    },
    {
      id: "week_surge",
      title: "Week surge",
      desc: "Finish 4+ sessions in one calendar week.",
      test: function (s) {
        return s.maxCompletionsInOneWeek >= 4;
      },
    },
    {
      id: "five_day_spread",
      title: "Five-day spread",
      desc: "Train on 5 different calendar days.",
      test: function (s) {
        return s.uniqueTrainingDays >= 5;
      },
    },
    {
      id: "ten_day_spread",
      title: "Ten-day habit",
      desc: "Train on 10 different calendar days.",
      test: function (s) {
        return s.uniqueTrainingDays >= 10;
      },
    },
  ];

  function render() {
    var grid = document.getElementById("badges-grid");
    var summary = document.getElementById("badges-summary");
    if (!grid) return;

    var hp = window.HiitProgress || {};
    var snap =
      typeof hp.getBadgeSnapshot === "function"
        ? hp.getBadgeSnapshot()
        : {
            totalCompletions: 0,
            uniqueSessionsCompleted: 0,
            uniqueTrainingDays: 0,
            maxCompletionsInOneWeek: 0,
          };

    var unlocked = 0;
    grid.innerHTML = "";

    DEFINITIONS.forEach(function (def) {
      var ok = def.test(snap);
      if (ok) unlocked += 1;

      var li = document.createElement("li");
      li.className = "badge-tile" + (ok ? " badge-tile--unlocked" : " badge-tile--locked");
      li.setAttribute("role", "listitem");
      li.setAttribute("data-badge-id", def.id);

      var iconWrap = document.createElement("div");
      iconWrap.className = "badge-tile__icon-wrap";
      iconWrap.innerHTML = BADGE_MEDAL_SVG;

      var body = document.createElement("div");
      body.className = "badge-tile__body";

      var h3 = document.createElement("h3");
      h3.className = "badge-tile__title";
      h3.textContent = badgeTitle(def.id, def.title);

      var p = document.createElement("p");
      p.className = "badge-tile__desc";
      p.textContent = badgeDesc(def.id, def.desc);

      var status = document.createElement("p");
      status.className = "badge-tile__status";
      status.textContent = ok ? tr("badge_status_unlocked", "Unlocked") : tr("badge_status_locked", "Locked");

      body.appendChild(h3);
      body.appendChild(p);
      body.appendChild(status);

      li.appendChild(iconWrap);
      li.appendChild(body);

      li.setAttribute(
        "aria-label",
        badgeTitle(def.id, def.title) +
          ". " +
          badgeDesc(def.id, def.desc) +
          " " +
          (ok ? tr("badge_status_unlocked", "Unlocked") : tr("badge_status_locked", "Locked")) +
          "."
      );

      grid.appendChild(li);
    });

    if (summary) {
      summary.textContent = tfs(
        "badges_summary",
        { unlocked: unlocked, total: DEFINITIONS.length },
        unlocked + " of " + DEFINITIONS.length + " badges unlocked — keep finishing sessions to light them up."
      );
    }
  }

  document.addEventListener("DOMContentLoaded", render);
  window.addEventListener("hiit-langchange", render);
})();
