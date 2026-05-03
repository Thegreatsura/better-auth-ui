#!/usr/bin/env bash
#
# Build the shadcn registry JSON and sync component + lib sources from this
# example into the other consumers (the docs app and the Next.js example).
#
# `cp -r` never prunes, so each mirrored subtree is removed up front and
# re-created from scratch to keep renames/deletes propagating cleanly.

set -euo pipefail

# Resolve repo-relative paths regardless of where the script is invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC="$EXAMPLE_DIR/src"

# Subtrees mirrored into every target, relative to `src/`. Everything
# plugin-related lives under `auth/`; shadcn UI primitives live under `ui/`.
MIRRORS=(
  components/auth
  components/ui
  lib/auth
)

TARGETS=(
  "$EXAMPLE_DIR/../../apps/docs/src"
  "$EXAMPLE_DIR/../next-shadcn-example/src"
)

REGISTRY_OUTPUT="$EXAMPLE_DIR/../../apps/docs/public/r"

# `shadcn build` writes one JSON per registry item but never deletes stale
# entries from previous runs. Wipe the output directory first so renames
# and removals propagate cleanly.
echo "→ pruning $REGISTRY_OUTPUT"
: "${REGISTRY_OUTPUT:?REGISTRY_OUTPUT is empty}"
rm -rf -- "$REGISTRY_OUTPUT"
mkdir -p "$REGISTRY_OUTPUT"

echo "→ shadcn build → $REGISTRY_OUTPUT"
(cd "$EXAMPLE_DIR" && bunx shadcn build --output "$REGISTRY_OUTPUT")

for target in "${TARGETS[@]}"; do
  echo "→ syncing $target"
  for path in "${MIRRORS[@]}"; do
    # Guard against empty variables so a misconfigured loop never does `rm -rf /`.
    : "${target:?target is empty}"
    : "${path:?mirror path entry is empty}"
    rm -rf -- "$target/$path"
    mkdir -p -- "$(dirname "$target/$path")"
    cp -R -- "$SRC/$path" "$target/$path"
  done
done

echo "✓ registry build complete"
