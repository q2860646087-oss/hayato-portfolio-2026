import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { siteConfig } from "@/config/site";
import { createThemeCss } from "@/config/theme";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.siteName} | ${siteConfig.authorName}`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.introZh,
  icons: {
    icon: [
      { url: siteConfig.favicon, type: "image/png" },
      { url: "/favicon.svg?v=20260609", type: "image/svg+xml" },
    ],
    shortcut: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href={siteConfig.favicon} type="image/png" />
        <link rel="shortcut icon" href={siteConfig.favicon} />
        <link rel="apple-touch-icon" href={siteConfig.favicon} />
        <style dangerouslySetInnerHTML={{ __html: createThemeCss() }} />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
