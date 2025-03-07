// Simple storage implementation that works in both browser and server environments
const customStorage = {
  getItem(key: string) {
    if (globalThis.window === undefined) {
      return Promise.resolve();
    }

    try {
      const item = globalThis.localStorage.getItem(key);
      return Promise.resolve(item);
    } catch {
      return Promise.resolve();
    }
  },

  setItem(key: string, value: string) {
    if (globalThis.window === undefined) {
      return Promise.resolve();
    }

    try {
      globalThis.localStorage.setItem(key, value);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },

  removeItem(key: string) {
    if (globalThis.window === undefined) {
      return Promise.resolve();
    }

    try {
      globalThis.localStorage.removeItem(key);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
};

export default customStorage;
