const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
global.window = { BANKS: {} };
vm.runInThisContext(fs.readFileSync(path.join(root, "data/topics.js"), "utf8"));
const catalog = window.CATALOG;
let errors = 0;
let total = 0;
const ids = new Set();

function err(file, msg) {
  console.log("ERROR " + file + ": " + msg);
  errors++;
}

for (const topic of catalog.topics) {
  const file = path.join(root, topic.file);
  if (!fs.existsSync(file)) {
    console.log("MISSING " + topic.file);
    continue;
  }
  try {
    vm.runInThisContext(fs.readFileSync(file, "utf8"));
  } catch (e) {
    err(topic.file, "syntax: " + e.message);
    continue;
  }
  const bank = window.BANKS[topic.id];
  if (!Array.isArray(bank)) {
    err(topic.file, "bank for '" + topic.id + "' not registered");
    continue;
  }
  if (bank.length !== 50) err(topic.file, "has " + bank.length + " questions, expected 50");
  const stems = new Set();
  bank.forEach((q, i) => {
    const where = topic.file + " [" + i + "]";
    if (!q.id) err(where, "missing id");
    else if (ids.has(q.id)) err(where, "duplicate id " + q.id);
    else ids.add(q.id);
    if (!q.q || q.q.length < 15) err(where, "missing/short stem");
    if (!Array.isArray(q.opts) || q.opts.length !== 4) err(where, "options != 4");
    if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans > 3) err(where, "bad ans " + q.ans);
    if (!q.exp || q.exp.length < 25) err(where, "explanation too short");
    if (!q.diff || !["easy", "medium", "hard"].includes(q.diff)) err(where, "bad diff");
    if (q.opts && new Set(q.opts).size !== q.opts.length) err(where, "duplicate options");
    const stemKey = q.q.replace(/\s+/g, " ").toLowerCase();
    if (stems.has(stemKey)) err(where, "duplicate stem");
    stems.add(stemKey);
  });
  total += bank.length;
}
console.log("Banks checked: " + Object.keys(window.BANKS).length + " | questions: " + total + " | errors: " + errors);
process.exit(errors ? 1 : 0);
