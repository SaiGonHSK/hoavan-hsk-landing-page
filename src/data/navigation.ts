/**
 * Cây điều hướng của toàn site — nguồn dữ liệu duy nhất cho header, footer
 * và các trang tổng quan (hub). Sửa ở đây là mọi nơi cập nhật theo.
 */

import {
  hskCourses,
  hskExamCourses,
  specialCourses,
  textbookCourses,
  reviewLevels,
  examPrepResources,
  skillTracks,
  trialClasses,
  library,
} from "./catalog";

export type NavLink = { label: string; href: string; desc?: string };
export type NavGroup = { title: string; href?: string; items: NavLink[] };
export type NavEntry = {
  label: string;
  href: string;
  /** Menu con dạng danh sách đơn. */
  items?: NavLink[];
  /** Menu con nhiều cột. */
  groups?: NavGroup[];
  /** Hiển thị như nút nổi bật ở cuối menu. */
  cta?: boolean;
};

const toLinks = (base: string, list: { slug: string; title: string; summary: string }[]) =>
  list.map((c) => ({ label: c.title, href: `${base}/${c.slug}`, desc: c.summary }));

/** 1. Giới thiệu */
export const aboutSections: NavLink[] = [
  { label: "Về chúng tôi", href: "/about" },
  { label: "05 khác biệt của chúng tôi", href: "/about/differences" },
  { label: "Đội ngũ giảng viên", href: "/about/teachers" },
  { label: "Học viên cảm nhận và đánh giá", href: "/about/reviews" },
  { label: "Thành tích học viên", href: "/about/achievements" },
  { label: "Cam kết", href: "/about/commitments" },
];

export const navigation: NavEntry[] = [
  {
    label: "Giới thiệu",
    href: "/about",
    items: aboutSections,
  },
  {
    label: "Các khoá học",
    href: "/courses",
    groups: [
      {
        title: "Khoá học theo cấp HSK",
        href: "/courses",
        items: toLinks("/courses", [...hskCourses]),
      },
      {
        title: "Luyện thi HSK",
        href: "/courses",
        items: toLinks("/courses", [...hskExamCourses]),
      },
      {
        title: "Khoá học chuyên biệt",
        href: "/courses",
        items: toLinks("/courses", [...specialCourses]),
      },
      {
        title: "Học trực tuyến theo giáo trình",
        href: "/courses/textbooks",
        items: toLinks("/courses/textbooks", [...textbookCourses]),
      },
    ],
  },
  {
    label: "Ôn tập & luyện thi",
    href: "/practice",
    groups: [
      {
        title: "Ôn tập các cấp HSK",
        href: "/practice",
        items: toLinks("/practice", [...reviewLevels]),
      },
      {
        title: "Luyện thi HSK",
        href: "/practice/exam-prep",
        items: toLinks("/practice/exam-prep", [...examPrepResources]),
      },
      {
        title: "Luyện các kỹ năng",
        href: "/practice/skills",
        items: toLinks("/practice/skills", [...skillTracks]),
      },
      {
        title: "Học thử trải nghiệm",
        href: "/trial",
        items: toLinks("/trial", [...trialClasses]),
      },
    ],
  },
  {
    label: "Thư viện",
    href: "/library",
    items: library.map((l) => ({
      label: l.title,
      href: `/library/${l.slug}`,
      desc: l.summary,
    })),
  },
  { label: "Liên hệ", href: "/contact" },
  { label: "Đăng ký", href: "/register", cta: true },
];
