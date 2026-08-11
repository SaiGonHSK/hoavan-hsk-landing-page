/**
 * Đổi mọi ảnh JPEG/PNG trong src/assets/ và public/images/ sang WebP, xoá bản gốc.
 *
 * Chạy lại được nhiều lần: ảnh đã là .webp thì bỏ qua. Dùng mỗi khi thả thêm ảnh
 * chụp từ Facebook (toàn .jpg) vào src/assets/ — kho ảnh giữ một định dạng duy nhất
 * thì không còn phải nhớ file nào đuôi gì lúc viết `import`.
 *
 *   node scripts/to-webp.mjs          # đổi thật
 *   node scripts/to-webp.mjs --dry    # chỉ in ra sẽ đổi những gì
 *
 * Lưu ý: script này KHÔNG sửa code. Sau khi chạy phải tự đổi đuôi trong các
 * `import ... from "@/assets/..."` và các đường dẫn "/images/..." tương ứng —
 * `astro build` sẽ báo lỗi ngay nếu còn sót.
 */

import { readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOTS = ["src/assets", "public/images"];

/**
 * Ảnh phải giữ đúng định dạng cũ:
 * - og-default.jpg: ảnh Open Graph. Một số bộ đọc thẻ (Zalo, một vài crawler cũ)
 *   không đọc được WebP, mà ảnh này chỉ tồn tại để cho chúng đọc.
 * - favicon.png: nằm ngoài public/images/ nên vốn đã không bị quét, kể ra cho rõ.
 */
const KEEP = new Set(["public/images/og-default.jpg", "public/favicon.png"]);

/**
 * Ảnh cảm nhận học viên: đường dẫn do trang quản trị soạn (`testimonials` nằm trong
 * `DYNAMIC_KEYS`, xem src/data/content.ts), API trả về chuỗi "/images/reviews/....jpg"
 * lúc chạy. Đổi tên file ở đây thì bản trong repo hết .jpg mà API vẫn trỏ .jpg → 404.
 * Muốn đổi thì phải đổi cả bên admin, không làm được từ repo này.
 */
const KEEP_DIRS = ["public/images/reviews"];

/**
 * Nén rất nhẹ tay, nhất là với `src/assets/`.
 *
 * Ảnh trong `src/assets/` là **bản gốc**: `<Image>` của Astro còn nén lại một lần nữa
 * theo đúng khổ hiển thị. Hai lần nén lossy là cộng dồn — bản gốc nén mạnh thì lần
 * nén sau chỉ làm nét thêm mấy vệt nhiễu của lần nén trước. Đây là kho ảnh nguồn,
 * không phải ảnh trả cho trình duyệt, nên ưu tiên giữ chất lượng chứ không tiết kiệm
 * dung lượng. Ảnh trong `public/` được trả thẳng cho trình duyệt, không qua bước nào
 * nữa nên nén thấp hơn một chút.
 */
const quality = (file) => (file.startsWith("src/assets") ? 95 : 90);

const dryRun = process.argv.includes("--dry");

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // thư mục không tồn tại — bỏ qua, không phải lỗi
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

const kb = (bytes) => `${Math.round(bytes / 1024)}KB`;

let converted = 0;
let before = 0;
let after = 0;

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
    if (KEEP.has(file)) continue;
    if (KEEP_DIRS.some((dir) => file.startsWith(`${dir}/`))) continue;

    const output = file.slice(0, -ext.length) + ".webp";

    if (dryRun) {
      console.log(`${file} → ${output}`);
      converted += 1;
      continue;
    }

    const source = file;
    const sourceSize = (await stat(file)).size;

    /**
     * PNG thường là hình vẽ nền phẳng (thumbnail khoá học, logo): WebP lossless
     * hay nhỏ hơn cả PNG gốc mà không mất pixel nào. JPEG thì lossless luôn phình
     * to. Nén cả hai kiểu rồi giữ bản nhẹ hơn — rẻ hơn là đoán.
     */
    const lossy = await sharp(source).webp({ quality: quality(file) }).toBuffer();
    const candidates = [lossy];

    if (ext === ".png") {
      candidates.push(await sharp(source).webp({ lossless: true, effort: 6 }).toBuffer());
    }

    const best = candidates.reduce((a, b) => (b.length < a.length ? b : a));

    /**
     * `writeFile` chứ không phải `sharp(best).toFile(output)`: đưa buffer đã nén
     * ngược vào sharp là bắt nó giải mã rồi nén *lần nữa* theo tham số mặc định —
     * bản lossless phía trên thành lossy, bản lossy bị nén hai lần.
     */
    await writeFile(output, best);
    await unlink(file);

    before += sourceSize;
    after += best.length;
    converted += 1;

    console.log(`${file} → ${path.basename(output)}  ${kb(sourceSize)} → ${kb(best.length)}`);
  }
}

if (converted === 0) {
  console.log("Không có ảnh JPEG/PNG nào cần đổi.");
} else if (dryRun) {
  console.log(`\n${converted} ảnh sẽ được đổi (chạy lại không có --dry để đổi thật).`);
} else {
  console.log(`\nĐã đổi ${converted} ảnh: ${kb(before)} → ${kb(after)}`);
}
