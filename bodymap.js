(function () {
  "use strict";

  var mount = document.getElementById("body-map");
  if (!mount) return;

  var SEEN_KEY = "hiit-bodymap-seen";
  var SVG_NS = "http://www.w3.org/2000/svg";
  
  function tr(key, fallback) {
    var v = window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : null;
    return v && v !== key ? v : fallback;
  }

  /* ---------- Exercise → muscle zones ---------- */

  var ZONES = [
    "shoulders",
    "chest",
    "biceps",
    "triceps",
    "forearms",
    "abs",
    "quads",
    "calves",
    "upperback",
    "lats",
    "lowerback",
    "glutes",
    "hamstrings",
  ];

  var ZONE_LABELS = {
    shoulders: "Shoulders",
    chest: "Chest",
    biceps: "Biceps",
    triceps: "Triceps",
    forearms: "Forearms",
    abs: "Abs",
    quads: "Quads",
    calves: "Calves",
    upperback: "Upper back",
    lats: "Lats",
    lowerback: "Lower back",
    glutes: "Glutes",
    hamstrings: "Hamstrings",
  };

  // First match wins per rule; every matching rule adds its zones.
  var RULES = [
    [/push-?up/, ["chest", "triceps", "shoulders"]],
    [/burpee/, ["chest", "shoulders", "quads", "abs"]],
    [/thruster/, ["quads", "glutes", "shoulders"]],
    [/wall ball/, ["quads", "glutes", "shoulders"]],
    [/squat/, ["quads", "glutes"]],
    [/lunge/, ["quads", "glutes", "hamstrings"]],
    [/deadlift|swing/, ["hamstrings", "glutes", "lowerback"]],
    [/row/, ["upperback", "lats", "biceps"]],
    [/curl|biceps/, ["biceps", "forearms"]],
    [/triceps/, ["triceps"]],
    [/sit-?up|hollow/, ["abs"]],
    [/plank/, ["abs", "shoulders", "lowerback"]],
    [/climber/, ["abs", "shoulders", "quads"]],
    [/high knees/, ["quads", "abs", "calves"]],
    [/jumping jack/, ["shoulders", "calves", "quads"]],
  ];

  function zonesForCard(card) {
    var hit = {};
    (card.exercises || []).forEach(function (line) {
      var text = String(line).toLowerCase();
      RULES.forEach(function (rule) {
        if (rule[0].test(text)) {
          rule[1].forEach(function (z) {
            hit[z] = true;
          });
        }
      });
    });
    return Object.keys(hit);
  }

  function zoneCounts() {
    var counts = {};
    var hp = window.HiitProgress;
    if (!hp || !window.HIIT_CARDS) return counts;
    window.HIIT_CARDS.forEach(function (card) {
      var n = card.exercises.length;
      if (n === 0 || !hp.isFullyComplete(hp.getChecksForCard(card.id, n))) return;
      zonesForCard(card).forEach(function (z) {
        counts[z] = (counts[z] || 0) + 1;
      });
    });
    return counts;
  }

  function levelFor(n) {
    if (!n) return 0;
    return n >= 3 ? 3 : n;
  }

  function loadSeen() {
    try {
      var p = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
      return p && typeof p === "object" ? p : {};
    } catch (e) {
      return {};
    }
  }

  function saveSeen(counts) {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(counts));
    } catch (e) {
      /* ignore */
    }
  }

  function isFemale() {
    var p = window.HiitUser && window.HiitUser.loadProfile ? window.HiitUser.loadProfile() : null;
    return !!p && p.gender === "female";
  }

  /* ---------- Figures ----------
     Each figure is a rendered anatomical mannequin (assets/bodymap/<key>.jpg) with the muscle zones laid
     over it. Zone outlines live in bodymap-zones.js, in image space (1080 x 1620). */

  var IMG_W = 1080;
  var IMG_H = 1620;
  var DIR = "assets/bodymap/";
  var XLINK = "http://www.w3.org/1999/xlink";
  var figureSeq = 0;

  function el(name, attrs, parent) {
    var n = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (k) {
      n.setAttribute(k, attrs[k]);
    });
    if (parent) parent.appendChild(n);
    return n;
  }

  /** Body centre line at height y, interpolated from the [y, x] table. */
  function centreAt(table, y) {
    if (y <= table[0][0]) return table[0][1];
    for (var i = 1; i < table.length; i += 1) {
      if (y <= table[i][0]) {
        var a = table[i - 1];
        var b = table[i];
        return a[1] + ((b[1] - a[1]) * (y - a[0])) / (b[0] - a[0]);
      }
    }
    return table[table.length - 1][1];
  }

  /** Closed Catmull-Rom spline through the points, as cubic Béziers. */
  function smoothClosed(pts) {
    var n = pts.length;
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 0; i < n; i += 1) {
      var p0 = pts[(i - 1 + n) % n];
      var p1 = pts[i];
      var p2 = pts[(i + 1) % n];
      var p3 = pts[(i + 2) % n];
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += "C" + c1[0].toFixed(1) + " " + c1[1].toFixed(1) + " " + c2[0].toFixed(1) + " " + c2[1].toFixed(1) +
        " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d + "Z";
  }

  /** Path for one zone: every polygon on the left, plus its mirror image on the right. */
  function zonePath(cfg, polys) {
    return polys
      .map(function (poly) {
        var mirrored = poly.map(function (pt) {
          return [2 * centreAt(cfg.cx, pt[1]) - pt[0], pt[1]];
        });
        return smoothClosed(poly) + smoothClosed(mirrored);
      })
      .join("");
  }

  // Per-level tint (R, G, B multipliers) applied to a copy of the render, so the muscle shading survives.
  var TINTS = { 1: [0.72, 1.0, 0.42], 2: [0.64, 1.02, 0.33], 3: [0.56, 1.05, 0.25] };

  /**
   * Builds one figure. `levels` maps zone -> 0..3; `fresh` lists the zones that gained a session since the
   * last visit (they pulse).
   */
  function buildFigure(view, female, levels, fresh) {
    var key = (female ? "female" : "male") + "-" + view;
    var cfg = window.HIIT_BODYMAP && window.HIIT_BODYMAP[key];
    var id = "bodymap-" + (figureSeq += 1);

    var stage = document.createElement("div");
    stage.className = "bodymap-stage";
    stage.setAttribute("role", "img");
    stage.setAttribute("aria-label", view === "front" ? tr("bm_front", "Front") : tr("bm_back", "Back"));

    var img = document.createElement("img");
    img.className = "bodymap-photo";
    img.src = DIR + key + ".jpg";
    img.alt = "";
    img.decoding = "async";
    stage.appendChild(img);
    if (!cfg) return stage;

    var svg = el("svg", { viewBox: "0 0 " + IMG_W + " " + IMG_H, class: "bodymap-overlay" }, stage);
    var defs = el("defs", {}, svg);
    var blur = el("filter", { id: id + "-soft", x: "-5%", y: "-5%", width: "110%", height: "110%" }, defs);
    el("feGaussianBlur", { stdDeviation: "2.2" }, blur);

    // Body silhouette: nothing is drawn outside the figure.
    var bodyMask = el("mask", { id: id + "-body", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: IMG_W, height: IMG_H }, defs);
    var mimg = el("image", { x: 0, y: 0, width: IMG_W, height: IMG_H, href: DIR + key + "-mask.png" }, bodyMask);
    mimg.setAttributeNS(XLINK, "xlink:href", DIR + key + "-mask.png");

    var clipped = el("g", { mask: "url(#" + id + "-body)" }, svg);
    [1, 2, 3].forEach(function (lvl) {
      var zonesAtLevel = Object.keys(cfg.zones).filter(function (z) {
        return levels[z] === lvl;
      });
      if (!zonesAtLevel.length) return;
      var t = TINTS[lvl];
      var f = el("filter", { id: id + "-tint" + lvl, colorInterpolationFilters: "sRGB" }, defs);
      el("feColorMatrix", {
        type: "matrix",
        values: t[0] + " 0 0 0 0  0 " + t[1] + " 0 0 0  0 0 " + t[2] + " 0 0  0 0 0 1 0",
      }, f);
      var zoneMask = el("mask", { id: id + "-m" + lvl, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: IMG_W, height: IMG_H }, defs);
      var soft = el("g", { filter: "url(#" + id + "-soft)" }, zoneMask);
      zonesAtLevel.forEach(function (z) {
        el("path", {
          d: zonePath(cfg, cfg.zones[z]),
          fill: "#fff",
          class: fresh[z] ? "bodymap-zone bodymap-zone--new" : "bodymap-zone",
        }, soft);
      });
      var tinted = el("image", {
        x: 0, y: 0, width: IMG_W, height: IMG_H, href: DIR + key + ".jpg",
        filter: "url(#" + id + "-tint" + lvl + ")", mask: "url(#" + id + "-m" + lvl + ")",
      }, clipped);
      tinted.setAttributeNS(XLINK, "xlink:href", DIR + key + ".jpg");
    });

    // Invisible hit areas so hovering a muscle names it.
    Object.keys(cfg.zones).forEach(function (z) {
      var n = (window.__bodymapCounts || {})[z] || 0;
      var label = tr("bm_zone_" + z, ZONE_LABELS[z]);
      var hit = el("path", { d: zonePath(cfg, cfg.zones[z]), class: "bodymap-hit" }, svg);
      var title = document.createElementNS(SVG_NS, "title");
      title.textContent = n ? label + " · ×" + n : label;
      hit.appendChild(title);
    });
    return stage;
  }

  /* ---------- Card ---------- */

  function render() {
    var counts = zoneCounts();
    var seen = loadSeen();
    var female = isFemale();
    var levels = {};
    var fresh = {};
    ZONES.forEach(function (z) {
      levels[z] = levelFor(counts[z] || 0);
      fresh[z] = (counts[z] || 0) > (seen[z] || 0);
    });
    window.__bodymapCounts = counts;

    mount.innerHTML = "";
    var card = document.createElement("div");
    card.className = "completion-heatmap-card bodymap-card";

    var head = document.createElement("div");
    head.className = "completion-heatmap-title-wrap";
    head.innerHTML =
      '<h2 class="completion-heatmap-title"></h2><p class="completion-heatmap-sub"></p>';
    head.querySelector("h2").textContent = tr("bm_title", "Muscle map");
    head.querySelector("p").textContent = tr(
      "bm_sub",
      "Each completed session lights up the muscles it worked."
    );
    card.appendChild(head);

    var body = document.createElement("div");
    body.className = "bodymap-body";

    var figs = document.createElement("div");
    figs.className = "bodymap-figures";
    ["front", "back"].forEach(function (view) {
      var fig = document.createElement("figure");
      fig.className = "bodymap-fig";
      fig.appendChild(buildFigure(view, female, levels, fresh));
      var cap = document.createElement("figcaption");
      cap.textContent = view === "front" ? tr("bm_front", "Front") : tr("bm_back", "Back");
      fig.appendChild(cap);
      figs.appendChild(fig);
    });
    body.appendChild(figs);

    var list = document.createElement("ul");
    list.className = "bodymap-list";
    var trained = ZONES.filter(function (z) {
      return counts[z];
    }).sort(function (a, b) {
      return counts[b] - counts[a];
    });
    if (trained.length === 0) {
      var empty = document.createElement("li");
      empty.className = "bodymap-list__empty";
      empty.textContent = tr("bm_empty", "Complete a session to light up the muscles you trained.");
      list.appendChild(empty);
    }
    trained.forEach(function (z) {
      var li = document.createElement("li");
      li.className = "bodymap-chip bodymap-chip--l" + levelFor(counts[z]);
      var label = tr("bm_zone_" + z, ZONE_LABELS[z]);
      li.innerHTML = '<span class="bodymap-chip__name"></span><span class="bodymap-chip__n"></span>';
      li.querySelector(".bodymap-chip__name").textContent = label;
      li.querySelector(".bodymap-chip__n").textContent = "×" + counts[z];
      list.appendChild(li);
    });
    body.appendChild(list);
    card.appendChild(body);

    var legend = document.createElement("div");
    legend.className = "completion-heatmap-legend";
    legend.setAttribute("aria-hidden", "true");
    var less = document.createElement("span");
    less.className = "completion-heatmap-legend__text";
    less.textContent = tr("heatmap_less", "Less");
    var sq = document.createElement("div");
    sq.className = "completion-heatmap-legend__squares";
    for (var l = 0; l < 4; l += 1) {
      var s = document.createElement("span");
      s.className = "completion-heatmap-cell bodymap-legend-cell bodymap-legend-cell--" + l;
      sq.appendChild(s);
    }
    var more = document.createElement("span");
    more.className = "completion-heatmap-legend__text";
    more.textContent = tr("heatmap_more", "More");
    legend.appendChild(less);
    legend.appendChild(sq);
    legend.appendChild(more);
    card.appendChild(legend);

    mount.appendChild(card);

    saveSeen(counts);
  }

  render();
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) render(); // back/forward cache restore
  });
  window.addEventListener("hiit-langchange", render);
  window.addEventListener("storage", render);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") render();
  });

  window.HiitBodyMap = { refresh: render };
})();
