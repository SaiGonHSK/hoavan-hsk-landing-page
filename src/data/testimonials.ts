import { getContent } from "./content";

/**
 * Cảm nhận học viên — soạn từ trang quản trị (một trong `DYNAMIC_KEYS`).
 *
 * Kiểu khai tường minh chứ không suy từ `content/site.json`: `link` là trường mới,
 * chưa cảm nhận nào trong bản chụp có nó, nên suy kiểu sẽ ra `link` không tồn tại và
 * chỗ dùng phải ép kiểu.
 */
export type Testimonial = {
  name: string;
  role: string;
  /** Chữ thuần, KHÔNG phải HTML — in bằng nội suy, không dùng `set:html`. */
  quote: string;
  /** Ảnh trong `public/`; rỗng thì hiện chữ cái đầu của tên. */
  image?: string;
  /** Bài đăng gốc trên Facebook/Google; rỗng thì thẻ không bấm được. */
  link?: string;
};

/** `let` + `syncFromContent`: nội dung động, xem `content.ts`. */
export let testimonials: Testimonial[] = getContent().testimonials;

export function syncFromContent(): void {
  testimonials = getContent().testimonials;
}
