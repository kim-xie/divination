export const siteName = "赛博占卜";
export const siteTitle = "赛博占卜 - AI 在线算卦与周易六爻解读";
export const siteDescription =
  "赛博占卜提供在线六爻起卦：写下问题，通过六次三枚硬币模拟投掷生成周易卦象，查看本卦与变爻，并获取 AI 卦象解读。";

// Keep canonical URLs on the public site, including in preview deployments.
export function getSiteUrl(): URL {
  const value =
    process.env.SITE_URL?.trim() || "https://divination-gamma.vercel.app/";

  const url = new URL(value);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL 必须是完整的网站域名，例如 https://example.com，不包含路径、查询参数或认证信息。",
    );
  }
  return url;
}
