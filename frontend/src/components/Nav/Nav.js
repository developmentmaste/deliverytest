import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import s from './Nav.module.scss';
const LINKS = [
    { to: '/', labelKey: 'nav.restaurants', icon: '🏪' },
    { to: '/promos', labelKey: 'nav.promos', icon: '🎁' },
    { to: '/history', labelKey: 'nav.orders', icon: '📋' },
    { to: '/profile', labelKey: 'nav.profile', icon: '👤' },
];
export default function Nav({ theme, toggleTheme }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const cart = useCartStore((s) => s.cart);
    const totalItems = cart.reduce((n, i) => n + i.qty, 0);
    const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
    const changeLang = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('clover-lang', lng);
    };
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: s.nav, children: _jsxs("div", { className: s.nav__inner, children: [_jsxs("button", { className: s.nav__logo, onClick: () => navigate('/'), children: ["Clover", _jsx("span", { children: "." })] }), _jsxs("div", { className: s.nav__links, children: [LINKS.map((l) => (_jsx("button", { className: `${s.nav__btn} ${isActive(l.to) ? s.active : ''}`, onClick: () => navigate(l.to), children: t(l.labelKey) }, l.to))), _jsx("div", { className: s.nav__divider }), _jsx("div", { className: s.nav__lang, children: _jsxs("select", { className: s.nav__lang_select, value: i18n.language, onChange: (e) => changeLang(e.target.value), "aria-label": t('nav.language'), children: [_jsx("option", { value: "uk", children: "\u0423\u041A\u0420" }), _jsx("option", { value: "en", children: "ENG" })] }) }), _jsx("div", { className: s.nav__divider }), _jsx("button", { className: `${s.nav__btn} ${theme === 'dark' ? s.active : ''}`, onClick: toggleTheme, title: "Toggle theme", children: theme === 'dark' ? '☀️' : '🌙' }), _jsxs("button", { className: `${s.nav__cart_btn} ${isActive('/cart') ? s.active : ''}`, onClick: () => navigate('/cart'), children: [totalItems === 0 ? (_jsx("span", { className: s.nav__cart_icon, children: "\uD83D\uDED2" })) : null, _jsx("span", { className: s.nav__cart_text, children: t('nav.cart') }), totalItems > 0 && _jsx("span", { className: s.nav__badge, children: totalItems })] })] })] }) }), _jsxs("nav", { className: s.mobile_nav, children: [LINKS.map((l) => (_jsxs("button", { className: `${s.mobile_nav__btn} ${isActive(l.to) ? s.active : ''}`, onClick: () => navigate(l.to), children: [_jsx("span", { className: s.mobile_nav__btn__icon, children: l.icon }), t(l.labelKey)] }, l.to))), _jsxs("button", { className: `${s.mobile_nav__btn} ${isActive('/cart') ? s.active : ''}`, onClick: () => navigate('/cart'), children: [_jsxs("span", { className: s.mobile_nav__btn__icon, children: ["\uD83D\uDED2", totalItems > 0 && _jsx("sup", { children: totalItems })] }), t('nav.cart')] })] })] }));
}
