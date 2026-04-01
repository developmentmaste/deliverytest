import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchShops, fetchProducts, fetchCategories } from '../../api';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import ShopCard from '../../components/ShopCard/ShopCard';
import ProductCard from '../../components/ProductCard/ProductCard';
import s from './ShopsPage.module.scss';
const PAGE_SIZE = 6;
export default function ShopsPage() {
    const { t } = useTranslation();
    const CUISINE_MAP = {
        'Українська': 'Українська',
        'Ukrainian': 'Українська',
        'Азійська': 'Азійська',
        'Asian': 'Азійська',
        'Італійська': 'Італійська',
        'Italian': 'Італійська',
        'Здорове': 'Здорове',
        'Healthy': 'Здорове',
    };
    const CUISINE_LABELS = {
        'Українська': t('shops.cuisines.ukrainian'),
        'Азійська': t('shops.cuisines.asian'),
        'Італійська': t('shops.cuisines.italian'),
        'Здорове': t('shops.cuisines.healthy'),
    };
    const toast = useToastStore((st) => st.show);
    const addToCart = useCartStore((st) => st.addToCart);
    const cart = useCartStore((st) => st.cart);
    // Shops state
    const [shops, setShops] = useState([]);
    const cuisineOptions = useMemo(() => Array.from(new Set(shops.map((sh) => CUISINE_MAP[sh.cuisine] ?? sh.cuisine))).sort(), [shops]);
    const [ratingFilter, setRating] = useState('all');
    const [cuisineFilter, setCuisine] = useState('all');
    // Products state
    const [selectedShop, setSelectedShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sort, setSort] = useState('default');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingProds, setLoadingProds] = useState(false);
    const productsRef = useRef(null);
    // Load shops once
    useEffect(() => { fetchShops().then(setShops).catch(console.error); }, []);
    // Load products when shop / filters / page change
    useEffect(() => {
        if (!selectedShop)
            return;
        setLoadingProds(true);
        fetchProducts({
            shopId: selectedShop._id,
            category: categoryFilter !== 'all' ? categoryFilter : undefined,
            sort: sort !== 'default' ? sort : undefined,
            page,
            limit: PAGE_SIZE,
        })
            .then((res) => {
            setProducts(res.products);
            setTotalPages(res.pages);
        })
            .catch(console.error)
            .finally(() => setLoadingProds(false));
    }, [selectedShop, categoryFilter, sort, page]);
    const selectShop = async (shop) => {
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
        const normalizedCuisine = CUISINE_MAP[sh.cuisine] ?? sh.cuisine;
        const cOk = cuisineFilter === 'all' || normalizedCuisine === cuisineFilter;
        return rOk && cOk;
    });
    const handleAddToCart = (product) => {
        if (cart.length > 0 && cart[0].shopId !== product.shopId) {
            const confirmed = window.confirm(t('cart.confirmMixed'));
            if (!confirmed)
                return;
            useCartStore.getState().clearCart();
        }
        addToCart({ ...product, shopName: selectedShop?.name ?? '' });
        toast(t('cart.toastAdded', { name: product.name }));
    };
    return (_jsxs("div", { className: s.shopsPage, children: [_jsxs("section", { className: s.hero, children: [_jsxs("div", { className: s.hero__text, children: [_jsxs("h1", { children: [t('hero.title'), _jsx("br", {}), _jsx("em", { children: t('hero.titleEm') })] }), _jsx("p", { children: t('hero.subtitle') }), _jsxs("div", { className: s.hero__stats, children: [_jsxs("div", { className: s.statCard, children: [_jsx("span", { className: s.statNumber, children: "9" }), _jsx("span", { className: s.statLabel, children: t('hero.statRestaurants') })] }), _jsxs("div", { className: s.statCard, children: [_jsx("span", { className: s.statNumber, children: "20\u2032" }), _jsx("span", { className: s.statLabel, children: t('hero.statDelivery') })] }), _jsxs("div", { className: s.statCard, children: [_jsx("span", { className: s.statNumber, children: "4.7\u2605" }), _jsx("span", { className: s.statLabel, children: t('hero.statRating') })] })] })] }), _jsxs("div", { className: s.hero__pills, children: [_jsx("div", { className: s.pill, children: t('shops.heroPills.trending', { shop: 'Borscht House' }) }), _jsx("div", { className: s.pill, children: t('shops.heroPills.fast') }), _jsx("div", { className: s.pill, children: t('shops.heroPills.new', { shop: 'Galician Cuisine' }) }), _jsx("div", { className: s.pill, children: t('shops.heroPills.deal') })] })] }), _jsxs("section", { className: s.sectionBlock, children: [_jsx("div", { className: "section-header", children: _jsxs("div", { children: [_jsx("div", { className: "section-title", children: t('shops.title') }), _jsx("div", { className: "section-subtitle", children: t('shops.subtitle') })] }) }), _jsxs("div", { className: "filters-bar", children: [_jsxs("div", { className: "filter-group", children: [_jsx("div", { className: "filter-label", children: t('shops.filterRating') }), _jsx("div", { className: "filter-chips", children: ['all', '4', '3', '2'].map((v) => (_jsx("button", { className: `chip ${ratingFilter === v ? 'active' : ''}`, onClick: () => setRating(v), children: v === 'all' ? t('shops.all') : `${v}.0–${parseInt(v) + 1}.0 ⭐` }, v))) })] }), _jsxs("div", { className: "filter-group", children: [_jsx("div", { className: "filter-label", children: t('shops.filterCuisine') }), _jsxs("div", { className: "filter-chips", children: [_jsx("button", { className: `chip ${cuisineFilter === 'all' ? 'active' : ''}`, onClick: () => setCuisine('all'), children: t('shops.all') }), cuisineOptions.map((c) => (_jsx("button", { className: `chip ${cuisineFilter === c ? 'active' : ''}`, onClick: () => setCuisine(c), children: CUISINE_LABELS[c] ?? c }, c)))] })] })] }), filteredShops.length === 0 ? (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state__icon", children: "\uD83C\uDFEA" }), _jsx("div", { className: "empty-state__title", children: t('shops.notFound') }), _jsx("div", { className: "empty-state__text", children: t('shops.notFoundHint') })] })) : (_jsx("div", { className: s.shopsGrid, children: filteredShops.map((sh) => (_jsx(ShopCard, { shop: sh, selected: selectedShop?._id === sh._id, onClick: () => selectShop(sh) }, sh._id))) }))] }), selectedShop && (_jsxs("section", { className: s.sectionBlock, ref: productsRef, children: [_jsxs("div", { className: "section-header", children: [_jsxs("div", { children: [_jsx("div", { className: "section-title", children: selectedShop.name }), _jsxs("div", { className: "section-subtitle", children: [selectedShop.cuisine, " \u00B7 \u2605 ", selectedShop.rating, " \u00B7 ", selectedShop.time] })] }), _jsx("button", { className: "chip", onClick: () => setSelectedShop(null), children: t('products.backToShops') })] }), _jsxs("div", { className: "filters-bar", children: [_jsxs("div", { className: "filter-group", children: [_jsx("div", { className: "filter-label", children: t('products.filterCategory') }), _jsxs("div", { className: "filter-chips", children: [_jsx("button", { className: `chip ${categoryFilter === 'all' ? 'active' : ''}`, onClick: () => { setCategoryFilter('all'); setPage(1); }, children: t('shops.all') }), categories.map((c) => (_jsx("button", { className: `chip ${categoryFilter === c ? 'active' : ''}`, onClick: () => { setCategoryFilter(c); setPage(1); }, children: c }, c)))] })] }), _jsxs("div", { className: "filter-group", children: [_jsx("div", { className: "filter-label", children: t('products.filterSort') }), _jsxs("select", { className: "filter-select", value: sort, onChange: (e) => { setSort(e.target.value); setPage(1); }, children: [_jsx("option", { value: "default", children: t('products.sortDefault') }), _jsx("option", { value: "price-asc", children: t('products.sortPriceAsc') }), _jsx("option", { value: "price-desc", children: t('products.sortPriceDesc') }), _jsx("option", { value: "name-az", children: t('products.sortNameAz') })] })] })] }), loadingProds ? (_jsx("div", { className: s.loading, children: [...Array(6)].map((_, i) => _jsx("div", { className: s.skeleton }, i)) })) : products.length === 0 ? (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state__icon", children: "\uD83C\uDF7D\uFE0F" }), _jsx("div", { className: "empty-state__title", children: t('products.notFound') }), _jsx("div", { className: "empty-state__text", children: t('products.notFoundHint') })] })) : (_jsx("div", { className: s.productsGrid, children: products.map((p) => (_jsx(ProductCard, { product: p, onAdd: () => handleAddToCart(p) }, p._id))) })), totalPages > 1 && (_jsxs("div", { className: "pagination", children: [_jsx("button", { className: "page-btn", disabled: page === 1, onClick: () => setPage(page - 1), children: "\u2039" }), [...Array(totalPages)].map((_, i) => (_jsx("button", { className: `page-btn ${page === i + 1 ? 'active' : ''}`, onClick: () => setPage(i + 1), children: i + 1 }, i))), _jsx("button", { className: "page-btn", disabled: page === totalPages, onClick: () => setPage(page + 1), children: "\u203A" })] }))] }))] }));
}
