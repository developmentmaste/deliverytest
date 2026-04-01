import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchPromos } from '../../api';
import PromoCard from '../../components/PromoCard/PromoCard';
import s from './PromosPage.module.scss';
export default function PromosPage() {
    const { t } = useTranslation();
    const [promos, setPromos] = useState([]);
    useEffect(() => { fetchPromos().then(setPromos).catch(console.error); }, []);
    return (_jsx("div", { className: s.page, children: _jsxs("div", { className: "section-wrap", children: [_jsx("div", { className: "section-header", children: _jsxs("div", { children: [_jsx("div", { className: "section-title", children: t('promos.title') }), _jsx("div", { className: "section-subtitle", children: t('promos.subtitle') })] }) }), _jsx("div", { className: s.grid, children: promos.map((p) => _jsx(PromoCard, { promo: p }, p._id)) })] }) }));
}
