import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { FLAGSHIP_HREF } from "@/config/flagship";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE.url}${FLAGSHIP_HREF}`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
