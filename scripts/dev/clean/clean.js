#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const TARGETS = [
  "node_modules",
  "dist",
  "build",
  "out",
  ".cache",
  ".next",
  ".turbo",
  ".parcel-cache",
  "coverage",
];

function parseArgs(argv) {
  const recursive = argv.includes("--recursive") || argv.includes("-r");
  const dryRun = argv.includes("--dry-run") || argv.includes("-n");
  const skipConfirm = argv.includes("--yes") || argv.includes("-y");
  const targetDir = argv.find((a) => !a.startsWith("-")) || ".";
  return { recursive, dryRun, skipConfirm, targetDir };
}

function findTargets(dir, recursive, found = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }

  entries.forEach((entry) => {
    if (!entry.isDirectory()) return;
    const fullPath = path.join(dir, entry.name);

    if (TARGETS.includes(entry.name)) {
      found.push(fullPath);
      return; // don't recurse into something we're about to delete
    }

    if (recursive) {
      findTargets(fullPath, recursive, found);
    }
  });

  return found;
}

function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  const { recursive, dryRun, skipConfirm, targetDir } = parseArgs(process.argv.slice(2));
  const root = path.resolve(targetDir);

  const targets = findTargets(root, recursive);

  if (targets.length === 0) {
    console.log("Nothing to clean.");
    return;
  }

  console.log(`Found ${targets.length} folder(s) to delete in ${root}${recursive ? " (recursive)" : ""}:\n`);
  targets.forEach((t) => console.log(`  - ${t}`));

  if (dryRun) {
    console.log("\n[dry run] Nothing was deleted.");
    return;
  }

  if (!skipConfirm) {
    const answer = await askConfirmation(`\nDelete these ${targets.length} folder(s)? (y/N): `);
    if (answer !== "y" && answer !== "yes") {
      console.log("Aborted. Nothing was deleted.");
      return;
    }
  }

  targets.forEach((t) => {
    fs.rmSync(t, { recursive: true, force: true });
    console.log(`Deleted: ${t}`);
  });

  console.log("\nDone.");
}

main();