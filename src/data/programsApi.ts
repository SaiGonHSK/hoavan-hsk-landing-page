import { courses as bundled, type Course } from "./courses";

/**
 * Chương trình đào tạo, soạn từ trang quản trị (bảng `landing_programs`).
 *
 * Một chương trình là cách trung tâm **bán** một nhóm khoá: "Tiếng Trung Sơ cấp" là
 * cách gọi chung của HSK1–HSK3. Console làm chủ phần thẻ — tên, mô tả, đầu ra, đầu
 * vào, chip, có nổi bật trên trang chủ không, thứ tự.
 *
 * Phần văn dài của **trang** chương trình (đối tượng, mục tiêu, thời lượng, giáo
 * trình, chuẩn đầu ra của từng cấp lớp) vẫn sinh từ `src/data/courses.ts` và ghép vào
 * theo `slug`: gõ lại toàn bộ khối đó trong một form console sẽ là công cụ tệ hơn
 * chính cái file nó thay thế.
 */

/** Chương trình như `GET /api/v1/programs` trả về. */
export type ApiProgram = {
  slug: string;
  title: string;
  summary: string;
  goal: string;
  entry: string;
  tags: string[];
  courseKeys: string[];
  isFeatured: boolean;
  contactOnly: boolean;
};

/** Chương trình đã ghép: phần thẻ từ API, phần văn dài từ repo. */
export type VisibleProgram = Course & { isFeatured: boolean };

let apiPrograms: ApiProgram[] = [];

/**
 * Nhận danh sách từ API. Trả về số chương trình; **0 nghĩa là không thay**.
 *
 * Từ chối danh sách rỗng: trang chủ và trang /courses đều dựng khối chương trình từ
 * đây, và bảng rỗng vì API lỗi một nhịp không đáng để làm trống hai trang đó — bản
 * trong repo vẫn phục vụ tiếp.
 */
export function applyPrograms(incoming: ApiProgram[]): number {
  if (!Array.isArray(incoming) || incoming.length === 0) return 0;

  apiPrograms = incoming.filter((program) => program?.slug?.trim());
  return apiPrograms.length;
}

/**
 * Ghép một chương trình từ API với bản trong repo cùng `slug`.
 *
 * Chỉ ghi đè bằng giá trị **không rỗng**: để trống một ô trong console nghĩa là "dùng
 * mặc định", không phải "xoá dòng đó khỏi trang".
 */
const merge = (program: ApiProgram): VisibleProgram | null => {
  const base = bundled.find((entry) => entry.slug === program.slug);
  // Chương trình mới tạo trong console mà repo chưa có trang chi tiết thì bỏ qua:
  // thẻ của nó sẽ dẫn tới một URL 404. Thêm trang trong repo là nó hiện ngay.
  if (!base) return null;

  return {
    ...base,
    title: program.title || base.title,
    summary: program.summary || base.summary,
    goal: program.goal || base.goal,
    entry: program.entry || base.entry,
    tags: program.tags.length > 0 ? program.tags : base.tags,
    courseKeys: program.courseKeys.length > 0 ? program.courseKeys : base.courseKeys,
    contactOnly: program.contactOnly,
    isFeatured: program.isFeatured,
  };
};

/** Mọi chương trình đang mở, theo thứ tự console sắp. */
export function visiblePrograms(): VisibleProgram[] {
  if (apiPrograms.length === 0) {
    // Chưa nạp được API: dùng bản trong repo để trang không trống.
    return bundled.map((entry) => ({ ...entry, isFeatured: entry.featured ?? false }));
  }
  return apiPrograms.map(merge).filter((entry): entry is VisibleProgram => entry !== null);
}

/** Chương trình nổi bật cho trang chủ. */
export const featuredPrograms = (): VisibleProgram[] =>
  visiblePrograms().filter((program) => program.isFeatured);

/** Tra một chương trình theo slug — dùng cho trang chi tiết và trang lịch. */
export const findProgram = (slug: string): VisibleProgram | undefined =>
  visiblePrograms().find((program) => program.slug === slug);

/**
 * Chương trình chứa khoá có khoá tra này, `undefined` nếu chưa chương trình nào nhận.
 *
 * Đây là chỗ lịch khai giảng nối lớp vào chương trình: một lớp chỉ biết nó dạy khoá nào,
 * còn `courseKeys` mới nói khoá đó thuộc chương trình nào. Tra qua `visiblePrograms()`
 * chứ không qua mảng trong repo, để người quản trị sửa `courseKeys` trong console là
 * trang lịch gom lại theo — nếu không thì lại có hai định nghĩa cho cùng một quan hệ.
 *
 * `undefined` là chuyện bình thường, không phải lỗi: console tạo được khoá mới bất cứ
 * lúc nào mà chưa chương trình nào nhận. Lớp của khoá đó vẫn lên trang lịch, đứng thành
 * khối riêng theo tên khoá — thà vậy còn hơn giấu một lớp đang tuyển sinh.
 */
export const programOfCourseKey = (catalogKey: string): string | undefined => {
  if (!catalogKey) return undefined;
  return visiblePrograms().find((program) => program.courseKeys.includes(catalogKey))?.slug;
};
