import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import CartItemComp from '../../components/CartItem/CartItem';
import Modal from '../../components/Modal/Modal';
import { validatePromo, createOrder, calcSummary } from '../../api';
import s from './CartPage.module.scss';
export default function CartPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToastStore((st) => st.show);
    const cart = useCartStore((st) => st.cart);
    const promo = useCartStore((st) => st.promo);
    const setPromo = useCartStore((st) => st.setPromo);
    const clearCart = useCartStore((st) => st.clearCart);
    const changeQty = useCartStore((st) => st.changeQty);
    const removeFromCart = useCartStore((st) => st.removeFromCart);
    const [form, setForm] = useState({ email: '', phone: '', address: '' });
    const [errors, setErrors] = useState({ email: '', phone: '', address: '' });
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const summary = calcSummary(cart, promo);
    // ── Validation ────────────────────────────────
    const validate = () => {
        const e = { email: '', phone: '', address: '' };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = t('cart.errEmail');
        if (form.phone.replace(/\D/g, '').length < 9)
            e.phone = t('cart.errPhone');
        if (form.address.trim().length < 5)
            e.address = t('cart.errAddress');
        setErrors(e);
        return !e.email && !e.phone && !e.address;
    };
    // ── Apply promo ───────────────────────────────
    const applyPromo = async () => {
        setPromoError('');
        if (!promoCode.trim())
            return;
        try {
            const p = await validatePromo(promoCode.trim(), summary.subtotal);
            setPromo(p);
            toast(t('cart.promoApplied', { code: p.code }));
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : '';
            try {
                const parsed = JSON.parse(msg);
                if (parsed.error === 'min_order') {
                    setPromoError(t('cart.promoMinOrder', { min: parsed.minOrder }));
                }
                else {
                    setPromoError(t('cart.promoNotFound'));
                }
            }
            catch {
                setPromoError(t('cart.promoNotFound'));
            }
            setPromo(null);
        }
    };
    // ── Submit order ──────────────────────────────
    const submitOrder = async () => {
        if (!cart.length || !validate())
            return;
        setSubmitting(true);
        try {
            const order = await createOrder({
                email: form.email,
                phone: form.phone,
                address: form.address,
                shopName: cart[0]?.shopName ?? '',
                items: cart.map((i) => ({ productId: i._id, name: i.name, emoji: i.emoji, price: i.price, qty: i.qty })),
                promoCode: promo?.code ?? null,
                ...summary,
            });
            setOrderId(order.orderId);
            clearCart();
        }
        catch {
            toast('❌ Something went wrong. Try again.');
        }
        finally {
            setSubmitting(false);
        }
    };
    const field = (key) => ({
        value: form[key],
        onChange: (e) => {
            setForm((f) => ({ ...f, [key]: e.target.value }));
            if (errors[key])
                setErrors((er) => ({ ...er, [key]: '' }));
        },
        className: `form-input ${errors[key] ? 'error' : ''}`,
    });
    // ── Empty cart ────────────────────────────────
    if (!cart.length && !orderId) {
        return (_jsx("div", { className: s.page, children: _jsxs("div", { className: "section-wrap", children: [_jsx("div", { className: "section-title", children: t('cart.title') }), _jsxs("div", { className: "empty-state", style: { marginTop: '3rem' }, children: [_jsx("div", { className: "empty-state__icon", children: "\uD83C\uDF7D\uFE0F" }), _jsx("div", { className: "empty-state__title", children: t('cart.empty') }), _jsx("div", { className: "empty-state__text", children: t('cart.emptyHint') }), _jsx("button", { className: s.browseBtn, onClick: () => navigate('/'), children: t('cart.browse') })] })] }) }));
    }
    return (_jsxs("div", { className: s.page, children: [orderId && (_jsx(Modal, { orderId: orderId, onClose: () => { setOrderId(null); navigate('/'); } })), _jsxs("div", { className: "section-wrap", children: [_jsx("div", { className: "section-title", children: t('cart.title') }), _jsxs("div", { className: s.layout, children: [_jsx("div", { className: s.items, children: cart.map((item) => (_jsx(CartItemComp, { item: item, onChangeQty: changeQty, onRemove: removeFromCart }, item._id))) }), _jsxs("div", { className: s.panel, children: [_jsx("div", { className: s.panelTitle, children: t('cart.checkout') }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t('cart.email') }), _jsx("input", { type: "email", placeholder: "you@example.com", ...field('email') }), errors.email && _jsx("div", { className: "form-error show", children: errors.email })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t('cart.phone') }), _jsx("input", { type: "tel", placeholder: "+380 50 000 0000", ...field('phone') }), errors.phone && _jsx("div", { className: "form-error show", children: errors.phone })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t('cart.address') }), _jsx("input", { type: "text", placeholder: t('cart.addressPlaceholder'), ...field('address') }), errors.address && _jsx("div", { className: "form-error show", children: errors.address })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t('cart.promo') }), _jsxs("div", { className: s.promoRow, children: [_jsx("input", { className: "form-input", value: promoCode, onChange: (e) => setPromoCode(e.target.value.toUpperCase()), placeholder: t('cart.promoPlaceholder'), style: { flex: 1 } }), _jsx("button", { className: s.applyBtn, onClick: applyPromo, children: t('cart.promoApply') })] }), promoError && _jsx("div", { className: "form-error show", children: promoError }), promo && (_jsxs("div", { className: s.promoApplied, children: ["\u2713 ", promo.code, " \u2014 ", promo.type === 'percent' ? `${promo.discount * 100}%` : `₴${promo.discount}`] }))] }), _jsx("div", { className: s.divider }), _jsxs("div", { className: s.summaryRow, children: [_jsx("span", { children: t('cart.subtotal') }), _jsxs("span", { children: ["\u20B4", summary.subtotal] })] }), summary.discount > 0 && (_jsxs("div", { className: `${s.summaryRow} ${s.discountRow}`, children: [_jsx("span", { children: t('cart.discount') }), _jsxs("span", { children: ["\u2212\u20B4", summary.discount] })] })), _jsxs("div", { className: s.summaryRow, children: [_jsx("span", { children: t('cart.delivery') }), _jsx("span", { children: summary.delivery === 0 ? t('cart.free') : `₴${summary.delivery}` })] }), _jsxs("div", { className: s.summaryRow, children: [_jsx("span", { children: t('cart.tax') }), _jsxs("span", { children: ["\u20B4", summary.tax] })] }), _jsxs("div", { className: s.totalRow, children: [_jsx("span", { children: t('cart.total') }), _jsxs("span", { children: ["\u20B4", summary.total] })] }), _jsx("button", { className: s.submitBtn, onClick: submitOrder, disabled: submitting || !cart.length, children: submitting ? t('cart.submitting') : t('cart.submit') })] })] })] })] }));
}
