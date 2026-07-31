# structure

Generates a text-based tree view of a project's folder structure, ignoring
common build/dependency folders (node_modules, .git, .next, dist, etc).

Useful for quickly sharing a project's layout (e.g. pasting into a chat with
an AI assistant) without noise from generated files.

## Usage

```bash
structure                     # scan current folder, depth 4 (default)
structure --depth 2           # limit how many folders deep it goes
structure -d 6 -o tree.txt    # custom depth + output filename
structure -i "public,tests"   # ignore extra folder names (comma-separated)
structure ../other-project    # scan a different folder instead of current one
```

## Flags

| Flag              | Description                                | Default          |
|-------------------|---------------------------------------------|------------------|
| `--depth`, `-d`   | How many folder levels deep to scan          | `4`              |
| `--out`, `-o`     | Output filename                              | `structure.txt`  |
| `--ignore`, `-i`  | Extra folder names to skip (comma-separated) | none             |

## Output

Writes a `structure.txt` (or custom filename) into the **current working
directory** — not into this tool's folder. Overwrites the file each run.

## Default ignored folders

node_modules, .git, .next, .husky, .vercel, .netlify, .turbo, .cache,
.vscode, .idea, dist, build, out, coverage, .nyc_output, .parcel-cache,
.pnpm-store

## Notes

- Depth counts folder levels, not files — a file at the max depth still shows,
  but folders past that depth are not expanded.
- Script file: `structure.js`
- Linked globally via `npm link` from `scripts/dev/`