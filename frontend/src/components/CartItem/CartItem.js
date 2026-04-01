import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import s from './CartItem.module.scss';
export default function CartItem({ item, onChangeQty, onRemove }) {
    return (_jsxs("div", { className: s.item, children: [_jsx("div", { className: s.emoji, children: item.emoji }), _jsxs("div", { className: s.info, children: [_jsx("div", { className: s.name, children: item.name }), _jsx("div", { className: s.shop, children: item.shopName }), _jsxs("div", { className: s.price, children: ["\u20B4", item.price * item.qty] })] }), _jsxs("div", { className: s.qty, children: [_jsx("button", { className: s.qtyBtn, onClick: () => onChangeQty(item._id, -1), children: "\u2212" }), _jsx("span", { className: s.qtyNum, children: item.qty }), _jsx("button", { className: s.qtyBtn, onClick: () => onChangeQty(item._id, 1), children: "+" })] }), _jsx("button", { className: s.remove, onClick: () => onRemove(item._id), title: "Remove", children: "\u2715" })] }));
}
