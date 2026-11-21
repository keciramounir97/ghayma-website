/**
 * Client-Side Rate Limiter & Cooldown Manager
 * Prevents spamming comments, likes, contact messages, and orders.
 */

const actionCooldowns = {
  comment: 4000,    // 4 seconds between comments
  like: 1500,       // 1.5 seconds between like toggles
  message: 8000,    // 8 seconds between contact messages
  order: 15000      // 15 seconds between book orders
};

const lastActionTimes = {};

export function checkRateLimit(actionKey, customCooldownMs) {
  const cooldown = customCooldownMs || actionCooldowns[actionKey] || 3000;
  const now = Date.now();
  const lastTime = lastActionTimes[actionKey] || 0;
  const elapsed = now - lastTime;

  if (elapsed < cooldown) {
    const remainingSeconds = Math.ceil((cooldown - elapsed) / 1000);
    return {
      allowed: false,
      remainingSeconds,
      message: `Veuillez patienter encore ${remainingSeconds} seconde(s) avant de recommencer.`
    };
  }

  lastActionTimes[actionKey] = now;
  return { allowed: true };
}
