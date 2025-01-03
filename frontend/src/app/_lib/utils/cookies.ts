export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() ?? '');
  }

  return null;
}

export const clearCookies = (...cookieNames: string[]) =>  {
  if (typeof window === 'undefined') {
    return;
  }

  cookieNames.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}