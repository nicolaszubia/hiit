(function () {
  "use strict";

  var STORAGE_KEY = "hiit-session-progress";
  var COMPLETION_LOG_KEY = "hiit-completion-log";

  function loadAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveAll(obj) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      /* quota / private mode */
    }
  }

  /**
   * @param {string|number} cardId
   * @param {number} exerciseCount
   * @returns {boolean[]}
   */
  function getChecksForCard(cardId, exerciseCount) {
    var n = Math.max(0, Math.floor(exerciseCount));
    if (n === 0) return [];
    var all = loadAll();
    var key = String(cardId);
    var saved = all[key];
    if (!Array.isArray(saved) || saved.length !== n) {
      return new Array(n).fill(false);
    }
    return saved.map(function (v) {
      return Boolean(v);
    });
  }

  /**
   * @param {string|number} cardId
   * @param {boolean[]} checks
   */
  function setChecksForCard(cardId, checks) {
    if (!Array.isArray(checks)) return;
    var all = loadAll();
    all[String(cardId)] = checks.map(Boolean);
    saveAll(all);
  }

  /**
   * Majority = more than half of exercises marked done.
   * @param {boolean[]} checks
   */
  function isMajorityComplete(checks) {
    if (!checks || checks.length === 0) return false;
    var done = checks.filter(Boolean).length;
    return done > checks.length / 2;
  }

  /**
   * All exercises in the session marked done (moves card to Completed on home).
   * @param {boolean[]} checks
   */
  function isFullyComplete(checks) {
    if (!checks || checks.length === 0) return false;
    return checks.every(Boolean);
  }

  /**
   * @returns {{ t: number, cardId: string|null }[]}
   */
  function loadCompletionEvents() {
    try {
      var raw = localStorage.getItem(COMPLETION_LOG_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.events)) return [];
      var out = [];
      parsed.events.forEach(function (x) {
        if (typeof x === "number" && !isNaN(x)) {
          out.push({ t: x, cardId: null });
        } else if (x && typeof x === "object" && typeof x.t === "number" && !isNaN(x.t)) {
          out.push({
            t: x.t,
            cardId: x.cardId != null && x.cardId !== "" ? String(x.cardId) : null,
          });
        }
      });
      return out;
    } catch (e) {
      return [];
    }
  }

  function saveCompletionEvents(events) {
    try {
      localStorage.setItem(COMPLETION_LOG_KEY, JSON.stringify({ events: events }));
    } catch (e) {
      /* quota / private mode */
    }
  }

  /**
   * Call when a session becomes fully complete (all checkboxes checked).
   * Uses the device local clock for day and hour bucket (0–8, 8–16, 16–24).
   * @param {string|number} cardId session / card number shown on the board
   * @param {number} [timestamp] ms since epoch; default now
   */
  function recordCompletion(cardId, timestamp) {
    var t = timestamp != null ? Number(timestamp) : Date.now();
    if (isNaN(t)) t = Date.now();
    var id = cardId != null && cardId !== "" ? String(cardId) : null;
    var events = loadCompletionEvents();
    events.push({ t: t, cardId: id });
    saveCompletionEvents(events);
  }

  /**
   * When a session is no longer fully complete, drop its latest logged completion
   * so the heatmap cell count (and green level) can go down.
   * @param {string|number} cardId
   */
  function removeLastCompletionForCard(cardId) {
    var id = cardId != null && cardId !== "" ? String(cardId) : null;
    if (!id) return;
    var events = loadCompletionEvents();
    for (var i = events.length - 1; i >= 0; i--) {
      if (events[i].cardId === id) {
        events.splice(i, 1);
        saveCompletionEvents(events);
        return;
      }
    }
  }

  function slotKeyForDate(d) {
    var day = d.getDate();
    var h = d.getHours();
    var bucket = h < 8 ? 0 : h < 16 ? 1 : 2;
    return day + "-" + bucket;
  }

  /**
   * @param {number} year
   * @param {number} monthIndex 0 = January
   * @returns {Object.<string, { count: number, cardIds: string[] }>}
   */
  function getCompletionSlotDetailsForMonth(year, monthIndex) {
    var details = {};
    loadCompletionEvents().forEach(function (ev) {
      var d = new Date(ev.t);
      if (d.getFullYear() !== year || d.getMonth() !== monthIndex) return;
      var key = slotKeyForDate(d);
      if (!details[key]) details[key] = { count: 0, cardIds: [] };
      details[key].count += 1;
      if (ev.cardId != null) details[key].cardIds.push(ev.cardId);
    });
    return details;
  }

  /**
   * @param {number} year e.g. 2026
   * @param {number} monthIndex 0 = January
   * @returns {Object.<string, number>} keys "day-bucket" e.g. "3-2" = day 3, bucket 16–24h
   */
  function getCompletionSlotCountsForMonth(year, monthIndex) {
    var details = getCompletionSlotDetailsForMonth(year, monthIndex);
    var counts = {};
    Object.keys(details).forEach(function (k) {
      counts[k] = details[k].count;
    });
    return counts;
  }

  function startOfWeekMondayUtcMs(t) {
    var d = new Date(t);
    d.setHours(0, 0, 0, 0);
    var wd = d.getDay();
    var fromMon = wd === 0 ? 6 : wd - 1;
    d.setDate(d.getDate() - fromMon);
    return d.getTime();
  }

  /**
   * Stats derived from completion log (full session finishes) for badges UI.
   * @returns {{
   *   totalCompletions: number,
   *   uniqueSessionsCompleted: number,
   *   uniqueTrainingDays: number,
   *   maxCompletionsInOneWeek: number
   * }}
   */
  function getBadgeSnapshot() {
    var events = loadCompletionEvents();
    var total = events.length;
    var cardSet = {};
    var daySet = {};
    var weekCounts = {};
    events.forEach(function (ev) {
      if (ev.cardId) cardSet[ev.cardId] = true;
      var d = new Date(ev.t);
      var dk = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
      daySet[dk] = true;
      var wk = String(startOfWeekMondayUtcMs(ev.t));
      weekCounts[wk] = (weekCounts[wk] || 0) + 1;
    });
    var maxWeek = 0;
    Object.keys(weekCounts).forEach(function (k) {
      if (weekCounts[k] > maxWeek) maxWeek = weekCounts[k];
    });
    return {
      totalCompletions: total,
      uniqueSessionsCompleted: Object.keys(cardSet).length,
      uniqueTrainingDays: Object.keys(daySet).length,
      maxCompletionsInOneWeek: maxWeek,
    };
  }

  window.HiitProgress = {
    getChecksForCard: getChecksForCard,
    setChecksForCard: setChecksForCard,
    isMajorityComplete: isMajorityComplete,
    isFullyComplete: isFullyComplete,
    recordCompletion: recordCompletion,
    removeLastCompletionForCard: removeLastCompletionForCard,
    getCompletionSlotCountsForMonth: getCompletionSlotCountsForMonth,
    getCompletionSlotDetailsForMonth: getCompletionSlotDetailsForMonth,
    getBadgeSnapshot: getBadgeSnapshot,
  };
})();
