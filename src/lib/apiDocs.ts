export const API_BASES = {
  local: "http://localhost:3001",
  production: "https://gy-backend-sigma.vercel.app",
};

export type ApiField = {
  name: string;
  type: string;
  required?: boolean;
  note: string;
};

export type ApiEndpoint = {
  id: string;
  method: "GET" | "POST" | "PUT";
  path: string;
  title: string;
  summary: string;
  auth?: string;
  query?: ApiField[];
  params?: ApiField[];
  body?: ApiField[];
  successStatus: number;
  successExample: string;
  errors: { status: number; meaning: string }[];
  curl: string;
};

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "health",
    method: "GET",
    path: "/api/health",
    title: "健康检查",
    summary: "确认 Express 进程活着。不读数据库。",
    successStatus: 200,
    successExample: `{
  "data": {
    "ok": true,
    "time": "2026-08-31T14:00:00.000Z"
  }
}`,
    errors: [],
    curl: `curl ${API_BASES.local}/api/health`,
  },
  {
    id: "posts-list",
    method: "GET",
    path: "/api/posts",
    title: "文章列表",
    summary: "按发布时间从新到旧返回已发布文章。卡片展示 title、summary、tags，不含 content。",
    query: [
      {
        name: "tag",
        type: "string",
        note: "标签 slug，例如 frontend。不传则返回全部。",
      },
    ],
    successStatus: 200,
    successExample: `{
  "data": [
    {
      "id": "aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
      "slug": "hello-gy-notes",
      "title": "从这里开始记笔记",
      "summary": "这个站点用来记录学习过程…",
      "published_at": "2026-08-20T02:00:00.000Z",
      "tags": [{ "slug": "notes", "name": "学习笔记" }]
    }
  ]
}`,
    errors: [{ status: 500, meaning: "查询失败或 Supabase 未配置" }],
    curl: `curl "${API_BASES.local}/api/posts"
curl "${API_BASES.local}/api/posts?tag=frontend"`,
  },
  {
    id: "posts-detail",
    method: "GET",
    path: "/api/posts/:slug",
    title: "文章详情",
    summary: "按 slug 取一篇已发布文章，包含 Markdown 正文。",
    params: [{ name: "slug", type: "string", required: true, note: "文章 URL 片段，例如 hello-gy-notes" }],
    successStatus: 200,
    successExample: `{
  "data": {
    "id": "aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    "slug": "hello-gy-notes",
    "title": "从这里开始记笔记",
    "summary": "这个站点用来记录学习过程…",
    "content": "# 从这里开始记笔记\\n\\n这是第一篇示例文章。",
    "published_at": "2026-08-20T02:00:00.000Z",
    "tags": [{ "slug": "notes", "name": "学习笔记" }]
  }
}`,
    errors: [
      { status: 404, meaning: "slug 不存在，或尚未发布" },
      { status: 500, meaning: "查询失败" },
    ],
    curl: `curl "${API_BASES.local}/api/posts/hello-gy-notes"`,
  },
  {
    id: "posts-create",
    method: "POST",
    path: "/api/posts",
    title: "发布文章",
    summary: "写作页提交新文章。密码只在后端校验。发布时间取服务器当前时间。",
    auth: "请求体 password 必须等于服务端 PUBLISH_PASSWORD。",
    body: [
      { name: "password", type: "string", required: true, note: "发布密码，对应后端环境变量，不要写进前端代码" },
      { name: "title", type: "string", required: true, note: "标题，最多 200 字" },
      { name: "content", type: "string", required: true, note: "Markdown 正文，最多 10 万字" },
      { name: "slug", type: "string", note: "英文短横线。留空则从标题或时间生成" },
      { name: "summary", type: "string", note: "列表摘要。不传则按正文截取。编辑时若未改摘要，前端不传此项，后端按新正文重算" },
      { name: "tagSlugs", type: "string[]", note: "已有标签 slug，最多 10 个。未知 slug 会 400" },
    ],
    successStatus: 201,
    successExample: `{
  "data": {
    "id": "…",
    "slug": "how-to-write-markdown",
    "title": "Markdown 文章怎么写",
    "summary": "…",
    "content": "## 今天记住一件事\\n",
    "published_at": "2026-08-31T14:40:00.000Z",
    "tags": [{ "slug": "notes", "name": "学习笔记" }]
  }
}`,
    errors: [
      { status: 400, meaning: "缺标题/正文、slug 不合法、未知标签" },
      { status: 401, meaning: "密码错误" },
      { status: 409, meaning: "slug 已被占用" },
      { status: 500, meaning: "写入失败" },
      { status: 503, meaning: "未配置 PUBLISH_PASSWORD" },
    ],
    curl: `curl -X POST ${API_BASES.local}/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{
    "password": "<PUBLISH_PASSWORD>",
    "title": "Markdown 文章怎么写",
    "content": "## 标题从二级开始\\n\\n正文。",
    "slug": "how-to-write-markdown",
    "tagSlugs": ["notes"]
  }'`,
  },
  {
    id: "posts-update",
    method: "PUT",
    path: "/api/posts/:slug",
    title: "编辑文章",
    summary: "按现有 slug 更新标题、正文、摘要、标签。不改发布时间。标签会整表替换。",
    auth: "与发布相同，请求体带 password。",
    params: [{ name: "slug", type: "string", required: true, note: "当前文章地址，不是改完之后的新 slug" }],
    body: [
      { name: "password", type: "string", required: true, note: "发布密码" },
      { name: "title", type: "string", required: true, note: "标题" },
      { name: "content", type: "string", required: true, note: "Markdown 正文" },
      { name: "slug", type: "string", note: "若填写且与原值不同，文章地址会换掉" },
      { name: "summary", type: "string", note: "列表摘要。不传则按新正文重算；传入则覆盖。详情页仍用 content" },
      { name: "tagSlugs", type: "string[]", note: "保存后只保留这些标签" },
    ],
    successStatus: 200,
    successExample: `{
  "data": {
    "slug": "hello-gy-notes",
    "title": "从这里开始记笔记",
    "content": "…",
    "published_at": "2026-08-20T02:00:00.000Z",
    "tags": [{ "slug": "frontend", "name": "前端" }]
  }
}`,
    errors: [
      { status: 400, meaning: "字段不合法或未知标签" },
      { status: 401, meaning: "密码错误" },
      { status: 404, meaning: "原 slug 不存在" },
      { status: 409, meaning: "新 slug 已被占用" },
      { status: 503, meaning: "未配置 PUBLISH_PASSWORD" },
    ],
    curl: `curl -X PUT ${API_BASES.local}/api/posts/hello-gy-notes \\
  -H "Content-Type: application/json" \\
  -d '{
    "password": "<PUBLISH_PASSWORD>",
    "title": "从这里开始记笔记",
    "content": "# 更新后的正文\\n",
    "slug": "hello-gy-notes",
    "tagSlugs": ["notes", "frontend"]
  }'`,
  },
  {
    id: "tags-list",
    method: "GET",
    path: "/api/tags",
    title: "标签列表",
    summary: "返回全部标签，按名称排序。写作页勾选标签用这个接口。",
    successStatus: 200,
    successExample: `{
  "data": [
    { "slug": "backend", "name": "后端" },
    { "slug": "frontend", "name": "前端" }
  ]
}`,
    errors: [{ status: 500, meaning: "查询失败" }],
    curl: `curl ${API_BASES.local}/api/tags`,
  },
];
