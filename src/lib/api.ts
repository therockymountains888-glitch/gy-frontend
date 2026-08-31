import type { Post, PostListItem, Tag } from "./types";

const PRODUCTION_API = "https://gy-backend-sigma.vercel.app";

function getApiUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ?? "";

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      if (!fromEnv || fromEnv.includes("localhost")) {
        return PRODUCTION_API;
      }
    }
  }

  return fromEnv || "http://localhost:3001";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiUrl()}${path}`;

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error(`无法连接 API：${url}`);
  }

  if (!response) {
    throw new Error(`API 无响应：${url}`);
  }

  const payload = (await response.json().catch(() => null)) as
    | { data?: T; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? `请求失败（${response.status}）`);
  }

  if (!payload || !("data" in payload) || payload.data === undefined) {
    throw new Error("接口返回格式不正确");
  }

  return payload.data;
}

export function getPosts(tag?: string) {
  const query = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  return request<PostListItem[]>(`/api/posts${query}`);
}

export function getPost(slug: string) {
  return request<Post>(`/api/posts/${encodeURIComponent(slug)}`);
}

export function getTags() {
  return request<Tag[]>("/api/tags");
}

export function publishPost(input: {
  password: string;
  title: string;
  content: string;
  slug?: string;
  summary?: string;
  tagSlugs?: string[];
}) {
  return request<Post>("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
