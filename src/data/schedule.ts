import { content } from "./content";
import type { ClassRow, ScheduleSlot } from "./schema";

type RawScheduleRow = (typeof content.schedule)[number];

/** Nhãn ngắn theo `time.Weekday` của Go: 0 = Chủ nhật … 6 = Thứ 7. */
const WEEKDAY_LABELS = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

/** Thứ tự hiển thị: Thứ 2 trước, Chủ nhật cuối — không theo số của `weekday`. */
const displayRank = (weekday: number) => (weekday === 0 ? 7 : weekday);

/**
 * Slots → "Thứ 2-4-6 · 18:15–19:45".
 *
 * `content/site.json` chỉ lưu `slots`, không lưu sẵn chuỗi này: giữ cả hai là
 * để chúng lệch nhau (§3). Chuỗi được dựng lại ở đây nên các trang vẫn đọc
 * `row.cadence` như trước.
 */
export function formatCadence(slots: readonly ScheduleSlot[]): string {
  if (slots.length === 0) return "";

  // Gom các buổi cùng khung giờ: lịch thật hầu hết là "cùng giờ, nhiều thứ".
  const byTime = new Map<string, number[]>();
  for (const slot of slots) {
    const time = `${slot.startTime}–${slot.endTime}`;
    byTime.set(time, [...(byTime.get(time) ?? []), slot.weekday]);
  }

  return [...byTime.entries()]
    .map(([time, weekdays]) => {
      const sorted = [...weekdays].sort((a, b) => displayRank(a) - displayRank(b));
      const hasSunday = sorted.includes(0);
      const weekdaysOnly = sorted.filter((day) => day !== 0);

      // "Thứ 2-4-6": chỉ số thứ, gộp sau một chữ "Thứ".
      const numbers = weekdaysOnly.map((day) => day + 1).join("-");
      const label = hasSunday
        ? weekdaysOnly.length > 0
          ? `Thứ ${numbers} & Chủ nhật`
          : "Chủ nhật"
        : `Thứ ${numbers}`;

      return `${label} · ${time}`;
    })
    .join(" · ");
}

/**
 * Một dòng lịch khai giảng như các trang đang dùng: đủ các trường cũ (`cadence`
 * là chuỗi dựng lại) cộng thêm `mode` và `slots` của schema mới.
 */
export type ScheduleRow = RawScheduleRow & {
  /** Chuỗi lịch để hiển thị, dựng từ `slots`; rơi về `cadenceNote` khi không có buổi cố định. */
  cadence: string;
};

/**
 * Lịch khai giảng — tương ứng bảng `classes` + `class_schedule_slots` ở server.
 *
 * Khi API Go bật, chỉ chỗ này đổi nguồn: các trang không biết dữ liệu từ đâu.
 */
export const schedule: ScheduleRow[] = content.schedule.map((row) => ({
  ...row,
  cadence: row.slots.length > 0 ? formatCadence(row.slots) : row.cadenceNote,
}));

/** Dòng lịch tĩnh → `ClassRow` của schema, để chỗ dùng bám vào hợp đồng chung. */
export const toClassRow = (row: RawScheduleRow): ClassRow => ({
  code: row.code,
  name: row.className,
  courseCode: row.courseCode,
  programSlug: row.courseSlug,
  mode: row.mode as ClassRow["mode"],
  target: row.target,
  openDate: row.openDate,
  durationLabel: row.duration,
  slots: row.slots,
  cadenceNote: row.cadenceNote,
});

export const classRows: ClassRow[] = content.schedule.map(toClassRow);
