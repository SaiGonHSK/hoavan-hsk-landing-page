/**
 * Ghép ảnh minh hoạ "Đội ngũ giảng viên" cho khối tab ở trang chủ (components/WhyUs.astro).
 *
 * Vì sao phải ghép: ô ảnh của tab đó trước dùng ảnh chụp lớp học (giảng viên viết bảng,
 * học viên quay lưng) — nhìn vào không thấy "đội ngũ", cũng không thấy "Thạc sĩ – Tiến sĩ"
 * như phần chữ bên cạnh nói. Ảnh này lấy đúng các giảng viên trong src/assets/teacher/.
 *
 * Vì sao là chân dung tròn đều nhau chứ không phải hàng người cắt dán: bộ card gốc do
 * nhiều đợt chụp khác nhau, ánh sáng và tông màu lệch nhau rõ, dán cạnh nhau nguyên hình
 * thì ra một tấm ghép chắp vá. Cùng một khung tròn, cùng cỡ mặt, cùng một đĩa nền thì cái
 * lệch đó không còn thấy nữa, và bố cục khớp với thẻ giảng viên ở section "Đội ngũ giảng viên".
 *
 * Bốn bước cho mỗi người: cắt nửa trên card (phần nền trắng) → tách nền bằng cutout.swift
 * → đo khung mặt bằng face-rect.swift để mọi người cùng cỡ mặt → khoét tròn rồi xếp thành
 * hàng. Tên và học vị lấy từ content/site.json để không phải khai lại ở hai chỗ.
 *
 * Cả hai bước Swift đều cần Vision framework nên script chỉ chạy trên macOS có Xcode
 * toolchain. Ảnh kết quả được commit vào src/assets/values/ nên người khác build không cần
 * chạy lại script này.
 *
 * Chạy: yarn gen:faculty
 */
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const SOURCE_DIR = "src/assets/teacher";
const OUTPUT = "src/assets/values/doi-ngu-giang-vien.webp";

/*
 * Bố cục tính trên hệ trục 1440×760, ảnh xuất ra nhân `OUT_SCALE` lần.
 *
 * Vì sao phải nhân: ô ảnh của panel rộng chừng 640px khi hiện thật, màn Retina cần 1280px
 * thật. Xuất đúng 1440 thì mỗi chân dung chỉ có 288px cho một khuôn mặt hiện ở ~256px —
 * gần 1:1, không còn dư để `<Image>` thu nhỏ, nên mặt trông nhoè. Vẽ ở 2× rồi để Astro thu
 * về 1440 thì bản 2× là ảnh thu nhỏ thật, nét hơn hẳn.
 *
 * Chỉ chân dung và khung ảnh nhân theo `OUT_SCALE`; mọi toạ độ chữ, viền, đĩa vẫn viết trên
 * hệ trục 1440×760 vì SVG được rasterize ở khổ 2× qua `width`/`height` khác `viewBox` —
 * chữ và đường tròn do đó vẫn vẽ vector ở khổ lớn, không bị phóng bitmap.
 */
const OUT_SCALE = 2;
const W = 1440;
const H = 760;

/** Toạ độ/kích thước trên hệ trục bố cục → pixel thật của ảnh xuất ra. */
const out = (value) => Math.round(value * OUT_SCALE);
/*
 * Bảng màu trung tính, cố ý không có đỏ thương hiệu.
 *
 * Ô ảnh của panel có nền `bg-brand-ink-50` và bo góc — một tấm hình nền hồng viền đỏ đặt
 * vào đó thành "thẻ lồng trong thẻ", màu đỏ trong hình đánh nhau với khung xám bên ngoài.
 * Lấy đúng `--brand-ink-50` làm nền hình thì hình liền vào khung, chỉ còn chân dung và chữ
 * nổi lên. Nhấn vào giảng viên phụ trách chuyên môn bằng viền đậm chứ không bằng màu.
 */
const CANVAS = "#f6f6f7";
const DISC_TOP = "#ffffff";
const DISC_BOTTOM = "#e9e9ec";
const RING = "#c9cace";
const LEAD_RING = "#35363d";
const INK = "#121316";
const MUTED = "#6f7078";

/** Cùng font stack cho mọi dòng chữ — Avenir Next là font hệ thống gần chữ của web nhất. */
const FONT = "'Avenir Next','Helvetica Neue',sans-serif";

const site = JSON.parse(readFileSync("content/site.json", "utf8"));
const teacherBySlug = new Map(
  site.teachers.map((teacher) => [
    path.basename(teacher.image, path.extname(teacher.image)),
    teacher,
  ]),
);

/**
 * Bốn giảng viên, cố ý đủ ba mức học vị (Tiến sĩ, NCS Tiến sĩ, Thạc sĩ) để tab nói được
 * "Thạc sĩ – Tiến sĩ" bằng hình. Cô Trang đứng đầu và viền đậm hơn vì là giảng viên phụ
 * trách chuyên môn — cũng là người được nhắc tên trong phần chữ của tab.
 *
 * Bốn chứ không phải tám: ô ảnh rộng chừng 620px khi hiện thật, chia tám cột thì tên và
 * học vị nhỏ tới mức không đọc được, mà đọc được mới là lý do có dòng chữ đó.
 */
const LINEUP = ["vo-thi-quynh-trang", "cao-hoai-nhon", "huynh-thi-my-chinh", "le-tuan-minh"];

/**
 * Bốn người còn lại hiện thành hàng chân dung nhỏ ở dưới cùng, kèm dòng "và N giảng viên
 * khác": bốn khuôn mặt lớn nói được về học vị nhưng chưa nói được đội ngũ đông tới đâu.
 */
const REST = site.teachers
  .map((teacher) => path.basename(teacher.image, path.extname(teacher.image)))
  .filter((slug) => !LINEUP.includes(slug));

const DISC = 288;
const COLUMN = W / LINEUP.length;

/**
 * Khung vuông khoét tròn, tính theo số lần chiều cao khuôn mặt.
 *
 * `SIDE` = 2.8 cho mặt chiếm khoảng một phần ba đường kính — tỉ lệ của một ảnh chân dung
 * bán thân. `ABOVE` = 1.55 (tính từ tâm mặt) chừa đúng chỗ cho chiếc mũ tốt nghiệp cao
 * nhất trong bộ card: mũ là bằng chứng nhìn thấy được của học vị, cắt mất thì mất luôn ý.
 */
const SIDE = 2.8;
const ABOVE = 1.55;

const work = mkdtempSync(path.join(tmpdir(), "faculty-"));

/** Biên dịch hai script Swift ra binary tạm — xem đầu mỗi file để biết vì sao không `swift run`. */
function build(name) {
  const bin = path.join(work, name);
  execFileSync("/usr/bin/swiftc", [
    "-O",
    "-framework", "Vision",
    "-framework", "AppKit",
    "-framework", "CoreImage",
    "-o", bin,
    `scripts/${name}.swift`,
  ]);
  return bin;
}

const cutoutBin = build("cutout");
const faceRectBin = build("face-rect");

/**
 * Card gốc là ảnh vuông 2560×2560: nửa trên nền trắng có người, nửa dưới là panel đỏ in tên
 * + học vị. Cắt đúng phần nền trắng rồi mới tách nền — để cả panel đỏ thì Vision nhận thêm
 * dải đỏ thành một chủ thể nữa và ảnh ra bị dính vệt đỏ ở mép.
 */
async function liftSubject(slug) {
  const source = path.join(SOURCE_DIR, `${slug}.webp`);
  const { width, height } = await sharp(source).metadata();

  // Dò mép trên panel đỏ bằng một cột pixel sát lề trái — chỗ đó luôn là nền, không có người.
  const column = await sharp(source)
    .extract({ left: 20, top: 0, width: 1, height })
    .raw()
    .toBuffer();

  let redTop = height;
  for (let y = 0; y < height; y += 1) {
    const [r, g, b] = column.subarray(y * 3, y * 3 + 3);
    if (r > 140 && g < 90 && b < 90) {
      redTop = y;
      break;
    }
  }

  // Lùi 40px khỏi mép panel: mép đỏ bị nén JPEG nên vài hàng ngay trên nó vẫn hồng nhạt.
  const cropped = path.join(work, `${slug}-top.png`);
  await sharp(source)
    .extract({ left: 0, top: 0, width, height: redTop - 40 })
    .png()
    .toFile(cropped);

  const lifted = path.join(work, `${slug}-cut.png`);
  execFileSync(cutoutBin, [cropped, lifted], { stdio: ["ignore", "ignore", "ignore"] });
  return lifted;
}

/**
 * Ảnh chân dung tròn đường kính `size` **pixel thật**, mặt nằm đúng chỗ và đúng cỡ ở mọi người.
 *
 * Nhận `size` thay vì luôn xuất ở `DISC` rồi để chỗ gọi thu nhỏ tiếp: hàng thumb ở dải dưới
 * trước đây resize hai lần (khung mặt → 288 → 96), mỗi lần thu nhỏ mất một lớp chi tiết nên
 * mấy khuôn mặt nhỏ nhoè hơn hẳn bốn khuôn mặt lớn. Thu một lần từ ảnh gốc là đủ.
 */
async function portrait(slug, size) {
  const lifted = await liftSubject(slug);
  const face = JSON.parse(execFileSync(faceRectBin, [lifted], { encoding: "utf8" }));
  const centerX = face.x + face.width / 2;
  const centerY = face.y + face.height / 2;

  /*
   * Khung vuông mong muốn hầu như không bao giờ trùng khít ảnh đã tách nền (ảnh đó cắt vừa
   * khít chủ thể): chỗ thì tràn ra ngoài, chỗ thì hụt vào trong. Thay vì kẹp khung lại —
   * kẹp thì mặt lệch khỏi chỗ đã tính — dựng khung trong suốt đúng cỡ, rồi dán vào đó đúng
   * phần ảnh nằm trong khung.
   */
  const side = Math.round(SIDE * face.height);
  const windowX = Math.round(centerX - side / 2);
  const windowY = Math.round(centerY - ABOVE * face.height);

  const { width, height } = await sharp(lifted).metadata();
  const left = Math.max(0, windowX);
  const top = Math.max(0, windowY);
  const slice = await sharp(lifted)
    .extract({
      left,
      top,
      width: Math.min(width, windowX + side) - left,
      height: Math.min(height, windowY + side) - top,
    })
    .png()
    .toBuffer();

  const square = await sharp({
    create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: slice, left: left - windowX, top: top - windowY }])
    .png()
    .toBuffer();

  // Khoét tròn: đĩa trắng làm mặt nạ `dest-in`, rồi đặt lên một đĩa trắng-xám để chỗ đã
  // tách nền không thành lỗ trong suốt.
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
    </svg>`,
  );

  /*
   * Khung mặt cắt ra rộng cỡ 1400px, thu về `size` là thu hơn hai tới mười lần. Lanczos
   * (mặc định của sharp) làm đúng việc chống răng cưa nhưng ảnh ra luôn mềm hơn ảnh gốc —
   * `sharpen` bù lại đúng phần đó. Bán kính nhỏ và `m1`/`m2` thấp để chỉ ăn vào biên (mắt,
   * mép mũ, đường viền áo) chứ không đẩy nhiễu trên da lên.
   */
  const circular = await sharp(square)
    .resize(size, size, { kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 1.6 })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <defs>
        <linearGradient id="disc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${DISC_TOP}"/>
          <stop offset="1" stop-color="${DISC_BOTTOM}"/>
        </linearGradient>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#disc)"/>
    </svg>`,
  ))
    .composite([{ input: circular }])
    .png()
    .toBuffer();
}

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Ngắt dòng cho chữ trong SVG — SVG không tự ngắt, phải tự tính.
 *
 * Bề rộng chữ đo bằng ước lượng 0.52em/ký tự: Avenir Next là font tỉ lệ nên con số này chỉ
 * gần đúng, nhưng dòng ở đây ngắn (tên trường) và khung còn dư nên sai vài phần trăm không
 * đẩy chữ ra ngoài cột.
 */
function wrap(text, fontSize, maxWidth) {
  const limit = Math.floor(maxWidth / (fontSize * 0.52));
  const lines = [];
  let line = "";

  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > limit && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);

  return lines;
}

// "Tiến sĩ — Đại học Sư phạm Hoa Đông, Thượng Hải" → học vị + tên trường viết gọn.
function credentials(title) {
  const [degree, school = ""] = title.split("—").map((part) => part.trim());
  return { degree, school: school.replace(/Đại học/g, "ĐH") };
}

const columns = [];
for (const [index, slug] of LINEUP.entries()) {
  const teacher = teacherBySlug.get(slug);
  if (!teacher) throw new Error(`content/site.json không có giảng viên nào dùng ảnh ${slug}`);

  columns.push({
    slug,
    lead: Boolean(teacher.lead),
    centerX: Math.round(COLUMN * (index + 0.5)),
    name: teacher.name,
    ...credentials(teacher.title),
  });
}

const DISC_CENTER_Y = 246;
const NAME_BASELINE = 464;

/** Chữ dưới mỗi chân dung: tên, học vị, rồi tên trường (có thể xuống dòng). */
const caption = ({ centerX, name, degree, school }) => {
  const schoolLines = wrap(school, 24, COLUMN - 44);

  return `
    ${wrap(name, 28, COLUMN - 36)
      .map(
        (line, i) =>
          `<text x="${centerX}" y="${NAME_BASELINE + i * 34}" text-anchor="middle"
                 font-family="${FONT}" font-size="28" font-weight="800"
                 fill="${INK}">${escape(line)}</text>`,
      )
      .join("")}
    <text x="${centerX}" y="${NAME_BASELINE + 42}" text-anchor="middle" font-family="${FONT}"
          font-size="26" font-weight="700" fill="${INK}">${escape(degree)}</text>
    ${schoolLines
      .map(
        (line, i) =>
          `<text x="${centerX}" y="${NAME_BASELINE + 80 + i * 30}" text-anchor="middle"
                 font-family="${FONT}" font-size="23" fill="${MUTED}">${escape(line)}</text>`,
      )
      .join("")}`;
};

// Nền: một nền phẳng cùng màu với ô ảnh của panel, thêm chữ 师 (shī — "thầy") làm dấu nước
// ở góc. Không lưới điểm, không khung góc: ô ảnh đã có viền và bo góc riêng, thêm nữa thành
// hai lớp khung chồng nhau.
const background = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${out(W)}" height="${out(H)}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${CANVAS}"/>

    <text x="${W - 44}" y="${H - 34}" text-anchor="end"
          font-family="'Noto Serif SC','Songti SC','SimSun',serif"
          font-size="170" fill="${INK}" opacity=".05">师</text>
  </svg>`,
);

const layers = [];
for (const column of columns) {
  layers.push({
    input: await portrait(column.slug, out(DISC)),
    left: out(column.centerX - DISC / 2),
    top: out(DISC_CENTER_Y - DISC / 2),
  });
}

/*
 * Hàng chân dung nhỏ + dòng "và N giảng viên khác" ở dải dưới.
 *
 * Các đĩa nhỏ chồng lấn nhau `THUMB - THUMB_STEP` để thành một chùm, rồi cả chùm và dòng
 * chữ canh giữa theo bề rộng cụm — chùm lệch tâm thì dải dưới trông như bị đẩy sang một bên.
 */
const THUMB = 96;
const THUMB_STEP = 70;
const REST_LABEL = `và ${REST.length} giảng viên khác`;
const REST_FONT = 27;

const restRowWidth = THUMB + THUMB_STEP * (REST.length - 1);
const restLabelWidth = REST_LABEL.length * REST_FONT * 0.52;
const restLeft = Math.round((W - (restRowWidth + 22 + restLabelWidth)) / 2);
const REST_CENTER_Y = H - 92;

for (const [index, slug] of REST.entries()) {
  layers.push({
    input: await portrait(slug, out(THUMB)),
    left: out(restLeft + index * THUMB_STEP),
    top: out(REST_CENTER_Y - THUMB / 2),
  });
}

/*
 * Viền và chữ vẽ sau cùng, trong một lớp SVG phủ cả khung: viền phải nằm trên chân dung,
 * và giữ chung một lớp thì mọi toạ độ chữ tính trên cùng một hệ trục với `background`.
 */
layers.push({
  input: Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${out(W)}" height="${out(H)}" viewBox="0 0 ${W} ${H}">
      ${columns
        .map(
          (column) => `
        <circle cx="${column.centerX}" cy="${DISC_CENTER_Y}" r="${DISC / 2 - 2}"
                fill="none" stroke="${column.lead ? LEAD_RING : RING}"
                stroke-width="${column.lead ? 4 : 2}"/>`,
        )
        .join("")}
      ${columns.map(caption).join("")}

      ${REST.map(
        (_, index) =>
          `<circle cx="${restLeft + index * THUMB_STEP + THUMB / 2}" cy="${REST_CENTER_Y}"
                   r="${THUMB / 2 - 2}" fill="none" stroke="${CANVAS}" stroke-width="5"/>
           <circle cx="${restLeft + index * THUMB_STEP + THUMB / 2}" cy="${REST_CENTER_Y}"
                   r="${THUMB / 2 - 4}" fill="none" stroke="${RING}" stroke-width="1.5"/>`,
      ).join("")}
      <text x="${restLeft + restRowWidth + 22}" y="${REST_CENTER_Y + 10}"
            font-family="${FONT}" font-size="${REST_FONT}" font-weight="700"
            fill="${MUTED}">${escape(REST_LABEL)}</text>

    </svg>`,
  ),
  left: 0,
  top: 0,
});

mkdirSync(path.dirname(OUTPUT), { recursive: true });
/*
 * `quality: 96` chứ không phải mức thường dùng cho ảnh chụp: đây là ảnh đồ hoạ có chữ nhỏ
 * (tên trường 23px) và `<Image>` còn nén lại một lần nữa khi build. Nén mạnh ở bước này thì
 * qua hai lần nén chữ rữa ra thành vệt.
 */
await sharp(background).composite(layers).webp({ quality: 96 }).toFile(OUTPUT);
rmSync(work, { recursive: true, force: true });
console.log(`wrote ${OUTPUT} — ${out(W)}x${out(H)}`);
