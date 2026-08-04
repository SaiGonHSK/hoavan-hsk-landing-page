/**
 * Nhận diện kênh khách đã vào landing, để lead ghi đúng `source` thay vì lúc nào
 * cũng là `landing`.
 *
 * Vì sao phải làm ở client: link quảng cáo Facebook đưa khách vào bất kỳ trang
 * nào (`/?fbclid=…`), nhưng lúc bấm gửi form thì `Referer` đã là chính landing,
 * server không còn thấy Facebook nữa. Nên trang phải bắt tín hiệu ngay lúc khách
 * đáp xuống rồi mang theo tới lần submit.
 *
 * Tín hiệu bắt theo thứ tự tin cậy: `utm_source` (marketing tự gắn) → `fbclid`
 * (Facebook tự thêm vào mọi cú click, kể cả khi thiếu utm) → domain của
 * `document.referrer`. Bắt được ở trang nào thì lưu vào `sessionStorage`, các
 * trang sau trong cùng phiên dùng lại — khách xem /courses rồi mới sang
 * /register vẫn còn nguồn.
 */

/**
 * Các kênh landing được phép tự khai. Cố tình KHÔNG có `hotline`: đó là kênh
 * giáo vụ nhập tay sau cuộc gọi, form công khai không được nhận vơ.
 */
export type LeadSource = "landing" | "facebook" | "zalo";

const KEY = "saigonhsk:lead-source";

/**
 * `utm_source` khớp đúng chuỗi, không dùng `includes`: "bigads" chứa "ig" nhưng
 * chẳng liên quan gì Instagram.
 */
const UTM: Record<string, LeadSource> = {
  facebook: "facebook",
  fb: "facebook",
  "facebook-ads": "facebook",
  fbads: "facebook",
  meta: "facebook",
  messenger: "facebook",
  ig: "facebook",
  instagram: "facebook",
  zalo: "zalo",
  "zalo-ads": "zalo",
  zns: "zalo",
};

/**
 * Khớp cả subdomain: click từ app Facebook đi qua `l.facebook.com`,
 * `m.facebook.com` hay `lm.facebook.com` tuỳ nền tảng.
 */
const HOSTS: [RegExp, LeadSource][] = [
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|fb\.watch|messenger\.com|instagram\.com)$/, "facebook"],
  [/(^|\.)zalo\.me$/, "zalo"],
];

const isSource = (value: string): value is LeadSource =>
  value === "landing" || value === "facebook" || value === "zalo";

/** Trình duyệt ở chế độ riêng tư có thể chặn storage — mất nguồn thì thôi, không được vỡ form. */
function read(): string | null {
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(source: LeadSource): void {
  try {
    window.sessionStorage.setItem(KEY, source);
  } catch {
    /* ignore */
  }
}

function fromReferrer(referrer: string): LeadSource | null {
  if (!referrer) return null;

  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }

  // Điều hướng trong chính site không phải kênh mới: bỏ qua để không ghi đè
  // nguồn Facebook đã bắt được ở trang đáp.
  if (host === window.location.hostname.toLowerCase().replace(/^www\./, "")) {
    return null;
  }

  return HOSTS.find(([pattern]) => pattern.test(host))?.[1] ?? null;
}

function detect(): LeadSource | null {
  const params = new URLSearchParams(window.location.search);

  const utm = (params.get("utm_source") ?? "").trim().toLowerCase();
  if (utm && UTM[utm]) return UTM[utm];

  if (params.get("fbclid")) return "facebook";

  return fromReferrer(document.referrer);
}

/**
 * Gọi ở mọi trang (Layout). Chỉ ghi khi bắt được tín hiệu thật, nên lần chuyển
 * trang nội bộ sau đó không xoá nguồn đã lưu; còn khách quay lại bằng một kênh
 * khác trong cùng phiên thì kênh mới nhất được tính.
 */
export function captureAttribution(): void {
  const found = detect();
  if (found) write(found);
}

/** Nguồn để gửi kèm lead. Không bắt được gì thì vẫn là `landing` như trước. */
export function leadSource(): LeadSource {
  const stored = read();
  return stored && isSource(stored) ? stored : "landing";
}

/** Nhãn tiếng Việt cho email fallback khi chưa cấu hình API. */
export const SOURCE_LABELS: Record<LeadSource, string> = {
  landing: "Website",
  facebook: "Facebook",
  zalo: "Zalo",
};
