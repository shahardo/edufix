/// <reference types="jest" />

import '@testing-library/jest-dom';

// Suppress React Router future flag warnings
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React Router Future Flag Warning') ||
     args[0].includes('⚠️ React Router'))
  ) {
    return; // Suppress React Router warnings
  }
  originalWarn.apply(console, args);
};

// Suppress specific act warnings and test-related errors that are expected in tests
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: An update to') &&
     args[0].includes('inside a test was not wrapped in act(...)')) ||
    args[0].includes('Login error:') ||
    args[0].includes('Network error')
  ) {
    return; // Suppress act warnings and test errors in tests
  }
  originalError.apply(console, args);
};

// Polyfill TextEncoder for jsdom if not available
if (typeof globalThis.TextEncoder === 'undefined') {
  // Simple TextEncoder polyfill for jsdom
  (globalThis as any).TextEncoder = class TextEncoder {
    encode(input: string): Uint8Array {
      const utf8 = unescape(encodeURIComponent(input));
      const result = new Uint8Array(utf8.length);
      for (let i = 0; i < utf8.length; i++) {
        result[i] = utf8.charCodeAt(i);
      }
      return result;
    }
  };

  (globalThis as any).TextDecoder = class TextDecoder {
    decode(input: Uint8Array): string {
      const utf8 = String.fromCharCode(...Array.from(input));
      return decodeURIComponent(escape(utf8));
    }
  };
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
(globalThis as any).localStorage = localStorageMock;

// Mock window.location
delete (window as any).location;
(window as any).location = {
  href: 'http://localhost:5173',
  pathname: '/',
  search: '',
  hash: '',
  origin: 'http://localhost:5173',
  protocol: 'http:',
  host: 'localhost:5173',
  hostname: 'localhost',
  port: '5173',
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
};

// Mock fetch
(globalThis as any).fetch = jest.fn();
