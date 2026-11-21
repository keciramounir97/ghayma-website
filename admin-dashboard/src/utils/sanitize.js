/**
 * Input sanitization & validation utility for security hardening (OWASP ASVS / Injection prevention)
 */

export function sanitizeText(input, maxLength = 2000) {
  if (typeof input !== "string") return "";
  let clean = input.trim();
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  clean = clean.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "");
  clean = clean.replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "");
  clean = clean.replace(/javascript\s*:/gi, "");
  clean = clean.replace(/on\w+\s*=/gi, "");
  clean = clean.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (maxLength && clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  return clean;
}

export function validateEmail(email) {
  if (typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim());
}

export function validateAlgerianPhone(phone) {
  if (typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  const re = /^(?:\+213|00213|0)(5|6|7)[0-9]{8}$/;
  return re.test(cleaned);
}
