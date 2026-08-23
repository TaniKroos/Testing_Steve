import { useEffect } from "react";

const siteName = "Travel Basket";
const defaultDescription = "Thoughtful small-group journeys into the world's wild, beautiful places.";

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

export function useDocumentMeta({ title, description = defaultDescription, robots } = {}) {
  useEffect(() => {
    document.title = title ? `${title} · ${siteName}` : `${siteName} · Expedition Console`;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", document.title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[name="robots"]', "content", robots || "index, follow");
  }, [title, description, robots]);
}
