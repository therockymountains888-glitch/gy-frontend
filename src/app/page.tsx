import { PostList } from "@/components/PostList";

export default function Home() {
  return (
    <div>
      <p className="text-sm tracking-[0.2em] text-[var(--accent)]">LEARNING NOTES</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight">把学过的东西记下来</h1>
      <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">
        这是郭扬的私人学习站。文章按日期排列，也可以从目录按标签找。
      </p>
      <section className="mt-12">
        <h2 className="mb-6 font-serif text-2xl">最近文章</h2>
        <PostList limit={5} emptyText="还没有发布文章。先启动后端并在 Supabase 写入种子数据。" />
      </section>
    </div>
  );
}
