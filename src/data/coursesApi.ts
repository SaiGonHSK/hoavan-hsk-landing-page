import { onlineOfflineCourses, type CatalogItem } from "./catalog";
import { coursePathMap } from "./pages";

/**
 * Khoá học lấy từ trang quản trị.
 *
 * **Danh sách này quyết định trang nào tồn tại.** Khoá không có ở đây (chưa tạo, còn
 * bản nháp, hoặc đã lưu trữ) thì `/courses/<slug>` trả 404 và không hiện ở /courses —
 * ẩn khoá trong console là hạ trang đó xuống.
 *
 * Phần văn dài thì vẫn lấy từ repo: `catalog.ts` **sinh** nội dung chi tiết (chủ đề,
 * điểm ngữ pháp, thời lượng, đầu ra từng cấp) từ `HSK_LEVELS` bằng template, nên một
 * chỗ sửa là năm bộ dữ liệu cập nhật theo. Nhập tay lại toàn bộ trong console là bỏ mất
 * tính nhất quán đó. Vì vậy đây là **lớp ghép**: API cấp phần bán hàng và chương trình
 * học, repo cấp phần còn lại.
 */

/** Một mục của khối "Chương trình học" soạn từ console. */
export type CurriculumBlock = {
  title: string;
  items: string[];
};

/** Khoá học như `GET /api/v1/courses` trả về (chỉ các trường landing dùng). */
export type ApiCourse = {
  /** Chuỗi chứ không phải số — xem `CourseResponse.ID` bên server. */
  id: string;
  /** Khoá tra sang phần văn dài sinh từ `catalog.ts`. Không phải đường dẫn. */
  catalogKey: string;
  code: string;
  title: string;
  summary: string;
  intro: string;
  goal: string;
  entry: string;
  icon: string;
  tags: string[];
  isFeatured: boolean;
  contactOnly: boolean;
  note: string;
  priceDisplay: string;
  curriculum: CurriculumBlock[];
};

/**
 * Khoá học đã ghép nội dung repo, kèm đường dẫn trang của nó.
 *
 * `href` không nằm trong `CatalogItem` vì nó không thuộc về khoá: khoá học không có
 * cột `slug` nữa, đường dẫn do mục menu trỏ vào khoá quyết định. Khoá nào chưa có mục
 * menu thì không có trang, nên cũng không xuất hiện ở đây.
 */
export type VisibleCourse = CatalogItem & {
  href: string;
  id: string;
  isFeatured: boolean;
  /** Dòng nhỏ trên tên khoá ở thẻ trang chủ — "HSK1 → HSK3". */
  goal: string;
  /** Chip trang trí ở thẻ trang chủ. */
  tags: string[];
};

let apiCourses: ApiCourse[] = [];

export function applyCourses(incoming: ApiCourse[]): number {
  // Bỏ khoá không có id: không có gì để mục menu trỏ vào.
  apiCourses = incoming.filter((course) => course.id?.trim());
  return apiCourses.length;
}

/**
 * Khoá học đang hiển thị — đã ghép nội dung repo và gắn đường dẫn từ menu.
 *
 * Thứ tự theo API (server sắp theo `order_index` rồi tên), vì đó là thứ tự người quản
 * trị sắp trong console. Khoá chưa được đưa vào menu bị bỏ qua: nó không có URL nào
 * để dẫn tới, nên liệt kê ra chỉ tạo một liên kết chết.
 */
export function visibleCourses(): VisibleCourse[] {
  const paths = coursePathMap();
  const hrefByID = new Map<string, string>();
  for (const [href, courseID] of paths) hrefByID.set(String(courseID), href);

  return apiCourses.flatMap((course) => {
    const href = hrefByID.get(course.id);
    return href ? [toVisible(course, href)] : [];
  });
}

/**
 * Khoá theo id, **chưa** ghép nội dung repo và **không** cần có mục menu.
 *
 * Lịch khai giảng dùng hàm này: một lớp chỉ mang `courseId`, còn thứ trang lịch cần là
 * `catalogKey` để biết lớp thuộc chương trình nào. `visibleCourses()` không dùng được
 * vì nó bỏ khoá chưa có mục menu — GT1, GT2 và VIP chưa có trang riêng nhưng vẫn có lớp
 * đang tuyển sinh.
 */
export const apiCourseByID = (id: string): ApiCourse | undefined =>
  apiCourses.find((course) => course.id === id);

/** Khoá học ở một đường dẫn cụ thể — `/courses/hsk-1`, `/courses/textbooks/…`. */
export function findVisibleCourse(path: string): VisibleCourse | undefined {
  const courseID = coursePathMap().get(path);
  if (courseID == null) return undefined;

  const course = apiCourses.find((entry) => entry.id === String(courseID));
  return course ? toVisible(course, path) : undefined;
}

/** Khoá nổi bật cho trang chủ, giữ thứ tự của console. */
export function featuredApiCourses(): VisibleCourse[] {
  return visibleCourses().filter((course) => course.isFeatured);
}

const toVisible = (course: ApiCourse, href: string): VisibleCourse => ({
  ...merge(course),
  href,
  id: course.id,
  isFeatured: course.isFeatured,
  // Hai trường này chỉ có trong DB, `catalog.ts` không sinh ra chúng — nên lấy thẳng
  // từ API chứ không đi qua `merge`.
  goal: course.goal ?? "",
  tags: course.tags ?? [],
});

/**
 * Ghép một khoá từ API với bản trong repo cùng **khoá tra**.
 *
 * Ghép theo `catalogKey` chứ không theo đường dẫn: đường dẫn giờ do console đặt, nên
 * ghép theo nó nghĩa là đổi URL một cái là trang trống rỗng nội dung.
 *
 * Chỉ ghi đè bằng giá trị **không rỗng**: người quản trị để trống một ô nghĩa là "dùng
 * mặc định", không phải "xoá dòng đó khỏi trang".
 */
function merge(course: ApiCourse): CatalogItem {
  const base = onlineOfflineCourses.find((entry) => entry.slug === course.catalogKey);

  const merged: CatalogItem = {
    // Khoá chỉ có trong console (console tạo khoá mới mà repo chưa có bản nào) vẫn
    // render được: các danh sách dài chỉ là rỗng.
    ...(base ?? {
      slug: course.catalogKey || course.code,
      title: course.title,
      summary: "",
      intro: "",
      facts: [],
      content: [],
      outcomes: [],
    }),
    title: course.title || base?.title || course.code,
    summary: course.summary || base?.summary || "",
    intro: course.intro || base?.intro || "",
  };

  // `facts` dùng nhãn tiếng Việt làm khoá tra (`fact("Đầu vào")` trong CatalogDetail),
  // nên ghi đè theo nhãn thay vì thay cả mảng.
  if (course.entry?.trim()) {
    merged.facts = upsertFact(merged.facts, "Đầu vào", course.entry);
  }

  return merged;
}

/** Đổi giá trị của một fact theo nhãn, thêm mới nếu chưa có. */
function upsertFact(
  facts: CatalogItem["facts"],
  label: string,
  value: string,
): CatalogItem["facts"] {
  const index = facts.findIndex((fact) => fact.label.startsWith(label));
  if (index === -1) return [...facts, { label, value }];

  const next = [...facts];
  next[index] = { ...next[index], value };
  return next;
}

/** Khối "Chương trình học" soạn từ console; rỗng thì trang dùng nội dung repo. */
export function curriculumOf(courseID: string): CurriculumBlock[] {
  return apiCourses.find((entry) => entry.id === courseID)?.curriculum ?? [];
}
