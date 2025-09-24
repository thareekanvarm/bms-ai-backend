# Cloudflare Workers Deployment Guide

This guide will help you deploy the BMS AI Backend to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Already installed as a dev dependency
3. **Supabase Project**: Set up your Supabase project and get the credentials

## Setup Steps

### 1. Login to Cloudflare

```bash
pnpm wrangler login
```

This will open a browser window to authenticate with Cloudflare.

### 2. Set Environment Variables

Set your Supabase credentials as secrets in Cloudflare Workers:

```bash
# Set Supabase URL
pnpm wrangler secret put SUPABASE_URL

# Set Supabase Service Role Key (for server-side operations)
pnpm wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# Set Supabase Anon Key (optional, for client-side operations)
pnpm wrangler secret put SUPABASE_ANON_KEY
```

When prompted, enter your actual values:
- `SUPABASE_URL`: Your Supabase project URL (e.g., `https://your-project.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 3. Deploy to Cloudflare Workers

#### Deploy to Staging
```bash
pnpm run deploy:staging
```

#### Deploy to Production
```bash
pnpm run deploy:production
```

### 4. Verify Deployment

After deployment, you can test your endpoints:

```bash
# Health check
curl https://your-worker-name.your-subdomain.workers.dev/health

# Function execution (with authentication)
curl -X POST https://your-worker-name.your-subdomain.workers.dev/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN" \
  -d '{
    "functionString": "function testFunction(params, userSettings) { return { message: \"Hello from Cloudflare Workers!\" }; }",
    "params": {},
    "userSettings": {}
  }'
```

## Development

### Local Development with Wrangler

```bash
# Start local development server
pnpm run dev:worker
```

This will start a local Cloudflare Workers development server at `http://localhost:8787`.

### Environment Variables for Local Development

Create a `.dev.vars` file in your project root for local development:

```bash
# .dev.vars
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Project Structure

- `src/worker.ts` - Main Cloudflare Worker entry point using Hono
- `src/controllers/` - API controllers adapted for Hono
- `src/middleware/` - Authentication middleware for Hono
- `src/services/` - Business logic services
- `wrangler.toml` - Cloudflare Workers configuration
- `package.json` - Updated with Cloudflare-specific scripts

## Key Changes for Cloudflare Workers

1. **Framework**: Migrated from Express to Hono for better Cloudflare Workers compatibility
2. **Worker Service**: Created `cloudflare-worker.service.ts` that uses QuickJS instead of Node.js worker threads
3. **Environment Variables**: Updated to work with Cloudflare Workers environment bindings
4. **TypeScript**: Configured for Cloudflare Workers with proper types

## Monitoring and Logs

View your worker logs:

```bash
# View real-time logs
pnpm wrangler tail

# View logs for specific environment
pnpm wrangler tail --env staging
pnpm wrangler tail --env production
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Found**: Make sure you've set the secrets using `wrangler secret put`
2. **QuickJS Issues**: Ensure the `quickjs-emscripten` package is properly installed
3. **Authentication Errors**: Verify your Supabase credentials and JWT tokens

### Debug Mode

Enable debug logging by setting the `NODE_ENV` to `development` in your environment variables.

## Performance Considerations

- Cloudflare Workers have a 50-second CPU time limit (configured in `wrangler.toml`)
- Function execution is sandboxed using QuickJS for security
- All requests are automatically distributed across Cloudflare's global network

## Security

- All function execution is sandboxed
- Authentication is handled via Supabase JWT tokens
- Environment variables are encrypted and stored securely in Cloudflare Workers

