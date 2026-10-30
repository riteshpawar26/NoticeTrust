import '@testing-library/jest-dom';

// Polyfill window.crypto.subtle for node/vitest environment if needed
if (!globalThis.crypto?.subtle) {
  const nodeCrypto = await import('crypto');
  // @ts-ignore
  globalThis.crypto = nodeCrypto.webcrypto;
}
