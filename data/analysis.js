/* 2021–2026 CSAT paper analysis, derived from OCR of the six official UPSC papers.
   Section counts are estimates normalised to 80 questions; topic counts are tags of
   OCR-recognised questions (n per year shown), so they under-count slightly. */
window.CATALOG = window.CATALOG || {};
window.CATALOG.analysis = {
  years: [2021, 2022, 2023, 2024, 2025, 2026],
  tagged: { 2021: 51, 2022: 69, 2023: 53, 2024: 77, 2025: 56, 2026: 77 },

  /* Estimated section mix in each 80-question paper */
  sectionMix: [
    { year: 2021, rc: 30, quant: 32, lr: 18, note: "Balanced paper; RC-heavy opening, arithmetic from Q16, a cluster of 3-digit puzzles." },
    { year: 2022, rc: 28, quant: 33, lr: 19, note: "First clean 5-question data-sufficiency style set; heavy number puzzles." },
    { year: 2023, rc: 24, quant: 31, lr: 25, note: "Reasoning-heavy; 10-question data-sufficiency cluster; cube and arrangement puzzles." },
    { year: 2024, rc: 27, quant: 33, lr: 20, note: "Hardest recent arithmetic; 12-question DS block at Q59–70; three clock-calendar questions." },
    { year: 2025, rc: 25, quant: 31, lr: 24, note: "Lengthy paras; number-system cluster; graph/road and tournament puzzles." },
    { year: 2026, rc: 24, quant: 35, lr: 21, note: "Most arithmetic-dense paper of the six; statement-validity and matching-list formats debut." }
  ],

  /* Topic tags of recognised questions */
  quantHeat: [
    { id: "number-system", title: "Number system & LCM/HCF", counts: [6, 12, 11, 13, 9, 13] },
    { id: "percentage-ratio", title: "Percentage · ratio · average · mixture", counts: [6, 6, 1, 6, 4, 7] },
    { id: "commercial-math", title: "Profit, loss, SI & CI", counts: [1, 2, 0, 2, 0, 3] },
    { id: "time-work", title: "Time & work (pipes)", counts: [0, 1, 1, 2, 1, 0] },
    { id: "speed-distance", title: "Time, speed & distance", counts: [0, 1, 0, 0, 2, 5] },
    { id: "pnc-probability", title: "Permutation, combination & probability", counts: [3, 4, 3, 0, 0, 2] },
    { id: "sets-venn", title: "Sets & Venn diagrams", counts: [1, 0, 0, 1, 0, 0] },
    { id: "number-series", title: "Number series & sequences", counts: [3, 3, 2, 4, 2, 2] },
    { id: "data-interpretation", title: "Data interpretation", counts: [2, 1, 0, 0, 0, 0] },
    { id: "calendar-clock", title: "Calendar & clock", counts: [1, 2, 2, 3, 0, 0] },
    { id: "geometry-mensuration", title: "Geometry, mensuration & counting", counts: [0, 1, 3, 2, 1, 3] }
  ],
  lrHeat: [
    { id: "series-odd", title: "Letter series, analogy, odd one out", counts: [3, 0, 1, 0, 3, 0] },
    { id: "coding-decoding", title: "Coding–decoding", counts: [1, 1, 1, 3, 2, 1] },
    { id: "blood-relations", title: "Blood relations", counts: [0, 2, 0, 0, 1, 1] },
    { id: "direction-sense", title: "Direction sense", counts: [1, 1, 0, 1, 0, 1] },
    { id: "syllogism", title: "Syllogism", counts: [2, 2, 0, 1, 0, 1] },
    { id: "conditional-logic", title: "Conditional logic & deduction", counts: [0, 0, 1, 2, 1, 1] },
    { id: "ranking-seating", title: "Ranking, ordering & seating", counts: [1, 2, 1, 0, 0, 2] },
    { id: "puzzles", title: "Puzzles & multiple correlations", counts: [0, 2, 1, 0, 3, 6] },
    { id: "data-sufficiency", title: "Data sufficiency", counts: [1, 2, 4, 10, 3, 5] }
  ],
  rcNote: "Passage-based inference and assumption questions (19–27 a year) sit in the reading block and are the natural home of critical reasoning. We tag them separately so the LR counts above show only standalone reasoning items.",

  insights: [
    {
      title: "Number system is the spine of CSAT quant",
      body: "Digit puzzles, divisibility, unit digits, remainders and HCF/LCM average 10–13 tagged questions a year — the single largest block. The alphametic style (PQ × 3 = RQQ; ABC × D = 37DD; 4x5y790 divisible by 11) recurs in every paper since 2021. Practise reconstructing digits from constraints, not plugging options."
    },
    {
      title: "Arithmetic is multi-step and context-wrapped",
      body: "Percentage, ratio, average and mixture questions rarely use a single formula. They chain two or three changes (increase k%, decrease k%, increase again), embed averages inside inequalities, or hide ratios in elections, salaries and sports. 2026 alone had seven such questions."
    },
    {
      title: "Data sufficiency is a format, not a topic",
      body: "Since 2022 every paper carries a compact DS set — 5 questions in 2026 (Q1–5), 10+ in 2024 (Q59–70), 3 in 2025. The skill is deciding sufficiency without fully solving. Know the four CSAT options cold; they appear verbatim, including 'either statement alone'."
    },
    {
      title: "Geometry rewards visual counting, not theorems",
      body: "Expect cubes cut and painted, tiles, rectangles cut into pieces, points on squares, and circle arrangements — 2–3 a year. Almost never a formal theorem. Draw, label, count faces/edges and use symmetry."
    },
    {
      title: "Reasoning is puzzle-led with a coding tail",
      body: "Ranking/seating and multi-attribute puzzles dominate recent LR. Coding–decoding appears every year (1–3 questions), and one symbol-substitution or inequality question is near-certain. Syllogism is light (0–2) but the 'statement + two conclusions' format is stable."
    },
    {
      title: "Calendar–clock is quietly reliable",
      body: "2021–2024 each had 1–3 calendar/clock questions; 2025–2026 folded them into number-system and modular counting instead. Odd days, same-calendar years, coincidence counts and 4:25-type angles remain fair game."
    },
    {
      title: "2026 introduced statement-validity and matching-list items",
      body: "Fourteen 2026 questions asked 'Which of the following statements is/are correct?' over a short passage — a GS-style format crossing into CSAT. Matching lists over relations, tools and barriers also appeared. Expect this hybrid style to persist."
    },
    {
      title: "Time pressure is the real difficulty",
      body: "Quant is roughly 8–10 easy, 15–18 moderate and 4–6 hard questions per paper. The hard ones are usually long digit puzzles. A 60-second-per-question discipline plus a deliberate skip list is worth more than any single shortcut."
    }
  ],

  outlook: [
    "Keep the 5-question data-sufficiency set at the start of the paper — rehearse the four options until they are automatic.",
    "Expect 2–4 digit/alphametic puzzles (numbers), 1–2 unit-digit or remainder items and 1 LCM/HCF item.",
    "Budget for 4–6 multi-step percentage/ratio/age questions and 2–3 average or mixture questions.",
    "Prepare 2–4 work and speed questions, including one circular-track or train-crossing item.",
    "Practise 2–3 counting questions: arrangements with restrictions, handshakes, choosing squares or triangles.",
    "Do not skip series — 2–4 appear yearly, often as fill-in-the-blank letter strings or number patterns.",
    "Keep calendar/clock alive at 1–2 questions: odd days, repeating calendars, coincidences and angle at a given time.",
    "For reasoning, drill 4–6 seating/ranking or attribute puzzles, 2 coding questions, 1–2 blood relations, 1–2 direction, 1–2 syllogism/inequality.",
    "Expect at least one 'statement-validity' set and one matching-list question in the 2026 mould.",
    "Train at 50–55 minutes for the 40 quant+reasoning questions, leaving the rest for reading comprehension."
  ],

  paperNotes: [
    { year: 2021, label: "Balanced", tone: "teal", text: "Classic paper. Opening RC, arithmetic from Q16, chessboard and handshake counting, pie-chart DI, and a pair of alphametic puzzles. No explicit 5-question DS block; calendar question at Q48." },
    { year: 2022, label: "Puzzle-heavy", tone: "gold", text: "Number puzzles dominate: 3-digit permutations, digit arrangements, lock PIN, two-digit products. A clean data-sufficiency pair at Q37/Q49. Equation-based percentage at Q60." },
    { year: 2023, label: "Reasoning-heavy", tone: "blue", text: "Ten-question DS cluster at Q58–60 and Q79, plus cube-cutting, ring-passing and word-arrangement items. Coding (ZERO→CHUR) and odd-group classification. Time-work at Q20." },
    { year: 2024, label: "Hardest arithmetic", tone: "gold", text: "Expression puzzle, divisibility of 222³³³+333²²², mixture, rightmost digit, HCF, partnership, three clock-calendar questions and a 12-question DS block. Widely rated the toughest of the six." },
    { year: 2025, label: "Lengthy", tone: "teal", text: "Long passages, then number-system cluster (LCM/HCF, digit position, remainders). Cube painting, circular track, train overtaking, tournament and road-graph puzzles. DS at Q68–73." },
    { year: 2026, label: "Arithmetic-dense", tone: "accent", text: "Sixteen of the first twenty non-RC questions are arithmetic or number-system. Five-question DS opener, queue/word arrangements, tile and rod puzzles, plus new statement-validity and matching-list formats." }
  ]
};
