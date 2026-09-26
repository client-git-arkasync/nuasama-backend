import { Hono } from 'hono';
import { getDB } from '../db';
import { orders } from '../db/schema';
import { eq } from 'drizzle-orm';
import process from 'process';

const app = new Hono();

app.post('/ravapay', async (c) => {
  const secret = process.env.RAVAPAY_WEBHOOK_SECRET;
  const signature = c.req.header('x-ravapay-signature');
  const rawBody = await c.req.arrayBuffer();

  if (secret) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const hmac = await crypto.subtle.sign('HMAC', key, rawBody);
    const expected = Array.from(new Uint8Array(hmac)).map(b => b.toString(16).padStart(2, '0')).join('');
    if (expected !== signature) return c.json({ error: 'Invalid signature' }, 401);
  }

  let payload;
  try { payload = JSON.parse(new TextDecoder().decode(rawBody)); }
  catch { return c.json({ error: 'Invalid JSON' }, 400); }

  if (payload.event === 'payment.success') {
    const db = getDB();
    await db.update(orders).set({ status: 'diproses' }).where(eq(orders.ravapayTransactionId, payload.data.transaction_id));
  }

  return c.json({ success: true });
});

export default app;
