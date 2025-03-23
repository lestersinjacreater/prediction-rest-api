import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import "dotenv/config"
import { logger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { HTTPException } from 'hono/http-exception'
import { rateLimiter } from "hono-rate-limiter";
import { jwt } from 'hono/jwt';
import { readFile } from 'fs/promises';
import { client } from './drizzle/db'  // Import the client

import { userRouter } from './users/user.router'
import { authRouter } from './auth/auth.router'
import { testimonialRouter } from './testimonials/testimonial.router'
import { updateRouter } from './updates/update.router'
import { clientRouter } from './posible clients/posibleclients.router'
import { serviceRouter } from './offerdservices/services.router'
import { productRouter } from './products/product.router';

const app = new Hono()

// change on the middle ware

//CORS middleware
// Add CORS middleware
app.use('/*', cors({
  origin: ['*'], // Your frontend URL
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


// rate limiter
const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // Limit each IP to 10 requests per minute
  standardHeaders: "draft-6",
  keyGenerator: (c) => "<unique_key>",
});

//default routes
app.get('/', async (c) => {
    try {
        let html = await readFile('./index.html', 'utf-8');
        return c.html(html);
    } catch (err:any) {
        return c.text(err.message, 500);
    }
});

// middlewares
app.use(logger())
app.use(csrf())
app.use(trimTrailingSlash())
app.use(limiter)

// JWT Middleware for authentication
app.use('/api/*', jwt({
  secret: process.env.JWT_SECRET as string,
}));

// Routes
app.route("/", userRouter)        // User management
app.route("/", testimonialRouter) // Testimonials management
app.route("/", updateRouter)      // Updates management
app.route("/auth", authRouter)    // Authentication
app.route("/", clientRouter)      // Posible clients
app.route("/", serviceRouter)     // Offered services
app.route("/", productRouter)     // Products

// Default route for unmatched paths
app.all('*', (c) => {
  return c.text('Page not found', 404)
})

// Graceful shutdown
const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await client.end();
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Error handling for uncaught exceptions
process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await client.end();
    process.exit(1);
});

try {
  serve({
    fetch: app.fetch,
    port: Number(process.env.PORT)
  });
  console.log(`Server is running on port ${process.env.PORT}`);
} catch (err: unknown) {
  console.error('Server error:', err);
  process.exit(1);
}