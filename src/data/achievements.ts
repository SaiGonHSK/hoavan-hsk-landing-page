import poster1 from "@/assets/archivements/a1.jpg";
import poster2 from "@/assets/archivements/a2.jpg";
import poster3 from "@/assets/archivements/a3.jpg";
import poster4 from "@/assets/archivements/a4.jpg";

/**
 * Poster vinh danh học viên do trung tâm công bố — điểm bên dưới chép lại
 * đúng bảng điểm in trên poster.
 * Ảnh nằm ở src/assets/archivements/ để Astro nén và xuất WebP lúc build,
 * bản gốc 2526×2526 nên không được nhúng thẳng.
 */
export type HonorPoster = {
  image: ImageMetadata;
  /** Tên học viên, in dưới ảnh */
  name: string;
  /** Tiêu đề poster, dùng làm chú thích khi phóng to */
  title: string;
  /** Kỳ thi, vd "HSK5" */
  exam: string;
  /** Tổng điểm và thang điểm */
  total: string;
  max: string;
  /** Ngày thi ghi trên bảng điểm */
  testDate: string;
  /** Điểm từng kỹ năng, đều thang 100 */
  parts: { label: string; score: string }[];
  /** Ghi chú nhỏ, vd phần nói chưa công bố */
  note?: string;
  /** Kết quả tóm tắt một dòng, dùng ở trang chủ */
  result: string;
};

export const honorPosters: HonorPoster[] = [
  {
    image: poster1,
    name: "Rosie Cao",
    title: "Vinh danh học viên thi đỗ HSK5 (HSK 3.0)",
    exam: "HSK5",
    total: "238",
    max: "300",
    testDate: "31/01/2026",
    parts: [
      { label: "Nghe", score: "86" },
      { label: "Đọc", score: "86" },
      { label: "Viết", score: "66" },
      { label: "Nói (HSKK)", score: "74" },
    ],
    note: "Phần nói HSKK: đạt (Pass)",
    result: "HSK5 — 238/300 · HSKK 74/100",
  },
  {
    image: poster2,
    name: "Nhã Anh",
    title: "Vinh danh học viên thi đỗ HSK5",
    exam: "HSK5",
    total: "256",
    max: "300",
    testDate: "22/03/2026",
    parts: [
      { label: "Nghe", score: "84" },
      { label: "Đọc", score: "89" },
      { label: "Viết", score: "83" },
    ],
    note: "Điểm HSKK (phần nói) chưa công bố",
    result: "HSK5 — 256/300",
  },
  {
    image: poster3,
    name: "Lê Văn Tân",
    title: "Vinh danh học viên thi đỗ HSK6",
    exam: "HSK6",
    total: "222",
    max: "300",
    testDate: "22/03/2026",
    parts: [
      { label: "Nghe", score: "66" },
      { label: "Đọc", score: "86" },
      { label: "Viết", score: "70" },
    ],
    note: "Học lớp luyện HSK5, thi đỗ luôn HSK6",
    result: "HSK6 — 222/300",
  },
  {
    image: poster4,
    name: "Quỳnh Anh",
    title: "Vinh danh học viên thi đỗ HSK5",
    exam: "HSK5",
    total: "238",
    max: "300",
    testDate: "22/03/2026",
    parts: [
      { label: "Nghe", score: "78" },
      { label: "Đọc", score: "76" },
      { label: "Viết", score: "84" },
    ],
    note: "Điểm HSKK (phần nói) chưa công bố",
    result: "HSK5 — 238/300",
  },
];
