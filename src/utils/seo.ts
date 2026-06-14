export const SITE_URL = "https://blossomword.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;

export interface RouteSeo {
  title: string;
  description: string;
  keywords?: string;
  /** Root-relative path for the canonical/og url, e.g. "/solver". */
  path: string;
  /** Optional JSON-LD object injected only while this route is active. */
  jsonLd?: object;
}

/** Build an @unhead/vue head config from a route's SEO metadata. */
export function buildHead(seo: RouteSeo) {
  const url = `${SITE_URL}${seo.path}`;

  const meta = [
    { name: "description", content: seo.description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Blossom Word Game" },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { property: "og:url", content: url },
    { property: "og:image", content: DEFAULT_OG_IMAGE },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    { name: "twitter:image", content: DEFAULT_OG_IMAGE },
  ];

  if (seo.keywords) {
    meta.push({ name: "keywords", content: seo.keywords });
  }

  return {
    title: seo.title,
    meta,
    link: [{ rel: "canonical", href: url }],
    script: seo.jsonLd
      ? [{ type: "application/ld+json", innerHTML: JSON.stringify(seo.jsonLd) }]
      : [],
  };
}
