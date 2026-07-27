/**
 * Lịch khai giảng.
 *
 * Website hiện tại của trung tâm không công bố bảng ngày khai giảng cụ thể
 * ("Cập nhật liên tục lịch khai giảng khóa học tiếng Trung mới nhất"), nên bảng
 * dưới đây mô tả nhịp mở lớp theo từng chương trình — dữ liệu thời lượng lấy từ
 * trang khóa học. Khi trung tâm có ngày khai giảng cụ thể, chỉ cần điền vào
 * trường `openDate` (ví dụ "05/08/2026") là bảng tự hiển thị.
 */

export type ScheduleRow = {
  code: string;
  className: string;
  courseSlug: string;
  target: string;
  cadence: string;
  duration: string;
  /** Để trống → hiển thị "Liên hệ nhận lịch". */
  openDate?: string;
};

export const schedule: ScheduleRow[] = [
  {
    code: "SC1",
    className: "Tiếng Hoa Sơ cấp 1",
    courseSlug: "tieng-hoa-so-cap",
    target: "Đậu HSK2",
    cadence: "3 buổi/tuần · 1,5h/buổi (hoặc 2 buổi/tuần · 2h/buổi)",
    duration: "40 buổi · ~3,5 tháng",
  },
  {
    code: "SC2",
    className: "Tiếng Hoa Sơ cấp 2",
    courseSlug: "tieng-hoa-so-cap",
    target: "Đậu HSK3",
    cadence: "3 buổi/tuần · 1,5h/buổi",
    duration: "40 buổi · ~3,5 tháng",
  },
  {
    code: "SC3",
    className: "Tiếng Hoa Sơ cấp 3",
    courseSlug: "tieng-hoa-so-cap",
    target: "Đậu HSK4",
    cadence: "3 buổi/tuần · 1,5h/buổi",
    duration: "40 buổi · ~3,5 tháng",
  },
  {
    code: "TC1",
    className: "Tiếng Hoa Trung cấp 1",
    courseSlug: "tieng-hoa-trung-cap",
    target: "Đạt 1/2 trình độ HSK5",
    cadence: "3 buổi/tuần · 1,5h/buổi",
    duration: "40 buổi · ~3,5 tháng",
  },
  {
    code: "TC2",
    className: "Tiếng Hoa Trung cấp 2",
    courseSlug: "tieng-hoa-trung-cap",
    target: "Vào lớp luyện HSK5",
    cadence: "3 buổi/tuần · 1,5h/buổi",
    duration: "40 buổi · ~3,5 tháng",
  },
  {
    code: "HSK4",
    className: "Luyện HSK4 thường",
    courseSlug: "luyen-thi-hsk",
    target: "Cam kết đậu HSK4",
    cadence: "3 buổi/tuần · 2h/buổi",
    duration: "24 buổi · ~2 tháng",
  },
  {
    code: "HSK4+",
    className: "Luyện HSK4 đặc biệt",
    courseSlug: "luyen-thi-hsk",
    target: "Cam kết đậu HSK4",
    cadence: "3 buổi/tuần · 2h/buổi",
    duration: "36 buổi · ~3 tháng",
  },
  {
    code: "HSK5",
    className: "Luyện HSK5 thường",
    courseSlug: "luyen-thi-hsk",
    target: "Cam kết đậu HSK5",
    cadence: "3 buổi/tuần · 2h/buổi",
    duration: "30 buổi · ~2,5 tháng",
  },
  {
    code: "HSK5+",
    className: "Luyện HSK5 đặc biệt",
    courseSlug: "luyen-thi-hsk",
    target: "Cam kết đậu HSK5",
    cadence: "3 buổi/tuần · 2h/buổi",
    duration: "45 buổi++ · ~4 tháng",
  },
  {
    code: "GT1",
    className: "Giao tiếp Cấp tốc 1",
    courseSlug: "tieng-hoa-giao-tiep-cap-toc",
    target: "200–300 từ, giao tiếp cơ bản",
    cadence: "3 buổi/tuần · 1,5h/buổi",
    duration: "36 buổi · 3 tháng",
  },
  {
    code: "GT2",
    className: "Giao tiếp Cấp tốc 2",
    courseSlug: "tieng-hoa-giao-tiep-cap-toc",
    target: "300–400 từ, giao tiếp nâng cao",
    cadence: "3 buổi/tuần · 1,5h/buổi",
    duration: "36 buổi · 3 tháng",
  },
  {
    code: "VIP",
    className: "Tiếng Hoa VIP 1 kèm 1",
    courseSlug: "tieng-hoa-vip",
    target: "Theo mục tiêu học viên",
    cadence: "Lịch linh hoạt theo học viên",
    duration: "Theo lộ trình cá nhân",
  },
];
