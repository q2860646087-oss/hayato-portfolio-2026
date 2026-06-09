"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="zh-CN">
      <body>
        <main style={{ minHeight: "100vh", padding: "48px", fontFamily: "sans-serif" }}>
          <p style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>Global Error</p>
          <h1>应用加载失败</h1>
          <p>{error.message}</p>
          <button type="button" onClick={reset}>
            重新加载
          </button>
        </main>
      </body>
    </html>
  );
}
