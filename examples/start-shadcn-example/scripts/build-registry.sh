#!/usr/bin/env bash
#
# Build the shadcn registry JSON and sync component + lib sources from this
# example into the other consumers (the docs app and the Next.js example).
#
# Stale files would otherwise accumulate after renames/deletes because `cp -r`
# never prunes — so each target's mirrored directories are removed up front
# and re-created from scratch.

set -euo pipefail

# Resolve repo-relative paths regardless of where the script is invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_COMPONENTS="$EXAMPLE_DIR/src/components"
SRC_LIB="$EXAMPLE_DIR/src/lib"

# Components subdirectories that are mirrored into every target.
COMPONENT_DIRS=(auth ui)
# Former top-level dirs now nested under components/auth/ — prune so sync does not leave stale copies.
STALE_COMPONENT_DIRS=(delete-user multi-session settings theme user username)
# Plugin lib sources under src/lib/auth/ (mirrored as a whole directory).
LIB_DIRS=(auth)

# Targets that consume the registry sources.
TARGETS=(
  "$EXAMPLE_DIR/../../apps/docs"
  "$EXAMPLE_DIR/../next-shadcn-example"
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
  target_components="$target/src/components"
  target_lib="$target/src/lib"

  echo "→ syncing $target"

  mkdir -p "$target_components" "$target_lib"

  # Prune stale mirrors so renames/deletes propagate.
  # Guard against empty variables to avoid catastrophic deletes (e.g. rm -rf /).
  for dir in "${COMPONENT_DIRS[@]}" "${STALE_COMPONENT_DIRS[@]}"; do
    : "${target_components:?target_components is empty}"
    : "${dir:?component dir entry is empty}"
    rm -rf -- "$target_components/$dir"
  done
  for dir in "${LIB_DIRS[@]}"; do
    : "${target_lib:?target_lib is empty}"
    : "${dir:?lib dir entry is empty}"
    rm -rf -- "$target_lib/$dir"
  done

  # Copy the fresh sources.
  for dir in "${COMPONENT_DIRS[@]}"; do
    cp -R "$SRC_COMPONENTS/$dir" "$target_components/"
  done
  for dir in "${LIB_DIRS[@]}"; do
    cp -R "$SRC_LIB/$dir" "$target_lib/"
  done
done

echo "✓ registry build complete"
