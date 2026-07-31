
export type CatalogItem = {
  slug: string;
  title: string;

  summary: string;

  intro: string;

  facts: { label: string; value: string }[];

  content: string[];

  outcomes: string[];

  audience?: string[];

  /** Điểm ngữ pháp tiêu biểu của cấp độ, kèm tổng số điểm học trong khoá. */
  grammar?: { count: number; points: string[] };

  /** Chủ đề giao tiếp (cấp thấp) hoặc lĩnh vực đọc hiểu (cấp cao). */
  topics?: { title: string; note?: string; items: string[] };
};

const LIEN_HE = "Liên hệ trung tâm";

/**
 * Lộ trình từng cấp HSK theo giáo trình thực tế của trung tâm (chuẩn HSK 3.0):
 * thời lượng, số từ vựng, số điểm ngữ pháp và chủ đề giao tiếp của mỗi khoá.
 */
const HSK_LEVELS = [
  {
    level: 1,
    months: "2,5 tháng",
    words: "300 từ",
    chars: "300 chữ Hán",
    grammarCount: 26,
    grammar: [
      "Câu động từ 是, 有",
      "Trợ từ 的、吗、呢",
      "Phó từ 也",
      "Đại từ nghi vấn 谁、什么、几、多少、哪",
      "Cấu trúc biểu đạt số lượng",
      "Biểu đạt thời gian",
      "Phương vị từ",
      "Câu hỏi lựa chọn 还是",
      "Câu hỏi chính phản",
      "Câu liên động",
      "Giới từ 在、跟、给",
      "Liên từ 或者",
    ],
    topics: {
      title: "13 chủ đề giao tiếp cơ bản",
      note: "Một số chủ đề tiêu biểu trong khoá:",
      items: [
        "Chào hỏi – làm quen",
        "Giới thiệu bản thân & gia đình",
        "Trường lớp",
        "Ngày tháng – thời gian",
        "Miêu tả vị trí, phòng ở",
        "Ăn uống",
        "Mua sắm",
        "Phương tiện giao thông",
        "Đi chơi",
        "Sinh hoạt hằng ngày",
      ],
    },
    // Chỉ HSK1 có phần vỡ lòng phát âm và bút thuận.
    foundation: [
      "Phát âm chuẩn theo hệ thống phiên âm.",
      "Biết quy tắc viết chữ Hán và viết đúng các chữ cơ bản.",
    ],
    can: "giới thiệu bản thân, thực hiện hội thoại ngắn trong đời sống hằng ngày, đọc hiểu và viết được các mẫu câu cơ bản",
    entry: "Người chưa từng học tiếng Trung, hoặc người mất gốc muốn học lại từ đầu",
    outcomes: [
      "Hoàn thành năng lực HSK1 theo tiêu chuẩn HSK 3.0.",
      "Giới thiệu được bản thân bằng tiếng Trung.",
      "Thực hiện các cuộc hội thoại ngắn trong đời sống hằng ngày.",
      "Đọc hiểu và viết được các mẫu câu cơ bản.",
    ],
  },
  {
    level: 2,
    months: "2,5 tháng",
    words: "500 từ",
    chars: "600 chữ Hán",
    grammarCount: 60,
    grammar: [
      "Trợ động từ 想、要、能",
      "Giới từ 从、往、对",
      "Tiền tố 第",
      "Cấu trúc 在……呢 biểu thị hành động đang diễn ra",
      "Cấu trúc 先……然后……",
      "Câu so sánh với 比",
      "Câu so sánh bằng",
      "Câu so sánh kém",
      "Cấu trúc 要……了 biểu thị hành động sắp xảy ra",
      "Bổ ngữ trạng thái",
    ],
    topics: {
      title: "15 chủ đề giao tiếp quen thuộc",
      note: "Một số chủ đề tiêu biểu trong khoá:",
      items: [
        "Đi xem phim",
        "Giới thiệu thời khoá biểu",
        "Thể thao",
        "Giới thiệu kỹ năng",
        "Miêu tả thời tiết",
        "Mua quần áo",
        "Giới thiệu thành phố",
        "Đi khám bệnh",
        "Gọi món tại nhà hàng",
        "Hỏi đường, di chuyển",
        "Du lịch",
      ],
    },
    can: "giao tiếp trong hầu hết tình huống quen thuộc hằng ngày, trao đổi thông tin và diễn đạt nhu cầu, ý kiến đơn giản",
    entry: "Đã hoàn thành khoá HSK1",
    outcomes: [
      "Hoàn thành trình độ HSK2 theo tiêu chuẩn HSK 3.0.",
      "Giao tiếp được trong hầu hết các tình huống quen thuộc của cuộc sống hằng ngày.",
      "Hiểu và dùng các mẫu câu phổ biến để trao đổi thông tin, diễn đạt nhu cầu và ý kiến đơn giản.",
      "Đọc hiểu đoạn hội thoại, văn bản ngắn và viết được đoạn văn cơ bản theo chủ đề.",
    ],
  },
  {
    level: 3,
    months: "4,5 tháng",
    words: "1.000 từ",
    chars: "900 chữ Hán",
    grammarCount: 130,
    grammar: [
      "Trợ từ ngữ khí 了",
      "Trợ từ kết cấu 了",
      "Phó từ 还是",
      "Câu chữ 把",
      "Câu bị động",
      "Bổ ngữ thời lượng",
      "Bổ ngữ kết quả",
      "Bổ ngữ động lượng",
      "Bổ ngữ xu hướng",
      "Phó từ 又 / 再",
      "Phó từ 才 / 就",
    ],
    topics: {
      title: "18 chủ đề giao tiếp thực tế",
      note: "Một số chủ đề tiêu biểu trong khoá:",
      items: [
        "Lên kế hoạch đi du lịch",
        "Mua sắm tại trung tâm thương mại (đổi size, trả hàng)",
        "Thuê nhà",
        "Gọi món tại nhà hàng",
        "Nói về thói quen hằng ngày",
        "Nói về việc đi thi HSK",
        "Mua vé máy bay",
        "Tổ chức sinh nhật",
        "Đến nhà người Trung Quốc làm khách",
        "Tham gia hội thao",
        "Đi bệnh viện thăm bạn",
      ],
    },
    can: "giao tiếp tương đối lưu loát trong học tập, công việc và các tình huống quen thuộc, tham gia hội thoại ở tốc độ tự nhiên",
    entry: "Đã hoàn thành khoá HSK2 hoặc đạt trình độ tương đương",
    outcomes: [
      "Hoàn thành năng lực HSK3 theo tiêu chuẩn HSK 3.0.",
      "Giao tiếp tương đối lưu loát trong học tập, công việc và các tình huống quen thuộc.",
      "Hiểu và tham gia hội thoại tốc độ tự nhiên về những chủ đề gần gũi.",
      "Đọc hiểu đoạn văn ngắn, thông báo, bài viết đơn giản và viết được đoạn văn theo chủ đề.",
    ],
  },
  {
    level: 4,
    months: "3,5 tháng",
    words: "2.000 từ",
    chars: "1.200 chữ Hán",
    grammarCount: 215,
    grammar: [
      "Trợ từ kết cấu 地",
      "Phó từ 却",
      "Trợ từ 来",
      "Phó từ 竟然",
      "Cấu trúc 又……又……",
      "Cấu trúc 要么……要么……",
      "Cấu trúc 别看……（可是/但是）……",
      "Cấu trúc 连……带……",
      "Cấu trúc ……，再说……",
      "Cấu trúc 一点儿……（也/都）不（没）……",
      "Cấu trúc 之所以……是因为……",
    ],
    topics: {
      title: "Năng lực đọc hiểu và trình bày quan điểm",
      note: "Sau khoá học, học viên đọc hiểu, phân tích và trình bày quan điểm về các dạng văn bản:",
      items: [
        "Văn hoá và lịch sử Trung Quốc",
        "Danh nhân và các câu chuyện truyền cảm hứng",
        "Xã hội, môi trường và đời sống",
        "Học tập và công việc",
        "Tin tức và văn bản thông dụng",
      ],
    },
    can: "đọc hiểu bài viết độ dài trung bình, trình bày quan điểm mạch lạc và dùng tiếng Trung trong học tập, công việc",
    entry: "Đã hoàn thành khoá HSK3 hoặc đạt trình độ tương đương",
    outcomes: [
      "Hoàn thành năng lực HSK4 theo tiêu chuẩn HSK 3.0.",
      "Đọc hiểu được các bài viết có độ dài trung bình về nhiều chủ đề khác nhau.",
      "Trình bày quan điểm và diễn đạt ý kiến tương đối mạch lạc bằng tiếng Trung.",
      "Sử dụng tiếng Trung trong học tập và công việc.",
    ],
  },
  {
    level: 5,
    months: "3,5 tháng",
    words: "3.600 từ",
    chars: "1.500 chữ Hán",
    grammarCount: 350,
    grammar: [
      "Tính từ dạng ABB",
      "毫不",
      "幸亏",
      "几乎",
      "竟然",
      "不禁",
      "Cấu trúc 所谓……，是指……",
      "Cấu trúc A里AB",
      "Cấu trúc 非……不可",
      "Cấu trúc 别说……就连……",
      "Cấu trúc 各 V 各的……",
    ],
    topics: {
      title: "Năng lực đọc hiểu, phân tích và đánh giá",
      note: "Xử lý văn bản độ dài trung bình đến dài thuộc nhiều lĩnh vực:",
      items: [
        "Văn hoá, lịch sử, kinh tế và xã hội Trung Quốc",
        "Môi trường, tài nguyên, năng lượng và phát triển bền vững",
        "Gia đình, hôn nhân và các mối quan hệ xã hội",
        "Học tập, công việc, kinh tế và đời sống hiện đại",
        "Bài báo, bài bình luận, bài nghị luận và văn bản học thuật phổ thông",
      ],
    },
    can: "đọc hiểu văn bản phổ thông và học thuật, phân tích – tổng hợp thông tin và trình bày quan điểm logic",
    entry: "Đã hoàn thành khoá HSK4 hoặc đạt trình độ tương đương",
    outcomes: [
      "Hoàn thành năng lực HSK5 theo tiêu chuẩn HSK 3.0.",
      "Đọc hiểu các văn bản phổ thông và các bài viết có nội dung học thuật.",
      "Phân tích, tổng hợp thông tin và trình bày quan điểm rõ ràng, logic về nhiều chủ đề.",
      "Sử dụng tiếng Trung thành thạo trong học tập, công việc và giao tiếp với người bản ngữ.",
    ],
  },
  {
    level: 6,
    months: "3,5 tháng",
    words: "5.400 từ",
    chars: "1.800 chữ Hán",
    grammarCount: 450,
    grammar: [
      "Phó từ 再三、一再、一向、迟早、万万",
      "Cấu trúc 既……又……",
      "Cấu trúc ……来……去",
      "Cấu trúc 为……所……",
      "Cấu trúc 不要说……",
      "Cấu trúc 这样一来，……",
    ],
    topics: {
      title: "Năng lực xử lý văn bản chuyên sâu",
      note: "Đọc hiểu, phân tích, tổng hợp và trình bày quan điểm về nội dung chuyên sâu:",
      items: [
        "Văn hoá, lịch sử, kinh tế và xã hội Trung Quốc",
        "Môi trường, tài nguyên, năng lượng và phát triển bền vững",
        "Giáo dục, gia đình, hôn nhân và các mối quan hệ xã hội",
        "Kinh tế, quản lý, công nghệ, học tập và công việc",
        "Bài báo, bài nghiên cứu, văn bản học thuật và tác phẩm văn học hiện đại",
        "Viết bài nghị luận, báo cáo, bài phân tích với lập luận rõ ràng, logic",
      ],
    },
    can: "xử lý văn bản học thuật, chuyên ngành và tác phẩm văn học khó, trình bày quan điểm mạch lạc và thuyết phục",
    entry: "Đã hoàn thành khoá HSK5 hoặc đạt trình độ tương đương",
    outcomes: [
      "Hoàn thành năng lực HSK6 theo tiêu chuẩn HSK 3.0.",
      "Đọc hiểu và xử lý hiệu quả văn bản học thuật, chuyên ngành và tác phẩm văn học có độ khó cao.",
      "Phân tích, tổng hợp và đánh giá thông tin từ nhiều nguồn; trình bày quan điểm mạch lạc, thuyết phục.",
      "Sử dụng tiếng Trung thành thạo trong học tập, nghiên cứu, công việc ở nhiều bối cảnh.",
    ],
  },
] as const;

export const hskCourses: CatalogItem[] = HSK_LEVELS.map((l) => ({
  slug: `hsk-${l.level}`,
  title: `HSK${l.level}`,
  summary: `Khoá HSK${l.level} chuẩn HSK 3.0 — ${l.months}, ${l.words}, ${l.grammarCount} điểm ngữ pháp.`,
  intro: `Khoá HSK${l.level} kéo dài ${l.months}, bám sát chuẩn HSK 3.0 và rèn song song bốn kỹ năng nghe – nói – đọc – viết. Học viên nắm ${l.words} cùng ${l.grammarCount} điểm ngữ pháp của cấp độ để ${l.can}.`,
  facts: [
    { label: "Cấp độ", value: `HSK${l.level} (chuẩn HSK 3.0)` },
    { label: "Thời lượng", value: l.months },
    { label: "Từ vựng mục tiêu", value: l.words },
    { label: "Điểm ngữ pháp", value: `${l.grammarCount} điểm` },
    { label: "Đầu vào", value: l.entry },
    { label: "Khai giảng · học phí", value: LIEN_HE },
  ],
  content: [
    ...("foundation" in l ? l.foundation : []),
    `Từ vựng cấp HSK${l.level}: ${l.words} theo chuẩn HSK 3.0, học theo chủ điểm gắn với tình huống thực tế.`,
    `Hệ thống ${l.grammarCount} điểm ngữ pháp của cấp độ, có bảng tổng hợp và bài tập vận dụng sau mỗi chủ điểm.`,
    "Luyện nghe – nói theo tình huống, sửa phát âm và thanh điệu trực tiếp trên lớp.",
    "Luyện đọc hiểu và viết theo dạng bài của đề thi HSK.",
    "Kiểm tra định kỳ, thi thử cuối khóa và nhận xét riêng cho từng học viên.",
  ],
  grammar: { count: l.grammarCount, points: [...l.grammar] },
  topics: {
    title: l.topics.title,
    ...("note" in l.topics ? { note: l.topics.note } : {}),
    items: [...l.topics.items],
  },
  outcomes: [
    ...l.outcomes,
    `Đủ nền tảng để thi HSK${l.level} hoặc học tiếp cấp HSK${Math.min(l.level + 1, 6)}.`,
  ],
  audience: [
    l.entry + ".",
    "Người cần chứng chỉ HSK để du học, xin việc hoặc thăng tiến trong công việc.",
    "Người muốn học tiếng Trung theo lộ trình rõ ràng thay vì học rời rạc.",
  ],
}));

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

/**
 * Tiêu đề là "Tài liệu luyện thi HSKn", không phải "Luyện thi HSKn", để tách khỏi
 * trang lớp học /courses/luyen-thi-hsk-n. Hai trang trước đây trùng cả H1 lẫn title
 * nên tự cạnh tranh nhau trên cùng một truy vấn: trang này nhắm nhu cầu tra tài
 * liệu, trang kia nhắm nhu cầu tìm lớp.
 */
export const examPrepResources: CatalogItem[] = [3, 4, 5, 6].map((level) => ({
  slug: `hsk-${level}`,
  title: `Tài liệu luyện thi HSK${level}`,
  summary: `Bảng từ vựng, ngữ pháp trọng tâm và bộ đề luyện cấp HSK${level}.`,
  intro: `Tổng hợp tài liệu ôn thi HSK${level}: bảng từ vựng đầy đủ, ngữ pháp trọng tâm và bộ đề luyện có đáp án. Dùng để tự ôn miễn phí trước kỳ thi.`,
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

export { getLibrary, findLibrary } from "./library";

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
