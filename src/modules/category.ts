import { Hono } from 'hono';
import { getDB } from '../db';
import { categories } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono();

app.get('/', async (c) => {
  const db = getDB();
  const result = await db.select().from(categories);
  return c.json({ data: result });
});

const createCategorySchema = z.object({
  name: z.string().min(1),
});

app.post('/', zValidator('json', createCategorySchema), async (c) => {
  const body = c.req.valid('json');
  const db = getDB();
  const id = crypto.randomUUID();
  await db.insert(categories).values({ id, name: body.name });
  const [newCat] = await db.select().from(categories).where(eq(categories.id, id));
  return c.json({ data: newCat }, 201);
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const db = getDB();
  await db.delete(categories).where(eq(categories.id, id));
  return c.json({ message: 'Category deleted successfully' });
});

export default app;
