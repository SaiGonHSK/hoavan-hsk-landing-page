/**
 * Thư viện — các chuyên mục nằm dưới `/library`.
 *
 * Không phải một kho dữ liệu riêng: mục nào có trong menu cứng (`content/pages.json`)
 * và có nội dung soạn từ trang quản trị thì thành một bài trong thư viện. Nhờ vậy
 * danh sách ở `/library` luôn khớp với dropdown "Thư viện" trên header.
 */
import { getPageContents, menu, type PageContent } from "./pages";

export type LibraryArticle = PageContent & {
  /** Phần cuối của đường dẫn, dùng cho route `/library/[slug]`. */
  key: string;
};

const PREFIX = "/library/";

/** Thứ tự hiển thị lấy theo thứ tự trong menu, không theo thứ tự API trả về. */
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
