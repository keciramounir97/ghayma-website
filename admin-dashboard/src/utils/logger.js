/**
 * Security & Audit Logger for Admin Dashboard
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
      console.log(`[ADMIN-INFO] ${msg}`, meta ? redactSensitiveData(meta) : "");
    }
  },
  warn: (msg, meta) => {
    console.warn(`[ADMIN-WARN] ${msg}`, meta ? redactSensitiveData(meta) : "");
  },
  error: (msg, err) => {
    console.error(`[ADMIN-ERROR] ${msg}`, err ? redactSensitiveData(err) : "");
  },
  audit: (action, actor, details) => {
    const entry = {
      action,
      actor: actor || "admin",
      timestamp: new Date().toISOString(),
      details: redactSensitiveData(details)
    };
    if (import.meta.env.DEV) {
      console.log(`[ADMIN-SECURITY-AUDIT]`, entry);
    }
    return entry;
  }
};
