/**
 * Năm giá trị cốt lõi ở trang /about.
 *
 * Cố ý **không** lấy từ trang quản trị: đây là tuyên bố giá trị của trung tâm, gần như
 * không bao giờ đổi, và mỗi mục gắn với một ảnh import sẵn trong `src/assets/values`
 * — sửa từ admin thì dễ trỏ vào file không tồn tại và mất luôn phần minh hoạ.
 * Đổi nội dung ở đây rồi deploy.
 *
 * Ảnh minh hoạ lấy từ Unsplash (giấy phép cho dùng thương mại, không cần ghi nguồn),
 * đã cắt vuông 480×480 vì khung hiển thị là ô vuông nhỏ cạnh tiêu đề.
 */
import type { ImageMetadata } from "astro";
import chatLuong from "@/assets/values/chat-luong.webp";
import tanTam from "@/assets/values/tan-tam.webp";
import chuyenNghiep from "@/assets/values/chuyen-nghiep.webp";
import doiMoi from "@/assets/values/doi-moi.webp";
import uyTin from "@/assets/values/uy-tin.webp";

export type CoreValue = {
  id: string;
  /** Tên trong `ICONS` của src/lib/icons.ts. */
  icon: string;
  image: ImageMetadata;
  /** Mô tả ảnh cho screen reader — nói về ảnh, không lặp lại `title`. */
  imageAlt: string;
  title: string;
  desc: string;
};

export const coreValues: CoreValue[] = [
  {
    id: "chat-luong",
    icon: "shield",
    image: chatLuong,
    imageAlt: "Một trang thư pháp chữ Hán viết tay",
    title: "Chất lượng",
    desc: "Không ngừng nâng cao chất lượng giảng dạy, chương trình đào tạo và dịch vụ để mang đến hiệu quả học tập tốt nhất cho mỗi học viên.",
  },
  {
    id: "tan-tam",
    icon: "heart",
    image: tanTam,
    imageAlt: "Học viên tươi cười trong giờ học trên giảng đường",
    title: "Tận tâm",
    desc: "Lấy học viên làm trung tâm, luôn lắng nghe, đồng hành và hỗ trợ trong suốt quá trình học tập nhằm giúp mỗi học viên phát huy tối đa năng lực của mình.",
  },
  {
    id: "chuyen-nghiep",
    icon: "cap",
    image: chuyenNghiep,
    imageAlt: "Giảng viên đứng lớp trước bảng, học viên ngồi nghe giảng",
    title: "Chuyên nghiệp",
    desc: "Xây dựng môi trường học tập hiện đại với đội ngũ giảng viên giàu chuyên môn, phương pháp giảng dạy khoa học và lộ trình học tập rõ ràng.",
  },
  {
    id: "doi-moi",
    icon: "sparkle",
    image: doiMoi,
    imageAlt: "Nhóm học viên cùng xem bài học trên máy tính xách tay",
    title: "Đổi mới",
    desc: "Liên tục cập nhật kiến thức, công nghệ và phương pháp giảng dạy tiên tiến nhằm nâng cao trải nghiệm học tập và đáp ứng nhu cầu ngày càng đa dạng của người học.",
  },
  {
    id: "uy-tin",
    icon: "target",
    image: uyTin,
    imageAlt: "Học viên trong lễ tốt nghiệp với mũ và áo cử nhân",
    title: "Uy tín",
    desc: "Giữ vững cam kết về chất lượng đào tạo, lấy kết quả học tập và sự hài lòng của học viên làm thước đo cho sự phát triển bền vững của trung tâm.",
  },
];
