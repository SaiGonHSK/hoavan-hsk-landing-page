/**
 * Client cho API "đăng ký tư vấn" của `hoavan-hsk-server`:
 * `POST {PUBLIC_API_BASE}/api/v1/leads`.
 *
 * Endpoint này là write duy nhất của API không cần token, nên nó có rate limit
 * riêng theo IP (`AUTH_RATE_LIMIT`/`AUTH_RATE_WINDOW`, mặc định 60 lần / 5 phút).
 * Trang landing build tĩnh (không có server runtime), vì vậy request đi thẳng từ
 * browser: nếu API ở origin khác thì origin của landing phải nằm trong
 * `CORS_ORIGINS` của server, còn cùng origin (`PUBLIC_API_BASE=/`) thì không.
 *
 * Tên field trùng đúng `name=` của RegisterForm.astro và json tag của
 * `PublicCreateRequest` bên Go, nên `new FormData(form)` gửi đi được luôn.
 * `source` và `status` do server tự đặt (`landing` / `new`) — người gửi form
 * không được tự khai mình là lead đã liên hệ.
 */

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
};

const GENERIC =
  "Gửi chưa thành công. Bạn vui lòng gọi hotline hoặc chat Zalo để được hỗ trợ ngay.";

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  if (!LEADS_ENDPOINT) return { ok: false, message: GENERIC };

  let res: Response;
  try {
    res = await fetch(LEADS_ENDPOINT, {
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
