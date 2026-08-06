import poster1 from "@/assets/activities/a1.jpg";
import poster2 from "@/assets/activities/a2.jpg";
import poster3 from "@/assets/activities/a3.jpg";
import poster4 from "@/assets/activities/a4.jpg";
import poster5 from "@/assets/activities/a5.jpg";
import poster6 from "@/assets/activities/a6.jpg";
import classHsk from "@/assets/classes/lop-luyen-thi-hsk.jpg";
import classChristmas from "@/assets/classes/hoat-dong-giang-sinh.jpg";
import classTet from "@/assets/classes/hoat-dong-tet.jpg";
import classWriting from "@/assets/classes/hoc-vien-lam-bai.jpg";
import classFeedback from "@/assets/classes/giang-vien-chua-bai.jpg";
import classEvening from "@/assets/classes/lop-hoc-buoi-toi.jpg";
import classSmall from "@/assets/classes/lop-hoc-nho.jpg";
import classConsult from "@/assets/classes/tu-van-lo-trinh.jpg";

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
  image: ImageMetadata;
  caption: string;
};

/**
 * Ảnh lớp học chụp tại trung tâm.
 *
 * Nằm ở src/assets/classes/ chứ không phải public/: mọi chỗ dùng đều thu nhỏ ảnh
 * (dải cơ sở vật chất 320px, khảm nền ở mục Học thử ~180px), để trong public/ thì
 * trình duyệt phải tải nguyên bản 1024px cho từng ô.
 */
export const activities: Activity[] = [
  {
    image: classHsk,
    caption: "Lớp luyện thi HSK với giáo trình ôn thi từ HanBan",
  },
  {
    image: classChristmas,
    caption: "Hoạt động Giáng sinh cùng học viên tại trung tâm",
  },
  {
    image: classTet,
    caption: "Không khí Tết Trung Hoa tại Hoa văn SaigonHSK",
  },
  {
    image: classWriting,
    caption: "Học viên luyện viết chữ Hán tại lớp",
  },
  {
    image: classFeedback,
    caption: "Giảng viên chữa bài trên lớp",
  },
  {
    image: classEvening,
    caption: "Lớp học buổi tối dành cho học viên đi làm",
  },
  {
    image: classSmall,
    caption: "Lớp 10–15 học viên, ai cũng được nói và được sửa",
  },
  {
    image: classConsult,
    caption: "Tư vấn lộ trình học cho học viên mới",
  },
];
