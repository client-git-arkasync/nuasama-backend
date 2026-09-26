import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import process from 'process';

let pool: mysql.Pool;

export function getDB() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 10000,      // 10s timeout koneksi
      acquireTimeout: 10000,      // 10s timeout acquire
      idleTimeout: 30000,         // tutup koneksi idle setelah 30s
    });
  }
  return drizzle(pool);
}
