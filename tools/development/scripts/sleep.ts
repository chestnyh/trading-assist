const args = process.argv.slice(2).filter((arg) => arg !== '--');
const seconds = Number(args[0]);

if (!args[0] || !Number.isFinite(seconds) || seconds < 0) {
  process.stderr.write('error: invalid duration. Usage: sleep <seconds>\n');
  process.exit(1);
}

setTimeout(() => {
  process.exit(0);
}, seconds * 1000);
