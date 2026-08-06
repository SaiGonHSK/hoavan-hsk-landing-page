import { mkdirSync, writeFileSync } from "node:fs";

/**
 * Sinh ảnh bìa cho các bài Thư viện (blog).
 *
 * Bìa dùng chung một bố cục 16:9 — nền giấy hồng, lưới điểm, khung góc, chữ Hán lớn
 * làm hình chính, nhãn chuyên mục và pinyin ở dưới, gạch đỏ dưới đáy — nên cả danh
 * sách bài trông đồng nhất, giống cách làm của `gen-value-images.mjs`.
 *
 * Vì sao vẽ chứ không dùng ảnh chụp: bài Thư viện là kiến thức tiếng Trung, ảnh stock
 * không nói được nội dung bài, còn chữ Hán trọng tâm của bài thì nói được ngay.
 *
 * ITEMS phải khớp `coverImage` trong `hoavan-hsk-server/cmd/seed/data/articles.json`
 * (tên file = phần cuối của slug bài). Thêm bài mới: thêm một dòng vào ITEMS rồi chạy
 * `npm run gen:library`.
 */

const RED = "#b2182b";
const RED_700 = "#971324";

const ITEMS = [
  {
    file: "tu-vung-chu-de-gia-dinh",
    han: "家",
    pinyin: "jiā",
    category: "Từ vựng theo chủ đề",
  },
  {
    file: "phan-biet-le-va-guo",
    han: "过",
    pinyin: "guo",
    category: "Kiến thức ngữ pháp",
  },
  { file: "thanh-ngu-ve-hoc-tap", han: "学", pinyin: "xué", category: "Thành ngữ" },
  { file: "cau-chuyen-chu-hao", han: "好", pinyin: "hǎo", category: "Câu chuyện Hán tự" },
  {
    file: "tet-nguyen-dan-o-trung-quoc",
    han: "年",
    pinyin: "nián",
    category: "Văn hoá Trung Quốc",
  },
  {
    file: "bang-luong-tu-hsk1-hsk3",
    han: "量",
    pinyin: "liàng",
    category: "Tài liệu ngữ pháp",
  },
];

const W = 960;
const H = 540;
const CX = W / 2;

const svg = ({ han, pinyin, category }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffdfd"/>
      <stop offset=".55" stop-color="#fdf2f3"/>
      <stop offset="1" stop-color="#fbdcdf"/>
    </linearGradient>
    <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${RED}"/>
      <stop offset="1" stop-color="${RED_700}"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="${RED}" opacity=".16"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#paper)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- khung góc, giống nhau ở mọi bìa -->
  <g fill="none" stroke="${RED}" stroke-width="2" opacity=".2">
    <path d="M56 56h84M56 56v84"/>
    <path d="M${W - 56} 56h-84M${W - 56} 56v84"/>
    <path d="M56 ${H - 56}h84M56 ${H - 56}v-84"/>
    <path d="M${W - 56} ${H - 56}h-84M${W - 56} ${H - 56}v-84"/>
  </g>

  <!-- ô kẻ ô vuông tập viết, mờ, làm nền cho chữ Hán -->
  <g fill="none" stroke="${RED}" opacity=".16">
    <rect x="${CX - 132}" y="118" width="264" height="264" stroke-width="2"/>
    <path d="M${CX} 118v264M${CX - 132} 250h264" stroke-width="1.2" stroke-dasharray="6 10"/>
  </g>

  <!-- chữ Hán trọng tâm của bài -->
  <text x="${CX}" y="337" text-anchor="middle"
        font-family="'Noto Serif SC','Songti SC','SimSun',serif"
        font-size="200" fill="url(#ink)">${han}</text>

  <!-- pinyin + nhãn chuyên mục -->
  <text x="${CX}" y="424" text-anchor="middle"
        font-family="'Bricolage Grotesque',system-ui,sans-serif" font-size="30"
        font-weight="700" letter-spacing="6" fill="${RED}" opacity=".62">${pinyin}</text>
  <text x="${CX}" y="470" text-anchor="middle"
        font-family="'Bricolage Grotesque',system-ui,sans-serif" font-size="19"
        font-weight="700" letter-spacing="4" fill="${RED}" opacity=".5">${category.toUpperCase()}</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${RED}"/>
</svg>
`;

mkdirSync("public/images/library", { recursive: true });

for (const item of ITEMS) {
  const out = `public/images/library/${item.file}.svg`;
  writeFileSync(out, svg(item));
  console.log("wrote", out);
}
