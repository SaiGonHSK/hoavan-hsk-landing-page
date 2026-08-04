/**
 * Mỗi icon là một file trong src/assets/icons và được nhúng inline dưới dạng chuỗi
 * SVG (`?raw`) để dùng với `set:html`. Cách này giữ được `currentColor` và class
 * Tailwind ở thẻ bọc ngoài — thứ mà <img src="...svg"> không làm được.
 *
 * Thêm icon mới: tạo file .svg trong src/assets/icons rồi khai báo ở dưới.
 */
import arrow from "@/assets/icons/arrow.svg?raw";
import arrowUpRight from "@/assets/icons/arrow-up-right.svg?raw";
import book from "@/assets/icons/book.svg?raw";
import briefcase from "@/assets/icons/briefcase.svg?raw";
import calendar from "@/assets/icons/calendar.svg?raw";
import camera from "@/assets/icons/camera.svg?raw";
import cap from "@/assets/icons/cap.svg?raw";
import chat from "@/assets/icons/chat.svg?raw";
import check from "@/assets/icons/check.svg?raw";
import chevron from "@/assets/icons/chevron.svg?raw";
import clock from "@/assets/icons/clock.svg?raw";
import close from "@/assets/icons/close.svg?raw";
import growth from "@/assets/icons/growth.svg?raw";
import heart from "@/assets/icons/heart.svg?raw";
import kids from "@/assets/icons/kids.svg?raw";
import mail from "@/assets/icons/mail.svg?raw";
import menu from "@/assets/icons/menu.svg?raw";
import monitor from "@/assets/icons/monitor.svg?raw";
import peak from "@/assets/icons/peak.svg?raw";
import phone from "@/assets/icons/phone.svg?raw";
import pin from "@/assets/icons/pin.svg?raw";
import plus from "@/assets/icons/plus.svg?raw";
import search from "@/assets/icons/search.svg?raw";
import seed from "@/assets/icons/seed.svg?raw";
import shield from "@/assets/icons/shield.svg?raw";
import snow from "@/assets/icons/snow.svg?raw";
import sparkle from "@/assets/icons/sparkle.svg?raw";
import target from "@/assets/icons/target.svg?raw";
import users from "@/assets/icons/users.svg?raw";
import wifi from "@/assets/icons/wifi.svg?raw";
// Icon Zalo chính thức (app icon) — màu cố định, không theo currentColor.
import zalo from "@/assets/icons/zalo.svg?raw";

export const ICONS = {
  phone,
  pin,
  mail,
  clock,
  chevron,
  search,
  arrow,
  arrowUpRight,
  menu,
  close,
  check,
  plus,
  shield,
  book,
  cap,
  heart,
  target,
  users,
  sparkle,
  calendar,
  monitor,
  snow,
  camera,
  wifi,
  zalo,
} as const;

export const COURSE_ICONS = {
  hsk: target,
  seed,
  growth,
  peak,
  chat,
  briefcase,
  vip: sparkle,
  kids,
  senior: users,
} as const;
