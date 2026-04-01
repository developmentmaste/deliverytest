import type { CartItem as CartItemType } from '../../types';
import s from './CartItem.module.scss';

interface Props {
  item: CartItemType;
  onChangeQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onChangeQty, onRemove }: Props) {
  return (
    <div className={s.item}>
      <div className={s.emoji}>{item.emoji}</div>
      <div className={s.info}>
        <div className={s.name}>{item.name}</div>
        <div className={s.shop}>{item.shopName}</div>
        <div className={s.price}>₴{item.price * item.qty}</div>
      </div>
      <div className={s.qty}>
        <button className={s.qtyBtn} onClick={() => onChangeQty(item._id, -1)}>−</button>
        <span className={s.qtyNum}>{item.qty}</span>
        <button className={s.qtyBtn} onClick={() => onChangeQty(item._id, 1)}>+</button>
      </div>
      <button className={s.remove} onClick={() => onRemove(item._id)} title="Remove">✕</button>
    </div>
  );
}
