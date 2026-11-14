#!/usr/bin/env node
/* Merges split transcription parts (.tmp/parts/<year>-<part>.json) into
   data/papers/csat-<year>.js. Usage: node tools/merge-paper-parts.js 2021 */
"use strict";

const fs = require("fs");
const path = require("path");

const year = process.argv[2];
if (!year) {
  console.error("Usage: node tools/merge-paper-parts.js <year>");
  process.exit(1);
}

const root = path.join(__dirname, "..");
const partsDir = path.join(root, ".tmp", "parts");
if (!fs.existsSync(partsDir)) {
  console.error("No .tmp/parts directory.");
  process.exit(1);
}

const files = fs
  .readdirSync(partsDir)
  .filter((f) => new RegExp("^" + year + "-[a-z0-9]+\\.json$").test(f))
  .sort();

if (!files.length) {
  console.error("No part files for " + year + " in .tmp/parts.");
  process.exit(1);
}

let questions = [];
for (const file of files) {
  let raw = fs.readFileSync(path.join(partsDir, file), "utf8").trim();
  raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  let arr;
  try {
    arr = JSON.parse(raw);
  } catch (e) {
    console.error(`${file}: invalid JSON — ${e.message}`);
    process.exit(1);
  }
  if (!Array.isArray(arr)) {
    console.error(`${file}: content is not a JSON array`);
    process.exit(1);
  }
  console.log(`  ${file}: ${arr.length} questions`);
  questions = questions.concat(arr);
}

const seen = new Set();
questions = questions
  .filter((q) => {
    if (seen.has(q.n)) {
      console.log(`  duplicate n=${q.n} dropped (kept first)`);
      return false;
    }
    seen.add(q.n);
    return true;
  })
  .sort((a, b) => a.n - b.n);

const lines = questions.map((q) => "    " + JSON.stringify(q)).join(",\n");
const out =
  'window.PAPER_TESTS = window.PAPER_TESTS || {};\n' +
  'window.PAPER_TESTS["csat-' + year + '"] = {\n' +
  '  id: "csat-' + year + '",\n' +
  "  year: " + year + ",\n" +
  "  totalInPaper: 80,\n" +
  '  note: "Quant + Logical Reasoning only; reading-comprehension items omitted.",\n' +
  "  questions: [\n" + lines + "\n  ]\n" +
  "};\n";

const outPath = path.join(root, "data", "papers", `csat-${year}.js`);
fs.writeFileSync(outPath, out, "utf8");
console.log(`Wrote data/papers/csat-${year}.js with ${questions.length} questions.`);
