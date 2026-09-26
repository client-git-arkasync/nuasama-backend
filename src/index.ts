import { Hono } from 'hono';
import { cors } from 'hono/cors';

import menuRouter from './modules/menu';

const app = new Hono();

// CORS Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['https://nuasama-frontend.pages.dev', 'http://localhost:3000'];

app.use('*', cors({
  origin: (origin) => {
    if (!origin || allowedOrigins.includes(origin)) return origin;
    return null;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


// Health check
app.get('/', (c) => {
  return c.json({
    message: 'Nuasama API (Hono + Node.js/Vercel + MySQL Hostinger)',
    status: 'ok',
  });
});

// Routes
// app.route('/auth', authRouter); // TODO: rewrite to match Go
app.route('/menu', menuRouter);
// app.route('/categories', categoryRouter); // DELETED in Go
// app.route('/orders', orderRouter); // TODO: rewrite to match Go
// app.route('/webhook', webhookRouter); // TODO: rewrite to match Go

export default app;
