import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";

/**
 * Dựng HTML cho thân bài viết Thư viện.
 *
 * `landing_pages.body` chứa **Markdown** do console soạn (Milkdown Crepe). Trước đây
 * nó chứa HTML của trình soạn thảo Tiptap, và những bài viết cũ vẫn còn nguyên như vậy
 * trong cơ sở dữ liệu — cả `content/pages.json` bản chụp kèm theo landing cũng thế.
 *
 * Không cần chuyển đổi dữ liệu, vì `allowDangerousHtml` cho HTML thô đi thẳng qua:
 * một thân bài toàn thẻ HTML là một khối HTML hợp lệ của CommonMark, ra sao vào đúng
 * y như vậy. Bài cũ chỉ thành Markdown khi có người mở nó ra sửa ở console.
 *
 * "Dangerous" ở đây là chuyện đã rồi chứ không phải chuyện mới: cột này vốn được render
 * bằng `set:html`, chỉ admin/staff vào được console để ghi vào nó, và landing không
 * nhận nội dung từ đâu khác.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeImageFigure)
  .use(rehypeStringify, { allowDangerousHtml: true });

export function renderArticleBody(body: string): string {
  if (!body.trim()) return "";
  return String(processor.processSync(body)).trim();
}

/** Đoạn văn mà nội dung chỉ có đúng một `<img>`. */
function loneImage(node: Element): Element | null {
  if (node.tagName !== "p") return null;

  const meaningful = node.children.filter(
    (child) => child.type !== "text" || child.value.trim() !== "",
  );
  const only = meaningful.length === 1 ? meaningful[0] : null;
  return only && only.type === "element" && only.tagName === "img" ? only : null;
}

/**
 * Ảnh chèn bằng bảng chọn “/” của console thành `<figure>` có chú thích.
 *
 * Khối ảnh của Crepe lưu xuống Markdown theo một quy ước riêng: `alt` giữ **tỉ lệ khung
 * ảnh** (`![1.00](…)`) còn `title` mới là chú thích người soạn gõ. In thẳng ra thì bài
 * viết có `alt="1.00"` — vô nghĩa với người dùng trình đọc màn hình và với Google.
 *
 * Nên ở đây: `alt` là một con số trần thì coi như không có, lấy chú thích làm `alt`, và
 * in chú thích ra dưới ảnh. Ảnh viết bằng cú pháp Markdown thường (`![mô tả](…)`) không
 * dính vào nhánh này — `alt` của nó là chữ, giữ nguyên.
 */
function rehypeImageFigure() {
  return (tree: Root) => {
    /*
     * Bấm ảnh trong bài để xem cỡ lớn.
     *
     * `data-lightbox` là quy ước dùng chung cả site — `components/Lightbox.astro` bắt sự
     * kiện ở `document` và Layout đã gắn nó trên mọi trang, nên chỉ cần đặt thuộc tính là
     * xong, không cần script riêng cho trang bài viết.
     *
     * Phải gắn ở đây chứ không phải trong `.astro`: thân bài đi vào trang bằng `set:html`
     * nên không phần tử nào của nó qua tay template.
     *
     * Ảnh trong bài vốn đã là bản đủ to (ảnh trích từ Word rộng tới 1600px) mà cột chữ chỉ
     * 832px — `data-lightbox` trỏ về chính nó, không cần dựng thêm bản phóng to.
     */
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;
      const src = node.properties.src;
      if (typeof src !== "string" || !src) return;

      node.properties.dataLightbox = src;
      const caption = node.properties.title ?? node.properties.alt;
      if (typeof caption === "string" && caption) node.properties.dataCaption = caption;
    });

    visit(tree, "element", (node: Element) => {
      const img = loneImage(node);
      if (!img) return;

      const alt = String(img.properties.alt ?? "");
      const title = String(img.properties.title ?? "");
      if (!/^\d+(\.\d+)?$/.test(alt)) return;

      img.properties.alt = title;
      delete img.properties.title;
      if (!title) return;

      // Thay chính đoạn văn thành <figure>: <figure> nằm trong <p> là HTML không hợp lệ,
      // trình duyệt sẽ tự đóng <p> lại và đẩy chú thích ra ngoài.
      node.tagName = "figure";
      node.properties = {};
      node.children = [
        img,
        { type: "element", tagName: "figcaption", properties: {}, children: [{ type: "text", value: title }] },
      ];
    });
  };
}
