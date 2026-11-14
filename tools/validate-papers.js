#!/usr/bin/env node
/* Validates official-paper test banks in data/papers/. Run:
   node tools/validate-papers.js */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = path.join(__dirname, "..", "data", "papers");

const TAGS = [
  "Number system",
  "Percentage & ratio",
  "Profit, loss & interest",
  "Average & mixture",
  "Time & work",
  "Speed & distance",
  "Permutation & probability",
  "Data interpretation",
  "Calendar & clock",
  "Geometry & mensuration",
  "Number series",
  "Letter series & analogy",
  "Coding-decoding",
  "Blood relations",
  "Direction sense",
  "Syllogism",
  "Ranking & seating",
  "Puzzles",
  "Data sufficiency",
  "Conditional logic",
  "Statement logic"
];

function normTag(t) {
  return String(t || "").replace(/[\u2013\u2014]/g, "-").trim();
}
const TAG_SET = new Set(TAGS.map(normTag));

if (!fs.existsSync(DIR)) {
  console.log("No data/papers directory yet.");
  process.exit(0);
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".js")).sort();
if (!files.length) {
  console.log("No paper files in data/papers.");
  process.exit(0);
}

const sandbox = { window: {} };
vm.createContext(sandbox);

const errors = [];
let totalQs = 0;

for (const file of files) {
  const full = path.join(DIR, file);
  try {
    vm.runInContext(fs.readFileSync(full, "utf8"), sandbox, { filename: full });
  } catch (e) {
    errors.push(`${file}: syntax error — ${e.message}`);
    continue;
  }
  const key = file.replace(/\.js$/, "");
  const paper = sandbox.window.PAPER_TESTS && sandbox.window.PAPER_TESTS[key];
  if (!paper) {
    errors.push(`${file}: window.PAPER_TESTS["${key}"] missing`);
    continue;
  }
  const err = (m) => errors.push(`${file}: ${m}`);

  if (paper.id !== key) err(`id "${paper.id}" does not match filename`);
  if (!Number.isInteger(paper.year)) err("year must be an integer");
  const qs = paper.questions;
  if (!Array.isArray(qs)) { err("questions must be an array"); continue; }
  if (qs.length < 40) err(`only ${qs.length} questions (expected >= 40)`);
  if (qs.length > 80) err(`${qs.length} questions (a paper has 80 max)`);

  const seenN = new Set();
  const seenStems = new Map();
  let prevN = 0;

  qs.forEach((q, i) => {
    const at = `q[${i}]${q && q.n ? " n=" + q.n : ""}`;
    if (!q || typeof q !== "object") { err(`${at}: not an object`); return; }
    if (!Number.isInteger(q.n) || q.n < 1 || q.n > 80) err(`${at}: n must be 1..80`);
    else {
      if (seenN.has(q.n)) err(`${at}: duplicate question number`);
      seenN.add(q.n);
      if (q.n <= prevN) err(`${at}: questions must be sorted by n ascending`);
      prevN = q.n;
    }
    if (typeof q.q !== "string" || q.q.trim().length < 15) err(`${at}: stem too short`);
    if (!Array.isArray(q.opts) || q.opts.length !== 4) { err(`${at}: needs exactly 4 options`); return; }
    const norm = q.opts.map((o) => String(o || "").trim().toLowerCase());
    if (norm.some((o) => !o)) err(`${at}: empty option`);
    if (new Set(norm).size !== 4) err(`${at}: duplicate options`);
    if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans > 3) err(`${at}: ans must be 0..3`);
    if (typeof q.exp !== "string" || q.exp.trim().length < 25) err(`${at}: explanation too short`);
    if (!TAG_SET.has(normTag(q.tag))) err(`${at}: unknown tag "${q.tag}"`);
    if (q.diagram !== undefined && typeof q.diagram !== "string") err(`${at}: diagram must be a string`);
    const stemKey = String(q.q || "").trim().toLowerCase().replace(/\s+/g, " ");
    if (seenStems.has(stemKey)) err(`${at}: duplicate stem of n=${seenStems.get(stemKey)}`);
    else seenStems.set(stemKey, q.n);
  });

  totalQs += qs.length;
  console.log(`  ${key}: ${qs.length} questions`);
}

console.log("");
if (errors.length) {
  console.log(`Banks checked: ${files.length} | questions: ${totalQs} | errors: ${errors.length}`);
  errors.forEach((e) => console.log("  ✗ " + e));
  process.exit(1);
} else {
  console.log(`Banks checked: ${files.length} | questions: ${totalQs} | errors: 0`);
}
