import { values } from "./site";
import { honorPosters } from "./achievements";
import appHome from "@/assets/mobile-app/app-trang-chu.webp";
import appCourse from "@/assets/mobile-app/app-lo-trinh-khoa.webp";
import appWrite from "@/assets/mobile-app/app-tap-viet.webp";
import appDict from "@/assets/mobile-app/app-tra-tu.webp";
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
  /**
   * Vẽ minh hoạ vector thay cho `image`.
   *
   * `image` vẫn phải khai — nó là ảnh dự phòng cho `og:image` và cho bất kỳ chỗ nào
   * dùng `valuePanels` mà chưa biết đến nhánh minh hoạ này.
   */
  illustration?: "textbook-set" | "honor-stack";
  /**
   * Ảnh chụp app — hiện trong khung điện thoại thay cho ảnh nền.
   *
   * Mỗi màn kèm `alt` riêng chứ không đánh số "màn hình 1, 2, 3": ba màn này nói ba
   * việc khác nhau của hệ thống, và `alt` là chỗ duy nhất người dùng trình đọc màn
   * hình (và bộ thu thập của máy tìm kiếm) biết được điều đó.
   */
  devices?: { src: ImageMetadata; alt: string }[];
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
    /*
      Ô ảnh giờ là `TextbookSet` — sáu bìa giáo trình vẽ lại bằng vector, xếp thành một
      xấp trải ngang trên đúng nền `brand-ink-50` của ô.

      Ảnh chụp hai học viên (giữ lại bên dưới làm ảnh dự phòng) cho thấy được hai cuốn.
      Tab này nói về *bộ* giáo trình biên soạn riêng, mà bộ đó có bốn loại sách (giáo
      trình, ngữ pháp, từ vựng, luyện viết) trải từ HSK1 lên HSK4.2 — không tấm ảnh nào
      trong `src/assets/hero/` gom đủ, vì mỗi tấm chỉ có hai bạn cầm hai cuốn.

      Xấp vector thì thấy trọn bốn loại sách và dải cấp trong một hình, và vì bìa thật
      chỉ là khối màu chéo + ô chữ + một ảnh bìa nên vẽ lại gần như không mất gì; đổi lại
      chữ trên bìa sắc ở mọi dpr, không như chữ in trong ảnh chụp.
    */
    illustration: "textbook-set",
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
    tab: "Hệ thống LMS",
    tabNote: "Lộ trình & tiến độ",
    badge: "Nền tảng học tập số",
    /*
      Bốn màn thật của app, chụp từ bản đang chạy. Thứ tự trong mảng là thứ tự xếp lớp:
      phần tử ĐẦU nằm sau cùng, phần tử CUỐI nằm trước và hiện trọn.

      Vì vậy màn chi tiết khoá xếp cuối: nó là thứ duy nhất chứng minh đây là một LMS chứ
      không phải app ôn từ vựng — lộ trình 18 bài, tiến độ 10/18, giảng viên và lịch lớp
      gắn vào khoá. Ba màn ló ra phía sau (tập viết theo nét, từ điển giáo trình, trang
      chủ có chuỗi ngày học) nói rằng hệ thống còn nhiều phần nữa.

      Ba màn sau mỗi cái chỉ ló ra 16% bề ngang. Chọn thứ tự theo mảng màu ở dải ló đó:
      tập viết (nền trắng, chữ Hán đỏ) → từ điển (dải xám mờ) → trang chủ (thẻ ảnh khoá
      học) → chi tiết khoá. Xem `WhyUs.astro` để biết vì sao chồng lệch chứ không xếp
      cạnh nhau.

      Trước đây ô này chỉ có hai màn (splash và luyện đề). Màn splash chỉ có logo, không
      nói được hệ thống làm gì.
    */
    image: appCourse,
    devices: [
      {
        src: appWrite,
        alt: "Bài tập viết chữ Hán trên LMS — xem thứ tự nét của chữ 健康 rồi viết lại bằng ngón tay",
      },
      {
        src: appDict,
        alt: "Từ điển trong LMS — tra 331 từ của giáo trình bằng chữ Hán, pinyin, nghĩa tiếng Việt hoặc viết tay",
      },
      {
        src: appHome,
        alt: "Trang chủ hệ thống LMS SaigonHSK — chuỗi 19 ngày học liên tiếp và các khoá học viên đang theo",
      },
      {
        src: appCourse,
        alt: "Chi tiết khoá HSK3 trên LMS — lộ trình 18 bài, tiến độ 10/18, giảng viên và lịch lớp phụ trách",
      },
    ],
    strong: "Lộ trình từng bài · Tiến độ đồng bộ · Từ điển giáo trình",
    note: "Khoá học chia sẵn theo bài, tiến độ và điểm số đồng bộ với giảng viên; tra từ theo giáo trình, tập viết theo thứ tự nét và luyện nói – luyện nghe với AI đều nằm trong hệ thống",
  },
  "hieu-qua-cao": {
    tab: "Đầu ra đạt chuẩn",
    tabNote: "Nghe – nói – đọc – viết",
    badge: "Hiệu quả thực tế",
    /*
      Ô ảnh là `HonorStack` — cả bốn poster vinh danh xếp thành một xấp, cùng cách bày
      với bộ giáo trình ở tab đầu.

      Trước đây chỉ hiện một tấm (`bestPoster`) phóng to giữa ô. Tab này nói về đầu ra
      của trung tâm, mà một tấm thì chỉ chứng minh được đúng một bạn thi đỗ — xấp bốn
      tấm cho thấy chuyện đó lặp lại qua nhiều kỳ thi, vẫn giữ tấm điểm cao nhất ở lớp
      trước cùng để khớp với dòng số liệu bên dưới.

      `image` giữ nguyên `bestPoster.image` làm ảnh dự phòng cho `og:image`.
    */
    illustration: "honor-stack",
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
