import type { Post, PostListItem, Tag } from "./types";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
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
