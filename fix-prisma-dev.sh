#!/bin/bash
# Fix @prisma/dev zeptomatch ESM issue for Prisma 7.x

echo "Fixing @prisma/dev zeptomatch requires..."

# Find all @prisma/dev .cjs files and fix zeptomatch require
find node_modules/.pnpm -path "*@prisma+dev*" -name "*.cjs" 2>/dev/null | while read f; do
  if grep -q 'require("zeptomatch")' "$f" 2>/dev/null; then
    sed -i 's/require("zeptomatch")/await import("zeptomatch")/g' "$f"
    echo "Patched: $f"
  fi
done

echo "Done!"
