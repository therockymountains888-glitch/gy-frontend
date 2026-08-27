"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/lib/api";
import type { PostListItem } from "@/lib/types";
import { PostCard } from "@/components/PostCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/Status";

export function PostList({
  tag,
  limit,
  emptyText = "暂时还没有文章。",
}: {
  tag?: string;
  limit?: number;
  emptyText?: string;
}) {
  const [posts, setPosts] = useState<PostListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getPosts(tag)
      .then((data) => {
        if (!cancelled) setPosts(limit ? data.slice(0, limit) : data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "加载失败");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tag, limit]);

  if (error) return <ErrorState message={error} />;
  if (!posts) return <LoadingState />;
  if (posts.length === 0) return <EmptyState text={emptyText} />;

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
