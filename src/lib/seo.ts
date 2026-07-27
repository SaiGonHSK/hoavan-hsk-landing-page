/**
 * Tập trung phần SEO: tiêu đề, mô tả và bộ từ khoá.
 *
 * Nguyên tắc đặt title: <từ khoá chính> + <địa điểm/điểm khác biệt> + thương hiệu,
 * giữ dưới ~60 ký tự để Google không cắt. Description 140–160 ký tự, có từ khoá
 * và một lý do để bấm vào (cam kết đầu ra, học thử miễn phí, hotline).
 */

const BRAND = "SaigonHSK";

/** Ghép tiêu đề với thương hiệu, tránh lặp nếu đã có sẵn. */
export const title = (main: string) =>
  main.includes(BRAND) ? main : `${main} | ${BRAND}`;

/**
 * Từ khoá học viên hay gõ khi tìm trung tâm tiếng Trung ở TP.HCM.
 * Dùng để rải tự nhiên vào tiêu đề, mô tả và nội dung — không nhồi nhét.
 */
export const keywords = {
  core: [
    "học tiếng Trung",
    "học tiếng Hoa",
    "trung tâm tiếng Trung TPHCM",
    "trung tâm tiếng Hoa TPHCM",
    "học tiếng Trung ở đâu tốt",
  ],
  exam: [
    "luyện thi HSK",
    "luyện thi HSK ở TPHCM",
    "ôn thi HSK",
    "chứng chỉ HSK",
    "HSK 3.0",
    "luyện thi TOCFL",
  ],
  level: [
    "tiếng Trung cho người mới bắt đầu",
    "học tiếng Trung từ con số 0",
    "tiếng Trung sơ cấp",
    "tiếng Trung trung cấp",
    "tiếng Trung cao cấp",
  ],
  purpose: [
    "tiếng Trung giao tiếp",
    "tiếng Trung công sở",
    "tiếng Trung thương mại",
    "tiếng Trung cho trẻ em",
    "tiếng Trung chuyên ngành",
    "học tiếng Trung online",
  ],
} as const;

export const keywordString = [
  ...keywords.core,
  ...keywords.exam,
  ...keywords.level,
  ...keywords.purpose,
].join(", ");

/** Mô tả mặc định cho các trang chưa có mô tả riêng. */
export const defaultDescription =
  "Trung tâm Hoa văn SaigonHSK — học tiếng Trung và luyện thi HSK, TOCFL tại TP.HCM. Lớp 10–15 học viên, giảng viên Thạc sĩ – Tiến sĩ, cam kết 100% đầu ra.";

/** Cắt mô tả về đúng độ dài Google hiển thị, không cắt giữa từ. */
export const clampDescription = (text: string, max = 158) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

/**
 * Câu hỏi thường gặp sinh theo từng khoá — nhắm các truy vấn dạng câu hỏi
 * ("HSK4 cần bao nhiêu từ vựng", "học HSK4 mất bao lâu", "học phí bao nhiêu")
 * và đủ điều kiện để Google hiển thị dạng FAQ.
 */
export function courseFaqs(input: {
  title: string;
  facts: { label: string; value: string }[];
  outcomes: string[];
  phone: string;
}) {
  const fact = (label: string) =>
    input.facts.find((f) => f.label.toLowerCase().includes(label.toLowerCase()))?.value;

  const faqs: { question: string; answer: string }[] = [];

  const vocab = fact("Từ vựng");
  if (vocab) {
    faqs.push({
      question: `${input.title} cần bao nhiêu từ vựng?`,
      answer: `Theo chuẩn HSK 3.0, ${input.title} yêu cầu ${vocab.toLowerCase()}${
        fact("Chữ Hán") ? ` và ${fact("Chữ Hán")!.toLowerCase()}` : ""
      }. Trung tâm dạy đủ phạm vi này theo từng chủ điểm, kèm bài kiểm tra định kỳ.`,
    });
  }

  const entry = fact("Đầu vào");
  if (entry) {
    faqs.push({
      question: `Chưa học gì có theo được ${input.title} không?`,
      answer: `Đầu vào của khoá là: ${entry}. Nếu bạn chưa chắc trình độ, trung tâm test miễn phí trước khi xếp lớp để không phải học lại phần đã biết.`,
    });
  }

  faqs.push({
    question: `Học phí và lịch khai giảng ${input.title} thế nào?`,
    answer: `Học phí và lịch khai giảng thay đổi theo hình thức lớp (lớp nhóm, VIP 1 kèm 1, lớp doanh nghiệp). Gọi ${input.phone} hoặc nhắn Zalo để nhận bảng học phí và lịch khai giảng mới nhất.`,
  });

  if (input.outcomes.length) {
    faqs.push({
      question: `Học ${input.title} tại SaigonHSK có cam kết đầu ra không?`,
      answer: `Có. ${input.outcomes[0]} Nếu không đạt mục tiêu đã cam kết, học viên được học lại hoàn toàn miễn phí.`,
    });
  }

  return faqs;
}

/** JSON-LD FAQPage. */
export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

/** JSON-LD ItemList cho các trang tổng quan (hub). */
export const itemListSchema = (
  name: string,
  items: { title: string; href: string }[],
  origin: string,
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.title,
    url: `${origin}${it.href}`,
  })),
});
