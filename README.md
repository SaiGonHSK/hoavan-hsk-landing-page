# Website Trung tâm Hoa văn SaigonHSK

Landing page và hệ thống trang giới thiệu – khoá học – ôn tập của Trung tâm Hoa văn
SaigonHSK (为你的成功 — Vì sự thành công của bạn).

## Chạy dự án

```sh
yarn install
yarn dev       # chạy môi trường phát triển
yarn build     # build tĩnh ra thư mục dist/
yarn preview   # xem thử bản build
```

## Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `src/data/site.ts` | Thương hiệu, liên hệ, cam kết, 05 khác biệt, mô hình đào tạo, số liệu |
| `src/data/catalog.ts` | Khoá học theo cấp HSK, luyện thi, giáo trình, ôn tập, kỹ năng, học thử, thư viện |
| `src/data/navigation.ts` | Cây menu — dùng chung cho header, drawer mobile và footer |
| `src/data/courses.ts` | Các chương trình đào tạo tại trung tâm (nội dung chi tiết từng cấp) |
| `src/data/teachers.ts` | Đội ngũ giảng viên và bộ poster giới thiệu |
| `src/data/testimonials.ts` | Phản hồi học viên |
| `src/data/schedule.ts` | Nhịp mở lớp cho trang Lịch khai giảng |
| `src/components/` | Section trang chủ và các khung dùng chung (`CatalogHub`, `CatalogDetail`) |
| `public/images/` | Ảnh lớp học, cơ sở vật chất, poster, ảnh giảng viên |

Thêm hoặc sửa khoá học: chỉnh `src/data/catalog.ts` — trang chi tiết, menu và trang
tổng quan sẽ tự cập nhật theo.

## Menu và trang do trang quản trị tạo

Menu header và các trang nội dung lấy từ app quản trị (`hoavan-hsk-admin`):

```sh
PUBLIC_CONTENT_API=http://localhost:3000/console npm run build
```

- `src/data/pages.ts` gọi `GET /api/public/pages` để lấy cây menu + nội dung.
- `src/components/Header.astro` dựng menu (và mega menu theo “nhóm cột”) từ cây đó.
- `src/pages/[...slug].astro` sinh trang tĩnh cho mọi mục có nội dung.
- Không gọi được API → tự dùng bản chụp trong `content/site.json`, build vẫn chạy.

## Biến môi trường

`PUBLIC_REGISTER_ENDPOINT` — nếu có API nhận đăng ký, điền vào đây để form POST lên
server. Bỏ trống thì form mở sẵn email gửi về hộp thư của trung tâm.
# hoavan-hsk-landing-page
# hoavan-hsk-landing-page
