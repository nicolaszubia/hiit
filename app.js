(function () {
  "use strict";

  function tr(key, fallback) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : fallback;
  }

  function getProgress() {
    if (window.HiitProgress) return window.HiitProgress;
    return {
      getChecksForCard: function () {
        return [];
      },
      isMajorityComplete: function () {
        return false;
      },
      isFullyComplete: function () {
        return false;
      },
    };
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  /**
   * @param {"completed"|"remaining"} section
   */
  function buildCardElement(card, hp, section) {
    var preview =
      card.preview && card.preview.length ? card.preview : card.exercises.slice(0, 4);

    var liHtml = preview
      .slice(0, 4)
      .map(function (line) {
        return "<li>" + escapeHtml(line) + "</li>";
      })
      .join("");

    var a = document.createElement("a");
    a.className = "card";
    a.setAttribute("draggable", "false");
    a.href = "detail.html?id=" + encodeURIComponent(card.id);
    a.setAttribute("data-card-id", card.id);
    a.setAttribute("role", "listitem");

    a.innerHTML =
      '<span class="card-id">#' +
      escapeHtml(String(card.id)) +
      "</span>" +
      "<h3 class=\"card-title\">" +
      escapeHtml(card.title) +
      "</h3>" +
      (card.subtitle ? '<p class="subtitle">' + escapeHtml(card.subtitle) + "</p>" : "") +
      '<ul class="card-preview">' +
      liHtml +
      "</ul>" +
      '<div class="card-footer">' +
      '<span class="card-link">' +
      escapeHtml(tr("card_open_session", "Open session")) +
      ' <span aria-hidden="true">→</span></span>' +
      "</div>";

    // The like button is a sibling of the link (not inside it) so the card stays valid, accessible HTML.
    var item = document.createElement("div");
    item.className = "card-item";
    var top = document.createElement("div");
    top.className = "card-item__top";
    item.appendChild(a);
    item.appendChild(top);

    var checks = hp.getChecksForCard(card.id, card.exercises.length);
    var n = card.exercises.length;

    if (section === "completed" && n > 0 && hp.isFullyComplete(checks)) {
      a.classList.add("card--fully-complete");
      var badgeDone = document.createElement("span");
      badgeDone.className = "card-done-badge card-done-badge--complete";
      badgeDone.id = "card-badge-complete-" + String(card.id);
      badgeDone.textContent = tr("card_badge_complete", "Complete");
      top.appendChild(badgeDone);
      a.setAttribute("aria-describedby", badgeDone.id);
    } else if (section === "remaining" && n > 0 && hp.isMajorityComplete(checks) && !hp.isFullyComplete(checks)) {
      a.classList.add("card--majority-done");
      var badge = document.createElement("span");
      badge.className = "card-done-badge";
      badge.id = "card-badge-" + String(card.id);
      badge.textContent = tr("card_badge_mostly", "Mostly done");
      top.appendChild(badge);
      a.setAttribute("aria-describedby", badge.id);
    }

    if (window.HiitLikes) top.appendChild(window.HiitLikes.createButton(card.id));

    return item;
  }

  /** Builds a card the same way the dashboard does (used by the saved sessions page). */
  window.HiitCards = {
    build: function (card) {
      var hp = getProgress();
      var done = card.exercises.length > 0 && hp.isFullyComplete(hp.getChecksForCard(card.id, card.exercises.length));
      return buildCardElement(card, hp, done ? "completed" : "remaining");
    },
  };

  function renderMetrics(completedCount, remainingCount) {
    var grid = document.getElementById("metrics-grid");
    if (!grid) return;

    grid.innerHTML = "";

    var m1 = document.createElement("article");
    m1.className = "metric-card";
    m1.setAttribute("aria-labelledby", "metric-label-completed");
    var l1 = document.createElement("p");
    l1.className = "metric-card__label";
    l1.id = "metric-label-completed";
    l1.textContent = tr("metric_completed_label", "Cards completed");
    var v1 = document.createElement("p");
    v1.className = "metric-card__value";
    v1.id = "metric-completed-count";
    v1.setAttribute("aria-live", "polite");
    v1.textContent = String(completedCount);
    m1.appendChild(l1);
    m1.appendChild(v1);

    var m2 = document.createElement("article");
    m2.className = "metric-card metric-card--pending";
    m2.setAttribute("aria-labelledby", "metric-label-remaining");
    var l2 = document.createElement("p");
    l2.className = "metric-card__label";
    l2.id = "metric-label-remaining";
    l2.textContent = tr("metric_remaining_label", "Cards not yet complete");
    var v2 = document.createElement("p");
    v2.className = "metric-card__value";
    v2.id = "metric-remaining-count";
    v2.setAttribute("aria-live", "polite");
    v2.textContent = String(remainingCount);
    m2.appendChild(l2);
    m2.appendChild(v2);

    grid.appendChild(m1);
    grid.appendChild(m2);
  }

  function stripDefault(emptyId) {
    if (emptyId === "completed-empty") return tr("completed_empty", "No sessions completed yet.");
    if (emptyId === "training-empty") return tr("training_empty", "All sessions are complete — great work.");
    return "";
  }

  function normalizeIdSearch(raw) {
    var s = String(raw || "").trim().toLowerCase();
    if (s.charAt(0) === "#") s = s.slice(1).trim();
    return s;
  }

  function filterCardsByIdQuery(cards, q) {
    if (!q) return cards;
    return cards.filter(function (card) {
      return String(card.id).toLowerCase().indexOf(q) !== -1;
    });
  }

  function buildSkeletonCard() {
    var el = document.createElement("div");
    el.className = "card-skeleton";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<span class="card-skeleton__bar card-skeleton__bar--id"></span>' +
      '<span class="card-skeleton__bar card-skeleton__bar--title"></span>' +
      '<span class="card-skeleton__bar card-skeleton__bar--sub"></span>' +
      '<span class="card-skeleton__bar card-skeleton__bar--line"></span>' +
      '<span class="card-skeleton__bar card-skeleton__bar--line"></span>' +
      '<span class="card-skeleton__bar card-skeleton__bar--line card-skeleton__bar--short"></span>' +
      '<span class="card-skeleton__bar card-skeleton__bar--footer"></span>';
    return el;
  }

  function setStripVisibility(trackId, emptyId, hasCards, filterActive) {
    var track = document.getElementById(trackId);
    var emptyEl = document.getElementById(emptyId);
    if (!track || !emptyEl) return;
    var breakout = track.closest(".carousel-breakout");
    // Empty state: message above a row of skeleton cards.
    emptyEl.hidden = hasCards;
    if (breakout) breakout.hidden = false;
    if (!hasCards) {
      for (var i = 0; i < 3; i += 1) track.appendChild(buildSkeletonCard());
      if (filterActive) {
        emptyEl.textContent =
          emptyId === "completed-empty"
            ? tr("completed_empty_filter", "No completed sessions match that ID.")
            : tr("training_empty_filter", "No active sessions match that ID.");
      } else {
        var d = stripDefault(emptyId);
        if (d) emptyEl.textContent = d;
      }
    }
  }

  function renderDashboard() {
    if (!window.HIIT_CARDS) return;

    var hp = getProgress();
    var completed = [];
    var remaining = [];

    window.HIIT_CARDS.forEach(function (card) {
      var n = card.exercises.length;
      var checks = hp.getChecksForCard(card.id, n);
      if (n === 0) {
        remaining.push(card);
        return;
      }
      if (hp.isFullyComplete(checks)) {
        completed.push(card);
      } else {
        remaining.push(card);
      }
    });

    renderMetrics(completed.length, remaining.length);

    var searchEl = document.getElementById("dashboard-search");
    var q = searchEl ? normalizeIdSearch(searchEl.value) : "";
    var filterActive = q.length > 0;
    var showCompleted = filterCardsByIdQuery(completed, q);
    var showRemaining = filterCardsByIdQuery(remaining, q);

    var completedTrack = document.getElementById("completed-track");
    var trainingTrack = document.getElementById("cards-track");

    if (completedTrack) {
      completedTrack.innerHTML = "";
      showCompleted.forEach(function (card) {
        completedTrack.appendChild(buildCardElement(card, hp, "completed"));
      });
      setStripVisibility("completed-track", "completed-empty", showCompleted.length > 0, filterActive);
    }

    if (trainingTrack) {
      trainingTrack.innerHTML = "";
      showRemaining.forEach(function (card) {
        trainingTrack.appendChild(buildCardElement(card, hp, "remaining"));
      });
      setStripVisibility("cards-track", "training-empty", showRemaining.length > 0, filterActive);
    }
  }

  var METRICS_PANEL_STORAGE_KEY = "hiit-metrics-panel-expanded";

  function initMetricsPanelToggle() {
    var btn = document.getElementById("metrics-panel-toggle");
    var panel = document.getElementById("metrics-panel-content");
    var section = document.querySelector(".metrics-panel-section");
    if (!btn || !panel) return;

    function setExpanded(expanded) {
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        expanded
          ? tr("metrics_collapse", "Collapse Metrics section")
          : tr("metrics_expand", "Expand Metrics section")
      );
      if (expanded) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
      if (section) section.setAttribute("data-metrics-expanded", expanded ? "true" : "false");
      try {
        localStorage.setItem(METRICS_PANEL_STORAGE_KEY, expanded ? "1" : "0");
      } catch (e) {
        /* ignore */
      }
    }

    var saved = null;
    try {
      saved = localStorage.getItem(METRICS_PANEL_STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    var expanded = saved === null ? true : saved === "1";
    setExpanded(expanded);

    btn.addEventListener("click", function () {
      setExpanded(btn.getAttribute("aria-expanded") !== "true");
    });
  }

  function init() {
    renderDashboard();
    initMetricsPanelToggle();
    var searchInput = document.getElementById("dashboard-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderDashboard();
      });
    }
    window.addEventListener("pageshow", function () {
      renderDashboard();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        renderDashboard();
        if (window.HiitHeatmap && typeof window.HiitHeatmap.refresh === "function") {
          window.HiitHeatmap.refresh();
        }
      }
    });
  }

  if (document.getElementById("cards-track") || document.getElementById("metrics-grid")) {
    init();
    window.addEventListener("hiit-langchange", function () {
      renderDashboard();
      var btn = document.getElementById("metrics-panel-toggle");
      if (btn) {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute(
          "aria-label",
          expanded
            ? tr("metrics_collapse", "Collapse Metrics section")
            : tr("metrics_expand", "Expand Metrics section")
        );
      }
    });
  }
})();
