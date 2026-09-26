import { serve } from '@hono/node-server';
import app from './index';
import 'dotenv/config';
import process from 'process';

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
