import { staticContent, type SiteContent } from "./content";

export type Teacher = SiteContent["teachers"][number];

/** Tĩnh — sửa `content/site.json` rồi deploy. Xem `DYNAMIC_KEYS` trong `content.ts`. */
export const teachers: Teacher[] = staticContent.teachers;
