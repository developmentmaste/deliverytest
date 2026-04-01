import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import type { Theme } from '../../App';
import s from './Nav.module.scss';

interface NavProps {
  theme: Theme;
  toggleTheme: () => void;
}

const LINKS = [
  { to: '/',        labelKey: 'nav.restaurants', icon: '🏪' },
  { to: '/promos',  labelKey: 'nav.promos',      icon: '🎁' },
  { to: '/history', labelKey: 'nav.orders',      icon: '📋' },
  { to: '/profile', labelKey: 'nav.profile',     icon: '👤' },
];

export default function Nav({ theme, toggleTheme }: NavProps) {
  const { t, i18n } = useTranslation();
  const navigate    = useNavigate();
  const location    = useLocation();
  const cart        = useCartStore((s) => s.cart);
  const totalItems  = cart.reduce((n, i) => n + i.qty, 0);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('clover-lang', lng);
  };

  return (
    <>
      <nav className={s.nav}>
        <div className={s.nav__inner}>
          {/* Logo */}
          <button className={s.nav__logo} onClick={() => navigate('/')}>
            Clover<span>.</span>
          </button>

          {/* Desktop links */}
          <div className={s.nav__links}>
            {LINKS.map((l) => (
              <button
                key={l.to}
                className={`${s.nav__btn} ${isActive(l.to) ? s.active : ''}`}
                onClick={() => navigate(l.to)}
              >
                {t(l.labelKey)}
              </button>
            ))}

            <div className={s.nav__divider} />

            {/* Language toggle */}
            <div className={s.nav__lang}>
              <button
                className={`${s.nav__lang_btn} ${i18n.language === 'uk' ? s.active : ''}`}
                onClick={() => changeLang('uk')}
              >
                УКР
              </button>
              <button
                className={`${s.nav__lang_btn} ${i18n.language === 'en' ? s.active : ''}`}
                onClick={() => changeLang('en')}
              >
                ENG
              </button>
            </div>

            <div className={s.nav__divider} />

            {/* Theme */}
            <button className={s.nav__icon_btn} onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Cart */}
            <button className={s.nav__cart_btn} onClick={() => navigate('/cart')}>
              🛒 {t('nav.cart')}
              {totalItems > 0 && <span className={s.nav__badge}>{totalItems}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className={s.mobile_nav}>
        {LINKS.map((l) => (
          <button
            key={l.to}
            className={`${s.mobile_nav__btn} ${isActive(l.to) ? s.active : ''}`}
            onClick={() => navigate(l.to)}
          >
            <span className={s.mobile_nav__btn__icon}>{l.icon}</span>
            {t(l.labelKey)}
          </button>
        ))}
        <button
          className={`${s.mobile_nav__btn} ${isActive('/cart') ? s.active : ''}`}
          onClick={() => navigate('/cart')}
        >
          <span className={s.mobile_nav__btn__icon}>
            🛒{totalItems > 0 && <sup>{totalItems}</sup>}
          </span>
          {t('nav.cart')}
        </button>
      </nav>
    </>
  );
}
