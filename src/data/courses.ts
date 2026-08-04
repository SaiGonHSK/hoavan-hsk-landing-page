import { HSK_LEVELS } from "./catalog";

export type CourseLevel = {

  name: string;

  code?: string;
  audience: string[];
  goals: string[];
  duration: string[];
  content: string[];
  materials: string[];
  outcomes: string[];
};

export type Course = {
  slug: string;
  title: string;

  summary: string;

  image?: string;

  goal: string;

  entry: string;
  icon: "hsk" | "seed" | "growth" | "peak" | "chat" | "briefcase" | "vip" | "kids" | "senior";

  featured?: boolean;

  tags: string[];
  levels: CourseLevel[];

  contactOnly?: boolean;
  note?: string;
};

const STANDARD_MATERIALS = [
  "Sử dụng các giáo trình chuyên biệt được các giảng viên trình độ Tiến sĩ của Trung tâm biên soạn lại.",
  "Phát triển toàn diện, hội tụ được 4 kỹ năng nghe – nói – đọc – viết.",
  "Không chỉ học ngôn ngữ, học viên còn được tiếp xúc với văn hóa Trung Quốc.",
  "Đưa cuộc sống thực tế vào việc học ngoại ngữ, giúp người học vận dụng được kiến thức đã học.",
];

const HSK_MATERIALS = [
  "Chương trình ôn luyện được thiết kế bởi các giáo viên trình độ Thạc sĩ, Tiến sĩ.",
  "Sử dụng tài liệu ôn thi uy tín từ HanBan.",
];

/**
 * Các khoá theo cấp (Sơ cấp / Trung cấp / Cao cấp) là cùng một lộ trình HSK với
 * các trang /courses/hsk-N, chỉ gom lại theo nhóm cấp độ. Lấy chung dữ liệu từ
 * HSK_LEVELS để hai nơi không mô tả lệch nhau như trước.
 */
const hskLevel = (level: number): CourseLevel => {
  const l = HSK_LEVELS.find((x) => x.level === level)!;
  // Chỉ HSK1 có phần vỡ lòng phát âm và bút thuận.
  const foundation = "foundation" in l ? [...l.foundation] : [];

  return {
    name: `Lớp HSK${l.level}`,
    code: `HSK${l.level}`,
    audience: [
      `${l.entry}.`,
      "Người cần chứng chỉ HSK để du học, xin việc hoặc thăng tiến trong công việc.",
      "Người muốn học đủ 4 kỹ năng nghe – nói – đọc – viết theo lộ trình rõ ràng.",
    ],
    goals: [
      ...foundation,
      `Nắm vững ${l.words} vựng HSK${l.level} theo tiêu chuẩn HSK 3.0.`,
      `Thành thạo ${l.grammarCount} điểm ngữ pháp của cấp HSK${l.level}.`,
      `Có thể ${l.can}.`,
    ],
    // Nhịp học khác nhau giữa các lớp cùng cấp (3 buổi/tuần hoặc 2 buổi/tuần) nên
    // chỉ nêu tổng thời lượng; số buổi cụ thể xem ở lịch khai giảng.
    duration: [
      // Từ HSK4 trở lên, cấp độ được dạy thành 2 lớp nối tiếp nên months là thời
      // lượng của một lớp, phải ghi rõ kẻo hiểu nhầm cả cấp chỉ 3,5 tháng.
      l.level >= 4
        ? `2 lớp HSK${l.level}.1 và HSK${l.level}.2, mỗi lớp ${l.months} · lớp tối 3 buổi/tuần hoặc 2 buổi/tuần tuỳ ca, xem lịch khai giảng.`
        : `${l.months} · lớp tối 3 buổi/tuần hoặc 2 buổi/tuần tuỳ ca, xem lịch khai giảng.`,
    ],
    content: [
      ...foundation,
      `Từ vựng: ${l.words} của cấp HSK${l.level} theo chuẩn HSK 3.0, học theo chủ điểm gắn với tình huống thực tế.`,
      `Ngữ pháp: ${l.grammarCount} điểm của cấp độ — ${l.grammar.slice(0, 4).join("; ")}…`,
      `${l.topics.title}: ${l.topics.items.slice(0, 6).join("; ")}…`,
      "Luyện nghe – nói theo tình huống, sửa phát âm và thanh điệu trực tiếp trên lớp.",
      "Kiểm tra định kỳ, thi thử cuối khoá và nhận xét riêng cho từng học viên.",
    ],
    materials: STANDARD_MATERIALS,
    outcomes: [...l.outcomes],
  };
};

export const courses: Course[] = [
  {
    slug: "luyen-thi-hsk",
    image: "/images/courses/luyen-thi-hsk.png",
    title: "Luyện thi HSK",
    summary: "Cam kết đầu ra 100% đậu HSK3, HSK4, HSK5.",
    goal: "Đậu HSK3 – HSK5",
    entry: "Từ trình độ HSK2 trở lên",
    icon: "hsk",
    featured: true,
    tags: ["3 khóa học", "Chuẩn HSK 3.0", "Cam kết đầu ra"],
    // Mỗi cấp chỉ còn một lớp luyện thi: HSK3 2 tháng, HSK4 3 tháng, HSK5 4 tháng.
    levels: [
      {
        name: "Luyện thi HSK3",
        code: "HSK3",
        audience: [
          "Người học có trình độ tương đương lớp HSK2 tại trung tâm, hoặc đã học xong 3 quyển bộ Giáo trình Hán ngữ, hoặc có vốn từ vựng khoảng 600 từ.",
          "Đã nắm được các điểm ngữ pháp cơ bản và cần luyện đề trước kỳ thi.",
        ],
        goals: ["Đậu HSK3."],
        duration: ["24 buổi, 48 giờ học, 2h/buổi, 3 buổi/tuần (2 tháng)."],
        content: [
          "Ôn luyện toàn bộ hệ thống ngữ pháp tiếng Hán giai đoạn sơ cấp theo phạm vi đề HSK3.",
          "Tổng hợp – củng cố ngữ pháp từ, ngữ pháp ngữ, ngữ pháp câu và phân biệt từ đơn giản.",
          "Học chính 3 kỹ năng nghe – đọc – viết, kết hợp thi thử miễn phí đầu/cuối khóa cùng các buổi phụ đạo, tổng kết theo tình hình từng lớp.",
        ],
        materials: HSK_MATERIALS,
        outcomes: [
          "Nắm vững đầy đủ kỹ năng làm bài, từ vựng và cấu trúc ngữ pháp cần thiết cho kỳ thi HSK3.",
          "Đảm bảo đầu ra 100% đậu HSK3.",
        ],
      },
      {
        name: "Luyện thi HSK4",
        code: "HSK4",
        audience: [
          "Người học có trình độ tương đương lớp HSK3 tại trung tâm, hoặc đã học xong 4 quyển bộ Giáo trình Hán ngữ, hoặc đã học xong giáo trình sơ cấp Boya 2, hoặc có vốn từ vựng khoảng 800–900 từ.",
          "Đã hoàn toàn nắm được các điểm ngữ pháp cơ bản.",
        ],
        goals: ["Đậu HSK4."],
        duration: ["36 buổi, 72 giờ học, 2h/buổi, 3 buổi/tuần (3 tháng)."],
        content: [
          "Ôn luyện toàn bộ hệ thống ngữ pháp tiếng Hán giai đoạn cuối sơ cấp, hỗ trợ kiến thức và đề ôn luyện thi Đại học khối D4.",
          "Tổng hợp – củng cố ngữ pháp từ, ngữ pháp ngữ, ngữ pháp câu và phân biệt từ đơn giản.",
          "Học chính 3 kỹ năng nghe – đọc – viết, kết hợp thi thử miễn phí đầu/cuối khóa cùng các buổi phụ đạo, tổng kết theo tình hình từng lớp.",
        ],
        materials: HSK_MATERIALS,
        outcomes: [
          "Nắm vững đầy đủ kỹ năng làm bài, từ vựng và cấu trúc ngữ pháp cơ bản cho kỳ thi HSK4.",
          "Đảm bảo đầu ra 100% đậu HSK4.",
        ],
      },
      {
        name: "Luyện thi HSK5",
        code: "HSK5",
        audience: [
          "Học viên đã học xong lớp HSK4 tại trung tâm, hoặc đã học xong 6 quyển bộ Giáo trình Hán ngữ, hoặc đã học xong quyển trung cấp Boya 2, hoặc có vốn từ vựng hơn 1.500 từ.",
          "Nắm vững và vận dụng được tất cả điểm ngữ pháp cơ bản và một số điểm ngữ pháp nâng cao ở trình độ trung cấp.",
          "Sinh viên năm 2 các trường đại học chuyên ngữ.",
        ],
        goals: ["Đậu HSK5."],
        duration: ["45 buổi++, 2h/buổi, 3 buổi/tuần (4 tháng)."],
        content: [
          "Ôn luyện toàn bộ hệ thống ngữ pháp tiếng Hán giai đoạn trung cấp, hỗ trợ kiến thức và đề ôn luyện thi Đại học khối D4.",
          "Tổng hợp – củng cố ngữ pháp từ, ngữ pháp ngữ, ngữ pháp câu và phân biệt từ trung cấp.",
          "Học chính 3 kỹ năng nghe – đọc – viết, kết hợp thi thử miễn phí đầu/cuối khóa cùng các buổi phụ đạo, tổng kết theo tình hình từng lớp.",
        ],
        materials: HSK_MATERIALS,
        outcomes: [
          "Nắm vững đầy đủ kỹ năng làm bài, từ vựng và cấu trúc ngữ pháp cần thiết cho kỳ thi HSK5.",
          "Đảm bảo đầu ra 100% đậu HSK5.",
        ],
      },
    ],
  },
  {
    slug: "tieng-hoa-so-cap",
    image: "/images/courses/tieng-hoa-so-cap.png",
    title: "Tiếng Trung Sơ cấp",
    summary: "Từ con số 0 đến HSK3: phát âm, chữ Hán và 4 kỹ năng.",
    goal: "HSK1 → HSK3",
    entry: "Bắt đầu từ con số 0",
    icon: "seed",
    featured: true,
    tags: ["3 lớp: HSK1 – HSK3", "Chuẩn HSK 3.0", "4 kỹ năng"],
    levels: [hskLevel(1), hskLevel(2), hskLevel(3)],
  },
  {
    slug: "tieng-hoa-trung-cap",
    image: "/images/courses/tieng-hoa-trung-cap.png",
    title: "Tiếng Trung Trung cấp",
    summary: "Mở rộng lên 3.600 từ, đạt năng lực HSK4 và HSK5.",
    goal: "HSK4 → HSK5",
    entry: "Đã hoàn thành HSK3 hoặc tương đương",
    icon: "growth",
    featured: true,
    tags: ["2 lớp: HSK4 – HSK5", "Chuẩn HSK 3.0", "Đọc hiểu – nghị luận"],
    // Mỗi cấp chia thành hai chặng (HSK4.1/4.2, HSK5.1/5.2) trên lịch khai giảng.
    note: "Từ HSK4 trở lên, mỗi cấp bao gồm 2 lớp (ví dụ HSK4.1 và HSK4.2), mỗi lớp 3,5 tháng.",
    levels: [hskLevel(4), hskLevel(5)],
  },
  {
    slug: "tieng-hoa-cao-cap",
    image: "/images/courses/tieng-hoa-cao-cap.png",
    title: "Tiếng Trung Cao cấp",
    summary: "Nắm 5.400 từ, xử lý văn bản học thuật và chuyên ngành.",
    goal: "Hướng tới HSK6",
    entry: "Đã hoàn thành HSK5 hoặc tương đương",
    icon: "peak",
    tags: ["Lớp HSK6", "Chuẩn HSK 3.0", "Học thuật – chuyên ngành"],
    note: "Khoá HSK6 bao gồm 2 lớp HSK6.1 và HSK6.2, mỗi lớp 3,5 tháng. Vui lòng liên hệ trung tâm để nhận lộ trình chi tiết.",
    levels: [hskLevel(6)],
  },
  {
    slug: "tieng-hoa-giao-tiep-cap-toc",
    image: "/images/courses/tieng-hoa-giao-tiep-cap-toc.png",
    title: "Tiếng Trung Giao tiếp Cấp tốc",
    summary: "Nói được tiếng Trung trong 3 tháng, không nặng viết chữ Hán.",
    goal: "Giao tiếp cấp tốc",
    entry: "Người mới bắt đầu",
    icon: "chat",
    featured: true,
    tags: ["2 khóa học", "3 tháng/khóa", "Tình huống thực tế"],
    levels: [
      {
        name: "Giao tiếp Cấp tốc 1",
        code: "GT1",
        audience: [
          "Người mới bắt đầu học tiếng Trung hoặc muốn học lại từ đầu.",
          "Người yêu thích tiếng Trung nhưng không có nhiều thời gian tập viết chữ Hán.",
          "Người cần giao tiếp, giao dịch với người Trung Quốc, Đài Loan trong thời gian ngắn một cách tự tin.",
          "Người yêu thích văn hóa Trung Hoa, muốn học để tự tìm hiểu, khám phá.",
        ],
        goals: ["Giao tiếp tiếng Trung cấp tốc."],
        duration: ["36 buổi, 72 tiết, 1,5h/buổi, 3 buổi/tuần (3 tháng)."],
        content: [
          "Phiên âm tiếng Trung.",
          "Các mẫu câu giao tiếp cơ bản.",
          "Tình huống giao tiếp thường gặp: chào hỏi, hỏi giờ, làm quen, đi đến trường, mua trái cây, hỏi ngày tháng, sinh nhật, đi nhà sách, hỏi và chỉ đường, gọi điện thoại, nói về sở thích, một ngày của bạn…",
        ],
        materials: [
          "Sử dụng giáo trình của Đại học Ngôn ngữ & Văn hóa Bắc Kinh, được các giảng viên trình độ Tiến sĩ của Trung tâm biên soạn lại.",
          ...STANDARD_MATERIALS.slice(1),
        ],
        outcomes: [
          "Nắm 200–300 từ vựng sau khóa học.",
          "Đạt trình độ Hán ngữ sơ cấp: hiểu và sử dụng được cụm từ, câu đơn giản để giao tiếp cơ bản và có khả năng học tiếp các khóa sau.",
        ],
      },
      {
        name: "Giao tiếp Cấp tốc 2",
        code: "GT2",
        audience: [
          "Người đã học xong lớp GT1, có vốn từ vựng trên 300 từ.",
          "Người có nhu cầu học tiếng Trung giao tiếp nâng cao.",
          "Người yêu thích văn hóa Trung Hoa, muốn học để tự tìm hiểu, khám phá.",
        ],
        goals: ["Giao tiếp tiếng Trung cấp tốc ở mức nâng cao."],
        duration: ["36 buổi, 72 tiết, 1,5h/buổi, 3 buổi/tuần (3 tháng)."],
        content: [
          "Mở rộng các mẫu câu giao tiếp.",
          "Tình huống giao tiếp thường gặp: nói về thời tiết, thăm bạn bè, mời dự tiệc, đi bệnh viện khám bệnh, hỏi thăm khi bạn ốm, gọi điện trao đổi việc học/công việc, để lại lời nhắn, từ chối lời mời, gọi món ở quán ăn, đi du lịch, thuê nhà…",
        ],
        materials: [
          "Sử dụng giáo trình của Đại học Ngôn ngữ & Văn hóa Bắc Kinh, được các giảng viên trình độ Tiến sĩ của Trung tâm biên soạn lại.",
          ...STANDARD_MATERIALS.slice(1),
        ],
        outcomes: [
          "Nắm được 300–400 từ ngữ thường dùng nhất cùng kiến thức ngữ pháp liên quan; giao tiếp cơ bản được với người Trung Quốc.",
          "Thực hiện được các nhiệm vụ giao tiếp trong sinh hoạt, học tập, công việc và du lịch bằng tiếng Trung.",
        ],
      },
    ],
  },
  {
    slug: "tieng-hoa-doanh-nghiep",
    image: "/images/courses/tieng-hoa-doanh-nghiep.png",
    title: "Tiếng Trung Doanh nghiệp",
    summary: "Lớp tiếng Trung thiết kế riêng cho doanh nghiệp.",
    goal: "Tiếng Trung công việc",
    entry: "Theo khảo sát trình độ nhân sự",
    icon: "briefcase",
    tags: ["Đào tạo tại doanh nghiệp", "Giáo trình riêng"],
    contactOnly: true,
    note: "Chương trình được thiết kế theo đặc thù ngành và mục tiêu của từng doanh nghiệp: lịch học, địa điểm và giáo trình linh hoạt. Vui lòng liên hệ để nhận đề xuất đào tạo.",
    levels: [],
  },
  {
    slug: "tieng-hoa-vip",
    image: "/images/courses/tieng-hoa-vip.png",
    title: "Tiếng Trung VIP (1 kèm 1)",
    summary: "Lớp tiếng Trung thiết kế dành cho người bận rộn.",
    goal: "Lộ trình cá nhân hóa",
    entry: "Mọi trình độ",
    icon: "vip",
    featured: true,
    tags: ["1 kèm 1", "Lịch linh hoạt"],
    contactOnly: true,
    note: "Giảng viên xây dựng lộ trình riêng theo mục tiêu và thời gian biểu của học viên. Vui lòng liên hệ để được tư vấn và xếp lịch.",
    levels: [],
  },
  {
    slug: "tieng-hoa-thieu-nhi",
    title: "Tiếng Trung Thiếu nhi",
    summary: "Lớp tiếng Trung thiết kế dành cho thiếu nhi.",
    goal: "Nền tảng cho trẻ",
    entry: "Học sinh tiểu học – trung học",
    icon: "kids",
    tags: ["Học qua trò chơi", "Lớp nhỏ"],
    contactOnly: true,
    note: "Chương trình chú trọng phát âm, chữ Hán và phản xạ nói qua hoạt động sinh động phù hợp lứa tuổi. Vui lòng liên hệ để nhận thông tin lớp.",
    levels: [],
  },
  {
    slug: "tieng-hoa-nguoi-lon-tuoi",
    title: "Tiếng Trung cho người lớn tuổi",
    summary: "Nhịp học chậm, chú trọng nghe – nói.",
    goal: "Học nhẹ nhàng, dễ tiếp thu",
    entry: "Mọi trình độ",
    icon: "senior",
    tags: ["Nhịp học chậm", "Chú trọng giao tiếp"],
    contactOnly: true,
    note: "Lớp được thiết kế với nhịp độ phù hợp, ưu tiên nghe – nói và ứng dụng hằng ngày. Vui lòng liên hệ để được tư vấn.",
    levels: [],
  },
];

export const featuredCourses = courses.filter((c) => c.featured);

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export const roadmap = [
  {
    step: "01",
    code: "HSK1 – HSK3",
    title: "Sơ cấp",
    result: "HSK1 → HSK3",
    desc: "Phát âm, quy tắc viết chữ Hán, 1.000 từ vựng và 130 điểm ngữ pháp. Giao tiếp tương đối lưu loát các chủ đề thường ngày.",
  },
  {
    step: "02",
    code: "HSK4 – HSK5",
    title: "Trung cấp",
    result: "HSK4 → HSK5",
    desc: "Mở rộng lên 3.600 từ vựng và 350 điểm ngữ pháp, đọc hiểu và trình bày quan điểm về các chủ đề văn hoá – xã hội.",
  },
  {
    step: "03",
    code: "LT-HSK3 – LT-HSK5",
    title: "Luyện thi",
    result: "Cam kết 100% đậu",
    desc: "Lớp thường và lớp đặc biệt, ôn theo tài liệu HanBan, thi thử miễn phí đầu và cuối khóa.",
  },
  {
    step: "04",
    code: "HSK6",
    title: "Cao cấp",
    result: "Hướng tới HSK6",
    desc: "5.400 từ vựng và 450 điểm ngữ pháp, xử lý văn bản học thuật và chuyên ngành, sẵn sàng cho du học và môi trường làm việc chuyên nghiệp.",
  },
] as const;
