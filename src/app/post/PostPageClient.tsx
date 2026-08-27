"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";
import { ErrorState, LoadingState } from "@/components/Status";

export function PostPageClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("缺少文章参数");
      return;
    }

    let cancelled = false;
    setPost(null);
    setError(null);

    getPost(slug)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "加载失败");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <div>
        <ErrorState message={error} />
        <p className="mt-6">
          <Link href="/posts/" className="text-[var(--accent)] hover:underline">
            返回文章列表
          </Link>
        </p>
      </div>
    );
  }

  if (!post) return <LoadingState />;

  return (
    <article>
      <p className="text-sm text-[var(--muted)]">
        <Link href="/posts/" className="hover:text-[var(--accent)]">
          文章
        </Link>
        <span className="mx-2">/</span>
        {formatDate(post.published_at)}
      </p>
      <h1 className="mt-4 font-serif text-4xl leading-tight">{post.title}</h1>
      {post.tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`/posts/?tag=${encodeURIComponent(tag.slug)}`}
                className="rounded-full bg-[var(--chip)] px-2.5 py-1 text-xs text-[var(--accent)]"
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="markdown mt-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
