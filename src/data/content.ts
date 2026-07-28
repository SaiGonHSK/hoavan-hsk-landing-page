/**
 * Nguồn nội dung duy nhất của landing page.
 *
 * Toàn bộ chữ nghĩa hiển thị ra ngoài nằm trong `content/site.json` — file này
 * do app quản trị (hoavan-hsk-admin) ghi xuống. Các module `src/data/*.ts` chỉ
 * đọc lại và gắn kiểu, nên khi giáo vụ sửa nội dung trong admin là landing đổi
 * theo sau lần build kế tiếp (hoặc ngay lập tức khi chạy `astro dev`).
 *
 * Muốn lấy nội dung từ API Go thay vì file: đổi phần thân `loadContent()` sang
 * `await fetch(...)` — các trang không phải sửa gì.
 */
import raw from "../../content/site.json";

export type SiteContent = typeof raw;

export const content: SiteContent = raw;

/** Thời điểm nội dung được cập nhật lần cuối từ admin. */
export const contentUpdatedAt = raw.updatedAt;
