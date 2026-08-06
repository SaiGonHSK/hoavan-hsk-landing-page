
import doc from "../../content/pages.json";

export type MenuChild = {
  label: string;
  slug: string;

  group?: string;

  /** Trang tổng của nhóm — chỉ cần đặt ở mục đầu tiên của nhóm. */
  groupSlug?: string;

  /**
   * Id khoá học khi mục này là trang của một khoá.
   *
   * Khoá học không có `slug` riêng: đường dẫn của nó là `slug` của chính mục menu
   * này. Xem `coursePathMap()`.
   */
  courseId?: number;
};

export type MenuEntry = {
  label: string;
  slug: string;

  cta?: boolean;

  /** Ẩn khỏi header (desktop + drawer) nhưng vẫn build trang và giữ link ở footer. */
  hidden?: boolean;
  children?: MenuChild[];
};

export type PageContent = {
  slug: string;
  title: string;
  summary: string;
  intro: string;

  body: string;
  /** Đường dẫn ảnh bìa trong `public/`, rỗng nếu bài không có ảnh. */
  coverImage?: string;
  /** ISO date — ngày trung tâm đăng bài, dùng để sắp thứ tự blog. */
  publishedAt?: string | null;
  updatedAt?: string;
};

export type PageTreeNode = MenuEntry & { children: MenuChild[] };

/**
 * Chuẩn hoá một cây menu về hình dạng các trang đang dùng.
 *
 * Đổi chuỗi rỗng thành `undefined` chứ không giữ nguyên: `groupChildren` dùng
 * `existing.slug ??= child.groupSlug` và Header dùng `group.slug ?? item.slug` —
 * `??` chỉ bắt null/undefined, nên một `groupSlug: ""` sẽ khoá href của tiêu đề
 * nhóm thành chuỗi rỗng và không mục con nào sau đó điền được nữa.
 */
const normaliseMenu = (entries: MenuEntry[]): PageTreeNode[] =>
  entries.map((entry) => ({
    ...entry,
    children: (entry.children ?? []).map((child) => ({
      ...child,
      group: child.group?.trim() || undefined,
      groupSlug: child.groupSlug?.trim() || undefined,
    })),
  }));

/**
 * Menu header, soạn từ trang quản trị (bảng `menu_entries`).
 *
 * `let` chứ không `const`: `refresh.ts` gọi `applyMenu` mỗi khi nạp lại nội dung, và
 * ESM live binding đưa giá trị mới tới mọi chỗ đang import. Bản trong
 * `content/pages.json` là **dự phòng** khi API chết, đúng vai trò `content/site.json`
 * đang giữ với `applyContent`.
 */
export let menu: PageTreeNode[] = normaliseMenu(doc.menu as MenuEntry[]);

/**
 * Nhận menu từ API. Trả về số mục đã nhận; **0 nghĩa là không thay gì cả**.
 *
 * Từ chối mảng rỗng thay vì cài nó vào: menu rỗng không chỉ làm trống thanh header mà
 * còn xoá mọi trang khoá học (đường dẫn của khoá nằm ở mục menu). API chết, trả 500
 * hay trả body hỏng đều rơi vào đây, và giữ bản đang dùng luôn tốt hơn.
 */
export function applyMenu(incoming: MenuEntry[]): number {
  if (!Array.isArray(incoming) || incoming.length === 0) return 0;

  menu = normaliseMenu(incoming);
  return menu.length;
}

export function findParent(slug: string): PageTreeNode | null {
  return menu.find((entry) => entry.children.some((c) => c.slug === slug)) ?? null;
}

/**
 * Bảng tra đường dẫn → id khoá học, dựng từ menu.
 *
 * Đây là bảng định tuyến của `/courses/**`: khoá học không còn cột `slug`, nên mục
 * menu trỏ vào khoá **chính là** thứ quyết định khoá đó nằm ở URL nào. Khoá không có
 * mục menu thì không có trang — và cũng không được liệt kê ở trang danh sách.
 *
 * Là hàm chứ không phải hằng: menu đổi sau mỗi lần nạp, còn bảng này chỉ có vài chục
 * mục nên dựng lại mỗi lần gọi rẻ hơn là giữ thêm một chỗ phải đồng bộ.
 */
export function coursePathMap(): Map<string, number> {
  const out = new Map<string, number>();
  for (const entry of menu) {
    for (const child of entry.children) {
      if (child.courseId != null) out.set(child.slug, child.courseId);
    }
  }
  return out;
}

let pages: PageContent[] = [];

/**
 * Các trang động đã soạn từ trang quản trị.
 *
 * Đồng bộ (không `await`) vì `refresh.ts` đã nạp trước khi trang render — xem
 * `src/middleware.ts`. Vẫn để `async` cho tương thích với chỗ đang gọi.
 */
export async function getPageContents(): Promise<PageContent[]> {
  return pages;
}

/**
 * Nhận danh sách trang từ API.
 *
 * Không còn lọc theo menu: Thư viện là blog, nên trang quản trị phải tạo được bài ở
 * URL mới mà không cần ai sửa `content/pages.json`. Server đã chỉ trả bài
 * `published`, nên ở đây chỉ cần bỏ bài chưa có nội dung — một bài rỗng mà vẫn sinh
 * URL thì Google index một trang trắng.
 *
 * Đánh đổi đã biết: slug do người soạn đặt nên có thể trùng route tĩnh (ví dụ
 * `/courses`). Route tĩnh của Astro luôn thắng route bắt-tất-cả, nên trường hợp đó
 * bài viết không hiện chứ không ghi đè trang thật.
 */
export function applyPageContents(incoming: PageContent[]): number {
  pages = incoming.filter((page) => page.body?.trim());
  return pages.length;
}

export function groupChildren(children: MenuChild[] = []) {
  const groups: { title: string; slug?: string; items: MenuChild[] }[] = [];
  for (const child of children) {
    const title = child.group?.trim();
    if (!title) continue;
    const existing = groups.find((g) => g.title === title);
    if (existing) {
      existing.items.push(child);
      existing.slug ??= child.groupSlug;
    } else {
      groups.push({ title, slug: child.groupSlug, items: [child] });
    }
  }
  return groups;
}

export const plainChildren = (children: MenuChild[] = []) =>
  children.filter((child) => !child.group?.trim());
