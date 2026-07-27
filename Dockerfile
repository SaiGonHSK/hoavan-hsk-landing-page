# syntax=docker/dockerfile:1

# ---------- Giai đoạn build: cài dependency và build site tĩnh ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Cài dependency trước để tận dụng cache khi chỉ đổi source
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---------- Giai đoạn chạy: nginx phục vụ file tĩnh ----------
FROM nginx:1.27-alpine AS runner

# Cấu hình nginx: gzip, cache asset, trang 404 tiếng Việt
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# Chạy bằng user không phải root
RUN chown -R nginx:nginx /usr/share/nginx/html \
  && touch /var/run/nginx.pid \
  && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
