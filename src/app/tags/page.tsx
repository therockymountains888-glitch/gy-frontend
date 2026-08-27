"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTags } from "@/lib/api";
import type { Tag } from "@/lib/types";
import { EmptyState, ErrorState, LoadingState } from "@/components/Status";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getTags()
      .then((data) => {
        if (!cancelled) setTags(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "加载失败");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="text-sm text-[var(--accent)]">目录</p>
      <h1 className="mt-2 font-serif text-4xl">按标签找文章</h1>
      <p className="mt-3 text-[var(--muted)]">点进标签即可筛选对应笔记。</p>
      <div className="mt-10">
        {error ? <ErrorState message={error} /> : null}
        {!error && !tags ? <LoadingState /> : null}
        {tags && tags.length === 0 ? <EmptyState text="还没有标签。" /> : null}
        {tags && tags.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  href={`/posts/?tag=${encodeURIComponent(tag.slug)}`}
                  className="block rounded-xl border border-[var(--line)] bg-white/50 px-4 py-4 hover:border-[var(--accent)]"
                >
                  <span className="font-medium">{tag.name}</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">{tag.slug}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
