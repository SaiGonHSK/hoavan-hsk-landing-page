
import { getPageContents, menu, type PageContent } from "./pages";

export type LibraryArticle = PageContent & {

  key: string;
};

const PREFIX = "/library/";

const order = new Map(
  (menu.find((entry) => entry.slug === "/library")?.children ?? []).map(
    (child, index) => [child.slug, index],
  ),
);

export async function getLibrary(): Promise<LibraryArticle[]> {
  const pages = await getPageContents();
  return pages
    .filter((page) => page.slug.startsWith(PREFIX))
    .map((page) => ({ ...page, key: page.slug.slice(PREFIX.length) }))
    .sort((a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999));
}

export async function findLibrary(key: string) {
  return (await getLibrary()).find((item) => item.key === key);
}
