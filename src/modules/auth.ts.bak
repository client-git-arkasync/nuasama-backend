import { Hono } from 'hono';
import { getDB } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sign } from 'hono/jwt';
import process from 'process';

const app = new Hono();

async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

app.post('/login', zValidator('json', z.object({ username: z.string().min(1), password: z.string().min(1) })), async (c) => {
  const { username, password } = c.req.valid('json');
  const db = getDB();
  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user || user.passwordHash !== await hashPassword(password)) return c.json({ error: 'Invalid credentials' }, 401);
  const token = await sign({ id: user.id, username: user.username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, process.env.JWT_SECRET!);
  return c.json({ data: { token, user: { id: user.id, username: user.username } } });
});

export default app;
