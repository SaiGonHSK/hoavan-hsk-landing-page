/**
 * Tách nền ảnh hero trang chủ: src/assets/hero/<tên>.webp
 * → src/assets/hero/<tên>-tach-nen.webp (WebP có kênh alpha).
 *
 * Vì sao phải tách nền: hero trang chủ đặt người đứng trước mấy nét vẽ tay (trái tim, tia
 * lấp lánh). Ảnh còn nền studio xám thì nét vẽ bị che thành một hình chữ nhật xám dán lên
 * trang — không còn ra sân khấu.
 *
 * Vì sao là script chứ không phải làm tay một lần: giống gen-faculty-image.mjs, ảnh kết quả
 * được commit vào repo nên người khác build không cần chạy lại, nhưng khi đổi ảnh hero thì
 * phải biết ảnh trong repo được tạo từ đâu và bằng cách nào.
 *
 * Chỉ chạy trên macOS có Xcode toolchain: bước tách nền dùng Vision framework
 * (scripts/cutout.swift — cùng cơ chế "Remove Background" của Preview).
 *
 * Chạy: yarn gen:hero                     # ảnh đang dùng ở Hero.astro
 *       yarn gen:hero hoc-vien-nam-nu    # thử ảnh khác trong src/assets/hero/
 *
 * Đổi ảnh hero thì chạy script với tên ảnh mới rồi sửa `import` trong Hero.astro — script
 * không tự sửa code, vì mỗi ảnh có bề ngang khác nhau nên còn phải xem lại vị trí mấy nét
 * vẽ sau lưng người (chú thích trong SVG ở Hero.astro nói rõ mấy con số đó tính từ đâu).
 */
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/** Ảnh đang dùng ở Hero.astro — dùng khi chạy script không kèm tham số. */
const DEFAULT_NAME = "hoc-vien-hsk1-hsk4";

const name = process.argv[2]?.replace(/\.webp$/, "") ?? DEFAULT_NAME;
const SOURCE = `src/assets/hero/${name}.webp`;
const OUTPUT = `src/assets/hero/${name}-tach-nen.webp`;

/**
 * Chiều cao ảnh xuất ra. Hero hiển thị ảnh cao nhiều nhất 35rem (560px), nhân 2 cho màn
 * retina là 1120 — để 1200 cho `<Image>` còn dư mà thu nhỏ (thu nhỏ thật thì nét hơn là
 * hiện gần 1:1). Ảnh gốc cắt ra cao ~1330px nên đây vẫn là thu nhỏ, không phóng to.
 */
const OUT_HEIGHT = 1200;

/*
 * ------------------------------------------------------------------------------------
 * Dọn viền sau khi tách nền
 * ------------------------------------------------------------------------------------
 *
 * Mặt nạ của Vision cho ra một dải chuyển tiếp rộng 3–4 pixel quanh người, và MÀU trong
 * dải đó vẫn là màu quan sát được ở ảnh gốc: tức là màu người đã trộn sẵn với phông studio
 * xám. Dán lên trang trắng, dải đó hiện thành một quầng xám mờ ôm quanh người — nhìn như
 * ảnh chưa tách hết nền, chứ không phải như người đứng trên nền trang.
 *
 * Đo trên bản cũ của hoc-vien-hsk1-hsk4-tach-nen.webp: 14 nghìn pixel có alpha 1–32 mang
 * màu trung bình (155,152,160) — đúng bằng màu phông, không dính gì tới người.
 *
 * Ba bước dưới đây chữa đúng ba nguyên nhân, làm trên pixel thô nên không phụ thuộc lần
 * mã hoá nào:
 *   1. `extendColour` — loang màu người ra ngoài rìa, để mọi bước sau có sẵn màu "sạch"
 *      thay cho màu đã trộn phông.
 *   2. `trimFringe`  — chỗ nào alpha thấp thì thay màu quan sát bằng màu loang, và kéo căng
 *      thang alpha để cái đuôi mờ 1–32 về hẳn 0.
 *   3. `solidify`    — bơm màu vào cả vùng trong suốt hoàn toàn. Vùng đó vô hình, nhưng bộ
 *      mã hoá WebP có mất mát và bước thu nhỏ ảnh của trình duyệt đều trộn nó vào pixel
 *      hàng xóm; để đen thì viền người bị ám tối một lớp mỏng.
 */

/** Pixel từ ngưỡng này trở lên coi như chắc chắn thuộc về người (không dính màu phông). */
const CORE_ALPHA = 0.97;

/** Dưới ngưỡng này chỉ còn là đuôi mờ của mặt nạ — cho về trong suốt hẳn. */
const FLOOR_ALPHA = 0.12;

/** Từ ngưỡng này trở lên cho đục hẳn, nên dải răng cưa còn lại rộng khoảng 1 pixel. */
const CEIL_ALPHA = 0.9;

/**
 * Loang màu từ vùng đã biết ra vùng chưa biết: mỗi lượt, pixel chưa biết nào có hàng xóm
 * đã biết thì lấy trung bình các hàng xóm đó rồi tự trở thành "đã biết".
 *
 * Đây là cách rẻ nhất để trả lời câu "nếu chỗ này không dính phông thì nó màu gì" — với
 * một dải viền vài pixel thì màu người quanh đó là câu trả lời đủ tốt (áo, da, quần đều
 * đổi màu chậm). Chỗ đổi màu nhanh duy nhất là sợi tóc bay, mà ảnh nguồn vốn đã nhoè nên
 * ở đó cũng không còn sợi nào để giữ.
 *
 * @param {Uint8Array} rgba  ảnh thô, 4 kênh
 * @param {(alpha: number) => boolean} isKnown  pixel nào được coi là nguồn màu
 * @param {number} passes  loang tối đa bấy nhiêu pixel ra ngoài
 * @returns {{ r: Float32Array, g: Float32Array, b: Float32Array, known: Uint8Array }}
 */
function extendColour(rgba, width, height, isKnown, passes) {
  const n = width * height;
  const r = new Float32Array(n);
  const g = new Float32Array(n);
  const b = new Float32Array(n);
  const known = new Uint8Array(n);

  let unknown = [];
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;

  for (let i = 0; i < n; i++) {
    if (isKnown(rgba[i * 4 + 3] / 255)) {
      known[i] = 1;
      r[i] = rgba[i * 4];
      g[i] = rgba[i * 4 + 1];
      b[i] = rgba[i * 4 + 2];
      sumR += r[i];
      sumG += g[i];
      sumB += b[i];
    } else {
      unknown.push(i);
    }
  }

  const seeds = n - unknown.length;
  if (seeds === 0) return { r, g, b, known };

  for (let pass = 0; pass < passes && unknown.length > 0; pass++) {
    /** Ghi kết quả của cả lượt vào đây rồi mới nhập vào `r/g/b`: nếu ghi thẳng thì pixel
        đầu lượt sẽ làm nguồn cho pixel cuối lượt, và màu loang lệch về một góc. */
    const filled = [];
    const rest = [];

    for (const i of unknown) {
      const x = i % width;
      const y = (i - x) / width;
      let cr = 0;
      let cg = 0;
      let cb = 0;
      let count = 0;

      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width || (dx === 0 && dy === 0)) continue;
          const j = ny * width + nx;
          if (!known[j]) continue;
          cr += r[j];
          cg += g[j];
          cb += b[j];
          count++;
        }
      }

      if (count === 0) rest.push(i);
      else filled.push(i, cr / count, cg / count, cb / count);
    }

    if (filled.length === 0) break;

    for (let k = 0; k < filled.length; k += 4) {
      const i = filled[k];
      r[i] = filled[k + 1];
      g[i] = filled[k + 2];
      b[i] = filled[k + 3];
      known[i] = 1;
    }

    unknown = rest;
  }

  // Pixel ở quá xa người thì lấy màu trung bình chung — miễn là đừng để đen.
  if (unknown.length > 0) {
    const mr = sumR / seeds;
    const mg = sumG / seeds;
    const mb = sumB / seeds;
    for (const i of unknown) {
      r[i] = mr;
      g[i] = mg;
      b[i] = mb;
      known[i] = 1;
    }
  }

  return { r, g, b, known };
}

/**
 * Thay màu dính phông ở dải viền bằng màu người loang từ trong ra, rồi kéo căng thang alpha.
 * Sửa tại chỗ trên `rgba`.
 */
function trimFringe(rgba, width, height) {
  const ext = extendColour(rgba, width, height, (a) => a >= CORE_ALPHA, 6);
  const n = width * height;
  const span = CEIL_ALPHA - FLOOR_ALPHA;

  for (let i = 0; i < n; i++) {
    const p = i * 4;
    const a = rgba[p + 3] / 255;
    if (a >= CORE_ALPHA) continue;

    /* Càng đục thì càng tin màu quan sát được, vì phần phông trộn vào càng ít. Dưới 0.85
       thì bỏ hẳn màu quan sát: ở đó hơn một phần bảy màu là phông. */
    const trust = a <= 0.85 ? 0 : (a - 0.85) / (CORE_ALPHA - 0.85);
    rgba[p] = Math.round(ext.r[i] + (rgba[p] - ext.r[i]) * trust);
    rgba[p + 1] = Math.round(ext.g[i] + (rgba[p + 1] - ext.g[i]) * trust);
    rgba[p + 2] = Math.round(ext.b[i] + (rgba[p + 2] - ext.b[i]) * trust);

    if (a <= 0) continue;
    const stretched = (a - FLOOR_ALPHA) / span;
    rgba[p + 3] = Math.round(Math.min(1, Math.max(0, stretched)) * 255);
  }
}

/** Bơm màu người vào vùng trong suốt hoàn toàn. Sửa tại chỗ trên `rgba`. */
function solidify(rgba, width, height) {
  const ext = extendColour(rgba, width, height, (a) => a > 0, 24);
  const n = width * height;
  for (let i = 0; i < n; i++) {
    const p = i * 4;
    if (rgba[p + 3] > 0) continue;
    rgba[p] = Math.round(ext.r[i]);
    rgba[p + 1] = Math.round(ext.g[i]);
    rgba[p + 2] = Math.round(ext.b[i]);
  }
}

/** Đọc ảnh ra pixel thô RGBA (không nhân sẵn alpha — cần màu thật ở dải viền). */
async function toRaw(input) {
  const { data, info } = await input
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

const work = mkdtempSync(path.join(tmpdir(), "hero-cutout-"));

try {
  const binary = path.join(work, "cutout");
  const cutout = path.join(work, "cutout.png");

  // `swift scripts/cutout.swift` không chạy được — trình thông dịch không link được Vision.
  execFileSync("/usr/bin/swiftc", [
    "-O",
    "-framework", "Vision",
    "-framework", "AppKit",
    "-framework", "CoreImage",
    "-o", binary,
    "scripts/cutout.swift",
  ], { stdio: "inherit" });

  execFileSync(binary, [SOURCE, cutout], { stdio: "inherit" });

  /* Dọn viền ở KÍCH THƯỚC GỐC, trước khi thu nhỏ: dải chuyển tiếp lúc này còn rộng 3–4
     pixel nên tách được màu người khỏi màu phông. Thu nhỏ trước rồi mới dọn thì cả dải đó
     đã bị gộp vào một pixel, không gỡ ra được nữa. */
  const full = await toRaw(sharp(cutout));
  trimFringe(full.data, full.width, full.height);

  const raw = { raw: { width: full.width, height: full.height, channels: 4 } };
  /**
   * `trim` sau khi tách: cutout.swift đã cắt theo khung chứa chủ thể, nhưng khung đó vẫn
   * còn viền pixel gần-như-trong-suốt ở mép. Còn viền thì `object-bottom` bên CSS neo vào
   * mép khung chứ không neo vào chân người, và người sẽ lửng lơ giữa hero.
   */
  const resized = await toRaw(
    sharp(full.data, raw)
      .trim({ threshold: 1 })
      .resize({ height: OUT_HEIGHT, fit: "inside", withoutEnlargement: true }),
  );

  /* Bơm màu vào vùng trong suốt SAU khi thu nhỏ, không phải trước: sharp nhân alpha vào màu
     để thu nhỏ rồi chia ngược lại, mà chỗ alpha bằng 0 thì không chia ngược được nên nó
     trả về đen — làm trước thì công toi. */
  solidify(resized.data, resized.width, resized.height);

  const resizedRaw = {
    raw: { width: resized.width, height: resized.height, channels: 4 },
  };

  /* Làm nét. Ảnh nguồn chụp hơi mềm, mà bản 2x hiện gần đúng 1:1 nên không còn bước thu nhỏ
     nào để "ăn gian" độ nét nữa. `sharpen` của libvips chỉ đụng vào kênh sáng và trả nguyên
     các kênh còn lại — nên viền alpha vừa dọn xong không bị nó cào lại thành răng cưa. */
  const info = await sharp(resized.data, resizedRaw)
    .sharpen({ sigma: 0.7, m1: 0.5, m2: 2 })
    .webp({ quality: 95, alphaQuality: 100, effort: 6 })
    .toFile(OUTPUT);

  console.log(`${SOURCE} → ${OUTPUT}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)}KB`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
