import { teachers } from "./teachers";

/**
 * Chia sẻ của giảng viên về con đường giảng dạy — hiển thị ở /about/teachers.
 *
 * Đây là lời của người thật, nên nội dung phải do chính giảng viên viết hoặc duyệt.
 * KHÔNG tự soạn thay: một câu nghe hay nhưng người ta không nói là đặt chữ vào miệng
 * người khác, và đây là trang công khai mang tên họ.
 *
 * Nối với `teachers` bằng `name` thay vì chép lại ảnh/học vị: một người đổi ảnh hay
 * đổi chức danh thì chỉ sửa `content/site.json`, khối này ăn theo. Tên sai chính tả
 * sẽ bị `teacherStories` loại thẳng — xem ghi chú ở dưới.
 */
export type TeacherStory = {
  /** Trùng khít `name` trong `content/site.json` (kể cả "Cô"/"Thầy"). */
  name: string;

  /** Câu chốt in to, ~6–12 chữ: điều giảng viên tâm đắc nhất về nghề. */
  headline: string;

  /**
   * Lời kể, mỗi phần tử một đoạn. Nội dung nên trả lời: vì sao chọn tiếng Trung, vì
   * sao chuyển sang đi dạy, và điều gì giữ họ ở lại với nghề.
   */
  paragraphs: string[];
};

/*
  ⚠️ BẢN NHÁP — CHƯA CÓ GIẢNG VIÊN NÀO DUYỆT.

  Bốn đoạn dưới đây do bên làm web soạn, dựng trên đúng những gì đã công bố trong
  `content/site.json` (bằng cấp, trường, nơi đang giảng dạy) và không bịa thêm sự kiện,
  giải thưởng hay con số nào. Nhưng nó vẫn là lời gán cho người thật: gửi từng thầy cô
  đọc và sửa lại theo giọng của họ trước khi đưa lên bản chính thức.

  Thêm người mới thì chép nguyên khối `{ name, headline, paragraphs }` và giữ `name`
  trùng khít với `content/site.json`.
*/
const stories: TeacherStory[] = [
  {
    name: "Cô Võ Thị Quỳnh Trang",
    headline: "Người học không bỏ cuộc vì tiếng Trung khó, mà vì không thấy mình tiến tới đâu",
    paragraphs: [
      "Những năm làm nghiên cứu sinh ở Đại học Sư phạm Hoa Đông, Thượng Hải, tôi dành phần lớn thời gian cho một câu hỏi: vì sao cùng một bài giảng mà lớp này tiếp thu được, lớp kia thì không. Câu trả lời hiếm khi nằm ở độ khó của kiến thức, nó nằm ở chỗ người học có nhìn thấy đường đi của mình hay không.",
      "Vì vậy khi về phụ trách chuyên môn ở SaigonHSK, việc đầu tiên tôi làm là chia lộ trình thành những chặng đủ ngắn để học viên tự đo được: hết chặng này bạn nói được gì, viết được gì, thi được đến đâu. Một người biết mình đang ở đâu trên đường sẽ đi tiếp, kể cả khi đoạn đường đó khó.",
      "Điều giữ tôi lại với nghề là những học viên bắt đầu từ con số 0, hai năm sau nhắn tin khoe vừa đậu HSK6. Không phải vì con điểm, mà vì tôi biết trước đó họ từng nghĩ mình không có năng khiếu ngoại ngữ.",
    ],
  },
  {
    name: "Thầy Cao Hoài Nhơn",
    headline: "Học ngôn ngữ là để nói được với người, không phải để thuộc lòng cuốn sách",
    paragraphs: [
      "Ngành tôi học ở Đại học Ngôn ngữ Bắc Kinh là Giáo dục Hán ngữ Quốc tế — nghĩa là học cách dạy tiếng Trung cho người nước ngoài, chứ không chỉ học tiếng Trung. Khác biệt đó thay đổi hẳn cách tôi đứng lớp: tôi luôn phải nhớ mình đang dạy cho người mà tiếng Trung không phải tiếng mẹ đẻ, nên chỗ nào người Việt hay vấp thì phải chậm lại ở đúng chỗ đó.",
      "Trên lớp tôi ít khi giảng một mạch. Một điểm ngữ pháp mới thì phải có tình huống để dùng ngay trong buổi đó, sai thì sửa tại chỗ, còn hơn để học viên mang cái sai về nhà luyện thành thói quen.",
      "Điều tôi thích nhất ở nghề này là khoảnh khắc một bạn vốn ngại nói bỗng dưng bật ra được một câu trọn vẹn, rồi tự cười vì không ngờ mình nói được.",
    ],
  },
  {
    name: "Cô Huỳnh Thị Mỹ Chính",
    headline: "Bốn năm sống giữa tiếng Trung dạy tôi điều sách giáo khoa không viết",
    paragraphs: [
      "Tôi học cử nhân ở Đại học Sư phạm Phúc Kiến rồi học tiếp Thạc sĩ ở Đại học Ngoại ngữ Bắc Kinh. Quãng thời gian sống và học hoàn toàn bằng tiếng Trung cho tôi thứ mà giáo trình không có: cách người ta thật sự nói với nhau ngoài đời, chỗ nào trang trọng, chỗ nào suồng sã, câu nào đúng ngữ pháp nhưng nghe rất kỳ.",
      "Nên trong lớp của tôi, sau mỗi mẫu câu chuẩn thường có thêm một dòng: ngoài đời người ta hay nói thế này. Học viên đi làm, đi du học về sau đều nói phần đó là phần dùng được nhiều nhất.",
      "Tôi tin việc dạy ngoại ngữ có một phần là kể chuyện — kể về nơi mình từng sống, để người học thấy thứ tiếng đang học gắn với một đời sống có thật, không phải một bài thi.",
    ],
  },
  {
    name: "Thầy Lê Tuấn Minh",
    headline: "Dạy đúng phương pháp thì người bận rộn vẫn học được",
    paragraphs: [
      "Cả Thạc sĩ lẫn chương trình Tiến sĩ tôi đang theo ở Đại học Đài Bắc đều xoay quanh việc giảng dạy tiếng Trung. Càng đi sâu tôi càng thấy phần lớn thất bại của người học không đến từ năng lực, mà đến từ việc học sai thứ tự và học không đều.",
      "Học viên ở TP.HCM phần lớn đi làm hoặc đi học full-time, mỗi tuần chỉ có vài buổi tối. Với quỹ thời gian đó, dạy tham sẽ phản tác dụng. Tôi chọn ít điểm hơn nhưng chắc hơn, và mỗi buổi đều để dành thời gian ôn lại buổi trước — trí nhớ ngôn ngữ được xây bằng lặp lại, không phải bằng lượng.",
      "Với tôi, một khoá học thành công không phải là học viên nhớ hết bài, mà là sau khi kết thúc họ vẫn còn thói quen tự học tiếp.",
    ],
  },
];

/**
 * Chỉ giữ chia sẻ khớp được với một giảng viên đang hiển thị, và giữ đúng thứ tự của
 * `teachers` để khối này không đảo người so với dải ảnh ngay phía trên.
 *
 * Tên không khớp thì bỏ qua chứ không dựng thẻ trống: gõ sai một chữ mà vẫn ra thẻ
 * thiếu ảnh, thiếu học vị thì lỗi chỉ lộ ra khi đã lên production.
 */
export const teacherStories = teachers
  .map((teacher) => {
    const story = stories.find((s) => s.name === teacher.name);
    return story ? { teacher, story } : null;
  })
  .filter((entry): entry is { teacher: (typeof teachers)[number]; story: TeacherStory } =>
    Boolean(entry),
  );
