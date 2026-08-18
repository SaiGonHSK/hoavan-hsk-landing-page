/**
 * Bản sao TypeScript của bảng `classes`/`class_schedule_slots` trong PostgreSQL
 * (`hoavan-hsk-server/docs/database-normal.md`, §6), dùng bởi `scheduleApi.ts`/`schedule.ts`.
 *
 * (T3 S3, unify-course-metadata 2026-08-17) File này từng có thêm một khối "§3 COURSE"
 * làm hợp đồng dữ liệu cho `adapters.ts` — cả hai đã xoá: `adapters.ts` map dữ liệu tĩnh
 * (`courses.ts`/`catalog.ts`) sang một hình dạng `courses` CŨ (9 `course_sections.kind`,
 * `intro`/`goal`/`entryRequirement`/`canDo`/`topicTitle`/`topicNote`/`sessionHours`/
 * `targetChars` — mười cột/bảng server đã bỏ ở unify-course-metadata) và không ai import
 * nó (landing đọc khoá thật qua `coursesApi.ts`/`ApiCourse`, không qua adapter này) — cả
 * cặp là code chết mô tả một schema không còn tồn tại. `coursesApi.ts`'s `ApiCourse` là
 * hợp đồng dữ liệu khoá học hiện hành.
 */

/* ── §6 CLASS ────────────────────────────────────────────────────────── */

/** `classes.mode` */
export type ClassMode = "offline" | "online" | "hybrid";

/** `classes.status` */
export type ClassStatus = "draft" | "recruiting" | "ongoing" | "finished" | "cancelled";

/**
 * Một buổi cố định trong tuần — bảng `class_schedule_slots`.
 *
 * "Thứ 2-4-6 · 18:15–19:45" là ba dòng. Cấu trúc hoá vì lịch tuần trong app học
 * viên và phần điểm danh đều cần biết một ngày cụ thể có buổi hay không, điều
 * không parse lại được từ chuỗi tiếng Việt.
 */
export type ScheduleSlot = {
  /** Theo `time.Weekday` của Go: 0 = Chủ nhật … 6 = Thứ 7. */
  weekday: number;
  /** `HH:MM`. */
  startTime: string;
  endTime: string;
};

