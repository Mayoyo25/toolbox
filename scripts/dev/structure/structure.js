#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Folders to always skip — build artifacts, VCS, editor/tool junk
const DEFAULT_IGNORE = [
  "node_modules",
  ".git",
  ".next",
  ".husky",
  ".vercel",
  ".netlify",
  ".turbo",
  ".cache",
  ".vscode",
  ".idea",
  "dist",
  "build",
  "out",
  "coverage",
  ".nyc_output",
  ".parcel-cache",
  ".DS_Store",
  ".pnpm-store",
];

function parseArgs(argv) {
  let depth = 4;
  let outFile = "structure.txt";
  let extraIgnore = [];
  let targetDir = ".";

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--depth" || arg === "-d") {
      depth = parseInt(argv[++i], 10);
    } else if (arg.startsWith("--depth=")) {
      depth = parseInt(arg.split("=")[1], 10);
    } else if (arg === "--out" || arg === "-o") {
      outFile = argv[++i];
    } else if (arg === "--ignore" || arg === "-i") {
      extraIgnore = argv[++i].split(",").map((s) => s.trim());
    } else if (!arg.startsWith("-")) {
      targetDir = arg;
    }
  }

  return { depth, outFile, extraIgnore, targetDir };
}

function buildTree(dir, ignoreSet, maxDepth, prefix = "", currentDepth = 0, lines = []) {
  if (currentDepth > maxDepth) return lines;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return lines;
  }

  entries = entries
    .filter((e) => !ignoreSet.has(e.name))
    .sort((a, b) => {
      // folders first, then alphabetical
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  entries.forEach((entry) => {
    const line = `${prefix}${entry.name}`;
    lines.push(line);

    if (entry.isDirectory() && currentDepth < maxDepth) {
      buildTree(
        path.join(dir, entry.name),
        ignoreSet,
        maxDepth,
        `${prefix}|  `,
        currentDepth + 1,
        lines
      );
    }
  });

  return lines;
}

function main() {
  const { depth, outFile, extraIgnore, targetDir } = parseArgs(process.argv.slice(2));
  const ignoreSet = new Set([...DEFAULT_IGNORE, ...extraIgnore]);

  const lines = buildTree(path.resolve(targetDir), ignoreSet, depth);
  const output = lines.join("\n");

  fs.writeFileSync(path.join(process.cwd(), outFile), output);
  console.log(`Project structure saved to ${outFile} (depth: ${depth})`);
}

main();