const BASE = '/api';
async function get(path) {
    const res = await fetch(BASE + path);
    if (!res.ok)
        throw new Error(await res.text());
    return res.json();
}
async function post(path, body) {
    const res = await fetch(BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok)
        throw new Error(await res.text());
    return res.json();
}
// ── Shops ─────────────────────────────────────
export const fetchShops = () => get('/shops');
// ── Products ──────────────────────────────────
export const fetchProducts = (params) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined)
        q.set(k, String(v)); });
    return get(`/products?${q}`);
};
export const fetchCategories = (shopId) => get(`/products/categories/${shopId}`);
// ── Orders ────────────────────────────────────
export const createOrder = (payload) => post('/orders', payload);
export const fetchOrders = (email, orderId) => {
    const q = new URLSearchParams();
    if (email)
        q.set('email', email);
    if (orderId)
        q.set('orderId', orderId);
    return get(`/orders?${q}`);
};
// ── Promos ────────────────────────────────────
export const fetchPromos = () => get('/promos');
export const validatePromo = (code, subtotal) => post('/promos/validate', { code, subtotal });
// ── Cart helpers ──────────────────────────────
export function calcSummary(cart, promo) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    let discount = 0;
    if (promo) {
        discount = promo.type === 'percent'
            ? Math.round(subtotal * promo.discount)
            : promo.discount;
    }
    const afterDisc = Math.max(0, subtotal - discount);
    const tax = Math.round(afterDisc * 0.05);
    const delivery = promo?.code === 'FREESHIP' ? 0 : 49;
    const total = afterDisc + tax + delivery;
    return { subtotal, discount, delivery, tax, total };
}
