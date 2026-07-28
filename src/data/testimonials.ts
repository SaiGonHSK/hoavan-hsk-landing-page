/** Phản hồi học viên — đọc từ `content/site.json`. */
import { content } from "./content";

export type Testimonial = (typeof content.testimonials)[number];

export const testimonials = content.testimonials;
