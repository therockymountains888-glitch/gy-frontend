# gy-frontend

郭扬用来学习和记录的私人站点。Next.js 静态前端，数据来自独立的 `gy-backend`。

## 本地开发

1. 先启动 [gy-backend](../gy-backend)（默认 `http://localhost:3001`）。
2. 复制环境变量并安装依赖：

```bash
cp .env.example .env.local
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。

## 构建

```bash
npm run build
```

产物在 `out/`，可直接放到 Cloudflare Pages。

## 部署到 Cloudflare Pages

这个项目是 **静态导出**（`output: "export"`）。

在项目 **Settings → Build**：

- Framework preset：**None**（不要选 Next.js，否则会跑 OpenNext）
- Build command：`npm run build`
- Deploy command 若由系统自动跑 `wrangler deploy`，保持即可；`wrangler.toml` 已指向 `./out`
- Environment variable：
  - `NEXT_PUBLIC_API_URL` = `https://gy-backend-sigma.vercel.app`

改这个变量后需要重新构建前端。

## 和后端的约定

前端只请求：

- `GET /api/posts`
- `GET /api/posts?tag=`
- `GET /api/posts/:slug`
- `GET /api/tags`

文章详情使用 `/post/?slug=`，以便静态导出后仍能打开任意 slug。
