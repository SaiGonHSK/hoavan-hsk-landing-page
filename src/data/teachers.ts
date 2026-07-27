/**
 * Đội ngũ giảng viên — thông tin và ảnh giới thiệu lấy từ bộ banner giảng viên
 * trên website/fanpage chính thức của trung tâm.
 */

export type Teacher = {
  name: string;
  /** Học vị + trường đào tạo, ghi đúng theo banner giới thiệu. */
  title: string;
  image: string;
  /** Vai trò tại trung tâm (nếu có). */
  role?: string;
  lead?: boolean;
};

export const teachers: Teacher[] = [
  {
    name: "Cô Võ Thị Quỳnh Trang",
    title: "Tiến sĩ — Đại học Sư phạm Hoa Đông, Thượng Hải",
    role: "Giảng viên phụ trách chuyên môn · Chuyên luyện thi HSK5 & HSK6",
    image: "/images/teachers/vo-thi-quynh-trang.webp",
    lead: true,
  },
  {
    name: "Cô Trần Hồng Huyên",
    title: "Thạc sĩ — Đại học Tây Nam, Trùng Khánh",
    image: "/images/teachers/tran-hong-huyen.webp",
  },
  {
    name: "Thầy Cao Hoài Nhơn",
    title: "Thạc sĩ — Đại học Ngôn ngữ Bắc Kinh",
    image: "/images/teachers/cao-hoai-nhon.webp",
  },
  {
    name: "Thầy Tằng Ửng Tày",
    title: "Thạc sĩ — Đại học Sư phạm Thủ đô Trung Quốc",
    image: "/images/teachers/tang-ung-tay.webp",
  },
  {
    name: "Cô Hồng Nguyệt Bình",
    title: "Thạc sĩ — Giảng viên Đại học Công Thương TP.HCM",
    image: "/images/teachers/hong-nguyet-binh.webp",
  },
];

/**
 * Bộ banner giới thiệu của trung tâm — dùng cho slider ở đầu trang chủ.
 */
export type Banner = {
  title: string;
  desc: string;
  image: string;
  href?: string;
  cta?: string;
  /** Ảnh dọc/ngang khác nhau nên cần biết để chọn cách hiển thị. */
  wide?: boolean;
};

export const banners: Banner[] = [
  {
    title: "Lịch khai giảng mới nhất",
    desc: "Các lớp offline và online khai giảng liên tục hằng tháng, chuẩn HSK 3.0 với cam kết 100% đầu ra.",
    image: "/images/banners/class-schedule.webp",
    href: "/schedule",
    cta: "Xem lịch khai giảng",
    wide: true,
  },
  {
    title: "Sứ mệnh của SaigonHSK",
    desc: "Truyền cảm hứng và tạo động lực cho người học không ngừng nâng trình độ tiếng Trung.",
    image: "/images/banners/mission.webp",
    href: "/about",
    cta: "Về trung tâm",
  },
  {
    title: "Phương châm hoạt động",
    desc: "为你的成功 — Vì sự thành công của bạn. Nơi khơi nguồn cảm hứng học tiếng Trung, nhanh chóng đưa người học đến trình độ mong muốn.",
    image: "/images/banners/motto.webp",
    href: "/about/differences",
    cta: "Sự khác biệt",
  },
  {
    title: "Mô hình đào tạo",
    desc: "Lớp 10–15 học viên, học bù và phụ đạo miễn phí, kho tài liệu mở, cam kết đầu ra — không đạt học lại miễn phí.",
    image: "/images/banners/training-model.webp",
    href: "/courses",
    cta: "Xem khóa học",
  },
  {
    title: "Feedback học viên",
    desc: "Những phản hồi tích cực từ học viên là động lực để trung tâm không ngừng hoàn thiện.",
    image: "/images/banners/student-feedback.webp",
    href: "/about/reviews",
    cta: "Đọc phản hồi",
  },
];
