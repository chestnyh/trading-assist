const fs = require('fs');
const path = require('path');

const statePath = path.join(__dirname, 'node_modules/.pnpm/@prisma+dev@0.24.3_typescript@5.7.3/node_modules/@prisma/dev/dist/state.cjs');

if (fs.existsSync(statePath)) {
  let content = fs.readFileSync(statePath, 'utf8');
  // Replace zeptomatch require with dynamic import
  content = content.replace('require("zeptomatch")', 'await import("zeptomatch")');
  fs.writeFileSync(statePath, content);
  console.log('Patched @prisma/dev');
} else {
  console.log('state.cjs not found');
}
