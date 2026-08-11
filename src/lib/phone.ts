/**
 * Kiểm tra và chuẩn hoá số điện thoại Việt Nam cho form đăng ký tư vấn.
 *
 * Trước đây field này chỉ có `pattern="[0-9\s+().-]{9,}"` — tức chín ký tự bất kỳ
 * trong tập đó là qua. "000000000" hay "+++++++++" đều lọt, và số thiếu một chữ số
 * cũng lọt. Lead sai số thì tư vấn viên gọi không được, mà khách thì tưởng đã đăng
 * ký xong và ngồi đợi.
 */

/**
 * Bỏ khoảng trắng, dấu chấm, gạch, ngoặc và đưa +84/84 về dạng bắt đầu bằng 0.
 *
 * Người Việt gõ số theo đủ kiểu: "0912 345 678", "0912.345.678", "(028) 3822 1234",
 * "+84 912 345 678". Tất cả đều là số hợp lệ, chỉ khác cách viết — chặn chúng là
 * bắt khách sửa cho vừa ý máy.
 */
export function normalizePhone(raw: string): string {
  const compact = raw.replace(/[^\d+]/g, "");

  // +84… và 84… → 0…. Chỉ đổi khi phần còn lại đủ dài, không thì "8412" (số nội bộ
  // ai đó gõ nhầm) bị biến thành "012" rồi báo lỗi ở chỗ khác.
  if (compact.startsWith("+84")) return `0${compact.slice(3)}`;
  if (compact.startsWith("84") && compact.length >= 11) return `0${compact.slice(2)}`;

  return compact;
}

/** Độ dài số di động Việt Nam — cũng là mức chặn cứng của ô nhập. */
export const PHONE_LENGTH = 10;

/**
 * Lọc những gì gõ được vào ô: chỉ chữ số, tối đa 10.
 *
 * Chuẩn hoá TRƯỚC rồi mới cắt, không làm ngược lại: dán "+84912345678" mà cắt trước
 * thì được "8491234567" — mười chữ số, trông như hợp lệ, nhưng là số của người khác.
 * Chuẩn hoá trước cho ra "0912345678" đúng như khách định dán.
 */
export function sanitizePhoneInput(raw: string): string {
  return normalizePhone(raw).replace(/\D/g, "").slice(0, PHONE_LENGTH);
}

/**
 * Số di động Việt Nam: đúng 10 chữ số, đầu 03/05/07/08/09.
 *
 * Không còn nhánh số cố định 11 số (024 Hà Nội, 028 TP.HCM) vì ô nhập đã chặn cứng ở
 * 10 chữ số — giữ lại thì luật ở đây rộng hơn thứ khách gõ được, tức là một nhánh
 * chết. Khách chỉ có số bàn thì gọi hotline hoặc để lại ở ô ghi chú.
 *
 * Cố tình KHÔNG liệt kê bảng đầu số chi tiết (032–039, 070, 076–079…): bảng đó do nhà
 * mạng đổi theo thời gian, khai cứng vào đây thì đầu số mới cấp sẽ bị từ chối và không
 * ai nhớ ra chỗ này để sửa. Luật độ dài + đầu số một chữ đã đủ chặn mọi kiểu gõ sai
 * thật sự: thiếu số, gõ nhầm số nhà, gõ toàn số 0.
 */
const VN_PHONE = /^0[35789]\d{8}$/;

export function isValidPhone(raw: string): boolean {
  return VN_PHONE.test(normalizePhone(raw));
}

/** Lời báo lỗi hiện trong bong bóng của trình duyệt — viết cho khách, không cho dev. */
export const PHONE_ERROR =
  "Số điện thoại chưa đúng. Bạn nhập đủ 10 số, bắt đầu bằng 0 — ví dụ 0912345678.";
