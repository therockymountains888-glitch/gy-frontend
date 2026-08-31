import Link from "next/link";

const nav = [
  { href: "/", label: "首页" },
  { href: "/posts/", label: "文章" },
  { href: "/tags/", label: "目录" },
  { href: "/docs/", label: "接口" },
  { href: "/write/", label: "写笔记" },
];

export function Header() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" className="font-serif text-lg tracking-wide text-[var(--ink)]">
          郭扬的笔记
        </Link>
        <nav className="flex gap-5 text-sm text-[var(--muted)]">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--accent)]">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
