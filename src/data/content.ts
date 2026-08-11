import bundled from "../../content/site.json";

/**
 * Tài liệu nội dung của landing.
 *
 * `content/site.json` là nội dung **hardcode trong repo** — thương hiệu, liên hệ,
 * khối đầu trang, sứ mệnh, khác biệt, cam kết, số liệu, giảng viên, FAQ, trang giới
 * thiệu. Đổi mấy thứ đó là sửa file rồi deploy, vì chúng gần như không đổi và gắn
 * chặt với bố cục.
 *
 * Chỉ những khoá trong `DYNAMIC_KEYS` được trang quản trị soạn và lấy từ
 * `GET /api/v1/content`: đó là phần trung tâm cập nhật thường xuyên.
 * `src/middleware.ts` gọi `refreshContent()` mỗi request (cache 60s) nên sửa ở admin
 * là trang đổi theo, không cần build lại.
 */
export type SiteContent = typeof bundled;

/**
 * Những khoá trang quản trị được phép ghi đè. Mọi khoá khác **luôn** lấy từ
 * `content/site.json`, kể cả khi API trả về chúng.
 *
 * Danh sách trắng thay vì tin API: hai bên có thể lệch nhau (server lưu jsonb không
 * định kiểu), và một tài liệu cũ còn sót `hero` sẽ âm thầm ghi đè bản trong repo.
 * Khai ở đây thì đọc một dòng là biết cái gì động, cái gì tĩnh.
 *
 * `schedule` từng là khoá thứ hai. Lịch khai giảng giờ là bảng `classes`, đọc qua
 * `GET /api/v1/classes` (xem `classesApi.ts`): nó vốn đã là một bảng thật có trạng thái,
 * nên giữ thêm một bản trong tài liệu này và một bản nữa trong `content/site.json` chỉ
 * tạo ra ba phiên bản của cùng một lịch. Cả hai bản sao đã gỡ.
 */
const DYNAMIC_KEYS = ["testimonials"] as const;

let current: SiteContent = bundled;

/**
 * Nội dung tĩnh, đọc thẳng từ repo. Dùng cho những khoá không nằm trong
 * `DYNAMIC_KEYS` — chúng không bao giờ đổi lúc chạy nên chỗ dùng khai `const`.
 */
export const staticContent = bundled;

/** Tài liệu đang dùng. Chỉ các khoá động khác `staticContent`. */
export const getContent = (): SiteContent => current;

/**
 * Thời điểm nội dung được cập nhật, dùng cho `dateModified` của schema.org.
 *
 * `let` chứ không `const`: `Layout.astro` import trực tiếp biến này, và ESM live
 * binding làm nơi import thấy giá trị mới sau khi `applyContent` gán lại — nhờ vậy
 * không phải sửa chỗ dùng.
 */
export let contentUpdatedAt: string = bundled.updatedAt;

/**
 * Nhận tài liệu từ API và đưa vào dùng — chỉ những khoá trong `DYNAMIC_KEYS`.
 *
 * Merge lên bản trong repo thay vì thay thẳng: server lưu jsonb không định kiểu nên
 * nó **không đảm bảo** đủ khoá. Nếu API trả tài liệu thiếu `schedule`, merge nghĩa là
 * trang lịch khai giảng vẫn render bằng nội dung trong repo; thay thẳng thì nó vỡ ở
 * `schedule.map`.
 */
export function applyContent(next: unknown): void {
  if (!isPlainObject(next)) return;

  const patch: Record<string, unknown> = {};
  for (const key of DYNAMIC_KEYS) {
    if (key in next) patch[key] = next[key];
  }

  current = mergeContent(bundled, patch) as SiteContent;
  // `updatedAt` của tài liệu động: dùng cho `dateModified` của schema.org.
  const updatedAt = (next as { updatedAt?: unknown }).updatedAt;
  contentUpdatedAt = typeof updatedAt === "string" && updatedAt ? updatedAt : bundled.updatedAt;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Deep-merge `next` lên `base`, lấy `base` cho những gì `next` không nói tới.
 *
 * Ba quy tắc, và lý do của từng cái:
 *
 *   - Mảng: lấy nguyên của `next`. Mảng rỗng là một lựa chọn có thật (admin xoá hết
 *     câu hỏi thường gặp), không phải "thiếu dữ liệu", nên không rơi về `base`.
 *   - Chuỗi/số: lấy của `next` kể cả khi rỗng — bỏ trắng một dòng chữ cũng là sửa.
 *     Chỉ `undefined`/`null` mới coi là không có.
 *   - Object: đệ quy, nên khoá mới của `base` mà `next` chưa biết vẫn còn.
 */
function mergeContent(base: unknown, next: unknown): unknown {
  if (next === undefined || next === null) return base;
  if (Array.isArray(next)) return next;

  if (isPlainObject(base) && isPlainObject(next)) {
    const merged: Record<string, unknown> = { ...base };
    for (const key of Object.keys(next)) {
      merged[key] = key in base ? mergeContent(base[key], next[key]) : next[key];
    }
    return merged;
  }

  return next;
}
