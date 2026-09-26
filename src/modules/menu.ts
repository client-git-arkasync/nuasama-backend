import { Hono } from 'hono';
import { getDB } from '../db';
import { menus } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono();

app.get('/', async (c) => {
  const db = getDB();
  const result = await db.select({
    id: menus.id,
    name: menus.name,
    description: menus.description,
    price: menus.price,
    image: menus.photoUrl,
    category: menus.category,
    is_available: menus.stockStatus,
    dapur_id: menus.dapurId,
  }).from(menus).where(eq(menus.stockStatus, 'aktif'));
  
  return c.json({ data: result });
});

const menuSchema = z.object({
  name: z.string().min(1), category_id: z.string().min(1),
  price: z.number().min(0), description: z.string().optional(), image: z.string().optional(),
});

app.post('/', zValidator('json', menuSchema), async (c) => {
  const body = c.req.valid('json');
  const db = getDB();
  const id = crypto.randomUUID();
  await db.insert(menus).values({ id, categoryId: body.category_id, name: body.name, description: body.description || null, price: body.price, image: body.image || null, isAvailable: true });
  const [m] = await db.select().from(menus).where(eq(menus.id, id));
  return c.json({ data: m }, 201);
});

app.put('/:id', zValidator('json', menuSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const db = getDB();
  await db.update(menus).set({
    ...(body.name && { name: body.name }),
    ...(body.category_id && { categoryId: body.category_id }),
    ...(body.price !== undefined && { price: body.price }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.image !== undefined && { image: body.image }),
  }).where(eq(menus.id, id));
  const [updated] = await db.select().from(menus).where(eq(menus.id, id));
  return c.json({ data: updated });
});

app.delete('/:id', async (c) => {
  const db = getDB();
  await db.delete(menus).where(eq(menus.id, c.req.param('id')));
  return c.json({ message: 'Menu deleted' });
});

export default app;
