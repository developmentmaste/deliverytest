import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchOrders } from '../../api';
import OrderCard from '../../components/OrderCard/OrderCard';
import type { Order } from '../../types';
import s from './HistoryPage.module.scss';

export default function HistoryPage() {
  const { t } = useTranslation();
  const [email, setEmail]     = useState('');
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders]   = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const search = async () => {
    if (!email.trim() && !orderId.trim()) {
      setError(t('history.errEmail'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetchOrders(
        email.trim()   || undefined,
        orderId.trim() || undefined,
      );
      setOrders(res);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') search(); };

  return (
    <div className={s.page}>
      <div className="section-wrap">
        <div className="section-title">{t('history.title')}</div>

        <div className={s.searchBox}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('history.findByEmail')}</label>
            <input
              className={`form-input ${error ? 'error' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              onKeyDown={handleKey}
            />
          </div>

          <div className={s.orDivider}>
            <span>{t('history.orOrderId')}</span>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('history.orOrderId')}</label>
            <input
              className="form-input"
              type="text"
              placeholder={t('history.orderIdPlaceholder')}
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          {error && <div className="form-error show">{error}</div>}

          <button className={s.searchBtn} onClick={search} disabled={loading}>
            {loading ? '...' : t('history.search')}
          </button>
        </div>

        {/* Results */}
        <div className={s.results}>
          {orders === null ? (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <div className="empty-state__title">{t('history.emptyTitle')}</div>
              <div className="empty-state__text">{t('history.emptyHint')}</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📭</div>
              <div className="empty-state__title">{t('history.notFound')}</div>
            </div>
          ) : (
            orders.map((o) => <OrderCard key={o._id} order={o} />)
          )}
        </div>
      </div>
    </div>
  );
}
