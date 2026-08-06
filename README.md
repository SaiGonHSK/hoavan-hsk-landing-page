# Website Trung tâm Hoa văn SaigonHSK

Landing page và hệ thống trang giới thiệu – khoá học – ôn tập của Trung tâm Hoa văn
SaigonHSK (为你的成功 — Vì sự thành công của bạn).

## Chạy dự án

```sh
yarn install
yarn dev       # chạy môi trường phát triển
yarn build     # build ra dist/server (SSR) + dist/client (asset)
yarn preview   # xem thử bản build
```

Site **render tại server** (`output: "server"` + `@astrojs/node`), không phải build
tĩnh: nội dung do trang quản trị soạn và được đọc lúc render, nên sửa một câu chữ
không phải deploy lại. Chạy bản build bằng `node ./dist/server/entry.mjs`.

```sh
CONTENT_API=http://localhost:9909 yarn dev   # có nội dung từ trang quản trị
yarn dev                                     # dùng content/site.json trong repo
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

## Nội dung do trang quản trị soạn

Toàn bộ phần chữ nghĩa của site (thương hiệu, liên hệ, khối đầu trang, cam kết, khác
biệt, giảng viên, cảm nhận, FAQ, lịch khai giảng, trang /about…) do
`hoavan-hsk-console` soạn và `hoavan-hsk-server` giữ. Đặt `CONTENT_API` là xong:

```sh
CONTENT_API=http://localhost:9909 yarn dev
```

Đường đi:

- `src/middleware.ts` gọi `refreshContent()` trước mỗi request.
- `src/data/refresh.ts` fetch `GET /api/v1/content` và `GET /api/v1/pages`, cache
  **60 giây** trong process, single-flight nên một đợt truy cập chỉ gọi API một lần.
- `src/data/content.ts` giữ tài liệu đang dùng; `src/data/{site,faq,teachers,
  testimonials,schedule,valuePanels}.ts` export biến `let` và có `syncFromContent()`.
  Nhờ ESM live binding, ~26 component đang `import { site }` thấy giá trị mới mà
  không phải sửa dòng nào.
- `src/pages/[...slug].astro` render các trang soạn từ trang quản trị; chỉ nhận slug
  đã có trong `content/pages.json`, nên trang quản trị không tạo được URL lạ.

Không đặt `CONTENT_API`, hoặc API chết: trang vẫn render bằng bản chụp
`content/site.json` trong repo (chỉ mất các trang động), kèm một dòng cảnh báo trong
log. `applyContent` còn deep-merge lên bản chụp, nên API trả tài liệu thiếu khoá cũng
không làm vỡ trang.

`content/pages.json` (cấu trúc menu) **vẫn sửa bằng tay trong repo** — trang quản trị
chỉ đọc. Sau khi sửa, chạy `go run ./cmd/seed -content-only` ở server để bản sao menu
bên đó khớp lại.

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

Site render tại server nên deploy có **hai phần**: build ra `dist/`, rồi restart tiến
trình node phục vụ nó. nginx đổi từ `root` sang `proxy_pass`.

Build trên VPS — cần Node ≥ 22.12:

```sh
cd /var/www/hoavan-hsk-landing-page && git pull
yarn install --frozen-lockfile      # dùng yarn.lock, không dùng npm
yarn build

# Kiểm tra trước khi đổi bản đang chạy: endpoint phải là đường dẫn tương đối
grep -rl 'localhost:9909' dist/client/    # phải rỗng

# Phát hành: copy sang thư mục release mới rồi trỏ symlink — bản cũ vẫn còn nguyên
# để phục vụ asset của tab đang mở / rollback.
REL=/var/www/hoavan-releases/$(date +%Y%m%d-%H%M%S)
mkdir -p "$REL" && cp -r dist/. "$REL/dist/"
cp -r node_modules "$REL/"          # adapter standalone cần dependency lúc chạy
chown -R www-data:www-data "$REL"
ln -sfn "$REL" /var/www/hoavan-current.new && mv -T /var/www/hoavan-current.new /var/www/hoavan-current

systemctl restart hoavan-landing    # nạp bản mới
nginx -t && systemctl reload nginx  # chỉ cần khi đổi vhost
```

`cp -r` vào thư mục mới rồi `mv -T` symlink chứ không `rsync --delete` đè lên thư mục
đang chạy: `--delete` xoá asset băm hash của bản cũ ngay lập tức, và tab nào đang mở
trang cũ sẽ 404 khi tải chunk tiếp theo. `mv -T` trên symlink là atomic nên không có
khoảnh khắc web root nửa vời. Dọn bản cũ định kỳ, giữ 2–3 bản.

systemd unit — `/etc/systemd/system/hoavan-landing.service`:

```ini
[Unit]
Description=Hoa van SaigonHSK landing (Astro SSR)
After=network.target

[Service]
WorkingDirectory=/var/www/hoavan-current
ExecStart=/usr/bin/node ./dist/server/entry.mjs
# Nghe nội bộ, nginx là lớp ra ngoài duy nhất.
Environment=HOST=127.0.0.1 PORT=4321
# Gọi thẳng Go server: cùng máy nên không cần vòng ra nginx, và không bị CORS.
Environment=CONTENT_API=http://127.0.0.1:9909
Environment=NODE_ENV=production
User=www-data
Restart=always

[Install]
WantedBy=multi-user.target
```

vhost của nginx — HTML proxy về node, asset phục vụ trực tiếp từ đĩa cho khỏi qua
node, `/api/` proxy về Go:

```nginx
# Asset có tên chứa mã băm: cache vĩnh viễn, và không cần node dựng.
location /_astro/ {
    alias /var/www/hoavan-current/dist/client/_astro/;
    expires 1y; add_header Cache-Control "public, immutable"; access_log off;
}

location / {
    proxy_pass http://127.0.0.1:4321;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /api/ {
    proxy_pass http://127.0.0.1:9909;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Không đặt `proxy_cache` cho HTML thì mỗi lượt xem là một lần render. `src/middleware.ts`
đã trả `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300`, nên
bật `proxy_cache` (hoặc đặt CDN phía trước) là đủ để nginx tôn trọng 60 giây đó.

Phía `hoavan-hsk-server` cần `TRUSTED_PROXIES=127.0.0.1` trong `.env.production`,
nếu không rate limit của `/api/v1/leads` đếm mọi khách chung một IP là nginx. Không
phải thêm gì vào `CORS_ORIGINS` vì lời gọi nội dung đi từ phía server.

**Sửa nội dung ở trang quản trị không cần deploy nữa** — trang tự đọc lại trong khoảng
60 giây. Chỉ đổi mã nguồn mới cần chạy lại các bước trên.


## Biến môi trường

Copy `.env.example` thành `.env`. Có **hai loại**, khác nhau ở chỗ chúng chạy:

- `PUBLIC_*` chạy trong **trình duyệt** → Astro nhúng thẳng vào JS **lúc build**; sửa
  xong phải build lại.
- `CONTENT_API` chạy ở **phía server** → đọc **lúc chạy**; đổi máy chủ nội dung chỉ
  cần restart, không phải build lại.

| Biến | Lúc nào | Ý nghĩa |
| --- | --- | --- |
| `CONTENT_API` | chạy | API nội dung (Go server), ví dụ `http://127.0.0.1:9909`. Bỏ trống thì dùng bản chụp `content/site.json` và bỏ qua các trang động |
| `PUBLIC_API_BASE` | build | Host API Go, ví dụ `http://localhost:9909`; `/` = cùng origin (production). Bỏ trống: form đăng ký dùng mailto |
| `PUBLIC_REGISTER_ENDPOINT` | build | Ghi đè URL nhận đăng ký khi cần trỏ sang nơi khác |
| `PUBLIC_LOGIN_ENDPOINT` | build | Endpoint đăng nhập khu vực học viên; bỏ trống thì form báo chưa mở |
| `PUBLIC_CONTENT_API` | build | **Cũ** — bản dự phòng của `CONTENT_API` để cấu hình cũ vẫn chạy. Dùng `CONTENT_API` cho cái mới |
