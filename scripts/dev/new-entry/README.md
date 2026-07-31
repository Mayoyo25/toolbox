# new-entry

Appends a new row to the right `INDEX.md` (or a `links/*.md` file) without
opening the file manually. Designed for fast migration of old
templates/components/configs/snippets into the toolbox.

## Usage

```bash
new-entry template
new-entry component
new-entry config
new-entry snippet
new-entry link
```

Each prompts you for the relevant fields (Name, description, Path, Tags,
etc.) and appends a formatted row/entry to the matching index file.

## Notes

- Must be run from somewhere inside the `toolbox/` folder tree — it walks
  upward looking for `templates/`, `configs/`, and `links/` folders to find
  the toolbox root.
- `Tags` should be entered comma-separated, e.g. `vite, tailwind, v4` — the
  script formats them as `` `#vite` `#tailwind` `#v4` `` automatically for
  `link` entries. For table-based entries (template/component/config/
  snippet), enter tags as plain text matching the column format already in
  that INDEX.md.
- `Path` should be relative to the entry's own folder (e.g. `vite/
  tailwind-v4.config.js`), matching whatever you actually copy the real
  file to.
- Script file: `new-entry.js`