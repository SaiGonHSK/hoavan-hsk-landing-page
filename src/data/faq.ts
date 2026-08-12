import { getContent } from "./content";

export type Faq = { question: string; answer: string; category?: string };

/** Động — admin soạn ở console, landing đọc qua API (cache 60s). */
export const faqs = (): Faq[] => getContent().faqs;
