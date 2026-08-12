import { applySchedule, type ApiSchedule } from "./classesApi";
import { applyContent } from "./content";
import { applyCourses, type ApiCourse } from "./coursesApi";
import { applyLibraryCategories, type ApiLibraryCategory } from "./library";
import { applyMenu, applyPageContents, type MenuEntry, type PageContent } from "./pages";
import { applyPrograms, type ApiProgram } from "./programsApi";
import * as schedule from "./schedule";

/**
 * Nạp nội dung từ trang quản trị, có cache.
 *
 * `src/middleware.ts` gọi hàm này ở mỗi request. Nội dung là dữ liệu chung của cả
 * site (không có gì theo từng người xem), nên một bản trong process dùng cho mọi
 * request là đúng — và cũng là lý do đổi ở admin thì mọi trang đổi theo.
 */

/**
 * 60 giây: đủ nhanh để người soạn thấy kết quả trong lúc còn ngồi ở trang quản trị,
 * đủ chậm để lưu lượng bình thường không biến thành lưu lượng gọi API.
 */
const TTL_MS = 60_000;

/**
 * Đọc lúc chạy (`process.env`) chứ không phải lúc build (`import.meta.env`).
 *
 * Lệnh fetch này chạy ở phía server nên biến không cần tiền tố `PUBLIC_`; giữ
 * `PUBLIC_CONTENT_API` làm bản dự phòng để cấu hình cũ vẫn chạy. Trên VPS nên trỏ
 * thẳng vào Go server (http://127.0.0.1:9909) cho khỏi đi vòng qua nginx.
 */
const apiBase = (): string => {
  const raw =
    (typeof process !== "undefined" ? process.env.CONTENT_API : undefined) ||
    import.meta.env.PUBLIC_CONTENT_API ||
    "";
  return raw.replace(/\/$/, "");
};

let lastAt = 0;
let inflight: Promise<void> | null = null;
let warned = false;

/**
 * Trạng thái lần nạp trước, để log đúng một dòng khi *đổi* trạng thái.
 *
 * Im lặng hoàn toàn khi chạy tốt thì không phân biệt được "đã lấy từ API" với "API
 * chết, đang dùng bản trong repo" — nên báo ở lần đầu và ở mỗi lần hồi phục, nhưng
 * không báo lại mỗi 60 giây để log khỏi thành nhiễu.
 *
 * Mỗi nguồn một cờ riêng: hai lời gọi chạy song song trong `Promise.all`, dùng chung
 * một cờ thì cái xong trước sẽ bịt miệng cái xong sau.
 */
let contentOk: boolean | null = null;
let pagesOk: boolean | null = null;
let coursesOk: boolean | null = null;
let menuOk: boolean | null = null;
let categoriesOk: boolean | null = null;
let programsOk: boolean | null = null;
let classesOk: boolean | null = null;

export async function refreshContent(): Promise<void> {
  if (Date.now() - lastAt < TTL_MS) return;

  // Single-flight: 50 request tới cùng lúc chỉ tạo một lần gọi API, 49 cái còn lại
  // chờ chung. Không có nó, một đợt truy cập sau khi cache hết hạn sẽ nhân bản
  // thành 50 lần fetch.
  inflight ??= load().finally(() => {
    inflight = null;
    // Đóng dấu cả khi lỗi: API chết thì không thử lại mỗi request, mà chờ hết TTL.
    lastAt = Date.now();
  });

  return inflight;
}

async function load(): Promise<void> {
  const API = apiBase();

  if (!API) {
    if (!warned) {
      console.warn(
        "[content] chưa đặt CONTENT_API — dùng nội dung trong content/site.json, các trang động bị bỏ qua",
      );
      warned = true;
    }
    return;
  }

  // Các lời gọi độc lập: tài liệu nội dung lỗi thì trang động vẫn nạp được, và
  // ngược lại. Nội dung cũ được giữ lại cho phần nào lỗi.
  // Lịch khai giảng nạp SAU khoá học và chương trình, không song song với chúng: một lớp
  // tra chương trình của nó qua `courseId` → `catalogKey` → `courseKeys` (xem
  // `schedule.ts`), nên cả hai danh sách kia phải có trước thì lớp mới gom đúng khối.
  // Chạy song song thì lần nạp đầu sau khi khởi động dựng lịch lúc `apiCourses` còn rỗng.
  await Promise.all([
    loadSiteContent(API),
    loadMenu(API),
    loadLibraryCategories(API),
    loadPages(API),
    Promise.all([loadCourses(API), loadPrograms(API)]).then(() => loadClasses(API)),
  ]);
}

async function loadMenu(API: string): Promise<void> {
  try {
    const res = await fetch(`${API}/api/v1/menu`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = (await res.json()) as { data?: MenuEntry[] };
    const count = applyMenu(body.data ?? []);
    // `applyMenu` trả 0 khi từ chối cài — menu rỗng gỡ luôn cả thanh header lẫn mọi
    // trang khoá học, nên coi đó là lỗi và giữ bản đang dùng.
    if (count === 0) throw new Error("menu rỗng");

    if (menuOk !== true) {
      console.info(`[menu] ${count} mục header soạn từ trang quản trị`);
      menuOk = true;
    }
  } catch (error) {
    console.warn(
      `[menu] không đọc được ${API}/api/v1/menu (${String(error)}) — giữ menu đang dùng`,
    );
    menuOk = false;
  }
}

async function loadLibraryCategories(API: string): Promise<void> {
  try {
    const res = await fetch(`${API}/api/v1/library-categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = (await res.json()) as { data?: ApiLibraryCategory[] };
    const count = applyLibraryCategories(body.data ?? []);
    if (count === 0) throw new Error("danh sách chuyên mục rỗng");

    if (categoriesOk !== true) {
      console.info(`[library] ${count} chuyên mục Thư viện soạn từ trang quản trị`);
      categoriesOk = true;
    }
  } catch (error) {
    console.warn(
      `[library] không đọc được ${API}/api/v1/library-categories (${String(error)}) — giữ chuyên mục đang dùng`,
    );
    categoriesOk = false;
  }
}

async function loadPrograms(API: string): Promise<void> {
  try {
    const res = await fetch(`${API}/api/v1/programs`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = (await res.json()) as { data?: ApiProgram[] };
    const count = applyPrograms(body.data ?? []);
    if (count === 0) throw new Error("danh sách chương trình rỗng");

    if (programsOk !== true) {
      console.info(`[programs] ${count} chương trình soạn từ trang quản trị`);
      programsOk = true;
    }
  } catch (error) {
    console.warn(
      `[programs] không đọc được ${API}/api/v1/programs (${String(error)}) — giữ chương trình đang dùng`,
    );
    programsOk = false;
  }
}

async function loadSiteContent(API: string): Promise<void> {
  try {
    const res = await fetch(`${API}/api/v1/content`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = (await res.json()) as { data?: unknown };
    if (!body.data || typeof body.data !== "object") {
      throw new Error("phản hồi không có tài liệu nội dung");
    }

    applyContent(body.data);

    if (contentOk !== true) {
      const version = (body.data as { version?: number }).version;
      console.info(
        `[content] đã nạp nội dung từ ${API} (version ${version ?? "?"}), làm mới mỗi ${TTL_MS / 1000}s`,
      );
      contentOk = true;
    }
  } catch (error) {
    console.warn(
      `[content] không đọc được ${API}/api/v1/content (${String(error)}) — giữ nội dung đang dùng`,
    );
    contentOk = false;
  }
}

async function loadPages(API: string): Promise<void> {
  try {
    const res = await fetch(`${API}/api/v1/pages`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = (await res.json()) as { data?: PageContent[] };
    const count = applyPageContents(body.data ?? []);
    if (pagesOk !== true) {
      console.info(`[pages] ${count} trang động soạn từ trang quản trị`);
      pagesOk = true;
    }
  } catch (error) {
    console.warn(
      `[pages] không đọc được ${API}/api/v1/pages (${String(error)}) — giữ danh sách trang đang dùng`,
    );
    pagesOk = false;
  }
}

/**
 * Lịch khai giảng — `GET /api/v1/schedule`, đợt đang được đăng cùng các lớp của nó.
 *
 * Khác `loadMenu`/`loadLibraryCategories`: đợt rỗng **không** bị coi là lỗi. Giữa hai
 * đợt trung tâm có thể chưa đăng gì, và khi đó trang lịch phải nói đúng như vậy chứ
 * không giữ lại lịch tháng trước. Chỉ khi gọi hỏng (API chết, HTTP lỗi) mới giữ nguyên
 * nội dung đang dùng.
 */
async function loadClasses(API: string): Promise<void> {
  try {
    const res = await fetch(`${API}/api/v1/schedule`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = (await res.json()) as { data?: ApiSchedule };
    const count = applySchedule(body.data);
    // Dựng lại các dòng lịch ngay: `schedule` là mảng dẫn xuất, gán nguồn thôi chưa đủ.
    schedule.syncFromClasses();

    if (classesOk !== true) {
      console.info(
        `[schedule] “${schedule.scheduleTitle || "chưa đăng đợt nào"}” · ${count} lớp, soạn từ trang quản trị`,
      );
      classesOk = true;
    }
  } catch (error) {
    console.warn(
      `[schedule] không đọc được ${API}/api/v1/schedule (${String(error)}) — giữ lịch khai giảng đang dùng`,
    );
    classesOk = false;
  }
}

async function loadCourses(API: string): Promise<void> {
  try {
    const res = await fetch(`${API}/api/v1/courses`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = (await res.json()) as { data?: ApiCourse[] };
    const count = applyCourses(body.data ?? []);
    if (coursesOk !== true) {
      console.info(`[courses] ${count} khoá đang mở, soạn từ trang quản trị`);
      coursesOk = true;
    }
  } catch (error) {
    console.warn(
      `[courses] không đọc được ${API}/api/v1/courses (${String(error)}) — giữ danh sách khoá đang dùng`,
    );
    coursesOk = false;
  }
}
