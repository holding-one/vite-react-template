import { Hono } from "hono";

interface EnvWithAssets extends Env {
	ASSETS: Fetcher;
}

const app = new Hono<{ Bindings: EnvWithAssets }>();

// API 接口处理
app.get("/vite/api/", (c) => c.json({ name: "Cloudflare" }));
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// 静态资源及页面兜底逻辑：剥离 /vite 前缀并调用 ASSETS 绑定
app.all("*", async (c) => {
	const url = new URL(c.req.url);
	if (url.pathname.startsWith("/vite")) {
		url.pathname = url.pathname.replace(/^\/vite/, "") || "/";
	}
	if (c.env?.ASSETS) {
		return c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
	}
	return c.text("Not Found", 404);
});

export default app;
