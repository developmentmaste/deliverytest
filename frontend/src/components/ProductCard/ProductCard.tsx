import { useTranslation } from 'react-i18next';
import type { Product } from '../../types';
import s from './ProductCard.module.scss';

interface Props {
  product: Product;
  onAdd: () => void;
}

export default function ProductCard({ product, onAdd }: Props) {
  const { t } = useTranslation();
  return (
    <div className={s.card}>
      <div className={s.img}>{product.emoji}</div>
      <div className={s.body}>
        <div className={s.category}>{product.category}</div>
        <div className={s.name}>{product.name}</div>
        <div className={s.desc}>{product.desc}</div>
        <div className={s.footer}>
          <div className={s.price}>₴{product.price}</div>
          <button className={s.addBtn} onClick={onAdd} title={t('products.addToCart')}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}
