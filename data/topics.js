/* Topic catalogue + exam metadata. All practice banks register into window.BANKS. */
window.BANKS = window.BANKS || {};

window.CATALOG = {
  exam: "UPSC Civil Services (Preliminary) Examination",
  paper: "CSAT — General Studies Paper II",
  updated: "2026-11-14",
  years: [2021, 2022, 2023, 2024, 2025, 2026],
  topics: [
    /* ---------------- QUANT ---------------- */
    {
      id: "number-system", track: "quant", title: "Number System & LCM/HCF",
      short: "Divisibility, remainders, unit digits, factors, parity and digit puzzles.",
      mono: "NS", color: "", level: "Core", count: 50, file: "data/quant/number-system.js",
      subtopics: ["Divisibility rules", "Remainders", "Unit digit", "LCM & HCF", "Digit puzzles", "Parity"]
    },
    {
      id: "percentage-ratio", track: "quant", title: "Percentage, Ratio, Average & Mixture",
      short: "Multi-step percentage change, elections, ratios, weighted averages and alligation.",
      mono: "PR", color: "teal", level: "High-yield", count: 50, file: "data/quant/percentage-ratio.js",
      subtopics: ["Percentage change", "Elections & votes", "Ratio & proportion", "Weighted average", "Mixtures & alligation"]
    },
    {
      id: "commercial-math", track: "quant", title: "Profit, Loss, SI & CI",
      short: "Cost price, discounts, simple and compound interest, instalments and partnerships.",
      mono: "CM", color: "gold", level: "Scoring", count: 50, file: "data/quant/commercial-math.js",
      subtopics: ["Profit & loss", "Discount", "Simple interest", "Compound interest", "Instalments", "Partnership"]
    },
    {
      id: "time-work", track: "quant", title: "Time & Work (with Pipes)",
      short: "Work rates, combined effort, wages, alternate-day work and cistern problems.",
      mono: "TW", color: "blue", level: "Scoring", count: 50, file: "data/quant/time-work.js",
      subtopics: ["Combined work", "Efficiency", "Alternate work", "Wages", "Pipes & cisterns"]
    },
    {
      id: "speed-distance", track: "quant", title: "Time, Speed & Distance",
      short: "Relative speed, trains, boats, average speed, races and timetable puzzles.",
      mono: "SD", color: "", level: "High-yield", count: 50, file: "data/quant/speed-distance.js",
      subtopics: ["Relative speed", "Trains", "Boats & streams", "Average speed", "Circular tracks", "Races"]
    },
    {
      id: "pnc-probability", track: "quant", title: "Permutation, Combination & Probability",
      short: "Counting with restrictions, arrangements, selections, probability and expectation.",
      mono: "PC", color: "teal", level: "High-yield", count: 50, file: "data/quant/pnc-probability.js",
      subtopics: ["Counting", "Arrangements", "Selections", "Circular permutations", "Probability", "Pigeonhole"]
    },
    {
      id: "sets-venn", track: "quant", title: "Sets & Venn Diagrams",
      short: "Two- and three-set problems, inclusion–exclusion, survey data and region counting.",
      mono: "SV", color: "blue", level: "Moderate", count: 50, file: "data/quant/sets-venn.js",
      subtopics: ["Two sets", "Three sets", "Inclusion–exclusion", "Survey data", "Only/both conditions"]
    },
    {
      id: "number-series", track: "quant", title: "Number Series & Sequences",
      short: "Missing terms, wrong terms, alternating patterns, letter–number series and matrices.",
      mono: "SQ", color: "gold", level: "High-yield", count: 50, file: "data/quant/number-series.js",
      subtopics: ["Arithmetic & geometric", "Difference patterns", "Mixed series", "Wrong term", "Letter–number"]
    },
    {
      id: "data-interpretation", track: "quant", title: "Data Interpretation",
      short: "Tables, bar/line/pie charts and caselets with percentage and ratio comparisons.",
      mono: "DI", color: "", level: "High-yield", count: 50, file: "data/quant/data-interpretation.js",
      subtopics: ["Tables", "Bar charts", "Line charts", "Pie charts", "Caselets", "Mixed charts"]
    },
    {
      id: "calendar-clock", track: "quant", title: "Calendars & Clocks",
      short: "Odd days, day–date questions, clock angles, coincidences and faulty clocks.",
      mono: "CC", color: "teal", level: "Moderate", count: 50, file: "data/quant/calendar-clock.js",
      subtopics: ["Odd days", "Day of week", "Calendar repetition", "Clock angles", "Faulty clocks"]
    },
    {
      id: "geometry-mensuration", track: "quant", title: "Geometry, Mensuration & Counting",
      short: "Triangles, circles, cubes, tiling, perimeter–area traps and figure counting.",
      mono: "GM", color: "blue", level: "High-yield", count: 50, file: "data/quant/geometry-mensuration.js",
      subtopics: ["Triangles", "Circles", "Cubes & blocks", "Mensuration", "Tiling", "Figure counting"]
    },

    /* ---------------- REASONING ---------------- */
    {
      id: "series-odd", track: "reasoning", title: "Letter Series, Analogy & Odd One Out",
      short: "Alphabet patterns, letter–number codes, analogies, classifications and matrices.",
      mono: "LS", color: "gold", level: "Scoring", count: 50, file: "data/reasoning/series-odd.js",
      subtopics: ["Letter series", "Analogy", "Odd one out", "Matrix patterns", "Alphabet positions"]
    },
    {
      id: "coding-decoding", track: "reasoning", title: "Coding–Decoding",
      short: "Letter shifts, word codes, digit–symbol codes, condition-based coding and decoding.",
      mono: "CD", color: "", level: "High-yield", count: 50, file: "data/reasoning/coding-decoding.js",
      subtopics: ["Letter shifts", "Word codes", "Number codes", "Conditional codes", "Decoding"]
    },
    {
      id: "blood-relations", track: "reasoning", title: "Blood Relations",
      short: "Family trees, generations, coded relations and sufficient-statement family puzzles.",
      mono: "BR", color: "teal", level: "Scoring", count: 50, file: "data/reasoning/blood-relations.js",
      subtopics: ["Family tree", "Generations", "Coded relations", "Sufficiency", "Gender logic"]
    },
    {
      id: "direction-sense", track: "reasoning", title: "Direction Sense",
      short: "Turns, displacement, shortest distance, shadows and two-person direction puzzles.",
      mono: "DS", color: "blue", level: "Scoring", count: 50, file: "data/reasoning/direction-sense.js",
      subtopics: ["Turns", "Displacement", "Shortest distance", "Shadow direction", "Two-person paths"]
    },
    {
      id: "syllogism", track: "reasoning", title: "Syllogism",
      short: "All/some/no statements, Venn verification, possibility cases and conclusion validity.",
      mono: "SY", color: "gold", level: "High-yield", count: 50, file: "data/reasoning/syllogism.js",
      subtopics: ["Two statements", "Three statements", "Possibility", "Venn method", "Either–or"]
    },
    {
      id: "conditional-logic", track: "reasoning", title: "Conditional Logic & Deduction",
      short: "If–then reasoning, contrapositives, truth values, inequalities and logical deduction.",
      mono: "CL", color: "", level: "Trap-heavy", count: 50, file: "data/reasoning/conditional-logic.js",
      subtopics: ["If–then", "Contrapositive", "True/false", "Inequalities", "Selection logic"]
    },
    {
      id: "ranking-seating", track: "reasoning", title: "Ranking, Ordering & Seating",
      short: "Ranks, queues, linear and circular arrangements, floor puzzles and position questions.",
      mono: "RS", color: "teal", level: "High-yield", count: 50, file: "data/reasoning/ranking-seating.js",
      subtopics: ["Ranking", "Queues", "Linear seating", "Circular seating", "Floors"]
    },
    {
      id: "puzzles", track: "reasoning", title: "Puzzles & Multiple Correlations",
      short: "Matching multiple attributes, scheduling, office/floor puzzles and truth-teller sets.",
      mono: "PZ", color: "blue", level: "Trap-heavy", count: 50, file: "data/reasoning/puzzles.js",
      subtopics: ["Attribute matching", "Scheduling", "Office puzzle", "Truth-tellers", "Selection puzzles"]
    },
    {
      id: "data-sufficiency", track: "reasoning", title: "Data Sufficiency",
      short: "The four-option CSAT format: decide whether Statement I, II or both are sufficient.",
      mono: "DF", color: "gold", level: "High-yield", count: 50, file: "data/reasoning/data-sufficiency.js",
      subtopics: ["Number properties", "Algebra", "Sets", "Ranking", "Geometry", "Yes/no questions"]
    },
    {
      id: "critical-reasoning", track: "reasoning", title: "Statement, Inference & Conclusion",
      short: "Assumptions, inferences, strengthen/weaken, cause–effect and course of action.",
      mono: "CR", color: "", level: "High-yield", count: 50, file: "data/reasoning/critical-reasoning.js",
      subtopics: ["Inference", "Assumption", "Conclusion", "Strengthen/weaken", "Cause–effect", "Course of action"]
    }
  ],
  analysis: {
    years: [2021, 2022, 2023, 2024, 2025, 2026],
    totals: [],           // filled by analysis data
    quantTopics: [],
    lrTopics: [],
    notes: []
  }
};
