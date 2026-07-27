/**
 * Danh mục nội dung của website: khóa học theo cấp HSK, khóa theo giáo trình,
 * khu ôn tập – luyện thi – luyện kỹ năng, lớp học thử và thư viện.
 *
 * Lưu ý: số từ vựng/Hán tự ở mỗi cấp lấy theo "Chuẩn trình độ tiếng Trung
 * quốc tế HSK 3.0" (国际中文教育中文水平等级标准). Trung tâm nên rà lại số liệu
 * và bổ sung thời lượng, học phí thực tế trước khi công bố.
 */

export type CatalogItem = {
  slug: string;
  title: string;
  /** Mô tả ngắn hiển thị trên card và thẻ meta. */
  summary: string;
  /** Câu mô tả dài cho phần mở đầu trang. */
  intro: string;
  /** Thông số hiển thị dạng bảng nhỏ. */
  facts: { label: string; value: string }[];
  /** Nội dung chính của khóa/chuyên mục. */
  content: string[];
  /** Học viên đạt được gì sau khóa. */
  outcomes: string[];
  /** Dành cho ai. */
  audience?: string[];
};

const LIEN_HE = "Liên hệ trung tâm";

/* ------------------------------------------------------------------ *
 * 2.1 — Khóa học theo cấp HSK (offline và online)
 * ------------------------------------------------------------------ */

const HSK_LEVELS = [
  {
    level: 1,
    words: "500 từ",
    chars: "300 chữ Hán",
    can: "chào hỏi, giới thiệu bản thân, nói về gia đình, số đếm, thời gian và các nhu cầu đơn giản hằng ngày",
    entry: "Người chưa từng học tiếng Trung",
  },
  {
    level: 2,
    words: "1.272 từ",
    chars: "600 chữ Hán",
    can: "trao đổi ngắn về việc học, công việc, mua sắm, thời tiết, sức khỏe và các tình huống quen thuộc",
    entry: "Đã hoàn thành HSK1 hoặc tương đương",
  },
  {
    level: 3,
    words: "2.245 từ",
    chars: "900 chữ Hán",
    can: "xử lý phần lớn tình huống khi học tập, đi lại, làm việc tại Trung Quốc và kể lại một sự việc mạch lạc",
    entry: "Đã hoàn thành HSK2 hoặc tương đương",
  },
  {
    level: 4,
    words: "3.245 từ",
    chars: "1.200 chữ Hán",
    can: "thảo luận nhiều chủ đề xã hội, trình bày quan điểm và giao tiếp tương đối trôi chảy với người bản ngữ",
    entry: "Đã hoàn thành HSK3 hoặc tương đương",
  },
  {
    level: 5,
    words: "4.316 từ",
    chars: "1.500 chữ Hán",
    can: "đọc báo, xem phim, nghe bản tin và trình bày bài nói tương đối dài bằng tiếng Trung",
    entry: "Đã hoàn thành HSK4 hoặc tương đương",
  },
  {
    level: 6,
    words: "5.456 từ",
    chars: "1.800 chữ Hán",
    can: "nghe hiểu và đọc hiểu gần như mọi nội dung tiếng Trung, diễn đạt trôi chảy cả nói lẫn viết",
    entry: "Đã hoàn thành HSK5 hoặc tương đương",
  },
] as const;

export const hskCourses: CatalogItem[] = HSK_LEVELS.map((l) => ({
  slug: `hsk-${l.level}`,
  title: `HSK${l.level}`,
  summary: `Khóa tiếng Trung cấp độ HSK${l.level} theo chuẩn HSK 3.0 — ${l.words}, ${l.chars}.`,
  intro: `Khóa HSK${l.level} bám sát chuẩn HSK 3.0, rèn song song bốn kỹ năng nghe – nói – đọc – viết. Kết thúc khóa, học viên sử dụng được ${l.words} và ${l.chars} để ${l.can}.`,
  facts: [
    { label: "Cấp độ", value: `HSK${l.level} (chuẩn HSK 3.0)` },
    { label: "Từ vựng mục tiêu", value: l.words },
    { label: "Chữ Hán", value: l.chars },
    { label: "Hình thức", value: "Offline tại trung tâm hoặc online" },
    { label: "Đầu vào", value: l.entry },
    { label: "Khai giảng · học phí", value: LIEN_HE },
  ],
  content: [
    `Từ vựng và chữ Hán trong phạm vi cấp HSK${l.level}, học theo chủ điểm gắn với tình huống thực tế.`,
    "Hệ thống ngữ pháp của cấp độ, có bảng tổng hợp và bài tập vận dụng sau mỗi chủ điểm.",
    "Luyện nghe – nói theo tình huống, sửa phát âm và thanh điệu trực tiếp trên lớp.",
    "Luyện đọc hiểu và viết theo dạng bài của đề thi HSK.",
    "Kiểm tra định kỳ, thi thử cuối khóa và nhận xét riêng cho từng học viên.",
  ],
  outcomes: [
    `Nắm chắc ${l.words} và ${l.chars} theo chuẩn HSK 3.0.`,
    `Có thể ${l.can}.`,
    `Đủ nền tảng để thi HSK${l.level} hoặc học tiếp cấp HSK${Math.min(l.level + 1, 6)}.`,
  ],
  audience: [
    l.entry + ".",
    "Người cần chứng chỉ HSK để du học, xin việc hoặc thăng tiến trong công việc.",
    "Người muốn học tiếng Trung theo lộ trình rõ ràng thay vì học rời rạc.",
  ],
}));

/* 2.1 — Lớp luyện thi HSK3 → HSK6 */

export const hskExamCourses: CatalogItem[] = [3, 4, 5, 6].map((level) => ({
  slug: `luyen-thi-hsk-${level}`,
  title: `Luyện thi HSK${level}`,
  summary: `Lớp luyện đề HSK${level}: chiến thuật làm bài, bảng từ vựng và đề thi thử.`,
  intro: `Lớp luyện thi HSK${level} dành cho học viên đã có nền tảng và cần tối ưu điểm số trong thời gian ngắn. Trọng tâm là kỹ năng làm bài, bẫy thường gặp trong đề và tốc độ xử lý từng phần thi.`,
  facts: [
    { label: "Mục tiêu", value: `Đạt chứng chỉ HSK${level}` },
    { label: "Trọng tâm", value: "Nghe – Đọc – Viết theo dạng đề" },
    { label: "Tài liệu", value: "Bảng từ vựng, sổ tay ngữ pháp, bộ đề luyện" },
    { label: "Hình thức", value: "Offline tại trung tâm hoặc online" },
    { label: "Đầu vào", value: `Trình độ tương đương HSK${level - 1}` },
    { label: "Khai giảng · học phí", value: LIEN_HE },
  ],
  content: [
    `Rà soát toàn bộ bảng từ vựng cấp HSK${level} theo nhóm chủ đề và nhóm từ dễ nhầm.`,
    "Tổng hợp ngữ pháp trọng điểm thường xuất hiện trong đề thi.",
    "Chiến thuật làm từng phần: nghe, đọc hiểu, sắp xếp câu và viết.",
    "Luyện đề theo bộ đề chuẩn, bấm giờ như thi thật.",
    "Chữa đề chi tiết, chỉ ra lỗi sai lặp lại của từng học viên.",
  ],
  outcomes: [
    `Quen với cấu trúc và áp lực thời gian của đề HSK${level}.`,
    "Biết cách xử lý các dạng câu hỏi thường gây mất điểm.",
    `Sẵn sàng dự thi HSK${level} với điểm số ổn định.`,
  ],
  audience: [
    `Học viên đã học xong chương trình HSK${level} hoặc tương đương, cần luyện đề trước kỳ thi.`,
    "Người cần chứng chỉ gấp để nộp hồ sơ du học, học bổng hoặc công việc.",
  ],
}));

/* 2.1 — Các lớp chuyên biệt */

export const specialCourses: CatalogItem[] = [
  {
    slug: "giao-tiep-cong-so-co-ban",
    title: "Giao tiếp công sở cơ bản",
    summary: "Tiếng Trung dùng được ngay ở nơi làm việc: chào hỏi, trao đổi, họp ngắn.",
    intro:
      "Khóa học dành cho người đi làm cần dùng tiếng Trung trong công việc hằng ngày. Nội dung xoay quanh các tình huống công sở phổ biến, chú trọng phản xạ nói và mẫu câu dùng được ngay.",
    facts: [
      { label: "Mục tiêu", value: "Giao tiếp công việc ở mức cơ bản" },
      { label: "Trọng tâm", value: "Nghe – Nói theo tình huống" },
      { label: "Hình thức", value: "Offline, online hoặc đào tạo tại doanh nghiệp" },
      { label: "Đầu vào", value: "Biết phiên âm và từ vựng cơ bản" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Chào hỏi, giới thiệu bản thân và giới thiệu công ty với đối tác.",
      "Gọi điện, hẹn lịch, xác nhận và thay đổi lịch làm việc.",
      "Trao đổi công việc trong nhóm: giao việc, báo cáo tiến độ, xin hỗ trợ.",
      "Tiếp khách, mời cơm, giao tiếp xã giao trong môi trường công sở.",
      "Mẫu email và tin nhắn công việc thường dùng.",
    ],
    outcomes: [
      "Xử lý được các tình huống giao tiếp công sở thường ngày bằng tiếng Trung.",
      "Có vốn mẫu câu chuẩn để dùng lại trong công việc.",
      "Tự tin nghe – nói với đồng nghiệp và đối tác nói tiếng Trung.",
    ],
    audience: [
      "Nhân viên đang làm việc tại công ty Trung Quốc, Đài Loan hoặc có đối tác nói tiếng Trung.",
      "Người chuẩn bị ứng tuyển vào môi trường làm việc yêu cầu tiếng Trung.",
    ],
  },
  {
    slug: "giao-tiep-cong-so-nang-cao",
    title: "Giao tiếp công sở nâng cao",
    summary: "Họp, đàm phán, thuyết trình và xử lý tình huống khó bằng tiếng Trung.",
    intro:
      "Khóa nâng cao dành cho người đã giao tiếp được cơ bản và cần dùng tiếng Trung trong các tình huống đòi hỏi độ chính xác cao: họp, đàm phán, thuyết trình và trao đổi văn bản.",
    facts: [
      { label: "Mục tiêu", value: "Làm việc trực tiếp bằng tiếng Trung" },
      { label: "Trọng tâm", value: "Họp – đàm phán – thuyết trình" },
      { label: "Hình thức", value: "Offline, online hoặc đào tạo tại doanh nghiệp" },
      { label: "Đầu vào", value: "Đã học giao tiếp công sở cơ bản hoặc tương đương HSK4" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Điều hành và tham gia cuộc họp: nêu ý kiến, phản biện, chốt kết luận.",
      "Đàm phán giá, tiến độ, điều khoản hợp tác.",
      "Thuyết trình sản phẩm, báo cáo kết quả trước đối tác.",
      "Văn bản công việc: email, biên bản, đề xuất.",
      "Xử lý tình huống khó: khiếu nại, chậm tiến độ, hiểu nhầm văn hóa.",
    ],
    outcomes: [
      "Chủ động trong các cuộc họp và buổi làm việc bằng tiếng Trung.",
      "Diễn đạt quan điểm rõ ràng, lịch sự và đúng văn phong công việc.",
      "Hiểu khác biệt văn hóa để tránh mất điểm khi làm việc với đối tác.",
    ],
    audience: [
      "Quản lý, nhân sự phụ trách đối tác Trung Quốc – Đài Loan.",
      "Người đã giao tiếp được cơ bản, muốn dùng tiếng Trung ở mức chuyên nghiệp.",
    ],
  },
  {
    slug: "ngu-phap-co-ban",
    title: "Ngữ pháp tiếng Trung Quốc cơ bản",
    summary: "Hệ thống lại toàn bộ ngữ pháp nền tảng, hết mất gốc.",
    intro:
      "Khóa học hệ thống lại ngữ pháp tiếng Trung từ đầu: trật tự câu, các loại bổ ngữ, câu chữ 把, 被, so sánh… Phù hợp với người học lâu nhưng vẫn hay sai cấu trúc.",
    facts: [
      { label: "Mục tiêu", value: "Nắm chắc ngữ pháp cơ bản HSK1–HSK4" },
      { label: "Trọng tâm", value: "Cấu trúc câu và bài tập vận dụng" },
      { label: "Hình thức", value: "Offline tại trung tâm hoặc online" },
      { label: "Đầu vào", value: "Đã biết phiên âm và chữ Hán cơ bản" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Trật tự từ và thành phần câu tiếng Trung.",
      "Các loại bổ ngữ: kết quả, xu hướng, khả năng, trạng thái, mức độ.",
      "Câu chữ 把, câu bị động 被, câu so sánh, câu tồn hiện.",
      "Hư từ thường gặp: phó từ, giới từ, trợ từ và cách phân biệt.",
      "Bài tập vận dụng và chữa lỗi sai phổ biến của người Việt.",
    ],
    outcomes: [
      "Đặt câu đúng cấu trúc, giảm hẳn lỗi ngữ pháp khi nói và viết.",
      "Hiểu bản chất các cấu trúc thay vì học thuộc máy móc.",
      "Sẵn sàng cho phần viết và đọc hiểu trong đề HSK.",
    ],
  },
  {
    slug: "ngu-phap-nang-cao",
    title: "Ngữ pháp tiếng Trung Quốc nâng cao",
    summary: "Từ pháp, cụm từ cố định và văn phong viết ở trình độ cao cấp.",
    intro:
      "Khóa nâng cao tập trung vào phần khó của tiếng Trung: phân biệt từ gần nghĩa, cụm từ cố định, liên từ phức và văn phong viết học thuật — phần quyết định điểm HSK5, HSK6.",
    facts: [
      { label: "Mục tiêu", value: "Chuẩn ngữ pháp HSK5 – HSK6" },
      { label: "Trọng tâm", value: "Từ pháp, phân biệt từ, văn phong viết" },
      { label: "Hình thức", value: "Offline tại trung tâm hoặc online" },
      { label: "Đầu vào", value: "Trình độ tương đương HSK4 trở lên" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Phân biệt các nhóm từ gần nghĩa thường xuất hiện trong đề thi.",
      "Cụm từ cố định, kết cấu quan hệ và liên từ phức.",
      "Câu dài nhiều tầng: cách phân tích và cách viết.",
      "Văn phong viết: thư từ, bài luận ngắn, tóm tắt văn bản.",
      "Chữa bài viết theo từng học viên.",
    ],
    outcomes: [
      "Xử lý được phần chọn từ và sắp xếp câu trong đề HSK5, HSK6.",
      "Viết được đoạn văn mạch lạc, đúng văn phong.",
      "Diễn đạt có chiều sâu, gần với cách nói của người bản ngữ.",
    ],
  },
  {
    slug: "tieng-trung-tre-em",
    title: "Tiếng Trung Quốc trẻ em",
    summary: "Lớp cho thiếu nhi: học qua trò chơi, bài hát và hoạt động tương tác.",
    intro:
      "Lớp tiếng Trung thiết kế riêng cho trẻ em, ưu tiên phát âm chuẩn và phản xạ nghe – nói. Bài học ngắn, nhiều hoạt động, hạn chế áp lực để trẻ giữ hứng thú lâu dài.",
    facts: [
      { label: "Đối tượng", value: "Học sinh tiểu học và trung học cơ sở" },
      { label: "Trọng tâm", value: "Phát âm, nghe – nói, chữ Hán cơ bản" },
      { label: "Hình thức", value: "Lớp nhỏ tại trung tâm hoặc online" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Ngữ âm và thanh điệu qua bài hát, vần điệu.",
      "Từ vựng theo chủ đề gần gũi: gia đình, trường lớp, con vật, đồ ăn.",
      "Chữ Hán cơ bản và quy tắc bút thuận, luyện viết theo ô.",
      "Trò chơi ngôn ngữ, đóng vai tình huống.",
      "Văn hóa Trung Hoa qua truyện tranh và lễ hội.",
    ],
    outcomes: [
      "Trẻ phát âm chuẩn, tự tin nói những mẫu câu quen thuộc.",
      "Viết được chữ Hán cơ bản đúng thứ tự nét.",
      "Giữ được hứng thú và thói quen học đều đặn.",
    ],
  },
  {
    slug: "tieng-trung-chuyen-nganh",
    title: "Tiếng Trung Quốc chuyên ngành",
    summary: "Tiếng Trung theo ngành: thương mại, logistics, du lịch, kỹ thuật, y tế…",
    intro:
      "Khóa học được thiết kế theo ngành nghề của học viên hoặc doanh nghiệp: thương mại, xuất nhập khẩu, logistics, du lịch – nhà hàng – khách sạn, kỹ thuật, y tế. Giáo trình xây dựng dựa trên tài liệu thực tế của chính công việc.",
    facts: [
      { label: "Mục tiêu", value: "Dùng tiếng Trung trong đúng ngành của bạn" },
      { label: "Trọng tâm", value: "Thuật ngữ và tình huống nghề nghiệp" },
      { label: "Hình thức", value: "Lớp nhóm, 1 kèm 1 hoặc đào tạo tại doanh nghiệp" },
      { label: "Đầu vào", value: "Khảo sát trình độ trước khi xây lộ trình" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Xây dựng bộ thuật ngữ riêng cho ngành của học viên.",
      "Tình huống nghề nghiệp: báo giá, đặt hàng, kiểm hàng, xử lý sự cố…",
      "Đọc hiểu tài liệu, hợp đồng, thông số kỹ thuật bằng tiếng Trung.",
      "Luyện nói theo kịch bản công việc thực tế.",
    ],
    outcomes: [
      "Sử dụng đúng thuật ngữ chuyên ngành khi làm việc.",
      "Đọc và xử lý được tài liệu tiếng Trung trong công việc.",
      "Giao tiếp trực tiếp với đối tác mà không cần phiên dịch.",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 2.2 — Khóa học trực tuyến theo giáo trình
 * ------------------------------------------------------------------ */

export const textbookCourses: CatalogItem[] = [
  {
    slug: "giao-trinh-chuan-hsk-3-0",
    title: "Giáo trình chuẩn HSK 3.0",
    summary: "Học bám sát bộ chuẩn HSK 3.0 mới nhất, đúng phạm vi thi.",
    intro:
      "Khóa học trực tuyến đi theo bộ giáo trình chuẩn HSK 3.0 — bộ chuẩn đang được dùng cho kỳ thi HSK hiện nay. Mỗi bài gồm từ vựng, ngữ pháp, bài đọc và bài luyện đúng dạng đề.",
    facts: [
      { label: "Giáo trình", value: "Chuẩn HSK 3.0" },
      { label: "Phù hợp", value: "Người thi HSK theo chuẩn mới" },
      { label: "Hình thức", value: "Học trực tuyến, có giảng viên kèm" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Bám sát phạm vi từ vựng và ngữ pháp của chuẩn HSK 3.0 theo từng cấp.",
      "Mỗi bài: từ vựng – ngữ pháp – bài khóa – bài luyện dạng đề.",
      "Bài kiểm tra sau mỗi cụm bài, có chữa chi tiết.",
    ],
    outcomes: [
      "Học đúng phạm vi kiến thức của kỳ thi HSK hiện hành.",
      "Tiến độ rõ ràng theo từng bài, dễ theo dõi khi học online.",
    ],
  },
  {
    slug: "giao-trinh-boya",
    title: "Giáo trình Boya",
    summary: "Bộ Boya — ngữ liệu phong phú, mạnh về đọc hiểu và diễn đạt.",
    intro:
      "Bộ Boya (博雅汉语) được nhiều trường đại học sử dụng, nổi bật ở lượng ngữ liệu phong phú và bài đọc có chiều sâu. Phù hợp với người muốn nâng khả năng đọc hiểu và diễn đạt.",
    facts: [
      { label: "Giáo trình", value: "Boya Chinese (博雅汉语)" },
      { label: "Phù hợp", value: "Người học dài hạn, hướng du học" },
      { label: "Hình thức", value: "Học trực tuyến, có giảng viên kèm" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Học theo trình tự sơ cấp – trung cấp – cao cấp của bộ Boya.",
      "Khai thác bài khóa: từ vựng, ngữ pháp, cách diễn đạt.",
      "Mở rộng chủ đề văn hóa – xã hội sau mỗi bài.",
    ],
    outcomes: [
      "Vốn từ và khả năng đọc hiểu tăng rõ rệt.",
      "Diễn đạt tự nhiên hơn nhờ ngữ liệu chuẩn.",
    ],
  },
  {
    slug: "giao-trinh-han-ngu-6-quyen",
    title: "Giáo trình Hán ngữ 6 quyển",
    summary: "Bộ giáo trình quen thuộc nhất với người Việt học tiếng Trung.",
    intro:
      "Bộ Giáo trình Hán ngữ 6 quyển là bộ phổ biến nhất tại Việt Nam, trình bày dễ theo, phù hợp với người tự học có giảng viên hướng dẫn.",
    facts: [
      { label: "Giáo trình", value: "Hán ngữ 6 quyển (bản mới)" },
      { label: "Phù hợp", value: "Người mới bắt đầu đến trung cấp" },
      { label: "Hình thức", value: "Học trực tuyến, có giảng viên kèm" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Đi tuần tự từ quyển 1 đến quyển 6.",
      "Mỗi bài: phiên âm, từ vựng, ngữ pháp, hội thoại, luyện tập.",
      "Bổ sung bài luyện theo dạng đề HSK tương ứng.",
    ],
    outcomes: [
      "Nền tảng vững từ vỡ lòng đến trung cấp.",
      "Có thể chuyển tiếp sang lớp luyện thi HSK bất cứ lúc nào.",
    ],
  },
  {
    slug: "giao-trinh-tieu-chuan",
    title: "Giáo trình tiêu chuẩn",
    summary: "Bộ HSK Standard Course — bám sát dạng bài của đề thi HSK.",
    intro:
      "Bộ Giáo trình tiêu chuẩn HSK (HSK Standard Course) biên soạn theo cấu trúc đề thi, mỗi bài đều gắn với dạng câu hỏi thật. Phù hợp với người đặt mục tiêu lấy chứng chỉ.",
    facts: [
      { label: "Giáo trình", value: "HSK Standard Course" },
      { label: "Phù hợp", value: "Người học để thi chứng chỉ" },
      { label: "Hình thức", value: "Học trực tuyến, có giảng viên kèm" },
      { label: "Khai giảng · học phí", value: LIEN_HE },
    ],
    content: [
      "Học theo từng cấp HSK, mỗi bài gắn với một dạng bài thi.",
      "Luyện nghe theo file chuẩn của giáo trình.",
      "Kiểm tra cuối mỗi cụm bài bằng đề mô phỏng.",
    ],
    outcomes: [
      "Quen dạng đề từ sớm, không bỡ ngỡ khi thi.",
      "Tiến độ gắn trực tiếp với mục tiêu chứng chỉ.",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 3 — Ôn tập các cấp HSK
 * ------------------------------------------------------------------ */

export const reviewLevels: CatalogItem[] = HSK_LEVELS.map((l) => ({
  slug: `hsk-${l.level}`,
  title: `Ôn tập HSK${l.level}`,
  summary: `Ôn HSK${l.level} theo từng bài: từ vựng, ngữ pháp, đề luyện và bài kiểm tra định kỳ.`,
  intro: `Khu ôn tập HSK${l.level} chia nhỏ theo từng bài học. Mỗi bài gồm bảng từ vựng, điểm ngữ pháp, phần đề HSK tương ứng và bài kiểm tra định kỳ để học viên tự đánh giá tiến độ.`,
  facts: [
    { label: "Cấp độ", value: `HSK${l.level}` },
    { label: "Từ vựng", value: l.words },
    { label: "Cấu trúc mỗi bài", value: "Từ vựng · Ngữ pháp · Đề HSK · Kiểm tra" },
    { label: "Hình thức", value: "Học trực tuyến, tự học có hướng dẫn" },
  ],
  content: [
    "Bảng từ vựng của từng bài, có phiên âm, nghĩa và ví dụ.",
    "Điểm ngữ pháp trọng tâm của bài, kèm bài tập ngắn.",
    "Phần đề HSK bám theo nội dung đã học.",
    "Bài kiểm tra định kỳ sau mỗi cụm bài.",
  ],
  outcomes: [
    "Ôn lại kiến thức đã học theo đúng thứ tự trong giáo trình.",
    "Biết mình hổng phần nào qua bài kiểm tra định kỳ.",
  ],
}));

export const examPrepResources: CatalogItem[] = [3, 4, 5, 6].map((level) => ({
  slug: `hsk-${level}`,
  title: `Luyện thi HSK${level}`,
  summary: `Bảng từ vựng, ngữ pháp trọng tâm và bộ đề luyện cấp HSK${level}.`,
  intro: `Khu luyện thi HSK${level} tập hợp toàn bộ tài liệu cần cho kỳ thi: bảng từ vựng đầy đủ, tổng hợp ngữ pháp trọng tâm và bộ đề luyện có đáp án.`,
  facts: [
    { label: "Cấp độ", value: `HSK${level}` },
    { label: "Nội dung", value: "Bảng từ vựng · Ngữ pháp · Bộ đề" },
    { label: "Hình thức", value: "Tài liệu trực tuyến" },
  ],
  content: [
    `Bảng từ vựng HSK${level} chia theo chủ đề và theo tần suất xuất hiện.`,
    "Tổng hợp ngữ pháp trọng tâm của cấp độ.",
    "Bộ đề luyện theo từng phần: nghe, đọc, viết.",
    "Đề tổng hợp bấm giờ như thi thật.",
  ],
  outcomes: [
    "Có đủ tài liệu để tự ôn trước kỳ thi.",
    "Nhận diện được dạng bài thường gặp và cách xử lý.",
  ],
}));

export const skillTracks: CatalogItem[] = [
  {
    slug: "nghe",
    title: "Luyện kỹ năng Nghe",
    summary: "Luyện nghe theo từng cấp HSK, từ hội thoại ngắn đến bản tin dài.",
    intro:
      "Chuyên mục luyện nghe chia theo cấp HSK. Mỗi cấp đi từ hội thoại ngắn tốc độ chậm đến đoạn hội thoại dài và bản tin ở tốc độ tự nhiên.",
    facts: [
      { label: "Kỹ năng", value: "Nghe" },
      { label: "Phạm vi", value: "Theo từng cấp HSK1 – HSK6" },
      { label: "Hình thức", value: "Bài luyện trực tuyến" },
    ],
    content: [
      "Nghe hội thoại ngắn, chọn đáp án đúng.",
      "Nghe đoạn dài, nắm ý chính và chi tiết.",
      "Nghe chép chính tả để chắc chữ và thanh điệu.",
      "Nghe bản tin, phỏng vấn ở tốc độ tự nhiên (cấp cao).",
    ],
    outcomes: [
      "Bắt kịp tốc độ nói của người bản ngữ theo từng cấp.",
      "Tăng điểm phần nghe — phần dễ mất điểm nhất trong đề HSK.",
    ],
  },
  {
    slug: "noi",
    title: "Luyện kỹ năng Nói",
    summary: "Luyện phản xạ nói, sửa phát âm và thanh điệu theo từng cấp.",
    intro:
      "Chuyên mục luyện nói tập trung vào phản xạ và phát âm. Học viên nói theo chủ đề, được sửa trực tiếp lỗi thanh điệu và cách diễn đạt.",
    facts: [
      { label: "Kỹ năng", value: "Nói" },
      { label: "Phạm vi", value: "Theo từng cấp HSK1 – HSK6" },
      { label: "Hình thức", value: "Luyện có giảng viên sửa trực tiếp" },
    ],
    content: [
      "Luyện phát âm, thanh điệu và ngữ điệu câu.",
      "Nói theo mẫu câu, sau đó nói tự do theo chủ đề.",
      "Đóng vai tình huống thực tế.",
      "Trình bày quan điểm ngắn (cấp trung cấp trở lên).",
    ],
    outcomes: [
      "Nói được thành câu, đúng thanh điệu, ít ngập ngừng.",
      "Chuẩn bị tốt cho kỳ thi khẩu ngữ HSKK.",
    ],
  },
  {
    slug: "doc",
    title: "Luyện kỹ năng Đọc",
    summary: "Luyện đọc hiểu và tốc độ đọc theo từng cấp HSK.",
    intro:
      "Chuyên mục luyện đọc giúp học viên tăng tốc độ đọc và độ chính xác khi làm phần đọc hiểu — phần chiếm nhiều điểm trong đề HSK.",
    facts: [
      { label: "Kỹ năng", value: "Đọc" },
      { label: "Phạm vi", value: "Theo từng cấp HSK1 – HSK6" },
      { label: "Hình thức", value: "Bài luyện trực tuyến" },
    ],
    content: [
      "Đọc câu ngắn, chọn từ điền vào chỗ trống.",
      "Đọc đoạn văn, trả lời câu hỏi chi tiết và câu hỏi suy luận.",
      "Đọc bài dài, tóm tắt ý chính (cấp cao).",
      "Mẹo xử lý khi gặp từ mới trong bài đọc.",
    ],
    outcomes: [
      "Đọc nhanh hơn mà vẫn nắm đúng ý.",
      "Làm hết phần đọc trong thời gian quy định.",
    ],
  },
  {
    slug: "viet",
    title: "Luyện kỹ năng Viết",
    summary: "Luyện viết chữ Hán, sắp xếp câu và viết đoạn theo dạng đề.",
    intro:
      "Chuyên mục luyện viết đi từ viết đúng chữ Hán, sắp xếp trật tự câu đến viết đoạn văn hoàn chỉnh theo dạng bài của đề HSK.",
    facts: [
      { label: "Kỹ năng", value: "Viết" },
      { label: "Phạm vi", value: "Theo từng cấp HSK1 – HSK6" },
      { label: "Hình thức", value: "Bài luyện có giảng viên chữa" },
    ],
    content: [
      "Quy tắc bút thuận và luyện viết chữ Hán.",
      "Sắp xếp trật tự từ thành câu đúng.",
      "Viết câu theo từ cho trước và theo tranh.",
      "Viết đoạn văn 80–200 chữ theo đề (cấp cao).",
    ],
    outcomes: [
      "Viết đúng chữ, đúng trật tự câu.",
      "Hoàn thành được phần viết trong đề HSK.",
    ],
  },
];

export const trialClasses: CatalogItem[] = [1, 2, 3, 4].map((level) => ({
  slug: `hsk-${level}`,
  title: `Học thử HSK${level}`,
  summary: `Buổi học thử miễn phí cấp HSK${level} — trải nghiệm trước khi đăng ký.`,
  intro: `Buổi học thử cấp HSK${level} giúp bạn cảm nhận cách giảng dạy của trung tâm và biết mình đang ở đâu trên lộ trình. Học viên được test trình độ và nhận tư vấn lộ trình sau buổi học.`,
  facts: [
    { label: "Cấp độ", value: `HSK${level}` },
    { label: "Chi phí", value: "Miễn phí" },
    { label: "Bao gồm", value: "Test trình độ + tư vấn lộ trình" },
    { label: "Hình thức", value: "Học cùng lớp đang mở hoặc online" },
    { label: "Đăng ký", value: LIEN_HE },
  ],
  content: [
    "Một buổi học thật cùng lớp đang mở, không phải buổi giới thiệu.",
    "Bài test trình độ ngắn để xác định cấp độ phù hợp.",
    "Tư vấn lộ trình, thời lượng và học phí sau buổi học.",
  ],
  outcomes: [
    "Biết cách trung tâm dạy trước khi quyết định đăng ký.",
    "Biết mình nên bắt đầu từ cấp nào.",
  ],
}));

/* ------------------------------------------------------------------ *
 * 4 — Thư viện
 * ------------------------------------------------------------------ */

type LibraryEntry = { slug: string; title: string; summary: string; intro: string; content: string[] };

export const library: LibraryEntry[] = [
  {
    slug: "tu-vung-theo-chu-de",
    title: "Từ vựng theo chủ đề",
    summary: "Bộ từ vựng chia theo chủ đề đời sống, học tập và công việc.",
    intro:
      "Từ vựng được nhóm theo chủ đề để dễ nhớ và dễ dùng: gia đình, trường lớp, ẩm thực, du lịch, mua sắm, công việc, sức khỏe…",
    content: [
      "Mỗi chủ đề có bảng từ kèm phiên âm, nghĩa và ví dụ đặt câu.",
      "Đánh dấu từ thuộc phạm vi cấp HSK nào.",
      "Gợi ý cách học và ôn lại theo cụm chủ đề.",
    ],
  },
  {
    slug: "van-hoa-trung-quoc",
    title: "Văn hoá Trung Quốc",
    summary: "Bài viết về lễ hội, phong tục, ẩm thực và đời sống Trung Hoa.",
    intro:
      "Hiểu văn hóa giúp dùng ngôn ngữ đúng ngữ cảnh. Chuyên mục tập hợp bài viết về lễ hội, phong tục, ẩm thực, vùng miền và đời sống Trung Quốc đương đại.",
    content: [
      "Lễ hội truyền thống và ý nghĩa đằng sau mỗi phong tục.",
      "Ẩm thực theo vùng miền.",
      "Khác biệt văn hóa cần lưu ý khi giao tiếp và làm việc.",
    ],
  },
  {
    slug: "thanh-ngu",
    title: "Thành ngữ tiếng Trung Quốc",
    summary: "Thành ngữ (成语) thông dụng kèm điển tích và cách dùng.",
    intro:
      "Thành ngữ bốn chữ là phần không thể thiếu nếu muốn nói và viết tự nhiên. Mỗi mục gồm nghĩa đen, nghĩa bóng, điển tích và ví dụ dùng trong câu.",
    content: [
      "Thành ngữ thông dụng nhất trong giao tiếp và trong đề HSK.",
      "Điển tích ngắn gọn giúp nhớ lâu.",
      "Ví dụ đặt câu theo ngữ cảnh thực tế.",
    ],
  },
  {
    slug: "quan-dung-ngu",
    title: "Quán dụng ngữ tiếng Trung Quốc",
    summary: "Quán dụng ngữ (惯用语) — cách nói đời thường của người bản ngữ.",
    intro:
      "Quán dụng ngữ là những cụm nói quen thuộc trong đời sống, không dịch theo nghĩa đen được. Nắm được nhóm này, cách nói của bạn sẽ tự nhiên hơn hẳn.",
    content: [
      "Các cụm quán dụng ngữ thường gặp trong hội thoại hằng ngày.",
      "Sắc thái và tình huống nên dùng.",
      "Ví dụ hội thoại minh họa.",
    ],
  },
  {
    slug: "yet-hau-ngu",
    title: "Yết hậu ngữ tiếng Trung Quốc",
    summary: "Yết hậu ngữ (歇后语) — lối nói hai vế dí dỏm của người Trung Quốc.",
    intro:
      "Yết hậu ngữ gồm hai vế: vế đầu là hình ảnh ví von, vế sau mới là ý muốn nói. Đây là nét thú vị rất riêng trong tiếng Trung.",
    content: [
      "Yết hậu ngữ thông dụng, giải nghĩa từng vế.",
      "Bối cảnh nên dùng và sắc thái hài hước.",
      "Ví dụ trong hội thoại.",
    ],
  },
  {
    slug: "cau-chuyen-han-tu",
    title: "Câu chuyện Hán tự",
    summary: "Nguồn gốc chữ Hán — nhớ mặt chữ bằng câu chuyện.",
    intro:
      "Mỗi chữ Hán đều có lịch sử hình thành. Hiểu chữ tượng hình, bộ thủ và cách ghép chữ giúp nhớ mặt chữ nhanh hơn nhiều so với chép tay hàng chục lần.",
    content: [
      "Chữ tượng hình và quá trình biến đổi qua các thời kỳ.",
      "214 bộ thủ và ý nghĩa từng bộ.",
      "Cách suy đoán nghĩa của chữ mới dựa vào bộ thủ.",
    ],
  },
  {
    slug: "tai-lieu-ngu-phap",
    title: "Tài liệu ngữ pháp tiếng Trung Quốc",
    summary: "Tài liệu ngữ pháp hệ thống, tải về và ôn theo cấp độ.",
    intro:
      "Kho tài liệu ngữ pháp được hệ thống theo cấp độ, dùng kèm khi ôn thi HSK hoặc khi cần tra nhanh một cấu trúc.",
    content: [
      "Bảng tổng hợp ngữ pháp theo từng cấp HSK.",
      "Chuyên đề riêng cho các cấu trúc khó: bổ ngữ, 把, 被, so sánh.",
      "Bài tập kèm đáp án.",
    ],
  },
  {
    slug: "cau-do",
    title: "Câu đố",
    summary: "Câu đố tiếng Trung — học từ vựng theo cách nhẹ nhàng.",
    intro:
      "Câu đố chữ Hán và câu đố dân gian giúp ôn từ vựng theo cách vui, đặc biệt hợp với lớp thiếu nhi và các buổi sinh hoạt trên lớp.",
    content: [
      "Câu đố chữ Hán (字谜) và cách giải.",
      "Câu đố dân gian theo chủ đề.",
      "Gợi ý dùng câu đố khi học nhóm.",
    ],
  },
  {
    slug: "truyen-cuoi",
    title: "Truyện cười",
    summary: "Truyện cười tiếng Trung song ngữ — luyện đọc không áp lực.",
    intro:
      "Truyện cười ngắn song ngữ là cách luyện đọc nhẹ nhàng, đồng thời cho thấy khiếu hài hước và lối chơi chữ của người Trung Quốc.",
    content: [
      "Truyện cười ngắn kèm phiên âm và bản dịch.",
      "Giải thích chỗ chơi chữ để hiểu vì sao buồn cười.",
      "Từ vựng đáng chú ý trong mỗi truyện.",
    ],
  },
  {
    slug: "kien-thuc-tu-vung",
    title: "Kiến thức từ vựng",
    summary: "Mẹo học từ, phân biệt từ gần nghĩa và cách ghi nhớ lâu.",
    intro:
      "Chuyên mục chia sẻ phương pháp học từ vựng hiệu quả: học theo cụm, theo bộ thủ, theo tần suất và cách ôn lại đúng thời điểm để không quên.",
    content: [
      "Phân biệt các cặp từ gần nghĩa hay nhầm.",
      "Học từ theo bộ thủ và theo họ từ.",
      "Lịch ôn lại từ vựng theo phương pháp lặp lại ngắt quãng.",
    ],
  },
  {
    slug: "kien-thuc-ngu-phap",
    title: "Kiến thức ngữ pháp",
    summary: "Bài viết giải thích từng điểm ngữ pháp kèm ví dụ.",
    intro:
      "Mỗi bài viết đi sâu vào một điểm ngữ pháp: cấu trúc, cách dùng, lỗi sai thường gặp của người Việt và bài tập vận dụng ngắn.",
    content: [
      "Giải thích cấu trúc kèm nhiều ví dụ.",
      "Lỗi sai phổ biến và cách sửa.",
      "Bài tập ngắn cuối mỗi bài.",
    ],
  },
  {
    slug: "tieng-trung-chuyen-nganh",
    title: "Tiếng Trung chuyên ngành",
    summary: "Thuật ngữ theo ngành: thương mại, logistics, du lịch, kỹ thuật, y tế.",
    intro:
      "Tổng hợp thuật ngữ và mẫu câu theo từng ngành nghề, dùng được ngay cho người đi làm hoặc học viên chuẩn bị vào môi trường tiếng Trung chuyên nghiệp.",
    content: [
      "Bảng thuật ngữ theo ngành.",
      "Mẫu câu và tình huống nghề nghiệp thường gặp.",
      "Tài liệu tham khảo mở rộng.",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Tra cứu nhanh
 * ------------------------------------------------------------------ */

/** Tất cả khóa học thuộc mục "Các khóa học Offline và Online". */
export const onlineOfflineCourses: CatalogItem[] = [
  ...hskCourses,
  ...hskExamCourses,
  ...specialCourses,
];

export const findCourse = (slug: string) =>
  onlineOfflineCourses.find((c) => c.slug === slug);
export const findTextbookCourse = (slug: string) =>
  textbookCourses.find((c) => c.slug === slug);
export const findReviewLevel = (slug: string) =>
  reviewLevels.find((c) => c.slug === slug);
export const findExamPrep = (slug: string) =>
  examPrepResources.find((c) => c.slug === slug);
export const findSkill = (slug: string) => skillTracks.find((c) => c.slug === slug);
export const findTrial = (slug: string) => trialClasses.find((c) => c.slug === slug);
export const findLibrary = (slug: string) => library.find((c) => c.slug === slug);
