import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://trace-ai-workspace.vercel.app/sitemap.xml",
    host: "https://trace-ai-workspace.vercel.app",
  };
}
