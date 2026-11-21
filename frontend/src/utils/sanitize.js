/**
 * Input sanitization & validation utility for security hardening (OWASP ASVS / Injection prevention)
 */

export function sanitizeText(input, maxLength = 2000) {
  if (typeof input !== "string") return "";
  let clean = input.trim();
  // Strip control characters
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // Strip script and style tags completely
  clean = clean.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "");
  clean = clean.replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "");
  // Strip dangerous html attributes and javascript: urls
  clean = clean.replace(/javascript\s*:/gi, "");
  clean = clean.replace(/on\w+\s*=/gi, "");
  // Encode dangerous angle brackets to prevent XSS
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
  // Algerian phone format: 05, 06, or 07 followed by 8 digits
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  const re = /^(?:\+213|00213|0)(5|6|7)[0-9]{8}$/;
  return re.test(cleaned);
}

export function sanitizeOrderPayload(payload) {
  return {
    clientName: sanitizeText(payload.clientName || "", 120),
    phone: sanitizeText(payload.phone || "", 30),
    wilaya: sanitizeText(payload.wilaya || "", 80),
    daira: sanitizeText(payload.daira || "", 80),
    commune: sanitizeText(payload.commune || "", 80),
    postalCode: sanitizeText(payload.postalCode || "", 20),
    address: sanitizeText(payload.address || "", 300),
    deliveryType: payload.deliveryType === "agency" ? "agency" : "home",
    bookId: sanitizeText(payload.bookId || "", 80),
    bookTitle: sanitizeText(payload.bookTitle || "", 150),
    quantity: Math.max(1, Math.min(20, parseInt(payload.quantity, 10) || 1)),
    unitPrice: Number(payload.unitPrice) || 0,
    deliveryFee: Number(payload.deliveryFee) || 0,
    totalPrice: Number(payload.totalPrice) || 0,
    notes: sanitizeText(payload.notes || "", 500)
  };
}
