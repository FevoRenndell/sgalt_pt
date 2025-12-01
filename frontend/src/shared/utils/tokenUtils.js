// tokenUtils.js
export function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch (e) {
    console.error('Token inválido', e);
    return null;
  }
}

export function getHoursLeftFromToken(token) {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return 0;

  const nowMs = Date.now();
  const expMs = decoded.exp * 1000;
  const diffMs = expMs - nowMs;

  return diffMs / (1000 * 60 * 60); // horas
}
