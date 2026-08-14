/**
 * Sinh ảnh Open Graph mặc định: src/assets/og-default.jpg (1200×630).
 *
 * Lý do cần bước này: ảnh gốc của trang là WebP, nhưng bộ đọc link của Zalo —
 * kênh chia sẻ chính ở Việt Nam — không hiển thị WebP ổn định, còn Facebook thì
 * chỉ crop đẹp khi ảnh đúng tỉ lệ 1.91:1. Xuất sẵn một bản JPEG 1200×630 để mọi
 * nền tảng đều render được thumbnail.
 *
 * Chạy: yarn gen:og
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SOURCE = "src/assets/classes/lop-luyen-thi-hsk.webp";
const OUTPUT = "src/assets/og-default.jpg";

/*
  Ảnh gốc 4:3 nên phải cắt bớt chiều cao; cắt giữa (`position: "centre"`) lấy quá
  nhiều trần nhà và ăn mất mép dưới. Chốt khung bắt đầu ở y=200 để giữ trọn dãy
  bàn học phía dưới lẫn backdrop SaigonHSK phía trên.
*/
const CROP_TOP = 200;

await mkdir(path.dirname(OUTPUT), { recursive: true });

const { width, height } = await sharp(SOURCE).metadata();
const cropHeight = Math.round((width * 630) / 1200);

await sharp(SOURCE)
  .extract({
    left: 0,
    top: Math.min(CROP_TOP, height - cropHeight),
    width,
    height: cropHeight,
  })
  .resize(1200, 630)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUTPUT);

console.log(`[og] đã tạo ${OUTPUT} (1200×630, JPEG)`);
