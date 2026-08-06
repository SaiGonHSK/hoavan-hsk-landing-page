import type { ScheduleSlot } from "./schema";

/**
 * Lịch khai giảng lấy từ `GET /api/v1/schedule`.
 *
 * **Đây là nguồn duy nhất của lịch khai giảng.** Trước đây lịch nằm ở ba nơi cùng lúc:
 * bảng `classes` trên server (có trạng thái, nhưng không ai công khai), khoá
 * `site_content.doc.schedule` (bản sao, không có trạng thái) và mảng `schedule` trong
 * `content/site.json` của repo này (bản sao thứ ba, đổi bằng deploy). Ba bản, không bản
 * nào là bản published.
 *
 * Giờ server trả về **đúng một đợt đang đăng**: trung tâm soạn đợt tháng sau trong
 * console rồi bấm đăng, đợt cũ tự ẩn trong cùng thao tác. Endpoint mang cả tiêu đề của
 * đợt, nên dòng "Khai giảng tháng 8/2026" trên trang không còn là chữ viết cứng trong
 * repo — nó đi kèm chính những lớp bên dưới nó.
 *
 * Không có bản dự phòng trong repo: API chết thì trang giữ nội dung lần nạp trước (xem
 * `refresh.ts`), lần chạy đầu chưa nạp được thì trang trống. Có bản dự phòng nghĩa là có
 * bản sao thứ hai, và đó chính là thứ vừa gỡ đi.
 */
export type ApiClass = {
  id: string;
  /** Tra sang khoá qua `apiCourseByID` để biết lớp thuộc chương trình nào. */
  courseId: string;
  courseCode: string;
  courseTitle: string;
  /** Mã trên lịch — HSK1, HSK1-ON, HSK4.1. Không unique: nhiều ca dùng chung mã. */
  code: string;
  name: string;
  mode: string;
  target: string;
  /** `YYYY-MM-DD`, rỗng với lớp xếp lịch theo học viên. Dạng ISO để sắp xếp được. */
  openDate: string;
  durationLabel: string;
  /** Chỉ có giá trị khi `scheduleSlots` rỗng — server đã ràng buộc, xem Service.apply. */
  cadenceNote: string;
  scheduleSlots: ScheduleSlot[];
};

/** Đợt khai giảng đang đăng, đúng như `GET /api/v1/schedule` trả về. */
export type ApiSchedule = {
  /** Tiêu đề đợt — "Khai giảng tháng 8/2026". Rỗng khi trung tâm chưa đăng đợt nào. */
  title: string;
  /** Dòng chú thích dưới tiêu đề; rỗng thì không in gì. */
  note: string;
  classes: ApiClass[];
};

let current: ApiSchedule = { title: "", note: "", classes: [] };

/**
 * Nhận đợt khai giảng từ API. Trả về số lớp để `refresh.ts` ghi log.
 *
 * Bỏ lớp không có mã: không có gì để hiển thị trên thẻ, và nó là dấu hiệu tài liệu hỏng.
 * Đợt rỗng **không** bị coi là lỗi, khác với menu: giữa hai đợt trung tâm có thể chưa có
 * gì để quảng bá, và khi đó trang phải nói đúng như vậy thay vì giữ lịch tháng trước.
 * Menu rỗng thì ngược lại — nó gỡ luôn cả thanh header.
 */
export function applySchedule(incoming: ApiSchedule | null | undefined): number {
  current = {
    title: incoming?.title?.trim() ?? "",
    note: incoming?.note?.trim() ?? "",
    classes: (incoming?.classes ?? []).filter((row) => row.code?.trim()),
  };
  return current.classes.length;
}

/** Đợt đang đăng. Lớp giữ nguyên thứ tự server trả (ngày khai giảng gần nhất trước). */
export const publishedSchedule = (): ApiSchedule => current;
