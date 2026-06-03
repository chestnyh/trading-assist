import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import "./_set-configs";

// Fix @prisma/dev zeptomatch ESM issue for Prisma 7.x
function fixPrismaDev() {
  try {
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
            }
          }
        }
      }
    }
  } catch {
    // Ignore errors
  }
}

fixPrismaDev();

execSync(`DB_URL=${process.env.DB_URL} PRISMA_GENERATE_SKIP_AUTOINSTALL=true pnpm prisma generate --schema ./libs/models/prisma/schema.prisma`, {
  stdio: 'inherit',
});
