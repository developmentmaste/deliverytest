import { Router, Request, Response } from 'express';
import { Order } from '../models';

const router = Router();

// POST /api/orders
router.post('/', async (req: Request, res: Response) => {
  try {
    const orderId = '#ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const order = await Order.create({ ...req.body, orderId });
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders?email=&orderId=
router.get('/', async (req: Request, res: Response) => {
  try {
    const { email, orderId } = req.query as Record<string, string>;
    if (!email && !orderId) return res.status(400).json({ error: 'Provide email or orderId' });

    const orClauses: object[] = [];
    if (email)   orClauses.push({ email:   { $regex: new RegExp(`^${email}$`, 'i') } });
    if (orderId) orClauses.push({ orderId: { $regex: new RegExp(orderId,      'i') } });

    const orders = await Order.find({ $or: orClauses }).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
