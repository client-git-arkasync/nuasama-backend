import { Hono } from 'hono';
import { cors } from 'hono/cors';

import authRouter from './modules/auth';
import menuRouter from './modules/menu';
import categoryRouter from './modules/category';
import orderRouter from './modules/order';
import webhookRouter from './modules/webhook';

const app = new Hono();

// CORS Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'Nuasama API (Hono + Node.js/Vercel + MySQL Hostinger)',
    status: 'ok',
  });
});

// Routes
app.route('/auth', authRouter);
app.route('/menu', menuRouter);
app.route('/categories', categoryRouter);
app.route('/orders', orderRouter);
app.route('/webhook', webhookRouter);

export default app;
