const fs = require('fs');
const path = require('path');

function findCjsFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findCjsFiles(fullPath, files);
    } else if (entry.name.endsWith('.cjs')) {
      files.push(fullPath);
    }
  }
  return files;
}

const nodeModulesPath = path.join(process.cwd(), 'node_modules/.pnpm');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('node_modules/.pnpm not found');
  process.exit(0);
}

const entries = fs.readdirSync(nodeModulesPath);
let patchedCount = 0;

// Mock zeptomatch as empty function
const zeptomatchMock = `(function() { return function() { return true; }; })()`;

for (const entry of entries) {
  if (entry.includes('@prisma+dev')) {
    const pkgPath = path.join(nodeModulesPath, entry, 'node_modules/@prisma/dev');
    const cjsFiles = findCjsFiles(pkgPath);
    for (const filePath of cjsFiles) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('require("zeptomatch")')) {
        content = content.replace(/require\("zeptomatch"\)/g, zeptomatchMock);
        fs.writeFileSync(filePath, content);
        console.log('Patched:', filePath);
        patchedCount++;
      }
    }
  }
}

// Copy generated files to dist if needed
const generatedSrc = path.join(process.cwd(), 'libs/models/src/generated/prisma');
const generatedDst = path.join(process.cwd(), 'dist/libs/models/src/generated/prisma');

if (fs.existsSync(generatedSrc) && !fs.existsSync(generatedDst)) {
  console.log('Copying generated files to dist...');
  fs.mkdirSync(generatedDst, { recursive: true });
  
  function copyDir(src, dst) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const dstPath = path.join(dst, entry.name);
      if (entry.isDirectory()) {
        fs.mkdirSync(dstPath, { recursive: true });
        copyDir(srcPath, dstPath);
      } else {
        fs.copyFileSync(srcPath, dstPath);
      }
    }
  }
  
  copyDir(generatedSrc, generatedDst);
  console.log('Generated files copied to dist.');
}

console.log(`Done! Patched ${patchedCount} files.`);
