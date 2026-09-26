import { Hono } from 'hono';
import { getDB } from '../db';
import { orders, orderItems, menus } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import process from 'process';

const app = new Hono();

app.get('/', async (c) => {
  const db = getDB();
  const result = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return c.json({ data: result });
});

app.get('/:id/payment-info', async (c) => {
  const db = getDB();
  const [order] = await db.select().from(orders).where(eq(orders.id, c.req.param('id')));
  if (!order) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: { order_id: order.id, payment_method: order.paymentMethod, total: order.total, qris_url: order.ravapayQrUrl, transaction_id: order.ravapayTransactionId, status: order.status } });
});

app.get('/:id', async (c) => {
  const db = getDB();
  const [order] = await db.select().from(orders).where(eq(orders.id, c.req.param('id')));
  if (!order) return c.json({ error: 'Not found' }, 404);
  const items = await db.select({ id: orderItems.id, quantity: orderItems.quantity, price: orderItems.price, notes: orderItems.notes, menu: { id: menus.id, name: menus.name, image: menus.image } }).from(orderItems).leftJoin(menus, eq(orderItems.menuId, menus.id)).where(eq(orderItems.orderId, order.id));
  return c.json({ data: { ...order, items } });
});

const createOrderSchema = z.object({
  customer_name: z.string().min(1), customer_email: z.string().optional(), customer_phone: z.string().optional(),
  type: z.string().min(1), table_number: z.string().optional(), payment_method: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(z.object({ menu_id: z.string(), quantity: z.number().min(1), price: z.number().min(0), notes: z.string().optional() })).min(1),
});

app.post('/', zValidator('json', createOrderSchema), async (c) => {
  const body = c.req.valid('json');
  const db = getDB();
  const orderId = crypto.randomUUID();
  const total = body.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let status = body.payment_method === 'qris' ? 'menunggu_pembayaran' : body.payment_method === 'tunai' ? 'diproses' : 'menunggu_verifikasi';
  let ravapayTxId = null, ravapayQrUrl = null;

  if (body.payment_method === 'qris') {
    const res = await fetch('https://api.ravapay.site/create', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.RAVAPAY_API_KEY! }, body: JSON.stringify({ provider: 'gopay', amount: Math.round(total), description: `Order ${orderId}` }) });
    if (res.ok) { const d = await res.json() as any; if (d.success && d.data) { ravapayTxId = d.data.transaction_id; ravapayQrUrl = d.data.qr_url; } }
  }

  await db.insert(orders).values({ id: orderId, customerName: body.customer_name, customerEmail: body.customer_email || null, customerPhone: body.customer_phone || null, type: body.type, tableNumber: body.table_number || null, paymentMethod: body.payment_method, status, total, notes: body.notes || null, ravapayTransactionId: ravapayTxId, ravapayQrUrl });
  for (const item of body.items) await db.insert(orderItems).values({ id: crypto.randomUUID(), orderId, menuId: item.menu_id, quantity: item.quantity, price: item.price, notes: item.notes || null });
  const [newOrder] = await db.select().from(orders).where(eq(orders.id, orderId));
  return c.json({ data: newOrder }, 201);
});

app.put('/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status } = await c.req.json<{ status: string }>();
  const db = getDB();
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  const [updated] = await db.select().from(orders).where(eq(orders.id, id));
  return c.json({ data: updated });
});

export default app;
