/**
 * Client cho hai write công khai của `hoavan-hsk-server`:
 *
 * - `POST {PUBLIC_API_BASE}/api/v1/leads` — "đăng ký tư vấn", CRM inbox.
 * - `POST {PUBLIC_API_BASE}/api/v1/schedule/classes/:id/register` — "đăng ký giữ chỗ"
 *   một lớp cụ thể trên lịch khai giảng.
 *
 * Cùng một file vì chúng dùng chung base URL, chung envelope, chung bảng dịch lỗi.
 *
 * Ai gọi cái nào: modal "Đăng ký giữ chỗ" trên trang Lịch khai giảng chỉ gọi
 * `submitClassRegistration` — giữ chỗ **không** sinh lead, để người đã vào lớp không
 * nằm trong danh sách gửi chương trình tuyển sinh. Form "Đăng ký tư vấn" ở `/register`
 * thì gọi `submitLead`, và gọi thêm `submitClassRegistration` khi khách có chọn lớp;
 * ở đó lead mới là mục đích chính nên vẫn là một lần bấm hai lần ghi.
 *
 * Endpoint này là write duy nhất của API không cần token, nên nó có rate limit
 * riêng theo IP (`AUTH_RATE_LIMIT`/`AUTH_RATE_WINDOW`, mặc định 60 lần / 5 phút).
 * Trang landing build tĩnh (không có server runtime), vì vậy request đi thẳng từ
 * browser: nếu API ở origin khác thì origin của landing phải nằm trong
 * `CORS_ORIGINS` của server, còn cùng origin (`PUBLIC_API_BASE=/`) thì không.
 *
 * Tên field trùng đúng `name=` của RegisterForm.astro và json tag của
 * `PublicCreateRequest` bên Go, nên `new FormData(form)` gửi đi được luôn.
 * `status` do server tự đặt (`new`), còn `source` chỉ nhận được các kênh khách
 * tự vào (`landing`/`facebook`/`zalo`) — xem `lib/attribution.ts`. Người gửi form
 * không được tự khai mình là lead hotline đã liên hệ.
 */

import type { LeadSource } from "@/lib/attribution";

const RAW_BASE = (import.meta.env.PUBLIC_API_BASE ?? "").trim();

/**
 * `PUBLIC_API_BASE=/` = cùng origin: production có nginx của domain proxy `/api/`
 * về server Go, nên request đi bằng đường dẫn tương đối. Không nhúng domain vào
 * bản build là cố ý — cùng một image chạy được cho cả www, non-www và staging,
 * và vì same-origin nên không cần CORS (không có preflight, không lộ port API).
 */
const BASE = RAW_BASE === "/" ? "" : RAW_BASE.replace(/\/+$/, "");

/**
 * URL nhận đăng ký. `PUBLIC_REGISTER_ENDPOINT` là đường tắt để trỏ sang một
 * endpoint khác (form service, staging) mà không cần đổi cả API base.
 *
 * Rỗng = chưa cấu hình: chỗ gọi tự lùi về mở sẵn mail gửi trung tâm, không được
 * âm thầm bỏ mất thông tin khách đã nhập.
 */
export const LEADS_ENDPOINT =
  (import.meta.env.PUBLIC_REGISTER_ENDPOINT ?? "").trim() ||
  // Kiểm tra RAW_BASE chứ không phải BASE: "/" là đã cấu hình (same-origin), còn
  // BASE của nó là chuỗi rỗng — giống hệt trường hợp chưa cấu hình gì.
  (RAW_BASE ? `${BASE}/api/v1/leads` : "");

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  course?: string;
  level?: string;
  note?: string;
  /** Kênh khách vào landing, do `leadSource()` xác định — không phải khách nhập. */
  source?: LeadSource;
};

export type LeadResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      /** Khoá là tên field của form, để chỗ gọi tô đỏ đúng input. */
      fields?: Record<string, string>;
    };

/** Envelope chung của mọi endpoint bên server. */
type Envelope = {
  success: boolean;
  data?: { received?: boolean };
  error?: { code: string; message: string; fields?: Record<string, string> };
};

const LABELS: Record<string, string> = {
  name: "Họ và tên",
  phone: "Số điện thoại",
  email: "Email",
  course: "Khoá học quan tâm",
  level: "Trình độ hiện tại",
  note: "Ghi chú",
  source: "Nguồn",
};

const GENERIC =
  "Gửi chưa thành công. Bạn vui lòng gọi hotline hoặc chat Zalo để được hỗ trợ ngay.";

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  return postPublic(LEADS_ENDPOINT, payload);
}

/**
 * URL đăng ký giữ chỗ một lớp. Rỗng khi chưa cấu hình API base, giống `LEADS_ENDPOINT`.
 *
 * Không đi qua `PUBLIC_REGISTER_ENDPOINT`: biến đó là đường tắt trỏ form sang một chỗ
 * nhận lead khác (form service, staging), mà chỗ đó không có bảng lớp nào để ghi vào.
 */
const classRegisterEndpoint = (classId: string): string =>
  RAW_BASE ? `${BASE}/api/v1/schedule/classes/${encodeURIComponent(classId)}/register` : "";

/**
 * Có gọi được đường giữ chỗ hay không — dùng làm guard trước khi submit.
 *
 * Phải là cờ riêng chứ không dùng lại `LEADS_ENDPOINT`: hai đường phụ thuộc hai biến môi
 * trường khác nhau. Cấu hình chỉ có `PUBLIC_REGISTER_ENDPOINT` mà thiếu `PUBLIC_API_BASE`
 * sẽ khiến `LEADS_ENDPOINT` khác rỗng trong khi `classRegisterEndpoint` vẫn rỗng — guard
 * cho đi tiếp rồi `postPublic` trả câu lỗi chung, và khách mất chỗ mà không hiểu vì sao.
 */
export const CLASS_REGISTER_READY = Boolean(RAW_BASE);

export type ClassRegistrationPayload = {
  /** Id lớp trong bảng `classes` — `ScheduleRow.id`, không phải mã lớp. */
  classId: string;
  name: string;
  phone: string;
  email?: string;
  note?: string;
};

/**
 * Ghi khách vào danh sách chờ của đúng một lớp.
 *
 * Đứng một mình được: từ modal Lịch khai giảng đây là request DUY NHẤT của lần bấm đó.
 *
 * Server vẫn tra lead đang mở theo số điện thoại để gắn `lead_id` — nhưng chỉ là *nối*
 * vào lead đã có sẵn, không tạo mới. Nên chỗ nào cũng gọi `submitLead` trước (`/register`)
 * thì phải giữ đúng thứ tự đó để có link; chỗ không gọi thì `lead_id` rỗng, và dòng đăng
 * ký vẫn đủ dùng vì nó tự mang tên, số điện thoại, email của khách.
 */
export async function submitClassRegistration(
  payload: ClassRegistrationPayload,
): Promise<LeadResult> {
  const { classId, ...body } = payload;
  return postPublic(classRegisterEndpoint(classId), body);
}

/**
 * POST một JSON tới endpoint công khai và dịch mọi kiểu thất bại thành `LeadResult`.
 *
 * Hai endpoint trả cùng một envelope và cùng chịu một rate limiter, nên phần xử lý lỗi
 * — mất mạng, 429, lỗi theo field — giống nhau từng dòng.
 */
async function postPublic(endpoint: string, payload: unknown): Promise<LeadResult> {
  if (!endpoint) return { ok: false, message: GENERIC };

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Mất mạng, DNS, CORS chặn… — không có status để phân biệt.
    return {
      ok: false,
      message:
        "Không kết nối được tới hệ thống. Bạn kiểm tra lại mạng rồi gửi lại, hoặc gọi hotline giúp trung tâm nhé.",
    };
  }

  // Lỗi 5xx hoặc proxy chặn có thể trả HTML, nên parse phải bọc try.
  let body: Envelope | null = null;
  try {
    body = (await res.json()) as Envelope;
  } catch {
    body = null;
  }

  if (res.ok && body?.success) return { ok: true };

  if (res.status === 429) {
    return {
      ok: false,
      message:
        "Bạn gửi quá nhiều lần trong thời gian ngắn. Vui lòng thử lại sau vài phút hoặc gọi hotline để được tư vấn ngay.",
    };
  }

  const fields = body?.error?.fields;
  if (fields) {
    const [field, detail] = Object.entries(fields)[0] ?? [];
    if (field && detail) {
      return {
        ok: false,
        message: `${LABELS[field] ?? field}: ${detail.charAt(0).toLowerCase()}${detail.slice(1)}`,
        fields,
      };
    }
  }

  return { ok: false, message: body?.error?.message ?? GENERIC };
}
