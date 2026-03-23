import { ServicesConfigs } from '@trading-bot/configs';

const cfg = new ServicesConfigs();
const apiHost = cfg.getRequired('API_HOST');
const apiPort = cfg.getRequired('API_PORT');

const timeoutSeconds = 60;
const intervalMs = 1000;

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function getApiBaseUrl(host: string, port: string): URL {
  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(host);
  const base = new URL(hasScheme ? host : `http://${host}`);
  if (!base.port) {
    base.port = port;
  }
  return base;
}

async function main() {
  const base = getApiBaseUrl(apiHost, apiPort);
  const url = new URL('/api/v1/users', base).toString();
  const startedAt = Date.now();

  // Consider API ready if we get any HTTP response code (including 404/401/etc.).
  // Only retry on network errors / connection refused.
  while (Date.now() - startedAt < timeoutSeconds * 1000) {
    try {
      const controller = new AbortController();
      const requestTimeout = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      clearTimeout(requestTimeout);

      // Any HTTP response means server is up.
      process.stdout.write(`API is up at ${url} (status ${res.status})\n`);
      process.exit(0);
    } catch {
      // ignore and retry
    }

    await sleep(intervalMs);
  }

  process.stderr.write(`API did not start in time at ${url}\n`);
  process.exit(1);
}

main();
