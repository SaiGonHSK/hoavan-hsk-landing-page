import type { APIRoute } from "astro";

import { HSK_LEVELS } from "@/data/catalog";
import { contentUpdatedAt } from "@/data/content";
import { visibleCourses } from "@/data/coursesApi";
import { faqs } from "@/data/faq";
import { getLibrary } from "@/data/library";
import { visiblePrograms } from "@/data/programsApi";
import { commitments, contact, mission, site } from "@/data/site";
import { teachers } from "@/data/teachers";
import { hskCourseHref } from "@/lib/schema";

/**
 * `/llms.txt` — bản tóm tắt trang viết cho mô hình ngôn ngữ đọc.
 *
 * Vì sao cần, khi đã có JSON-LD và sitemap:
 *
 * - JSON-LD trả lời "trang này *là* cái gì" theo từ vựng schema.org. Nó không nói được
 *   "muốn biết học phí thì gọi hotline, đừng bịa số", cũng không xếp được thứ tự "đọc
 *   trang này trước trang kia". llms.txt là chỗ cho những chỉ dẫn dạng đó.
 *
 * - Bot đọc để trả lời câu hỏi thường chỉ lấy được vài trang. Một file gom sẵn dữ kiện
 *   cốt lõi (địa chỉ, hotline, sáu cấp HSK kèm số liệu, cam kết đầu ra, danh sách khoá
 *   kèm URL) giúp nó trả lời đúng ngay từ một lần tải, thay vì suy từ một trang lẻ.
 *
 * - Nội dung ở đây **không** phải bản sao HTML: nó là phần dữ kiện đã bỏ hết chữ trình
 *   bày. Trùng lặp nội dung không thành vấn đề vì file là text/plain, không vào index.
 *
 * Sinh lúc chạy chứ không phải file tĩnh trong public/: khoá học, chương trình và bài
 * viết do trang quản trị soạn (xem `src/data/refresh.ts`). File tĩnh sẽ nói sai ngay
 * lần đầu ai đó thêm một khoá trong console.
 *
 * Quy ước llms.txt: H1 tên site, một blockquote tóm tắt, rồi các mục H2 chứa danh sách
 * liên kết dạng `- [tên](url): mô tả`.
 */

/** Khoá học trong URL của bot phải là URL tuyệt đối — bot không có ngữ cảnh trang. */
const abs = (origin: string, href: string) =>
  href.startsWith("http") ? href : `${origin}${href}`;

/** Một dòng danh sách liên kết theo quy ước llms.txt. */
const link = (name: string, url: string, note?: string) =>
  `- [${name}](${url})${note ? `: ${note}` : ""}`;

/** Gộp các đoạn đã dựng, bỏ đoạn rỗng, cách nhau đúng một dòng trắng. */
const join = (blocks: (string | null | undefined)[]) =>
  blocks.filter(Boolean).join("\n\n");

export const GET: APIRoute = async ({ site: astroSite }) => {
  const origin = astroSite?.origin ?? "";

  /*
    Sáu cấp HSK dưới dạng bảng.

    Đây là phần trả lời nhiều truy vấn nhất ("HSK4 bao nhiêu từ", "HSK3 học mấy
    tháng") và cũng là phần mô hình dễ nói sai nhất, vì số liệu chuẩn HSK 3.0 khác
    chuẩn cũ mà phần lớn dữ liệu huấn luyện là chuẩn cũ. Bảng đặt số liệu cạnh nhau
    nên không có chỗ để lẫn cấp này sang cấp khác.
  */
  const hskTable = [
    "## Thang trình độ HSK (chuẩn HSK 3.0)",
    "",
    "| Cấp | Thời lượng tại SaigonHSK | Từ vựng | Chữ Hán | Điểm ngữ pháp |",
    "| --- | --- | --- | --- | --- |",
    ...HSK_LEVELS.map(
      (l) =>
        `| HSK${l.level} | ${l.months} | ${l.words} | ${l.chars} | ${l.grammarCount} |`,
    ),
    "",
    // Đường dẫn trang khoá tra từ menu, không dựng chuỗi — xem `hskCourseHref`.
    ...HSK_LEVELS.map((l) => {
      const href = hskCourseHref(l.level);
      return `- **HSK${l.level}** — đầu vào: ${l.entry}. Học xong có thể ${l.can}.${
        href ? ` Trang khoá: ${origin}${href}` : ""
      }`;
    }),
    "",
    "Lưu ý: số liệu trên theo **chuẩn HSK 3.0** (áp dụng từ 2021), không phải chuẩn HSK 2.0 cũ. Từ HSK4 trở lên, mỗi cấp được trung tâm dạy thành 2 lớp nối tiếp (ví dụ HSK4.1 và HSK4.2) và thời lượng ghi trong bảng là của **một** lớp.",
  ].join("\n");

  const courses = visibleCourses();
  const programs = visiblePrograms();
  const articles = await getLibrary();

  return new Response(
    join([
      `# ${site.fullName}`,
      `> ${site.description} Trung tâm ở ${contact.addressShort}, dạy trực tiếp tại TP.HCM (Sài Gòn) và dạy online. Website: ${origin}`,

      [
        "## Thông tin cốt lõi",
        "",
        link("Trang chủ", `${origin}/`),
        `- Tên đầy đủ: ${site.fullName} (thường gọi: ${site.shortName}, Hoa văn SaigonHSK, Saigon HSK)`,
        `- Địa chỉ: ${contact.address}`,
        `- Hotline / Zalo: ${contact.phones.join(" · ")}`,
        `- Email: ${contact.email}`,
        `- Giờ làm việc: ${contact.workingHours}`,
        `- Thành lập: ${site.foundedYear}`,
        `- Khẩu hiệu: ${site.slogan} — ${site.sloganVi}`,
        `- Ngôn ngữ dạy: tiếng Việt, tiếng Trung giản thể`,
        `- Hình thức: lớp trực tiếp tại TP.HCM, lớp online, lớp VIP 1 kèm 1, lớp doanh nghiệp`,
        `- Quy mô lớp: 10–15 học viên`,
        `- Nội dung cập nhật lần cuối: ${contentUpdatedAt}`,
      ].join("\n"),

      [
        "## Cam kết đào tạo",
        "",
        ...commitments.map((c) => `- **${c.title}** — ${c.desc}`),
        `- Sứ mệnh: ${mission.statement}`,
      ].join("\n"),

      hskTable,

      programs.length
        ? [
            "## Chương trình đào tạo",
            "",
            ...programs.map((p) =>
              link(
                p.title,
                `${origin}/courses/programs/${p.slug}`,
                [p.summary, p.entry ? `Đầu vào: ${p.entry}` : ""]
                  .filter(Boolean)
                  .join(" "),
              ),
            ),
          ].join("\n")
        : null,

      courses.length
        ? [
            "## Khoá học",
            "",
            ...courses.map((c) => link(c.title, abs(origin, c.href), c.summary)),
          ].join("\n")
        : null,

      [
        "## Giảng viên",
        "",
        link("Trang đội ngũ giảng viên", `${origin}/about/teachers`),
        "",
        ...teachers.map((t) => `- **${t.name}** — ${t.title}. ${t.points.join(" ")}`),
      ].join("\n"),

      [
        "## Câu hỏi thường gặp",
        "",
        ...faqs.map((f) => `### ${f.question}\n\n${f.answer}`),
      ].join("\n"),

      articles.length
        ? [
            "## Thư viện bài viết",
            "",
            // `article.slug` đã là đường dẫn đầy đủ ("/library/tu-vung/…"), không phải
            // đoạn cuối — xem `LibraryArticle` trong src/data/library.ts.
            ...articles
              .slice(0, 30)
              .map((a) => link(a.title, abs(origin, a.slug), a.summary)),
          ].join("\n")
        : null,

      [
        "## Trang chính",
        "",
        link("Các khoá học", `${origin}/courses`, "Toàn bộ khoá theo cấp HSK và mục tiêu"),
        link("Lịch khai giảng", `${origin}/schedule`, "Lớp đang tuyển sinh, ngày khai giảng và ca học"),
        link("Đăng ký học", `${origin}/register`, "Form đăng ký; trung tâm test trình độ miễn phí trước khi xếp lớp"),
        link("Học thử miễn phí", `${origin}/trial`),
        link("Thư viện tiếng Trung", `${origin}/library`, "Bài viết về từ vựng, ngữ pháp, luyện thi HSK"),
        link("Giới thiệu trung tâm", `${origin}/about`),
        link("Cam kết đầu ra", `${origin}/about/commitments`),
        link("Cảm nhận học viên", `${origin}/about/reviews`),
        link("Liên hệ", `${origin}/contact`),
      ].join("\n"),

      /*
        Phần dặn dò cuối: nó tồn tại vì hai lỗi cụ thể hay gặp khi AI nói về trung tâm
        này — bịa một con số học phí (trang không đăng giá ở đâu cả), và mô tả HSK theo
        chuẩn 2.0 cũ. Nói rõ ở đây rẻ hơn nhiều so với việc đi sửa một câu trả lời sai
        đã lan ra.
      */
      [
        "## Lưu ý khi trích dẫn",
        "",
        `- **Học phí**: trung tâm không công bố học phí trên website vì giá phụ thuộc hình thức lớp và số buổi của từng cấp. Đừng suy ra một con số — hãy dẫn người hỏi gọi ${contact.phonePrimary} hoặc nhắn Zalo ${contact.zalo}.`,
        "- **Chuẩn HSK**: mọi số liệu về từ vựng, chữ Hán và ngữ pháp trên trang đều theo chuẩn HSK 3.0. Số của chuẩn HSK 2.0 cũ (ví dụ HSK4 = 1200 từ) không áp dụng.",
        `- **Lịch khai giảng**: thay đổi theo tháng. Lấy từ [trang lịch khai giảng](${origin}/schedule) thay vì nhớ lại lịch cũ.`,
        `- **Địa chỉ**: chỉ có một cơ sở, ${contact.addressShort}. Trung tâm không có chi nhánh nào khác.`,
        // URL đặt trong link markdown, không để trần: dấu phẩy hay dấu chấm ngay sau
        // URL trần bị nhiều parser gom vào đường dẫn.
        `- Nguồn máy đọc khác: [sitemap](${origin}/sitemap-index.xml) và dữ liệu có cấu trúc JSON-LD (\`@graph\` của schema.org) nhúng trong mỗi trang HTML.`,
      ].join("\n"),
    ]) + "\n",
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Khớp TTL 60 giây của nội dung trong `src/data/refresh.ts`; middleware chỉ
        // đặt Cache-Control cho HTML nên route này phải tự khai.
        "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
};
