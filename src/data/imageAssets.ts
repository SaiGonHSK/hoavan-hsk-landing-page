import type { ImageMetadata } from "astro";

import caoHoaiNhon from "@/assets/teachers/cao-hoai-nhon.webp";
import duongMaiPhuong from "@/assets/teachers/duong-mai-phuong.webp";
import huynhThiMyChinh from "@/assets/teachers/huynh-thi-my-chinh.webp";
import leTuanMinh from "@/assets/teachers/le-tuan-minh.webp";
import lyHienTin from "@/assets/teachers/ly-hien-tin.webp";
import nguyenTuanCanh from "@/assets/teachers/nguyen-tuan-canh.webp";
import tranHongHuyen from "@/assets/teachers/tran-hong-huyen.webp";
import voThiQuynhTrang from "@/assets/teachers/vo-thi-quynh-trang.webp";

import chiNguyen from "@/assets/reviews/chi-nguyen.jpg";
import danhGiau from "@/assets/reviews/danh-giau.jpg";
import doanPhuongThao from "@/assets/reviews/doan-phuong-thao.png";
import longChanPhat from "@/assets/reviews/long-chan-phat.png";
import nguyenThiPhuongThao from "@/assets/reviews/nguyen-thi-phuong-thao.jpg";
import phoiMy from "@/assets/reviews/phoi-my.jpg";
import thanhTram from "@/assets/reviews/thanh-tram.jpg";
import tranGiaTue from "@/assets/reviews/tran-gia-tue.jpg";
import tuongQuy from "@/assets/reviews/tuong-quy.jpg";

/**
 * Tra ảnh trong `src/assets/` theo đường dẫn `/images/…` mà dữ liệu còn ghi.
 *
 * Ảnh giảng viên và ảnh cảm nhận từng nằm trong `public/`, được tham chiếu bằng chuỗi
 * đường dẫn — `content/site.json` giữ ảnh giảng viên, còn ảnh cảm nhận do trang quản
 * trị soạn và lưu trong cơ sở dữ liệu (`testimonials` là một trong `DYNAMIC_KEYS`, xem
 * `content.ts`). Đưa cả hai vào `src/assets/` thì `<Image>` mới nén và xuất được nhiều
 * khổ, nhưng import lúc build không nhận chuỗi lấy từ API, nên phải có bảng tra này.
 *
 * `public/` giờ chỉ còn favicon: đường dẫn `/images/…` nào không có trong bảng là ảnh
 * không còn tồn tại. Chỗ dùng vì vậy phải coi `undefined` là "không có ảnh" và rơi về
 * chữ cái đầu của tên, chứ không in thẻ `<img>` trỏ vào một tệp chắc chắn 404 —
 * `/images/reviews/hoang-ha-phuong.jpg` trong cơ sở dữ liệu là một trường hợp như vậy,
 * nó đã 404 từ trước lần dọn này.
 */
const ASSETS: Record<string, ImageMetadata> = {
  "/images/teachers/cao-hoai-nhon.webp": caoHoaiNhon,
  "/images/teachers/duong-mai-phuong.webp": duongMaiPhuong,
  "/images/teachers/huynh-thi-my-chinh.webp": huynhThiMyChinh,
  "/images/teachers/le-tuan-minh.webp": leTuanMinh,
  "/images/teachers/ly-hien-tin.webp": lyHienTin,
  "/images/teachers/nguyen-tuan-canh.webp": nguyenTuanCanh,
  "/images/teachers/tran-hong-huyen.webp": tranHongHuyen,
  "/images/teachers/vo-thi-quynh-trang.webp": voThiQuynhTrang,

  "/images/reviews/chi-nguyen.jpg": chiNguyen,
  "/images/reviews/danh-giau.jpg": danhGiau,
  "/images/reviews/doan-phuong-thao.png": doanPhuongThao,
  "/images/reviews/long-chan-phat.png": longChanPhat,
  "/images/reviews/nguyen-thi-phuong-thao.jpg": nguyenThiPhuongThao,
  "/images/reviews/phoi-my.jpg": phoiMy,
  "/images/reviews/thanh-tram.jpg": thanhTram,
  "/images/reviews/tran-gia-tue.jpg": tranGiaTue,
  "/images/reviews/tuong-quy.jpg": tuongQuy,
};

/**
 * Ảnh đã import cho `path`, hoặc `undefined` nếu không có ảnh nào mang đường dẫn đó.
 *
 * Nhận `undefined`/rỗng để chỗ dùng khỏi phải kiểm tra trước khi gọi — trường `image`
 * của cảm nhận là tuỳ chọn và cơ sở dữ liệu trả `null` cho phần lớn bản ghi.
 */
export const imageAsset = (path: string | null | undefined): ImageMetadata | undefined =>
  path ? ASSETS[path] : undefined;
