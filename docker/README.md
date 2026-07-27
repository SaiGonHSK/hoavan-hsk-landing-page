# Triển khai bằng Docker

Site là trang tĩnh (Astro build ra `dist/`), container chỉ chạy nginx phục vụ file.

## Chạy nhanh

```sh
docker compose up -d --build
# mở http://localhost:8080
```

## Không dùng compose

```sh
docker build -t hoavan-saigonhsk .
docker run -d --name hoavan-saigonhsk -p 8080:8080 hoavan-saigonhsk
```

## Cập nhật nội dung

```sh
git pull
docker compose up -d --build   # build lại và thay container
```

## Biến môi trường

`PUBLIC_REGISTER_ENDPOINT` được nhúng vào lúc **build**, không phải lúc chạy.
Muốn đổi thì truyền vào bước build:

```sh
docker build --build-arg PUBLIC_REGISTER_ENDPOINT=https://api.example.com/dang-ky -t hoavan-saigonhsk .
```

(kèm `ARG`/`ENV` tương ứng trong Dockerfile nếu bắt đầu dùng biến này)

## Đặt sau reverse proxy

Container nghe cổng `8080` bằng user `nginx` (không phải root). Khi chạy sau
Nginx/Caddy/Traefik của máy chủ, chỉ cần proxy về `http://127.0.0.1:8080` và
xử lý HTTPS ở lớp ngoài. Nhớ trỏ domain thật khớp với `site` trong
`astro.config.mjs` để canonical và sitemap sinh đúng URL.
