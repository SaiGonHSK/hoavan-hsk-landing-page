# Deploy landing lên VPS — từng bước

Đích: `/var/www/landing`, chạy bằng **pm2** (tên app `hoavan-landing`), nghe
`127.0.0.1:4321`, nginx proxy `/` vào đó.

Bối cảnh chung của cả 3 source (server Go, landing, console) ở
[../DEPLOY.md](../DEPLOY.md). File này chỉ nói phần landing.

> **Đọc trước:** site đã đổi từ **static** sang **SSR** (`output: "server"` +
> `@astrojs/node` standalone trong [astro.config.mjs](astro.config.mjs)). `yarn build`
> **không** sinh `index.html` nữa. Cấu hình nginx cũ kiểu `root /var/www/landing/dist;`
> sẽ trả 403/404 trên mọi URL. Bước 8 và 9 là hai bước mới so với lần deploy trước.

---

## Bước 1 — Máy local: commit + push

Nhánh đang dùng: `feat/landingpage-ssr`. Có 5 file sửa chưa commit, `git pull` trên VPS
sẽ không thấy chúng.

```sh
cd ~/hoavan/hoavan-hsk-landing-page
git status --short          # phải rỗng sau khi commit
git add -A
git commit -m "..."
git push origin feat/landingpage-ssr
```

**Kiểm:** `git status --short` không in ra gì.

---

## Bước 2 — VPS: kiểm runtime

```sh
node -v      # phải ≥ v22.12.0  (package.json khai engines)
yarn -v      # 1.22.x
```

Node cũ hơn thì cài trước, đừng build:

```sh
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm i -g yarn
```

**Kiểm:** `node -v` in ra `v22.x` trở lên.

---

## Bước 3 — Lấy code về `/var/www/landing`

Lần đầu:

```sh
sudo mkdir -p /var/www && cd /var/www
sudo git clone git@github.com:phamdatt/hoavan-hsk-landing-page.git landing
cd landing && git checkout feat/landingpage-ssr
```

Thư mục đã có sẵn (đang chạy bản static cũ):

```sh
cd /var/www/landing
git fetch origin
git checkout feat/landingpage-ssr
git pull
```

**Kiểm:** `git log --oneline -1` khớp commit vừa push ở bước 1.

---

## Bước 4 — Dọn tàn dư của bản static

```sh
cd /var/www/landing

# 1. File ghi đè của máy dev không được có trên VPS. Nó đặt PUBLIC_API_BASE thành
#    http://localhost:9909 và sẽ bị nhúng thẳng vào JS gửi cho browser.
rm -f .env.production.local

# 2. dist cũ của bản static (có index.html) — xoá để không lẫn với bản build mới.
rm -rf dist

# 3. .env không cần trên VPS: mọi biến PUBLIC_* lấy từ .env.production (có trong git),
#    còn CONTENT_API do pm2 truyền vào ở bước 8. Có .env cũ trỏ localhost thì phải xoá.
rm -f .env
```

**Kiểm:**

```sh
ls -a | grep -E '^\.env'      # chỉ được còn .env.example và .env.production
```

---

## Bước 5 — Cài dependency

```sh
cd /var/www/landing
yarn install --frozen-lockfile
```

Dùng `yarn`, không dùng `npm` — repo có `yarn.lock`, `npm install` sẽ giải lại cây
dependency và sinh `package-lock.json` lệch với bản đã test.

`--frozen-lockfile` để lệnh **thất bại** nếu `package.json` và `yarn.lock` lệch nhau,
thay vì im lặng nâng version trên máy production.

**Đừng** dùng `--production` và **đừng** xoá `node_modules` sau khi build:
[dist/server/entry.mjs](dist/server/entry.mjs) `import` các package theo tên
(`@astrojs/internal-helpers/path`, `es-module-lexer`, `clsx`, `html-escaper`, `piccolore`),
tức node đi tìm chúng trong `node_modules` **lúc chạy**. Xoá đi là app chết ngay khi
start với `ERR_MODULE_NOT_FOUND`.

**Kiểm:** `ls node_modules/astro/package.json` có tồn tại.

---

## Bước 6 — Build

```sh
cd /var/www/landing
yarn build
```

Mất ~1–3 phút. Kết quả:

```
dist/
├── client/          ← asset gửi cho browser
│   ├── _astro/      ← JS + CSS tên có mã băm
│   ├── images/      ← copy từ public/
│   ├── favicon.png
│   └── sitemap-*.xml
└── server/          ← code chạy trên node
    ├── entry.mjs    ← điểm vào
    └── chunks/
```

VPS **không cần** đặt biến `PUBLIC_*` nào: [.env.production](.env.production) nằm trong
git và Vite tự nạp khi `NODE_ENV=production`, cho `PUBLIC_API_BASE=/`. Dấu `/` nghĩa là
cùng origin — form đăng ký POST tới `/api/v1/leads` bằng đường dẫn tương đối, nginx đưa
về server Go. Same-origin nên browser không gửi preflight và không cần thêm domain vào
`CORS_ORIGINS` của server.

**Kiểm — bắt buộc, đây là lỗi hay lọt nhất:**

```sh
# 1. JS gửi cho browser KHÔNG được chứa localhost. Phải không in ra gì.
grep -rl 'localhost:9909' dist/client/

# 2. Entry point tồn tại
ls -l dist/server/entry.mjs

# 3. KHÔNG có index.html — đây là bản SSR, có index.html nghĩa là build sai chế độ
ls dist/client/index.html 2>/dev/null && echo "SAI: đang build tĩnh"
```

Nếu lệnh 1 có kết quả: `.env.production.local` vẫn còn (quay lại bước 4) → `rm` rồi
`yarn build` lại.

---

## Bước 7 — Chạy thử bằng tay trước khi giao cho pm2

Bước này để tách lỗi ứng dụng khỏi lỗi cấu hình pm2.

```sh
cd /var/www/landing
HOST=127.0.0.1 PORT=4321 NODE_ENV=production CONTENT_API=http://127.0.0.1:8080 \
  node ./dist/server/entry.mjs
```

Mở terminal thứ hai:

```sh
curl -sI http://127.0.0.1:4321/ | head -1              # HTTP/1.1 200 OK
curl -s  http://127.0.0.1:4321/ | grep -c "SaigonHSK"  # > 0
```

Xong thì `Ctrl+C`.

Ở terminal chạy node, dòng log lúc khởi động cho biết nội dung lấy được từ đâu:
`refresh.ts` báo một dòng khi *đổi* trạng thái giữa "lấy từ API" và "API chết, dùng bản
trong repo". Thấy báo dùng bản dự phòng thì server Go chưa chạy hoặc sai cổng — sửa
trước khi đi tiếp, vì trang sẽ hiện nội dung cũ trong `content/site.json` chứ không phải
nội dung giáo vụ soạn trong console.

---

## Bước 8 — pm2

File dùng chung với console: `/var/www/ecosystem.config.cjs`. Phần của landing:

```js
{
  name: "hoavan-landing",
  cwd: "/var/www/landing",
  script: "./dist/server/entry.mjs",
  exec_mode: "fork",
  instances: 1,
  env: {
    NODE_ENV: "production",
    HOST: "127.0.0.1",
    PORT: "4321",
    CONTENT_API: "http://127.0.0.1:8080",
  },
  max_memory_restart: "512M",
}
```

Bản đầy đủ (có cả console) ở [../DEPLOY.md](../DEPLOY.md) mục 5.1.

```sh
pm2 start /var/www/ecosystem.config.cjs --only hoavan-landing
pm2 save          # ghi danh sách app, để pm2 dựng lại được sau reboot
pm2 startup       # in ra 1 lệnh sudo — phải copy chạy tay, lệnh này chỉ in chứ không cài
pm2 status
```

Bốn điểm trong config trên không tuỳ tiện đổi được:

- **`HOST=127.0.0.1`** — thiếu nó node bind `0.0.0.0` và người ngoài vào thẳng
  `http://<ip-vps>:4321`, đi vòng qua TLS và qua chính nginx.
- **`CONTENT_API` cổng 8080** — đó là `PORT` trong `.env.production` của server Go ở
  production. `9909` là cổng máy dev; README của repo này còn ví dụ 9909, sai với VPS.
- **`instances: 1` + `exec_mode: "fork"`** — [src/middleware.ts](src/middleware.ts) cache
  nội dung 60 giây **trong bộ nhớ tiến trình**. Bật cluster N worker là N bản cache lệch
  nhau, người dùng F5 thấy nội dung nhảy qua nhảy lại giữa bản cũ và bản mới.
- **`script` trỏ thẳng `entry.mjs`**, không qua `yarn start` — pm2 quản tiến trình nó
  sinh ra; nếu đó là yarn thì node là *con* của yarn, `pm2 restart` giết yarn và để lại
  node mồ côi giữ cổng 4321, lần start sau chết vì `EADDRINUSE`.

**Kiểm:**

```sh
pm2 status                 # hoavan-landing: online, cột restart = 0
curl -sI http://127.0.0.1:4321/ | head -1
ss -ltnp | grep 4321       # phải là 127.0.0.1:4321, KHÔNG phải 0.0.0.0:4321
```

Cột `restart` tăng dần = đang crash-loop, không phải đang chạy. pm2 vẫn hiện `online`
giữa hai lần chết nên đừng chỉ nhìn màu xanh; xem `pm2 logs hoavan-landing`.

---

## Bước 9 — nginx: bỏ `root`, chuyển sang `proxy_pass`

Mở vhost của domain (`/etc/nginx/sites-available/trungtamhoavansaigonhsk.edu.vn`).

**Xoá** dòng cũ của bản static:

```nginx
root /var/www/landing/dist;          # ← XOÁ
index index.html;                    # ← XOÁ
location / { try_files $uri $uri/ =404; }   # ← XOÁ
```

**Thêm** (giữ nguyên các `location /console` và `location /api/` đã có, `location /` phải
nằm **cuối**):

```nginx
# Asset có mã băm trong tên: nginx đọc thẳng từ đĩa, không phiền tới node.
location /_astro/ {
    alias /var/www/landing/dist/client/_astro/;
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}

location / {
    proxy_pass http://127.0.0.1:4321;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

```sh
sudo nginx -t && sudo systemctl reload nginx
```

Dấu `/` cuối trong `alias` là bắt buộc, thiếu là 404 toàn bộ CSS/JS.

Chỉ `/_astro/` đọc từ đĩa; `/images/`, `/favicon.png`, `/sitemap-*.xml` để node phục vụ
qua `location /` cũng được — chúng không có mã băm nên cache dài sẽ làm ảnh cũ dính lại.

**Kiểm:**

```sh
curl -sI https://trungtamhoavansaigonhsk.edu.vn/ | head -1     # 200
# Lấy 1 file asset thật rồi thử tải:
ls /var/www/landing/dist/client/_astro/ | head -1
curl -sI https://trungtamhoavansaigonhsk.edu.vn/_astro/<tên-file> | head -1   # 200
```

---

## Bước 10 — Nghiệm thu

```sh
curl -sI https://trungtamhoavansaigonhsk.edu.vn/          | head -1   # 200
curl -sI https://trungtamhoavansaigonhsk.edu.vn/schedule  | head -1   # 200
curl -sI https://trungtamhoavansaigonhsk.edu.vn/courses   | head -1   # 200
curl -s   https://trungtamhoavansaigonhsk.edu.vn/ -D- -o/dev/null | grep -i cache-control
# mong đợi: public, max-age=0, s-maxage=60, stale-while-revalidate=300
```

Trên trình duyệt:

1. **Trang chủ hiện nội dung đang có trong console**, không phải bản cũ trong
   `content/site.json`. Thử: sửa một câu ở `/console/landing`, chờ ~60 giây, F5 → phải
   đổi. Không đổi ⇒ `CONTENT_API` sai hoặc server Go chết.
2. **CSS/JS tải đủ** (không có lỗi đỏ trong Console của DevTools) — kiểm `location /_astro/`.
3. **Form đăng ký tư vấn gửi được** → lead hiện ở `/console/leads`. Mở tab Network, request
   phải đi tới `/api/v1/leads` (đường dẫn tương đối). Thấy `localhost:9909` là build lẫn
   `.env.production.local`, quay lại bước 4.
4. **Menu Thư viện** bấm vào không 404 (phụ thuộc migration `006` phía server).
5. `/schedule` có lớp (phụ thuộc migration `005` phía server).

---

## Deploy lần sau

```sh
cd /var/www/landing
git pull
yarn install --frozen-lockfile
yarn build
pm2 restart hoavan-landing
```

Sửa `CONTENT_API` hoặc biến env khác thì phải thêm cờ, nếu không pm2 dựng lại với env cũ:

```sh
pm2 restart hoavan-landing --update-env
```

**Sửa nội dung (chữ, ảnh, giảng viên, lịch, FAQ) không cần deploy** — soạn ở
`/console/landing/*`, trang tự đọc lại trong khoảng 60 giây. Chỉ đổi **mã nguồn** mới cần
chạy lại các lệnh trên.

Build đè trực tiếp lên `dist/` có ~1 giây trang không phục vụ, và tab nào đang mở bản cũ
có thể 404 khi tải chunk tiếp theo (tên file có mã băm, bản mới tên khác). Chấp nhận được
với lưu lượng hiện tại. Muốn tránh hẳn thì dùng thư mục release + symlink `mv -T` (atomic)
— xem [README.md](README.md) mục Deploy.

---

## Sự cố thường gặp

| Triệu chứng | Nguyên nhân | Sửa |
| --- | --- | --- |
| Mọi URL trả 403/404 | nginx còn `root .../dist` của bản static | Bước 9 |
| `ERR_MODULE_NOT_FOUND` lúc pm2 start | `node_modules` bị xoá sau build, hoặc cài bằng `--production` | `yarn install --frozen-lockfile` |
| `EADDRINUSE :4321` | tiến trình node cũ mồ côi (thường do chạy qua `yarn start`) | `pkill -f dist/server/entry.mjs` rồi `pm2 restart` |
| Trang lên nhưng không có CSS | `location /_astro/` thiếu, hoặc `alias` thiếu dấu `/` cuối | Bước 9 |
| Nội dung cũ, sửa trong console không ăn | `CONTENT_API` sai/thiếu, hoặc server Go chết | `pm2 restart hoavan-landing --update-env`; `curl 127.0.0.1:8080/health` |
| Form đăng ký lỗi, Network gọi `localhost:9909` | `.env.production.local` lọt lên VPS | Bước 4 rồi build lại |
| pm2 mất app sau reboot | chưa `pm2 save` + `pm2 startup` | Bước 8 |
| `pm2 status` không thấy app dù nó đang chạy | pm2 chạy dưới user khác (root vs user thường là 2 daemon riêng) | dùng đúng user, kiểm bằng `pm2 status` cột `user` |
| Nội dung nhảy qua lại giữa 2 bản khi F5 | pm2 đang chạy cluster nhiều worker | `instances: 1`, `exec_mode: "fork"` |

Log:

```sh
pm2 logs hoavan-landing --lines 100
pm2 flush                              # xoá log cũ khi file phình to
```

---

## Cái gì cần có trên đĩa lúc chạy

```
/var/www/landing/
├── dist/
│   ├── client/     ← BẮT BUỘC, và phải nằm cạnh dist/server
│   └── server/
└── node_modules/   ← BẮT BUỘC
```

`entry.mjs` tìm `dist/client` bằng **đường dẫn tương đối tính từ chính vị trí file
`entry.mjs`** (`resolveClientDir` trong `@astrojs/node`), không phải theo thư mục hiện
hành. Nên: cwd đặt đâu cũng được, nhưng **copy `dist/` thì phải copy cả cụm** — tách
`client` ra chỗ khác, hoặc bê riêng `entry.mjs` sang thư mục không có tên `server` trên
đường dẫn, là adapter ném lỗi *"Could not find the server directory"* ngay lúc start.

`content/`, `src/`, `public/` **không cần** lúc chạy — `content/site.json` và
`content/pages.json` được `import` nên đã nằm sẵn trong bundle làm bản dự phòng khi API
chết. Chúng vẫn cần lúc **build**, nên đừng xoá khỏi repo trên VPS.
