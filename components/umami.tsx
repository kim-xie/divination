import React from "react";
import Script from "next/script";
import { unstable_noStore as noStore } from "next/cache";
import { getSiteUrl } from "@/lib/seo";

function Umami() {
  noStore();
  return (
    <Script
      id="umami"
      strategy="afterInteractive"
      src={process.env.UMAMI_URL || "https://cloud.umami.is/script.js"}
      data-website-id={
        process.env.UMAMI_ID || "917d9f97-0be8-41f7-a167-67890d46f0cc"
      }
      data-domains={process.env.UMAMI_DOMAINS || getSiteUrl().hostname}
    />
  );
}

export default Umami;
