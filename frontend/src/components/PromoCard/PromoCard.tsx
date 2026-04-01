import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToastStore } from '../../store/toastStore';
import type { Promo } from '../../types';
import s from './PromoCard.module.scss';

interface Props { promo: Promo; }

export default function PromoCard({ promo }: Props) {
  const { t } = useTranslation();
  const toast = useToastStore((s) => s.show);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(promo.code).catch(() => {});
    setCopied(true);
    toast(t('promos.toastCopied', { code: promo.code }));
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={s.card}>
      <div className={`${s.banner} ${s[promo.banner] || ''}`}>{promo.emoji}</div>
      <div className={s.body}>
        <div className={s.tag}>{promo.tag}</div>
        <div className={s.title}>{promo.title}</div>
        <div className={s.desc}>
          {promo.desc} {t('promos.minOrder', { min: promo.minOrder })}
        </div>
        <div className={s.footer}>
          <button className={`${s.code} ${copied ? s.copied : ''}`} onClick={copy}>
            {copied ? t('promos.copied') : promo.code}
          </button>
          <span className={s.expiry}>{t('promos.until', { date: promo.expiry })}</span>
        </div>
      </div>
    </div>
  );
}
