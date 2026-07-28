/**
 * Ảnh hoạt động tại trung tâm — dùng cho section "Không khí lớp học".
 * Ảnh lấy từ website chính thức trungtamhoavansaigonhsk.edu.vn.
 *
 * Thêm ảnh: bỏ file vào `public/images/activities/` rồi thêm một dòng vào
 * mảng dưới đây. Lưới lặp nhịp 5 ảnh (3 ảnh vuông → 1 ảnh nhỏ → 1 ảnh ngang)
 * nên số lượng bao nhiêu cũng ra bố cục cân đối; đẹp nhất ở 3, 5, 8 hoặc 10 ảnh.
 */
export type Activity = {
  /** Đường dẫn ảnh trong `public/`. */
  src: string;
  /** Mô tả ngắn — dùng cho alt và chú thích khi phóng to. */
  caption: string;
  width?: number;
  height?: number;
};

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
