import type { MetadataRoute } from "next";
import { findActiveSlips } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://champeetips.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const slips = await findActiveSlips();
    return [
      ...staticRoutes,
      ...slips.map((slip) => ({
        url: `${baseUrl}/betslip/${slip.id}`,
        lastModified: new Date(slip.createdAt),
        changeFrequency: "hourly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
