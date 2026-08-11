import type { APIRoute } from "astro";

/**
 * robots.txt sinh từ `site` trong astro.config.mjs thay vì file tĩnh trong public/,
 * để URL sitemap không bao giờ lệch tên miền khi đổi domain.
 *
 * Không chặn /login hay các URL có tham số utm/fbclid: những trang đó đã có
 * `noindex` và canonical trỏ về URL sạch. Chặn crawl sẽ khiến Google không đọc
 * được hai tín hiệu đó, dẫn tới URL vẫn nằm trong index mà không có nội dung.
 */

/**
 * Các bot của công cụ trả lời bằng AI, khai tên tường minh.
 *
 * `User-agent: *` bên dưới đã cho phép hết, nên phần này KHÔNG mở thêm quyền crawl.
 * Nó có hai tác dụng thật:
 *
 * 1. `Google-Extended` và `Applebot-Extended` không phải bot crawl — chúng là token
 *    điều khiển *cách dùng* nội dung đã crawl (Gemini, AI Overviews, Apple
 *    Intelligence). Google và Apple đọc chúng như cơ chế opt-out; khai `Allow: /`
 *    là nói rõ trung tâm đồng ý xuất hiện trong câu trả lời AI. Không khai thì vẫn
 *    được dùng, nhưng khai rồi thì người sau đọc file này biết đó là lựa chọn có ý
 *    thức, không phải quên.
 *
 * 2. Ngày nào muốn chặn một bot cụ thể thì đã có sẵn khối để đổi `Allow` thành
 *    `Disallow`, không phải đi tra lại tên user-agent.
 *
 * Trung tâm sống nhờ người tìm "học tiếng Trung ở đâu" — mà câu đó ngày càng được
 * hỏi trong ChatGPT/Gemini thay vì hộp tìm kiếm. Chặn mấy bot này là tự rút tên khỏi
 * đúng chỗ khách đang hỏi, nên mặc định là cho vào hết.
 */
const AI_AGENTS = [
  // OpenAI: GPTBot lấy dữ liệu, OAI-SearchBot dựng chỉ mục cho ChatGPT Search,
  // ChatGPT-User là lượt truy cập khi người dùng nhờ ChatGPT mở link.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic.
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity — hay dẫn nguồn kèm link, đáng giá nhất trong nhóm này.
  "PerplexityBot",
  "Perplexity-User",
  // Token điều khiển việc dùng nội dung cho AI, không phải bot crawl (xem ghi chú).
  "Google-Extended",
  "Applebot-Extended",
  // Còn lại.
  "meta-externalagent",
  "Amazonbot",
  "Bytespider",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
  // Common Crawl: không phải công cụ tìm kiếm, nhưng là nguồn dữ liệu của rất nhiều
  // mô hình — nội dung vào đây là cách tên trung tâm đi vào tri thức nền của chúng.
  "CCBot",
];

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "";

  const aiBlock = AI_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /`).join("\n\n");

  const body = `User-agent: *
Allow: /

${aiBlock}

# Bản tóm tắt trang dành cho mô hình ngôn ngữ (quy ước llms.txt):
# ${origin}/llms.txt

Sitemap: ${origin}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
