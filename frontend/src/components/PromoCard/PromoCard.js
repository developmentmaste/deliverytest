import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToastStore } from '../../store/toastStore';
import s from './PromoCard.module.scss';
export default function PromoCard({ promo }) {
    const { t } = useTranslation();
    const toast = useToastStore((s) => s.show);
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(promo.code).catch(() => { });
        setCopied(true);
        toast(t('promos.toastCopied', { code: promo.code }));
        setTimeout(() => setCopied(false), 1600);
    };
    return (_jsxs("div", { className: s.card, children: [_jsx("div", { className: `${s.banner} ${s[promo.banner] || ''}`, children: promo.emoji }), _jsxs("div", { className: s.body, children: [_jsx("div", { className: s.tag, children: promo.tag }), _jsx("div", { className: s.title, children: promo.title }), _jsxs("div", { className: s.desc, children: [promo.desc, " ", t('promos.minOrder', { min: promo.minOrder })] }), _jsxs("div", { className: s.footer, children: [_jsx("button", { className: `${s.code} ${copied ? s.copied : ''}`, onClick: copy, children: copied ? t('promos.copied') : promo.code }), _jsx("span", { className: s.expiry, children: t('promos.until', { date: promo.expiry }) })] })] })] }));
}
