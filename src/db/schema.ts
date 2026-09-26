import { mysqlTable, varchar, timestamp, float, boolean, int, text } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const categories = mysqlTable('categories', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const menus = mysqlTable('menus', {
  id: varchar('id', { length: 255 }).primaryKey(),
  categoryId: varchar('category_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: float('price').notNull(),
  image: varchar('image', { length: 255 }),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 255 }).primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  customerPhone: varchar('customer_phone', { length: 255 }),
  type: varchar('type', { length: 50 }).notNull(),
  tableNumber: varchar('table_number', { length: 50 }),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  total: float('total').notNull(),
  notes: text('notes'),
  ravapayTransactionId: varchar('ravapay_transaction_id', { length: 255 }),
  ravapayQrUrl: varchar('ravapay_qr_url', { length: 255 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 255 }).primaryKey(),
  orderId: varchar('order_id', { length: 255 }).notNull(),
  menuId: varchar('menu_id', { length: 255 }).notNull(),
  quantity: int('quantity').notNull(),
  price: float('price').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
