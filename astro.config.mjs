// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Bắt buộc để canonical, sitemap và Open Graph sinh ra URL tuyệt đối đúng.
  site: "https://hoavansaigonhsk.edu.vn",
  integrations: [
    sitemap({
      changefreq: "weekly",
      lastmod: new Date(),
      serialize(item) {
        // Trang chủ và các trang chuyển đổi chính được ưu tiên cao hơn.
        const path = new URL(item.url).pathname.replace(/\/$/, "");
        if (path === "") item.priority = 1;
        else if (["/courses", "/register", "/schedule", "/about"].includes(path))
          item.priority = 0.9;
        else if (path.split("/").length === 2) item.priority = 0.8;
        else item.priority = 0.6;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
