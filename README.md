```markdown
# Toolbox

> My personal, evolving collection of CLI tools, templates, components, configs, snippets, extensions, and a tagged reference library — built so I never lose a solution twice.

Personal reference hub: CLI tools I built, working configs that took real
pain to get right, reusable components/snippets, full browser and VS Code
extensions, and links/tools I've found useful across projects. The goal:
never lose a tool to memory again.

---

## Structure

```
toolbox/
├── scripts/
│   └── dev/                  <- my own CLI tools (structure, clean, new-entry)
│       ├── package.json
│       ├── README.md
│       ├── structure/
│       ├── clean/
│       └── new-entry/
├── templates/                 <- full boilerplate starters
│   └── INDEX.md
├── components/                 <- copy-paste single components, framework-tagged
│   ├── react/
│   ├── vanilla-js/
│   └── INDEX.md
├── configs/                    <- the "pain in the ass but working" configs
│   └── INDEX.md
├── snippets/                   <- small reusable code: JS/TS utils, DevTools scripts, bookmarklets
│   ├── js/
│   ├── ts/
│   ├── chrome-devtools/
│   │   └── sources/
│   ├── bookmarklets/
│   └── INDEX.md
├── extensions/                 <- full browser extensions (own projects, not snippets)
│   ├── chrome/
│   └── INDEX.md
├── vscode-extensions/           <- full VS Code extensions/plugins (own projects)
│   └── INDEX.md
├── links/                       <- curated external tools & docs, tagged
│   ├── social-sharing.md
│   ├── images-icons.md
│   ├── seo-meta.md
│   ├── dev-utilities.md
│   └── deployment.md
└── README.md                    <- this file
```

---

## Categories

| Folder | Contains | Index |
|--------|----------|-------|
| `templates/` | Full project starters (clone/copy whole setups) | `templates/INDEX.md` |
| `components/` | Single copy-paste components | `components/INDEX.md` |
| `configs/` | Working configs for painful setups (eslint, vite, netlify, etc) | `configs/INDEX.md` |
| `snippets/` | Small reusable code — JS/TS utils, DevTools console scripts, bookmarklets | `snippets/INDEX.md` |
| `extensions/` | Full browser extensions | `extensions/INDEX.md` |
| `vscode-extensions/` | Full VS Code extensions/plugins | `vscode-extensions/INDEX.md` |
| `links/` | External tools & docs, tagged by category | separate `.md` per category |

**Note:** extensions and VS Code plugins are full standalone projects (manifests,
multiple files, build steps) — not snippets — which is why they get their own
top-level folders instead of living under `snippets/`. Bookmarklets stay under
`snippets/` since they genuinely are single small JS blobs.

---

## Habit

Any time something solves a problem — a config, a component, a template, a
snippet, an extension, or an external tool/link — add it **the same day** you
get it working, using:

```bash
new-entry template
new-entry component
new-entry config
new-entry snippet
new-entry extension
new-entry vscode-extension
new-entry link
```

Don't try to migrate the whole backlog at once. Instead: every time you
*reach for* an old file from a past project going forward, that's the trigger
to move it into `toolbox/` right then, since you already know it works and
you're already touching it. Do a dedicated migration session only for
known-valuable stuff you rarely touch.

Search fast later with:
```bash
grep -ri "#tag" links/ templates/ components/ configs/ snippets/ extensions/ vscode-extensions/
```

---

## CLI Tools (`scripts/dev/`)

Linked globally via `npm link` (or `pnpm link --global .`) so they're
available from any project on this machine.

- **structure** — generate a project folder tree, ignoring build/dependency
  folders. See `scripts/dev/structure/README.md`.
- **clean** — safely delete build/dependency folders with y/N confirmation.
  See `scripts/dev/clean/README.md`.
- **new-entry** — append a new template/component/config/snippet/extension/
  vscode-extension/link entry to the right index file via prompts. See
  `scripts/dev/new-entry/README.md`.

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
where new-entry

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
- Keep index rows and `links/*.md` entries short: one line of description,
  a tag or two, and the exact path — the goal is fast scanning five years
  from now, not documentation.
- Migrate gradually. A half-filled toolbox you actually use beats a
  perfectly organized one you never finished setting up.
```