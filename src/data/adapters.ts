/**
 * Map dữ liệu tĩnh của landing sang đúng hình dạng các bảng ở server
 * (`schema.ts`).
 *
 * Đây là lớp duy nhất biết dữ liệu đến từ `courses.ts` / `catalog.ts`. Khi API
 * Go bật, chỉ file này đổi nguồn — `schema.ts` và chỗ dùng không phải sửa. Giữ
 * adapter tách khỏi `courses.ts`/`catalog.ts` để hai file kia vẫn là nơi soạn
 * nội dung, không bị lẫn với chuyện lưu trữ.
 */

import { HSK_LEVELS, specialCourses } from "./catalog";
import { courses as programs, type Course as ProgramSource, type CourseLevel } from "./courses";
import type { CourseIcon, CourseRow, CourseSectionMap, CourseTrack } from "./schema";

/* ── Chuyển chuỗi tiếng Việt sang số ─────────────────────────────────── */

/** "2,5 tháng" → 2.5 · "36 buổi" → 36. `null` khi không có số nào đọc được. */
const firstNumber = (text: string): number | null => {
  const match = text.match(/(\d+(?:[.,]\d+)?)/);
  return match ? Number(match[1].replace(",", ".")) : null;
};

/** "1.000 từ" → 1000. Dấu chấm trong tiếng Việt là phân cách nghìn, không phải thập phân. */
const groupedNumber = (text: string): number | null => {
  const match = text.match(/(\d[\d.]*)/);
  return match ? Number(match[1].replace(/\./g, "")) : null;
};

/**
 * Rút thời lượng từ câu như "36 buổi, 72 giờ học, 2h/buổi, 3 buổi/tuần (3 tháng)".
 *
 * Trả `null` cho từng phần không tìm thấy thay vì đoán — thà thiếu một con số
 * còn hơn hiện sai thời lượng của khoá.
 */
const parseDuration = (lines: readonly string[]) => {
  const text = lines.join(" ");
  return {
    totalSessions: text.match(/(\d+)\s*buổi(?!\/)/)?.[1] ?? null,
    sessionHours: text.match(/(\d+(?:[.,]\d+)?)\s*(?:h|giờ)\s*\/\s*buổi/)?.[1] ?? null,
    sessionsPerWeek: text.match(/(\d+)\s*buổi\s*\/\s*tuần/)?.[1] ?? null,
    months: text.match(/(\d+(?:[.,]\d+)?)\s*tháng/)?.[1] ?? null,
  };
};

const num = (value: string | null) => (value === null ? null : Number(value.replace(",", ".")));

/* ── Chương trình ────────────────────────────────────────────────────── */

/** Nhóm khoá suy từ chương trình — một chương trình chỉ bán một loại lớp. */
const TRACK_BY_PROGRAM: Record<string, CourseTrack> = {
  "luyen-thi-hsk": "hsk_exam",
  "tieng-hoa-so-cap": "hsk",
  "tieng-hoa-trung-cap": "hsk",
  "tieng-hoa-cao-cap": "hsk",
  "tieng-hoa-giao-tiep-cap-toc": "communication",
  "tieng-hoa-doanh-nghiep": "business",
  "tieng-hoa-vip": "vip",
  "tieng-hoa-thieu-nhi": "kids",
  "tieng-hoa-nguoi-lon-tuoi": "senior",
};

/* ── Khoá học ────────────────────────────────────────────────────────── */

const emptySections = (): CourseSectionMap => ({
  audience: [],
  goal: [],
  duration: [],
  content: [],
  material: [],
  outcome: [],
  foundation: [],
  grammar_point: [],
  topic_item: [],
});

/** "Lớp HSK4" / "Luyện thi HSK3" → 4 / 3. `null` với GT1, VIP, thiếu nhi. */
const hskLevelOf = (level: CourseLevel): number | null => {
  const match = (level.code ?? level.name).match(/HSK\s?([1-6])/i);
  return match ? Number(match[1]) : null;
};

type LevelSpec = (typeof HSK_LEVELS)[number];

const sectionsOf = (level: CourseLevel, spec: LevelSpec | undefined): CourseSectionMap => ({
  ...emptySections(),
  audience: [...level.audience],
  goal: [...level.goals],
  duration: [...level.duration],
  content: [...level.content],
  material: [...level.materials],
  outcome: [...level.outcomes],
  // Chỉ HSK1 có phần vỡ lòng phát âm và bút thuận.
  foundation: spec && "foundation" in spec ? [...spec.foundation] : [],
  // Danh sách điểm ngữ pháp mẫu đã bị bỏ khỏi HSK_LEVELS — trang khoá chỉ nêu tổng số
  // điểm, không liệt kê từng điểm nữa.
  grammar_point: [],
  topic_item: spec ? [...spec.topics.items] : [],
});

const courseFromLevel = (
  program: ProgramSource,
  level: CourseLevel,
  orderIndex: number,
): CourseRow => {
  const hskLevel = hskLevelOf(level);
  const track = TRACK_BY_PROGRAM[program.slug] ?? "specialized";

  /**
   * Chỉ lộ trình HSK mới lấy thông số từ `HSK_LEVELS`.
   *
   * Lớp luyện thi cũng mang số cấp nhưng là lớp khác hẳn: LT-HSK3 chạy 2 tháng
   * trong khi cấp HSK3 chạy 4,5 tháng, và nó luyện đề chứ không dạy bộ chủ đề
   * của cấp. Lấy chung dữ liệu là hiển thị sai thời lượng lẫn nội dung.
   */
  const spec =
    track === "hsk" && hskLevel !== null
      ? HSK_LEVELS.find((l) => l.level === hskLevel)
      : undefined;

  const parsed = parseDuration(level.duration);
  const baseCode = level.code ?? level.name;

  return {
    // Mã lớp luyện thi trên lịch khai giảng là LT-HSK3, không phải HSK3 —
    // `courses.code` là UNIQUE nên hai khoá cùng cấp không được trùng mã.
    code: track === "hsk_exam" ? `LT-${baseCode}` : baseCode,
    // Lớp luyện thi có trang riêng /courses/luyen-thi-hsk-N, tách khỏi trang
    // lộ trình /courses/hsk-N của cùng cấp.
    slug:
      track === "hsk_exam" && hskLevel !== null
        ? `luyen-thi-hsk-${hskLevel}`
        : hskLevel !== null
          ? `hsk-${hskLevel}`
          : baseCode.toLowerCase(),
    title: level.name,

    // Phần marketing của khoá lấy từ chương trình mà nó thuộc về trên landing —
    // `courses.ts` mô tả ở tầng chương trình, không mô tả riêng từng cấp.
    summary: program.summary,
    intro: "",
    goal: program.goal,
    entry: spec ? spec.entry : program.entry,
    icon: program.icon as CourseIcon,
    thumbnailUrl: program.image ?? "",
    tags: [...program.tags],
    isFeatured: program.featured ?? false,
    contactOnly: program.contactOnly ?? false,
    note: program.note ?? "",

    track,
    hskLevel,
    // Lộ trình HSK lấy thời lượng từ HSK_LEVELS (nguồn chuẩn); lớp luyện thi và
    // giao tiếp chỉ có câu mô tả nên phải rút số từ đó.
    months: spec ? firstNumber(spec.months) : num(parsed.months),
    totalSessions: num(parsed.totalSessions),
    sessionHours: num(parsed.sessionHours),
    sessionsPerWeek: num(parsed.sessionsPerWeek),
    targetWords: spec ? groupedNumber(spec.words) : null,
    targetChars: spec ? groupedNumber(spec.chars) : null,
    grammarCount: spec ? spec.grammarCount : null,
    entryRequirement: spec ? spec.entry : "",
    canDo: spec ? spec.can : "",
    topicTitle: spec ? spec.topics.title : "",
    topicNote: spec && "note" in spec.topics ? spec.topics.note : "",
    price: null,
    priceDisplay: "Liên hệ trung tâm",
    orderIndex,
    status: "published",
    sections: sectionsOf(level, spec),
    textbookSlugs: [],
  };
};

/**
 * Toàn bộ khoá trung tâm dạy, phẳng.
 *
 * Chương trình `contactOnly` (doanh nghiệp, VIP, thiếu nhi, người lớn tuổi) có
 * `levels: []` nên không sinh khoá nào — đúng thực tế: chưa khảo sát thì chưa có
 * gì để dạy. Bốn trang giới thiệu đó là nội dung landing, không phải khoá.
 */
export const courseRows: CourseRow[] = programs.flatMap((program) =>
  program.levels.map((level, index) => courseFromLevel(program, level, index)),
);

/**
 * Sáu khoá chuyên biệt trong `catalog.ts` (giao tiếp công sở, ngữ pháp, trẻ em,
 * chuyên ngành) có trang riêng nhưng **không nằm trong `courses.ts`**, nên
 * adapter không sinh ra chúng.
 *
 * Với danh sách phẳng thì nhập tay được ngay ở console — chỉ cần đặt `code` và
 * `slug`. Để lộ ra đây để không ai tưởng chúng đã được import.
 */
export const unattachedCourseSlugs: string[] = specialCourses.map((item) => item.slug);
