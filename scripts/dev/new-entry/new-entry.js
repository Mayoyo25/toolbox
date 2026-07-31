#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const CATEGORIES = {
  template: {
    dir: "templates",
    index: "templates/INDEX.md",
    fields: [
      { key: "Name", hint: "short slug, e.g. react-vite-tailwind" },
      { key: "What it is", hint: "one line, e.g. Vite + React 19 + Tailwind v4 starter" },
      { key: "Path", hint: "folder name inside templates/, e.g. react-vite-tailwind/" },
      { key: "Tags", hint: "comma separated, e.g. react, vite, tailwind" },
    ],
  },
  component: {
    dir: "components",
    index: "components/INDEX.md",
    fields: [
      { key: "Name", hint: "short slug, e.g. accessible-modal" },
      { key: "What it does", hint: "one line, e.g. Modal with focus trap + escape-to-close" },
      { key: "Path", hint: "e.g. react/modals/AccessibleModal.jsx" },
      { key: "Framework", hint: "e.g. React, Vue, vanilla-js" },
      { key: "Tags", hint: "comma separated, e.g. modal, a11y" },
    ],
  },
  config: {
    dir: "configs",
    index: "configs/INDEX.md",
    fields: [
      { key: "Name", hint: "short slug, e.g. vite-tailwind4-setup" },
      { key: "What it solves", hint: "the actual pain point, e.g. Tailwind v4 breaking changes with Vite plugin" },
      { key: "Path", hint: "e.g. vite/tailwind-v4.config.js" },
      { key: "Tags", hint: "comma separated, e.g. vite, tailwind, v4" },
    ],
  },
  snippet: {
    dir: "snippets",
    index: "snippets/INDEX.md",
    fields: [
      { key: "Name", hint: "short slug, e.g. trustpilot, debounce, etsy_scrape" },
      { key: "What it does", hint: "one line, e.g. Scrapes review data from page DOM" },
      { key: "Path", hint: "path from snippets/, e.g. chrome-devtools/sources/trustpilot.js" },
      { key: "Environment", hint: "e.g. JS, TS, Chrome DevTools, Bookmarklet" },
      { key: "Tags", hint: "comma separated, e.g. scraping, trustpilot" },
    ],
  },
  extension: {
    dir: "extensions",
    index: "extensions/INDEX.md",
    fields: [
      { key: "Name", hint: "short slug, e.g. review-highlighter" },
      { key: "What it does", hint: "one line, e.g. Highlights suspicious reviews on product pages" },
      { key: "Path", hint: "e.g. chrome/review-highlighter/" },
      { key: "Browser", hint: "e.g. Chrome, Firefox" },
      { key: "Tags", hint: "comma separated, e.g. scraping, trustpilot" },
    ],
  },
  "vscode-extension": {
    dir: "vscode-extensions",
    index: "vscode-extensions/INDEX.md",
    fields: [
      { key: "Name", hint: "short slug, e.g. quick-snippet-inserter" },
      { key: "What it does", hint: "one line, e.g. Custom command for inserting my snippet library" },
      { key: "Path", hint: "e.g. quick-snippet-inserter/" },
      { key: "Tags", hint: "comma separated, e.g. productivity, vscode-api" },
    ],
  },
};

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, (a) => resolve(a.trim())));
}

function findToolboxRoot(startDir) {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    if (
      fs.existsSync(path.join(dir, "templates")) &&
      fs.existsSync(path.join(dir, "configs")) &&
      fs.existsSync(path.join(dir, "links"))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return null;
}

function appendWithNewlineGuard(filePath, content) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const needsNewline = current.length > 0 && !current.endsWith("\n");
  fs.appendFileSync(filePath, `${needsNewline ? "\n" : ""}${content}`);
}

async function requireField(rl, question, hint, validator) {
  if (hint) console.log(`  hint: ${hint}`);
  while (true) {
    const value = await ask(rl, question);
    if (!value) {
      console.log("  (required, try again)");
      continue;
    }
    if (validator && !validator(value)) {
      continue;
    }
    return value;
  }
}

async function promptFields(rl, fields) {
  const answers = {};
  for (const f of fields) {
    answers[f.key] = await requireField(rl, `${f.key}: `, f.hint);
  }
  return answers;
}

async function handleLink(rl, root) {
  const linksDir = path.join(root, "links");
  const existing = fs
    .readdirSync(linksDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  if (existing.length > 0) {
    console.log("\nExisting categories:");
    existing.forEach((name) => console.log(`  - ${name}`));
  }
  console.log(
    existing.length > 0
      ? "\nType an existing name to use it, or just press Enter to create a new category."
      : "\nNo categories yet — type a name to create the first one."
  );

  const input = await ask(rl, "\nCategory: ");

  let fileName;
  if (!input) {
    fileName = await requireField(rl, "New category name (e.g. deployment, design-tools): ");
  } else if (existing.includes(input)) {
    fileName = input;
  } else {
    const confirm = await ask(rl, `"${input}" doesn't exist yet — create it? (y/N): `);
    if (!/^y(es)?$/i.test(confirm)) {
      console.log("Aborted.");
      return;
    }
    fileName = input;
  }

  const filePath = path.join(linksDir, `${fileName}.md`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `# ${fileName}\n`);
    console.log(`Created new file: ${filePath}`);
  }

  const name = await requireField(rl, "Name: ", "short recognizable name, e.g. Facebook Sharing Debugger");
  const note = await requireField(rl, "Note: ", "one line — what it's for / when you'd reach for it");
  const url = await requireField(
    rl,
    "URL: ",
    "full URL including https://",
    (value) => {
      if (/^https?:\/\/.+\..+/.test(value)) return true;
      console.log(
        "  Doesn't look like a valid URL — must start with http:// or https:// and include a domain, e.g. https://example.com"
      );
      return false;
    }
  );

  console.log("  hint: comma separated, no # needed — e.g. og-tags, whatsapp, cache-refresh");
  const tags = await ask(rl, "Tags (optional): ");

  const tagStr = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `\`#${t.replace(/^#/, "")}\``)
    .join(" ");

  const entry = `\n- **${name}**${tagStr ? " " + tagStr : ""}\n  ${note}\n  ${url}\n`;
  appendWithNewlineGuard(filePath, entry);
  console.log(`\nAdded to ${filePath}`);
  console.log(entry.trim());
}

async function handleTable(rl, root, category) {
  const cfg = CATEGORIES[category];
  const answers = await promptFields(rl, cfg.fields);

  const indexPath = path.join(root, cfg.index);
  if (!fs.existsSync(indexPath)) {
    console.error(`Index file not found: ${indexPath}`);
    return;
  }

  const row = `| ${cfg.fields.map((f) => answers[f.key]).join(" | ")} |\n`;
  appendWithNewlineGuard(indexPath, row);
  console.log(`\nAdded row to ${indexPath}`);
  console.log(row.trim());
}

async function main() {
  const category = process.argv[2];
  const validCategories = [...Object.keys(CATEGORIES), "link"];

  if (!category || !validCategories.includes(category)) {
    console.log(`Usage: new-entry <${validCategories.join("|")}>`);
    process.exit(1);
  }

  const root = findToolboxRoot(process.cwd());
  if (!root) {
    console.error(
      "Could not find toolbox root (looking for templates/, configs/, and links/ folders above current directory)."
    );
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log(`\nAdding a new ${category} entry to the toolbox\n`);

  try {
    if (category === "link") {
      await handleLink(rl, root);
    } else {
      await handleTable(rl, root, category);
    }
  } finally {
    rl.close();
  }
}

main();