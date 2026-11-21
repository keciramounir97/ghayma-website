/**
 * Client-Side Rate Limiter & Cooldown Manager
 */
const actionCooldowns = {
  comment: 4000,
  like: 1500,
  message: 8000,
  order: 15000
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
      message: `Veuillez patienter ${remainingSeconds} seconde(s).`
    };
  }

  lastActionTimes[actionKey] = now;
  return { allowed: true };
}
