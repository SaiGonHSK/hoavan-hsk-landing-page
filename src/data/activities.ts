import poster1 from "@/assets/activities/a1.jpg";
import poster2 from "@/assets/activities/a2.jpg";
import poster3 from "@/assets/activities/a3.jpg";
import poster4 from "@/assets/activities/a4.jpg";
import poster5 from "@/assets/activities/a5.jpg";
import poster6 from "@/assets/activities/a6.jpg";

/**
 * Poster hoạt động do trung tâm thiết kế (ảnh vuông).
 * Ảnh nằm ở src/assets/activities/ để Astro nén và xuất WebP lúc build —
 * bản gốc 2526×2526 nặng ~1,5MB nên không được nhúng thẳng.
 */
export type ActivityPoster = {
  image: ImageMetadata;
  caption: string;
};

export const activityPosters: ActivityPoster[] = [
  {
    image: poster1,
    caption:
      "Minigame Check-in Tết — học viên trao nhau lời chúc năm mới bằng tiếng Trung",
  },
  {
    image: poster2,
    caption: "Lớp HSK2 của thầy Tín gửi lời chúc Tết bằng tiếng Trung",
  },
  {
    image: poster3,
    caption: "Lớp HSK2 của cô Huyền cùng nhau check-in Tết tại trung tâm",
  },
  {
    image: poster4,
    caption: "Bạn Hằng Nga kể về mùa xuân đoàn viên bên gia đình",
  },
  {
    image: poster5,
    caption: "Bạn Kim Phụng check-in Tết trong tà áo dài",
  },
  {
    image: poster6,
    caption: "Bạn Quang Minh gửi lời chúc năm mới đến thầy cô và cả lớp",
  },
];

export type Activity = {

  src: string;

  caption: string;
  width?: number;
  height?: number;
};

/** Ảnh lớp học trong public/ — dùng làm nền mờ ở mục Học thử miễn phí. */
export const activities: Activity[] = [
  {
    src: "/images/activities/lop-luyen-thi-hsk.jpg",
    caption: "Lớp luyện thi HSK với giáo trình ôn thi từ HanBan",
    width: 1024,
    height: 768,
  },
  {
    src: "/images/activities/hoat-dong-giang-sinh.jpg",
    caption: "Hoạt động Giáng sinh cùng học viên tại trung tâm",
    width: 1024,
    height: 683,
  },
  {
    src: "/images/activities/hoat-dong-tet.jpg",
    caption: "Không khí Tết Trung Hoa tại Hoa văn SaigonHSK",
    width: 1024,
    height: 768,
  },
  {
    src: "/images/activities/hoc-vien-lam-bai.jpg",
    caption: "Học viên luyện viết chữ Hán tại lớp",
    width: 1024,
    height: 683,
  },
  {
    src: "/images/activities/giang-vien-chua-bai.jpg",
    caption: "Giảng viên chữa bài trên lớp",
    width: 1024,
    height: 683,
  },
  {
    src: "/images/activities/lop-hoc-buoi-toi.jpg",
    caption: "Lớp học buổi tối dành cho học viên đi làm",
    width: 1024,
    height: 767,
  },
  {
    src: "/images/activities/lop-hoc-nho.jpg",
    caption: "Lớp 10–15 học viên, ai cũng được nói và được sửa",
    width: 1024,
    height: 768,
  },
  {
    src: "/images/activities/tu-van-lo-trinh.jpg",
    caption: "Tư vấn lộ trình học cho học viên mới",
    width: 1024,
    height: 683,
  },
];
