import { Router, Request, Response } from 'express';
import { Promo } from '../models';

const router = Router();

// GET /api/promos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const promos = await Promo.find({ active: true }).lean();
    res.json(promos);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/promos/validate
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body as { code: string; subtotal: number };
    const promo = await Promo.findOne({ code: code.toUpperCase(), active: true }).lean();
    if (!promo) return res.status(404).json({ error: 'Promo not found' });
    if (subtotal < promo.minOrder) return res.status(400).json({ error: 'min_order', minOrder: promo.minOrder });
    res.json(promo);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
