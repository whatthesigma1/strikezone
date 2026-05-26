const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error('API error'), { status: res.status, data: err });
  }
  return res.json();
}

export const api = {
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/products/${q ? '?' + q : ''}`);
  },
  getCategories: () => apiFetch('/products/categories/'),
  validatePromo: (code) =>
    apiFetch('/orders/validate-promo/', { method: 'POST', body: JSON.stringify({ code }) }),
  createOrder: (data) =>
    apiFetch('/orders/', { method: 'POST', body: JSON.stringify(data) }),
};

// Auth helpers
export const authApi = {
  register: (data) =>
    apiFetch('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) =>
    apiFetch('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  refresh: (refresh) =>
    apiFetch('/auth/refresh/', { method: 'POST', body: JSON.stringify({ refresh }) }),
  profile: (token) =>
    apiFetch('/auth/profile/', { headers: { Authorization: `Bearer ${token}` } }),
};

// Token storage helpers
export const tokenStorage = {
  get: () => ({ access: localStorage.getItem('sz_access'), refresh: localStorage.getItem('sz_refresh') }),
  set: (access, refresh) => { localStorage.setItem('sz_access', access); localStorage.setItem('sz_refresh', refresh); },
  clear: () => { localStorage.removeItem('sz_access'); localStorage.removeItem('sz_refresh'); },
};

// Authenticated fetch (auto-attaches Bearer token)
export async function authFetch(path, token, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error('API error'), { status: res.status, data: err });
  }
  return res.json();
}
