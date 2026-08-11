/**
 * Lớp markup dành cho **máy đọc** — Google rich result và, quan trọng hơn với trang
 * này, các cỗ máy trả lời bằng AI (AI Overviews, ChatGPT Search, Perplexity, Gemini).
 *
 * Khác biệt giữa "SEO schema" cổ điển và cái file này giải quyết:
 *
 * - Rich result chỉ cần vài loại node rời rạc (Course, FAQPage, Breadcrumb) là đủ để
 *   Google vẽ khung kết quả. AI thì *trích câu trả lời*, nên nó cần biết các node liên
 *   quan tới nhau thế nào: ai dạy, dạy ở đâu, khoá nào thuộc trung tâm nào. Vì vậy
 *   `graph()` gom mọi node của một trang vào **một** `@graph` duy nhất và các node
 *   tham chiếu nhau qua `@id`, thay vì mỗi node một thẻ `<script>` mồ côi.
 *
 * - AI trả lời câu hỏi dạng "HSK4 cần bao nhiêu từ vựng", "giảng viên có bằng gì".
 *   Những dữ kiện đó nằm trong HTML nhưng lẫn giữa chữ trình bày; khai thêm
 *   `DefinedTerm` cho từng cấp HSK và `Person` cho từng giảng viên là cách đưa đúng
 *   con số/bằng cấp ra dạng máy đọc được mà không phải đoán từ văn xuôi.
 *
 * Không khai `aggregateRating`: trung tâm chưa thu điểm số nào từ học viên, mà bịa
 * điểm vừa vi phạm chính sách dữ liệu có cấu trúc của Google (mất toàn bộ rich result
 * của tên miền, không chỉ riêng node đó) vừa khiến AI trích ra con số không có thật.
 * `Review` không kèm `reviewRating` — như `about/reviews.astro` đang làm — là đúng.
 *
 * `seo.ts` giữ phần chữ cho người đọc (title, description, keywords) và các builder
 * đã dùng ở nhiều trang; file này chỉ thêm node mới và phần gom graph.
 */

import { HSK_LEVELS } from "@/data/catalog";
import { visibleCourses } from "@/data/coursesApi";
import type { Teacher } from "@/data/teachers";
import { toIsoDuration } from "@/lib/seo";

/* ── Gom graph ───────────────────────────────────────────────────────── */

type Node = Record<string, unknown>;

/**
 * Bỏ `@context` của từng node con.
 *
 * Các builder trong `seo.ts` trả về node độc lập nên node nào cũng tự khai
 * `@context`. Hợp lệ khi đứng một mình, nhưng nhồi vào `@graph` thì lặp lại hàng chục
 * lần và một số parser cũ hiểu `@context` lồng là đổi ngữ cảnh giữa graph. Khai một
 * lần ở ngoài là đủ.
 */
const stripContext = ({ "@context": _drop, ...rest }: Node) => rest;

/**
 * Gói mọi node của trang vào một tài liệu JSON-LD.
 *
 * Một `<script>` cho cả trang chứ không phải mỗi node một thẻ: khi các node cùng nằm
 * trong một graph, `@id` trỏ chéo nhau được resolve ngay trong tài liệu — crawler
 * không cần suy luận rằng thẻ thứ ba nói về cùng cái tổ chức ở thẻ thứ nhất.
 */
export const graph = (nodes: (Node | null | undefined)[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes.filter((n): n is Node => Boolean(n)).map(stripContext),
});

/* ── Danh tính của một trang ─────────────────────────────────────────── */

/**
 * URL chuẩn của một trang. `Layout.astro` dùng hàm này cho `<link rel="canonical">`,
 * và các builder loại trang dưới đây dùng nó để sinh `@id`.
 *
 * Phải là **một** định nghĩa dùng chung: `@id` của node loại trang chỉ gộp được vào
 * node `WebPage` khi hai chuỗi giống nhau đến từng ký tự. Nếu Layout bỏ dấu `/` cuối
 * mà chỗ khác giữ lại, graph sẽ có hai node cho cùng một trang và không node nào đủ
 * thông tin.
 */
export const canonicalUrl = (pathname: string, site: URL | undefined) =>
  new URL(pathname.replace(/\/$/, "") || "/", site);

/** `@id` của node `WebPage` mà `Layout.astro` sinh cho trang hiện tại. */
export const webPageId = (pathname: string, site: URL | undefined) =>
  `${canonicalUrl(pathname, site).href}#webpage`;

/* ── Breadcrumb ──────────────────────────────────────────────────────── */

export type Crumb = { label: string; href?: string };

/**
 * `BreadcrumbList` của trang, kèm một node vá trỏ `WebPage.breadcrumb` về nó.
 *
 * Hai node chứ không một: node `WebPage` do `Layout.astro` sinh, còn breadcrumb do
 * component hero dựng (nó là chỗ duy nhất biết `crumbs`), nên không có cách nào để
 * Layout tự khai `breadcrumb`. Node thứ hai chỉ mang đúng `@id` của trang và thuộc tính
 * `breadcrumb` — JSON-LD gộp nó vào node `WebPage`, và graph có được liên kết
 * "trang này có breadcrumb kia" thay vì một BreadcrumbList không gắn vào URL nào.
 *
 * Trước đây năm chỗ tự dựng lại đúng khối này (ba hero, `CatalogDetail`,
 * `register.astro`); một định nghĩa để "Trang chủ" ở vị trí 1 không bao giờ lệch giữa
 * các trang.
 */
export function breadcrumbNodes(
  crumbs: Crumb[],
  pathname: string,
  site: URL | undefined,
): Node[] {
  const origin = site?.origin ?? "";
  const id = `${canonicalUrl(pathname, site).href}#breadcrumb`;

  return [
    {
      "@type": "BreadcrumbList",
      "@id": id,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${origin}/` },
        ...crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name: c.label,
          // Mục cuối cố tình không có `item`: theo tài liệu của Google, trang đang xem
          // không tự trỏ về mình trong breadcrumb.
          ...(c.href ? { item: `${origin}${c.href}` } : {}),
        })),
      ],
    },
    // Khai lại `@type` dù node chỉ để vá: node không có `@type` là JSON-LD hợp lệ nhưng
    // công cụ kiểm tra của Google báo cảnh báo, và người đọc HTML nguồn không đoán được
    // node trống này là gì.
    { "@type": "WebPage", "@id": webPageId(pathname, site), breadcrumb: { "@id": id } },
  ];
}

/** Bản đóng gói cho component tự phát thẻ `<script>` riêng thay vì đẩy qua Layout. */
export const breadcrumbGraph = (
  crumbs: Crumb[],
  pathname: string,
  site: URL | undefined,
) => graph(breadcrumbNodes(crumbs, pathname, site));

/* ── Tín hiệu cho trợ lý đọc thành tiếng ─────────────────────────────── */

/**
 * Phần nào của trang là câu trả lời, dành cho trợ lý giọng nói và các bot chỉ lấy một
 * đoạn ngắn.
 *
 * Chọn `cssSelector` thay vì `xpath`: cấu trúc DOM của trang còn đổi theo component,
 * còn hai selector này là hợp đồng ổn định — `h1` của `PageHero` và đoạn mô tả ngay
 * dưới nó (xem `src/components/PageHero.astro`).
 */
export const speakable = {
  "@type": "SpeakableSpecification",
  cssSelector: ["h1", "[data-speakable]"],
};

/* ── Giảng viên ──────────────────────────────────────────────────────── */

/**
 * Tách "Tiến sĩ — Đại học Sư phạm Hoa Đông, Thượng Hải" thành bằng cấp và trường.
 *
 * `content/site.json` viết bằng cấp và nơi học trong cùng một chuỗi vì đó là cách nó
 * được *hiển thị*. Với máy thì hai dữ kiện khác nhau: `hasCredential` trả lời "có bằng
 * gì", `alumniOf` là thực thể trường mà AI có thể nối sang tri thức nó đã có về trường
 * đó. Không có dấu "—" thì coi cả chuỗi là bằng cấp, không đoán thêm.
 */
const splitTitle = (title: string) => {
  const [degree, school] = title.split(/\s*—\s*/, 2);
  return { degree: degree?.trim() ?? "", school: school?.trim() ?? "" };
};

/**
 * `Person` cho một giảng viên — tín hiệu E-E-A-T mạnh nhất mà trang này có.
 *
 * Câu hỏi "trung tâm tiếng Trung nào ở TPHCM dạy tốt" được AI trả lời bằng cách so
 * bằng chứng về người dạy. Bằng Thạc sĩ/Tiến sĩ ở ĐH Ngôn ngữ Bắc Kinh, ĐH Sư phạm
 * Hoa Đông là bằng chứng thật của trung tâm, chỉ đang bị kẹt trong văn xuôi.
 */
export function personSchema(teacher: Teacher, origin: string): Node {
  const { degree, school } = splitTitle(teacher.title ?? "");
  const role = (teacher as { role?: string }).role;

  return {
    "@type": "Person",
    // Slug hoá tên để `@id` ổn định giữa các lần build; ảnh đã có sẵn slug đúng dạng.
    "@id": `${origin}/about/teachers#${slugifyName(teacher.name)}`,
    name: teacher.name,
    jobTitle: role || `Giảng viên tiếng Trung${degree ? ` — ${degree}` : ""}`,
    // Nối bằng ". ": các gạch đầu dòng trong `content/site.json` không có dấu chấm cuối,
    // nối bằng dấu cách sẽ ra "…Trung Quốc Trưởng bộ môn…" — dính hai câu vào nhau.
    description: teacher.points?.length
      ? `${teacher.points.join(". ").replace(/\.\.$/, ".")}.`
      : undefined,
    ...(teacher.image ? { image: `${origin}${teacher.image}` } : {}),
    ...(degree
      ? {
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            name: degree,
            credentialCategory: "degree",
          },
        }
      : {}),
    ...(school
      ? { alumniOf: { "@type": "CollegeOrUniversity", name: school } }
      : {}),
    worksFor: { "@id": `${origin}/#organization` },
    knowsLanguage: ["vi", "zh-Hans"],
    knowsAbout: ["Tiếng Trung Quốc", "Kỳ thi HSK", "Giảng dạy Hán ngữ quốc tế"],
  };
}

/**
 * Bỏ dấu tiếng Việt để `@id` chỉ còn ASCII.
 *
 * `@id` là URI: dấu tiếng Việt trong fragment phải percent-encode, và các công cụ
 * kiểm tra schema hiển thị chuỗi đã encode rất khó đọc. Tên giảng viên vốn đã có bản
 * slug trong đường dẫn ảnh, đây chỉ là sinh lại cùng quy tắc.
 */
const slugifyName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** `ItemList` các giảng viên, dùng cho trang `/about/teachers`. */
export const teacherListSchema = (teachers: Teacher[], origin: string): Node => ({
  "@type": "ItemList",
  name: "Đội ngũ giảng viên Trung tâm Hoa văn SaigonHSK",
  numberOfItems: teachers.length,
  itemListElement: teachers.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: personSchema(t, origin),
  })),
});

/* ── Thang HSK ───────────────────────────────────────────────────────── */

/**
 * Sáu cấp HSK khai dưới dạng `DefinedTermSet` — phần "AI markup" thuần nhất ở đây.
 *
 * Truy vấn kiểu "HSK4 bao nhiêu từ vựng", "HSK3 học mấy tháng" là loại câu hỏi AI trả
 * lời trực tiếp trong khung tóm tắt. Con số đã có trong `HSK_LEVELS`; khai thành
 * `DefinedTerm` là đưa nó ra dạng không cần parse văn xuôi tiếng Việt, và mỗi term trỏ
 * về trang khoá tương ứng nên nếu AI trích dẫn thì dẫn đúng URL của trung tâm.
 *
 * Đặt ở trang chủ và trang `/courses`: `@id` cố định nên các trang khác tham chiếu lại
 * được mà không phải khai trùng.
 */
export function hskTermSetSchema(origin: string): Node {
  return {
    "@type": "DefinedTermSet",
    "@id": `${origin}/#hsk-levels`,
    name: "Thang trình độ HSK (chuẩn HSK 3.0)",
    description:
      "Sáu cấp của kỳ thi năng lực Hán ngữ HSK theo chuẩn HSK 3.0, kèm số từ vựng, số chữ Hán, số điểm ngữ pháp và thời lượng đào tạo tại Trung tâm Hoa văn SaigonHSK.",
    inLanguage: "vi-VN",
    hasDefinedTerm: HSK_LEVELS.map((l) => {
      const href = hskCourseHref(l.level);
      return {
        "@type": "DefinedTerm",
        // `@id` gắn vào trang chủ, không vào trang khoá: cấp HSK vẫn tồn tại kể cả khi
        // trung tâm tạm ẩn trang khoá của cấp đó, và `@id` phải ổn định để các node
        // khác trỏ vào được.
        "@id": `${origin}/#hsk${l.level}`,
        name: `HSK${l.level}`,
        termCode: `HSK${l.level}`,
        ...(href ? { url: `${origin}${href}` } : {}),
        inDefinedTermSet: { "@id": `${origin}/#hsk-levels` },
        description: `HSK${l.level} theo chuẩn HSK 3.0 yêu cầu ${l.words} và ${l.chars}, gồm ${l.grammarCount} điểm ngữ pháp. Học viên đạt cấp này có thể ${l.can}. Tại SaigonHSK khoá HSK${l.level} học ${l.months}. Đầu vào: ${l.entry}.`,
      };
    }),
  };
}

/**
 * Đường dẫn trang khoá của một cấp HSK, tra từ danh sách khoá đang hiển thị.
 *
 * KHÔNG dựng chuỗi `/courses/hsk-${level}`: khoá học không còn cột slug, đường dẫn do
 * mục menu trong trang quản trị quyết định (xem `coursePathMap` trong `data/pages.ts`)
 * — thực tế đang là `/courses/hsk1`, không có dấu gạch. Đoán sai thì schema và llms.txt
 * đầy link 404, mà đó lại đúng là hai chỗ không ai mở ra xem để phát hiện.
 *
 * `undefined` khi cấp đó chưa có trang: chỗ gọi bỏ luôn thuộc tính `url` thay vì khai
 * một URL không tồn tại.
 */
export function hskCourseHref(level: number): string | undefined {
  const wanted = `hsk${level}`;
  return visibleCourses().find(
    (course) => course.title.toLowerCase().replace(/[\s.-]/g, "") === wanted,
  )?.href;
}

/* ── Loại trang ──────────────────────────────────────────────────────── */

/**
 * Các builder dưới đây chỉ khai *loại* trang cho một URL đã có node `WebPage` do
 * `Layout.astro` sinh: chúng dùng đúng `@id` đó nên JSON-LD gộp hai node thành một
 * trang mang cả hai `@type`. Nhờ vậy AI đọc ra "trang này là trang liên hệ của tổ chức
 * X" thay vì thấy hai trang khác nhau ở cùng một URL.
 *
 * Nhận `pathname` + `site` (tức `Astro.url.pathname` và `Astro.site`) chứ không nhận
 * URL dựng sẵn — để chỗ gọi không phải tự nhớ quy tắc bỏ dấu `/` cuối.
 */

type PageArgs = { pathname: string; site: URL | undefined };

export const contactPageSchema = ({ pathname, site }: PageArgs): Node => ({
  "@type": "ContactPage",
  "@id": webPageId(pathname, site),
  mainEntity: { "@id": `${site?.origin ?? ""}/#organization` },
});

export const aboutPageSchema = ({ pathname, site }: PageArgs): Node => ({
  "@type": "AboutPage",
  "@id": webPageId(pathname, site),
  mainEntity: { "@id": `${site?.origin ?? ""}/#organization` },
});

export const collectionPageSchema = ({ pathname, site }: PageArgs): Node => ({
  "@type": "CollectionPage",
  "@id": webPageId(pathname, site),
});

/* ── Hành động người dùng thực hiện được ─────────────────────────────── */

/**
 * Khai rõ trung tâm nhận đăng ký ở đâu và bằng cách nào.
 *
 * AI trả lời "đăng ký học tiếng Trung ở SaigonHSK thế nào" cần biết ba lối vào: form
 * trên web, hotline, Zalo. `potentialAction` là chỗ schema.org dành cho việc đó; khai
 * ở node tổ chức nên mọi trang đều mang theo.
 */
export const enrollActionSchema = (origin: string, phone: string): Node => ({
  "@type": "RegisterAction",
  "@id": `${origin}/#enroll`,
  name: "Đăng ký học tiếng Trung tại SaigonHSK",
  description: `Đăng ký qua form tại ${origin}/register, gọi hotline ${phone} hoặc nhắn Zalo. Trung tâm test trình độ miễn phí trước khi xếp lớp.`,
  target: {
    "@type": "EntryPoint",
    urlTemplate: `${origin}/register`,
    actionPlatform: [
      "https://schema.org/DesktopWebPlatform",
      "https://schema.org/MobileWebPlatform",
    ],
  },
  agent: { "@id": `${origin}/#organization` },
});

/* ── Lịch khai giảng ─────────────────────────────────────────────────── */

/**
 * `ScheduleSlot.weekday` theo `time.Weekday` của Go (0 = Chủ nhật) → tên thứ của
 * schema.org. schema.org chỉ nhận tên tiếng Anh, không nhận số.
 */
const DAY_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type ScheduleRowLike = {
  name: string;
  courseCode: string;
  courseTitle: string;
  programSlug: string;
  mode: string;
  openDateISO: string;
  duration: string;
  slots: readonly { weekday: number; startTime: string; endTime: string }[];
};

/** `classes.mode` → `courseMode` của schema.org. */
const courseMode = (mode: string) =>
  mode === "online" ? ["Online"] : mode === "hybrid" ? ["Onsite", "Online"] : ["Onsite"];

/**
 * Lịch khai giảng dưới dạng `ItemList` các `Course`, mỗi khoá kèm các `CourseInstance`
 * đang tuyển sinh.
 *
 * Gom theo khoá chứ không phẳng theo lớp: schema.org không có chỗ để một
 * `CourseInstance` tự trỏ ngược về khoá của nó — quan hệ chỉ tồn tại theo chiều
 * `Course.hasCourseInstance`. Phát một danh sách CourseInstance rời sẽ mất luôn thông
 * tin "ba lớp này là ba ca của cùng khoá HSK1", vốn là điều người hỏi "khi nào khai
 * giảng HSK1" cần biết.
 *
 * Lớp không có ngày khai giảng cố định (GT1, GT2, VIP — xếp lịch theo học viên) vẫn
 * được khai, chỉ không có `startDate`: bỏ chúng đi thì trang lịch hiện lớp mà dữ liệu
 * có cấu trúc lại nói không có.
 */
export function openingScheduleSchema(
  rows: readonly ScheduleRowLike[],
  origin: string,
  provider: { name: string; address: string },
): Node | null {
  if (!rows.length) return null;

  const byCourse = new Map<string, ScheduleRowLike[]>();
  for (const row of rows) {
    const key = row.courseCode || row.courseTitle;
    const list = byCourse.get(key);
    if (list) list.push(row);
    else byCourse.set(key, [row]);
  }

  const location = { "@type": "Place", name: provider.name, address: provider.address };

  const courses = [...byCourse.entries()].map(([key, group]) => {
    const { courseTitle, programSlug } = group[0];
    const modes = [...new Set(group.map((r) => r.mode))];

    return {
      "@type": "Course",
      "@id": `${origin}/schedule#${slugifyName(key)}`,
      name: courseTitle,
      // Mô tả dựng từ chính dữ liệu lịch, không viết tay: nó luôn khớp số lớp thật.
      description: `Lịch khai giảng khoá ${courseTitle} tại ${provider.name}: ${group.length} lớp đang nhận đăng ký${
        modes.length ? ` (${modes.join(", ")})` : ""
      }.`,
      inLanguage: "vi-VN",
      provider: { "@id": `${origin}/#organization` },
      ...(programSlug ? { url: `${origin}/courses/programs/${programSlug}` } : {}),
      hasCourseInstance: group.map((row) => ({
        "@type": "CourseInstance",
        name: row.name,
        courseMode: courseMode(row.mode),
        location,
        ...(row.openDateISO ? { startDate: row.openDateISO } : {}),
        ...(row.slots.length
          ? {
              courseSchedule: {
                "@type": "Schedule",
                repeatFrequency: "P1W",
                byDay: [...new Set(row.slots.map((s) => DAY_OF_WEEK[s.weekday]))].filter(
                  Boolean,
                ),
                startTime: row.slots[0].startTime,
                endTime: row.slots[0].endTime,
                scheduleTimezone: "Asia/Ho_Chi_Minh",
              },
            }
          : {}),
      })),
    };
  });

  return {
    "@type": "ItemList",
    name: "Lịch khai giảng các lớp tiếng Trung tại SaigonHSK",
    numberOfItems: courses.length,
    itemListElement: courses.map((course, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: course,
    })),
  };
}

/* ── Khoá học dạng chương trình đào tạo ──────────────────────────────── */

export type ProgramSchemaInput = {
  name: string;
  description: string;
  url: string;
  origin: string;
  /** Mô tả thời lượng tiếng Việt, ví dụ "24 buổi, 48 giờ học" — quy về ISO trước khi khai. */
  duration?: string;
  /** Chứng chỉ khoá hướng tới, ví dụ "HSK4". */
  credential?: string;
};

/**
 * `EducationalOccupationalProgram` — loại node Google dành riêng cho chương trình đào
 * tạo, tồn tại song song với `Course`.
 *
 * Khai cả hai không phải khai trùng: `Course` trả lời "môn học này dạy gì",
 * `EducationalOccupationalProgram` trả lời "chương trình này kéo dài bao lâu, học xong
 * được gì, tuyển ai" — đúng những gì người tìm khoá học hỏi. Google có rich result
 * riêng cho nó và AI ưu tiên node này khi so sánh các nơi đào tạo.
 */
export function programSchema(input: ProgramSchemaInput): Node {
  // `timeToComplete` là Duration của schema.org — chữ "3,5 tháng" khai vào đó là dữ
  // liệu sai. Đọc được ra ISO thì khai, không đọc được thì bỏ hẳn thuộc tính.
  const timeToComplete = toIsoDuration(input.duration);

  return {
    "@type": "EducationalOccupationalProgram",
    "@id": `${input.url}#program`,
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: "vi-VN",
    programType: "Khoá đào tạo ngoại ngữ ngắn hạn",
    educationalProgramMode: ["onsite", "online"],
    provider: { "@id": `${input.origin}/#organization` },
    occupationalCategory: "Tiếng Trung Quốc — Hán ngữ",
    ...(input.credential
      ? {
          educationalCredentialAwarded: `Chứng chỉ ${input.credential}`,
          competencyRequired: `Chuẩn HSK 3.0 — ${input.credential}`,
        }
      : {}),
    ...(timeToComplete ? { timeToComplete } : {}),
    offers: {
      "@type": "Offer",
      category: "Paid",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url: `${input.origin}/register`,
    },
  };
}
