import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import s from './ShopCard.module.scss';
export default function ShopCard({ shop, selected, onClick }) {
    return (_jsxs("div", { className: `${s.card} ${selected ? s.selected : ''}`, onClick: onClick, children: [shop.badge && _jsx("div", { className: s.badge, children: shop.badge }), _jsx("div", { className: s.img, children: shop.emoji }), _jsxs("div", { className: s.body, children: [_jsx("div", { className: s.name, children: shop.name }), _jsx("div", { className: s.cuisine, children: shop.cuisine }), _jsxs("div", { className: s.meta, children: [_jsxs("span", { className: s.rating, children: ["\u2605 ", shop.rating] }), _jsxs("span", { className: s.time, children: ["\u23F1 ", shop.time] })] })] })] }));
}
