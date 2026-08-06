import { staticContent } from "./content";

export type Faq = { question: string; answer: string };

/** Tĩnh — sửa `content/site.json` rồi deploy. Xem `DYNAMIC_KEYS` trong `content.ts`. */
export const faqs: Faq[] = staticContent.faqs;
