/**
 * Exercise reference illustrations shown in the info popup of each exercise row.
 * One image per movement in assets/exercises/<key>.jpg; lines are matched by keyword.
 */
(function () {
  "use strict";

  var DIR = "assets/exercises/";

  /** Maps an exercise line to an illustration key (same vocabulary as the sprite thumbnails). */
  function poseKey(line) {
    var t = String(line || "").toLowerCase();
    var rules = [
      [/thruster/, "thruster"],
      [/wall ball/, "wallball"],
      [/burpee/, "burpee"],
      [/climber/, "climber"],
      [/hollow/, "hollow"],
      [/plank/, "plank"],
      [/push-?up/, "pushup"],
      [/sit-?up|crunch/, "situp"],
      [/jumping jack/, "jack"],
      [/high knee/, "highknees"],
      [/swing|kettlebell/, "swing"],
      [/deadlift/, "deadlift"],
      [/bent-?over|\brows?\b/, "row"],
      [/lunge/, "lunge"],
      [/squat/, "squat"],
      [/biceps|curl/, "curl"],
      [/triceps/, "triceps"],
    ];
    for (var i = 0; i < rules.length; i += 1) {
      if (rules[i][0].test(t)) return rules[i][1];
    }
    return null;
  }

  window.HiitExerciseArt = {
    poseKey: poseKey,
    /** @returns {string|null} <img> markup, or null when there is no illustration for the line */
    render: function (line) {
      var k = poseKey(line);
      if (!k) return null;
      return '<img class="exercise-art" src="' + DIR + k + '.jpg" alt="" decoding="async" />';
    },
  };
})();
