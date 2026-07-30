
const BRAND = "SaigonHSK";

export const title = (main: string) =>
  main.includes(BRAND) ? main : `${main} | ${BRAND}`;

/**
 * Người Việt gõ tên thành phố theo nhiều cách và Google coi chúng là các truy vấn
 * khác nhau: "tphcm" (không dấu chấm) chiếm phần lớn lượng tìm kiếm, "tp.hcm" và
 * "sài gòn" vẫn còn nhiều. Title dùng "TPHCM", phần mô tả nhắc lại "TP.HCM" và
 * "Sài Gòn" để phủ cả ba biến thể mà không nhồi nhét.
 */
export const CITY = {
  compact: "TPHCM",
  dotted: "TP.HCM",
  legacy: "Sài Gòn",
} as const;

export const keywords = {
  core: [
    "học tiếng Trung",
    "học tiếng Hoa",
    "trung tâm tiếng Trung TPHCM",
    "trung tâm tiếng Hoa TPHCM",
    "trung tâm tiếng Trung Sài Gòn",
    "học tiếng Trung ở đâu tốt",
    "học tiếng Trung ở đâu tốt TPHCM",
    "trung tâm tiếng Trung uy tín",
    "học phí học tiếng Trung",
  ],
  exam: [
    "luyện thi HSK",
    "luyện thi HSK ở TPHCM",
    "ôn thi HSK",
    "chứng chỉ HSK",
    "HSK 3.0",
    "luyện thi TOCFL",
    "lớp luyện thi HSK 4",
    "lớp luyện thi HSK 5",
    "từ vựng HSK",
  ],
  level: [
    "tiếng Trung cho người mới bắt đầu",
    "học tiếng Trung từ con số 0",
    "học tiếng Trung cho người mất gốc",
    "tiếng Trung sơ cấp",
    "tiếng Trung trung cấp",
    "tiếng Trung cao cấp",
  ],
  purpose: [
    "tiếng Trung giao tiếp",
    "tiếng Trung giao tiếp cấp tốc",
    "tiếng Trung công sở",
    "tiếng Trung thương mại",
    "tiếng Trung cho trẻ em",
    "tiếng Trung chuyên ngành",
    "học tiếng Trung online",
    "học tiếng Trung 1 kèm 1",
  ],
} as const;

export const keywordString = [
  ...keywords.core,
  ...keywords.exam,
  ...keywords.level,
  ...keywords.purpose,
].join(", ");

/** Gộp bộ từ khoá chung với các từ khoá riêng của trang, bỏ trùng lặp. */
export const keywordsFor = (...extra: string[]) =>
  Array.from(
    new Set([
      ...extra.map((k) => k.trim()).filter(Boolean),
      ...keywords.core,
      ...keywords.exam,
    ]),
  ).join(", ");

export const defaultDescription =
  "Trung tâm Hoa văn SaigonHSK — học tiếng Trung và luyện thi HSK, TOCFL tại TP.HCM. Lớp 10–15 học viên, giảng viên Thạc sĩ – Tiến sĩ, cam kết 100% đầu ra.";

/**
 * Google cắt title ở khoảng 60 ký tự. Nhận vào các phương án từ dài (nhiều từ khoá)
 * đến ngắn, trả về phương án dài nhất còn vừa khung hiển thị — thay vì để title bị
 * cắt giữa câu và mất luôn tên thương hiệu ở cuối.
 */
export const pickTitle = (...candidates: string[]) => {
  const usable = candidates.filter(Boolean);
  return (
    usable.find((c) => c.length <= 60) ??
    usable.reduce((a, b) => (a.length <= b.length ? a : b))
  );
};

export const clampDescription = (text: string, max = 158) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

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
    question: `Học phí ${input.title} bao nhiêu tiền?`,
    answer: `Học phí thay đổi theo hình thức lớp (lớp nhóm 10–15 học viên, VIP 1 kèm 1, lớp doanh nghiệp) và số buổi của từng cấp. Gọi ${input.phone} hoặc nhắn Zalo để nhận bảng học phí và lịch khai giảng mới nhất — trung tâm báo giá trọn khoá, không phát sinh.`,
  });

  const duration = fact("Thời lượng") ?? fact("Số buổi");
  if (duration) {
    faqs.push({
      question: `Học ${input.title} mất bao lâu?`,
      answer: `Thời lượng của khoá là ${duration.toLowerCase()}. Nhịp học phổ biến là 3 buổi/tuần; học viên đi làm có thể chọn lớp buổi tối hoặc lớp cuối tuần.`,
    });
  }

  if (input.outcomes.length) {
    faqs.push({
      question: `Học ${input.title} tại SaigonHSK có cam kết đầu ra không?`,
      answer: `Có. ${input.outcomes[0]} Nếu không đạt mục tiêu đã cam kết, học viên được học lại hoàn toàn miễn phí.`,
    });
  }

  return faqs;
}

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

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

/**
 * schema.org yêu cầu courseWorkload / timeRequired là ISO 8601 duration, không phải
 * chữ tiếng Việt. Rút số giờ (hoặc số tháng) từ mô tả thời lượng; không đọc được
 * thì trả về undefined để bỏ hẳn thuộc tính thay vì phát ra dữ liệu sai.
 */
export function toIsoDuration(text?: string): string | undefined {
  if (!text) return undefined;
  // Chỉ nhận "48 giờ"/"48 tiếng" là tổng thời lượng. Không nhận dạng "2h/buổi" —
  // đó là độ dài một buổi, khai vào courseWorkload sẽ sai lệch rất lớn.
  // Lookbehind (?<![\d,]) loại các số thập phân kiểu "3,5 tháng": ISO duration
  // không biểu diễn được phần thập phân nên thà bỏ trống hơn là khai "5 tháng".
  const hours = text.match(/(?<![\d,])(\d+)\s*(?:giờ|tiếng)/i);
  if (hours) return `PT${hours[1]}H`;
  const months = text.match(/(?<![\d,])(\d+)\s*tháng/i);
  if (months) return `P${months[1]}M`;
  const weeks = text.match(/(?<![\d,])(\d+)\s*tuần/i);
  if (weeks) return `P${weeks[1]}W`;
  return undefined;
}

/** Số buổi trong khoá, dùng cho courseSchedule.repeatCount. */
const sessionCount = (text?: string) => {
  const m = text?.match(/(\d+)\s*buổi(?!\s*\/)/i);
  return m ? Number(m[1]) : undefined;
};

/** Số buổi mỗi tuần → repeatFrequency. */
const weeklySessions = (text?: string) => {
  const m = text?.match(/(\d+)\s*buổi\s*\/\s*tuần/i);
  return m ? Number(m[1]) : undefined;
};

export type CourseSchemaInput = {
  name: string;
  description: string;
  url: string;
  origin: string;
  provider: { name: string; address: string };
  /** Mô tả thời lượng dạng tiếng Việt, ví dụ "24 buổi, 48 giờ học, 3 buổi/tuần". */
  workload?: string;
  /** HSK1…HSK6 hoặc mô tả trình độ, đưa vào educationalLevel. */
  level?: string;
  /** Chứng chỉ khoá học hướng tới, ví dụ "HSK4". */
  credential?: string;
};

/**
 * Course schema đầy đủ hơn bản cũ: có offers (Google cần offers.category hoặc price
 * để hiện Course rich result), courseSchedule, educationalLevel và
 * educationalCredentialAwarded. Không đặt giá vì trung tâm báo học phí qua hotline.
 */
export function courseSchema(input: CourseSchemaInput) {
  const workload = toIsoDuration(input.workload);
  const repeatCount = sessionCount(input.workload);
  const perWeek = weeklySessions(input.workload);

  const instance: Record<string, unknown> = {
    "@type": "CourseInstance",
    courseMode: ["Onsite", "Online"],
    location: {
      "@type": "Place",
      name: input.provider.name,
      address: input.provider.address,
    },
  };
  if (workload) instance.courseWorkload = workload;
  if (repeatCount || perWeek) {
    instance.courseSchedule = {
      "@type": "Schedule",
      // perWeek buổi mỗi tuần → chu kỳ lặp 1 tuần, repeatCount là tổng số buổi.
      ...(perWeek ? { repeatFrequency: "P1W" } : {}),
      ...(repeatCount ? { repeatCount } : {}),
      scheduleTimezone: "Asia/Ho_Chi_Minh",
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: "vi-VN",
    teaches: "Tiếng Trung Quốc (Hán ngữ)",
    about: { "@type": "Thing", name: "Tiếng Trung Quốc" },
    availableLanguage: ["vi", "zh-Hans"],
    ...(input.level ? { educationalLevel: input.level } : {}),
    ...(input.credential
      ? {
          educationalCredentialAwarded: {
            "@type": "EducationalOccupationalCredential",
            name: `Chứng chỉ ${input.credential}`,
            credentialCategory: "certificate",
          },
        }
      : {}),
    provider: {
      "@type": "EducationalOrganization",
      "@id": `${input.origin}/#organization`,
      name: input.provider.name,
      url: input.origin,
    },
    offers: {
      "@type": "Offer",
      category: "Paid",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url: `${input.origin}/register`,
    },
    hasCourseInstance: instance,
  };
}
