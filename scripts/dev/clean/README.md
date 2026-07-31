# clean

Deletes common build/dependency folders (node_modules, dist, .next, .cache,
etc) from a project so you can start fresh — e.g. before a clean
`npm install`, or when disk space is tight.

⚠️ This permanently deletes folders. By default it always shows you what it
found and asks for confirmation first — use `--dry-run` if you just want to
preview with zero risk.

## Usage

```bash
clean                    # shows what it'll delete, asks y/N before deleting
clean --dry-run          # preview only, no prompt, nothing deleted
clean --recursive        # also clean nested projects (e.g. monorepos)
clean --yes              # skip the y/N prompt (use with caution)
clean ../other-project   # target a specific folder instead of current one
clean -r -y              # combine flags, e.g. recursive + skip prompt
```

## Flags

| Flag                | Description                                        | Default |
|----------------------|-----------------------------------------------------|---------|
| `--dry-run`, `-n`   | List what would be deleted without deleting it       | off     |
| `--recursive`, `-r` | Recurse into subfolders, cleaning nested projects     | off     |
| `--yes`, `-y`       | Skip the y/N confirmation prompt                      | off     |

## Targets deleted

node_modules, dist, build, out, .cache, .next, .turbo, .parcel-cache, coverage

## Safety

By default, `clean` always lists every folder it found and asks: