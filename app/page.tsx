import Header from "@/components/header";
import Divination from "@/components/divination";
import Footer from "@/components/footer";
import type { Metadata } from "next";
import { getSiteUrl, siteDescription, siteName, siteTitle } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  return {
    alternates: siteUrl ? { canonical: siteUrl.href } : undefined,
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName,
      title: siteTitle,
      description: siteDescription,
      ...(siteUrl && {
        url: siteUrl.href,
        images: [
          { url: new URL("/apple-icon.png", siteUrl).href, alt: siteName },
        ],
      }),
    },
  };
}

export default function Home() {
  const siteUrl = getSiteUrl();
  return (
    <>
      {siteUrl && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: siteUrl.href,
              description: siteDescription,
              inLanguage: "zh-CN",
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <Header />
      <Divination />
      <Footer />
    </>
  );
}
