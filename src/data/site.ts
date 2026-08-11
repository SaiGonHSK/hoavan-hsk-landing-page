
import { staticContent } from "./content";

/**
 * Các khối nội dung **tĩnh** của landing, đọc từ `content/site.json` trong repo.
 *
 * `const` chứ không `let`: mấy khối này không do trang quản trị soạn — xem
 * `DYNAMIC_KEYS` trong `content.ts` để biết cái gì mới lấy từ API. Muốn đổi thương
 * hiệu, liên hệ, khối đầu trang, sứ mệnh, khác biệt, cam kết, số liệu, giảng viên hay
 * trang giới thiệu thì sửa `content/site.json` rồi deploy.
 */
export const site = staticContent.site;
export const contact = staticContent.contact;
export const hero = staticContent.hero;
export const commitments = staticContent.commitments;
export const values = staticContent.values;
export const mission = staticContent.mission;
export const model = staticContent.model;
export const stats = staticContent.stats;
export const milestones = staticContent.milestones;
export const teacher = staticContent.teacher;
export const about = staticContent.about;
export const reasons = staticContent.reasons;

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
