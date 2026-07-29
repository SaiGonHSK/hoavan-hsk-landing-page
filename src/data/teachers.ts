
import { content } from "./content";

export type Teacher = (typeof content.teachers)[number];
export type Banner = (typeof content.banners)[number];

export const teachers = content.teachers;
export const banners = content.banners;
