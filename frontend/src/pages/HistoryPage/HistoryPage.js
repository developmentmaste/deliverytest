import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchOrders } from '../../api';
import OrderCard from '../../components/OrderCard/OrderCard';
import s from './HistoryPage.module.scss';
export default function HistoryPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState('');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const search = async () => {
        if (!email.trim() && !orderId.trim()) {
            setError(t('history.errEmail'));
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await fetchOrders(email.trim() || undefined, orderId.trim() || undefined);
            setOrders(res);
        }
        catch {
            setOrders([]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleKey = (e) => { if (e.key === 'Enter')
        search(); };
    return (_jsx("div", { className: s.page, children: _jsxs("div", { className: "section-wrap", children: [_jsx("div", { className: "section-title", children: t('history.title') }), _jsxs("div", { className: s.searchBox, children: [_jsxs("div", { className: "form-group", style: { margin: 0 }, children: [_jsx("label", { className: "form-label", children: t('history.findByEmail') }), _jsx("input", { className: `form-input ${error ? 'error' : ''}`, type: "email", placeholder: "you@example.com", value: email, onChange: (e) => { setEmail(e.target.value); setError(''); }, onKeyDown: handleKey })] }), _jsx("div", { className: s.orDivider, children: _jsx("span", { children: t('history.orOrderId') }) }), _jsxs("div", { className: "form-group", style: { margin: 0 }, children: [_jsx("label", { className: "form-label", children: t('history.orOrderId') }), _jsx("input", { className: "form-input", type: "text", placeholder: t('history.orderIdPlaceholder'), value: orderId, onChange: (e) => setOrderId(e.target.value), onKeyDown: handleKey })] }), error && _jsx("div", { className: "form-error show", children: error }), _jsx("button", { className: s.searchBtn, onClick: search, disabled: loading, children: loading ? '...' : t('history.search') })] }), _jsx("div", { className: s.results, children: orders === null ? (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state__icon", children: "\uD83D\uDD0D" }), _jsx("div", { className: "empty-state__title", children: t('history.emptyTitle') }), _jsx("div", { className: "empty-state__text", children: t('history.emptyHint') })] })) : orders.length === 0 ? (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state__icon", children: "\uD83D\uDCED" }), _jsx("div", { className: "empty-state__title", children: t('history.notFound') })] })) : (orders.map((o) => _jsx(OrderCard, { order: o }, o._id))) })] }) }));
}
