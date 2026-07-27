/** Phản hồi học viên — trích từ website chính thức của trung tâm. */

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Hiển Hoàng",
    role: "Sinh viên ĐH KHXH&NV TP.HCM",
    quote:
      "Chỉ hơn 1 năm, từ một người chưa biết gì về tiếng Trung, mình đồng thời thi đậu HSK6 và TOCFL Band C1. Tất cả sự nỗ lực và may mắn đó là mình nhờ sự truyền đạt kiến thức rất bổ ích, thú vị cùng sự nhiệt tình của cô Quỳnh Trang.",
  },
  {
    name: "Trần Trọng Khang",
    role: "Cựu sinh viên ĐH Ngoại Thương TP.HCM",
    quote:
      "Sau khi đồng hành với cô trong 4 khóa học, điều em ấn tượng nhất ở cô chính là sự tận tâm, tận tụy trong từng bài giảng. Hơn thế, cô không chỉ truyền tải những kiến thức trong sách vở mà còn đan xen những kinh nghiệm thực tế.",
  },
  {
    name: "Huỳnh Phối My",
    role: "Sinh viên Trường Múa TP.HCM",
    quote:
      "Đến khi mình đã không còn học ở trung tâm nữa, cô vẫn quan tâm và cô trò giữ liên lạc. Mình luôn thầm ngưỡng mộ và theo dõi hành trình người cô đã dạy mình rất nhiều kiến thức, cho mình nhiều kinh nghiệm trên chặng đường chinh phục HSK.",
  },
  {
    name: "Trần Chí Nguyện",
    role: "Sinh viên ĐH Tôn Đức Thắng",
    quote:
      "Ấn tượng đầu tiên khi học với cô là giọng nói của cô rất nhẹ nhàng, phát âm chuẩn và dễ nghe. Trong những giờ học do cô đứng lớp, thứ em học được không chỉ là kiến thức về tiếng mà còn là những câu chuyện cuộc sống bổ ích được cô lồng ghép vào bài học.",
  },
  {
    name: "Lê Quốc Pháp",
    role: "Sinh viên ĐH KHXH&NV TP.HCM",
    quote:
      "Cách cô đứng lớp rất đúng chuẩn “sư phạm chuyên nghiệp”, rất hiểu tâm lý và các điểm yếu khi học của tụi em, vì vậy với từng học sinh trong lúc giảng bài hay làm bài tập cô sẽ có những cách tương tác khác nhau.",
  },
  {
    name: "Đoàn Phương Thảo",
    role: "Cựu sinh viên ĐH Ngoại Thương Hà Nội",
    quote:
      "Cô dạy rất nhiệt tình và luôn đặt mình vào địa vị của học sinh để giảng giải chi tiết cho học sinh hiểu. Điều em thấy quý nhất ở cô bên cạnh chuyên môn giỏi là tấm lòng nhiệt tình, tận tâm vì học sinh.",
  },
  {
    name: "Trần Gia Tuệ",
    role: "Sinh viên ĐH Nguyễn Tất Thành",
    quote:
      "Con thích quan niệm về giáo dục của Laoshi: dạy học trò phải dạy cho hiểu. Nếu đã hiểu rồi mà vẫn cố tình làm bài không được là do bản thân, còn nếu giáo viên chưa dạy cho hiểu mà đánh giá học trò không học được thì rất tội cho học trò.",
  },
  {
    name: "Long Chấn Phát",
    role: "Cựu sinh viên ĐH KHXH&NV TP.HCM",
    quote:
      "Cô Trang kiến thức rất sâu rộng, mình hỏi bất cứ câu hỏi nào cô cũng nhiệt tình giải thích rất rõ ràng và trọn vẹn. Điều quan trọng hơn cả là mình thấy cô rất có tâm giảng dạy — trên lớp cô truyền đạt những kiến thức mới rất hay và khoa học.",
  },
  {
    name: "Hoàng Hà Phương",
    role: "Cựu sinh viên ĐH Ngoại Thương Hà Nội",
    quote:
      "Đối với mình mỗi ngày đi học là một ngày vui và thư giãn. Đặc biệt, cô có nhiều năm học tập và sinh sống tại Trung Quốc nên vừa học được ngôn ngữ, vừa biết thêm nhiều kiến thức xã hội liên quan đến văn hóa, kinh tế và đời sống con người ở đó.",
  },
  {
    name: "Nguyễn Thị Phương Thảo",
    role: "Giáo viên tâm lý",
    quote:
      "Cô Trang rất thân thiện, cô luôn quan tâm đến từng học sinh. Cô dạy rất nhiệt tình và dễ hiểu, luôn giải đáp mọi thắc mắc cho học sinh.",
  },
  {
    name: "Võ Tường Quy",
    role: "Sinh viên ĐH Tôn Đức Thắng",
    quote:
      "Cảm ơn cô đã truyền tải cho em những kinh nghiệm quý báu cũng như kiến thức vô cùng bổ ích về môn tiếng Trung. Cô là người giảng viên đầu tiên vừa dạy tiếng Trung lại vừa cung cấp cho em vốn kiến thức phong phú về văn hóa Trung Quốc.",
  },
  {
    name: "Nguyễn Lê Thanh Trầm",
    role: "Sinh viên ĐH Sư Phạm TP.HCM",
    quote:
      "Cô rất nhiệt tình, chu đáo, luôn tạo không khí học vui vẻ. Nghe cô giảng bài em nhớ ngay tại lớp, về nhà ôn lại một chút nữa là không bao giờ quên. Cô chính là động lực để em học tiếng Trung.",
  },
  {
    name: "Nguyễn Danh Giàu",
    role: "Sinh viên ĐH Công nghiệp Thực phẩm TP.HCM",
    quote:
      "Cô Trang dạy rất nhiệt tình, dạy kĩ càng từng bài học. Các bạn không hiểu bài cô vẫn chịu khó giảng lại cho hiểu. Cô hiền và dễ thương lắm ạ.",
  },
];
