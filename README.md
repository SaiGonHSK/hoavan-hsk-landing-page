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

Khi API ở origin khác, server phải có origin của landing trong `CORS_ORIGINS` (mặc
định đã có `http://localhost:4321` của `astro dev`), nếu không browser sẽ chặn
request. Ở production thì không cần — xem mục dưới.

## Deploy

Ở production API đi cùng domain: nginx của domain proxy `/api/` về server Go
(`hoavan-hsk-server`, `PORT=9909`), nên base là **`/`** và form gửi tới
`/api/v1/leads` bằng đường dẫn tương đối. Giá trị đó nằm trong `.env.production`
(có trong git) và chỉ được nạp khi `yarn build`, nên không cần đặt biến gì trên VPS.

Build trên VPS rồi đổi thư mục được nginx phục vụ — cần Node ≥ 22.12:

```sh
cd /var/www/hoavan-hsk-landing-page && git pull
yarn install --frozen-lockfile      # dùng yarn.lock, không dùng npm
yarn build

# Kiểm tra trước khi đổi bản đang chạy: endpoint phải là đường dẫn tương đối
grep -o 'const d="/"' dist/index.html      # phải in ra const d="/"
grep -rl 'localhost:9909' dist/            # phải rỗng

# Phát hành: copy sang thư mục release mới rồi trỏ symlink — nginx đổi bản trong
# một lệnh, và bản cũ vẫn còn nguyên để phục vụ asset của tab đang mở / rollback.
REL=/var/www/hoavan-releases/$(date +%Y%m%d-%H%M%S)
mkdir -p "$REL" && cp -r dist/. "$REL/"
chown -R www-data:www-data "$REL"
ln -sfn "$REL" /var/www/hoavan-current.new && mv -T /var/www/hoavan-current.new /var/www/hoavan-current
nginx -t && systemctl reload nginx
```

`cp -r dist/. "$REL"` vào thư mục mới rồi `mv -T` symlink chứ không `rsync --delete`
đè lên thư mục đang chạy: `--delete` xoá asset băm hash của bản cũ ngay lập tức, và
tab nào đang mở trang cũ sẽ 404 khi tải chunk tiếp theo. `mv -T` trên symlink là
atomic nên không có khoảnh khắc web root nửa vời. Dọn bản cũ định kỳ, giữ 2–3 bản.

vhost của nginx — `root` trỏ vào symlink, `/api/` proxy về Go. Các location cache và
`try_files` lấy nguyên từ [docker/nginx.conf](docker/nginx.conf) (dùng cho đường
Docker, giữ đồng bộ hai bên):

```nginx
root /var/www/hoavan-current;

# Astro build ra thư mục/index.html → thử cả hai dạng trước khi 404
location / { try_files $uri $uri/ $uri/index.html $uri.html =404; }

# Asset có hash: cache vĩnh viễn. HTML thì phải revalidate để deploy có hiệu lực ngay.
location /_astro/   { expires 1y; add_header Cache-Control "public, immutable"; access_log off; }
location ~* \.html$ { add_header Cache-Control "public, max-age=0, must-revalidate"; }

location /api/ {
    proxy_pass http://127.0.0.1:9909;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Phía `hoavan-hsk-server` cần `TRUSTED_PROXIES=127.0.0.1` trong `.env.production`,
nếu không rate limit của `/api/v1/leads` đếm mọi khách chung một IP là nginx. Không
phải thêm gì vào `CORS_ORIGINS` vì cùng origin.

Nội dung trang lấy từ bản chụp `content/*.json` trong git (VPS không có `.env` nên
`PUBLIC_CONTENT_API` rỗng): sửa nội dung ở trang quản trị thì phải commit lại bản
chụp rồi mới deploy.

Cách khác — chạy bằng Docker (nginx trong container, publish cổng 8080), khi đó
`/` proxy về `127.0.0.1:8080` thay vì `root`. `.dockerignore` loại mọi `.env.*` nên
phải truyền build-arg:

```sh
PUBLIC_API_BASE=/ docker compose up -d --build
```

## Biến môi trường

Copy `.env.example` thành `.env`. Đây là site tĩnh nên mọi biến `PUBLIC_*` được nhúng
lúc build — sửa xong phải build lại, và khi build bằng Docker thì truyền qua
`--build-arg` (xem `Dockerfile` / `docker-compose.yml`).

| Biến | Ý nghĩa |
| --- | --- |
| `PUBLIC_API_BASE` | Host API Go, ví dụ `http://localhost:9909`; `/` = cùng origin (production). Bỏ trống: form đăng ký dùng mailto |
| `PUBLIC_REGISTER_ENDPOINT` | Ghi đè URL nhận đăng ký khi cần trỏ sang nơi khác |
| `PUBLIC_CONTENT_API` | API nội dung của trang quản trị; bỏ trống thì dùng `content/site.json` |
| `PUBLIC_LOGIN_ENDPOINT` | Endpoint đăng nhập khu vực học viên; bỏ trống thì form báo chưa mở |
