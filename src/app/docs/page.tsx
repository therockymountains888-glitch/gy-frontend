import type { Metadata } from "next";
import { API_BASES, apiEndpoints, type ApiEndpoint, type ApiField } from "@/lib/apiDocs";

export const metadata: Metadata = {
  title: "接口文档",
};

function MethodBadge({ method }: { method: ApiEndpoint["method"] }) {
  const tone =
    method === "GET"
      ? "bg-[var(--chip)] text-[var(--accent)]"
      : method === "POST"
        ? "bg-[#efe6d8] text-[var(--ink)]"
        : "bg-[var(--ink)] text-[var(--paper)]";

  return (
    <span className={`rounded-md px-2 py-0.5 font-mono text-xs tracking-wide ${tone}`}>
      {method}
    </span>
  );
}

function FieldTable({ title, fields }: { title: string; fields: ApiField[] }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-2 overflow-x-auto rounded-lg border border-[var(--line)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/60 text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2 font-medium">字段</th>
              <th className="px-3 py-2 font-medium">类型</th>
              <th className="px-3 py-2 font-medium">说明</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.name} className="border-t border-[var(--line)]">
                <td className="px-3 py-2 font-mono text-xs">
                  {field.name}
                  {field.required ? <span className="ml-1 text-red-700">*</span> : null}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-[var(--muted)]">{field.type}</td>
                <td className="px-3 py-2 text-[var(--muted)]">{field.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-lg bg-[#1f1a16] px-4 py-3 font-mono text-xs leading-6 text-[#f4efe6]">
      <code>{code}</code>
    </pre>
  );
}

function EndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <article
      id={endpoint.id}
      className="scroll-mt-24 rounded-2xl border border-[var(--line)] bg-white/50 px-5 py-6"
    >
      <div className="flex flex-wrap items-center gap-3">
        <MethodBadge method={endpoint.method} />
        <code className="font-mono text-sm">{endpoint.path}</code>
      </div>
      <h2 className="mt-3 font-serif text-2xl">{endpoint.title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{endpoint.summary}</p>
      {endpoint.auth ? (
        <p className="mt-3 rounded-lg bg-[var(--chip)] px-3 py-2 text-sm text-[var(--accent)]">
          {endpoint.auth}
        </p>
      ) : null}

      {endpoint.params ? <FieldTable title="路径参数" fields={endpoint.params} /> : null}
      {endpoint.query ? <FieldTable title="查询参数" fields={endpoint.query} /> : null}
      {endpoint.body ? <FieldTable title="JSON 请求体" fields={endpoint.body} /> : null}

      <div className="mt-5">
        <h3 className="text-sm font-medium">成功响应 · {endpoint.successStatus}</h3>
        <CodeBlock code={endpoint.successExample} />
      </div>

      {endpoint.errors.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-medium">错误码</h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {endpoint.errors.map((item) => (
              <li key={`${endpoint.id}-${item.status}`}>
                <code className="font-mono text-xs text-[var(--ink)]">{item.status}</code>
                <span className="mx-2">·</span>
                {item.meaning}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5">
        <h3 className="text-sm font-medium">curl</h3>
        <CodeBlock code={endpoint.curl} />
      </div>
    </article>
  );
}

export default function DocsPage() {
  return (
    <div>
      <p className="text-sm text-[var(--accent)]">接口</p>
      <h1 className="mt-2 font-serif text-4xl">gy-backend API</h1>
      <p className="mt-3 leading-7 text-[var(--muted)]">
        前端不直连数据库。浏览器只请求 Express，成功一律{" "}
        <code className="rounded bg-[#efe6d8] px-1.5 py-0.5 font-mono text-sm">{`{ data }`}</code>
        ，失败一律{" "}
        <code className="rounded bg-[#efe6d8] px-1.5 py-0.5 font-mono text-sm">{`{ error }`}</code>
        。
      </p>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white/50 px-5 py-5">
        <h2 className="font-serif text-xl">基址</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div>
            <dt className="text-[var(--muted)]">本地</dt>
            <dd>
              <code className="font-mono">{API_BASES.local}</code>
            </dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">线上</dt>
            <dd>
              <code className="font-mono">{API_BASES.production}</code>
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          CORS 允许 localhost:3000、Cloudflare Pages / Workers、Vercel。发布和编辑需要后端环境变量{" "}
          <code className="font-mono text-xs">PUBLISH_PASSWORD</code>，不要把真实密码写进仓库。
        </p>
      </section>

      <nav className="mt-8">
        <p className="text-sm font-medium">目录</p>
        <ul className="mt-3 space-y-2 text-sm">
          {apiEndpoints.map((endpoint) => (
            <li key={endpoint.id}>
              <a href={`#${endpoint.id}`} className="text-[var(--accent)] hover:underline">
                <span className="font-mono text-xs">{endpoint.method}</span>
                <span className="mx-2">{endpoint.path}</span>
                <span className="text-[var(--muted)]">{endpoint.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-8">
        {apiEndpoints.map((endpoint) => (
          <EndpointCard key={endpoint.id} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
}
