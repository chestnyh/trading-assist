const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(process.cwd(), 'node_modules/.pnpm');
if (!fs.existsSync(nodeModulesPath)) return;

const entries = fs.readdirSync(nodeModulesPath);
for (const entry of entries) {
  if (entry.includes('@prisma+dev')) {
    const distPath = path.join(nodeModulesPath, entry, 'node_modules/@prisma/dev/dist');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath).filter(f => f.endsWith('.cjs'));
      for (const file of files) {
        const filePath = path.join(distPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('require("zeptomatch")')) {
          content = content.replace(/require\("zeptomatch"\)/g, 'await import("zeptomatch")');
          fs.writeFileSync(filePath, content);
          console.log('Patched:', filePath);
        }
      }
    }
  }
}
console.log('Done!');
