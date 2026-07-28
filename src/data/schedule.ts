/** Lịch khai giảng — đọc từ `content/site.json`. */
import { content } from "./content";

export type ScheduleRow = (typeof content.schedule)[number];

export const schedule = content.schedule;
