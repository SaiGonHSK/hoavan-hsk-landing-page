import { writeFileSync } from "node:fs";

/**
 * Sinh ảnh minh hoạ cho khối "Vì sao chọn" (components/WhyUs.astro).
 *
 * Mọi ảnh dùng chung một bố cục 16:9 — nền giấy hồng, lưới điểm, hai vòng cung,
 * huy hiệu icon ở giữa, chữ Hán làm dấu nước ở góc, pinyin và gạch đỏ dưới đáy —
 * chỉ khác icon / chữ Hán / pinyin, nên cả lưới thẻ trông đồng nhất.
 *
 * Thêm giá trị mới: thêm một dòng vào ITEMS (khớp `id` trong content/site.json),
 * rồi chạy `npm run gen:values`.
 */

const RED = "#b2182b";
const RED_700 = "#971324";

const ICONS = {
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  target:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
};

const ITEMS = [
  { file: "vi-nguoi-hoc", icon: "heart", han: "心", pinyin: "xīn" },
  { file: "giang-vien-chat-luong", icon: "cap", han: "师", pinyin: "shī" },
  { file: "tiet-kiem-thoi-gian", icon: "clock", han: "时", pinyin: "shí" },
  { file: "hieu-qua-cao", icon: "target", han: "效", pinyin: "xiào" },
];

const W = 800;
const H = 450;
const CX = W / 2;
const CY = H / 2 - 6;

const svg = ({ icon, han, pinyin }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffdfd"/>
      <stop offset=".55" stop-color="#fdf2f3"/>
      <stop offset="1" stop-color="#fbdcdf"/>
    </linearGradient>
    <linearGradient id="badge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${RED}"/>
      <stop offset="1" stop-color="${RED_700}"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="${RED}" opacity=".16"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#paper)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- vòng cung trang trí, giống nhau ở mọi ảnh -->
  <g fill="none" stroke="${RED}" opacity=".14">
    <circle cx="${CX}" cy="${CY}" r="160" stroke-width="1.5"/>
    <circle cx="${CX}" cy="${CY}" r="200" stroke-width="1.5" stroke-dasharray="5 12"/>
  </g>
  <g fill="none" stroke="${RED}" stroke-width="2" opacity=".2">
    <path d="M56 56h74M56 56v74"/>
    <path d="M${W - 56} 56h-74M${W - 56} 56v74"/>
  </g>

  <!-- chữ Hán làm dấu nước ở góc, không chạm huy hiệu -->
  <text x="${W - 34}" y="${H + 34}" text-anchor="end"
        font-family="'Noto Serif SC','Songti SC','SimSun',serif"
        font-size="300" fill="${RED}" opacity=".09">${han}</text>

  <!-- huy hiệu icon -->
  <circle cx="${CX}" cy="${CY}" r="112" fill="#ffffff" opacity=".72"/>
  <circle cx="${CX}" cy="${CY}" r="82" fill="url(#badge)"/>
  <g transform="translate(${CX - 38} ${CY - 38}) scale(3.1667)" fill="none"
     stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
     color="#ffffff">${ICONS[icon]}</g>

  <!-- pinyin + gạch chân thương hiệu -->
  <text x="${CX}" y="${CY + 152}" text-anchor="middle"
        font-family="'Bricolage Grotesque',system-ui,sans-serif" font-size="26"
        font-weight="700" letter-spacing="7" fill="${RED}" opacity=".55">${pinyin.toUpperCase()}</text>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${RED}"/>
</svg>
`;

for (const item of ITEMS) {
  const out = `public/images/values/${item.file}.svg`;
  writeFileSync(out, svg(item));
  console.log("wrote", out);
}
