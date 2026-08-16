import { getContent, staticContent } from "./content";

/**
 * Cảm nhận học viên — soạn từ trang quản trị (một trong `DYNAMIC_KEYS`).
 *
 * Kiểu khai tường minh chứ không suy từ `content/site.json`: `link`, `rating`,
 * `source` và `postedAt` là những trường thêm dần, và cảm nhận cũ trong bản chụp
 * không có chúng — suy kiểu sẽ ra "trường không tồn tại" và chỗ dùng phải ép kiểu.
 */
export type Testimonial = {
  name: string;
  role: string;
  /** Chữ thuần, KHÔNG phải HTML — in bằng nội suy, không dùng `set:html`. */
  quote: string;
  /** Ảnh trong `public/`; rỗng thì hiện chữ cái đầu của tên. */
  image?: string;
  /** Bài đăng gốc trên Facebook/Google; rỗng thì thẻ không có link kiểm chứng. */
  link?: string;
  /**
   * Điểm 1–5 khi cảm nhận đến kèm một điểm số thật (đánh giá Google).
   *
   * Rỗng KHÁC 0 sao: những cảm nhận trung tâm tự ghi lại sau khoá học không có
   * điểm nào, và vẽ 0/5 sao cho chúng là bịa ra một điểm xấu. Chỗ nào vẽ sao phải
   * kiểm `rating` trước.
   */
  rating?: number;
  /** Nơi đăng — `"google"`, `"facebook"`, hoặc rỗng nếu trung tâm tự ghi lại. */
  source?: string;
  /**
   * Thời điểm đăng, GIỮ NGUYÊN chữ của nguồn — "2 tuần trước", "3 tháng trước".
   *
   * Không đổi thành ngày thật: Google chỉ cho biết khoảng cách tương đối, nên quy
   * ra một ngày cụ thể là tự bịa thêm độ chính xác.
   *
   * Chữ này VẪN quyết định thứ tự hiển thị, qua `ageInDays` — nhãn tương đối của
   * Google đơn điệu theo tuổi thật ("2 tuần trước" luôn mới hơn "3 tháng trước"),
   * nên nó đủ để sắp thứ tự dù không đủ để in ra một ngày.
   */
  postedAt?: string;
};

/**
 * Danh sách thô, ĐÚNG thứ tự người soạn xếp trong console.
 *
 * Gần như không chỗ nào nên dùng hàm này — dùng `orderedTestimonials()`. Còn đây
 * để những chỗ cần đếm hoặc kiểm tra danh sách gốc (ví dụ "có bị `limit` cắt bớt
 * không") không phải trả giá cho một lần sắp xếp.
 */
export const testimonials = (): Testimonial[] => getContent().testimonials;

/**
 * Thứ tự hiển thị chuẩn: mới nhất trước.
 *
 * MỘT hàm duy nhất cho mọi chỗ hiển thị cảm nhận, và đây là điều kiện để link "Chi
 * tiết" chạy đúng: mã neo (`reviewAnchor`) tính theo vị trí trong danh sách này, nên
 * dải ngang ở trang chủ và danh sách ở `/about/reviews` phải đọc cùng một thứ tự.
 * Chỗ nào tự sắp lại là link của chỗ đó trỏ sang thẻ khác.
 *
 * Cảm nhận không có `postedAt` xuống cuối, không phải lên đầu: đó là những cảm nhận
 * trung tâm tự ghi lại sau khoá học, không ai biết chúng bao nhiêu tuổi — mà "không
 * rõ tuổi" thì không có cơ sở gì để đứng trước một đánh giá đăng tuần này. Trong
 * nhóm đó thì giữ nguyên thứ tự người soạn xếp (`Array.sort` của JS ổn định).
 */
export const orderedTestimonials = (): Testimonial[] =>
  [...testimonials()].sort((a, b) => ageInDays(a.postedAt) - ageInDays(b.postedAt));

/** Số chữ Google viết ra thay vì chữ số — thực tế chỉ gặp "một". */
const WORD_NUMBERS: Record<string, number> = {
  một: 1,
  hai: 2,
  ba: 3,
  bốn: 4,
  năm: 5,
  sáu: 6,
  bảy: 7,
  tám: 8,
  chín: 9,
  mười: 10,
};

/** Số ngày của mỗi đơn vị. Dưới một ngày đều quy về 0 — cùng "mới nhất". */
const UNIT_DAYS: Record<string, number> = {
  giây: 0,
  phút: 0,
  giờ: 0,
  ngày: 1,
  tuần: 7,
  tháng: 30,
  năm: 365,
};

/**
 * Đổi nhãn tương đối của Google thành số ngày để sắp thứ tự.
 *
 * Con số trả về là XẤP XỈ và chỉ dùng để so sánh, không bao giờ in ra: "3 tháng
 * trước" thành 90 ngày, còn tháng thật thì 28–31 ngày. Sai số đó không đổi được thứ
 * tự, vì hai bài cách nhau đủ để Google đổi nhãn thì cũng cách nhau xa hơn sai số.
 *
 * Không đọc được (rỗng, hoặc chữ lạ) thì trả `Infinity` để bài đó xuống cuối — thà
 * xếp cuối còn hơn nhận 0 rồi trèo lên đầu danh sách như một bài vừa đăng.
 */
function ageInDays(postedAt?: string): number {
  const text = (postedAt ?? "").toLowerCase();
  const match = text.match(
    /(\d+|một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)?\s*(giây|phút|giờ|ngày|tuần|tháng|năm)\s*trước/,
  );
  if (!match) return Infinity;

  const [, rawCount, unit] = match;
  // Thiếu số là "a week ago" dịch sang "tuần trước" — Google bỏ số khi nó là 1.
  const count = rawCount ? (WORD_NUMBERS[rawCount] ?? Number(rawCount)) : 1;
  if (!Number.isFinite(count)) return Infinity;

  return count * UNIT_DAYS[unit];
}

/**
 * Tổng quan điểm đánh giá trên trang nguồn — tĩnh trong `content/site.json`.
 *
 * Tĩnh chứ không động: đây là con số của CẢ trang Google (điểm trung bình và tổng
 * số bài), không suy được từ danh sách cảm nhận đang hiển thị — trung tâm chỉ đưa
 * lên một phần, và người soạn còn xoá bớt được. Suy từ mảng `testimonials` sẽ ra
 * "5,0 · 12 đánh giá" trong khi trang nguồn ghi 65, tức là một con số sai tự tin.
 *
 * Đổi số thì sửa file rồi deploy — cùng đường mà `contact` và `stats` đang đi.
 */
export type ReviewsSummary = {
  /** Điểm trung bình, viết như nguồn hiển thị: "5,0". */
  score: string;
  /** Tổng số bài đánh giá trên trang nguồn. */
  count: number;
  sourceLabel: string;
  /** Link tới danh sách đánh giá gốc để người xem tự kiểm chứng. */
  sourceUrl: string;
  /** Ngày trung tâm đối chiếu lại hai con số trên, dạng ISO — hiện ở trang chi tiết. */
  checkedAt: string;
};

export const reviewsSummary = (): ReviewsSummary => staticContent.reviewsSummary;

/**
 * Mã neo của một cảm nhận trên `/about/reviews`.
 *
 * `index` là vị trí trong `orderedTestimonials()` — KHÔNG phải trong danh sách thô.
 *
 * Có `index` trong mã vì tên KHÔNG duy nhất — hai "Nguyễn Anh" là chuyện thường ở
 * mấy chục đánh giá, mà hai thẻ cùng `id` thì link "chi tiết" của thẻ sau nhảy về
 * thẻ trước. Vị trí trong danh sách thì luôn duy nhất.
 *
 * Kèm tên chứ không chỉ dùng số thứ tự: URL `#review-3` không cho biết nó dẫn tới
 * đâu, và ai chia sẻ link đó cũng không đọc ra được.
 */
export const reviewAnchor = (t: Testimonial, index: number): string =>
  `review-${index + 1}-${slugify(t.name)}`;

/** Đường dẫn tới bản đầy đủ của một cảm nhận trên trang đánh giá chi tiết. */
export const reviewDetailHref = (t: Testimonial, index: number): string =>
  `/about/reviews#${reviewAnchor(t, index)}`;

/** Nhãn nguồn để hiện cho người đọc. Nguồn lạ thì trả về nguyên văn. */
export const sourceLabel = (source?: string): string => {
  switch ((source ?? "").toLowerCase()) {
    case "google":
      return "Google";
    case "facebook":
      return "Facebook";
    case "":
      return "";
    default:
      return source as string;
  }
};

/**
 * Bỏ dấu tiếng Việt rồi rút về [a-z0-9-].
 *
 * `normalize("NFD")` tách chữ và dấu thành hai ký tự rồi xoá dải dấu — nhờ vậy
 * không cần bảng ánh xạ tay. Riêng "đ/Đ" phải xử lý trước: nó là một ký tự Latin
 * độc lập, không phải "d" + dấu, nên NFD không tách được.
 */
function slugify(value: string): string {
  return value
    .replace(/[đĐ]/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
