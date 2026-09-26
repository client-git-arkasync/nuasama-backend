import { Hono } from 'hono';
import { getDB } from '../db';
import { menuItems, dapurs } from '../db/schema';
import { eq, like, and, sql } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono();

app.get('/', async (c) => {
  const db = getDB();
  const search = c.req.query('search');
  const category = c.req.query('category');
  
  let conditions = [eq(menuItems.stockStatus, 'aktif')];
  
  if (category) {
    conditions.push(eq(menuItems.category, category));
  }
  if (search) {
    conditions.push(like(menuItems.name, `%${search}%`));
  }
  
  const whereClause = and(...conditions);
  
  const result = await db.select({
    id: menuItems.id,
    name: menuItems.name,
    description: menuItems.description,
    price: menuItems.price,
    photoUrl: menuItems.photoUrl,
    category: menuItems.category,
    stockStatus: menuItems.stockStatus,
    dapurId: menuItems.dapurId,
    dapurName: dapurs.name,
    dapurLogoUrl: dapurs.logoUrl,
  }).from(menuItems)
    .leftJoin(dapurs, eq(menuItems.dapurId, dapurs.id))
    .where(whereClause);
    
  // Mock total for now based on result length
  const total = result.length;
  
  return c.json({ items: result, total });
});

export default app;
