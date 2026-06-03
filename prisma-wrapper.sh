#!/bin/bash
# Prisma wrapper that fixes @prisma/dev zeptomatch issue before running

# Fix @prisma/dev files
find node_modules/.pnpm -path "*@prisma+dev*" -name "*.cjs" 2>/dev/null | while read f; do
  if grep -q 'require("zeptomatch")' "$f" 2>/dev/null; then
    sed -i 's/require("zeptomatch")/await import("zeptomatch")/g' "$f" 2>/dev/null
  fi
done

# Run actual prisma command
exec node node_modules/.pnpm/prisma@*/node_modules/prisma/build/index.js "$@"
