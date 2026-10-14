/**
 * Sprite thumbnails for detail exercise rows.
 * Sheet A: 4×4 — Sheet B: 4×5 (rows × cols, 0-based col,row in mapping below).
 */
(function () {
  "use strict";

  var SHEETS = {
    a: {
      url: "assets/78223b1b-f08f-4176-ab06-f4e60e5ca349-776fda4c-d3ba-40fa-baad-9c046a25a936.png",
      cols: 4,
      rows: 4,
    },
    b: {
      url: "assets/19773bae-d8bc-4183-a2a4-4509837e1b6f-f1ea3d1c-6be7-464b-a389-4593104fbee1.png",
      cols: 4,
      rows: 5,
    },
  };

  function skipLine(t) {
    var s = t.trim();
    if (!s) return true;
    if (/^\d+\s*rounds?:?\s*$/i.test(s)) return true;
    if (/^rest\s/i.test(s)) return true;
    if (/^\d+\s*min:\s*$/i.test(s)) return true;
    if (/^(ladder|emom|descending)\s/i.test(s)) return true;
    if (/^minute\s+\d+\s*:/i.test(s)) return true;
    return false;
  }

  /** @returns {{ sheet: string, col: number, row: number } | null} */
  function matchRule(t) {
    var rules = [
      { re: /\b(jumping jack|high knees?)\b/i, sheet: "a", col: 1, row: 0 },
      { re: /\b(burpee|burpees)\b/i, sheet: "b", col: 0, row: 3 },
      { re: /\b(mountain\s+climbers?|climbers?)\b/i, sheet: "b", col: 0, row: 3 },
      { re: /\b(hollow|plank)\b/i, sheet: "b", col: 1, row: 3 },
      { re: /\b(push-up|pushup|push-ups)\b/i, sheet: "a", col: 1, row: 1 },
      { re: /\b(sit-up|situp|sit-ups|situps|crunch)\b/i, sheet: "b", col: 2, row: 2 },
      { re: /\b(thruster|wall ball)\b/i, sheet: "b", col: 3, row: 1 },
      { re: /\bsquats?\b/i, sheet: "b", col: 0, row: 0 },
      { re: /\blunges?\b/i, sheet: "b", col: 1, row: 0 },
      { re: /\bdeadlifts?\b/i, sheet: "a", col: 1, row: 2 },
      { re: /\b(swings?|kettlebell)\b/i, sheet: "b", col: 1, row: 1 },
      { re: /\b(bent-over|bent over)\b/i, sheet: "a", col: 2, row: 1 },
      { re: /\brows?\b/i, sheet: "b", col: 2, row: 0 },
      { re: /\b(biceps|curls?)\b/i, sheet: "a", col: 2, row: 3 },
      { re: /\b(triceps?|extensions?|dips?)\b/i, sheet: "a", col: 3, row: 3 },
      { re: /\b(russian twist|twists?)\b/i, sheet: "a", col: 3, row: 2 },
      { re: /\b(pull-up|pullup|chin-up|chinup)\b/i, sheet: "a", col: 0, row: 0 },
      { re: /\b(jump rope|skipping)\b/i, sheet: "a", col: 1, row: 0 },
      { re: /\b(box jump|step-up|step up)\b/i, sheet: "a", col: 0, row: 2 },
      { re: /\b(goblet|overhead press|ohp|shoulder press)\b/i, sheet: "b", col: 2, row: 1 },
      { re: /\b(overhead squat|ohs)\b/i, sheet: "b", col: 3, row: 3 },
      { re: /\b(superman|back extension)\b/i, sheet: "a", col: 1, row: 3 },
      { re: /\b(medicine ball|med ball)\b/i, sheet: "b", col: 3, row: 2 },
    ];

    for (var i = 0; i < rules.length; i++) {
      if (rules[i].re.test(t)) {
        return { sheet: rules[i].sheet, col: rules[i].col, row: rules[i].row };
      }
    }
    return null;
  }

  /**
   * @param {string} line
   * @returns {{ url: string, cols: number, rows: number, xPct: number, yPct: number } | null}
   */
  window.getExerciseThumbMeta = function (line) {
    var t = String(line || "").toLowerCase();
    if (skipLine(t)) return null;

    var m = matchRule(t);
    if (!m) {
      m = { sheet: "b", col: 0, row: 0 };
    }

    var spec = SHEETS[m.sheet];
    if (!spec) return null;

    var cols = spec.cols;
    var rows = spec.rows;
    var xPct = cols <= 1 ? 0 : (m.col / (cols - 1)) * 100;
    var yPct = rows <= 1 ? 0 : (m.row / (rows - 1)) * 100;

    return {
      url: spec.url,
      cols: cols,
      rows: rows,
      xPct: xPct,
      yPct: yPct,
    };
  };

  window.applyExerciseThumbStyles = function (el, meta) {
    if (!el || !meta) return;
    el.style.setProperty("--ex-thumb-url", 'url("' + meta.url + '")');
    el.style.setProperty("--ex-thumb-w", meta.cols * 100 + "%");
    el.style.setProperty("--ex-thumb-h", meta.rows * 100 + "%");
    el.style.setProperty("--ex-thumb-x", meta.xPct + "%");
    el.style.setProperty("--ex-thumb-y", meta.yPct + "%");
  };
})();
