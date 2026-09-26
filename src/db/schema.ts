import { mysqlTable, varchar, timestamp, float, int, text } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 50 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const dapurs = mysqlTable('dapurs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  logoUrl: varchar('logo_url', { length: 500 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const menuItems = mysqlTable('menu_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: float('price').notNull(),
  photoUrl: varchar('photo_url', { length: 500 }),
  category: varchar('category', { length: 255 }).notNull(),
  stockStatus: varchar('stock_status', { length: 20 }).default('aktif').notNull(),
  dapurId: varchar('dapur_id', { length: 36 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const cartItems = mysqlTable('cart_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  menuItemId: varchar('menu_item_id', { length: 36 }).notNull(),
  qty: int('qty').notNull().default(1),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  orderType: varchar('order_type', { length: 20 }).notNull(),
  dineInDate: timestamp('dine_in_date'),
  dineInTime: varchar('dine_in_time', { length: 10 }),
  totalPrice: float('total_price').notNull(),
  status: varchar('status', { length: 30 }).default('menunggu_pembayaran').notNull(),
  paymentProofUrl: varchar('payment_proof_url', { length: 500 }),
  ravapayTransactionId: varchar('ravapay_transaction_id', { length: 255 }),
  ravapayQrUrl: varchar('ravapay_qr_url', { length: 500 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  menuItemId: varchar('menu_item_id', { length: 36 }).notNull(),
  qty: int('qty').notNull(),
  priceAtOrder: float('price_at_order').notNull(),
});

export const paymentVerifications = mysqlTable('payment_verifications', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  adminId: varchar('admin_id', { length: 36 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});
