/**
 * Bản sao TypeScript của các bảng khoá học trong PostgreSQL
 * (`hoavan-hsk-server/database-normal.md`, §3 và §6).
 *
 * Landing hiện dựng tĩnh từ `courses.ts`, `catalog.ts` và `content/site.json`.
 * File này không thay thế chúng — nó là **hợp đồng dữ liệu**: `adapters.ts` map
 * dữ liệu tĩnh sang đúng những kiểu dưới đây, nên khi API Go bật thì chỉ cần
 * đổi nguồn trong adapter, không phải sửa lại từng trang.
 *
 * Quy ước: tên trường theo camelCase của JSON API, không phải snake_case của
 * cột; `null` cho cột NULL được; chuỗi rỗng cho cột NOT NULL còn để trống.
 */

/* ── §3 COURSE ───────────────────────────────────────────────────────── */

/** `courses.icon` */
export type CourseIcon =
  | "hsk"
  | "seed"
  | "growth"
  | "peak"
  | "chat"
  | "briefcase"
  | "vip"
  | "kids"
  | "senior";

/** `courses.track` — thay cột `level` số nguyên cũ, vốn không chứa nổi LT-HSK3, GT1, VIP. */
export type CourseTrack =
  | "hsk"
  | "hsk_exam"
  | "communication"
  | "business"
  | "vip"
  | "kids"
  | "senior"
  | "specialized";

/** `course_sections.kind` — chín danh sách gạch đầu dòng của một trang khoá học. */
export type CourseSectionKind =
  | "audience"
  | "goal"
  | "duration"
  | "content"
  | "material"
  | "outcome"
  | "foundation"
  | "grammar_point"
  | "topic_item";

/** `courses.status` · `textbooks.status` */
export type PublishStatus = "draft" | "published" | "archived";

/** Chín danh sách của `course_sections`, gom theo `kind`. */
export type CourseSectionMap = Record<CourseSectionKind, string[]>;

/**
 * Bảng `courses` — danh sách phẳng những khoá trung tâm dạy.
 *
 * Khoá là thứ cố định. Chia HSK4 thành hai chặng nối tiếp là chuyện xếp lớp, nên
 * "Lớp HSK4.1" và "Lớp HSK4.2" là hai lớp cùng trỏ vào khoá HSK4.
 */
export type CourseRow = {
  /** Mã của trung tâm, unique. */
  code: string;
  /** Đường dẫn `/courses/:slug`. */
  slug: string;
  title: string;

  /* Hiển thị trên landing */
  summary: string;
  intro: string;
  goal: string;
  entry: string;
  icon: CourseIcon;
  thumbnailUrl: string;
  tags: string[];
  isFeatured: boolean;
  /** Ẩn nút ghi danh: báo giá và xếp lịch qua điện thoại. */
  contactOnly: boolean;
  note: string;

  /* Đào tạo */
  track: CourseTrack;
  /** `null` với GT1, VIP, lớp thiếu nhi — chúng không nằm trên cấp HSK nào. */
  hskLevel: number | null;

  months: number | null;
  totalSessions: number | null;
  sessionHours: number | null;
  sessionsPerWeek: number | null;

  targetWords: number | null;
  targetChars: number | null;
  grammarCount: number | null;

  entryRequirement: string;
  /** Câu "học viên có thể …" mà đoạn giới thiệu ghép trực tiếp vào. */
  canDo: string;
  topicTitle: string;
  topicNote: string;

  /** `null` ở toàn bộ khoá hiện tại; `priceDisplay` mới là chữ được hiển thị. */
  price: number | null;
  priceDisplay: string;

  orderIndex: number;
  status: PublishStatus;
  sections: CourseSectionMap;
  /** Slug các `textbooks` khoá này dùng (bảng nối `course_textbooks`). */
  textbookSlugs: string[];
};

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

