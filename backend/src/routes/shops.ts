import { Router, Request, Response } from 'express';
import { Shop } from '../models';

const router = Router();

// GET /api/shops
router.get('/', async (_req: Request, res: Response) => {
  try {
    const shops = await Shop.find().lean();
    res.json(shops);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/shops/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findById(req.params.id).lean();
    if (!shop) return res.status(404).json({ error: 'Not found' });
    res.json(shop);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
