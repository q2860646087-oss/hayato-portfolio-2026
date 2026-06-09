import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="page-shell flex flex-col gap-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
      <div>
        <p>{siteConfig.footerTextZh}</p>
        <p className="mt-1 font-en text-xs uppercase tracking-[0.12em]">{siteConfig.footerTextEn}</p>
      </div>
      <div className="flex flex-wrap gap-4">
        {siteConfig.socialLinks.map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
