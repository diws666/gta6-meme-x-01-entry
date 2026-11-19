// Entry program for the gta6-meme-x-01 bounty.
// Reads POST.json (the X post address handed in) from the bot directory
// and copies it, byte-identical, to the output directory.
// Prints nothing on success; any failure prints an error and exits nonzero.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

function fail(message) {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

const sourcePath = join(botDir, "POST.json");
let raw;
try {
  raw = readFileSync(sourcePath, "utf8");
} catch {
  fail(`cannot read ${sourcePath}`);
}

let post;
try {
  post = JSON.parse(raw);
} catch {
  fail("POST.json is not valid JSON");
}

if (typeof post !== "object" || post === null || Array.isArray(post)) {
  fail("POST.json must be a JSON object");
}
if (typeof post.url !== "string") {
  fail("POST.json must have a string url");
}

const url = post.url.trim();
const match = /^https:\/\/(x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)$/.exec(
  url,
);
if (!match) {
  fail("url must be an X post address: https://x.com/<handle>/status/<id>");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "POST.json"), raw, "utf8");
