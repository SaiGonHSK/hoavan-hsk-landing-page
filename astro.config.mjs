// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import siteContent from "./content/site.json" with { type: "json" };

/**
 * Đưa `CONTENT_API` từ `.env` vào `process.env` khi chạy dev/build.
 *
 * Vite chỉ nạp biến có tiền tố `PUBLIC_` vào `import.meta.env`, còn biến không tiền
 * tố thì không tự vào `process.env` — nên nếu không có mấy dòng này, đặt
 * `CONTENT_API` trong `.env` sẽ *không có tác dụng gì* và người sửa phải tự đoán tại
 * sao. File cấu hình chạy cùng process với dev server nên gán ở đây là đủ.
 *
 * `??=` để biến thật của môi trường (systemd, docker, `CONTENT_API=… yarn dev`) luôn
 * thắng `.env`. Lúc chạy production thì file này không tham gia, `entry.mjs` đọc
 * thẳng biến môi trường.
 */
const fileEnv = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
process.env.CONTENT_API ??= fileEnv.CONTENT_API;

/**
 * lastmod lấy theo thời điểm nội dung thật sự được cập nhật, không phải thời điểm
 * build. Nếu mỗi lần deploy đều khai lastmod = hôm nay cho toàn bộ trang, Google sẽ
 * học được rằng tín hiệu này không đáng tin và bỏ qua nó.
 *
 * Vẫn đọc từ file trong repo dù nội dung thật đã chuyển sang API: file cấu hình chỉ
 * chạy một lần lúc build, không có cách nào lấy giá trị theo từng request. Sitemap
 * là tín hiệu cho crawler chứ không phải nội dung người xem, nên chấp nhận nó cũ
 * hơn thực tế — trang vẫn khai `dateModified` đúng qua `contentUpdatedAt`.
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

  /*
    Render tại server thay vì build tĩnh.

    Nội dung do trang quản trị soạn, nên trang phải dựng lúc có người xem mới lấy
    được bản mới nhất — build tĩnh thì mỗi lần sửa một câu chữ đều phải deploy lại.
    HTML vẫn được sinh ở server nên SEO không đổi; `src/middleware.ts` cache nội
    dung 60 giây và đặt `s-maxage` cho proxy phía trước, nên chi phí render không
    tăng theo lượng truy cập.
  */
  output: "server",
  adapter: node({ mode: "standalone" }),

  integrations: [
    sitemap({
      changefreq: "monthly",
      lastmod: CONTENT_UPDATED_AT,
      // Trang đăng nhập là noindex nên không đưa vào sitemap — sitemap chỉ nên
      // chứa các URL muốn được index, tránh gửi tín hiệu mâu thuẫn. `/hero-v3` là
      // trang xem thử phương án hero, cũng noindex; xoá cả trang và dòng này khi
      // chốt phương án.
      filter: (page) => !page.includes("/login") && !page.includes("/hero-v3"),
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
