"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="page-shell section-space">
      <p className="font-en text-xs uppercase tracking-[0.16em] text-muted">Error</p>
      <h1 className="mt-4 text-4xl text-primary">页面加载失败</h1>
      <p className="mt-4 max-w-2xl text-muted">{error.message}</p>
      <button type="button" className="button-shell mt-8 px-5 py-3 text-sm font-semibold" onClick={reset}>
        重新加载
      </button>
    </main>
  );
}
