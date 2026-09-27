import "./globals.css";
import type { Metadata, Viewport } from "next";
import React from "react";
import Umami from "@/components/umami";
import { ThemeProvider } from "next-themes";
import { getSiteUrl, siteDescription, siteName, siteTitle } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const images = siteUrl
    ? [{ url: new URL("/apple-icon.png", siteUrl).href, alt: siteName }]
    : undefined;

  return {
    metadataBase: siteUrl,
    title: { default: siteTitle, template: `%s | ${siteName}` },
    description: siteDescription,
    applicationName: siteName,
    other: {
      "google-adsense-account": "ca-pub-9639750615409415",
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName,
      title: siteTitle,
      description: siteDescription,
      images,
    },
    twitter: {
      card: "summary",
      title: siteTitle,
      description: siteDescription,
      images,
    },
    appleWebApp: { title: siteName },
  };
}

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f4" },
    { media: "(prefers-color-scheme: dark)", color: "#333333" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9639750615409415"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://registry.npmmirror.com/lxgw-wenkai-screen-web/latest/files/lxgwwenkaiscreen/result.css"
        />
      </head>
      <body>
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Umami />
      </body>
    </html>
  );
}
