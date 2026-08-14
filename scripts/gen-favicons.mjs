/**
 * Sinh bộ favicon từ logo trung tâm: public/favicon.ico, favicon-16.png,
 * favicon-32.png, apple-touch-icon.png.
 *
 * Mọi cỡ đều thu từ src/assets/logo-mark.webp — favicon phải là logo, không phải
 * một hình vẽ lại cho dễ nhìn.
 *
 * Vì sao vẫn phải xuất sẵn từng cỡ thay vì đưa mỗi file 192px cho trình duyệt tự
 * thu: logo có các nét maze mảnh, thuật toán thu nhỏ của trình duyệt làm chúng
 * nhoè hết. Thu bằng sharp rồi làm nét lại thì ở 32px vẫn còn đọc được vòng tròn,
 * nét maze và chữ "HSK" — mà 32px chính là cỡ trình duyệt lấy cho ô icon trên tab
 * ở màn Retina.
 *
 * Script chỉ cần chạy lại khi đổi logo — kết quả được commit vào public/.
 *
 * Chạy: yarn gen:favicon
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SOURCE_LOGO = "src/assets/logo-mark.webp";
const OUT_DIR = "public";
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * Thu logo về `size` px.
 *
 * `trim()` cắt phần trong suốt thừa quanh logo (ảnh gốc chừa lề khoảng 7–10px trên
 * khung 192): ở cỡ 16px thì mỗi pixel đều đáng, bỏ lề đi là hình tròn to thêm được
 * gần một phần mười.
 *
 * `sharpen` bù lại độ tương phản mà phép nội suy làm mất — không có nó thì nét
 * maze và chữ "HSK" nhoè vào nền đỏ.
 */
const logoPng = (size) =>
  sharp(SOURCE_LOGO)
    .trim()
    .resize(size, size, { fit: "contain", background: TRANSPARENT })
    .sharpen({ sigma: 0.6 })
    .png({ compressionLevel: 9 })
    .toBuffer();

/**
 * Đóng gói nhiều PNG thành một file .ico.
 *
 * Cần file này dù đã có thẻ <link rel="icon">: Google Search, một số crawler và
 * shortcut trên Windows bỏ qua thẻ mà request thẳng /favicon.ico — trước đây URL
 * đó trả 404 nên những chỗ ấy hiện icon rỗng.
 *
 * Cấu trúc: ICONDIR 6 byte, rồi mỗi ảnh một ICONDIRENTRY 16 byte, rồi phần dữ
 * liệu ảnh. Nhúng thẳng PNG (thay vì BMP) là hợp lệ từ Windows Vista và mọi trình
 * duyệt hiện nay đều đọc được.
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
  ICO_SIZES.map(async (size) => ({ size, data: await logoPng(size) })),
);
await writeFile(`${OUT_DIR}/favicon.ico`, buildIco(icoImages));
console.log(`[favicon] đã tạo ${OUT_DIR}/favicon.ico (${ICO_SIZES.join(", ")}px)`);

for (const size of [16, 32]) {
  await writeFile(`${OUT_DIR}/favicon-${size}.png`, await logoPng(size));
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
  .trim()
  .resize(TOUCH - TOUCH_PAD * 2, TOUCH - TOUCH_PAD * 2, {
    fit: "contain",
    background: TRANSPARENT,
  })
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
