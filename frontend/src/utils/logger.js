/**
 * Security & Audit Logger
 * Redacts sensitive credentials, emails, and passwords before logging.
 */

function redactSensitiveData(data) {
  if (!data) return data;
  if (typeof data === "string") {
    return data
      .replace(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g, "$1***@$2.***")
      .replace(/password[:=]\s*["']?[^"'\s]+["']?/gi, "password=[REDACTED]")
      .replace(/token[:=]\s*["']?[^"'\s]+["']?/gi, "token=[REDACTED]");
  }
  if (typeof data === "object") {
    try {
      const copy = Array.isArray(data) ? [...data] : { ...data };
      for (const key of Object.keys(copy)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes("password") || lowerKey.includes("token") || lowerKey.includes("secret")) {
          copy[key] = "[REDACTED]";
        } else if (typeof copy[key] === "object") {
          copy[key] = redactSensitiveData(copy[key]);
        }
      }
      return copy;
    } catch (_) {
      return "[OBJECT]";
    }
  }
  return data;
}

export const logger = {
  info: (msg, meta) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${msg}`, meta ? redactSensitiveData(meta) : "");
    }
  },
  warn: (msg, meta) => {
    console.warn(`[WARN] ${msg}`, meta ? redactSensitiveData(meta) : "");
  },
  error: (msg, err) => {
    console.error(`[ERROR] ${msg}`, err ? redactSensitiveData(err) : "");
  },
  audit: (action, actor, details) => {
    const entry = {
      action,
      actor: actor || "anonymous",
      timestamp: new Date().toISOString(),
      details: redactSensitiveData(details)
    };
    if (import.meta.env.DEV) {
      console.log(`[SECURITY-AUDIT]`, entry);
    }
    return entry;
  }
};
