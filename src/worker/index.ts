import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();
const api = app.basePath("/vite");

api.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;
