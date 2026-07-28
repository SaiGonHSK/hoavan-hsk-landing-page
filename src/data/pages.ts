/**
 * Cấu trúc menu và nội dung các trang động của landing page.
 *
 * Hai thứ này đến từ hai nguồn khác nhau, cố ý:
 *
 * - **Cấu trúc menu — cứng.** Nằm trong `content/pages.json` của chính repo này.
 *   Mỗi mục ứng với một trang có thật: hoặc file route trong `src/pages`, hoặc
 *   một trang động có nội dung soạn từ trang quản trị. Chỉ lập trình viên sửa;
 *   app quản trị không thêm/xoá/đổi được mục menu nào.
 *
 * - **Nội dung trang động — lấy từ API.** Giáo vụ soạn trong app quản trị, ở đây
 *   gọi `PUBLIC_CONTENT_API` lúc build để lấy về. Không gọi được thì các trang
 *   động bị bỏ qua, phần còn lại của site vẫn build bình thường.
 */
import doc from "../../content/pages.json";

export type MenuChild = {
  label: string;
  slug: string;
  /** Nhãn cột trong mega menu. Bỏ trống = dropdown thường. */
  group?: string;
};

export type MenuEntry = {
  label: string;
  slug: string;
  /** Hiển thị như nút nổi bật trên header. */
  cta?: boolean;
  children?: MenuChild[];
};

/** Nội dung một trang do giáo vụ soạn trong trang quản trị. */
export type PageContent = {
  slug: string;
  title: string;
  summary: string;
  intro: string;
  /** HTML soạn từ trình soạn thảo của trang quản trị. */
  body: string;
  updatedAt?: string;
};

export type PageTreeNode = MenuEntry & { children: MenuChild[] };

/** Cây menu — dữ liệu cứng, dùng cho header ở mọi trang. */
export const menu: PageTreeNode[] = (doc.menu as MenuEntry[]).map((entry) => ({
  ...entry,
  children: entry.children ?? [],
}));

/** Tra nhanh mục cha của một đường dẫn con — dùng cho breadcrumb. */
export function findParent(slug: string): PageTreeNode | null {
  return menu.find((entry) => entry.children.some((c) => c.slug === slug)) ?? null;
}

const API = import.meta.env.PUBLIC_CONTENT_API?.replace(/\/$/, "") ?? "";

let cache: PageContent[] | null = null;

/**
 * Nội dung các trang động, lấy từ app quản trị. Gọi một lần rồi dùng lại trong
 * cùng lần build.
 *
 * Chỉ nhận những slug có trong menu — nội dung ứng với đường dẫn không còn trong
 * menu là rác của lần cấu trúc cũ, bỏ qua để không sinh ra trang mồ côi.
 */
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

/** Gom mục con theo nhãn cột để render mega menu. */
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

/** Mục con không gắn nhãn cột — render dropdown thường. */
export const plainChildren = (children: MenuChild[] = []) =>
  children.filter((child) => !child.group?.trim());
