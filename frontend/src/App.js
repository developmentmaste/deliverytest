import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav/Nav';
import ShopsPage from './pages/ShopsPage/ShopsPage';
import CartPage from './pages/CartPage/CartPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import PromosPage from './pages/PromosPage/PromosPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
export default function App() {
    const [theme, setTheme] = useState(() => localStorage.getItem('clover-theme') || 'light');
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('clover-theme', theme);
    }, [theme]);
    const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    return (_jsxs("div", { className: "app", children: [_jsx(Nav, { theme: theme, toggleTheme: toggleTheme }), _jsx("main", { className: "main-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(ShopsPage, {}) }), _jsx(Route, { path: "/cart", element: _jsx(CartPage, {}) }), _jsx(Route, { path: "/history", element: _jsx(HistoryPage, {}) }), _jsx(Route, { path: "/promos", element: _jsx(PromosPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, { theme: theme, toggleTheme: toggleTheme }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })] }));
}
