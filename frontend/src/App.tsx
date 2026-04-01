import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav/Nav';
import Toast from './components/Toast/Toast'; // ← додай
import ShopsPage from './pages/ShopsPage/ShopsPage';
import CartPage from './pages/CartPage/CartPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import PromosPage from './pages/PromosPage/PromosPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
export type Theme = 'light' | 'dark';
export default function App() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('clover-theme') as Theme) || 'light'
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clover-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  return (
    <div className="app">
      <Nav theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ShopsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/promos" element={<PromosPage />} />
          <Route path="/profile" element={<ProfilePage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toast /> {/* ← додай */}
    </div>
  );
}