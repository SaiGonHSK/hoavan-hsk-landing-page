import { values } from "./site";
import { honorPosters } from "./achievements";
import appHome from "@/assets/mobile-app/app-home.png";
import appSplash from "@/assets/mobile-app/app-splash.png";
import classWriting from "@/assets/classes/hoc-vien-lam-bai.jpg";
import faculty from "@/assets/values/doi-ngu-giang-vien.png";

/**
 * Phần minh hoạ cho từng giá trị khác biệt: ảnh, nhãn tab và số liệu nổi bật.
 * Dùng chung cho khối tab ở trang chủ và trang /about/differences nên nội dung
 * chỉ khai báo một lần ở đây, phần chữ vẫn lấy từ content/site.json.
 */
export type ValuePanel = {
  tab: string;
  tabNote: string;
  badge: string;
  /** Ảnh import từ src/assets — để `<Image>` nén và xuất WebP theo đúng khổ hiển thị */
  image: ImageMetadata;
  /** Ảnh vuông (poster vinh danh) — hiện trọn thay vì cắt cạnh */
  contain?: boolean;
  /** Ảnh chụp app — hiện trong khung điện thoại thay cho ảnh nền */
  devices?: ImageMetadata[];
  strong: string;
  note: string;
};

// Poster điểm cao nhất trong bảng vinh danh — minh hoạ cho giá trị "Hiệu quả cao".
const bestPoster = honorPosters.reduce((a, b) =>
  Number(b.total) > Number(a.total) ? b : a,
);

const PANELS: Record<string, ValuePanel> = {
  "vi-nguoi-hoc": {
    tab: "Giáo trình riêng",
    tabNote: "Biên soạn cho người Việt",
    badge: "Giáo trình độc quyền",
    image: classWriting,
    strong: "Học lại miễn phí",
    note: "nếu chưa đạt đầu ra đã cam kết",
  },
  "giang-vien-chat-luong": {
    tab: "Đội ngũ giảng viên",
    tabNote: "Thạc sĩ – Tiến sĩ",
    badge: "Chuyên môn dẫn dắt",
    // Ảnh ghép từ card giảng viên (xem scripts/gen-faculty-image.mjs) chứ không phải ảnh
    // chụp lớp học: tab này nói về học vị của đội ngũ, ảnh phải cho thấy chính họ.
    image: faculty,
    contain: true,
    strong: "Tiến sĩ, Thạc sĩ",
    note: "tốt nghiệp các đại học lớn tại Trung Quốc",
  },
  "ung-dung-hoc-tap": {
    tab: "Ứng dụng luyện đề",
    tabNote: "Ôn tập mọi lúc",
    badge: "Công nghệ học tập",
    image: appHome,
    devices: [appSplash, appHome],
    strong: "Ôn từ vựng · Luyện đề · Theo dõi tiến độ",
    note: "Chuỗi ngày học, điểm tích luỹ và bài tập của lớp đều nằm trong app",
  },
  "hieu-qua-cao": {
    tab: "Đầu ra đạt chuẩn",
    tabNote: "Nghe – nói – đọc – viết",
    badge: "Hiệu quả thực tế",
    image: bestPoster.image,
    contain: true,
    strong: `${bestPoster.exam} ${bestPoster.total}/${bestPoster.max}`,
    note: `Bạn ${bestPoster.name} — thi ngày ${bestPoster.testDate}`,
  },
};

/**
 * Ghép phần chữ (trong `content/site.json`) với phần minh hoạ (khai ở PANELS).
 *
 * Tĩnh: `values` không do trang quản trị soạn. `filter` bỏ giá trị nào chưa có panel,
 * nên thêm một `values[]` mới trong `site.json` mà quên khai PANELS ở trên thì nó
 * không hiện ở khối tab.
 */
export const valuePanels = values
  .filter((v) => PANELS[v.id])
  .map((v) => ({ ...v, ...PANELS[v.id] }));
