export const SITE_URL = "https://blossomwordgame.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export interface RouteSeo {
  title: string;
  description: string;
  keywords?: string;
  /** Absolute or root-relative path for the canonical/og url, e.g. "/solver". */
  path: string;
  /** Optional JSON-LD object injected only while this route is active. */
  jsonLd?: object;
}

const JSON_LD_ID = "route-json-ld";

function setMetaByName(name: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(url: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function setRouteJsonLd(jsonLd?: object): void {
  document.getElementById(JSON_LD_ID)?.remove();
  if (!jsonLd) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = JSON_LD_ID;
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}

export function applySeo(seo: RouteSeo): void {
  const url = `${SITE_URL}${seo.path}`;

  document.title = seo.title;
  setMetaByName("description", seo.description);
  if (seo.keywords) setMetaByName("keywords", seo.keywords);
  setCanonical(url);

  setMetaByProperty("og:title", seo.title);
  setMetaByProperty("og:description", seo.description);
  setMetaByProperty("og:url", url);
  setMetaByProperty("og:image", DEFAULT_OG_IMAGE);

  setMetaByName("twitter:title", seo.title);
  setMetaByName("twitter:description", seo.description);

  setRouteJsonLd(seo.jsonLd);
}
