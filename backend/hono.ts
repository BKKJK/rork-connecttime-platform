import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { authRoutes } from "./routes/auth";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors({
  origin: (origin) => {
    console.log('CORS origin:', origin);
    return origin || "*";
  },
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Add request logging
app.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});

// Mount auth routes
app.route("/auth", authRoutes);

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/trpc",
    router: appRouter,
    createContext,
  })
);

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "ConnectTime API is running", timestamp: new Date().toISOString() });
});

// Catch-all for debugging
app.all("*", (c) => {
  console.log(`Unhandled route: ${c.req.method} ${c.req.url}`);
  return c.json({ error: "Route not found", path: c.req.url }, 404);
});

export default app;