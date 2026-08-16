import { publishedSchedule, type ApiScheduleItem } from "./scheduleApi";
import type { ScheduleSlot } from "./schema";

/** Nhãn ngắn theo `time.Weekday` của Go: 0 = Chủ nhật … 6 = Thứ 7. */
export const WEEKDAY_LABELS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

/** Thứ tự hiển thị: Thứ 2 trước, Chủ nhật cuối — không theo số của `weekday`. */
const displayRank = (weekday: number) => (weekday === 0 ? 7 : weekday);

/**
 * Slots → "Thứ 2-4-6 · 18:15–19:45".
 *
 * Server chỉ lưu `class_schedule_slots`, không lưu sẵn chuỗi này: giữ cả hai là để
 * chúng lệch nhau (§3). Chuỗi được dựng lại ở đây nên các trang vẫn đọc `row.cadence`
 * như trước.
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
 * Ca học theo giờ bắt đầu. Người đi làm chọn lớp theo "tối" hay "sáng" trước cả khi
 * đọc giờ cụ thể, nên nhãn này đứng đầu mỗi dòng buổi học.
 */
const daypartOf = (startTime: string): string => {
  const hour = Number(startTime.slice(0, 2));
  if (hour < 12) return "Sáng";
  if (hour < 17) return "Chiều";
  return "Tối";
};

/**
 * Slots → mỗi buổi một dòng: "Tối thứ 2: 18:15 – 19:45".
 *
 * Khác `formatCadence` (gộp thành một chuỗi "Thứ 2-4-6 · 18:15–19:45" cho chỗ chật):
 * dạng nhiều dòng dành cho thẻ lịch khai giảng, nơi người xem dò đúng buổi của mình
 * trong tuần. Lớp đổi giờ giữa các buổi — HSK2 ca 2 học tối thứ 3 và chiều thứ 7 —
 * thì chuỗi gộp phải viết hai cụm nối nhau, còn ở đây là hai dòng đọc thẳng.
 */
export function sessionLines(slots: readonly ScheduleSlot[]): string[] {
  return [...slots]
    .sort(
      (a, b) =>
        displayRank(a.weekday) - displayRank(b.weekday) ||
        a.startTime.localeCompare(b.startTime),
    )
    .map((slot) => {
      // "Thứ 2" → "thứ 2" sau nhãn ca; "Chủ nhật" là tên riêng, giữ hoa.
      const day = WEEKDAY_LABELS[slot.weekday].replace("Thứ", "thứ");
      return `${daypartOf(slot.startTime)} ${day}: ${slot.startTime} – ${slot.endTime}`;
    });
}

/**
 * Một dòng trên lịch khai giảng, đã ghép sẵn những gì các trang cần in.
 *
 * Là dạng *dẫn xuất* của `ApiScheduleItem`: chuỗi lịch dựng từ `slots`, ngày đổi sang
 * dạng người Việt đọc. Bản thân dòng đó thì do giáo vụ gõ tay — không suy từ bảng
 * `classes` hay `courses` nữa, nên ở đây không còn `courseId`/`courseCode`/`programSlug`
 * và cũng không còn link sang trang chương trình. Xem `scheduleApi.ts`.
 */
export type ScheduleRow = {
  /**
   * Id của dòng trong `enrollment_schedule_items`.
   *
   * Chỉ dùng để nhận diện dòng trong phạm vi trang: điền sẵn ô "Lớp muốn giữ chỗ" ở
   * `/register`, và ghi tên lớp vào ghi chú của lead. Không còn endpoint nào nhận nó —
   * "Đăng ký giữ chỗ" giờ ghi một lead, không ghi vào lớp nào cả.
   */
  id: string;
  code: string;
  name: string;
  /**
   * Khối gom nhóm trên trang lịch, chữ giáo vụ gõ ("Tiếng Trung Sơ cấp"). Rỗng thì
   * trang gom dòng đó theo `code`.
   */
  group: string;
  mode: string;
  target: string;
  /** `dd/mm/yyyy` để in; rỗng với dòng xếp lịch theo học viên. */
  openDate: string;
  /** `YYYY-MM-DD` để sắp xếp — so sánh chuỗi là ra đúng thứ tự thời gian. */
  openDateISO: string;
  duration: string;
  slots: ScheduleSlot[];
  cadenceNote: string;
  /** Chuỗi lịch để hiển thị, dựng từ `slots`; rơi về `cadenceNote` khi không có buổi cố định. */
  cadence: string;
};

/** "2026-08-10" → "10/08/2026". Rỗng vào, rỗng ra. */
const toVietnameseDate = (iso: string): string => {
  const [year, month, day] = iso.split("-");
  return year && month && day ? `${day}/${month}/${year}` : "";
};

const toScheduleRow = (row: ApiScheduleItem): ScheduleRow => {
  return {
    id: row.id,
    code: row.code,
    // Tên lớp là cột thật ("Lớp HSK1 (ca 1)"), không suy từ mã. Chỉ dòng nào để trống
    // mới rơi về mã, để thẻ không hiện tiêu đề rỗng.
    name: row.name?.trim() || row.code,
    group: row.groupLabel?.trim() ?? "",
    mode: row.mode,
    target: row.target,
    openDate: toVietnameseDate(row.openDate),
    openDateISO: row.openDate,
    duration: row.durationLabel,
    slots: row.slots ?? [],
    cadenceNote: row.cadenceNote,
    cadence: (row.slots ?? []).length > 0 ? formatCadence(row.slots) : row.cadenceNote,
  };
};

/**
 * Các dòng của đợt khai giảng đang đăng.
 *
 * `let` + `syncFromSchedule`: xem giải thích ở `site.ts`. Mảng này là dữ liệu *dẫn xuất*
 * (`.map()`), nên phải tính lại khi API trả về đợt mới — chỉ gán lại nguồn là không đủ.
 */
export let schedule: ScheduleRow[] = [];

/**
 * Tiêu đề và ghi chú của đợt đang đăng — "Khai giảng tháng 8/2026".
 *
 * Đi cùng `schedule` chứ không viết cứng trong trang: dòng tháng trên trang lịch trước
 * đây là chữ gõ tay trong `schedule.astro`, không có gì nối nó với các lớp bên dưới, nên
 * mỗi đợt mới là một lần phải nhớ sửa hai chỗ. Rỗng khi trung tâm chưa đăng đợt nào.
 */
export let scheduleTitle = "";
export let scheduleNote = "";

/**
 * Dòng lịch theo id, trong đúng đợt đang đăng.
 *
 * Tra thẳng `schedule` chứ không gọi API riêng: mảng này *là* đợt đang đăng, được
 * `middleware.ts` làm mới mỗi request. Tra không ra thì trả `undefined`, không phải lỗi:
 * link cũ, đợt vừa đổi, hay id ai đó tự gõ đều rơi vào đây và chỗ gọi bỏ qua — id chỉ
 * dùng để điền sẵn một ô select, không có gì được ghi theo nó.
 *
 * Hàm chứ không phải hằng: `schedule` được gán lại mỗi lần đồng bộ, nên phải đọc lúc gọi.
 */
export const findRowById = (id?: string | null): ScheduleRow | undefined =>
  id ? schedule.find((row) => row.id === id) : undefined;

export function syncFromSchedule(): void {
  const published = publishedSchedule();
  schedule = published.items.map(toScheduleRow);
  scheduleTitle = published.title;
  scheduleNote = published.note;
}
