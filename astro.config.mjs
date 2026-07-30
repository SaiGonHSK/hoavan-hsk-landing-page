// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import siteContent from "./content/site.json" with { type: "json" };

/**
 * lastmod lấy theo thời điểm nội dung thật sự được cập nhật, không phải thời điểm
 * build. Nếu mỗi lần deploy đều khai lastmod = hôm nay cho toàn bộ trang, Google sẽ
 * học được rằng tín hiệu này không đáng tin và bỏ qua nó.
 */
const CONTENT_UPDATED_AT = new Date(siteContent.updatedAt);

// Trang tin tức/lịch thay đổi thường xuyên; trang khoá học và giáo trình gần như tĩnh.
const CHANGEFREQ = {
  "": "weekly",
  "/schedule": "weekly",
  "/register": "monthly",
  "/courses": "monthly",
  "/practice": "monthly",
  "/library": "monthly",
  "/trial": "monthly",
};

// https://astro.build/config
export default defineConfig({
  // Bắt buộc để canonical, sitemap và Open Graph sinh ra URL tuyệt đối đúng.
  site: "https://trungtamhoavansaigonhsk.edu.vn",
  integrations: [
    sitemap({
      changefreq: "monthly",
      lastmod: CONTENT_UPDATED_AT,
      // Trang đăng nhập là noindex nên không đưa vào sitemap — sitemap chỉ nên
      // chứa các URL muốn được index, tránh gửi tín hiệu mâu thuẫn.
      filter: (page) => !page.includes("/login"),
      serialize(item) {
        // Trang chủ và các trang chuyển đổi chính được ưu tiên cao hơn.
        const path = new URL(item.url).pathname.replace(/\/$/, "");
        if (path === "") item.priority = 1;
        else if (["/courses", "/register", "/schedule", "/about"].includes(path))
          item.priority = 0.9;
        else if (path.split("/").length === 2) item.priority = 0.8;
        else item.priority = 0.6;

        const changefreq = CHANGEFREQ[path];
        if (changefreq) item.changefreq = changefreq;

        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
