import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchShops, fetchProducts, fetchCategories } from '../../api';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import ShopCard from '../../components/ShopCard/ShopCard';
import ProductCard from '../../components/ProductCard/ProductCard';
import type { Shop, Product } from '../../types';
import s from './ShopsPage.module.scss';

const CUISINES = ['Українська', 'Азійська', 'Італійська', 'Здорове'];
const PAGE_SIZE = 6;

export default function ShopsPage() {
  const { t } = useTranslation();
  const toast  = useToastStore((st) => st.show);
  const addToCart = useCartStore((st) => st.addToCart);
  const cart   = useCartStore((st) => st.cart);

  // Shops state
  const [shops, setShops]         = useState<Shop[]>([]);
  const [ratingFilter, setRating] = useState('all');
  const [cuisineFilter, setCuisine] = useState('all');

  // Products state
  const [selectedShop, setSelectedShop]     = useState<Shop | null>(null);
  const [products, setProducts]             = useState<Product[]>([]);
  const [categories, setCategories]         = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort]                     = useState('default');
  const [page, setPage]                     = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [loadingProds, setLoadingProds]     = useState(false);

  const productsRef = useRef<HTMLDivElement>(null);

  // Load shops once
  useEffect(() => { fetchShops().then(setShops).catch(console.error); }, []);

  // Load products when shop / filters / page change
  useEffect(() => {
    if (!selectedShop) return;
    setLoadingProds(true);
    fetchProducts({
      shopId:   selectedShop._id,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      sort:     sort !== 'default' ? sort : undefined,
      page,
      limit:    PAGE_SIZE,
    })
      .then((res) => {
        setProducts(res.products);
        setTotalPages(res.pages);
      })
      .catch(console.error)
      .finally(() => setLoadingProds(false));
  }, [selectedShop, categoryFilter, sort, page]);

  const selectShop = async (shop: Shop) => {
    setSelectedShop(shop);
    setCategoryFilter('all');
    setSort('default');
    setPage(1);
    const cats = await fetchCategories(shop._id).catch(() => []);
    setCategories(cats);
    setTimeout(() => productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const filteredShops = shops.filter((sh) => {
    const rOk = ratingFilter === 'all'
      ? true
      : sh.rating >= parseFloat(ratingFilter) && sh.rating < parseFloat(ratingFilter) + 1;
    const cOk = cuisineFilter === 'all' || sh.cuisine === cuisineFilter;
    return rOk && cOk;
  });

  const handleAddToCart = (product: Product) => {
    if (cart.length > 0 && cart[0].shopId !== product.shopId) {
      toast(t('cart.mixed'));
      return;
    }
    addToCart({ ...product, shopName: selectedShop?.name ?? '' });
    toast(t('cart.toastAdded', { name: product.name }));
  };

  return (
    <div className={s.page}>
      {/* Hero */}
      <section className={s.hero}>
        <div className={s.hero__text}>
          <h1>
            {t('hero.title')}<br />
            <em>{t('hero.titleEm')}</em>
          </h1>
          <p>{t('hero.subtitle')}</p>
          <div className={s.hero__stats}>
            <div className={s.stat}><span className={s.statNum}>9</span><span className={s.statLbl}>{t('hero.statRestaurants')}</span></div>
            <div className={s.stat}><span className={s.statNum}>20′</span><span className={s.statLbl}>{t('hero.statDelivery')}</span></div>
            <div className={s.stat}><span className={s.statNum}>4.7★</span><span className={s.statLbl}>{t('hero.statRating')}</span></div>
          </div>
        </div>
        <div className={s.hero__pills}>
          <div className={s.pill}>🔥 {t('shops.title')}: Хата з борщем</div>
          <div className={s.pill}>⚡ 15 хв · Центр</div>
          <div className={s.pill}>🆕 Галицька кухня</div>
          <div className={s.pill}>🎁 WELCOME10 — 10%</div>
        </div>
      </section>

      {/* Shops section */}
      <section className={s.section}>
        <div className="section-header">
          <div>
            <div className="section-title">{t('shops.title')}</div>
            <div className="section-subtitle">{t('shops.subtitle')}</div>
          </div>
        </div>

        {/* Shop filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <div className="filter-label">{t('shops.filterRating')}</div>
            <div className="filter-chips">
              {['all', '4', '3', '2'].map((v) => (
                <button
                  key={v}
                  className={`chip ${ratingFilter === v ? 'active' : ''}`}
                  onClick={() => setRating(v)}
                >
                  {v === 'all' ? t('shops.all') : `${v}.0–${parseInt(v)+1}.0 ⭐`}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-label">{t('shops.filterCuisine')}</div>
            <div className="filter-chips">
              <button className={`chip ${cuisineFilter === 'all' ? 'active' : ''}`} onClick={() => setCuisine('all')}>
                {t('shops.all')}
              </button>
              {CUISINES.map((c) => (
                <button key={c} className={`chip ${cuisineFilter === c ? 'active' : ''}`} onClick={() => setCuisine(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredShops.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🏪</div>
            <div className="empty-state__title">{t('shops.notFound')}</div>
            <div className="empty-state__text">{t('shops.notFoundHint')}</div>
          </div>
        ) : (
          <div className={s.shopsGrid}>
            {filteredShops.map((sh) => (
              <ShopCard
                key={sh._id}
                shop={sh}
                selected={selectedShop?._id === sh._id}
                onClick={() => selectShop(sh)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Products section */}
      {selectedShop && (
        <section className={s.section} ref={productsRef}>
          <div className="section-header">
            <div>
              <div className="section-title">{selectedShop.name}</div>
              <div className="section-subtitle">
                {selectedShop.cuisine} · ★ {selectedShop.rating} · {selectedShop.time}
              </div>
            </div>
            <button className="chip" onClick={() => setSelectedShop(null)}>
              {t('products.backToShops')}
            </button>
          </div>

          {/* Product filters */}
          <div className="filters-bar">
            <div className="filter-group">
              <div className="filter-label">{t('products.filterCategory')}</div>
              <div className="filter-chips">
                <button
                  className={`chip ${categoryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => { setCategoryFilter('all'); setPage(1); }}
                >
                  {t('shops.all')}
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`chip ${categoryFilter === c ? 'active' : ''}`}
                    onClick={() => { setCategoryFilter(c); setPage(1); }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <div className="filter-label">{t('products.filterSort')}</div>
              <select
                className="filter-select"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="default">{t('products.sortDefault')}</option>
                <option value="price-asc">{t('products.sortPriceAsc')}</option>
                <option value="price-desc">{t('products.sortPriceDesc')}</option>
                <option value="name-az">{t('products.sortNameAz')}</option>
              </select>
            </div>
          </div>

          {loadingProds ? (
            <div className={s.loading}>
              {[...Array(6)].map((_, i) => <div key={i} className={s.skeleton} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🍽️</div>
              <div className="empty-state__title">{t('products.notFound')}</div>
              <div className="empty-state__text">{t('products.notFoundHint')}</div>
            </div>
          ) : (
            <div className={s.productsGrid}>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onAdd={() => handleAddToCart(p)} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
