import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <main className="page-shell section-space">
      <p className="font-en text-xs uppercase tracking-[0.16em] text-muted">404</p>
      <h1 className="mt-4 text-4xl text-primary">{siteConfig.notFoundTitle}</h1>
      <Link href="/" className="button-shell mt-8 px-5 py-3 text-sm font-semibold">
        返回首页
      </Link>
    </main>
  );
}
