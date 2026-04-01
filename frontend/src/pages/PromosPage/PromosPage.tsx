import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchPromos } from '../../api';
import PromoCard from '../../components/PromoCard/PromoCard';
import type { Promo } from '../../types';
import s from './PromosPage.module.scss';

export default function PromosPage() {
  const { t } = useTranslation();
  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => { fetchPromos().then(setPromos).catch(console.error); }, []);

  return (
    <div className={s.page}>
      <div className="section-wrap">
        <div className="section-header">
          <div>
            <div className="section-title">{t('promos.title')}</div>
            <div className="section-subtitle">{t('promos.subtitle')}</div>
          </div>
        </div>
        <div className={s.grid}>
          {promos.map((p) => <PromoCard key={p._id} promo={p} />)}
        </div>
      </div>
    </div>
  );
}
