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
