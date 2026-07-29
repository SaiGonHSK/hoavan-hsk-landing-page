
export type Achievement = {
  /** Tên học viên */
  name: string;
  /** Dòng phụ dưới tên: trường / nơi làm việc */
  school: string;
  /** Ảnh học viên, tỉ lệ 4/3 hoặc 1/1 đều được */
  image: string;
  /** Kết quả in trên ruy băng đỏ, vd "6", "5", "B2" */
  score: string;
  /** Tên kỳ thi in dưới điểm, vd "HSK", "TOCFL" */
  exam: string;
};

/**
 * TODO: điểm & kỳ thi dưới đây là dữ liệu mẫu để dựng layout —
 * cần trung tâm xác nhận kết quả thật của từng học viên trước khi publish.
 */
export const achievements: Achievement[] = [
  {
    name: "Huỳnh Phối My",
    school: "Sinh viên Trường Múa TP.HCM",
    image: "/images/reviews/phoi-my.jpg",
    score: "5",
    exam: "HSK",
  },
  {
    name: "Trần Chí Nguyện",
    school: "Sinh viên ĐH Tôn Đức Thắng",
    image: "/images/reviews/chi-nguyen.jpg",
    score: "5",
    exam: "HSK",
  },
  {
    name: "Đoàn Phương Thảo",
    school: "Cựu sinh viên ĐH Ngoại Thương Hà Nội",
    image: "/images/reviews/doan-phuong-thao.png",
    score: "6",
    exam: "HSK",
  },
  {
    name: "Trần Gia Tuệ",
    school: "Sinh viên ĐH Nguyễn Tất Thành",
    image: "/images/reviews/tran-gia-tue.jpg",
    score: "4",
    exam: "HSK",
  },
  {
    name: "Long Chấn Phát",
    school: "Cựu sinh viên ĐH KHXH&NV TP.HCM",
    image: "/images/reviews/long-chan-phat.png",
    score: "6",
    exam: "HSK",
  },
  {
    name: "Hoàng Hà Phương",
    school: "Cựu sinh viên ĐH Ngoại Thương Hà Nội",
    image: "/images/reviews/hoang-ha-phuong.jpg",
    score: "C1",
    exam: "TOCFL",
  },
  {
    name: "Nguyễn Thị Phương Thảo",
    school: "Giáo viên tâm lý",
    image: "/images/reviews/nguyen-thi-phuong-thao.jpg",
    score: "4",
    exam: "HSK",
  },
  {
    name: "Võ Tường Quy",
    school: "Sinh viên ĐH Tôn Đức Thắng",
    image: "/images/reviews/tuong-quy.jpg",
    score: "5",
    exam: "HSK",
  },
  {
    name: "Nguyễn Lê Thanh Trầm",
    school: "Sinh viên ĐH Sư Phạm TP.HCM",
    image: "/images/reviews/thanh-tram.jpg",
    score: "5",
    exam: "HSK",
  },
  {
    name: "Nguyễn Danh Giàu",
    school: "Sinh viên ĐH Công nghiệp Thực phẩm TP.HCM",
    image: "/images/reviews/danh-giau.jpg",
    score: "4",
    exam: "HSK",
  },
];
