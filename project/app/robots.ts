import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: "https://ms-seo.vercel.app/sitemap.xml",
    host: "https://ms-seo.vercel.app"
  };
}
