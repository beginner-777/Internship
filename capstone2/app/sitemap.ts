import type { MetadataRoute } from "next";

const siteUrl = "https://trace-ai-workspace.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/workspace`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/methodology`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
