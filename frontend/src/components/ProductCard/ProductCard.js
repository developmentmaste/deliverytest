import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import s from './ProductCard.module.scss';
export default function ProductCard({ product, onAdd }) {
    const { t } = useTranslation();
    return (_jsxs("div", { className: s.card, children: [_jsx("div", { className: s.img, children: product.emoji }), _jsxs("div", { className: s.body, children: [_jsx("div", { className: s.category, children: product.category }), _jsx("div", { className: s.name, children: product.name }), _jsx("div", { className: s.desc, children: product.desc }), _jsxs("div", { className: s.footer, children: [_jsxs("div", { className: s.price, children: ["\u20B4", product.price] }), _jsx("button", { className: s.addBtn, onClick: onAdd, title: t('products.addToCart'), children: "+" })] })] })] }));
}
