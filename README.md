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

## Form đăng ký tư vấn (leads)

`RegisterForm.astro` gửi đăng ký lên API leads của `hoavan-hsk-server`:

```sh
PUBLIC_API_BASE=http://localhost:9909 yarn dev
```

- `src/lib/leads.ts` gọi `POST {PUBLIC_API_BASE}/api/v1/leads` — endpoint công khai,
  không cần token; `source` = `landing`, `status` = `new` do server tự đặt.
- Tên field của form trùng json tag của server nên `FormData` gửi đi được luôn.
- Lỗi 422 kèm `error.fields` → form hiện message của đúng field và tô đỏ input;
  429 (rate limit theo IP) → mời khách gọi hotline.
- Gửi lại cùng số điện thoại không tạo lead trùng: server gộp vào lead đang mở.
- Bỏ trống `PUBLIC_API_BASE` → form lùi về mở sẵn email gửi trung tâm, không làm mất
  thông tin khách đã nhập.

Server phải có origin của landing trong `CORS_ORIGINS` (mặc định đã có
`http://localhost:4321` của `astro dev`), nếu không browser sẽ chặn request.

## Biến môi trường

Copy `.env.example` thành `.env`. Đây là site tĩnh nên mọi biến `PUBLIC_*` được nhúng
lúc build — sửa xong phải build lại, và khi build bằng Docker thì truyền qua
`--build-arg` (xem `Dockerfile` / `docker-compose.yml`).

| Biến | Ý nghĩa |
| --- | --- |
| `PUBLIC_API_BASE` | Host API Go, ví dụ `http://localhost:9909`. Bỏ trống: form đăng ký dùng mailto |
| `PUBLIC_REGISTER_ENDPOINT` | Ghi đè URL nhận đăng ký khi cần trỏ sang nơi khác |
| `PUBLIC_CONTENT_API` | API nội dung của trang quản trị; bỏ trống thì dùng `content/site.json` |
| `PUBLIC_LOGIN_ENDPOINT` | Endpoint đăng nhập khu vực học viên; bỏ trống thì form báo chưa mở |
