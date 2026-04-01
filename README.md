# 🍀 Clover Delivery

Food delivery web app — **Advanced level** (ElifTech School test task).

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 18 · TypeScript · SASS Modules · Vite |
| State | Zustand (cart, toast) |
| i18n | react-i18next · Ukrainian + English |
| Backend | Express · TypeScript · Mongoose |
| Database | MongoDB |

## Features

### Base ✅
- Shops page — browse restaurants, click to open menu
- Add products to cart from any shop
- Cart page — change qty, remove items, form validation
- Submit order → saved to MongoDB

### Middle ✅
- Responsive design (desktop / tablet / mobile)
- Product filtering by category
- Product sorting (price ↑↓, name A→Z)
- Shop filtering by rating range

### Advanced ✅
- Pagination (6 products per page, server-side)
- Order history — search by email or order ID
- Reorder button — re-adds all items from a previous order

### Extras ✅
- 🌙 Dark / Light theme toggle
- 🇺🇦 / 🇬🇧 Language switching (Ukrainian / English) — Nav bar + Profile page
- Promo codes with validation (WELCOME10, UKRAINE50, FREESHIP, NIGHT20, SUMMER15, TRYIT)
- Toast notifications
- Loading skeletons
- Mobile bottom navigation bar

---

## Quick start

### 1. Prerequisites
- Node.js ≥ 18
- MongoDB running locally on `mongodb://localhost:27017`

### 2. Backend

```bash
cd backend
npm install

# copy env and edit if needed
cp .env.example .env

# seed the database (9 restaurants, ~80 dishes, 6 promos)
npm run seed

# start dev server  →  http://localhost:5000
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install

# start dev server  →  http://localhost:5173
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

The Vite dev server proxies `/api/*` → `http://localhost:5000`.

---

## Environment variables (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clover-delivery
CLIENT_URL=http://localhost:5173
```

---

## API Reference

| Method | Path | Description |
|---|---|---|
| GET | `/api/shops` | List all shops |
| GET | `/api/products?shopId=&category=&sort=&page=&limit=` | Paginated products |
| GET | `/api/products/categories/:shopId` | Categories for a shop |
| POST | `/api/orders` | Create order |
| GET | `/api/orders?email=&orderId=` | Search orders |
| GET | `/api/promos` | List active promos |
| POST | `/api/promos/validate` | Validate promo code `{ code, subtotal }` |

---

## Promo codes (seeded)

| Code | Discount | Min order |
|---|---|---|
| `WELCOME10` | 10% | ₴150 |
| `UKRAINE50` | ₴50 | ₴200 |
| `FREESHIP` | Free delivery | ₴300 |
| `NIGHT20` | 20% | ₴100 |
| `SUMMER15` | 15% | ₴80 |
| `TRYIT` | ₴30 | ₴120 |

---

## Project structure

```
clover/
├── backend/
│   └── src/
│       ├── models/index.ts       # Mongoose models
│       ├── routes/               # shops / products / orders / promos
│       ├── index.ts              # Express server
│       └── seed.ts               # DB seed script
└── frontend/
    └── src/
        ├── api/index.ts          # API client + calcSummary
        ├── store/
        │   ├── cartStore.ts      # Zustand cart (persisted)
        │   └── toastStore.ts     # Toast notifications
        ├── i18n/
        │   ├── index.ts          # i18next setup
        │   └── locales/
        │       ├── uk.json       # Ukrainian
        │       └── en.json       # English
        ├── components/           # Nav, ShopCard, ProductCard, CartItem,
        │                         # PromoCard, OrderCard, Toast, Modal
        ├── pages/                # ShopsPage, CartPage, HistoryPage,
        │                         # PromosPage, ProfilePage
        ├── styles/               # _variables, _theme, _mixins, main.scss
        └── types/index.ts        # Shared TypeScript interfaces
```
