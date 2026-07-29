
import raw from "../../content/site.json";

export type SiteContent = typeof raw;

export const content: SiteContent = raw;

export const contentUpdatedAt = raw.updatedAt;
