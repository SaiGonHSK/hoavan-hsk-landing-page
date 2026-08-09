import christmasClassPhoto from "@/assets/activities/giang-sinh-lop-chup-anh.webp";
import midAutumn from "@/assets/activities/trung-thu-goc-check-in.webp";
import teachersDay from "@/assets/activities/ngay-nha-giao-viet-nam.webp";
import tet from "@/assets/activities/a1.webp";
import dailyClassExercise from "@/assets/daily/lop-lam-bai-tap.webp";
import dailyTeacherRounds from "@/assets/daily/giang-vien-di-quanh-lop.webp";
import dailyAoDaiLesson from "@/assets/daily/co-giao-ao-dai-giang-bai.webp";
import dailyMilkTea from "@/assets/daily/lop-uong-tra-sua.webp";
import dailyMilkTeaHandout from "@/assets/daily/giang-vien-phat-tra-sua.webp";
import dailyFrontDesk from "@/assets/daily/quay-le-tan-trang-tri.webp";
import dailyWaitingRoom from "@/assets/daily/hoc-vien-cho-vao-lop.webp";

/**
 * Bốn dịp lễ trung tâm tổ chức cho học viên, mỗi dịp đúng một ảnh:
 * Giáng sinh, Trung thu, Tết, Ngày Nhà giáo Việt Nam.
 *
 * Mỗi dịp một ảnh chứ không phải cả album: lưới vừa đúng một hàng 4 ô, người xem
 * nắm ngay "trung tâm có tổ chức bốn dịp này" mà không phải cuộn qua chục tấm
 * cùng phông cùng tông đỏ.
 *
 * Ảnh nằm ở src/assets/activities/ để Astro nén và xuất WebP theo đúng khổ hiển thị —
 * bản gốc tới 2526px, nhúng thẳng thì mỗi ô 280px vẫn phải tải nguyên bản.
 *
 * Trong mỗi dịp chọn bản gốc lớn nhất đang có: ô ảnh cắt vuông nên giới hạn thật là
 * cạnh ngắn, cạnh ngắn không đủ gấp đôi bề rộng ô thì màn Retina nhìn mờ.
 */
export type ActivityPoster = {
  image: ImageMetadata;
  caption: string;
};

export const activityPosters: ActivityPoster[] = [
  {
    image: christmasClassPhoto,
    caption:
      "圣诞节快乐 — cả lớp chụp ảnh cùng cây thông ở góc check-in Giáng sinh của trung tâm",
  },
  {
    image: midAutumn,
    caption: "Góc Trung thu 中秋 với bánh, trà và đèn lồng do trung tâm bày",
  },
  {
    image: tet,
    caption:
      "Minigame Check-in Tết — học viên trao nhau lời chúc năm mới bằng tiếng Trung",
  },
  {
    image: teachersDay,
    caption:
      "Góc chúc mừng Ngày Nhà giáo Việt Nam — học viên viết lời chúc gửi từng giảng viên",
  },
];

export type Activity = {
  image: ImageMetadata;
  caption: string;
};

/**
 * Ảnh sinh hoạt thường ngày ở trung tâm — lớp đang học, giảng viên đi quanh lớp,
 * học viên chờ vào lớp. Dùng làm khảm nền mờ ở mục Học thử.
 *
 * Nằm ở src/assets/daily/ chứ không phải public/: chỗ dùng chỉ hiện mỗi ô ~220px,
 * để trong public/ thì trình duyệt phải tải nguyên bản 2048px cho từng ô.
 */
export const dailyMoments: Activity[] = [
  {
    image: dailyClassExercise,
    caption: "Lớp kín chỗ, cả lớp cùng làm bài trên lớp",
  },
  {
    image: dailyTeacherRounds,
    caption: "Giảng viên đi quanh lớp xem từng bạn làm bài",
  },
  {
    image: dailyAoDaiLesson,
    caption: "Giảng viên giảng bài trong lớp buổi tối",
  },
  {
    image: dailyMilkTea,
    caption: "Trung tâm mời trà sữa cả lớp giữa buổi học",
  },
  {
    image: dailyMilkTeaHandout,
    caption: "Giảng viên phát nước cho học viên trong lớp",
  },
  {
    image: dailyFrontDesk,
    caption: "Quầy lễ tân trang trí theo mùa, luôn có người trực tư vấn",
  },
  {
    image: dailyWaitingRoom,
    caption: "Học viên chờ tới giờ vào lớp ở khu tiếp đón",
  },
];
