function parseDurationSeconds(arg: string | undefined): number {
  if (!arg) return 0;
  const value = Number(arg);
  if (!Number.isFinite(value) || value < 0) return NaN;
  return value;
}

async function main() {
  const seconds = parseDurationSeconds(process.argv[2]);

  if (!Number.isFinite(seconds)) {
    process.stderr.write('error: invalid duration. Usage: sleep <seconds>\n');
    process.exit(1);
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

main().catch((error) => {
  process.stderr.write(`error: ${String(error)}\n`);
  process.exit(1);
});
