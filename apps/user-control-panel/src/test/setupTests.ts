import '@testing-library/jest-dom';

/// <reference types="@testing-library/jest-dom" />

// Prisma client (via @trading-bot/api-validator) requires TextEncoder/TextDecoder
// globals at module load; jsdom does not provide them.
import { TextDecoder, TextEncoder } from 'node:util';

Object.assign(globalThis, { TextEncoder, TextDecoder });

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
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
