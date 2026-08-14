/**
 * Rút mục lục ra khỏi HTML thân bài viết Thư viện.
 *
 * Nhận HTML đã dựng xong, tức đầu ra của `renderArticleBody` chứ không phải Markdown
 * thô: H2/H3 có sẵn nhưng không có `id`, nên tự gắn `id` ở đây rồi trả về cả HTML đã
 * gắn và danh sách mục. Không sửa ở phía console vì `id` là chuyện của trang đọc —
 * người soạn bài không cần biết tới nó.
 */

export type TocEntry = {
  id: string;
  text: string;
  /** 2 hoặc 3 — H3 hiện thụt vào một cấp so với H2. */
  level: number;
};

/**
 * "Phân biệt 了 và 过" → "phan-biet-le-va-guo"… đại khái vậy: bỏ dấu tiếng Việt, giữ
 * chữ và số, còn lại thành gạch nối. Chữ Hán không có dạng ASCII nên rơi hết, vì thế
 * mục nào ra chuỗi rỗng thì đánh số theo thứ tự (`muc-3`) để `id` luôn có và luôn khác nhau.
 */
function slugify(text: string, index: number): string {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `${slug}-${index + 1}` : `muc-${index + 1}`;
}

const decode = (text: string) =>
  text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

export function buildToc(body: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];

  // Chỉ H2/H3: H4 trong bài là chú thích nhỏ, đưa vào mục lục thì cột phải dài hơn bài.
  const html = body.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, inner) => {
      const text = decode(inner);
      if (!text) return match;

      // Người soạn dán HTML từ nơi khác thì thẻ có thể đã sẵn `id` — tôn trọng cái đó,
      // vì có thể đang có đường dẫn neo trỏ vào.
      const existing = /\sid=["']([^"']+)["']/i.exec(attrs);
      const id = existing ? existing[1] : slugify(text, toc.length);
      toc.push({ id, text, level: Number(level) });

      return existing
        ? match
        : `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html, toc };
}
