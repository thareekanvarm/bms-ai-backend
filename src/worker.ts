import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { executeFunction } from './controllers/executor.controller';
import { healthCheck } from './controllers/health.controller';
import { authenticateUser } from './middleware/auth';
import { initializeSupabase } from './lib/supabase';

// Create Hono app instance
const app = new Hono();

// Initialize Supabase with environment variables
app.use('*', async (c, next) => {
  // Initialize Supabase client with environment variables
  initializeSupabase(c.env);
  await next();
});

// Apply CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check endpoint
app.get('/health', healthCheck);

// Function execution endpoint with authentication
app.post('/execute', authenticateUser, executeFunction);

// Export the app for Cloudflare Workers
export default app;

