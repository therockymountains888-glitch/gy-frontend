import Link from "next/link";
import type { PostListItem } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="border-b border-[var(--line)] py-7 first:pt-0">
      <time className="text-sm text-[var(--muted)]">{formatDate(post.published_at)}</time>
      <h2 className="mt-2 font-serif text-2xl leading-snug">
        <Link href={`/post/?slug=${encodeURIComponent(post.slug)}`} className="hover:text-[var(--accent)]">
          {post.title}
        </Link>
      </h2>
      {post.summary ? (
        <p className="mt-2 leading-7 text-[var(--muted)]">{post.summary}</p>
      ) : null}
      {post.tags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
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
    </article>
  );
}
