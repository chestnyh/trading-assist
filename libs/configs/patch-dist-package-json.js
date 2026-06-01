const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'dist/package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

pkg.main = './src/index.js';

fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
