import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import type { Order, CartItem } from '../../types';
import s from './OrderCard.module.scss';

interface Props { order: Order; }

export default function OrderCard({ order }: Props) {
  const { t }   = useTranslation();
  const navigate = useNavigate();
  const reorder  = useCartStore((s) => s.reorder);
  const toast    = useToastStore((s) => s.show);

  const handleReorder = () => {
    const items: CartItem[] = order.items.map((i) => ({
      _id:      i.productId,
      shopId:   '',
      name:     i.name,
      emoji:    i.emoji,
      price:    i.price,
      desc:     '',
      category: '',
      qty:      i.qty,
      shopName: order.shopName,
    }));
    reorder(items);
    toast(t('history.reordered'));
    navigate('/cart');
  };

  const statusKey = `history.status.${order.status}` as const;

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div>
          <div className={s.orderId}>{order.orderId}</div>
          <div className={s.shopName}>{order.shopName}</div>
        </div>
        <div className={s.right}>
          <span className={`${s.status} ${s[order.status]}`}>{t(statusKey)}</span>
          <div className={s.date}>
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className={s.items}>
        {order.items.map((item, i) => (
          <span key={i} className={s.item}>
            {item.emoji} {item.name} ×{item.qty}
          </span>
        ))}
      </div>

      <div className={s.footer}>
        <div className={s.total}>₴{order.total}</div>
        <button className={s.reorderBtn} onClick={handleReorder}>
          {t('history.reorder')}
        </button>
      </div>
    </div>
  );
}
