import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CONFIG_PATH = './.markdown-link-check.json';
const PROJECT_BASE_URL = `file://${process.cwd()}`;
const REPO_ROOT = process.cwd();

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function getAllTrackedMarkdownFiles(): string[] {
  const { status, stdout, stderr } = run('git', ['ls-files']);

  if (status !== 0) {
    process.stderr.write(stderr);
    throw new Error('Failed to list git tracked files');
  }

  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => file.toLowerCase().endsWith('.md'));
}

function getStagedMarkdownFiles(): string[] {
  const { status, stdout, stderr } = run('git', [
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACM',
  ]);

  if (status !== 0) {
    process.stderr.write(stderr);
    throw new Error('Failed to read staged files');
  }

  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => file.toLowerCase().endsWith('.md'));
}

function checkFile(filePath: string): number {
  const { status, stdout, stderr } = run('pnpm', [
    'exec',
    'markdown-link-check',
    '--quiet',
    '--config',
    CONFIG_PATH,
    '--projectBaseUrl',
    PROJECT_BASE_URL,
    filePath,
  ]);

  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);

  return status;
}

function normalizeRelativeLink(rawLink: string): string {
  const link = rawLink.trim();
  const withoutHash = link.split('#')[0];
  const withoutQuery = withoutHash.split('?')[0];
  return withoutQuery;
}

function isRelativeLink(rawLink: string): boolean {
  const link = rawLink.trim();
  if (!link) return false;
  if (link.startsWith('#')) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(link)) return false;
  return true;
}

function extractMarkdownLinks(markdown: string): string[] {
  const results: string[] = [];
  const regex = /\[[^\]]*\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    results.push(match[1]);
  }
  return results;
}

function checkRelativeLinksExist(mdFilePath: string): boolean {
  const content = fs.readFileSync(mdFilePath, 'utf8');
  const links = extractMarkdownLinks(content)
    .map(normalizeRelativeLink)
    .filter(isRelativeLink)
    .filter(Boolean);

  const mdDir = path.dirname(mdFilePath);
  let ok = true;

  for (const link of links) {
    const targetPath = link.startsWith('/')
      ? path.join(REPO_ROOT, link.replace(/^\//, ''))
      : path.resolve(mdDir, link);

    if (!fs.existsSync(targetPath)) {
      ok = false;
      process.stderr.write(`Relative link target not found: ${mdFilePath} -> ${link}\n`);
    }
  }

  return ok;
}

function main() {
  const checkAll = process.argv.includes('--all');
  const files = checkAll ? getAllTrackedMarkdownFiles() : getStagedMarkdownFiles();

  if (files.length === 0) {
    process.exit(0);
  }

  let hasErrors = false;

  for (const file of files) {
    if (!checkRelativeLinksExist(file)) {
      hasErrors = true;
    }
    const status = checkFile(file);
    if (status !== 0) {
      hasErrors = true;
    }
  }

  process.exit(hasErrors ? 1 : 0);
}

main();
