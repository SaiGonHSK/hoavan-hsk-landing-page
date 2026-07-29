
import doc from "../../content/pages.json";

export type MenuChild = {
  label: string;
  slug: string;

  group?: string;
};

export type MenuEntry = {
  label: string;
  slug: string;

  cta?: boolean;
  children?: MenuChild[];
};

export type PageContent = {
  slug: string;
  title: string;
  summary: string;
  intro: string;

  body: string;
  updatedAt?: string;
};

export type PageTreeNode = MenuEntry & { children: MenuChild[] };

export const menu: PageTreeNode[] = (doc.menu as MenuEntry[]).map((entry) => ({
  ...entry,
  children: entry.children ?? [],
}));

export function findParent(slug: string): PageTreeNode | null {
  return menu.find((entry) => entry.children.some((c) => c.slug === slug)) ?? null;
}

const API = import.meta.env.PUBLIC_CONTENT_API?.replace(/\/$/, "") ?? "";

let cache: PageContent[] | null = null;

export async function getPageContents(): Promise<PageContent[]> {
  if (cache) return cache;

  if (!API) {
    console.warn(
      "[pages] chưa đặt PUBLIC_CONTENT_API — bỏ qua các trang động soạn từ trang quản trị",
    );
    cache = [];
    return cache;
  }

  const known = new Set(menu.flatMap((entry) => entry.children.map((c) => c.slug)));

  try {
    const res = await fetch(`${API}/api/public/pages`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data: PageContent[] };
    cache = (body.data ?? []).filter(
      (page) => known.has(page.slug) && page.body?.trim(),
    );
    console.info(`[pages] lấy ${cache.length} trang nội dung từ ${API}`);
  } catch (error) {
    console.warn(
      `[pages] không gọi được ${API}/api/public/pages (${String(error)}) — bỏ qua các trang động`,
    );
    cache = [];
  }

  return cache;
}

export function groupChildren(children: MenuChild[] = []) {
  const groups: { title: string; items: MenuChild[] }[] = [];
  for (const child of children) {
    const title = child.group?.trim();
    if (!title) continue;
    const existing = groups.find((g) => g.title === title);
    if (existing) existing.items.push(child);
    else groups.push({ title, items: [child] });
  }
  return groups;
}

export const plainChildren = (children: MenuChild[] = []) =>
  children.filter((child) => !child.group?.trim());
