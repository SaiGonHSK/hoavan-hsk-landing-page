import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

/**
 * Sinh ảnh bìa cho các bài Thư viện (blog).
 *
 * Bìa dùng chung một bố cục 16:9 — chữ Hán lớn chiếm nửa trái trên nền giấy ngà, con
 * dấu đỏ và cột pinyin/chuyên mục ở nửa phải — nên cả danh sách bài trông đồng nhất,
 * giống cách làm của `gen-value-images.mjs`. Chi tiết bố cục xem chú thích ở `svg`.
 *
 * Vì sao vẽ chứ không dùng ảnh chụp: bài Thư viện là kiến thức tiếng Trung, ảnh stock
 * không nói được nội dung bài, còn chữ Hán trọng tâm của bài thì nói được ngay.
 *
 * `file` phải bằng phần cuối của slug bài, vì `landing_pages.cover_image` được đặt
 * theo đúng quy tắc đó (`/images/library/<phần-cuối-slug>.webp`). Thêm bài mới: thêm
 * một dòng vào ITEMS rồi chạy `npm run gen:library`.
 */

const RED = "#b2182b";
const INK = "#121316";
const PAPER = "#f7f3ef";

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

  /*
    Bìa cho các bài migrate từ tài liệu Word của giáo vụ mà bản gốc không có ảnh nào.

    Chữ Hán chọn theo ĐÚNG điểm ngữ pháp bài dạy, không phải chữ trang trí: bài "Câu chữ
    把" lấy 把, bài "Trợ từ động thái" lấy 了, bài "Câu so sánh" lấy 比. Người học nhìn bìa
    là biết bài nói về cái gì — đó là lý do bố cục này vẽ chữ chứ không dùng ảnh chụp.

    Hai chữ trùng nhau thì phải tách ra bằng nghĩa chứ đừng dùng lại: bổ ngữ trạng thái
    và bổ ngữ khả năng đều đánh dấu bằng 得, nên bài khả năng lấy 能 cho khỏi ra hai bìa
    y hệt nhau nằm cạnh nhau trong cùng chuyên mục.
  */
  { file: "cau-chu-ba", han: "把", pinyin: "bǎ", category: "Tài liệu ngữ pháp" },
  { file: "cau-chu-bei", han: "被", pinyin: "bèi", category: "Tài liệu ngữ pháp" },
  { file: "cau-so-sanh", han: "比", pinyin: "bǐ", category: "Tài liệu ngữ pháp" },
  { file: "cau-kiem-ngu", han: "兼", pinyin: "jiān", category: "Tài liệu ngữ pháp" },
  { file: "cau-ton-hien", han: "在", pinyin: "zài", category: "Tài liệu ngữ pháp" },
  { file: "dinh-ngu-tieng-trung", han: "的", pinyin: "de", category: "Tài liệu ngữ pháp" },
  { file: "tro-tu-dong-thai", han: "了", pinyin: "le", category: "Tài liệu ngữ pháp" },
  { file: "tro-tu-ngu-khi", han: "吗", pinyin: "ma", category: "Tài liệu ngữ pháp" },
  { file: "bo-ngu-thoi-luong", han: "久", pinyin: "jiǔ", category: "Tài liệu ngữ pháp" },
  { file: "bo-ngu-dong-luong", han: "次", pinyin: "cì", category: "Tài liệu ngữ pháp" },
  { file: "bo-ngu-xu-huong", han: "来", pinyin: "lái", category: "Tài liệu ngữ pháp" },
  { file: "bo-ngu-trang-thai", han: "得", pinyin: "de", category: "Tài liệu ngữ pháp" },
  { file: "bo-ngu-kha-nang", han: "能", pinyin: "néng", category: "Tài liệu ngữ pháp" },
  { file: "dong-tu-li-hop", han: "离", pinyin: "lí", category: "Tài liệu ngữ pháp" },
  { file: "dong-tu-trung-diep", han: "叠", pinyin: "dié", category: "Tài liệu ngữ pháp" },
  {
    file: "trat-tu-thanh-phan-cau-trong-tieng-han",
    han: "序",
    pinyin: "xù",
    category: "Tài liệu ngữ pháp",
  },
  {
    file: "phan-biet-thanh-ngu-va-quan-dung-ngu-trong-tieng-trung",
    han: "惯",
    pinyin: "guàn",
    category: "Quán dụng ngữ",
  },
];

const W = 960;
const H = 540;

/*
  Bố cục: chữ Hán chiếm trọn nửa trái, cột chữ nhỏ im lặng bên phải, con dấu đỏ ở trên.

  Bản trước dùng khung góc + lưới chấm + gradient hồng + chữ căn giữa tuyệt đối — nhiều
  thứ trang trí, không thứ nào có chủ đích, nhìn ra ngay là mẫu dựng sẵn. Bản này chỉ giữ
  đúng một điểm nhấn: chữ Hán của bài, to hết cỡ, đặt lệch. Mọi thứ còn lại phải nhỏ và im.

  Con dấu mang 华文 — tên trung tâm — chứ KHÔNG lặp lại chữ của bài. Dấu 印章 trong ấn loát
  Trung Hoa là dấu của nhà in, lặp lại chính chữ đang trưng bày thì nhìn thành lỗi lặp.

  Chỉ hai màu: mực đen trên giấy ngà, đỏ thương hiệu dành riêng cho con dấu và gạch chân.
*/
const svg = ({ han, pinyin, category }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>

  <!-- chữ Hán trọng tâm của bài -->
  <text x="300" y="452" text-anchor="middle"
        font-family="'Songti SC','Noto Serif SC','SimSun',serif"
        font-size="440" fill="${INK}">${han}</text>

  <!-- con dấu của trung tâm, nghiêng nhẹ như dấu đóng tay -->
  <g transform="translate(700,96) rotate(-4)">
    <rect width="126" height="126" rx="5" fill="${RED}"/>
    <text x="63" y="58" text-anchor="middle" font-family="'Songti SC',serif" font-size="50" fill="${PAPER}">华</text>
    <text x="63" y="110" text-anchor="middle" font-family="'Songti SC',serif" font-size="50" fill="${PAPER}">文</text>
  </g>

  <!-- pinyin, gạch đỏ, nhãn chuyên mục -->
  <text x="763" y="316" text-anchor="middle" font-family="Georgia,'Times New Roman',serif"
        font-size="52" font-style="italic" fill="${INK}">${pinyin}</text>
  <line x1="683" y1="352" x2="843" y2="352" stroke="${RED}" stroke-width="3"/>
  <text x="763" y="386" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17"
        font-weight="700" letter-spacing="1.5" fill="${INK}" opacity=".55">${category}</text>
</svg>
`;

/*
  Xuất thẳng ra .webp 1600×900 — đúng định dạng và kích thước trang đang dùng.

  Trước đây script dừng ở .svg, ai đó phải tự đổi sang webp bằng tay ở đâu đó; chạy
  `npm run gen:library` một mình không ra được thứ trang cần. SVG giờ chỉ là bước trung
  gian trong bộ nhớ, không ghi ra đĩa nữa.

  `density: 220` là để rasterize nét: sharp dựng SVG theo DPI, để mặc định 72 thì chữ Hán
  200px bị răng cưa khi phóng lên 1600px.

  BỎ QUA file đã có .webp, trừ khi chạy với `--force`. Không phải để chạy cho nhanh mà để
  giữ ảnh thật: bài Thư viện có hai nguồn ảnh bìa — bìa chữ do script này vẽ, và ảnh minh
  hoạ trích từ tài liệu Word của giáo vụ (scripts/migrate-library-docx/). Hai nguồn dùng
  chung quy tắc đặt tên theo slug nên có tên đụng nhau — `cau-chuyen-chu-hao` là một ca
  thật. Ghi đè vô điều kiện là bìa vẽ nuốt mất ảnh của người soạn, mà ảnh đó không có
  trong git để lấy lại.
*/
const force = process.argv.includes("--force");

mkdirSync("public/images/library", { recursive: true });

for (const item of ITEMS) {
  const out = `public/images/library/${item.file}.webp`;

  if (!force && existsSync(out)) {
    console.log("bỏ qua (đã có ảnh)", out);
    continue;
  }

  const png = await sharp(Buffer.from(svg(item)), { density: 220 })
    .resize(W * 2, H * 2, { fit: "fill" })
    .webp({ quality: 88 })
    .toBuffer();

  writeFileSync(out, png);
  console.log("wrote", out, `${Math.round(png.length / 1024)}KB`);
}
