import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import CartItemComp from '../../components/CartItem/CartItem';
import Modal from '../../components/Modal/Modal';
import { validatePromo, createOrder, calcSummary } from '../../api';
import type { Promo } from '../../types';
import s from './CartPage.module.scss';

interface FormState { email: string; phone: string; address: string; }
interface FormErrors { email: string; phone: string; address: string; }

export default function CartPage() {
  const { t }  = useTranslation();
  const navigate = useNavigate();
  const toast  = useToastStore((st) => st.show);
  const { cart, promo, setPromo, clearCart } = useCartStore();

  const [form, setForm]       = useState<FormState>({ email: '', phone: '', address: '' });
  const [errors, setErrors]   = useState<FormErrors>({ email: '', phone: '', address: '' });
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const summary = calcSummary(cart, promo);

  // ── Validation ────────────────────────────────
  const validate = () => {
    const e: FormErrors = { email: '', phone: '', address: '' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('cart.errEmail');
    if (form.phone.replace(/\D/g, '').length < 9)        e.phone = t('cart.errPhone');
    if (form.address.trim().length < 5)                  e.address = t('cart.errAddress');
    setErrors(e);
    return !e.email && !e.phone && !e.address;
  };

  // ── Apply promo ───────────────────────────────
  const applyPromo = async () => {
    setPromoError('');
    if (!promoCode.trim()) return;
    try {
      const p: Promo = await validatePromo(promoCode.trim(), summary.subtotal);
      setPromo(p);
      toast(t('cart.promoApplied', { code: p.code }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      try {
        const parsed = JSON.parse(msg);
        if (parsed.error === 'min_order') {
          setPromoError(t('cart.promoMinOrder', { min: parsed.minOrder }));
        } else {
          setPromoError(t('cart.promoNotFound'));
        }
      } catch {
        setPromoError(t('cart.promoNotFound'));
      }
      setPromo(null);
    }
  };

  // ── Submit order ──────────────────────────────
  const submitOrder = async () => {
    if (!cart.length || !validate()) return;
    setSubmitting(true);
    try {
      const order = await createOrder({
        email:    form.email,
        phone:    form.phone,
        address:  form.address,
        shopName: cart[0]?.shopName ?? '',
        items:    cart.map((i) => ({ productId: i._id, name: i.name, emoji: i.emoji, price: i.price, qty: i.qty })),
        promoCode: promo?.code ?? null,
        ...summary,
      });
      setOrderId(order.orderId);
      clearCart();
    } catch {
      toast('❌ Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: '' }));
    },
    className: `form-input ${errors[key] ? 'error' : ''}`,
  });

  // ── Empty cart ────────────────────────────────
  if (!cart.length && !orderId) {
    return (
      <div className={s.page}>
        <div className="section-wrap">
          <div className="section-title">{t('cart.title')}</div>
          <div className="empty-state" style={{ marginTop: '3rem' }}>
            <div className="empty-state__icon">🍽️</div>
            <div className="empty-state__title">{t('cart.empty')}</div>
            <div className="empty-state__text">{t('cart.emptyHint')}</div>
            <button className={s.browseBtn} onClick={() => navigate('/')}>
              {t('cart.browse')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      {orderId && (
        <Modal orderId={orderId} onClose={() => { setOrderId(null); navigate('/'); }} />
      )}

      <div className="section-wrap">
        <div className="section-title">{t('cart.title')}</div>

        <div className={s.layout}>
          {/* Cart items */}
          <div className={s.items}>
            {cart.map((item) => <CartItemComp key={item._id} item={item} />)}
          </div>

          {/* Order panel */}
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('cart.checkout')}</div>

            <div className="form-group">
              <label className="form-label">{t('cart.email')}</label>
              <input type="email" placeholder="you@example.com" {...field('email')} />
              {errors.email && <div className="form-error show">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('cart.phone')}</label>
              <input type="tel" placeholder="+380 50 000 0000" {...field('phone')} />
              {errors.phone && <div className="form-error show">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('cart.address')}</label>
              <input type="text" placeholder={t('cart.addressPlaceholder')} {...field('address')} />
              {errors.address && <div className="form-error show">{errors.address}</div>}
            </div>

            {/* Promo */}
            <div className="form-group">
              <label className="form-label">{t('cart.promo')}</label>
              <div className={s.promoRow}>
                <input
                  className="form-input"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder={t('cart.promoPlaceholder')}
                  style={{ flex: 1 }}
                />
                <button className={s.applyBtn} onClick={applyPromo}>
                  {t('cart.promoApply')}
                </button>
              </div>
              {promoError && <div className="form-error show">{promoError}</div>}
              {promo && (
                <div className={s.promoApplied}>
                  ✓ {promo.code} — {promo.type === 'percent' ? `${promo.discount * 100}%` : `₴${promo.discount}`}
                </div>
              )}
            </div>

            <div className={s.divider} />

            {/* Summary */}
            <div className={s.summaryRow}>
              <span>{t('cart.subtotal')}</span>
              <span>₴{summary.subtotal}</span>
            </div>
            {summary.discount > 0 && (
              <div className={`${s.summaryRow} ${s.discountRow}`}>
                <span>{t('cart.discount')}</span>
                <span>−₴{summary.discount}</span>
              </div>
            )}
            <div className={s.summaryRow}>
              <span>{t('cart.delivery')}</span>
              <span>{summary.delivery === 0 ? t('cart.free') : `₴${summary.delivery}`}</span>
            </div>
            <div className={s.summaryRow}>
              <span>{t('cart.tax')}</span>
              <span>₴{summary.tax}</span>
            </div>
            <div className={s.totalRow}>
              <span>{t('cart.total')}</span>
              <span>₴{summary.total}</span>
            </div>

            <button className={s.submitBtn} onClick={submitOrder} disabled={submitting || !cart.length}>
              {submitting ? t('cart.submitting') : t('cart.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
