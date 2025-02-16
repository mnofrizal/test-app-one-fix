const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  debug: (...args) => {
    if (isDevelopment) {
      console.log("[DEBUG]", ...args);
    }
  },
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isDevelopment) {
      console.error("[ERROR]", ...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn("[WARN]", ...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info("[INFO]", ...args);
    }
  },
};
