import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import s from './OrderCard.module.scss';
export default function OrderCard({ order }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const reorder = useCartStore((s) => s.reorder);
    const toast = useToastStore((s) => s.show);
    const handleReorder = () => {
        const items = order.items.map((i) => ({
            _id: i.productId,
            shopId: '',
            name: i.name,
            emoji: i.emoji,
            price: i.price,
            desc: '',
            category: '',
            qty: i.qty,
            shopName: order.shopName,
        }));
        reorder(items);
        toast(t('history.reordered'));
        navigate('/cart');
    };
    const statusKey = `history.status.${order.status}`;
    return (_jsxs("div", { className: s.card, children: [_jsxs("div", { className: s.header, children: [_jsxs("div", { children: [_jsx("div", { className: s.orderId, children: order.orderId }), _jsx("div", { className: s.shopName, children: order.shopName })] }), _jsxs("div", { className: s.right, children: [_jsx("span", { className: `${s.status} ${s[order.status]}`, children: t(statusKey) }), _jsx("div", { className: s.date, children: new Date(order.createdAt).toLocaleDateString() })] })] }), _jsx("div", { className: s.items, children: order.items.map((item, i) => (_jsxs("span", { className: s.item, children: [item.emoji, " ", item.name, " \u00D7", item.qty] }, i))) }), _jsxs("div", { className: s.footer, children: [_jsxs("div", { className: s.total, children: ["\u20B4", order.total] }), _jsx("button", { className: s.reorderBtn, onClick: handleReorder, children: t('history.reorder') })] })] }));
}
