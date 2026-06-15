// Builds a flat dictionary (public/data/words.txt) from the union of every
// answer in allAnswers.json. The Blossom Solver uses it to solve ANY hive,
// not just this site's daily puzzles. Re-run with `npm run build:words`
// whenever allAnswers.json changes.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "public/data/allAnswers.json");
const out = resolve(root, "public/data/words.txt");

const puzzles = JSON.parse(readFileSync(src, "utf8"));
const words = new Set();
for (const puzzle of puzzles) {
  for (const word of puzzle.answers) {
    words.add(String(word).toLowerCase());
  }
}

const sorted = [...words].sort();
writeFileSync(out, sorted.join("\n") + "\n");
console.log(`Wrote ${sorted.length} words to ${out}`);
