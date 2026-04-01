import mongoose, { Schema, Document } from 'mongoose';

// ── Shop ──────────────────────────────────────
export interface IShop extends Document {
  name: string;
  cuisine: string;
  rating: number;
  time: string;
  emoji: string;
  badge: string | null;
}

const ShopSchema = new Schema<IShop>({
  name:    { type: String, required: true },
  cuisine: { type: String, required: true },
  rating:  { type: Number, required: true },
  time:    { type: String, required: true },
  emoji:   { type: String, required: true },
  badge:   { type: String, default: null },
});

export const Shop = mongoose.model<IShop>('Shop', ShopSchema);

// ── Product ───────────────────────────────────
export interface IProduct extends Document {
  shopId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  emoji: string;
  desc: string;
}

const ProductSchema = new Schema<IProduct>({
  shopId:   { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  name:     { type: String, required: true },
  category: { type: String, required: true },
  price:    { type: Number, required: true },
  emoji:    { type: String, required: true },
  desc:     { type: String, required: true },
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

// ── Order ─────────────────────────────────────
export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  emoji: string;
  price: number;
  qty: number;
}

export interface IOrder extends Document {
  orderId: string;
  email: string;
  phone: string;
  address: string;
  shopName: string;
  items: IOrderItem[];
  promoCode: string | null;
  subtotal: number;
  discount: number;
  delivery: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered';
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  emoji:     { type: String, required: true },
  price:     { type: Number, required: true },
  qty:       { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId:   { type: String, required: true, unique: true },
    email:     { type: String, required: true },
    phone:     { type: String, required: true },
    address:   { type: String, required: true },
    shopName:  { type: String, required: true },
    items:     [OrderItemSchema],
    promoCode: { type: String, default: null },
    subtotal:  { type: Number, required: true },
    discount:  { type: Number, default: 0 },
    delivery:  { type: Number, required: true },
    tax:       { type: Number, required: true },
    total:     { type: Number, required: true },
    status:    { type: String, enum: ['pending', 'preparing', 'delivering', 'delivered'], default: 'pending' },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

// ── Promo ─────────────────────────────────────
export interface IPromo extends Document {
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

const PromoSchema = new Schema<IPromo>({
  tag:      { type: String, required: true },
  title:    { type: String, required: true },
  desc:     { type: String, required: true },
  code:     { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  type:     { type: String, enum: ['percent', 'fixed'], required: true },
  minOrder: { type: Number, required: true },
  expiry:   { type: String, required: true },
  banner:   { type: String, required: true },
  emoji:    { type: String, required: true },
  active:   { type: Boolean, default: true },
});

export const Promo = mongoose.model<IPromo>('Promo', PromoSchema);
