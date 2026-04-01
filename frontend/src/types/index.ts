export interface Shop {
  _id: string;
  name: string;
  cuisine: string;
  rating: number;
  time: string;
  emoji: string;
  badge: string | null;
}

export interface Product {
  _id: string;
  shopId: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
  desc: string;
}

export interface CartItem extends Product {
  qty: number;
  shopName: string;
}

export interface Promo {
  _id: string;
  tag: string;
  title: string;
  desc: string;
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  minOrder: number;
  expiry: string;
  banner: string;
  emoji: string;
  active: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  emoji: string;
  price: number;
  qty: number;
}

export interface Order {
  _id: string;
  orderId: string;
  email: string;
  phone: string;
  address: string;
  shopName: string;
  items: OrderItem[];
  promoCode: string | null;
  subtotal: number;
  discount: number;
  delivery: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered';
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}
