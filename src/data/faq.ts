/** Câu hỏi thường gặp — đọc từ `content/site.json`. */
import { content } from "./content";

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = content.faqs;
