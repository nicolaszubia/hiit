/**
 * HIIT workout cards — warm-up, WOD, final work, optional AMRAP.
 * Raw rows in HIIT_WORKOUTS_RAW; HIIT_CARDS is normalized for the app.
 */
function normalizeHiitWorkout(raw) {
  var sectionDefs = [
    { key: "warmup", label: "Warm-up" },
    { key: "wod", label: "Workout of the day" },
    { key: "final", label: "Final work" },
    { key: "amrap", label: "AMRAP" },
  ];
  var workoutSections = [];
  var exercises = [];
  sectionDefs.forEach(function (def) {
    var lines = raw[def.key];
    if (lines && lines.length) {
      workoutSections.push({ label: def.label, lines: lines.slice() });
      for (var i = 0; i < lines.length; i++) exercises.push(lines[i]);
    }
  });
  var diff = (raw.difficulty || "").trim();
  var sub = diff ? diff.charAt(0).toUpperCase() + diff.slice(1) : "";
  return {
    id: String(raw.id),
    title: "Session " + raw.id,
    subtitle: sub,
    preview: exercises.slice(0, 4),
    exercises: exercises,
    workoutSections: workoutSections,
    notes: [],
  };
}

window.HIIT_WORKOUTS_RAW = [
  {
    "id": 1,
    "difficulty": "easy",
    "warmup": [
      "3 rounds: 20 jumping jacks",
      "10 squats",
      "10 sit-ups",
      "10 mountain climbers (each side)",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "12 deadlifts",
      "12 push-ups",
      "12 bent-over rows",
      "12 lunges (6/6)",
      "rest 30s"
    ],
    "final": [
      "2 rounds:",
      "40s plank",
      "40s jumping jacks",
      "rest 20s"
    ],
    "amrap": [

    ]
  },
  {
    "id": 2,
    "difficulty": "easy",
    "warmup": [
      "3 rounds: 15 jumping jacks",
      "10 lunges (5/5)",
      "10 sit-ups",
      "rest 30s"
    ],
    "wod": [
      "ladder 10-20-30-40:",
      "squats",
      "biceps curls"
    ],
    "final": [
      "3 rounds:",
      "30s mountain climbers",
      "30s plank"
    ],
    "amrap": [
      "6 min:",
      "8 burpees",
      "8 sit-ups",
      "8 squats"
    ]
  },
  {
    "id": 3,
    "difficulty": "easy",
    "warmup": [
      "2 rounds: 20 high knees",
      "15 jumping jacks",
      "10 push-ups",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "15 swings",
      "12 push-ups",
      "15 squats",
      "12 sit-ups",
      "rest 30s"
    ],
    "final": [
      "3 rounds:",
      "30s plank",
      "30s hollow hold"
    ],
    "amrap": [

    ]
  },
  {
    "id": 4,
    "difficulty": "easy",
    "warmup": [
      "3 rounds: 15 jumping jacks",
      "10 squats",
      "10 lunges (5/5)",
      "rest 30s"
    ],
    "wod": [
      "5 rounds:",
      "10 thrusters",
      "10 sit-ups",
      "10 rows",
      "rest 30s"
    ],
    "final": [

    ],
    "amrap": [
      "5 min:",
      "6 burpees",
      "6 wall balls",
      "6 lunges (3/3)"
    ]
  },
  {
    "id": 5,
    "difficulty": "easy",
    "warmup": [
      "3 rounds: 20 jumping jacks",
      "10 squats",
      "10 sit-ups",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "12 deadlifts",
      "12 lunges (6/6)",
      "12 push-ups",
      "12 sit-ups",
      "rest 30s"
    ],
    "final": [
      "2 rounds:",
      "40s mountain climbers",
      "40s plank"
    ],
    "amrap": [

    ]
  },
  {
    "id": 6,
    "difficulty": "easy",
    "warmup": [
      "2 rounds: 15 jumping jacks",
      "10 squats",
      "10 sit-ups",
      "rest 30s"
    ],
    "wod": [
      "ladder 10-20-30-40-50:",
      "sit-ups",
      "squats"
    ],
    "final": [

    ],
    "amrap": [
      "6 min:",
      "10 burpees",
      "10 squats",
      "10 sit-ups"
    ]
  },
  {
    "id": 7,
    "difficulty": "medium",
    "warmup": [
      "3 rounds: 20 jumping jacks",
      "10 lunges (5/5)",
      "10 mountain climbers",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "15 thrusters",
      "15 rows",
      "12 push-ups",
      "rest 30s"
    ],
    "final": [
      "3 rounds:",
      "30s plank",
      "30s jumping jacks"
    ],
    "amrap": [

    ]
  },
  {
    "id": 8,
    "difficulty": "medium",
    "warmup": [
      "2 rounds: 20 high knees",
      "10 squats",
      "10 sit-ups",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "10 deadlifts",
      "10 biceps curls",
      "10 triceps extensions",
      "10 lunges (5/5)",
      "rest 30s"
    ],
    "final": [

    ],
    "amrap": [
      "5 min:",
      "8 lunges",
      "8 sit-ups",
      "8 jumping jacks"
    ]
  },
  {
    "id": 9,
    "difficulty": "medium",
    "warmup": [
      "3 rounds: 15 jumping jacks",
      "10 climbers",
      "10 squats",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "12 squats",
      "12 push-ups",
      "12 sit-ups",
      "12 lunges",
      "rest 30s"
    ],
    "final": [
      "2 rounds:",
      "40s plank",
      "40s jumping jacks"
    ],
    "amrap": [

    ]
  },
  {
    "id": 10,
    "difficulty": "medium",
    "warmup": [
      "2 rounds: 20 jumping jacks",
      "10 squats",
      "rest 30s"
    ],
    "wod": [
      "descending 20-15-10-5:",
      "burpees",
      "sit-ups"
    ],
    "final": [
      "3 rounds:",
      "30s plank",
      "30s climbers"
    ],
    "amrap": [

    ]
  },
  {
    "id": 11,
    "difficulty": "medium",
    "warmup": [
      "3 rounds: 20 jumping jacks",
      "10 lunges",
      "10 sit-ups",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "12 deadlifts",
      "12 rows",
      "12 biceps",
      "12 push-ups",
      "rest 30s"
    ],
    "final": [
      "2 rounds:",
      "40s plank",
      "40s hollow"
    ],
    "amrap": [

    ]
  },
  {
    "id": 12,
    "difficulty": "medium",
    "warmup": [
      "3 rounds: 15 jumping jacks",
      "10 squats",
      "10 climbers",
      "rest 30s"
    ],
    "wod": [
      "5 rounds:",
      "10 thrusters",
      "10 lunges",
      "10 sit-ups",
      "rest 30s"
    ],
    "final": [

    ],
    "amrap": [
      "6 min:",
      "8 burpees",
      "8 squats",
      "8 sit-ups"
    ]
  },
  {
    "id": 13,
    "difficulty": "medium",
    "warmup": [
      "2 rounds: 20 high knees",
      "10 push-ups",
      "10 squats",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "15 swings",
      "12 push-ups",
      "15 squats",
      "12 sit-ups",
      "rest 30s"
    ],
    "final": [
      "3 rounds:",
      "30s plank",
      "30s jumping jacks"
    ],
    "amrap": [

    ]
  },
  {
    "id": 14,
    "difficulty": "hard",
    "warmup": [
      "3 rounds: 15 jumping jacks",
      "10 lunges",
      "rest 30s"
    ],
    "wod": [
      "ladder 10-20-30-40:",
      "deadlift",
      "push-ups"
    ],
    "final": [

    ],
    "amrap": [
      "5 min:",
      "6 burpees",
      "6 sit-ups",
      "6 squats"
    ]
  },
  {
    "id": 15,
    "difficulty": "hard",
    "warmup": [
      "3 rounds: 20 jumping jacks",
      "10 sit-ups",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "12 squats",
      "12 lunges",
      "12 push-ups",
      "12 sit-ups",
      "rest 30s"
    ],
    "final": [
      "2 rounds:",
      "40s climbers",
      "40s plank"
    ],
    "amrap": [

    ]
  },
  {
    "id": 16,
    "difficulty": "hard",
    "warmup": [
      "2 rounds: 15 jumping jacks",
      "10 squats",
      "rest 30s"
    ],
    "wod": [
      "EMOM 10 min:",
      "minute 1: 10 burpees",
      "minute 2: 15 squats"
    ],
    "final": [
      "3 rounds:",
      "30s plank",
      "30s hollow"
    ],
    "amrap": [

    ]
  },
  {
    "id": 17,
    "difficulty": "hard",
    "warmup": [
      "3 rounds: 20 jumping jacks",
      "10 lunges",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "15 thrusters",
      "15 rows",
      "12 push-ups",
      "rest 30s"
    ],
    "final": [

    ],
    "amrap": [
      "6 min:",
      "10 sit-ups",
      "10 squats",
      "10 jumping jacks"
    ]
  },
  {
    "id": 18,
    "difficulty": "hard",
    "warmup": [
      "2 rounds: 20 high knees",
      "10 sit-ups",
      "rest 30s"
    ],
    "wod": [
      "descending 20-15-10-5:",
      "squats",
      "push-ups"
    ],
    "final": [
      "3 rounds:",
      "30s climbers",
      "30s plank"
    ],
    "amrap": [

    ]
  },
  {
    "id": 19,
    "difficulty": "hard",
    "warmup": [
      "3 rounds: 15 jumping jacks",
      "10 lunges",
      "rest 30s"
    ],
    "wod": [
      "4 rounds:",
      "12 deadlifts",
      "12 biceps",
      "12 triceps",
      "12 sit-ups",
      "rest 30s"
    ],
    "final": [

    ],
    "amrap": [
      "5 min:",
      "8 burpees",
      "8 lunges",
      "8 sit-ups"
    ]
  },
  {
    "id": 20,
    "difficulty": "hard",
    "warmup": [
      "3 rounds: 20 jumping jacks",
      "10 squats",
      "rest 30s"
    ],
    "wod": [
      "ladder 10-20-30-40-50:",
      "sit-ups",
      "lunges"
    ],
    "final": [
      "2 rounds:",
      "40s plank",
      "40s jumping jacks"
    ],
    "amrap": [

    ]
  }
];

window.HIIT_CARDS = window.HIIT_WORKOUTS_RAW.map(normalizeHiitWorkout);

window.getCardById = function (id) {
  if (id == null || id === "") return undefined;
  var key = String(id).trim();
  return window.HIIT_CARDS.find(function (c) {
    return String(c.id) === key;
  });
};
