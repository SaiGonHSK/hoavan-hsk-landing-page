/**
 * Chương trình ưu đãi **cố định** của trung tâm — ba chương trình áp dụng quanh năm, do
 * trung tâm gửi sang. Khối này để trong repo chứ không lấy từ API như `testimonials`/`faqs`:
 * nó gần như không đổi, và mỗi con số ở đây là một cam kết về tiền nên phải đi qua một lần
 * commit chứ không phải sửa thẳng trên trang quản trị.
 *
 * Ưu đãi **theo dịp lễ** (30/4, 2/9, 20/11, Tết…) KHÔNG nằm ở đây. Trung tâm chốt vào ngày
 * 25 hằng tháng, mỗi dịp một nội dung khác nhau và có ngày hết hạn — đưa vào cùng mảng này
 * thì đến lúc hết dịp phải nhớ quay lại xoá, mà quên một lần là trang treo ưu đãi đã hết
 * hạn. Nay trang chỉ nói đúng một câu: `promotionNote` báo cho người đọc biết chỗ nào có
 * ưu đãi dịp lễ và khi nào cập nhật.
 */
export type Promotion = {
  /** Dùng làm `key` khi render, không hiện ra ngoài. */
  id: string;

  /**
   * Chữ nhỏ đặt TRÊN con số, chỉ dùng khi ưu đãi có nhiều mức và con số in to là mức cao
   * nhất — không có nó thì "200.000" đọc ra là mức áp dụng cho mọi trường hợp.
   */
  valuePrefix?: string;
  /**
   * Con số in to ở nửa trái phiếu. Chỉ CON SỐ, đơn vị tiền để ở `unit`: nửa trái rộng chưa
   * tới 7rem, mà một chữ "đ" dính sau con số chiếm thêm chừng 13% bề rộng — đủ để ép cỡ
   * chữ xuống một bậc ở khổ 1024px. "đồng" nằm ở dòng dưới thì vẫn đọc ra đủ nghĩa.
   */
  value: string;
  /** Dòng nhỏ dưới con số: đơn vị và con số này tính trên cái gì. */
  unit: string;

  title: string;
  desc: string;

  /**
   * Màu nhấn của tấm phiếu. Ba mã màu thật khai trong `Promotions.astro` — ở đây chỉ chọn
   * MÀU NÀO, không nói màu đó là gì.
   *
   * Mỗi màu gắn với nghĩa của chính ưu đãi, không phải rải cho ba tấm khác nhau:
   *
   *   `green` — đi lên một bậc (học lên khoá tiếp theo)
   *   `gold`  — tiền trung tâm trả lại (phí giới thiệu). Cũng đúng thứ vàng đã dùng cho
   *             mấy hình dán trong hero, nên nó không phải màu lạ với trang.
   *   `blue`  — nhiều người (đăng ký theo nhóm)
   *
   * Vì gắn với nghĩa nên khi đổi nội dung một tấm thì phải xem lại màu của tấm đó, chứ
   * không giữ nguyên màu theo vị trí.
   */
  accent: "green" | "gold" | "blue";

  /**
   * Ba dòng ở chân tấm phiếu (`Promotions.astro`) — cùng vai trò với hàng
   * "Redemption / Validity / Use" trên phiếu giảm giá thật: điều kiện dùng, gói gọn thành
   * cặp nhãn–giá trị đọc lướt được.
   *
   * ĐÚNG BA MỤC mỗi ưu đãi, không hơn không kém: chân phiếu chia ba cột đều nhau, hai mục
   * thì cột thứ ba trống, bốn mục thì phải xuống hàng và ba tấm phiếu cao khác nhau.
   *
   * Mọi giá trị ở đây đều nói lại điều đã có trong `desc`/`value`/`unit` bằng ít chữ hơn,
   * KHÔNG thêm điều kiện mới. Đây là ràng buộc bắt buộc: mỗi dòng ở đây là một cam kết về
   * tiền, và một điều kiện tự nghĩ ra ở phần chân phiếu thì người đọc vẫn hiểu là trung tâm
   * hứa. Sửa `desc` thì phải xem lại ba dòng này.
   *
   * Hai mức của ưu đãi nhóm (2 bạn / 5 bạn) nằm luôn ở đây, không còn trường `tiers` riêng:
   * hai chỗ cùng giữ một con số tiền thì sớm muộn cũng lệch nhau một lần sửa.
   */
  terms: { label: string; value: string }[];
};

/**
 * `desc` cố ý ngắn — đây là chú thích cho con số ở nửa trái phiếu, không phải một đoạn giới
 * thiệu. Nửa phải của phiếu chỉ rộng chừng 160px ở khổ máy hẹp nhất mà vẫn xếp ba cột
 * (1024px), nên một câu hai mươi chữ ở đó thành sáu dòng và cả ba tấm phiếu phải cao theo.
 * Điều kiện áp dụng đã nằm gọn trong `title` và `unit`, `desc` chỉ nói phần còn lại.
 */
export const promotions: Promotion[] = [
  {
    id: "next-course",
    accent: "green",
    value: "5%",
    unit: "học phí khoá sau",
    title: "Học lên khoá tiếp theo",
    desc: "Giảm ngay khi học viên đang học đăng ký khoá kế tiếp.",
    terms: [
      { label: "Dành cho", value: "Học viên đang học" },
      { label: "Áp dụng", value: "Khoá kế tiếp" },
      { label: "Mức giảm", value: "5% học phí" },
    ],
  },
  {
    id: "referral",
    accent: "gold",
    value: "200.000",
    unit: "đồng mỗi học viên",
    title: "Giới thiệu học viên mới",
    desc: "Trung tâm gửi phí giới thiệu khi bạn mới đăng ký khoá học.",
    terms: [
      { label: "Dành cho", value: "Người giới thiệu" },
      { label: "Nhận khi", value: "Bạn mới nhập học" },
      { label: "Mức nhận", value: "200.000đ/bạn" },
    ],
  },
  {
    id: "group",
    accent: "blue",
    valuePrefix: "Đến",
    value: "200.000",
    unit: "đồng mỗi học viên",
    title: "Đăng ký theo nhóm",
    desc: "Cả nhóm cùng đăng ký, mỗi bạn đều được giảm học phí.",
    terms: [
      { label: "Nhóm từ 2 bạn", value: "Giảm 100.000đ" },
      { label: "Nhóm từ 5 bạn", value: "Giảm 200.000đ" },
      { label: "Áp dụng", value: "Mỗi học viên" },
    ],
  },
];

/**
 * Câu chốt về ưu đãi theo dịp lễ. Có nêu ngày 25 vì đó là thông tin dùng được: người đang
 * cân nhắc biết chính xác khi nào quay lại xem, thay vì một câu "theo dõi để cập nhật" không
 * nói gì.
 *
 * Câu này nằm dưới ba tấm phiếu (`Promotions.astro`) và cố ý mang hình dạng khác hẳn chúng:
 * nó là một lời hẹn, không phải một ưu đãi đang áp dụng.
 */
export const promotionNote =
  "Ưu đãi theo dịp lễ (30/4, 2/9, 20/11, Tết…) được trung tâm cập nhật vào ngày 25 hằng tháng.";
