#!/usr/bin/env node
// Chuyển 31 file .docx trong content/Web- Thư viện thành Markdown (CommonMark +
// GFM) và trích ảnh nhúng ra public/images/library/. Chỉ ĐỌC docx và VIẾT vào
// public/images/library/ + manifest.json cạnh script này — không đụng DB, không
// gọi API. Bước nạp DB nằm ở insert.mjs (đọc manifest.json này).
//
// Đường đi: mammoth (docx -> HTML, có convertImage để trích ảnh) -> rehype-parse
// -> rehype-remark -> remark-gfm -> remark-stringify (HTML -> Markdown thật, giữ
// bảng). Không dùng writer Markdown built-in của mammoth vì nó làm rớt cấu trúc
// bảng (đã kiểm chứng ở PLAN T1). Ảnh được nén qua sharp (webp, rộng ≤1600,
// quality ~80) — xem findings T4 #2.
//
//   node convert.mjs
//
// Idempotent theo nghĩa: chạy lại ghi đè đúng các file ảnh/manifest cùng tên —
// không tạo rác thêm. Không tự ý sửa gì trong content/Web- Thư viện (chỉ đọc).
//
// QUAN TRỌNG: SLUG_OVERRIDES trong categories.mjs phải đứng vững trước khi chạy
// lại file này bất cứ khi nào — manifest.json bị ghi đè toàn bộ mỗi lần chạy,
// và quyết định slug thủ công (2 bài "Câu chữ 把/被" trùng nhau, bài mianzi cụt
// nghĩa) chỉ tồn tại nhờ override, không phải nhờ chạy lại "nhớ" quyết định cũ.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import mammoth from "mammoth";
import sharp from "sharp";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";

import { CATEGORY_DIRS, SLUG_OVERRIDES } from "./categories.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LANDING_ROOT = path.resolve(__dirname, "..", "..");
const CONTENT_ROOT = path.join(LANDING_ROOT, "content", "Web- Thư viện");
const IMAGES_OUT = path.join(LANDING_ROOT, "public", "images", "library");
const MANIFEST_PATH = path.join(__dirname, "manifest.json");

// Ảnh bìa là LCP của trang bài viết (`[category]/[slug].astro` render
// `loading="eager" fetchpriority="high"`) — nén nhẹ để không tự làm chậm chính
// cái mình đang tối ưu. 1600px đủ cho container bài viết trên màn hình rộng
// nhất còn hay gặp; quality 80 là điểm cân bằng quen dùng cho webp ảnh chụp.
const IMAGE_MAX_WIDTH = 1600;
const IMAGE_QUALITY = 80;

fs.mkdirSync(IMAGES_OUT, { recursive: true });

/** "Từ vựng theo chủ đề" → "tu-vung-theo-chu-de" — CÙNG quy tắc với
 * `slugifyTitle` trong hoavan-hsk-console/app/landing/pages/services/index.ts,
 * chép lại ở đây vì hai component không share code. */
function slugifyTitle(title) {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Bóc "Bài N" / "Bai_N_" / "Bai N_" ở đầu tên file (có thể có 1-2 khoảng
 * trắng hoặc gạch dưới), và hậu tố "_SaigonHSK" ở cuối. Trả về lessonNumber (0
 * nếu không có số) và phần tên còn lại đã dọn (dùng làm title fallback).
 *
 * lessonNumber KHÔNG phải order_index của bảng landing_pages — order_index là
 * "thứ tự ghim" (server sắp ORDER BY order_index DESC để đẩy bài ghim lên đầu
 * blog), không phải số thứ tự bài học. lessonNumber chỉ đi vào manifest để
 * tham khảo (ví dụ nếu sau này muốn hiển thị "Bài 10" trong Title hoặc dùng để
 * sắp lại thứ tự trong course), KHÔNG được insert.mjs gửi lên API — xem finding
 * T4 #1 (blocker "orderIndex sai ngữ nghĩa"). */
function parseFilename(baseName) {
  let rest = baseName;
  let lessonNumber = 0;

  // "Bài" có dấu (Câu chuyện Hán tự, Tài liệu ngữ pháp) hoặc "Bai" mất dấu
  // (Thành ngữ, Văn hóa) — chấp cả hai, có thể 1-2 khoảng trắng/gạch dưới
  // trước số (thấy "Bài 6  Trật tự..." bị lặp khoảng trắng thật trong tên file).
  const m = /^b[àa]i[_ ]+(\d+)[_ ]+/i.exec(rest);
  if (m) {
    lessonNumber = parseInt(m[1], 10);
    rest = rest.slice(m[0].length);
  }

  rest = rest.replace(/_SaigonHSK$/i, "");
  rest = rest.replace(/_/g, " ").replace(/\s+/g, " ").trim();

  return { lessonNumber, fallbackTitle: rest };
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function hasVietnameseAccent(text) {
  return /[̀-ͯ]/.test(text.normalize("NFD")) || /[đĐ]/.test(text);
}

/** Có chữ Hán (CJK) hay không — dùng để cảnh báo slug có thể bị nuốt mất từ
 * khoá phân biệt, xem `slugDroppedWordsWarning`. */
function hasCJK(text) {
  return /[\u3400-\u9fff]/.test(text);
}

/** ALL-CAPS kiểu Word style "Heading 1" hay dùng ("BỔ NGỮ ĐỘNG LƯỢNG") — không
 * phải Title đẹp để hiển thị, dù đúng nội dung. */
function isAllCapsText(text) {
  return /[a-zA-ZÀ-ỹ]/.test(text) && text === text.toLocaleUpperCase("vi");
}

function capitalizeFirst(text) {
  return text.charAt(0).toLocaleUpperCase("vi") + text.slice(1);
}

/** Heading bị coi là "mục con đánh số", không phải tên bài — bắt cả số Ả Rập
 * và số La Mã, cả đánh số nhiều cấp ("4.1.") không có khoảng trắng ngay sau
 * dấu câu (khác với "10 mẫu câu..." — số rồi khoảng trắng ngay, không phải
 * đánh số mục). */
function looksLikeNumberedHeading(text) {
  return /^\(?[0-9]+[.)]/.test(text) || /^\(?[ivxlcm]+[.)]/i.test(text);
}

/** Toàn bộ heading <hN> trong HTML, theo đúng thứ tự xuất hiện. */
function allHeadings(html) {
  return [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: stripTags(m[2]),
    whole: m[0],
  }));
}

/** Ứng viên heading dùng làm Title khi tên file không có dấu tiếng Việt: cấp
 * nhỏ nhất xuất hiện trong bài, không phải mục đánh số. */
function numberlessHeadingCandidate(html) {
  const all = allHeadings(html);
  if (all.length === 0) return null;
  const minLevel = Math.min(...all.map((h) => h.level));
  return all.find((h) => h.level === minLevel && h.text && !looksLikeNumberedHeading(h.text)) ?? null;
}

/** Đoạn văn mà TOÀN BỘ nội dung nằm trong một `<strong>` (không có chữ nào
 * ngoài nó) — bỏ trước bookmark Word rỗng (`<a id="_Toc...">`) hay lẫn ở đầu. */
function boldOnlyContent(pInnerRaw) {
  const inner = pInnerRaw.replace(/<a\s+id="[^"]*"[^>]*>\s*<\/a>/gi, "").trim();
  const m = /^<strong>([\s\S]*)<\/strong>$/i.exec(inner);
  return m ? m[1] : null;
}

/** Nhiều file không dùng style Heading nào của Word cho tên bài — đoạn văn ĐẦU
 * TIÊN của toàn bài là một `<p><strong>Tên bài</strong></p>` (bôi đậm tay chứ
 * không phải Heading).
 *
 * Nguồn này quan trọng hơn tên file mất dấu: đã thấy thật trên dữ liệu — 3 file
 * Văn hóa tên file mất dấu ASCII ("Bai 3_Vi_sao...mianzi...") nhưng đoạn mở đầu
 * lại có dấu tiếng Việt đầy đủ và đúng nghĩa hơn hẳn tên file
 * ("**Vì sao người Trung Quốc thích nói "面子"?**"). */
function leadingBoldParagraph(html) {
  const m = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(html);
  if (!m) return null;
  const boldInner = boldOnlyContent(m[1]);
  if (boldInner == null) return null;
  const text = stripTags(boldInner);
  if (!text) return null;
  return { text, whole: m[0] };
}

/** Chọn Title theo đúng dữ liệu thật đã quan sát khi chạy full batch (không
 * phải suy đoán trước), theo thứ tự ưu tiên:
 *
 *   0. SLUG_OVERRIDES/TITLE không can thiệp Title — override chỉ quyết định
 *      slug (article-key), Title vẫn chọn theo quy tắc dưới đây như mọi file
 *      khác. Xem `articleKeyFor`.
 *   1. Tên file (sau khi bóc "Bài N"/"_SaigonHSK") NẾU đã có dấu tiếng Việt.
 *   2. Đoạn mở đầu bôi đậm cả câu (không phải Heading) — nguồn tốt nhất khi
 *      tên file mất dấu.
 *   3. Heading không đánh số ở cấp nhỏ nhất trong bài.
 *   4. Tên file dù mất dấu, còn hơn không có gì.
 *
 * ALL CAPS (từ style Heading của Word, hoặc gõ tay) thì hạ về viết hoa chữ đầu
 * câu thay vì giữ nguyên hoa toàn bộ. */
function pickTitle(html, fallbackTitle) {
  if (fallbackTitle && hasVietnameseAccent(fallbackTitle)) {
    return { title: fallbackTitle, source: "tên file" };
  }

  const lead = leadingBoldParagraph(html);
  if (lead && !looksLikeNumberedHeading(lead.text)) {
    const text = isAllCapsText(lead.text) ? capitalizeFirst(lead.text.toLocaleLowerCase("vi")) : lead.text;
    return { title: text, source: "đoạn mở đầu bôi đậm (tên file không có dấu tiếng Việt)" };
  }

  const candidate = numberlessHeadingCandidate(html);
  if (candidate) {
    const text = isAllCapsText(candidate.text) ? capitalizeFirst(candidate.text.toLocaleLowerCase("vi")) : candidate.text;
    return { title: text, source: `heading H${candidate.level} (tên file không có dấu tiếng Việt)` };
  }

  if (fallbackTitle) return { title: fallbackTitle, source: "tên file (không có dấu, không có gì tốt hơn)" };

  const anyHeading = allHeadings(html)[0];
  return { title: anyHeading?.text ?? "(chưa có tên)", source: "heading đánh số (vét cạn, cần soát tay)" };
}

/** Xoá khỏi HTML đoạn mở đầu bôi đậm HOẶC heading có chữ trùng Title đã chọn
 * (so sánh không dấu, không phân hoa/thường qua slugifyTitle) — Title đã hiện
 * riêng ở ArticleHero, để nguyên trong thân bài là lặp. */
function removeHeadingMatchingTitle(html, title) {
  const target = slugifyTitle(title);
  if (!target) return html;

  const lead = leadingBoldParagraph(html);
  if (lead && slugifyTitle(lead.text) === target) return html.replace(lead.whole, "");

  for (const h of allHeadings(html)) {
    if (slugifyTitle(h.text) === target) return html.replace(h.whole, "");
  }
  return html;
}

/** Đoạn bôi đậm dài dưới ngưỡng này gần như luôn là nhãn lặp lại nhiều lần
 * ("Ví dụ" — 5 ký tự) chứ không phải mục riêng đáng có trong mục lục — đo
 * trên dữ liệu thật (bài "100 từ vựng...công việc": "Ví dụ" x5, không mục
 * nào trong số tiêu đề thật của cùng bài ngắn hơn 8 ký tự). */
const MIN_HEADING_WORTHY_LENGTH = 8;

/** true nếu đoạn văn bôi đậm này GIỐNG một tiêu đề mục, false nếu giống câu ví
 * dụ tiếng Trung được bôi đậm để nhấn (đo trên dữ liệu thật — xem bổ sung T4
 * "vì sao nhiều bài không có mục lục"):
 *
 *   - Quá ngắn ("Ví dụ" một mình) — nhãn lặp, lên mục lục chỉ gây rối.
 *   - Toàn chữ Hán, không một chữ Latin nào ("我在一家中国公司工作。") — câu ví dụ,
 *     không phải tiêu đề.
 *   - Kết thúc bằng dấu câu kết câu CHỮ HÁN (。？！，、) — cùng lý do. Dấu câu
 *     Latin ở cuối (. ? ! :) KHÔNG loại: nhiều tiêu đề mục thật kết thúc bằng
 *     ":" ("Trợ từ ngữ khí 了:") hoặc là câu hỏi tiếng Việt thật ("Bạn đang làm
 *     việc ở đâu?").
 */
function isHeadingWorthyBoldLine(text) {
  if (text.length < MIN_HEADING_WORTHY_LENGTH) return false;
  if (!/[A-Za-zÀ-ỹ]/.test(text)) return false;
  if (/[。？！，、]$/.test(text.trim())) return false;
  return true;
}

/** Đếm số cụm "N." liên tiếp ở đầu chữ ("2.3." → 2 cụm, lồng sâu hơn "2." → 1
 * cụm) — dùng để suy cấp heading tương đối. */
function leadingDotDepth(text) {
  const m = /^\(?((?:\d+\.){1,4})/.exec(text.trim());
  return m ? m[1].split(".").filter(Boolean).length : 1;
}

/** Nâng đoạn văn bôi đậm giống tiêu đề thành heading thật (`<h2>`/`<h3>`…) —
 * xem bổ sung T4. Chỉ chạy SAU khi đã chọn Title và xoá đoạn mở đầu trùng
 * Title (không thì đoạn mở đầu dùng làm Title sẽ bị nâng thành heading rồi
 * `leadingBoldParagraph` mất tác dụng ở lần chạy sau).
 *
 * Cấp heading suy từ đúng cách các bài "Bài 15/16" đã tự lồng cấp bằng chữ
 * đậm+nghiêng (`***3.1. ...***`) cho mục con so với chữ đậm thường (`**3.
 * ...**`) cho mục lớn — đậm+nghiêng tính là lồng thêm một cấp so với số chấm,
 * số chấm nhiều hơn thì lấy số chấm. Không cắt ở H3/H4 cứng — cứ để
 * `normaliseHeadingLevels` nén cả bộ cấp cuối cùng cho phẳng, tự nâng ở đây
 * chỉ cần đúng THỨ TỰ lồng nhau tương đối. */
function boldParagraphsAsHeadings(html) {
  return html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (whole, _attrs, innerRaw) => {
    const inner = innerRaw.replace(/<a\s+id="[^"]*"[^>]*>\s*<\/a>/gi, "").trim();

    let nested = false;
    let matched = false;
    if (/^<strong>[\s\S]*<\/strong>$/i.test(inner)) {
      matched = true;
      nested = /^<strong>\s*<em>[\s\S]*<\/em>\s*<\/strong>$/i.test(inner);
    } else if (/^<em>\s*<strong>[\s\S]*<\/strong>\s*<\/em>$/i.test(inner)) {
      matched = true;
      nested = true;
    }
    if (!matched) return whole;

    const text = stripTags(inner);
    if (!isHeadingWorthyBoldLine(text)) return whole;

    const dotDepth = leadingDotDepth(text);
    const level = Math.min((nested ? Math.max(dotDepth, 2) : dotDepth) + 1, 6);

    return `<h${level}>${inner}</h${level}>`;
  });
}

/** Mọi đoạn văn `<p>` còn lại, theo thứ tự — dùng chọn nguồn summary/intro. */
function allParagraphsPlainText(html) {
  return [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1])).filter(Boolean);
}

/** Đoạn không dùng được làm summary/intro, kèm lý do — xem finding T4 #6.
 * Cùng bộ dấu hiệu với `isHeadingWorthyBoldLine` (ngắn / ALL CAPS / trông như
 * tiêu đề đánh số) vì đúng là cùng một loại rác: mảnh cấu trúc bài chứ không
 * phải văn xuôi mở đầu thật. */
function summaryQualityIssue(text) {
  if (!text) return "rỗng";
  if (text.length < 40) return `quá ngắn ("${text}")`;
  if (isAllCapsText(text)) return `viết hoa toàn bộ, giống tiêu đề chứ không phải mở bài ("${text}")`;
  if (looksLikeNumberedHeading(text)) return `trông như tiêu đề đánh số, không phải văn xuôi ("${text}")`;
  // Đoạn định nghĩa toàn chữ Hán đứng trước bản dịch tiếng Việt (thấy thật ở
  // "bo-ngu-kha-nang": "可能补语是表示可能和不可能语义的补语。…" rồi mới tới câu tiếng Việt) —
  // không dùng được làm mô tả cho meta description/schema.org tiếng Việt.
  if (!/[A-Za-zÀ-ỹ]/.test(text)) return `toàn chữ Hán, chưa có phần dịch tiếng Việt ("${text}")`;
  return null;
}

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

/** Chuẩn hoá cấp heading còn lại trong markdown về liền mạch bắt đầu từ H2:
 * gom các cấp H đang xuất hiện, sắp tăng dần, ánh xạ cấp nhỏ nhất -> 2, cấp kế
 * -> 3, ..., tối đa H4 (giữ đúng thứ tự lồng nhau tương đối, không suy ra cấp
 * mới ngoài những cấp đã có mặt thật trong bài). */
function normaliseHeadingLevels(markdown) {
  const levels = new Set();
  for (const m of markdown.matchAll(/^(#{1,6})\s/gm)) levels.add(m[1].length);
  if (levels.size === 0) return markdown;

  const sorted = [...levels].sort((a, b) => a - b);
  const remap = new Map();
  sorted.forEach((level, i) => remap.set(level, Math.min(2 + i, 4)));

  return markdown.replace(/^(#{1,6})(\s)/gm, (_match, hashes, ws) => {
    const target = remap.get(hashes.length) ?? hashes.length;
    return "#".repeat(target) + ws;
  });
}

/** Xoá link rỗng `[]()` mà rehype-remark sinh ra từ bookmark Word
 * (`<a id="_Toc...">`, không href không text). */
function stripEmptyWordAnchors(markdown) {
  return markdown.replace(/\[\]\(\)/g, "");
}

/** Mammoth escape `(`, `)`, `+` một cách quá tay — không ký tự nào trong ba
 * ký tự này có nghĩa Markdown khi nằm giữa câu, unescape cho sạch. KHÔNG đụng
 * `\.` hay `\!` vì có thể đổi nghĩa (danh sách có số, cú pháp ảnh `![]()`). */
function unescapeSafePunctuation(markdown) {
  return markdown.replace(/\\([()+])/g, "$1");
}

/** Bảng Word không có khái niệm `<thead>` — rehype-remark/remark-gfm luôn cần
 * một dòng header cho bảng GFM nên tự chế một dòng RỖNG, đẩy dòng đầu thật
 * (tiêu đề cột thật của bảng) xuống làm dữ liệu. `.rich th` tô nền xám nên kết
 * quả là một dải xám trống ở đầu gần hết bảng — xem finding T4 #5.
 *
 * Sửa: nếu dòng header GFM toàn ô rỗng, đôn dòng dữ liệu đầu tiên lên làm
 * header thật (dựng lại dòng phân cách cho đúng số cột), bỏ dòng rỗng gốc. */
function promoteEmptyTableHeaders(markdown) {
  const lines = markdown.split("\n");
  const out = [];
  const isRow = (l) => l != null && /^\s*\|.*\|\s*$/.test(l);
  const isSep = (l) => l != null && /^\s*\|[\s:-]+\|\s*$/.test(l) && l.includes("-");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sep = lines[i + 1];
    if (isRow(line) && isSep(sep)) {
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      const allEmpty = cells.length > 0 && cells.every((c) => c === "");
      const nextRow = lines[i + 2];
      if (allEmpty && isRow(nextRow)) {
        out.push(nextRow);
        out.push(`| ${Array(cells.length).fill("---").join(" | ")} |`);
        i += 2;
        continue;
      }
    }
    out.push(line);
  }
  return out.join("\n");
}

/** Rút chữ thuần (không markdown) từ một đoạn text markdown — dùng cho
 * summary/intro, vì `ArticleHero`/`ArticleGrid` in trực tiếp `{article.intro}`
 * / `{article.summary}` dạng text thô, không dựng Markdown. */
function markdownToPlainText(text) {
  return unescapeSafePunctuation(text)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\\([.!()+_*[\]])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** article-key: SLUG_OVERRIDES thắng tuyệt đối khi có mặt (khoá theo
 * sourceFile) — không đụng gì tới cách suy Title, chỉ đổi phần cuối slug. */
function articleKeyFor(sourceFile, title, fallbackTitle, baseName) {
  const override = SLUG_OVERRIDES[sourceFile];
  if (override) return { articleKey: override, overridden: true };
  const articleKey = slugifyTitle(title) || slugifyTitle(fallbackTitle) || slugifyTitle(baseName);
  return { articleKey, overridden: false };
}

/** Cảnh báo khi Title có chữ Hán mà slug (đã bỏ hết chữ Hán) có vẻ mất từ
 * khoá phân biệt — đúng ca đã xảy ra thật (file mianzi, slug tự suy cụt còn
 * "vi-sao-nguoi-trung-quoc-thich-noi", mất từ "mianzi"/"thể diện"). So sánh số
 * "từ" trong Title với số đoạn trong slug — lệch nhiều thì cảnh báo, không
 * chặn (SLUG_OVERRIDES đã lo trường hợp thật, đây chỉ để phát hiện SỚM ca kế
 * tiếp mà không cần đợi ai kêu). */
function slugDroppedWordsWarning(title, slug, overridden) {
  if (overridden || !hasCJK(title)) return null;
  const titleWords = title.trim().split(/\s+/).filter(Boolean).length;
  const slugWords = slug.split("/").pop().split("-").filter(Boolean).length;
  if (slugWords < titleWords * 0.6) {
    return (
      `Title có chữ Hán, slug tự suy chỉ còn ${slugWords} đoạn so với ${titleWords} từ trong Title — ` +
      `có thể đã mất từ khoá phân biệt khi slugify bỏ chữ Hán (giống ca "mianzi"). Soát lại, thêm vào ` +
      `SLUG_OVERRIDES trong categories.mjs nếu cần.`
    );
  }
  return null;
}

/** Escape tối thiểu cho text chèn vào thuộc tính HTML `alt="…"`. */
function escapeHtmlAttr(text) {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/** Chú thích ảnh: đoạn `<em>...</em>` (in nghiêng, không kèm chữ nào khác)
 * ngay sau đoạn chứa ảnh (`__IMG_PLACEHOLDER_i__`) — nguồn có sẵn trong docx
 * gốc kiểu "*Hình minh họa: …*" — dùng làm `alt`, xem finding T4 #10. */
function captionAfterPlaceholder(html, placeholder) {
  const re = new RegExp(
    `<p[^>]*>[^<]*<img[^>]*src="${placeholder}"[^>]*>[^<]*<\\/p>\\s*<p[^>]*>\\s*<em>([\\s\\S]*?)<\\/em>\\s*<\\/p>`,
    "i",
  );
  const m = re.exec(html);
  return m ? stripTags(m[1]) : null;
}

/** Xoá khỏi HTML đoạn chứa ĐÚNG ảnh bìa (ảnh đầu tiên, đã lên riêng trường
 * `coverImage`) — không thì ảnh bìa hiện hai lần: một lần ở đầu trang
 * (ArticleHero), một lần lặp lại ngay trong thân bài. Giữ nguyên mọi ảnh khác
 * (`extraImages`) — chỉ ảnh ĐẦU mới bị coi là ảnh bìa. Xem finding T4 #3. */
function removeCoverImageNode(html, coverSrc) {
  const escaped = coverSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wholeParagraph = new RegExp(`<p[^>]*>\\s*<img[^>]*src="${escaped}"[^>]*>\\s*<\\/p>`, "i");
  if (wholeParagraph.test(html)) return html.replace(wholeParagraph, "");
  const bareImg = new RegExp(`<img[^>]*src="${escaped}"[^>]*>`, "i");
  return html.replace(bareImg, "");
}

/** Nén một ảnh nhúng về webp, rộng ≤ IMAGE_MAX_WIDTH, quality IMAGE_QUALITY.
 * Ảnh bìa là LCP của trang bài viết — 15 ảnh gốc mammoth trích ra nặng tổng
 * ~21MB (lớn nhất 2.2MB, PNG/JPEG y nguyên từ docx), ảnh legacy cùng thư mục
 * là webp ~50KB — nén lại cho cùng cỡ, xem finding T4 #2. */
async function compressToWebp(buffer) {
  return sharp(buffer)
    .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: IMAGE_QUALITY })
    .toBuffer();
}

const htmlToMdProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeRemark)
  .use(remarkGfm)
  .use(remarkStringify, { bullet: "-", fences: true, resourceLink: true });

async function convertOne(categoryKey, filePath) {
  const baseName = path.basename(filePath, ".docx");
  const sourceFile = path.relative(LANDING_ROOT, filePath);
  const buf = fs.readFileSync(filePath);

  // Bước 1: docx -> HTML. Ảnh chưa viết ra đĩa ngay — chưa biết article-key
  // (suy từ title, mà title suy từ heading NẰM TRONG chính HTML này) nên trước
  // tiên gom ảnh vào bộ nhớ, thay bằng placeholder, rồi mới đặt tên/viết file
  // sau khi đã tính được article-key.
  const collectedImages = [];
  const { value: rawHtml, messages } = await mammoth.convertToHtml(
    { buffer: buf },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const index = collectedImages.length;
        const base64 = await image.readAsBase64String();
        collectedImages.push({ base64 });
        return { src: `__IMG_PLACEHOLDER_${index}__` };
      }),
    },
  );

  const warnings = messages.filter((m) => m.type === "warning").map((m) => m.message);

  const { lessonNumber, fallbackTitle } = parseFilename(baseName);
  const { title: rawTitle, source: titleSource } = pickTitle(rawHtml, fallbackTitle);
  const title = rawTitle.trim();
  const { articleKey, overridden } = articleKeyFor(sourceFile, title, fallbackTitle, baseName);
  const slug = `/library/${categoryKey}/${articleKey}`;
  const slugWarning = slugDroppedWordsWarning(title, slug, overridden);

  // Bước 2: giờ đã có article-key, nén ảnh về webp và viết ra
  // public/images/library/ với tên ổn định (trùng article-key cho ảnh đầu,
  // -2/-3... cho ảnh sau), lấy chú thích in nghiêng ngay sau ảnh làm alt, rồi
  // thay placeholder trong HTML bằng thẻ <img> thật.
  let htmlWithImages = rawHtml;
  const imageFiles = [];
  for (let index = 0; index < collectedImages.length; index++) {
    const placeholder = `__IMG_PLACEHOLDER_${index}__`;
    const fileName = index === 0 ? `${articleKey}.webp` : `${articleKey}-${index + 1}.webp`;
    const compressed = await compressToWebp(Buffer.from(collectedImages[index].base64, "base64"));
    fs.writeFileSync(path.join(IMAGES_OUT, fileName), compressed);

    const publicPath = `/images/library/${fileName}`;
    const caption = captionAfterPlaceholder(htmlWithImages, placeholder);
    const altAttr = caption ? escapeHtmlAttr(caption) : "";
    const imgTagRe = new RegExp(`<img[^>]*src="${placeholder}"[^>]*>`, "i");
    htmlWithImages = htmlWithImages.replace(imgTagRe, `<img src="${publicPath}" alt="${altAttr}">`);
    imageFiles.push(publicPath);
  }

  // Bước 3: bỏ đúng ảnh bìa (ảnh đầu) khỏi thân bài — đã hiện riêng ở
  // ArticleHero, để lại trong body là lặp (finding T4 #3). Ảnh còn lại
  // (extraImages) vẫn giữ trong body.
  const htmlNoDupCover = imageFiles.length > 0 ? removeCoverImageNode(htmlWithImages, imageFiles[0]) : htmlWithImages;

  // Bước 4: bỏ heading/đoạn mở đầu trùng Title (đã hiện riêng ở ArticleHero).
  let htmlBody = removeHeadingMatchingTitle(htmlNoDupCover, title);

  // Bước 5: nâng đoạn văn bôi đậm giống tiêu đề thành heading thật — PHẢI chạy
  // sau bước 4, không thì đoạn mở đầu vừa dùng làm Title (nếu có) bị nâng
  // thành heading trước khi kịp bị coi là trùng Title để xoá.
  htmlBody = boldParagraphsAsHeadings(htmlBody);

  // Nguồn summary/intro: đoạn văn xuôi ĐẦU TIÊN sau khi đã bỏ heading/đoạn mở
  // đầu trùng Title và nâng hết mục lục thật thành heading (nên còn lại toàn
  // là `<p>` văn xuôi, không còn sót đoạn cấu trúc bài).
  const paragraphs = allParagraphsPlainText(htmlBody);
  const naiveLead = paragraphs[0] ?? "";
  const goodLead = paragraphs.find((p) => !summaryQualityIssue(p));
  const leadPlain = markdownToPlainText(goodLead ?? naiveLead);
  const summaryWarning = goodLead ? null : `Không tìm được đoạn văn xuôi mở bài dùng được — ${summaryQualityIssue(naiveLead) ?? "rỗng"}.`;

  // Bước 6: HTML -> Markdown GFM thật (bảng, danh sách, in đậm...), rồi dọn rác.
  const rawMarkdown = String(htmlToMdProcessor.processSync(htmlBody)).trim();
  const cleaned = promoteEmptyTableHeaders(
    unescapeSafePunctuation(normaliseHeadingLevels(stripEmptyWordAnchors(rawMarkdown))),
  ).trim();

  const summary = truncate(leadPlain, 500);
  const intro = truncate(leadPlain, 4000);

  return {
    sourceFile,
    categoryKey,
    articleKey,
    slug,
    slugOverridden: overridden,
    title,
    titleSource,
    summary,
    intro,
    coverImage: imageFiles[0] ?? "",
    extraImages: imageFiles.slice(1),
    lessonNumber,
    body: cleaned,
    bodyBytes: Buffer.byteLength(cleaned, "utf-8"),
    warnings,
    slugWarning,
    summaryWarning,
  };
}

async function main() {
  const entries = [];

  for (const [dirName, categoryKey] of Object.entries(CATEGORY_DIRS)) {
    const dirPath = path.join(CONTENT_ROOT, dirName);
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.toLowerCase().endsWith(".docx"))
      .sort();

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      process.stdout.write(`→ ${dirName}/${file}\n`);
      const entry = await convertOne(categoryKey, filePath);
      entries.push(entry);
    }
  }

  // Chống trùng slug NGAY TRONG BATCH trước khi ghi manifest — insert.mjs sẽ
  // kiểm lại lần hai đối chiếu với DB, đây là lượt kiểm sớm cho rẻ.
  //
  // KHÔNG tự đổi tên khi trùng (đúng yêu cầu) — nhưng cũng không vì 1 nhóm
  // trùng mà chặn cả các bài không dính gì tới nó. Đánh dấu `needsDecision`
  // trên đúng các bài trong nhóm trùng còn sót (SLUG_OVERRIDES đã giải quyết
  // hai trường hợp đã biết — nhóm trùng ở đây là trùng MỚI, chưa từng thấy).
  const bySlug = new Map();
  for (const e of entries) {
    if (!bySlug.has(e.slug)) bySlug.set(e.slug, []);
    bySlug.get(e.slug).push(e);
  }
  const collisions = [...bySlug.entries()].filter(([, list]) => list.length > 1);
  for (const [slug, list] of collisions) {
    for (const e of list) {
      e.needsDecision = `Trùng slug "${slug}" với: ${list.filter((x) => x !== e).map((x) => x.sourceFile).join(", ")}. Không tự đặt slug khác — thêm vào SLUG_OVERRIDES trong categories.mjs.`;
    }
  }
  if (collisions.length > 0) {
    console.error(`\nTrùng slug trong batch (${collisions.length} nhóm) — ĐÁNH DẤU needsDecision, KHÔNG tự đổi tên:\n`);
    for (const [slug, list] of collisions) {
      console.error(`  "${slug}":`);
      for (const e of list) console.error(`      - ${e.sourceFile}  (title: "${e.title}")`);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(entries, null, 2));

  console.log(`\nXong: ${entries.length} bài → ${path.relative(LANDING_ROOT, MANIFEST_PATH)}`);

  const withWarnings = entries.filter((e) => e.warnings.length > 0);
  if (withWarnings.length > 0) {
    console.log(`\nCảnh báo mammoth (${withWarnings.length} file):`);
    for (const e of withWarnings) {
      console.log(`  - ${e.sourceFile}:`);
      for (const w of e.warnings) console.log(`      ${w}`);
    }
  } else {
    console.log("Không file nào có cảnh báo từ mammoth.");
  }

  const withSlugWarning = entries.filter((e) => e.slugWarning);
  if (withSlugWarning.length > 0) {
    console.log(`\nCảnh báo slug có thể mất chữ Hán (${withSlugWarning.length} file):`);
    for (const e of withSlugWarning) console.log(`  - ${e.sourceFile} → ${e.slug}: ${e.slugWarning}`);
  }

  const withSummaryWarning = entries.filter((e) => e.summaryWarning);
  if (withSummaryWarning.length > 0) {
    console.log(`\nCảnh báo summary (${withSummaryWarning.length} file):`);
    for (const e of withSummaryWarning) console.log(`  - ${e.sourceFile}: ${e.summaryWarning}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
