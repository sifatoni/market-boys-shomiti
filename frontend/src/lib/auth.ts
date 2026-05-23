const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = 'auth_token=; path=/; max-age=0';
}

interface JwtPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'USER';
  name?: string;
  iat?: number;
  exp?: number;
}

export function getUser(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'ADMIN';
}

export function isAuthenticated(): boolean {
  const user = getUser();
  if (!user) return false;
  if (user.exp && user.exp * 1000 < Date.now()) {
    removeToken();
    return false;
  }
  return true;
}
