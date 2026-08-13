import { values } from "./site";
import { honorPosters } from "./achievements";
import appHome from "@/assets/mobile-app/app-home.webp";
import appPractice from "@/assets/mobile-app/app-practice.webp";
import textbook from "@/assets/hero/hoc-vien-hsk1-hsk4-tach-nen.webp";
import faculty from "@/assets/values/doi-ngu-giang-vien.webp";

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
    /*
      Ảnh mẫu hai học viên mặc áo trung tâm cầm "GIÁO TRÌNH HSK1" và "GIÁO TRÌNH HSK4.1"
      — cùng tấm đang dùng ở thẻ "Giáo trình HSK" trong hero (`HeroV4`), nhưng lấy **bản
      tách nền**.

      Bản còn nền chụp trong phòng học: backdrop logo, cửa sổ, tranh thuỷ mặc, dãy ghế
      xanh — bốn mảng màu lạ trong một khối mà ba tab kia đều là chủ thể nằm trên nền
      xám phẳng (ảnh ghép giảng viên, poster vinh danh, khung điện thoại). Tách nền thì
      hai bạn đứng thẳng trên nền `brand-ink-50` của ô ảnh, cùng một cách trình bày với
      thẻ "Đội ngũ giảng viên".

      Trước đây ô này là ảnh chụp chồng giáo trình đặt trên bàn: ảnh chụp vội bằng điện
      thoại, sách nằm nghiêng, nền là chiếc túi vải đỏ. Tấm này chụp dàn dựng, nền lớp
      học sạch, bìa giáo trình cầm thẳng nên đọc được tên và cấp ngay — mà vẫn là giáo
      trình thật của trung tâm chứ không phải sách kho.

      Dùng lại đúng tấm của hero là cố ý: hero mới chỉ cho thấy nó trong một ô ảnh nhỏ
      nghiêng trên dây, ở đây nó được xem trọn nửa panel.

      `contain` — hiện trọn, không phủ kín ô như ảnh chụp lớp.

      Ảnh dọc (1122×1402) mà ô ảnh của panel rộng–thấp (~760×512 ở desktop, tỉ lệ 1,49):
      phủ kín thì chỉ thấy được 54% chiều cao ảnh, trong khi từ đỉnh đầu bạn nam (y≈230)
      xuống mép dưới cuốn HSK4.1 (y≈1150) đã chiếm 66%. Nghĩa là mọi cách canh đều phải
      cắt — hoặc mất chân cuốn sách, hoặc mất đỉnh đầu. Hiện trọn thì cả người lẫn hai
      cuốn giáo trình đều đủ, đúng cách hai tab "Đội ngũ giảng viên" và "Đầu ra đạt
      chuẩn" đang làm.
    */
    image: textbook,
    contain: true,
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
    /*
      Hai màn thật của app, chụp từ bản đang chạy.

      Trước đây ô bên trái là màn splash — chỉ có logo, không nói được app làm gì.
      Đổi sang màn luyện đề: cặp ảnh giờ kể đúng một vòng dùng app, trang chủ có
      chuỗi ngày học và khoá đang theo, bên cạnh là một câu đang làm dở.
    */
    image: appHome,
    devices: [appPractice, appHome],
    strong: "Ôn từ vựng · Luyện đề · AI luyện nói nghe",
    note: "Chuỗi ngày học, điểm tích luỹ, bài tập của lớp và phần luyện nói – luyện nghe với AI đều nằm trong app",
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
