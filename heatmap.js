(function () {
  "use strict";

  var mount = document.getElementById("completion-heatmap");
  if (!mount) return;

  function tr(key, fallback) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : fallback;
  }

  function tf(key, vars, fallback) {
    if (window.HiitI18n && window.HiitI18n.tf) return window.HiitI18n.tf(key, vars);
    return fallback;
  }

  function dayDetail(slotDetails, d) {
    var count = 0;
    var cardIds = [];
    for (var b = 0; b < 3; b += 1) {
      var det = slotDetails[d + "-" + b];
      if (!det) continue;
      count += det.count || 0;
      cardIds = cardIds.concat(det.cardIds || []);
    }
    return { count: count, cardIds: cardIds };
  }

  var viewYear;
  var viewMonth;
  var scrollToTodayAfterRender = false;

  function todayYM() {
    var d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  }

  function daysInMonth(y, m) {
    return new Date(y, m + 1, 0).getDate();
  }

  function calendarToday() {
    var n = new Date();
    return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate() };
  }

  function isViewingTodayMonth(y, m) {
    var t = calendarToday();
    return y === t.y && m === t.m;
  }

  function monthTitle(y, m) {
    try {
      var loc =
        window.HiitI18n && window.HiitI18n.getLang && window.HiitI18n.getLang() === "es" ? "es" : "en";
      return new Date(y, m, 1).toLocaleString(loc, { month: "long", year: "numeric" });
    } catch (e) {
      return String(y) + " · " + String(m + 1);
    }
  }

  function countToLevel(n) {
    if (!n || n <= 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;
    return 3;
  }

  function uniqueSortedCardIds(ids) {
    var seen = Object.create(null);
    var out = [];
    (ids || []).forEach(function (id) {
      if (id == null || seen[id]) return;
      seen[id] = true;
      out.push(String(id));
    });
    out.sort(function (a, b) {
      var na = Number(a);
      var nb = Number(b);
      if (!isNaN(na) && !isNaN(nb) && String(na) === a && String(nb) === b) return na - nb;
      return a.localeCompare(b, undefined, { numeric: true });
    });
    return out;
  }

  function buildCellAriaLabel(monthName, day, slotDetail) {
    var head = tf("heatmap_aria_head", { month: monthName, day: day }, monthName + ", day " + day);
    if (!slotDetail || slotDetail.count <= 0) {
      return head + " · " + tr("heatmap_cell_none", "No completions");
    }
    var n = slotDetail.count;
    var mid =
      n === 1
        ? tf("heatmap_aria_done", { n: n }, " · " + n + " completion")
        : tf("heatmap_aria_dones", { n: n }, " · " + n + " completions");
    var line = head + mid;
    var uniq = uniqueSortedCardIds(slotDetail.cardIds || []);
    if (uniq.length > 0) {
      line += tr("heatmap_aria_ids", " · Card IDs: ") + uniq.map(function (id) { return "#" + id; }).join(", ");
    } else if (n > 0) {
      line += tr("heatmap_aria_legacy", " · Card IDs not stored (logged before this update)");
    }
    return line;
  }

  function cellTooltipLines(monthName, day, slotDetail) {
    var slot = tf("heatmap_aria_day", { day: day, month: monthName }, "Day " + day + " · " + monthName);
    if (!slotDetail || slotDetail.count <= 0) {
      return { primary: tr("heatmap_cell_none", "No completions"), secondary: slot };
    }
    var n = slotDetail.count;
    var primary =
      n === 1
        ? tr("heatmap_cell_one", "1 session")
        : tf("heatmap_cell_many", { n: n }, String(n) + " sessions");
    var uniq = uniqueSortedCardIds(slotDetail.cardIds || []);
    var secondary = slot;
    if (uniq.length > 0) {
      secondary =
        tr("heatmap_cell_cards", "Cards ") +
        uniq.map(function (id) { return "#" + id; }).join(", ") +
        " · " +
        slot;
    } else if (n > 0) {
      secondary = tr("heatmap_cell_old", "Older completions (no card IDs)") + " · " + slot;
    }
    return { primary: primary, secondary: secondary };
  }

  var heatmapTooltipEl = null;
  var heatmapTooltipPrimary = null;
  var heatmapTooltipSecondary = null;
  var heatmapTooltipScrollEl = null;

  function ensureHeatmapTooltip() {
    if (heatmapTooltipEl) return heatmapTooltipEl;
    heatmapTooltipEl = document.createElement("div");
    heatmapTooltipEl.className = "heatmap-tooltip";
    heatmapTooltipEl.setAttribute("role", "tooltip");
    heatmapTooltipEl.setAttribute("aria-hidden", "true");
    heatmapTooltipPrimary = document.createElement("div");
    heatmapTooltipPrimary.className = "heatmap-tooltip__primary";
    heatmapTooltipSecondary = document.createElement("div");
    heatmapTooltipSecondary.className = "heatmap-tooltip__secondary";
    heatmapTooltipEl.appendChild(heatmapTooltipPrimary);
    heatmapTooltipEl.appendChild(heatmapTooltipSecondary);
    document.body.appendChild(heatmapTooltipEl);
    return heatmapTooltipEl;
  }

  function hideHeatmapTooltip() {
    if (!heatmapTooltipEl) return;
    heatmapTooltipEl.classList.remove("heatmap-tooltip--visible");
    heatmapTooltipEl.setAttribute("aria-hidden", "true");
    if (heatmapTooltipScrollEl) {
      heatmapTooltipScrollEl.removeEventListener("scroll", hideHeatmapTooltip);
      heatmapTooltipScrollEl = null;
    }
  }

  function positionHeatmapTooltip(clientX, clientY) {
    if (!heatmapTooltipEl) return;
    var pad = 12;
    var margin = 8;
    heatmapTooltipEl.style.left = "0";
    heatmapTooltipEl.style.top = "0";
    var w = heatmapTooltipEl.offsetWidth;
    var h = heatmapTooltipEl.offsetHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var x = clientX + pad;
    var y = clientY + pad;
    if (x + w + margin > vw) x = Math.max(margin, clientX - w - pad);
    if (y + h + margin > vh) y = Math.max(margin, clientY - h - pad);
    heatmapTooltipEl.style.left = x + "px";
    heatmapTooltipEl.style.top = y + "px";
  }

  function showHeatmapTooltip(clientX, clientY, primary, secondary, scrollHost) {
    ensureHeatmapTooltip();
    heatmapTooltipPrimary.textContent = primary;
    heatmapTooltipSecondary.textContent = secondary;
    heatmapTooltipEl.setAttribute("aria-hidden", "false");
    heatmapTooltipEl.classList.add("heatmap-tooltip--visible");
    positionHeatmapTooltip(clientX, clientY);
    if (scrollHost && scrollHost !== heatmapTooltipScrollEl) {
      if (heatmapTooltipScrollEl) {
        heatmapTooltipScrollEl.removeEventListener("scroll", hideHeatmapTooltip);
      }
      heatmapTooltipScrollEl = scrollHost;
      heatmapTooltipScrollEl.addEventListener("scroll", hideHeatmapTooltip, { passive: true });
    }
  }

  function bindHeatmapCellTooltip(cell, scrollHost, monthName, d, detail) {
    var lines = cellTooltipLines(monthName, d, detail);
    cell.setAttribute("aria-label", buildCellAriaLabel(monthName, d, detail));
    cell.addEventListener("mouseenter", function (e) {
      showHeatmapTooltip(e.clientX, e.clientY, lines.primary, lines.secondary, scrollHost);
    });
    cell.addEventListener("mousemove", function (e) {
      if (heatmapTooltipEl && heatmapTooltipEl.classList.contains("heatmap-tooltip--visible")) {
        positionHeatmapTooltip(e.clientX, e.clientY);
      }
    });
    cell.addEventListener("mouseleave", hideHeatmapTooltip);
  }

  function render() {
    hideHeatmapTooltip();

    var hp = window.HiitProgress;
    if (!hp || typeof hp.getCompletionSlotDetailsForMonth !== "function") return;

    var slotDetails = hp.getCompletionSlotDetailsForMonth(viewYear, viewMonth);
    var dim = daysInMonth(viewYear, viewMonth);
    var monthName = monthTitle(viewYear, viewMonth);
    var today = calendarToday();
    var showTodayColumn = isViewingTodayMonth(viewYear, viewMonth);

    mount.innerHTML = "";

    var card = document.createElement("div");
    card.className = "completion-heatmap-card";

    var head = document.createElement("div");
    head.className = "completion-heatmap-header";

    var titleWrap = document.createElement("div");
    titleWrap.className = "completion-heatmap-title-wrap";
    var h2 = document.createElement("h2");
    h2.className = "completion-heatmap-title";
    h2.id = "completion-heatmap-heading";
    h2.textContent = tr("heatmap_title", "Completion calendar");
    var sub = document.createElement("p");
    sub.className = "completion-heatmap-sub";
    sub.textContent = tr(
      "heatmap_sub",
      "When you finish every exercise in a session, that day is marked."
    );
    titleWrap.appendChild(h2);
    titleWrap.appendChild(sub);

    var navWrap = document.createElement("div");
    navWrap.className = "completion-heatmap-nav-wrap";

    var nav = document.createElement("div");
    nav.className = "completion-heatmap-nav";
    nav.setAttribute("role", "group");
    nav.setAttribute("aria-label", tr("heatmap_month_group", "Month"));
    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "completion-heatmap-nav__btn";
    prevBtn.setAttribute("aria-label", tr("heatmap_prev_month", "Previous month"));
    prevBtn.textContent = "‹";
    var label = document.createElement("span");
    label.className = "completion-heatmap-nav__label";
    label.textContent = monthTitle(viewYear, viewMonth);
    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "completion-heatmap-nav__btn";
    nextBtn.setAttribute("aria-label", tr("heatmap_next_month", "Next month"));
    nextBtn.textContent = "›";
    nav.appendChild(prevBtn);
    nav.appendChild(label);
    nav.appendChild(nextBtn);

    var todayBtn = document.createElement("button");
    todayBtn.type = "button";
    todayBtn.className = "completion-heatmap-today-btn";
    todayBtn.textContent = tr("heatmap_today", "Today");
    todayBtn.setAttribute(
      "aria-label",
      tr("heatmap_today_aria", "Go to current month and scroll to today")
    );

    navWrap.appendChild(nav);
    navWrap.appendChild(todayBtn);

    head.appendChild(titleWrap);
    head.appendChild(navWrap);

    var legend = document.createElement("div");
    legend.className = "completion-heatmap-legend";
    legend.setAttribute("aria-hidden", "true");
    var legLess = document.createElement("span");
    legLess.className = "completion-heatmap-legend__text";
    legLess.textContent = tr("heatmap_less", "Less");
    var legSq = document.createElement("div");
    legSq.className = "completion-heatmap-legend__squares";
    for (var l = 0; l < 4; l += 1) {
      var sq = document.createElement("span");
      sq.className = "completion-heatmap-cell completion-heatmap-cell--" + l;
      legSq.appendChild(sq);
    }
    var legMore = document.createElement("span");
    legMore.className = "completion-heatmap-legend__text";
    legMore.textContent = tr("heatmap_more", "More");
    legend.appendChild(legLess);
    legend.appendChild(legSq);
    legend.appendChild(legMore);

    var scroll = document.createElement("div");
    scroll.className = "completion-heatmap-scroll";
    scroll.setAttribute("role", "region");
    scroll.setAttribute("aria-label", tr("heatmap_scroll_aria", "Completion grid by day"));
    scroll.setAttribute("tabindex", "0");

    var grid = document.createElement("div");
    grid.className = "completion-heatmap-grid";
    grid.style.gridTemplateColumns = "repeat(" + dim + ", minmax(0.45rem, 1fr))";

    for (var day = 1; day <= dim; day += 1) {
      var dh = document.createElement("div");
      dh.className = "completion-heatmap-dayhead";
      if (showTodayColumn && day === today.d) {
        dh.classList.add("completion-heatmap-dayhead--today");
        dh.setAttribute("aria-current", "date");
      }
      dh.textContent = String(day);
      grid.appendChild(dh);
    }

    for (var d = 1; d <= dim; d += 1) {
      var detail = dayDetail(slotDetails, d);
      var level = countToLevel(detail.count);
      var cell = document.createElement("div");
      cell.className = "completion-heatmap-cell completion-heatmap-cell--" + level;
      if (showTodayColumn && d === today.d) {
        cell.classList.add("completion-heatmap-cell--today");
      }
      bindHeatmapCellTooltip(cell, scroll, monthName, d, detail);
      grid.appendChild(cell);
    }

    scroll.appendChild(grid);

    card.appendChild(head);
    card.appendChild(scroll);
    card.appendChild(legend);
    mount.appendChild(card);

    prevBtn.addEventListener("click", function () {
      scrollToTodayAfterRender = false;
      if (viewMonth === 0) {
        viewYear -= 1;
        viewMonth = 11;
      } else {
        viewMonth -= 1;
      }
      render();
    });

    nextBtn.addEventListener("click", function () {
      scrollToTodayAfterRender = false;
      if (viewMonth === 11) {
        viewYear += 1;
        viewMonth = 0;
      } else {
        viewMonth += 1;
      }
      render();
    });

    todayBtn.addEventListener("click", function () {
      var tm = todayYM();
      viewYear = tm.y;
      viewMonth = tm.m;
      scrollToTodayAfterRender = true;
      render();
    });

    if (scrollToTodayAfterRender) {
      scrollToTodayAfterRender = false;
      window.requestAnimationFrame(function () {
        var mark = grid.querySelector(".completion-heatmap-dayhead--today");
        if (mark && scroll) {
          var reduceMotion =
            window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          mark.scrollIntoView({
            inline: "center",
            block: "nearest",
            behavior: reduceMotion ? "auto" : "smooth",
          });
        }
      });
    }
  }

  var startYm = todayYM();
  viewYear = startYm.y;
  viewMonth = startYm.m;

  render();

  window.addEventListener("pageshow", function () {
    render();
  });

  window.addEventListener("hiit-langchange", render);

  window.HiitHeatmap = { refresh: render };
})();
