"use client";

import { useEffect, useState } from "react";
import { ManagedImage } from "@/components/ManagedImage";
import { siteConfig } from "@/config/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(siteConfig.navigation[0]?.href ?? "#about");

  useEffect(() => {
    const sections = siteConfig.navigation
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      {
        rootMargin: "-42% 0px -45% 0px",
        threshold: [0.12, 0.3, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed left-0 right-0 top-4 z-[100] px-0 md:top-5">
      <div className="nav-shell mx-auto flex items-center justify-between gap-3 backdrop-blur-md">
        <a href="#cover" className="flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="nav-logo-box">
            <ManagedImage
              src={siteConfig.logo.image}
              alt={`${siteConfig.siteName} logo`}
              placeholder="P"
              className="h-full w-full"
              imageClassName="p-1.5"
              shape="rounded"
              fit="contain"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{siteConfig.authorName}</span>
            <span className="block truncate font-en text-xs uppercase tracking-[0.14em] text-muted">
              {siteConfig.authorNameEn}
            </span>
          </span>
        </a>

        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius)] bg-tape md:hidden"
          aria-label={isOpen ? "关闭导航" : "打开导航"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="grid gap-1">
            <span className="h-0.5 w-5 bg-text" />
            <span className="h-0.5 w-5 bg-text" />
          </span>
        </button>

        <nav
          className={`mobile-nav-menu absolute left-[5vw] right-[5vw] top-[72px] z-[60] grid gap-2 rounded-[var(--radius)] bg-background p-3 text-primary backdrop-blur-md md:static md:z-auto md:flex md:bg-transparent md:p-0 ${
            isOpen ? "grid" : "hidden md:flex"
          }`}
          aria-label="主导航"
        >
          {siteConfig.navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link rounded-[var(--radius)] px-3 py-2 text-sm transition-colors md:px-4 md:py-2 ${
                activeHref === item.href ? "is-active text-primary" : "text-muted"
              }`}
              aria-current={activeHref === item.href ? "true" : undefined}
              onClick={() => {
                setActiveHref(item.href);
                setIsOpen(false);
              }}
            >
              <span className="font-semibold">{item.labelZh}</span>
              <span className="ml-2 font-en text-xs uppercase tracking-[0.12em]">{item.labelEn}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
