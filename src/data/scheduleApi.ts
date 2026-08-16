import type { ScheduleSlot } from "./schema";

/**
 * Lịch khai giảng lấy từ `GET /api/v1/schedule`.
 *
 * **Đây là nguồn duy nhất của lịch khai giảng, và nó là NỘI DUNG chứ không phải dữ liệu
 * vận hành.** Mỗi dòng dưới đây là chữ giáo vụ gõ trong console — mã, tên lớp, ngày khai
 * giảng, các buổi trong tuần — không phải một hàng trong bảng `classes` như trước.
 *
 * Vì sao đổi: trung tâm đăng lịch lên để NHẬN học viên; lớp thật (có sĩ số, giáo viên,
 * điểm danh) chỉ ra đời sau đó, khi đã có người ghi danh. Thiết kế cũ bắt phải tạo trước
 * 20 lớp thật, mỗi lớp buộc chọn một khoá trong `courses`, chỉ để có cái mà quảng cáo —
 * xem `migrations/017_enrollment_schedule_items.sql` bên server.
 *
 * Hệ quả cho trang này: một dòng lịch không còn nối được sang khoá học hay chương trình
 * nào. Không có `courseId`, nên không có link "Xem chương trình" trên trang lịch, và các
 * trang chương trình cũng không liệt kê được lớp sắp khai giảng của riêng chúng. Gom
 * nhóm bây giờ dựa vào `groupLabel` — cũng là chữ giáo vụ gõ.
 *
 * Server trả về **đúng một đợt đang đăng**: trung tâm soạn đợt tháng sau trong console
 * rồi bấm đăng, đợt cũ tự ẩn trong cùng thao tác. Endpoint mang cả tiêu đề của đợt, nên
 * dòng "Khai giảng tháng 8/2026" trên trang không còn là chữ viết cứng trong repo — nó
 * đi kèm chính những dòng bên dưới nó.
 *
 * Không có bản dự phòng trong repo: API chết thì trang giữ nội dung lần nạp trước (xem
 * `refresh.ts`), lần chạy đầu chưa nạp được thì trang trống. Có bản dự phòng nghĩa là có
 * bản sao thứ hai, và đó chính là thứ đã gỡ đi.
 */
export type ApiScheduleItem = {
  /**
   * Id của dòng trong `enrollment_schedule_items`.
   *
   * Chỉ để trang nói được khách đang hỏi dòng nào (điền sẵn ô "Lớp muốn giữ chỗ", ghi
   * vào ghi chú của lead). Không có endpoint nào nhận id này: đăng ký giữ chỗ giờ là một
   * lead, xem `lib/leads.ts`.
   */
  id: string;
  /** Khối để gom nhóm trên trang — "Tiếng Trung Sơ cấp". Rỗng thì gom theo `code`. */
  groupLabel: string;
  /** Mã trên thẻ — HSK1, HSK1-ON, HSK4.1. Không unique: nhiều ca dùng chung mã. */
  code: string;
  name: string;
  mode: string;
  target: string;
  /** `YYYY-MM-DD`, rỗng với dòng xếp lịch theo học viên. Dạng ISO để sắp xếp được. */
  openDate: string;
  durationLabel: string;
  /** Chỉ có giá trị khi `slots` rỗng — server đã ràng buộc, xem `Service.apply`. */
  cadenceNote: string;
  slots: ScheduleSlot[];
};

/** Đợt khai giảng đang đăng, đúng như `GET /api/v1/schedule` trả về. */
export type ApiSchedule = {
  /** Tiêu đề đợt — "Khai giảng tháng 8/2026". Rỗng khi trung tâm chưa đăng đợt nào. */
  title: string;
  /** Dòng chú thích dưới tiêu đề; rỗng thì không in gì. */
  note: string;
  items: ApiScheduleItem[];
};

let current: ApiSchedule = { title: "", note: "", items: [] };

/**
 * Nhận đợt khai giảng từ API. Trả về số dòng để `refresh.ts` ghi log.
 *
 * Bỏ dòng không có mã: không có gì để hiển thị trên thẻ, và nó là dấu hiệu tài liệu hỏng.
 * Đợt rỗng **không** bị coi là lỗi, khác với menu: giữa hai đợt trung tâm có thể chưa có
 * gì để quảng bá, và khi đó trang phải nói đúng như vậy thay vì giữ lịch tháng trước.
 * Menu rỗng thì ngược lại — nó gỡ luôn cả thanh header.
 */
export function applySchedule(incoming: ApiSchedule | null | undefined): number {
  current = {
    title: incoming?.title?.trim() ?? "",
    note: incoming?.note?.trim() ?? "",
    items: (incoming?.items ?? []).filter((row) => row.code?.trim()),
  };
  return current.items.length;
}

/** Đợt đang đăng. Dòng giữ nguyên thứ tự server trả (ngày khai giảng gần nhất trước). */
export const publishedSchedule = (): ApiSchedule => current;
