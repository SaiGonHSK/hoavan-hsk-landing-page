/**
 * Sinh bộ favicon: public/favicon.ico, favicon-16.png, favicon-32.png,
 * apple-touch-icon.png.
 *
 * Vì sao không dùng thẳng logo cho mọi cỡ: logo gốc (src/assets/logo-mark.webp)
 * là vòng tròn đỏ với các nét maze mảnh và chữ "HSK" rất nhỏ. Thu về 16px — đúng
 * cỡ icon trên tab trình duyệt màn hình thường — mọi chi tiết nhoè thành một chấm
 * đỏ, không ai nhận ra đó là logo. Nên ở cỡ nhỏ ta vẽ lại một mark rút gọn: đĩa
 * đỏ đặc + chữ trắng. Giữ nguyên màu đỏ #aa1e22 lấy từ logo để hai bản nhìn cùng
 * một nhà.
 *
 * 16px chỉ đủ chỗ cho **một** chữ cái: thử "HSK" ở cỡ này thì ba chữ dính vào
 * nhau thành vệt trắng, nhìn như ảnh lỗi. Nên 16px dùng "H", còn 32px trở lên mới
 * đủ "HSK". Màn Retina lấy bản 32 cho ô 16 CSS px, nên phần lớn người xem thấy
 * bản "HSK".
 *
 * Cũng vì lý do đó mà **không** khai favicon SVG: trình duyệt nào hiểu SVG sẽ ưu
 * tiên nó và bỏ qua các bản PNG theo cỡ, mất luôn chỗ tối ưu ở trên.
 *
 * Yêu cầu: font "Arial Black" có sẵn trong hệ thống (macOS có sẵn). Script chỉ
 * cần chạy lại khi đổi logo — kết quả được commit vào public/.
 *
 * Chạy: yarn gen:favicon
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const RED = "#aa1e22"; // màu đỏ lấy từ chính logo-mark.webp
const SOURCE_LOGO = "src/assets/logo-mark.webp";
const OUT_DIR = "public";

/**
 * Mark rút gọn: đĩa đỏ tràn viền + chữ trắng căn giữa.
 *
 * `textLength` + `lengthAdjust` ép chữ đúng bề ngang mong muốn, khỏi phụ thuộc
 * vào metric của font — nếu máy khác thay Arial Black bằng font thế thân thì chữ
 * vẫn nằm gọn trong đĩa thay vì tràn ra ngoài.
 */
function markSvg(size, text) {
  /*
    Chữ phải nằm gọn trong đĩa, mà bề ngang dùng được của hình tròn tại độ cao của
    chữ hẹp hơn đường kính: với nửa chiều cao chữ là h, dây cung chỉ rộng
    2·√(r²−h²). Lấy 0.62·size cho "HSK" là còn chừa mỗi bên khoảng 1/10 đường kính
    — để 0.78 thì chữ H và K thò ra ngoài rìa đĩa.
  */
  const fontSize = size * (text.length === 1 ? 0.66 : 0.4);
  const textWidth = size * (text.length === 1 ? 0.42 : 0.62);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${RED}"/>
      <text x="${size / 2}" y="${size / 2}" fill="#fff"
            font-family="Arial Black, Helvetica, sans-serif" font-weight="900"
            font-size="${fontSize}" textLength="${textWidth}"
            lengthAdjust="spacingAndGlyphs"
            text-anchor="middle" dominant-baseline="central">${text}</text>
    </svg>`,
  );
}

/** Render mark ở `size` px. Dưới 32px thì dùng "H", từ 32px mới đủ chỗ cho "HSK". */
const markPng = (size) =>
  sharp(markSvg(size, size < 32 ? "H" : "HSK"), { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

/**
 * Đóng gói nhiều PNG thành một file .ico.
 *
 * Cần file này vì Google Search, một số crawler và shortcut trên Windows không
 * đọc thẻ <link rel="icon"> mà request thẳng /favicon.ico — trước đây URL đó trả
 * 404 nên những chỗ ấy hiện icon rỗng.
 *
 * Cấu trúc: ICONDIR 6 byte, rồi mỗi ảnh một ICONDIRENTRY 16 byte, rồi phần dữ
 * liệu ảnh. Nhúng thẳng PNG (thay vì BMP) là hợp lệ từ Windows Vista và mọi
 * trình duyệt hiện nay đều đọc được.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 nghĩa là 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // số màu bảng palette — 0 vì ảnh truecolor
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const ICO_SIZES = [16, 32, 48];
const icoImages = await Promise.all(
  ICO_SIZES.map(async (size) => ({ size, data: await markPng(size) })),
);
await writeFile(`${OUT_DIR}/favicon.ico`, buildIco(icoImages));
console.log(`[favicon] đã tạo ${OUT_DIR}/favicon.ico (${ICO_SIZES.join(", ")}px)`);

for (const size of [16, 32]) {
  await writeFile(`${OUT_DIR}/favicon-${size}.png`, await markPng(size));
  console.log(`[favicon] đã tạo ${OUT_DIR}/favicon-${size}.png`);
}

/*
  apple-touch-icon phải **đục nền**: iOS không hiểu alpha khi đưa icon ra màn hình
  chính, nó ghép phần trong suốt lên nền đen và logo sẽ nằm trong một ô đen. Thêm
  viền trắng quanh logo vì iOS tự bo góc, ăn mất một phần rìa ảnh.
*/
const TOUCH = 180;
const TOUCH_PAD = 18;
await sharp(SOURCE_LOGO)
  .resize(TOUCH - TOUCH_PAD * 2, TOUCH - TOUCH_PAD * 2, { fit: "contain" })
  .extend({
    top: TOUCH_PAD,
    bottom: TOUCH_PAD,
    left: TOUCH_PAD,
    right: TOUCH_PAD,
    background: "#ffffff",
  })
  .flatten({ background: "#ffffff" })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT_DIR}/apple-touch-icon.png`);
console.log(`[favicon] đã tạo ${OUT_DIR}/apple-touch-icon.png (${TOUCH}×${TOUCH})`);
