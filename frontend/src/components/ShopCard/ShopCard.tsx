import type { Shop } from '../../types';
import s from './ShopCard.module.scss';

interface Props {
  shop: Shop;
  selected: boolean;
  onClick: () => void;
}

export default function ShopCard({ shop, selected, onClick }: Props) {
  return (
    <div className={`${s.card} ${selected ? s.selected : ''}`} onClick={onClick}>
      {shop.badge && <div className={s.badge}>{shop.badge}</div>}
      <div className={s.img}>{shop.emoji}</div>
      <div className={s.body}>
        <div className={s.name}>{shop.name}</div>
        <div className={s.cuisine}>{shop.cuisine}</div>
        <div className={s.meta}>
          <span className={s.rating}>★ {shop.rating}</span>
          <span className={s.time}>⏱ {shop.time}</span>
        </div>
      </div>
    </div>
  );
}
