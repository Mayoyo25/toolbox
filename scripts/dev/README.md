# Dev Tools

Personal CLI utilities, linked globally so they're available from any project
on this machine.

## Tools

- **structure** — generate a project folder tree, ignoring build/dependency
  folders (see `structure/README.md`)
- **clean** — safely delete build/dependency folders with y/N confirmation
  (see `clean/README.md`)

---

## Adding a new tool

1. Create a new subfolder for it:
```bash
   mkdir new-tool
```

2. Write the script inside it, e.g. `new-tool/new-tool.js`. Make sure it
   starts with:
```js
   #!/usr/bin/env node
```

3. Register it in this folder's `package.json` under `bin`:
```json
   "bin": {
     "structure": "./structure/structure.js",
     "clean": "./clean/clean.js",
     "new-tool": "./new-tool/new-tool.js"
   }
```

4. Add a `new-tool/README.md` describing usage and flags (copy the format
   from `structure/README.md` or `clean/README.md`).

5. Re-link (see below) so the new command becomes available globally.

6. Update the tool list at the top of this file.

---

## Linking (first time or after adding/removing a tool)

Run this from inside `scripts/dev/` whenever `bin` entries change in
`package.json` — new tool added, tool renamed, or tool removed.

### npm

```bash
cd "C:\Users\hp 8470p\Monda\scripts\dev"
npm link
```

If you get an `EEXIST` error (a stale shim from a previous link):
```bash
npm link --force
```

### pnpm

```bash
cd "C:\Users\hp 8470p\Monda\scripts\dev"
pnpm link --global .
```

> Note the trailing `.` — some pnpm versions require it explicitly even when
> you're standing in the target folder.

You only need **one** of npm or pnpm linked, not both — pick whichever you
use day to day. Running both is harmless but redundant.

---

## Verifying a command is linked

```bash
where structure
where clean
where new-tool
```

(On Git Bash you can also use `which` instead of `where`.)

---

## Unlinking a tool / removing everything

### npm
```bash
npm unlink -g dev-tools
```

### pnpm
```bash
pnpm uninstall -g dev-tools
```

---

## Folder structure

```
scripts/dev/
├── package.json          <- one file, all tools' bin entries live here
├── README.md             <- this file
├── structure/
│   ├── structure.js
│   └── README.md
├── clean/
│   ├── clean.js
│   └── README.md
└── new-tool/              <- example: next tool you add
    ├── new-tool.js
    └── README.md
```