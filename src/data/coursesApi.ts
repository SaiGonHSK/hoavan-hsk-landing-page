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

/** Một Mục của khối "Chương trình học" soạn từ console. */
export type CurriculumBlock = {
  title: string;
  items: string[];
};

/**
 * Khoá học như `GET /api/v1/courses` (công khai, không cần token) trả về — đúng 13
 * khoá JSON.
 *
 * Hình dạng chốt ở DELTA 2 (2026-08-18, docs/feature-unify-course-metadata.md, mục
 * "Hợp đồng API sau khi xong", cập nhật cùng ngày bỏ tiếp `months`): id, code,
 * catalogKey, track, hskLevel, status, orderIndex, thumbnailFileId, title, description,
 * audience, outcomes, curriculum. COURSE_METADATA giờ chỉ còn NĂM cột hiển thị: title,
 * description, audience ("Đầu vào"), outcomes ("Đầu ra"), curriculum — `catalogKey`
 * KHÔNG phải một trong năm cột đó, nó là danh tính COURSE (khoá ghép sang bản văn dài
 * ở chính repo này), và VẪN có mặt trong payload — xem field bên dưới.
 *
 * **Biến mất khỏi payload** (T13, cùng ngày): `summary`, `headline`, `goal`, `entry`,
 * `format`, `classSize`, `commitment`, `months`, `totalSessions`, `sessionsPerWeek`,
 * `targetWords`, `grammarCount`, `tags`, `icon`, `note`, `price`, `priceDisplay`,
 * `isFeatured`, `contactOnly`. Mọi nơi từng đọc các trường đó đã bỏ hoặc lùi về mặc
 * định của `catalog.ts` — xem `merge()` bên dưới và báo cáo T13. (`catalogKey` từng bị
 * liệt nhầm vào danh sách này và xoá khỏi payload cùng ngày, rồi được TRẢ LẠI ngay
 * trong ngày — xem field `catalogKey` và `deriveCatalogSlug` bên dưới.)
 *
 * `audience` mang nhãn hiển thị "Đầu vào" theo hợp đồng chung ba repo (console/
 * landing/app), nhưng cột vẫn tên `audience` — ĐỪNG đổi tên trường ở đây theo nhãn
 * hiển thị. Landing giữ nguyên tiêu đề mục đang có ("Đối tượng phù hợp") theo xác nhận
 * của người giao (2026-08-18): đó chính là Đầu vào, chỉ khác cách gọi ở console.
 */
export type ApiCourse = {
  /** Chuỗi chứ không phải số — xem `CourseResponse.ID` bên server. */
  id: string;
  code: string;
  /**
   * Khoá tra sang bản văn dài sinh từ `catalog.ts`. KHÔNG phải đường dẫn trang.
   *
   * Do console lưu trên chính khoá học, nên thêm khoá mới không cần sửa code landing.
   */
  catalogKey: string;
  track: string;
  /** `null` khi khoá không thuộc một cấp HSK cụ thể (GT1, GT2, VIP…). */
  hskLevel: number | null;
  status: string;
  orderIndex: number;
  /** `""` khi khoá chưa có ảnh đại diện — không phải `null`. */
  thumbnailFileId: string;
  title: string;
  /** Đoạn mô tả dài — thay cho `intro` cũ (server đã gộp vào cột này rồi bỏ `intro`). */
  description: string;
  /** "Bạn đạt được sau khoá học". Luôn là mảng, không null. */
  outcomes: string[];
  /** "Đầu vào" — danh sách đối tượng phù hợp. Luôn là mảng, không null. */
  audience: string[];
  /** Khối "Chương trình học". */
  curriculum: CurriculumBlock[];
};

/**
 * Khoá học đã ghép nội dung repo, kèm đường dẫn trang của nó.
 *
 * `href` không nằm trong `CatalogItem` vì nó không thuộc về khoá: khoá học không có
 * cột `slug` nữa, đường dẫn do mục menu trỏ vào khoá quyết định. Khoá nào chưa có mục
 * menu thì không có trang, nên cũng không xuất hiện ở đây.
 *
 * Không còn `isFeatured`/`tags`/`classSize`/`commitment` trên type này (T13, DELTA 2,
 * 2026-08-18): bốn trường này đã bỏ khỏi `ApiCourse` — "nổi bật"/"tags"/"sĩ số"/"cam
 * kết" không còn là khái niệm của COURSE_METADATA. Chương trình đào tạo
 * (`landing_programs`, `programsApi.ts`) vẫn có `isFeatured`/`tags`/`contactOnly` riêng
 * — một bảng khác hẳn, không đụng ở đây.
 */
export type VisibleCourse = CatalogItem & {
  href: string;
  id: string;
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

/** Khoá học ở một đường dẫn cụ thể — `/courses/hsk-1`, `/courses/textbooks/…`. */
export function findVisibleCourse(path: string): VisibleCourse | undefined {
  const courseID = coursePathMap().get(path);
  if (courseID == null) return undefined;

  const course = apiCourses.find((entry) => entry.id === String(courseID));
  return course ? toVisible(course, path) : undefined;
}

const toVisible = (course: ApiCourse, href: string): VisibleCourse => ({
  ...merge(course),
  href,
  id: course.id,
});

/**
 * Bảng tra cứng dùng làm ĐƯỜNG LÙI của `deriveCatalogSlug`, khi `catalogKey` thật (đã
 * trả lại vào payload, xem field cùng tên trên `ApiCourse`) rỗng — trước 2026-08-18 đây
 * từng là cách suy slug DUY NHẤT, từ lúc `catalogKey` bị xoá tạm khỏi API trong một đợt
 * dọn metadata rồi được trả lại ngay trong ngày. Còn giữ lại (không xoá) vì vẫn là
 * đường lùi hợp lệ cho khoá nào chưa có `catalogKey`.
 *
 * `code` KHÔNG dùng được trực tiếp làm khoá tra: hai bên đặt tên khác định dạng hẳn
 * nhau — `code` kiểu "HSK1"/"LT-HSK3"/"TE", còn slug của `catalog.ts` kiểu
 * "hsk-1"/"luyen-thi-hsk-3"/"tieng-trung-tre-em". So bằng nhau tuyệt đối (`code ===
 * slug`) sẽ luôn sai cho MỌI khoá — đúng cái tài liệu cảnh báo: "sai chỗ này là trang
 * trắng khối" cho 11 trang khoá đang publish. `deriveCatalogSlug` suy theo ba bước sau
 * khi `catalogKey` rỗng, đối chiếu với DB dev lúc T13 (22 khoá):
 *
 * 1. `hskLevel` khớp tuyệt đối với `hskCourses` (`hsk-${level}`) — chỉ HSK1–6 có cột
 *    này khác null trong DB.
 * 2. Mã luyện thi dạng `LT-HSK{n}` → `luyen-thi-hsk-{n}` (khớp `hskExamCourses`).
 * 3. Bảng tra cứng ngay dưới đây cho các mã còn lại ĐANG có bản thật trong
 *    `specialCourses` (kiểm bằng DB dev: TE, GT-CS1, GT-CS2, NP1, NP2, CN). Mã không có
 *    trong bảng này (VIP, GT1, GT2, GT-BOYA, GT-HN6, GT-HSK30, GT-TC…) rơi về
 *    `course.code` nguyên văn — không khớp gì trong `onlineOfflineCourses` (những mã
 *    này hoặc chưa có template, hoặc thuộc `textbookCourses` — một danh sách khác mà
 *    `merge()` không tra tới).
 */
const SPECIAL_CODE_TO_SLUG: Record<string, string> = {
  TE: "tieng-trung-tre-em",
  "GT-CS1": "giao-tiep-cong-so-co-ban",
  "GT-CS2": "giao-tiep-cong-so-nang-cao",
  NP1: "ngu-phap-co-ban",
  NP2: "ngu-phap-nang-cao",
  CN: "tieng-trung-chuyen-nganh",
};

function deriveCatalogSlug(course: ApiCourse): string {
  /*
    `catalogKey` là khoá ghép THẬT — dùng trước tiên.

    Nó từng bị bỏ khỏi API trong một lượt dọn metadata (2026-08-18) và landing phải tự suy
    slug từ `code`; phần suy diễn dưới đây là thứ còn lại của lượt đó, nay hạ xuống làm
    ĐƯỜNG LÙI. Suy từ `code` nghĩa là thêm một khoá mới ở console thì phải sửa code landing
    mới có trang — còn `catalogKey` thì giáo vụ tự đặt.
  */
  const key = course.catalogKey?.trim();
  if (key) return key;

  if (course.hskLevel != null) return `hsk-${course.hskLevel}`;

  const exam = course.code.match(/^LT-HSK(\d+)$/i);
  if (exam) return `luyen-thi-hsk-${exam[1]}`;

  return SPECIAL_CODE_TO_SLUG[course.code.toUpperCase()] ?? course.code;
}

/**
 * Ghép một khoá từ API với bản trong repo cùng **khoá tra** (`deriveCatalogSlug`).
 *
 * Chỉ ghi đè bằng giá trị **không rỗng**: người quản trị để trống một ô nghĩa là "dùng
 * mặc định", không phải "xoá dòng đó khỏi trang". Áp dụng cho CẢ chuỗi (`description`)
 * LẪN mảng (`outcomes`/`audience`) — một mảng RỖNG từ API nghĩa là "giáo vụ chưa nhập
 * ở console", không phải "xoá hết nội dung mẫu". Hiểu sai thành xoá sẽ làm 11 trang
 * khoá đang publish (những khoá console chưa đụng tới) mất sạch khối "Bạn đạt được
 * sau khoá học"/"Đối tượng phù hợp" đang sinh từ `catalog.ts`. Repo này chưa có test
 * runner cấu hình sẵn; ca này được kiểm tay ở báo cáo T13 bằng cách gọi thẳng `merge()`
 * với `outcomes: []`/`audience: []` và xác nhận `CatalogItem` giữ nguyên mảng của
 * `catalog.ts`.
 *
 * (T13, DELTA 2, 2026-08-18): `entry`, `goal`, `format`, `classSize`, `commitment`,
 * `months`, `totalSessions`, `targetWords`, `grammarCount` đã bỏ khỏi `ApiCourse` nên
 * KHÔNG còn được upsert vào `facts` ở đây nữa — `CatalogDetail.astro` đọc các fact
 * "Đầu vào"/"Mục tiêu"/"Hình thức"/"Thời lượng" thẳng từ `catalog.ts` (khi có) hoặc
 * mặc định tĩnh của chính component, không qua `merge()` nữa.
 */
function merge(course: ApiCourse): CatalogItem {
  const slug = deriveCatalogSlug(course);
  const base = onlineOfflineCourses.find((entry) => entry.slug === slug);

  const merged: CatalogItem = {
    // Khoá chỉ có trong console (console tạo khoá mới mà repo chưa có bản nào) vẫn
    // render được: các danh sách dài chỉ là rỗng.
    ...(base ?? {
      slug,
      title: course.title,
      summary: "",
      intro: "",
      facts: [],
      content: [],
      outcomes: [],
    }),
    title: course.title || base?.title || course.code,
    // `description` thay cho `intro` cũ — server đã gộp và bỏ hẳn cột `intro` (xem
    // ApiCourse). `CatalogItem.intro` là tên trường nội bộ của landing, giữ nguyên tên
    // đó (không đổi cả file `catalog.ts`) chỉ đổi nguồn đọc phía API.
    intro: course.description || base?.intro || "",
  };

  // Mảng RỖNG ≠ xoá (xem doc ở trên) — chỉ ghi đè khi API thật sự mang dữ liệu.
  if (course.outcomes?.length) {
    merged.outcomes = course.outcomes;
  }
  if (course.audience?.length) {
    merged.audience = course.audience;
  }

  return merged;
}

/** Khối "Chương trình học" soạn từ console; rỗng thì trang dùng nội dung repo. */
export function curriculumOf(courseID: string): CurriculumBlock[] {
  return apiCourses.find((entry) => entry.id === courseID)?.curriculum ?? [];
}
