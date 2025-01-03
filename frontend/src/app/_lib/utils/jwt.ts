export const isJwtExpired = (token: string): boolean => {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid JWT');
  }

  const payload = JSON.parse(atob(parts[1]));
  const exp = payload.exp;

  if (!exp) {
    return false;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
}
