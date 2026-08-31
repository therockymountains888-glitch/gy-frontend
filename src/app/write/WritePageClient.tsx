"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTags, publishPost } from "@/lib/api";
import type { Tag } from "@/lib/types";

export function WritePageClient() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [tagSlugs, setTagSlugs] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTags()
      .then((data) => {
        if (!cancelled) setTags(data);
      })
      .catch(() => {
        if (!cancelled) setTags([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleTag(next: string) {
    setTagSlugs((current) =>
      current.includes(next) ? current.filter((item) => item !== next) : [...current, next],
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPublishedSlug(null);
    setSubmitting(true);

    try {
      const post = await publishPost({
        password,
        title,
        content,
        slug: slug.trim() || undefined,
        summary: summary.trim() || undefined,
        tagSlugs,
      });
      setPublishedSlug(post.slug);
      setPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-sm text-[var(--accent)]">写笔记</p>
      <h1 className="mt-2 font-serif text-4xl">写一篇 Markdown</h1>
      <p className="mt-3 text-[var(--muted)]">
        标题和正文提交到后端。密码在服务端校验，不会写进前端代码。
      </p>

      {publishedSlug ? (
        <p className="mt-6 rounded-lg border border-[var(--accent)] bg-[var(--chip)] px-4 py-3 text-sm">
          已发布。
          <Link
            href={`/post/?slug=${encodeURIComponent(publishedSlug)}`}
            className="ml-2 text-[var(--accent)] underline"
          >
            打开文章
          </Link>
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-sm font-medium">标题</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 outline-none focus:border-[var(--accent)]"
            maxLength={200}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">URL slug</span>
          <span className="ml-2 text-xs text-[var(--muted)]">英文短横线，留空则自动生成</span>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="handwritten-webpack-tsx"
            className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 outline-none focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">摘要</span>
          <span className="ml-2 text-xs text-[var(--muted)]">可选，默认取正文开头</span>
          <input
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 outline-none focus:border-[var(--accent)]"
            maxLength={200}
          />
        </label>

        {tags.length > 0 ? (
          <fieldset>
            <legend className="text-sm font-medium">标签</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => {
                const checked = tagSlugs.includes(tag.slug);
                return (
                  <label
                    key={tag.slug}
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-xs ${
                      checked
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--chip)] text-[var(--accent)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleTag(tag.slug)}
                    />
                    {tag.name}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">正文（Markdown）</span>
            <button
              type="button"
              onClick={() => setPreview((value) => !value)}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              {preview ? "继续编辑" : "预览"}
            </button>
          </div>
          {preview ? (
            <div className="markdown mt-2 min-h-64 rounded-lg border border-[var(--line)] bg-white/70 px-4 py-3">
              {content.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="text-[var(--muted)]">还没有正文。</p>
              )}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mt-2 min-h-64 w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 font-mono text-sm leading-6 outline-none focus:border-[var(--accent)]"
              required
            />
          )}
        </div>

        <label className="block">
          <span className="text-sm font-medium">发布密码</span>
          <input
            type="password"
            autoComplete="off"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 outline-none focus:border-[var(--accent)]"
            required
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {submitting ? "提交中…" : "提交"}
        </button>
      </form>
    </div>
  );
}
