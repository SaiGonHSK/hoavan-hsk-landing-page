import type { MiddlewareHandler } from "astro";

import { refreshContent } from "@/data/refresh";

/**
 * Nạp nội dung mới nhất trước khi render bất kỳ trang nào.
 *
 * Đây là chỗ biến "sửa ở trang quản trị" thành "landing đổi theo": `refreshContent`
 * có cache 60 giây nên gọi mỗi request vẫn rẻ, và nó không bao giờ throw — API chết
 * thì trang render bằng nội dung đang có.
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  await refreshContent();

  const response = await next();

  /*
    Cho reverse proxy / CDN phía trước cache HTML trong 60 giây, khớp với TTL của
    nội dung. `max-age=0` nên trình duyệt vẫn hỏi lại mỗi lần (người soạn F5 là thấy
    ngay), còn `stale-while-revalidate` giữ trang phục vụ được trong lúc bản mới
    đang dựng.

    Chỉ đặt cho HTML: asset trong /_astro/ đã có tên băm và cần cache dài, việc đó
    do proxy lo.
  */
  const isHtml = response.headers.get("content-type")?.includes("text/html");
  if (context.request.method === "GET" && isHtml) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
    );
  }

  return response;
};
