/**
 * Năm giá trị cốt lõi ở trang /about.
 *
 * Cố ý **không** lấy từ trang quản trị: đây là tuyên bố giá trị của trung tâm, gần như
 * không bao giờ đổi, và mỗi mục gắn với một biểu tượng có sẵn trong `src/assets/icons`
 * — sửa từ admin thì dễ nhập tên biểu tượng không tồn tại và mất luôn phần minh hoạ.
 * Đổi nội dung ở đây rồi deploy.
 */
export type CoreValue = {
  id: string;
  /** Tên trong `ICONS` của src/lib/icons.ts. */
  icon: string;
  title: string;
  desc: string;
};

export const coreValues: CoreValue[] = [
  {
    id: "chat-luong",
    icon: "shield",
    title: "Chất lượng",
    desc: "Không ngừng nâng cao chất lượng giảng dạy, chương trình đào tạo và dịch vụ để mang đến hiệu quả học tập tốt nhất cho mỗi học viên.",
  },
  {
    id: "tan-tam",
    icon: "heart",
    title: "Tận tâm",
    desc: "Lấy học viên làm trung tâm, luôn lắng nghe, đồng hành và hỗ trợ trong suốt quá trình học tập nhằm giúp mỗi học viên phát huy tối đa năng lực của mình.",
  },
  {
    id: "chuyen-nghiep",
    icon: "cap",
    title: "Chuyên nghiệp",
    desc: "Xây dựng môi trường học tập hiện đại với đội ngũ giảng viên giàu chuyên môn, phương pháp giảng dạy khoa học và lộ trình học tập rõ ràng.",
  },
  {
    id: "doi-moi",
    icon: "sparkle",
    title: "Đổi mới",
    desc: "Liên tục cập nhật kiến thức, công nghệ và phương pháp giảng dạy tiên tiến nhằm nâng cao trải nghiệm học tập và đáp ứng nhu cầu ngày càng đa dạng của người học.",
  },
  {
    id: "uy-tin",
    icon: "target",
    title: "Uy tín",
    desc: "Giữ vững cam kết về chất lượng đào tạo, lấy kết quả học tập và sự hài lòng của học viên làm thước đo cho sự phát triển bền vững của trung tâm.",
  },
];
