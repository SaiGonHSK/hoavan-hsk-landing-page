import type { APIRoute } from "astro";

/**
 * robots.txt sinh từ `site` trong astro.config.mjs thay vì file tĩnh trong public/,
 * để URL sitemap không bao giờ lệch tên miền khi đổi domain.
 *
 * Không chặn /login hay các URL có tham số utm/fbclid: những trang đó đã có
 * `noindex` và canonical trỏ về URL sạch. Chặn crawl sẽ khiến Google không đọc
 * được hai tín hiệu đó, dẫn tới URL vẫn nằm trong index mà không có nội dung.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "";

  const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
