import { Router, Request, Response } from 'express';
import { Product } from '../models';

const router = Router();

// GET /api/products?shopId=&category=&sort=&page=&limit=
router.get('/', async (req: Request, res: Response) => {
  try {
    const { shopId, category, sort, page = '1', limit = '6' } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};
    if (shopId)   filter.shopId   = shopId;
    if (category) filter.category = category;

    let query = Product.find(filter);

    if (sort === 'price-asc')  query = query.sort({ price:  1 });
    if (sort === 'price-desc') query = query.sort({ price: -1 });
    if (sort === 'name-az')    query = query.sort({ name:   1 });

    const total = await Product.countDocuments(filter);
    const pageNum  = parseInt(page,  10);
    const limitNum = parseInt(limit, 10);

    const products = await query
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/categories/:shopId
router.get('/categories/:shopId', async (req: Request, res: Response) => {
  try {
    const cats = await Product.distinct('category', { shopId: req.params.shopId });
    res.json(cats);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
