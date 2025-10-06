export function isAdmin() {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('admin_token'));
}

export function signInDemo() {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', 'demo');
}

export function signOut() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
}
