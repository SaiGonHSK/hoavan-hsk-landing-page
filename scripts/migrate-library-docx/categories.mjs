// Mapping thư mục .docx → category-key thật trong bảng `library_categories`
// (đã kiểm chứng bằng query trực tiếp vào DB local ở giai đoạn khảo sát — xem
// PLAN T1). Đừng đoán lại: dùng đúng danh sách này.
export const CATEGORY_DIRS = {
  "Câu chuyện Hán tự": "character-stories",
  "Văn hóa": "chinese-culture",
  "Tài liệu ngữ pháp tiếng Trung": "grammar-resources",
  "Yết hậu ngữ": "allegorical-sayings",
  "Từ vựng": "thematic-vocabulary",
  "Thành ngữ": "idioms",
  "Quán dụng ngữ": "colloquial-phrases",
};

// Slug đặt tay cho từng file — khoá theo `sourceFile` (đường dẫn tương đối
// convert.mjs tính ra, gốc là thư mục hoavan-hsk-landing-page). convert.mjs ưu
// tiên giá trị ở đây hơn slug tự suy, và bỏ cờ `needsDecision` cho file có mặt
// ở danh sách này — dùng khi slug tự suy trùng nhau (hai bài chỉ khác chữ Hán,
// slugify bỏ hết chữ Hán nên trùng) hoặc slug tự suy quá cụt nghĩa.
//
// Ba quyết định đã chốt ở T4:
//   - "Câu chữ 把" và "Câu chữ 被" tự suy đều ra "cau-chu" — slugify bỏ chữ Hán,
//     chữ Hán lại là thứ duy nhất phân biệt hai bài này.
//   - File mianzi tự suy ra "vi-sao-nguoi-trung-quoc-thich-noi" — cụt, mất từ
//     khoá "mianzi" (chỉ còn trong chữ Hán 面子, slugify cũng bỏ luôn).
export const SLUG_OVERRIDES = {
  "content/Web- Thư viện/Tài liệu ngữ pháp tiếng Trung/Bài 10 Câu chữ 把.docx": "cau-chu-ba",
  "content/Web- Thư viện/Tài liệu ngữ pháp tiếng Trung/Bài 11 Câu chữ 被.docx": "cau-chu-bei",
  "content/Web- Thư viện/Văn hóa/Bai 3_Vi_sao_nguoi_Trung_Quoc_thich_noi_mianzi_SaigonHSK.docx":
    "vi-sao-nguoi-trung-quoc-thich-mianzi",
};

// LỊCH SỬ — không còn dùng, giữ lại để giải thích tại sao KHÔNG còn
// LEGACY_SLUGS ở đây: 8 bài Thư viện có sẵn trước migrate này (chinese-radicals,
// le-vs-guo, family-vocabulary, chinese-new-year, idioms-about-learning,
// measure-words-hsk1-hsk3, common-allegorical-sayings, er-vs-liang) đã bị XOÁ
// khỏi `landing_pages` ở giữa T4, theo yêu cầu của user (không thuộc phạm vi
// content/Web- Thư viện). Đã sao lưu trước khi xoá:
//   hoavan-hsk-server/tmp/landing_pages-legacy-backup-20260814-205440.json
// DB local giờ chỉ còn đúng các bài từ content/Web- Thư viện — không có slug
// nào khác cần tránh nữa, nên bỏ hẳn export LEGACY_SLUGS (insert.mjs không
// import nó nữa). Nếu thấy code cũ còn nhắc LEGACY_SLUGS, đó là tài liệu đã
// lỗi thời — DB đã đổi từ dưới chân nó, không phải bug của script.
