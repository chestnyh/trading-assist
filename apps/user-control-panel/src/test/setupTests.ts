import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'node:util';

/// <reference types="@testing-library/jest-dom" />

// Ensure each test starts with a clean DOM (RTL auto-cleanup requires this).
afterEach(() => {
  cleanup();
});

// Node globals required by @prisma/client (transitively imported via
// @trading-bot/api-validator / @trading-bot/api-client) in jsdom environment.
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder;
}

// Fake EventSource used by useRuleLogs (SSE logs streaming).
class FakeEventSource {
  static instances: FakeEventSource[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  url: string;
  readyState = 0;
  constructor(url: string) {
    this.url = url;
    FakeEventSource.instances.push(this);
  }
  close() {
    this.readyState = 2;
  }
}
if (typeof globalThis.EventSource === 'undefined') {
  globalThis.EventSource = FakeEventSource as unknown as typeof EventSource;
}

if (typeof window.scrollTo !== 'function') {
  window.scrollTo = jest.fn();
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

if (typeof globalThis.ResizeObserver === 'undefined') {
  class FakeResizeObserver {
    observe() {
      // no-op
    }
    unobserve() {
      // no-op
    }
    disconnect() {
      // no-op
    }
  }
  globalThis.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
}
