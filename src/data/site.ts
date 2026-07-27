/**
 * Single source of truth for brand, contact and navigation data.
 * Nội dung lấy từ website chính thức: trungtamhoavansaigonhsk.edu.vn
 */

export const site = {
  name: "Hoa văn SaigonHSK",
  fullName: "Trung tâm Hoa văn SaigonHSK",
  shortName: "SaigonHSK",
  domain: "hoavansaigonhsk.edu.vn",
  slogan: "为你的成功",
  sloganVi: "Vì sự thành công của bạn",
  tagline:
    "Trung tâm đào tạo tiếng Hoa chất lượng cao, uy tín tại TP. HCM — cam kết 100% đầu ra.",
  description:
    "Trung tâm Hoa văn SaigonHSK đào tạo tiếng Trung từ Sơ cấp đến Cao cấp, luyện thi HSK và TOCFL với giảng viên Thạc sĩ, Tiến sĩ. Cam kết đầu ra, không đạt học lại miễn phí.",
  foundedYear: 2019,
} as const;

export const contact = {
  address: "384/8 Lý Thái Tổ, Phường Vườn Lài, TP Hồ Chí Minh",
  addressShort: "384/8 Lý Thái Tổ, P. Vườn Lài, TP.HCM",
  phones: ["0345.20.44.99", "0932.77.88.52"],
  phonePrimary: "0345.20.44.99",
  phonePrimaryRaw: "0345204499",
  phoneSecondaryRaw: "0932778852",
  email: "hoavansaigonhsk@gmail.com",
  zalo: "https://zalo.me/0345204499",
  facebook: "https://www.facebook.com/SaigonHSK/",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=384%2F8+L%C3%BD+Th%C3%A1i+T%E1%BB%95%2C+Ph%C6%B0%E1%BB%9Dng+V%C6%B0%E1%BB%9Dn+L%C3%A0i%2C+TP+H%E1%BB%93+Ch%C3%AD+Minh",
  mapEmbedUrl:
    "https://www.google.com/maps?q=384%2F8%20L%C3%BD%20Th%C3%A1i%20T%E1%BB%95%2C%20Ph%C6%B0%E1%BB%9Dng%20V%C6%B0%E1%BB%9Dn%20L%C3%A0i%2C%20TP%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
  workingHours: "Thứ 2 – Chủ nhật: 8:00 – 21:00",
} as const;

/** 3 cam kết nổi bật — hiển thị ngay dưới hero. */
export const commitments = [
  {
    icon: "shield",
    title: "Học lại miễn phí nếu không đạt đầu ra",
    desc: "SaigonHSK cam kết 100% đầu ra khóa học. Học viên không đạt mục tiêu cam kết được học lại hoàn toàn miễn phí.",
  },
  {
    icon: "book",
    title: "Kiến thức chuẩn HSK 3.0",
    desc: "Giáo trình và đề luyện cập nhật theo chuẩn HSK 3.0 mới nhất, sử dụng tài liệu ôn thi uy tín từ HanBan.",
  },
  {
    icon: "cap",
    title: "Giảng viên Thạc sĩ, Tiến sĩ",
    desc: "Đội ngũ giảng viên tốt nghiệp Thạc sĩ, Tiến sĩ tại các đại học lớn của Trung Quốc, đang giảng dạy tại nhiều trường đại học uy tín ở TP.HCM.",
  },
] as const;

/** Sự khác biệt — 4 giá trị cốt lõi của trung tâm. */
export const values = [
  {
    id: "vi-nguoi-hoc",
    icon: "heart",
    title: "Vì người học",
    desc: "Giáo trình tối ưu, phương pháp độc quyền được biên soạn riêng cho người Việt học tiếng Hoa. Không đạt được mục tiêu, học viên được học lại miễn phí.",
  },
  {
    id: "giang-vien-chat-luong",
    icon: "cap",
    title: "Giảng viên chất lượng",
    desc: "Giảng viên phụ trách chuyên môn là Tiến sĩ Võ Thị Quỳnh Trang — Tiến sĩ Giáo dục Hán ngữ quốc tế, Đại học Sư phạm Hoa Đông (Thượng Hải).",
  },
  {
    id: "tiet-kiem-thoi-gian",
    icon: "clock",
    title: "Tiết kiệm thời gian",
    desc: "Lộ trình rút gọn theo từng mục tiêu cụ thể: giao tiếp cấp tốc 3 tháng, luyện HSK4 trong 2 tháng, HSK5 trong 2,5 tháng.",
  },
  {
    id: "hieu-qua-cao",
    icon: "target",
    title: "Hiệu quả cao",
    desc: "Học viên phát triển đồng thời 4 kỹ năng nghe – nói – đọc – viết, nhiều bạn thi đậu HSK6 và TOCFL Band C1 chỉ sau hơn 1 năm học.",
  },
  {
    id: "lop-nho",
    icon: "users",
    title: "Lớp nhỏ, kèm sát",
    desc: "Mỗi lớp chỉ 10–15 học viên để giảng viên theo sát từng người, kèm chế độ học bù và phụ đạo miễn phí khi bạn nghỉ hoặc chưa theo kịp.",
  },
] as const;

/** Sứ mệnh & phương châm — theo bộ banner giới thiệu của trung tâm. */
export const mission = {
  statement:
    "Trung tâm Hoa văn SaigonHSK với sứ mệnh truyền cảm hứng và tạo động lực cho người học không ngừng nâng trình độ tiếng Trung.",
  motto:
    "“为你的成功 — Vì sự thành công của bạn” — Nơi khơi nguồn cảm hứng học tiếng Trung, nhanh chóng đưa người học đến trình độ mong muốn.",
} as const;

/** Mô hình đào tạo — 8 điểm trung tâm công bố trong banner "Mô hình". */
export const model = [
  "Giáo viên giàu kinh nghiệm, từng du học tại Trung Quốc",
  "Lớp học ít người, chỉ từ 10–15 học viên",
  "Lộ trình nhanh, hiệu quả sau mỗi buổi học",
  "Chế độ học bù, học phụ đạo miễn phí",
  "Bộ phận giáo vụ luôn lắng nghe học viên, sẵn sàng giải đáp",
  "Cơ sở vật chất hiện đại",
  "Được tiếp cận kho tài liệu đa dạng, phong phú hoàn toàn miễn phí",
  "Cam kết đầu ra — không đạt học lại miễn phí",
] as const;

/** Số liệu hiển thị trong dải thống kê. */
export const stats = [
  { value: "100%", label: "Cam kết đầu ra khóa học" },
  { value: "HSK 1–6", label: "Đào tạo trọn lộ trình" },
  { value: "10+", label: "Chương trình đào tạo" },
  { value: "2019", label: "Năm thành lập trung tâm" },
] as const;

/** Giảng viên chuyên môn. */
export const teacher = {
  name: "TS. Võ Thị Quỳnh Trang",
  role: "Giảng viên phụ trách chuyên môn",
  photo: "/images/teacher-quynh-trang.webp",
  points: [
    "Tốt nghiệp Tiến sĩ ngành Giáo dục Hán ngữ quốc tế, Đại học Sư phạm Hoa Đông (Thượng Hải).",
    "Giảng dạy tại nhiều trường đại học lớn, uy tín tại TP. HCM.",
    "Giảng viên chuyên môn tại Trung tâm Hoa văn SaigonHSK.",
    "Chuyên luyện thi các lớp HSK 5 & HSK 6.",
    "Phương pháp giảng dạy lôi cuốn, sinh động và hiệu quả.",
  ],
  note: "Toàn bộ giảng viên của trung tâm được đào tạo nghiệp vụ trực tiếp dưới sự hướng dẫn chuyên môn của TS. Võ Thị Quỳnh Trang.",
} as const;

export const footerLinks = [
  {
    title: "Khoá học",
    items: [
      { label: "Khoá HSK1 – HSK6", href: "/courses" },
      { label: "Luyện thi HSK3 – HSK6", href: "/courses/luyen-thi-hsk-4" },
      { label: "Giao tiếp công sở", href: "/courses/giao-tiep-cong-so-co-ban" },
      { label: "Ngữ pháp tiếng Trung", href: "/courses/ngu-phap-co-ban" },
      { label: "Tiếng Trung trẻ em", href: "/courses/tieng-trung-tre-em" },
      { label: "Học theo giáo trình", href: "/courses/textbooks" },
    ],
  },
  {
    title: "Ôn tập & thư viện",
    items: [
      { label: "Ôn tập các cấp HSK", href: "/practice" },
      { label: "Luyện thi HSK", href: "/practice/exam-prep" },
      { label: "Luyện 4 kỹ năng", href: "/practice/skills" },
      { label: "Học thử trải nghiệm", href: "/trial" },
      { label: "Thư viện tiếng Trung", href: "/library" },
    ],
  },
  {
    title: "Trung tâm",
    items: [
      { label: "Về chúng tôi", href: "/about" },
      { label: "Đội ngũ giảng viên", href: "/about/teachers" },
      { label: "Cam kết", href: "/about/commitments" },
      { label: "Lịch khai giảng", href: "/schedule" },
      { label: "Đăng ký học", href: "/register" },
      { label: "Liên hệ", href: "/contact" },
    ],
  },
] as const;
