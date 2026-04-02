import type { Shop, ProductsResponse, Order, Promo, CartItem } from '../types';

const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Shops ─────────────────────────────────────
export const fetchShops = () => get<Shop[]>('/shops');

// ── Products ──────────────────────────────────
export const fetchProducts = (params: {
  shopId?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined) q.set(k, String(v)); });
  return get<ProductsResponse>(`/products?${q}`);
};

export const fetchCategories = (shopId: string) =>
  get<string[]>(`/products/categories/${shopId}`);

// ── Orders ────────────────────────────────────
export const createOrder = (payload: {
  email: string;
  phone: string;
  address: string;
  shopName: string;
  items: { productId: string; name: string; emoji: string; price: number; qty: number }[];
  promoCode: string | null;
  subtotal: number;
  discount: number;
  delivery: number;
  tax: number;
  total: number;
}) => post<Order>('/orders', payload);

export const fetchOrders = (email?: string, orderId?: string) => {
  const q = new URLSearchParams();
  if (email)   q.set('email',   email);
  if (orderId) q.set('orderId', orderId);
  return get<Order[]>(`/orders?${q}`);
};

// ── Promos ────────────────────────────────────
export const fetchPromos = () => get<Promo[]>('/promos');

export const validatePromo = (code: string, subtotal: number) =>
  post<Promo>('/promos/validate', { code, subtotal });

// ── Cart helpers ──────────────────────────────
export function calcSummary(
  cart: CartItem[],
  promo: Promo | null
): { subtotal: number; discount: number; delivery: number; tax: number; total: number } {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  if (promo) {
    discount = promo.type === 'percent'
      ? Math.round(subtotal * promo.discount)
      : promo.discount;
  }
  const afterDisc = Math.max(0, subtotal - discount);
  const tax       = Math.round(afterDisc * 0.05);
  const delivery  = promo?.code === 'FREESHIP' ? 0 : 49;
  const total     = afterDisc + tax + delivery;
  return { subtotal, discount, delivery, tax, total };
}
