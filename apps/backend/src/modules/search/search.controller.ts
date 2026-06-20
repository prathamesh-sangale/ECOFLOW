import { Request, Response } from 'express';
import prisma from '../../utils/prisma';

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return res.json({ results: [] });
    }

    const searchTerm = `%${query}%`;

    const [products, boms, ecos, users] = await Promise.all([
      prisma.product.findMany({
        where: { OR: [{ product_name: { contains: query, mode: 'insensitive' } }, { product_code: { contains: query, mode: 'insensitive' } }] },
        take: 5
      }),
      prisma.bOM.findMany({
        where: { OR: [{ bom_name: { contains: query, mode: 'insensitive' } }, { bom_code: { contains: query, mode: 'insensitive' } }] },
        take: 5
      }),
      prisma.eCO.findMany({
        where: { OR: [{ title: { contains: query, mode: 'insensitive' } }, { eco_number: { contains: query, mode: 'insensitive' } }] },
        take: 5
      }),
      prisma.user.findMany({
        where: { OR: [{ full_name: { contains: query, mode: 'insensitive' } }, { email: { contains: query, mode: 'insensitive' } }] },
        take: 5
      })
    ]);

    const results = [
      ...products.map(p => ({ type: 'Product', id: p.id, title: p.product_name, subtitle: p.product_code, link: `/products/${p.id}` })),
      ...boms.map(b => ({ type: 'BOM', id: b.id, title: b.bom_name, subtitle: b.bom_code, link: `/boms/${b.id}` })),
      ...ecos.map(e => ({ type: 'ECO', id: e.id, title: e.title, subtitle: e.eco_number, link: `/ecos/${e.id}` })),
      ...users.map(u => ({ type: 'User', id: u.id, title: u.full_name, subtitle: u.email, link: `/admin/users` }))
    ];

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};
