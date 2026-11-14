const fs = require("fs");
const path = require("path");

const target = process.argv[2];
if (!target) {
  console.error("usage: node tools/shuffle-options.js <bank-file>");
  process.exit(1);
}
const file = path.join(__dirname, "..", target);
let src = fs.readFileSync(file, "utf8");
let changed = 0;

const lines = src.split(/\r?\n/);
const out = lines.map((line) => {
  const idm = line.match(/id: "([a-z]+)-(\d+)"/);
  if (!idm) return line;
  const n = parseInt(idm[2], 10);
  const om = line.match(/opts: \[(.*?)\], ans: (\d)/);
  if (!om) return line;
  const opts = [...om[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]);
  if (opts.length !== 4) return line;
  const oldAns = parseInt(om[2], 10);
  const k = n % 4;
  const rotated = opts.slice(k).concat(opts.slice(0, k));
  const newAns = ((oldAns - k) % 4 + 4) % 4;
  const replacement = "opts: [" + rotated.map((o) => '"' + o + '"').join(", ") + "], ans: " + newAns;
  changed++;
  return line.replace(/opts: \[.*?\], ans: \d/, replacement);
});

fs.writeFileSync(file, out.join("\n"), "utf8");
console.log("rotated " + changed + " questions in " + target);
