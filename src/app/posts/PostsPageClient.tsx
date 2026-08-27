"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PostList } from "@/components/PostList";

export function PostsPageClient() {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") ?? undefined;

  return (
    <div>
      <p className="text-sm text-[var(--accent)]">文章</p>
      <h1 className="mt-2 font-serif text-4xl">
        {tag ? `标签：${tag}` : "全部文章"}
      </h1>
      {tag ? (
        <p className="mt-3 text-sm text-[var(--muted)]">
          <Link href="/posts/" className="text-[var(--accent)] hover:underline">
            查看全部
          </Link>
        </p>
      ) : (
        <p className="mt-3 text-[var(--muted)]">按发布日期从新到旧排列。</p>
      )}
      <div className="mt-10">
        <PostList tag={tag} />
      </div>
    </div>
  );
}
