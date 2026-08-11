#!/usr/bin/env bash
#
# Phát hành landing lên VPS. Chạy **trên VPS, bằng root**, không chạy trên máy dev.
#
#   sudo ./scripts/deploy.sh
#   sudo ./scripts/deploy.sh --no-pull        # dùng đúng code đang có, không git pull
#   sudo ./scripts/deploy.sh --keep 5         # giữ 5 bản cũ thay vì 3
#   sudo ./scripts/deploy.sh --no-verify      # bỏ bước kiểm schema (không khuyến khích)
#
# Script làm đúng quy trình ở README §Deploy, thêm hai thứ mà làm tay không có:
#
# 1. **Tự rollback.** Lý do giữ bản cũ là để lùi lại được, nhưng làm tay thì lúc bản mới
#    lỗi là lúc bạn phải nhớ ra cú pháp `mv -T` dưới áp lực. Ở đây bản mới phải trả HTTP
#    200 mới được giữ; không thì symlink tự trỏ về bản trước và service restart lại.
#
# 2. **Cổng kiểm trước khi đổi bản đang chạy.** `grep localhost:9909` và `yarn build`
#    chạy xong hết mới tới `mv -T`. Build lỗi thì site đang chạy không bị đụng tới.
#
# Hai việc CHỈ LÀM MỘT LẦN, script này không làm (và không nên làm — chúng sửa cấu hình
# hệ thống, không phải phát hành nội dung):
#
#   - systemd unit `/etc/systemd/system/hoavan-landing.service` — README dòng 130.
#   - vhost nginx: bỏ `root` + `try_files`, đổi sang `proxy_pass` — README dòng 152.
#     Chưa làm bước này thì site vẫn phục vụ file tĩnh của bản cũ, và mọi URL sai trả
#     HTTP 200 kèm trang chủ. Script cảnh báo ở cuối nếu phát hiện tình trạng đó.

set -euo pipefail

# ── Cấu hình ────────────────────────────────────────────────────────────

# Đổi được bằng biến môi trường, ví dụ: SERVICE=hoavan-staging ./scripts/deploy.sh
REPO="${REPO:-/var/www/hoavan-hsk-landing-page}"
RELEASES="${RELEASES:-/var/www/hoavan-releases}"
CURRENT="${CURRENT:-/var/www/hoavan-current}"
SERVICE="${SERVICE:-hoavan-landing}"
OWNER="${OWNER:-www-data:www-data}"
# Phải khớp `Environment=PORT=` trong systemd unit — script dùng để kiểm sức khoẻ.
PORT="${PORT:-4321}"
PUBLIC_URL="${PUBLIC_URL:-https://trungtamhoavansaigonhsk.edu.vn}"

KEEP=3
DO_PULL=1
DO_VERIFY=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-pull)   DO_PULL=0; shift ;;
    --no-verify) DO_VERIFY=0; shift ;;
    --keep)      KEEP="${2:?--keep cần một con số}"; shift 2 ;;
    -h|--help)   sed -n '2,26p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)           echo "Tham số không hiểu: $1 (xem --help)" >&2; exit 2 ;;
  esac
done

say()  { printf '\n\033[1m▸ %s\033[0m\n' "$*"; }
warn() { printf '\033[33m!  %s\033[0m\n' "$*"; }
die()  { printf '\033[31m✗  %s\033[0m\n' "$*" >&2; exit 1; }

# ── Kiểm điều kiện trước khi động vào gì ────────────────────────────────

say "Kiểm điều kiện"

# `mv -T` là coreutils của GNU; macOS không có, và chạy script này trên máy dev thì
# `systemctl` cũng không tồn tại. Chặn sớm cho rõ ràng thay vì lỗi giữa đường.
[[ "$(uname -s)" == "Linux" ]] || die "Script này chỉ chạy trên Linux (VPS), không chạy trên máy dev."
[[ "$(id -u)" == "0" ]]        || die "Cần root: chown, symlink trong /var/www và systemctl đều cần. Dùng sudo."

[[ -d "$REPO/.git" ]] || die "Không thấy repo ở $REPO (đặt biến REPO nếu nằm chỗ khác)."
command -v yarn >/dev/null   || die "Không có yarn trong PATH của root."
command -v node >/dev/null   || die "Không có node trong PATH của root."
systemctl cat "$SERVICE" >/dev/null 2>&1 \
  || die "Chưa có systemd unit '$SERVICE'. Tạo theo README dòng 130 trước khi deploy lần đầu."

# Astro 6 cần Node ≥ 22.12; bản cũ hơn build được nhưng lỗi lúc chạy, rất khó đoán.
node_major="$(node -p 'process.versions.node.split(".")[0]')"
node_minor="$(node -p 'process.versions.node.split(".")[1]')"
if (( node_major < 22 || (node_major == 22 && node_minor < 12) )); then
  die "Node $(node -v) quá cũ, cần ≥ 22.12."
fi

mkdir -p "$RELEASES"

# ── Build (chưa đụng tới bản đang chạy) ─────────────────────────────────

cd "$REPO"

if (( DO_PULL )); then
  say "git pull"
  git pull --ff-only
else
  warn "Bỏ qua git pull — deploy đúng code đang có ở $REPO."
fi
echo "   commit: $(git rev-parse --short HEAD) — $(git log -1 --format=%s)"

say "yarn install"
# --frozen-lockfile: dùng đúng yarn.lock. Không có nó thì một phiên bản phụ thuộc đổi
# âm thầm và bản trên VPS khác bản đã test ở máy dev.
yarn install --frozen-lockfile

say "yarn build"
yarn build

# Cổng kiểm: endpoint phải là đường dẫn tương đối. Nếu `localhost:9909` lọt vào bundle
# thì form đăng ký của khách sẽ gọi vào máy của chính họ — hỏng im lặng, không ai báo.
say "Kiểm bundle không chứa localhost:9909"
if grep -rl 'localhost:9909' dist/client/ 2>/dev/null | head -5 | grep -q .; then
  grep -rl 'localhost:9909' dist/client/ | head -5
  die "Bundle chứa localhost:9909 — kiểm .env.production rồi build lại."
fi
echo "   sạch."

# ── Tạo bản phát hành ───────────────────────────────────────────────────

REL="$RELEASES/$(date +%Y%m%d-%H%M%S)"
say "Tạo bản phát hành $REL"

mkdir -p "$REL/dist"
cp -r dist/. "$REL/dist/"
# Adapter standalone cần dependency lúc chạy. Đây là bước chậm nhất (vài trăm MB);
# `cp -r` chứ không hardlink vì `yarn install` lần sau có thể ghi đè file, và hardlink
# sẽ làm bản cũ đổi theo — mất luôn ý nghĩa của việc giữ bản cũ để rollback.
cp -r node_modules "$REL/"
chown -R "$OWNER" "$REL"
echo "   $(du -sh "$REL" | cut -f1)"

# Ghi lại bản đang chạy TRƯỚC khi đổi, để rollback biết lùi về đâu.
PREVIOUS=""
if [[ -L "$CURRENT" ]]; then
  PREVIOUS="$(readlink -f "$CURRENT")"
  echo "   bản hiện tại: $PREVIOUS"
elif [[ -e "$CURRENT" ]]; then
  die "$CURRENT đang là thư mục thật, không phải symlink. Xử lý tay trước (xem README dòng 113)."
else
  warn "Chưa có $CURRENT — đây là lần phát hành đầu, sẽ không rollback được."
fi

# ── Đổi bản đang chạy ───────────────────────────────────────────────────

rollback() {
  if [[ -z "$PREVIOUS" ]]; then
    warn "Không có bản trước để lùi về. Bản mới vẫn đang được trỏ tới, service có thể đang lỗi."
    return
  fi
  warn "Lùi về $PREVIOUS"
  ln -sfn "$PREVIOUS" "$CURRENT.rollback"
  mv -T "$CURRENT.rollback" "$CURRENT"
  systemctl restart "$SERVICE" || warn "restart lúc rollback cũng lỗi — kiểm journalctl -u $SERVICE"
  warn "Đã lùi. Bản lỗi còn ở $REL để xem lại."
}

say "Đổi symlink và restart $SERVICE"

# `ln` rồi `mv -T` chứ không `ln -sfn` thẳng vào $CURRENT: `mv -T` trên symlink là atomic,
# nên không có khoảnh khắc nào web root trỏ vào chỗ nửa vời.
ln -sfn "$REL" "$CURRENT.new"
mv -T "$CURRENT.new" "$CURRENT"

# Từ đây trở đi, mọi lỗi đều phải lùi lại.
trap rollback ERR

systemctl restart "$SERVICE"

# ── Kiểm sức khoẻ ───────────────────────────────────────────────────────

say "Kiểm service trả lời trên 127.0.0.1:$PORT"

ok=0
for _ in $(seq 1 30); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/" || true)"
  if [[ "$code" == "200" ]]; then ok=1; break; fi
  sleep 1
done
(( ok )) || die "Service không trả 200 sau 30 giây (lần cuối: ${code:-không kết nối được}). Xem: journalctl -u $SERVICE -n 50"
echo "   HTTP 200."

if (( DO_VERIFY )); then
  say "Kiểm dữ liệu có cấu trúc"
  # Chạy scripts/check-schema.mjs từ repo, trỏ vào bản vừa phát hành. Nó bắt JSON-LD
  # không parse được, @id lệch, URL trong schema trả 404, và /llms.txt trả sai kiểu nội
  # dung — toàn bộ là lỗi trang vẫn hiển thị bình thường nên không ai thấy.
  node "$REPO/scripts/check-schema.mjs" "http://127.0.0.1:$PORT"
fi

trap - ERR

# ── Dọn bản cũ ──────────────────────────────────────────────────────────

say "Dọn bản cũ, giữ $KEEP bản"

# Tên thư mục là timestamp nên sort theo chữ ra đúng thứ tự thời gian. Không bao giờ xoá
# bản đang chạy hay bản trước nó, bất kể $KEEP nhỏ tới đâu.
#
# `while read` + process substitution chứ không `mapfile`: mapfile là bash 4, và một
# script deploy không nên phụ thuộc phiên bản bash. Process substitution (không phải
# pipe) để `kept` giữ được giá trị giữa các vòng — qua pipe thì thân vòng lặp chạy trong
# subshell và biến đếm luôn về 0.
# Canonical hoá cả hai phía trước khi so chuỗi. `$abs` luôn đi qua `readlink -f`, nên
# nếu phía kia chưa canonical (một mắt xích trong đường dẫn là symlink, ví dụ /var →
# /private/var) thì hai chuỗi khác nhau dù trỏ cùng thư mục — nhánh bảo vệ lặng lẽ
# không khớp và bản dùng để rollback bị xoá. Test tay bắt được đúng ca này.
current_abs="$(readlink -f "$CURRENT")"
previous_abs="${PREVIOUS:+$(readlink -f "$PREVIOUS" 2>/dev/null || echo "$PREVIOUS")}"
kept=0
while IFS= read -r dir; do
  abs="$(readlink -f "$dir")"
  if [[ "$abs" == "$current_abs" || ( -n "$previous_abs" && "$abs" == "$previous_abs" ) ]]; then
    continue
  fi
  if (( kept < KEEP )); then
    kept=$((kept + 1))
    continue
  fi
  echo "   xoá $dir"
  rm -rf "$dir"
done < <(find "$RELEASES" -mindepth 1 -maxdepth 1 -type d | sort -r)

# ── Kiểm ngoài: vhost đã chuyển sang proxy_pass chưa ────────────────────

say "Kiểm site công khai"

# Cảnh báo, không phải lỗi: phát hành đã xong và service đã tốt. Nhưng nếu nginx còn
# `root` + `try_files` thì khách vẫn thấy bản tĩnh cũ, và cách nhận ra là URL sai trả
# HTTP 200 thay vì 404.
missing_code="$(curl -s -o /dev/null -w '%{http_code}' -m 15 "$PUBLIC_URL/khong-ton-tai-$(date +%s)" || echo "")"
llms_type="$(curl -s -o /dev/null -w '%{content_type}' -m 15 "$PUBLIC_URL/llms.txt" || echo "")"

if [[ "$missing_code" == "200" ]]; then
  warn "URL không tồn tại trả HTTP 200 → nginx vẫn phục vụ file tĩnh."
  warn "Đổi vhost sang proxy_pass http://127.0.0.1:$PORT (README dòng 152), rồi: nginx -t && systemctl reload nginx"
elif [[ "$missing_code" == "404" ]]; then
  echo "   URL sai trả 404 — vhost đã proxy về node."
else
  warn "URL sai trả HTTP ${missing_code:-không kết nối được} — kiểm lại bằng tay."
fi

if [[ "$llms_type" != *"text/plain"* ]]; then
  warn "/llms.txt trả Content-Type '${llms_type:-không có}', đúng phải là text/plain."
else
  echo "   /llms.txt đúng text/plain."
fi

say "Xong — đang chạy $(readlink -f "$CURRENT")"
