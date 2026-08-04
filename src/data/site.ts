
import { content } from "./content";

export const site = content.site;
export const contact = content.contact;
export const hero = content.hero;
export const commitments = content.commitments;
export const values = content.values;
export const mission = content.mission;
export const model = content.model;
export const stats = content.stats;
export const teacher = content.teacher;

export const footerLinks = [
  {
    title: "Khoá học",
    items: [
      { label: "Khoá HSK1 – HSK6", href: "/courses" },
      { label: "Lớp luyện thi HSK3 – HSK5", href: "/courses/luyen-thi-hsk-4" },
      { label: "Giao tiếp công sở", href: "/courses/giao-tiep-cong-so-co-ban" },
      { label: "Ngữ pháp tiếng Trung", href: "/courses/ngu-phap-co-ban" },
      { label: "Tiếng Trung trẻ em", href: "/courses/tieng-trung-tre-em" },
      { label: "Học theo giáo trình", href: "/courses/textbooks" },
    ],
  },
  {
    title: "Ôn tập & thư viện",
    items: [
      { label: "Ôn tập theo cấp HSK", href: "/practice" },
      { label: "Tài liệu luyện thi HSK", href: "/practice/exam-prep" },
      { label: "Luyện 4 kỹ năng", href: "/practice/skills" },
      { label: "Học thử miễn phí", href: "/trial" },
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
