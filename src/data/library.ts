import doc from "../../content/pages.json";

import { getPageContents, type MenuEntry, type PageContent } from "./pages";

/**
 * Thư viện = blog của trung tâm, chia theo **chuyên mục**.
 *
 * Chuyên mục là một bảng riêng trên server (`library_categories`), soạn ở console.
 * Trước đây nó được suy từ các mục con của `/library` trong menu, nhưng như vậy thì
 * sửa một dòng menu là một thao tác **phá dữ liệu**: bài viết nằm ở
 * `/library/<chuyên-mục>/<bài>` và mọi bài không tra được chuyên mục đều bị bỏ, tức
 * đổi tên một mục menu là 404 cả chuyên mục. Giờ menu chỉ còn *trỏ tới* chuyên mục.
 *
 * Chuyên mục của một bài **suy từ slug**, không lưu riêng: một cột `category` song
 * song với slug là hai chỗ có thể lệch nhau, và slug đã chứa đủ thông tin.
 */

const PREFIX = "/library/";

export type LibraryCategory = {
  /** Phần sau `/library/`, tức tham số route — "thematic-vocabulary". */
  key: string;
  /** Slug đầy đủ để đặt link — "/library/thematic-vocabulary". */
  slug: string;
  label: string;
};

export type LibraryArticle = PageContent & {
  /** Phần slug sau chuyên mục — tham số cuối của route. */
  key: string;
  category: LibraryCategory;
};

/** Dạng một chuyên mục như `GET /api/v1/library-categories` trả về. */
export type ApiLibraryCategory = { key: string; label: string };

const toCategory = (input: ApiLibraryCategory): LibraryCategory => ({
  key: input.key,
  slug: `${PREFIX}${input.key}`,
  label: input.label,
});

/**
 * Danh sách chuyên mục dự phòng, lấy từ các mục con của `/library` trong bản chụp
 * menu. Chỉ dùng khi chưa gọi được API — xem `applyLibraryCategories`.
 */
const bundled = (): LibraryCategory[] =>
  ((doc.menu as MenuEntry[]).find((entry) => entry.slug === PREFIX.slice(0, -1))?.children ?? [])
    .filter((child) => child.slug.startsWith(PREFIX))
    .map((child) => toCategory({ key: child.slug.slice(PREFIX.length), label: child.label }));

export let libraryCategories: LibraryCategory[] = bundled();

/**
 * Nhận danh sách chuyên mục từ API. Trả về số chuyên mục; **0 nghĩa là không thay**.
 *
 * Từ chối danh sách rỗng, và đây là chốt chặn quan trọng nhất của Thư viện:
 * `src/pages/library/[category].astro` trả 404 khi tra không ra, còn `getLibrary()`
 * bỏ **mọi** bài không thuộc chuyên mục nào. Cài một danh sách rỗng là gỡ toàn bộ bài
 * viết khỏi Google chỉ vì API lỗi một nhịp.
 */
export function applyLibraryCategories(incoming: ApiLibraryCategory[]): number {
  if (!Array.isArray(incoming) || incoming.length === 0) return 0;

  libraryCategories = incoming
    .filter((category) => category?.key?.trim())
    .map(toCategory);
  return libraryCategories.length;
}

export const findLibraryCategory = (key: string): LibraryCategory | undefined =>
  libraryCategories.find((category) => category.key === key);

/**
 * Mọi bài viết đã xuất bản, mới nhất trước.
 *
 * Bỏ bài có slug không nằm dưới chuyên mục nào — ví dụ `/library/aaa` đặt sai một
 * cấp. Chúng không có trang nào render nên hiện trong danh sách chỉ gây nhầm.
 */
export async function getLibrary(): Promise<LibraryArticle[]> {
  const pages = await getPageContents();

  return pages.flatMap((page) => {
    if (!page.slug.startsWith(PREFIX)) return [];

    const rest = page.slug.slice(PREFIX.length);
    const cut = rest.indexOf("/");
    if (cut <= 0) return [];

    const category = findLibraryCategory(rest.slice(0, cut));
    const key = rest.slice(cut + 1);
    if (!category || !key) return [];

    return [{ ...page, key, category }];
  });
}

/** Bài viết của một chuyên mục. Server đã sắp sẵn nên giữ nguyên thứ tự. */
export async function articlesInCategory(categoryKey: string): Promise<LibraryArticle[]> {
  return (await getLibrary()).filter((item) => item.category.key === categoryKey);
}

/**
 * "2024-12-01" → "01 tháng 12, 2024". Rỗng khi bài chưa từng xuất bản.
 *
 * Tự ghép thay vì `toLocaleDateString("vi-VN")`: Node dựng không đủ ICU thì locale
 * `vi` lặng lẽ rơi về `en-US`, và ngày tháng tiếng Anh chỉ lộ ra sau khi deploy.
 */
const MONTHS = [
  "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
  "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12",
];

export function formatArticleDate(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

export async function findLibraryArticle(categoryKey: string, key: string) {
  return (await getLibrary()).find(
    (item) => item.category.key === categoryKey && item.key === key,
  );
}
