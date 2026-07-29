---
name: design-restraint-preference
description: Design preferences for the SaigonHSK landing page — restrained styling, max rounded-lg radius, no decorative effects
metadata:
  type: feedback
---

Trên landing page SaigonHSK, user muốn UI tối giản, có chủ đích: bán kính bo tối đa `rounded-lg` (không `rounded-2xl`/`rounded-3xl`/`[2rem]`), một màu nhấn duy nhất (brand red) thay vì bảng pastel nhiều màu, viền mảnh + khoảng trắng thay cho hiệu ứng trang trí.

**Why:** Khi mình thêm dot-grid background, số watermark khổng lồ, gradient accent bar, progress meter và glow blur vào [Roadmap.astro](src/components/Roadmap.astro), user phản hồi "xấu quá / làm vibe coding quá" — nhiều hiệu ứng cộng dồn bị coi là chắp vá, không phải thiết kế.

**How to apply:** Mặc định dùng thẻ trắng + `border-border` + `rounded-lg`, chữ tiêu đề `font-black` màu ink-900, nhãn phụ in hoa `tracking` rộng màu muted, nút pill viền nhạt (xem [Achievements.astro](src/components/Achievements.astro) và [Courses.astro](src/components/Courses.astro)). Không thêm background pattern, watermark, gradient bar hay blur glow nếu user không yêu cầu. Style tham chiếu user thích: dolenglish.vn.
