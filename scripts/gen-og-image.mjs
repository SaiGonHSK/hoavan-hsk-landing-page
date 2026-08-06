/**
 * Sinh ảnh Open Graph mặc định: public/images/og-default.jpg (1200×630).
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

const SOURCE = "src/assets/facility/classroom.webp";
const OUTPUT = "public/images/og-default.jpg";

await mkdir(path.dirname(OUTPUT), { recursive: true });

await sharp(SOURCE)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUTPUT);

console.log(`[og] đã tạo ${OUTPUT} (1200×630, JPEG)`);
