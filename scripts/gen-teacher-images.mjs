/**
 * Nén card giảng viên từ src/assets/teacher/ ra public/images/teachers/<slug>.webp.
 *
 * Ảnh gốc do bộ phận truyền thông xuất là card vuông 2560×2560 đã nướng sẵn logo,
 * panel đỏ và tên + học vị vào trong ảnh. Giữ nguyên khung card đó — không cắt —
 * nên việc duy nhất cần làm là hạ kích thước và đổi sang WebP: bản gốc ~0.5 MB
 * mỗi ảnh là quá nặng để nhét 8 ảnh vào một trang.
 *
 * Chạy: yarn gen:teachers
 */
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const SOURCE_DIR = "src/assets/teacher";
const OUTPUT_DIR = "public/images/teachers";

/**
 * Card hiển thị rộng tối đa 24rem (384px), nhân 2 cho màn retina rồi làm tròn lên
 * cho ảnh lightbox mở to vẫn còn nét.
 */
const OUT_SIZE = 1080;

await mkdir(OUTPUT_DIR, { recursive: true });

const files = (await readdir(SOURCE_DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
if (files.length === 0) throw new Error(`Không tìm thấy ảnh nguồn trong ${SOURCE_DIR}`);

for (const file of files.sort()) {
  const slug = path.basename(file, path.extname(file));
  const source = path.join(SOURCE_DIR, file);
  const output = path.join(OUTPUT_DIR, `${slug}.webp`);

  await sharp(source).resize(OUT_SIZE, OUT_SIZE).webp({ quality: 82 }).toFile(output);

  console.log(`${slug} -> ${output}`);
}
