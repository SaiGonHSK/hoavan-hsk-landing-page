/**
 * Kiểm tra dữ liệu có cấu trúc của một server đang chạy.
 *
 *   node scripts/check-schema.mjs                      # http://localhost:4321 (astro dev)
 *   node scripts/check-schema.mjs http://127.0.0.1:4400
 *   node scripts/check-schema.mjs https://trungtamhoavansaigonhsk.edu.vn
 *
 * Bốn thứ script này bắt được mà mắt người đọc HTML nguồn không bắt được:
 *
 * 1. JSON-LD không parse nổi. Một dấu ngoặc lệch là cả khối bị bỏ qua *im lặng* —
 *    trang vẫn hiển thị bình thường, chỉ có phần dữ liệu cho máy là mất trắng.
 *
 * 2. `@id` của node loại trang (ContactPage, AboutPage…) không trùng `@id` của node
 *    `WebPage`. Trùng thì hai node gộp thành một trang; lệch một ký tự thì thành hai
 *    thực thể rời và không cái nào đủ thông tin. Đây là lỗi không thể thấy bằng cách
 *    đọc, vì cả hai node đều *trông* đúng.
 *
 * 3. URL trong JSON-LD trả 404. Đường dẫn trang khoá do menu trong console quyết định
 *    nên nó đổi được mà không ai sửa code — và không ai mở JSON-LD ra bấm thử link.
 *
 * 4. `/llms.txt` và `/robots.txt` trả về HTML thay vì text/plain. Xảy ra khi server
 *    phục vụ file tĩnh và có fallback về index.html cho đường dẫn lạ: lúc đó hai file
 *    này "có" (HTTP 200) nhưng nội dung là trang chủ.
 *
 * Danh sách trang là **một trang cho mỗi template**, không phải mọi URL: mục đích là
 * kiểm mã dựng schema, mà mọi bài viết trong Thư viện đều đi qua cùng một template.
 */

const BASE = (process.argv[2] ?? "http://localhost:4321").replace(/\/$/, "");

const PAGES = [
  "/", // Hero riêng, không dùng PageHero
  "/contact", // ContactPage + FAQPage
  "/about", // AboutPage
  "/about/teachers", // Person của giảng viên
  "/about/reviews", // Review không kèm điểm số
  "/about/commitments",
  "/schedule", // ScheduleHero + lịch khai giảng
  "/register",
  "/courses", // CatalogHub
  "/courses/hsk1", // CatalogDetail + Course
  "/courses/programs/luyen-thi-hsk", // Course + EducationalOccupationalProgram
  "/library", // LibraryHub
  "/trial",
];

/* ── Thu thập ────────────────────────────────────────────────────────── */

const LD_RE = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.log(`  ✗ ${msg}`);
};

/** Mọi URL tuyệt đối cùng tên miền xuất hiện trong JSON-LD, gom từ mọi trang. */
const internalUrls = new Set();

/**
 * `@id` là URI dạng `https://domain/path#fragment`, còn `url`/`item` là link thật.
 * Chỉ lấy phần trước `#` và bỏ các `@id` thuần fragment: `#organization` không phải
 * một trang, kiểm nó bằng HTTP là vô nghĩa.
 */
const collectUrls = (value, origin) => {
  if (typeof value === "string") {
    if (value.startsWith(origin) && !value.slice(origin.length).startsWith("#")) {
      internalUrls.add(value.split("#")[0]);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectUrls(v, origin));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectUrls(v, origin));
  }
};

const typeOf = (node) => {
  const t = node["@type"];
  return Array.isArray(t) ? t.join("+") : (t ?? "(không có @type)");
};

/* ── Kiểm từng trang ─────────────────────────────────────────────────── */

console.log(`Kiểm dữ liệu có cấu trúc tại ${BASE}\n`);

for (const path of PAGES) {
  const res = await fetch(BASE + path);
  console.log(`${path}  [HTTP ${res.status}]`);

  if (!res.ok) {
    fail(`không tải được trang`);
    continue;
  }

  const html = await res.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) {
    fail("thiếu <link rel=canonical>");
    continue;
  }
  const origin = new URL(canonical).origin;

  const nodes = [];
  for (const [, raw] of html.matchAll(LD_RE)) {
    let doc;
    try {
      doc = JSON.parse(raw);
    } catch (err) {
      fail(`JSON-LD không parse được: ${err.message}`);
      continue;
    }
    nodes.push(...(doc["@graph"] ?? [doc]));
    collectUrls(doc, origin);
  }

  if (!nodes.length) {
    fail("không có node JSON-LD nào");
    continue;
  }

  console.log(`  node: ${nodes.map(typeOf).join(", ")}`);

  // Node mô tả chính trang này phải dùng đúng `@id` dựng từ canonical.
  const pageId = `${canonical}#webpage`;
  const pageNodes = nodes.filter((n) => n["@id"] === pageId);
  if (!pageNodes.length) {
    fail(`không có node nào mang @id ${pageId}`);
  }

  // Mọi node mang @type dạng *Page phải dùng chính @id đó, không phải @id khác.
  for (const node of nodes) {
    const t = typeOf(node);
    if (/Page/.test(t) && node["@id"] && node["@id"] !== pageId) {
      fail(`node ${t} dùng @id ${node["@id"]}, lệch với ${pageId}`);
    }
  }

  // Tổ chức phải được tham chiếu, không khai lại từng trang một bản.
  const orgNodes = nodes.filter((n) => n["@id"] === `${origin}/#organization`);
  if (orgNodes.length !== 1) {
    fail(`có ${orgNodes.length} node #organization, phải đúng 1`);
  }
}

/* ── Kiểm link trong JSON-LD ─────────────────────────────────────────── */

console.log(`\nKiểm ${internalUrls.size} URL nội bộ xuất hiện trong JSON-LD…`);

/*
  Chuyển hướng là cảnh báo, không phải lỗi.

  Bản build tĩnh sau nginx trả 301 để thêm dấu `/` cuối ("/schedule" → "/schedule/"),
  nên nếu tính 301 là lỗi thì script báo đỏ toàn bộ site trong khi mọi trang đều sống.
  Nhưng cũng không thể im lặng bỏ qua: canonical của trang khai URL *không* có dấu `/`
  cuối, nên schema và canonical đang trỏ vào hai URL khác nhau — đáng biết, chỉ không
  phải chuyện phải chặn.
*/
let redirects = 0;

for (const url of [...internalUrls].sort()) {
  const path = new URL(url).pathname;
  // Gọi vào BASE chứ không vào URL tuyệt đối: schema luôn khai tên miền thật, còn
  // server đang test có thể là localhost.
  const res = await fetch(BASE + path);

  if (res.status !== 200) {
    fail(`${res.status} ${path}  (khai trong JSON-LD là ${url})`);
  } else if (res.redirected) {
    redirects += 1;
    console.log(`  ! ${path} → ${new URL(res.url).pathname}  (chuyển hướng)`);
  }
}

if (redirects) {
  console.log(
    `  ${redirects} URL bị chuyển hướng. Không sai, nhưng schema nên khai đúng URL đích.`,
  );
}

/* ── Kiểm hai file text cho máy đọc ──────────────────────────────────── */

console.log("\nKiểm /llms.txt và /robots.txt…");

for (const [path, needles] of [
  ["/llms.txt", ["# Trung tâm Hoa văn SaigonHSK", "chuẩn HSK 3.0", "Lưu ý khi trích dẫn"]],
  ["/robots.txt", ["User-agent: GPTBot", "Google-Extended", "Sitemap:"]],
]) {
  const res = await fetch(BASE + path);
  const type = res.headers.get("content-type") ?? "";
  const body = await res.text();

  if (res.status !== 200) fail(`${path} trả HTTP ${res.status}`);
  // Đây là cái bắt được trường hợp server fallback về index.html: HTTP 200 nhưng
  // nội dung là trang chủ.
  else if (!type.includes("text/plain")) fail(`${path} trả Content-Type ${type}`);
  else {
    const missing = needles.filter((n) => !body.includes(n));
    if (missing.length) fail(`${path} thiếu: ${missing.join(" · ")}`);
    else console.log(`  ✓ ${path} (${body.length} ký tự)`);
  }
}

/* ── Kết ─────────────────────────────────────────────────────────────── */

console.log(
  failures === 0
    ? "\n✓ Không có lỗi."
    : `\n✗ ${failures} lỗi. Xem các dòng ✗ ở trên.`,
);
process.exit(failures === 0 ? 0 : 1);
