/**
 * Câu hỏi thường gặp — soạn dựa trên thông tin công bố trên website trung tâm
 * (cam kết đầu ra, thời lượng khóa, giáo trình, giảng viên, liên hệ).
 * Học phí không được công bố trên web nên câu trả lời hướng người đọc liên hệ trung tâm.
 */

import { contact } from "./site";

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "Cam kết đầu ra của SaigonHSK cụ thể là gì?",
    answer:
      "Trung tâm cam kết 100% đầu ra khóa học. Với các lớp luyện thi, học viên hoàn thành chương trình được đảm bảo đậu HSK4 hoặc HSK5 tùy khóa; với các lớp sơ cấp, đầu ra tương ứng là HSK2, HSK3, HSK4. Nếu không đạt đầu ra đã cam kết, học viên được học lại hoàn toàn miễn phí.",
  },
  {
    question: "Tôi chưa biết gì về tiếng Trung thì bắt đầu từ lớp nào?",
    answer:
      "Bạn bắt đầu từ lớp Tiếng Hoa Sơ cấp 1 (SC1) — lớp dành cho người chưa từng tiếp xúc với tiếng Hoa, học từ ngữ âm và quy tắc bút thuận. Nếu bạn chỉ cần nói được nhanh và không có nhiều thời gian tập viết chữ Hán, lớp Giao tiếp Cấp tốc 1 (GT1) là lựa chọn phù hợp hơn.",
  },
  {
    question: "Đã học tiếng Trung trước đó thì được xếp lớp thế nào?",
    answer:
      "Trung tâm test năng lực đầu vào để xếp bạn vào lớp đúng trình độ, dựa trên vốn từ vựng, giáo trình bạn đã học (Hán ngữ 6 quyển, Boya, 301 câu đàm thoại…) và các điểm ngữ pháp bạn đã nắm. Bạn có thể liên hệ trung tâm để đăng ký test miễn phí.",
  },
  {
    question: "Một khóa học kéo dài bao lâu?",
    answer:
      "Các lớp sơ cấp và trung cấp thường là 40 buổi – 80 tiết, 3 buổi/tuần, 1,5h/buổi (khoảng 3,5 tháng) hoặc 30 buổi, 2 buổi/tuần, 2h/buổi (khoảng 4 tháng). Lớp luyện HSK4 thường là 24 buổi (khoảng 2 tháng), HSK5 thường là 30 buổi (2,5 tháng), lớp đặc biệt kéo dài hơn để rút ngắn yêu cầu đầu vào.",
  },
  {
    question: "Giảng viên của trung tâm là ai?",
    answer:
      "Giảng viên phụ trách chuyên môn là TS. Võ Thị Quỳnh Trang — Tiến sĩ ngành Giáo dục Hán ngữ quốc tế, Đại học Sư phạm Hoa Đông (Thượng Hải), chuyên luyện thi HSK5 và HSK6. Phần lớn giảng viên còn lại có trình độ Thạc sĩ, Tiến sĩ từ các đại học lớn của Trung Quốc và đang giảng dạy tại các trường đại học uy tín ở TP.HCM.",
  },
  {
    question: "Trung tâm dùng giáo trình nào?",
    answer:
      "Trung tâm sử dụng giáo trình của Đại học Ngôn ngữ & Văn hóa Bắc Kinh cùng các bộ giáo trình chuyên biệt, được giảng viên trình độ Tiến sĩ của trung tâm biên soạn lại để phát triển đồng thời 4 kỹ năng nghe – nói – đọc – viết. Riêng các lớp luyện thi sử dụng tài liệu ôn thi uy tín từ HanBan, cập nhật theo chuẩn HSK 3.0.",
  },
  {
    question: "Lớp trung cấp có gì khác so với lớp sơ cấp?",
    answer:
      "Từ trình độ trung cấp, mỗi lớp học song song hai giáo trình — tổng hợp trung cấp và khẩu ngữ trung cấp — nhằm nâng cao vượt trội khả năng khẩu ngữ, nghe nói và đọc hiểu. Nội dung bài học chuyển sang các chủ điểm văn hóa – xã hội đương đại của Trung Quốc.",
  },
  {
    question: "Có lớp học riêng hoặc lớp cho doanh nghiệp không?",
    answer:
      "Có. Trung tâm có lớp Tiếng Hoa VIP 1 kèm 1 cho người bận rộn với lộ trình và thời gian biểu cá nhân hóa, lớp Tiếng Hoa Doanh nghiệp thiết kế theo đặc thù ngành, cùng các lớp Tiếng Hoa Thiếu nhi và Tiếng Hoa cho người lớn tuổi.",
  },
  {
    question: "Học phí và lịch khai giảng thế nào?",
    answer: `Học phí và lịch khai giảng thay đổi theo từng khóa và hình thức lớp (lớp nhóm, VIP 1 kèm 1, lớp doanh nghiệp). Vui lòng gọi ${contact.phonePrimary} hoặc ${contact.phones[1]} để nhận bảng học phí và lịch khai giảng mới nhất.`,
  },
  {
    question: "Trung tâm ở đâu?",
    answer: `Trung tâm ở ${contact.address}. Bạn có thể đến trực tiếp để tham quan cơ sở vật chất và nhận tư vấn lộ trình, hoặc liên hệ trước qua Zalo/điện thoại ${contact.phonePrimary}.`,
  },
];
