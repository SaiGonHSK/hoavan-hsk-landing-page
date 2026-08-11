/**
 * Nối trang khách đang xem với ô "Khoá học quan tâm" của form đăng ký.
 *
 * Vấn đề: khách đã đi qua một trang khoá cụ thể (`/courses/hsk-3`), một buổi học thử
 * (`/trial/hsk-3`) hoặc bấm "Đăng ký giữ chỗ" trên đúng một lớp trong lịch khai giảng,
 * nhưng tới form thì mọi thứ về không — họ phải mở lại select và tìm đúng khoá vừa
 * đọc. Đó là một bước thừa ngay chỗ dễ bỏ cuộc nhất, và lead gửi lên còn có nguy cơ
 * ghi sai khoá so với trang đã đưa họ tới đây.
 *
 * Cách làm: mọi CTA đăng ký mang theo ngữ cảnh trong query (`?course=…&class=…`), form
 * tự chọn sẵn. Chỉ nhận **khoá tra** (slug/nhãn có thật trong danh sách) và mã lớp đã
 * lọc ký tự, không nhận chữ tự do từ URL — nội dung lead phải do trang site dựng, chứ
 * không phải do người gửi link soạn.
 */

import { onlineOfflineCourses } from "@/data/catalog";
import { courses } from "@/data/courses";

/** Lựa chọn cuối danh sách, cho khách chưa biết mình nên học khoá nào. */
export const COURSE_UNSURE = "Chưa biết, cần tư vấn";

/**
 * Các lựa chọn của select "Khoá học quan tâm".
 *
 * Lấy từ repo chứ không từ API: form phải dựng được cả khi API nội dung đang chết —
 * mất một select là mất luôn cả lead.
 */
export const courseOptions: string[] = [
  ...onlineOfflineCourses.map((c) => c.title),
  ...courses.map((c) => c.title),
  COURSE_UNSURE,
];

/** Bỏ dấu + hạ chữ thường để so nhãn không phụ thuộc cách gõ. */
const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Khoá tra → nhãn trong danh sách.
 *
 * Khoá tra của một trang khoá học là `catalogKey` (`hsk-3`, `luyen-thi-hsk-4`), của
 * chương trình là slug trong `courses.ts`. Trang học thử dùng chung slug với khoá cùng
 * cấp (`/trial/hsk-3` ↔ khoá `hsk-3`) nên khớp luôn mà không cần bảng riêng.
 */
const byKey = new Map<string, string>(
  [...onlineOfflineCourses, ...courses].map((item) => [item.slug, item.title]),
);

const byLabel = new Map<string, string>(
  courseOptions.map((title) => [normalize(title), title]),
);

/**
 * Giá trị chọn sẵn cho select, từ slug hoặc từ nhãn khoá.
 *
 * Trả `undefined` khi không có gì khớp — giáo trình, bộ tài liệu luyện thi và trang kỹ
 * năng đều dùng chung layout với trang khoá nhưng không phải khoá bán ra, chọn đại một
 * dòng gần giống là ghi sai nguyện vọng của khách.
 */
export function resolveCourseOption(input?: string | null): string | undefined {
  const raw = (input ?? "").trim();
  if (!raw) return undefined;
  return byKey.get(raw) ?? byLabel.get(normalize(raw));
}

/**
 * Mã lớp hợp lệ (`HSK1-C2`, `GT1.2`). Lọc chứ không escape: mã lớp đi vào ghi chú của
 * lead, nên chỉ cho qua thứ đúng hình dạng một mã lớp.
 */
const CLASS_CODE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,31}$/;

export const cleanClassCode = (value?: string | null): string | undefined => {
  const code = (value ?? "").trim();
  return CLASS_CODE.test(code) ? code : undefined;
};

/**
 * Id lớp trong bảng `classes` — `bigserial`, nên chỉ chữ số.
 *
 * Lọc ở đây chỉ chặn thứ không thể là một id; việc id đó có thật hay không do trang
 * `/register` trả lời bằng cách tra trong đợt đang đăng (`findClassById`). Không tra
 * được thì bỏ qua, chứ không mang một con số lạ đi đăng ký.
 */
const CLASS_ID = /^[0-9]{1,20}$/;

export const cleanClassId = (value?: string | null): string | undefined => {
  const id = (value ?? "").trim();
  return CLASS_ID.test(id) ? id : undefined;
};

export type RegisterContext = {
  /** Slug khoá/chương trình, hoặc đúng nhãn trong `courseOptions`. */
  course?: string;
  /** Mã lớp khi khách bấm đăng ký từ đúng một lớp trong lịch khai giảng. */
  classCode?: string;
  /**
   * Id lớp — thứ duy nhất nhận diện được một ca học.
   *
   * Đi kèm `classCode` chứ không thay thế: mã lớp là thứ đọc được trong ghi chú của
   * lead, còn id là thứ `POST /api/v1/schedule/classes/:id/register` cần. Mã không
   * unique (nhiều ca chung mã HSK1) nên một mình nó không đủ để ghi đúng lớp.
   */
  classId?: string;
  /** Khách tới từ trang học thử — ghi chú nói rõ họ muốn học thử trước. */
  trial?: boolean;
};

/** URL trang đăng ký mang theo ngữ cảnh của trang hiện tại. */
export function registerHref(context: RegisterContext = {}): string {
  const params = new URLSearchParams();

  const course = (context.course ?? "").trim();
  if (course) params.set("course", course);

  const code = cleanClassCode(context.classCode);
  if (code) params.set("class", code);

  const id = cleanClassId(context.classId);
  if (id) params.set("classId", id);

  if (context.trial) params.set("trial", "1");

  const query = params.toString();
  return query ? `/register?${query}` : "/register";
}

/**
 * Ghi chú điền sẵn cho ô "Mục tiêu / thời gian học mong muốn".
 *
 * Select chỉ chở được tên khoá, trong khi hai thứ giáo vụ cần biết để gọi lại đúng
 * việc — khách muốn giữ chỗ lớp nào, hay mới chỉ muốn học thử — lại không có ô riêng.
 * Đặt vào ghi chú thay vì thêm field: khách vẫn sửa hoặc xoá được, và server không phải
 * đổi schema lead.
 */
export function registerNote(context: RegisterContext = {}): string {
  const code = cleanClassCode(context.classCode);

  return [
    code ? `Đăng ký giữ chỗ lớp ${code}.` : "",
    context.trial ? "Muốn học thử một buổi trước khi đăng ký." : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Đọc ngữ cảnh từ query của `/register`. */
export function contextFromUrl(url: URL): RegisterContext {
  return {
    course: url.searchParams.get("course") ?? undefined,
    classCode: cleanClassCode(url.searchParams.get("class")),
    classId: cleanClassId(url.searchParams.get("classId")),
    trial: url.searchParams.get("trial") === "1",
  };
}
