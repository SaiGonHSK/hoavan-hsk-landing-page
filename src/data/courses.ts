
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

export const courses: Course[] = [
  {
    slug: "luyen-thi-hsk",
    image: "/images/courses/luyen-thi-hsk.png",
    title: "Luyện thi HSK",
    summary: "Cam kết đầu ra 100% đậu HSK4, HSK5.",
    goal: "Đậu HSK4 – HSK5",
    entry: "Từ trình độ SC2/SC3 hoặc TC1/TC2",
    icon: "hsk",
    featured: true,
    tags: ["4 khóa học", "Chuẩn HSK 3.0", "Cam kết đầu ra"],
    levels: [
      {
        name: "Luyện HSK4 thường",
        code: "HSK4",
        audience: [
          "Người học có trình độ tương đương lớp SC3 tại trung tâm, hoặc đã học xong 4 quyển bộ Giáo trình Hán ngữ, hoặc đã học xong giáo trình sơ cấp Boya 2, hoặc có vốn từ vựng khoảng 800–900 từ.",
          "Đã hoàn toàn nắm được các điểm ngữ pháp cơ bản.",
        ],
        goals: ["Đậu HSK4."],
        duration: ["24 buổi, 48 giờ học, 2h/buổi, 3 buổi/tuần (khoảng 2 tháng)."],
        content: [
          "Ôn luyện toàn bộ hệ thống ngữ pháp tiếng Hán giai đoạn cuối sơ cấp, hỗ trợ kiến thức và đề ôn luyện thi Đại học khối D4.",
          "Tổng hợp – củng cố ngữ pháp từ, ngữ pháp ngữ, ngữ pháp câu và phân biệt từ đơn giản.",
        ],
        materials: HSK_MATERIALS,
        outcomes: [
          "Nắm vững đầy đủ kỹ năng làm bài, từ vựng và các cấu trúc ngữ pháp cơ bản cho kỳ thi HSK4.",
          "Đảm bảo đầu ra 100% đậu HSK4.",
        ],
      },
      {
        name: "Luyện HSK5 thường",
        code: "HSK5",
        audience: [
          "Học viên đã học xong lớp TC2 tại trung tâm, hoặc đã học xong 6 quyển bộ Giáo trình Hán ngữ, hoặc đã học xong quyển trung cấp Boya 2, hoặc có vốn từ vựng hơn 1.500 từ.",
          "Nắm vững và vận dụng được tất cả điểm ngữ pháp cơ bản và một số điểm ngữ pháp nâng cao ở trình độ trung cấp.",
          "Sinh viên năm 2 các trường đại học chuyên ngữ.",
        ],
        goals: ["Đậu HSK5."],
        duration: ["30 buổi, 60 giờ học, 2h/buổi, 3 buổi/tuần (2,5 tháng)."],
        content: [
          "Ôn luyện toàn bộ hệ thống ngữ pháp tiếng Hán giai đoạn trung cấp, hỗ trợ kiến thức và đề ôn luyện thi Đại học khối D4.",
          "Tổng hợp – củng cố ngữ pháp từ, ngữ pháp ngữ, ngữ pháp câu và phân biệt từ trung cấp.",
        ],
        materials: HSK_MATERIALS,
        outcomes: [
          "Nắm vững đầy đủ kỹ năng làm bài, từ vựng và các cấu trúc ngữ pháp cần thiết cho kỳ thi HSK5.",
          "Đảm bảo đầu ra 100% đậu HSK5.",
        ],
      },
      {
        name: "Luyện HSK4 đặc biệt",
        code: "HSK4+",
        audience: [
          "Dành cho học viên muốn rút ngắn thời gian học tập và ôn thi HSK4.",
          "Đã học xong quyển 3 bộ Giáo trình Hán ngữ 6 quyển, hoặc hoàn thành Sơ cấp 2 (SC2) tại trung tâm.",
          "Có vốn từ khoảng 600 từ trở lên.",
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
        name: "Luyện HSK5 đặc biệt",
        code: "HSK5+",
        audience: [
          "Học viên đã học xong lớp TC1 tại trung tâm, hoặc đã học xong 6 quyển bộ Giáo trình Hán ngữ, hoặc đã học xong quyển trung cấp Boya 2, hoặc có vốn từ vựng hơn 1.500 từ.",
          "Nắm vững và vận dụng được tất cả điểm ngữ pháp cơ bản và một số điểm ngữ pháp nâng cao ở trình độ trung cấp.",
          "Sinh viên năm 2 các trường đại học chuyên ngữ.",
        ],
        goals: ["Đậu HSK5."],
        duration: ["45 buổi++, 2h/buổi, 3 buổi/tuần (khoảng 4 tháng)."],
        content: [
          "Ôn luyện toàn bộ hệ thống ngữ pháp tiếng Hán giai đoạn trung cấp, hỗ trợ kiến thức và đề ôn luyện thi Đại học khối D4.",
          "Tổng hợp – củng cố ngữ pháp từ, ngữ pháp ngữ, ngữ pháp câu và phân biệt từ trung cấp.",
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
    title: "Tiếng Hoa Sơ cấp",
    summary: "Phát triển 4 kỹ năng, đậu HSK2, HSK3, HSK4.",
    goal: "HSK2 → HSK4",
    entry: "Bắt đầu từ con số 0",
    icon: "seed",
    featured: true,
    tags: ["3 khóa học", "Từ vỡ lòng", "4 kỹ năng"],
    levels: [
      {
        name: "Tiếng Hoa Sơ cấp 1",
        code: "SC1",
        audience: [
          "Người chưa từng tiếp xúc với tiếng Hoa, muốn bắt đầu học từ vỡ lòng.",
          "Người đã từng học tiếng Trung nhưng mất căn bản về ngữ âm, quy tắc bút thuận, học lâu rồi quên hết kiến thức và muốn học lại từ đầu cho vững.",
          "Người mới bắt đầu học nhưng muốn học đủ cả 4 kỹ năng nghe – nói – đọc – viết.",
          "Người mới bắt đầu học nhưng muốn học lâu dài vì mục đích du học hoặc làm việc trong môi trường tiếng Hoa.",
        ],
        goals: [
          "Xây dựng nền tảng ngữ âm vững chắc, đọc chính xác phiên âm của bất kỳ từ mới nào sau khi học xong phần ngữ âm.",
          "Viết thông thạo chữ Hán theo đúng quy tắc bút thuận.",
          "Tiếp xúc với khoảng 50 bộ chữ, nắm được tên và ý nghĩa của các bộ chữ.",
          "Phát triển toàn diện 4 kỹ năng nghe – nói – đọc – viết ngay từ khi mới bắt đầu học.",
          "Giao tiếp được gần 20 chủ đề hằng ngày: giới thiệu bản thân, bạn bè, lớp học, trường học, chỉ đường, phương tiện đi lại, ngày tháng, cách biểu đạt thời gian, số đếm, đổi tiền ở ngân hàng, gọi món ở quán ăn…",
        ],
        duration: [
          "40 buổi – 80 tiết (60 giờ), 3 buổi/tuần, 1,5h/buổi, khoảng 3,5 tháng (14 tuần).",
          "30 buổi – 80 tiết (60 giờ), 2 buổi/tuần, 2h/buổi, khoảng 4 tháng (15 tuần).",
        ],
        content: [
          "Kiến thức ngữ âm tiếng Hoa.",
          "Quy tắc bút thuận.",
          "Từ vựng về 20 chủ đề thường gặp trong cuộc sống.",
          "Bảng từ vựng HSK2.",
          "Ngữ pháp tiếng Hoa cơ bản trình độ HSK2.",
        ],
        materials: STANDARD_MATERIALS,
        outcomes: [
          "Có nền tảng ngữ âm vững chắc.",
          "Nắm vững ý nghĩa, viết được và sử dụng thông thạo khoảng 350 từ vựng.",
          "Nắm được ý nghĩa và tên của khoảng 50 bộ chữ.",
          "Giao tiếp thông thạo các chủ đề đã học.",
          "Đảm bảo thi đậu 100% HSK2.",
        ],
      },
      {
        name: "Tiếng Hoa Sơ cấp 2",
        code: "SC2",
        audience: [
          "Người đã hoàn thành khóa SC1 và muốn tiếp tục nâng cao trình độ.",
          "Người đã học xong giáo trình 301 quyển 1, hoặc 1/2 giáo trình Boya sơ cấp 1, hoặc quyển 1 của Giáo trình Hán ngữ 6 quyển.",
          "Người đã đạt trình độ HSK2, có vốn từ khoảng 300 từ.",
        ],
        goals: [
          "Hiểu rõ nghĩa, phân biệt được từ loại và vận dụng được từ vựng đã học vào hội thoại.",
          "Nắm và vận dụng thông thạo 35 điểm ngữ pháp cơ bản quan trọng.",
          "Tiếp xúc với khoảng 80 bộ chữ, nắm được tên và ý nghĩa của các bộ chữ.",
          "Giao tiếp thông thạo gần 30 chủ đề hằng ngày: đi bác sĩ, thăm bệnh, mua sắm, trả giá, thời tiết, ẩm thực, thăm hỏi bạn bè, thuê nhà, chọn món ăn, kế hoạch học tập, thể thao…",
          "Nâng cao và hoàn thiện dần 4 kỹ năng nghe – nói – đọc – viết ở trình độ HSK3.",
        ],
        duration: [
          "40 buổi – 80 tiết (60 giờ), 3 buổi/tuần, 1,5h/buổi, khoảng 3,5 tháng (14 tuần).",
          "30 buổi – 80 tiết (60 giờ), 2 buổi/tuần, 2h/buổi, khoảng 4 tháng (15 tuần).",
        ],
        content: [
          "Hơn 35 điểm ngữ pháp tiếng Hoa cơ bản.",
          "Khoảng 650 từ vựng về các chủ điểm thường gặp trong cuộc sống.",
          "Đọc thông thạo và hội thoại khoảng 30 chủ điểm thường ngày.",
        ],
        materials: STANDARD_MATERIALS,
        outcomes: [
          "Sử dụng được hơn 35 điểm ngữ pháp cơ bản.",
          "Nắm vững ý nghĩa, viết được và sử dụng thông thạo khoảng 650 từ vựng.",
          "Nắm được ý nghĩa và tên của khoảng 80 bộ chữ.",
          "Giao tiếp thông thạo các chủ đề đã học.",
          "Đảm bảo thi đậu 100% HSK3.",
        ],
      },
      {
        name: "Tiếng Hoa Sơ cấp 3",
        code: "SC3",
        audience: [
          "Người đã hoàn thành khóa SC2 và muốn tiếp tục nâng cao trình độ.",
          "Người đã học xong giáo trình 301 quyển 1 và 2, hoặc 1/2 giáo trình Boya sơ cấp 2, hoặc quyển 2 của Giáo trình Hán ngữ 6 quyển.",
          "Người đã đạt trình độ HSK3, có vốn từ khoảng 600 từ.",
          "Người muốn chuẩn bị hành trang thi HSK để du học hoặc làm việc trong môi trường yêu cầu tiếng Trung chuyên nghiệp.",
        ],
        goals: [
          "Hiểu rõ nghĩa, phân biệt từ loại và vận dụng linh hoạt từ vựng đã học.",
          "Nắm và vận dụng thông thạo 45 điểm ngữ pháp cơ bản quan trọng.",
          "Tiếp xúc với khoảng 120 bộ chữ, nắm được tên và ý nghĩa của các bộ chữ.",
          "Giao tiếp ở mức độ phức tạp hơn với từ vựng phong phú hơn: thảo luận kỳ nghỉ, phương tiện giao thông, giới thiệu điểm du lịch, mua quà sinh nhật, mượn đồ dùng, miêu tả chi tiết một người, thảo luận thể thao…",
          "Nâng cao và hoàn thiện 4 kỹ năng nghe – nói – đọc – viết ở trình độ HSK4.",
        ],
        duration: [
          "40 buổi – 80 tiết (60 giờ), 3 buổi/tuần, 1,5h/buổi, khoảng 3,5 tháng (14 tuần).",
          "30 buổi – 80 tiết (60 giờ), 2 buổi/tuần, 2h/buổi, khoảng 4 tháng (15 tuần).",
        ],
        content: [
          "Hơn 45 điểm ngữ pháp tiếng Hoa cơ bản.",
          "Khoảng 1.250 từ vựng về các chủ điểm thường gặp trong cuộc sống.",
          "Đọc thông thạo và hội thoại khoảng 30 chủ điểm thường ngày.",
        ],
        materials: STANDARD_MATERIALS,
        outcomes: [
          "Sử dụng được hơn 45 điểm ngữ pháp cơ bản.",
          "Nắm vững ý nghĩa, viết được và sử dụng thông thạo khoảng 1.250 từ vựng.",
          "Nắm được ý nghĩa và tên của khoảng 120 bộ chữ.",
          "Giao tiếp thông thạo các chủ đề đã học.",
          "Đảm bảo thi đậu 100% HSK4.",
        ],
      },
    ],
  },
  {
    slug: "tieng-hoa-trung-cap",
    image: "/images/courses/tieng-hoa-trung-cap.png",
    title: "Tiếng Hoa Trung cấp",
    summary: "Phát triển 4 kỹ năng, đạt HSK5.",
    goal: "Hướng tới HSK5",
    entry: "Đã hoàn thành SC3 hoặc tương đương HSK4",
    icon: "growth",
    featured: true,
    tags: ["2 khóa học", "Khẩu ngữ song song", "Chủ đề xã hội"],
    levels: [
      {
        name: "Tiếng Hoa Trung cấp 1",
        code: "TC1",
        audience: [
          "Người đã hoàn thành khóa tiếng Hoa sơ cấp với 4 kỹ năng SC1, SC2, SC3 tại trung tâm.",
          "Người đã hoàn thành giáo trình Boya 2 hoặc quyển 4–5 Giáo trình Hán ngữ (6 cuốn).",
          "Người đã có trình độ HSK4, muốn nâng cao trình độ với 4 kỹ năng nghe, nói, đọc, viết.",
          "Người có trình độ tương đương HSK4, vốn từ vựng khoảng 1.200 từ.",
        ],
        goals: [
          "Hiểu nghĩa, cách dùng và vận dụng được khoảng 1.000 từ vựng ở nhiều lĩnh vực: kinh tế, văn hóa, xã hội.",
          "Hiểu và nắm vững các từ ngữ trọng điểm ở mức tiền trung cấp (hư từ: phó từ, giới từ, trợ từ…).",
          "Nâng cao 4 kỹ năng nghe, nói, đọc, viết gắn với các chủ đề xã hội đương đại.",
          "Được trang bị đủ từ vựng và ngữ pháp để bước vào ôn thi HSK5.",
        ],
        duration: ["40 buổi – 80 tiết (60 giờ), 3 buổi/tuần, 1,5h/buổi, khoảng 3,5 tháng (14 tuần)."],
        content: [
          "11 chủ điểm thiết thực về văn hóa, xã hội đương đại và phong tục Trung Quốc: cuộc sống du học, khác biệt văn hóa Đông – Tây, lối sống của người trẻ, các lễ hội Trung Quốc…",
          "Nội dung bài khóa mang tính ứng dụng, cung cấp lượng từ mới và kiến thức ngữ pháp phong phú.",
          "Rèn song song 4 kỹ năng nghe – nói – đọc – viết, giúp học viên phản ứng nhanh với tiếng Trung và dễ áp dụng thực tế.",
        ],
        materials: [
          ...STANDARD_MATERIALS,
          "Khóa học dùng hai giáo trình song song — tổng hợp trung cấp và khẩu ngữ trung cấp — để nâng cao vượt trội khả năng khẩu ngữ, nghe nói và đọc hiểu.",
        ],
        outcomes: [
          "Sử dụng được hơn 75 điểm ngữ pháp và các từ vựng trọng điểm (hết ngữ pháp cơ bản, chuyển sang từ pháp).",
          "Nắm vững ý nghĩa, viết được và sử dụng thông thạo khoảng 1.000 từ vựng.",
          "Nắm được ý nghĩa và tên của khoảng 120 bộ chữ.",
          "Nâng cao vượt bậc khả năng nghe và đọc hiểu.",
          "Đạt khoảng 1/2 trình độ HSK5 — có thể tham gia lớp luyện thi HSK5 đặc biệt bao đầu ra.",
        ],
      },
      {
        name: "Tiếng Hoa Trung cấp 2",
        code: "TC2",
        audience: [
          "Người đã hoàn thành khóa trung cấp TC1 tại trung tâm.",
          "Người đã hoàn thành giáo trình Boya trung cấp 1 hoặc quyển 4–5 Giáo trình Hán ngữ (6 cuốn).",
          "Người đã có trình độ HSK4 vững vàng, muốn nâng cao với 4 kỹ năng nghe, nói, đọc, viết.",
          "Người có trình độ hơn HSK4, vốn từ vựng hơn 1.000 từ.",
        ],
        goals: [
          "Hiểu nghĩa, cách dùng và vận dụng được khoảng 1.300 từ vựng ở nhiều lĩnh vực: kinh tế, văn hóa, xã hội.",
          "Nắm vững các từ ngữ trọng điểm, phó từ, giới từ, liên từ ở trình độ cao hơn.",
          "Nâng cao 4 kỹ năng gắn với các chủ đề xã hội đương đại.",
          "Chuẩn bị đủ nền tảng để bước vào ôn thi HSK5.",
        ],
        duration: ["40 buổi – 80 tiết (60 giờ), 3 buổi/tuần, 1,5h/buổi, khoảng 3,5 tháng (14 tuần)."],
        content: [
          "15 chủ điểm nâng cao mở rộng vốn từ tối đa: bảo vệ động vật hoang dã, từ bỏ nỗi lo trong cuộc sống, kỹ xảo trò chuyện, cái đẹp trong cuộc sống, thành công của một thương hiệu lớn, ảnh hưởng của người nổi tiếng, lối sống hiện đại của giới trẻ, phẫu thuật thẩm mỹ, nghệ thuật nhân sinh, thời đại công nghệ, thần tượng của giới trẻ…",
          "Nâng cao trình độ nghe nói với giáo trình nghe nói được thiết kế riêng biệt.",
          "Cung cấp khối lượng từ vựng lớn, giúp diễn đạt phong phú và có chiều sâu.",
        ],
        materials: [
          ...STANDARD_MATERIALS,
          "Khóa học dùng hai giáo trình song song — tổng hợp trung cấp và khẩu ngữ trung cấp.",
        ],
        outcomes: [
          "Tích lũy khoảng 1.300 từ vựng, đủ vốn ngữ pháp và mẫu câu để test năng lực đầu vào lớp ôn thi HSK5 thường của trung tâm.",
          "Nâng cao trình độ nghe nói với giáo trình nghe nói riêng biệt.",
        ],
      },
    ],
  },
  {
    slug: "tieng-hoa-cao-cap",
    image: "/images/courses/tieng-hoa-cao-cap.png",
    title: "Tiếng Hoa Cao cấp",
    summary: "Phát triển 4 kỹ năng, đạt HSK6.",
    goal: "Hướng tới HSK6",
    entry: "Đã hoàn thành TC2 hoặc tương đương HSK5",
    icon: "peak",
    tags: ["2 khóa học", "Cao cấp 1 & 2"],
    contactOnly: true,
    note: "Tiếng Hoa Cao cấp gồm 2 khóa học: Cao cấp 1 và Cao cấp 2. Vui lòng liên hệ trung tâm để nhận lộ trình và chi tiết khóa học.",
    levels: [],
  },
  {
    slug: "tieng-hoa-giao-tiep-cap-toc",
    image: "/images/courses/tieng-hoa-giao-tiep-cap-toc.png",
    title: "Tiếng Hoa Giao tiếp Cấp tốc",
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
    title: "Tiếng Hoa Doanh nghiệp",
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
    title: "Tiếng Hoa VIP (1 kèm 1)",
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
    title: "Tiếng Hoa Thiếu nhi",
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
    title: "Tiếng Hoa cho người lớn tuổi",
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
    code: "SC1 – SC3",
    title: "Sơ cấp",
    result: "HSK2 → HSK4",
    desc: "Ngữ âm, bút thuận, khoảng 1.250 từ vựng và 45 điểm ngữ pháp cơ bản. Giao tiếp thông thạo các chủ đề thường ngày.",
  },
  {
    step: "02",
    code: "TC1 – TC2",
    title: "Trung cấp",
    result: "Hướng tới HSK5",
    desc: "Thêm khoảng 1.300 từ vựng theo chủ đề văn hóa – xã hội, học song song giáo trình tổng hợp và khẩu ngữ.",
  },
  {
    step: "03",
    code: "HSK4 – HSK5",
    title: "Luyện thi",
    result: "Cam kết 100% đậu",
    desc: "Lớp thường và lớp đặc biệt, ôn theo tài liệu HanBan, thi thử miễn phí đầu và cuối khóa.",
  },
  {
    step: "04",
    code: "CC1 – CC2",
    title: "Cao cấp",
    result: "Hướng tới HSK6",
    desc: "Hoàn thiện 4 kỹ năng ở trình độ cao cấp, sẵn sàng cho du học và môi trường làm việc chuyên nghiệp.",
  },
] as const;
