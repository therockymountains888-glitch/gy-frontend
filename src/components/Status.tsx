export function LoadingState({ text = "加载中…" }: { text?: string }) {
  return <p className="text-[var(--muted)]">{text}</p>;
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
      <p className="mt-2 text-red-700/80">
        请确认后端已启动，且 <code>NEXT_PUBLIC_API_URL</code> 指向正确地址。
      </p>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <p className="text-[var(--muted)]">{text}</p>;
}
