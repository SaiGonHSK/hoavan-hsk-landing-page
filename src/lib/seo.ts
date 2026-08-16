
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

/**
 * Từ khoá của **một** cấp HSK, sinh theo khuôn thay vì gõ tay sáu lần.
 *
 * Trước đây sáu cấp được liệt kê tay theo từng dòng, nên mỗi lần thêm một dạng truy vấn
 * là thêm sáu dòng và luôn sót một hai cấp — bản cũ có "ngữ pháp HSK3/4/5" mà không có
 * HSK1, HSK2, HSK6, có "đề thi HSK3/4/5" mà thiếu HSK6. Khuôn dưới đây làm chỗ khai báo
 * duy nhất: thêm một dòng ở đây là đủ sáu cấp cùng có.
 *
 * Bốn nhóm truy vấn, tất cả đều thấy trong dữ liệu tìm kiếm tiếng Việt:
 *
 * - Tìm lớp: "khoá học HSK4", "lớp HSK4 TPHCM". Giữ **cả hai** cách viết "khoá" và
 *   "khóa" — đây là hai chuỗi khác nhau với công cụ tìm kiếm, và "khóa" mới là cách gõ
 *   phổ biến hơn, trong khi cả site chỉ dùng "khoá".
 * - Luyện thi: "luyện thi HSK4", "ôn thi HSK4" — hai động từ khác nhau, người tìm dùng
 *   lẫn lộn.
 * - Tra cứu nội dung: "từ vựng HSK4", "ngữ pháp HSK4", "đề thi HSK4".
 * - Câu hỏi: "HSK4 học bao lâu", "HSK4 bao nhiêu từ" — dạng truy vấn mà trang khoá từng
 *   cấp trả lời trực tiếp bằng số liệu HSK 3.0.
 */
const hskLevelKeywords = (level: number) => [
  `HSK${level}`,
  `HSK ${level}`,
  `học HSK${level}`,
  `khoá học HSK${level}`,
  `khóa học HSK${level}`,
  `lớp HSK${level}`,
  `lớp HSK${level} TPHCM`,
  `luyện thi HSK${level}`,
  `luyện thi HSK ${level}`,
  `luyện thi HSK${level} TPHCM`,
  `lớp luyện thi HSK ${level}`,
  `ôn thi HSK${level}`,
  `ôn tập HSK${level}`,
  `chứng chỉ HSK${level}`,
  `từ vựng HSK${level}`,
  `ngữ pháp HSK${level}`,
  `đề thi HSK${level}`,
  `HSK${level} học bao lâu`,
  `HSK${level} bao nhiêu từ`,
  // Không dấu — xem ghi chú ở nhóm `nodiacritics`.
  `hoc hsk${level}`,
  `khoa hoc hsk${level}`,
  `luyen thi hsk${level}`,
  `on thi hsk${level}`,
  `tu vung hsk${level}`,
  `de thi hsk${level}`,
  `lop hsk${level} tphcm`,
];

/** Sáu cấp HSK. Không lấy từ `HSK_LEVELS`: `lib/` không phụ thuộc vào `data/`. */
const HSK_LEVEL_NUMBERS = [1, 2, 3, 4, 5, 6];

export const keywords = {
  core: [
    "học tiếng Trung",
    "trung tâm tiếng Trung TPHCM",
    "trung tâm tiếng Trung Sài Gòn",
    "trung tâm học tiếng Trung tại TPHCM",
    "học tiếng Trung ở đâu tốt",
    "học tiếng Trung ở đâu tốt TPHCM",
    "trung tâm tiếng Trung uy tín",
    "trung tâm tiếng Trung uy tín TPHCM",
    "trung tâm tiếng Trung có giấy phép",
    "trung tâm tiếng Trung được Sở Giáo dục cấp phép",
    "học phí học tiếng Trung",
    "học tiếng Trung TPHCM",
    "học tiếng Trung tại TPHCM",
    "học tiếng Trung Sài Gòn",
    "học tiếng Trung tại Sài Gòn",
    "dạy tiếng Trung TPHCM",
    "lớp tiếng Trung TPHCM",
    "khoá học tiếng Trung TPHCM",
    "khóa học tiếng Trung TPHCM",
    "trung tâm dạy tiếng Trung TPHCM",
    "trung tâm Hoa văn TPHCM",
    "học tiếng Hoa TPHCM",
  ],
  /**
   * Tên trung tâm và các biến thể người ta gõ khi đã biết tên.
   *
   * Nhóm quan trọng nhất trong file mà bản cũ không có: truy vấn thương hiệu là truy vấn
   * gần chuyển đổi nhất — người gõ "hoa van sai gon hsk" đã định học ở đây, chỉ đang tìm
   * đường vào. Tên bị viết rời ("Sài Gòn HSK") hay dính ("SaigonHSK"), có dấu và không
   * dấu đều là những chuỗi khác nhau với công cụ tìm kiếm, nên phải khai đủ.
   *
   * Cùng bộ tên này còn nằm ở `alternateName` của node Organization trong `Layout.astro`
   * và ở mục "Thông tin cốt lõi" của `/llms.txt` — ba chỗ nói cùng một điều cho ba loại
   * bot khác nhau.
   */
  brand: [
    "SaigonHSK",
    "Saigon HSK",
    "Hoa văn SaigonHSK",
    "Hoa văn Sài Gòn HSK",
    "Trung tâm Hoa văn SaigonHSK",
    "Trung tâm Hoa văn Sài Gòn HSK",
    "trung tâm tiếng Trung SaigonHSK",
    "saigonhsk",
    "sai gon hsk",
    "hoa van saigonhsk",
    "hoa van sai gon hsk",
    "trung tam hoa van sai gon hsk",
    "trung tam hoa van saigonhsk",
    "trung tam tieng trung saigonhsk",
  ],
  exam: [
    "luyện thi HSK",
    "luyện thi HSK ở TPHCM",
    "luyện thi HSK TPHCM",
    "trung tâm luyện thi HSK",
    "trung tâm luyện thi HSK TPHCM",
    "lớp luyện thi HSK",
    "khoá luyện thi HSK",
    "ôn thi HSK",
    "ôn tập HSK",
    "ôn thi HSK cấp tốc",
    "chứng chỉ HSK",
    "thi HSK ở đâu",
    "đăng ký thi HSK",
    "HSK 3.0",
    "HSKK",
    "luyện thi HSKK",
    "từ vựng HSK",
    "ngữ pháp HSK",
    "đề thi HSK",
    "HSK4 khó không",
    "HSK5 khó không",
    "học phí HSK",
    "học phí luyện thi HSK",
    ...HSK_LEVEL_NUMBERS.flatMap(hskLevelKeywords),
  ],
  level: [
    "tiếng Trung cho người mới bắt đầu",
    "học tiếng Trung từ con số 0",
    "học tiếng Trung cho người mất gốc",
    "học tiếng Trung cơ bản",
    "học tiếng Trung nâng cao",
    "tiếng Trung sơ cấp",
    "tiếng Trung trung cấp",
    "tiếng Trung cao cấp",
    "tiếng Trung A1", "tiếng Trung A2", "tiếng Trung B1", "tiếng Trung B2",
  ],
  purpose: [
    "tiếng Trung giao tiếp",
    "tiếng Trung giao tiếp cấp tốc",
    "tiếng Trung giao tiếp hàng ngày",
    "tiếng Trung công sở",
    "tiếng Trung thương mại",
    "tiếng Trung doanh nghiệp",
    "tiếng Trung cho trẻ em",
    "tiếng Trung thiếu nhi",
    "tiếng Trung chuyên ngành",
    "tiếng Trung du lịch",
    "tiếng Trung xuất nhập khẩu",
    "tiếng Trung logistics",
    "học tiếng Trung online",
    "học tiếng Trung 1 kèm 1",
    "học tiếng Trung VIP",
    "gia sư tiếng Trung",
    "gia sư tiếng Trung TPHCM",
    "dạy tiếng Trung cho doanh nghiệp",
  ],
  /**
   * Biến thể không dấu — phủ tìm kiếm trên Cốc Cốc và mobile keyboard.
   *
   * Bản không dấu **theo cấp** ("luyen thi hsk4") nằm trong `hskLevelKeywords`, không
   * lặp lại ở đây; chỗ này chỉ giữ các truy vấn không gắn với cấp nào.
   */
  nodiacritics: [
    "hoc tieng trung",
    "trung tam hoc tieng trung",
    "trung tam hoc tieng trung tai tphcm",
    "trung tam tieng trung tphcm",
    "trung tam tieng trung sai gon",
    "trung tam tieng trung uy tin",
    "trung tam day tieng trung tphcm",
    "luyen thi hsk",
    "luyen thi hsk tphcm",
    "trung tam luyen thi hsk",
    "khoa hoc tieng trung",
    "khoa hoc tieng trung tphcm",
    "tieng trung giao tiep",
    "hoc tieng trung o dau",
    "hoc tieng trung o dau tot",
    "hoc tieng trung tphcm",
    "hoc tieng trung tai tphcm",
    "hoc tieng trung sai gon",
    "hoc tieng trung co ban",
    "hoc tieng trung cho nguoi moi",
    "hoc tieng hoa tphcm",
    "tu vung hsk", "ngu phap hsk",
    "de thi hsk", "on thi hsk", "on tap hsk",
    "chung chi hsk",
    "tieng trung thuong mai",
    "gia su tieng trung",
    "hoc phi tieng trung",
    "lich khai giang tieng trung",
  ],
} as const;

/**
 * Bộ từ khoá đầy đủ, đi vào `<meta name="keywords">` của **mọi** trang.
 *
 * Bỏ trùng lặp trước khi nối: các nhóm được soạn tay theo chủ đề nên chuyện một truy vấn
 * xuất hiện ở hai nhóm là bình thường, mà chuỗi lặp thì vừa dài vừa trông như nhồi nhét
 * với đúng những công cụ còn đọc thẻ này.
 */
export const keywordString = Array.from(
  new Set([
    ...keywords.core,
    ...keywords.brand,
    ...keywords.exam,
    ...keywords.level,
    ...keywords.purpose,
    ...keywords.nodiacritics,
  ]),
).join(", ");

/**
 * Gộp bộ từ khoá chung với các từ khoá riêng của trang, bỏ trùng lặp.
 *
 * Từ khoá riêng đứng **trước**: `Layout` nối tiếp `keywordString` vào sau chuỗi này, nên
 * thứ đặc thù của trang phải nằm ở đầu thẻ chứ không lẫn giữa hai trăm từ khoá chung.
 */
export const keywordsFor = (...extra: string[]) =>
  Array.from(
    new Set([
      ...extra.map((k) => k.trim()).filter(Boolean),
      ...keywords.brand,
      ...keywords.core,
      ...keywords.exam,
    ]),
  ).join(", ");

export const defaultDescription =
  "Trung tâm Hoa văn SaigonHSK — học tiếng Trung và luyện thi HSK tại TP.HCM. Lớp 10–15 học viên, giảng viên Thạc sĩ – Tiến sĩ, cam kết 100% đầu ra.";

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
      // Không hạ chữ thường: giá trị có thể chứa mã lớp như "HSK4.1".
      answer: `Thời lượng của khoá là ${duration}. Nhịp học phổ biến là 3 buổi/tuần; học viên đi làm có thể chọn lớp buổi tối hoặc lớp cuối tuần.`,
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

/* Breadcrumb đã chuyển sang `breadcrumbNodes` trong src/lib/schema.ts: bản ở đây không
   sinh `@id` nên BreadcrumbList không gắn được vào node `WebPage` của trang. */

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
