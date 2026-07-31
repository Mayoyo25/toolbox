```markdown
# Toolbox

> My personal, evolving collection of CLI tools and a tagged reference library — built so I never lose track of a solution twice.

Personal reference hub: CLI tools I built, and links/tools I've found useful
across projects. The goal: never lose a tool to memory again.

---

## Structure

```
toolbox/
├── scripts/
│   └── dev/                 <- my own CLI tools (structure, clean, etc)
│       ├── package.json
│       ├── README.md
│       ├── structure/
│       │   ├── structure.js
│       │   └── README.md
│       └── clean/
│           ├── clean.js
│           └── README.md
├── links/                   <- curated external tools & docs, tagged
│   ├── social-sharing.md
│   ├── images-icons.md
│   ├── seo-meta.md
│   └── dev-utilities.md
├── snippets/                <- (future) reusable code snippets/configs
└── README.md                <- this file
```

---

## Categories so far

- `social-sharing.md` — OG tags, cache refreshing, share previews
- `images-icons.md` — image compression, favicon generation
- `seo-meta.md` — structured data, meta tag references
- `dev-utilities.md` — npm/pnpm/CLI reference docs

---

## Habit

Any time a tool solves a problem — add it to the right `links/*.md` file
**same day**, one line, with a `#tag`. Future-you searches with:

```bash
grep -ri "#og-tags" links/
```

or just Ctrl+F inside the relevant category file.

---

## CLI Tools (`scripts/dev/`)

Linked globally via `npm link` (or `pnpm link --global .`) so they're
available from any project on this machine.

- **structure** — generate a project folder tree, ignoring build/dependency
  folders. See `scripts/dev/structure/README.md`.
- **clean** — safely delete build/dependency folders with y/N confirmation.
  See `scripts/dev/clean/README.md`.

### Adding a new CLI tool

1. `mkdir scripts/dev/new-tool`
2. Write `new-tool.js` inside it, starting with `#!/usr/bin/env node`
3. Register it in `scripts/dev/package.json` under `bin`
4. Add `scripts/dev/new-tool/README.md`
5. Re-link:
   ```bash
   cd scripts/dev
   npm link --force
   ```
   or
   ```bash
   pnpm link --global .
   ```
6. Update the tool list above

### Linking / unlinking reference

```bash
# link (first time or after adding/removing a bin entry)
cd scripts/dev
npm link --force
# or
pnpm link --global .

# verify
where structure
where clean

# unlink everything
npm unlink -g dev-tools
# or
pnpm uninstall -g dev-tools
```

---

## Git

This repo is private and backed up on GitHub. Standard flow:

```bash
git add .
git commit -m "message"
git push
```

`.gitignore` excludes `node_modules/`, generated `structure.txt` output,
logs, and OS junk files (`.DS_Store`, `Thumbs.db`).

---

## Notes

- Only one of npm/pnpm link is needed at a time — pick whichever you use
  day to day. Running both is harmless but redundant.
- Keep `links/*.md` entries short: one line, a `#tag` or two, and why it
  matters — the goal is fast scanning five years from now, not documentation.
```