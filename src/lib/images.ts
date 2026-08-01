import { getImage } from "astro:assets";

/**
 * URL bản phóng to đã nén cho Lightbox.
 * Lightbox chỉ nhận chuỗi src nên không dùng được <Image>; ảnh gốc trong
 * src/assets/ thường vài trăm KB đến vài MB, phải qua đây trước khi mở.
 */
export async function lightboxSrc(src: ImageMetadata, width = 1400) {
  const image = await getImage({ src, width, format: "webp", quality: 80 });
  return image.src;
}
