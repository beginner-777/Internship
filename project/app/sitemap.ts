import type { MetadataRoute } from "next";

const routes = ["", "/audit", "/issues", "/reports", "/explore", "/about"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route, index) => ({
    url: `https://ms-seo.vercel.app${route}`,
    lastModified,
    changeFrequency: index < 2 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.7
  }));
}
