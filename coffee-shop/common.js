/* ==========================================================
   THANH TÂN Coffee – dữ liệu & hàm dùng chung (trang chủ + trang thử nghiệm)
   Nhận diện theo "Bộ nhận diện thương hiệu THANH TÂN":
   nâu đất + trắng ngà là chủ đạo; xanh cà phê + vàng đồng chỉ làm điểm nhấn.
   LƯU Ý: giá bán, tỉ lệ giảm giá gói định kỳ, mã lô và ngưỡng freeship
   bên dưới là DỮ LIỆU DEMO – thay bằng số thật trước khi chạy chính thức.
   ========================================================== */

const C = {
  ink: "#3A1F0D",      // nâu đậm (nền bản đảo của logo)
  brown: "#6B3410",    // Nâu Đất Bazan
  forest: "#3D5C34",   // Xanh Cà Phê Tươi
  paper: "#F5EFE0",    // Trắng Ngà
  cream: "#EBE1CA",    // tông đậm hơn của Trắng Ngà
  gold: "#C9A227",     // Vàng Đồng
};
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = (n) => n.toLocaleString("vi-VN") + "đ";
const round = (n) => Math.round(n / 1000) * 1000;

/* ---------- Biểu tượng THANH TÂN: hạt cà phê ôm mầm lá non ---------- */
function markSVG(c) {
  return `<circle cx="50" cy="50" r="46" fill="none" stroke="${c.ring}" stroke-width="2.2"/>
    <ellipse cx="50" cy="50" rx="22" ry="26" fill="${c.bean}" stroke="${c.ring}" stroke-width="2.2"/>
    <path d="M50 24C58 32 58 44 50 54C42 44 42 32 50 24Z" fill="${c.leaf}"/>
    <path d="M50 54C52 63 51 71 49 76" stroke="${c.stem}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="M29 52Q50 42 71 52" stroke="${c.arc}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
}
const MARK_LIGHT = { ring: C.brown, bean: C.paper, leaf: C.gold, stem: C.brown, arc: C.gold };      // bản chính – nền sáng
const MARK_DARK = { ring: C.paper, bean: "none", leaf: C.gold, stem: C.paper, arc: C.gold };        // bản đảo – nền tối

/* ---------- DỮ LIỆU: 4 dòng sản phẩm ---------- */
const SIZES = {
  bean: [{ label: "250g", m: 1 }, { label: "500g", m: 1.9 }, { label: "1kg", m: 3.6 }],
  rtd: [{ label: "1 lon", m: 1 }, { label: "Lốc 6", m: 5.5 }],
};

// look: màu bao bì. Nền bao bì luôn là nâu đất hoặc trắng ngà, mỗi dòng có một màu điểm nhấn riêng.
const products = [
  { id: 1, line: "NGUYÊN BẢN", cat: "bean", name: "Thanh Tân Nguyên Bản", origin: "Robusta Buôn Ma Thuột · Rang mộc",
    flavor: ["Đậm đà", "Rang mộc", "Vị truyền thống"], body: 5, trad: 4, notes: "Đậm vị truyền thống, dành cho người yêu cà phê phin đậm đà.", price: 165000, sizes: "bean", bg: C.cream,
    look: { body: C.brown, band: C.ink, text: C.paper, sub: "#D9C7A5", mark: MARK_DARK, shape: "pouch" } },
  { id: 2, line: "THƯỢNG HẠNG", cat: "bean", name: "Thanh Tân Thượng Hạng", origin: "Arabica Cầu Đất pha Robusta Buôn Ma Thuột",
    flavor: ["Thơm tinh tế", "Hậu ngọt dịu", "Arabica Cầu Đất"], body: 3, trad: 2.5, notes: "Hương thơm tinh tế, hậu vị ngọt dịu.", price: 195000, sizes: "bean", bg: C.brown,
    look: { body: C.paper, band: C.gold, text: C.brown, sub: "#8A6A4D", mark: MARK_LIGHT, shape: "pouch" } },
  { id: 3, line: "CỔ TRUYỀN", cat: "bean", name: "Thanh Tân Cổ Truyền", origin: "Rang xay kiểu phin truyền thống",
    flavor: ["Phin truyền thống", "Hoài cổ", "Rang xay"], body: 4, trad: 5, notes: "Đóng gói hoài cổ, gợi nhớ hương vị cà phê xưa.", price: 135000, sizes: "bean", bg: C.gold,
    look: { body: C.paper, band: C.forest, text: C.brown, sub: "#7A5A43", mark: MARK_LIGHT, shape: "pouch" } },
  { id: 4, line: "TƯƠI MỚI", cat: "rtd", name: "Thanh Tân Tươi Mới", origin: "Cold Brew đóng lon",
    flavor: ["Cold brew", "Thanh mát", "Mở lon là uống"], body: 2, trad: 1, notes: "Trẻ trung, tiện lợi, dành cho người trẻ đô thị năng động.", price: 45000, sizes: "rtd", bg: C.forest,
    look: { body: C.paper, band: C.forest, text: C.brown, sub: "#7A5A43", mark: MARK_LIGHT, shape: "can" } },
];


/* ---------- ICON nét mảnh (thay emoji, theo bảng màu) ---------- */
const ico = (d) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  phin: ico('<path d="M5 9h14l-1.5 4h-11z"/><path d="M7 13v3h10v-3"/><path d="M9 5h6"/><path d="M12 16v4"/>'),
  espresso: ico('<circle cx="12" cy="12" r="8"/><path d="M12 12l3.5-3.5"/><path d="M8 16h8"/>'),
  pour: ico('<path d="M6 8h12l-1.2 9a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7z"/><path d="M18 10h1.5a2 2 0 0 1 0 4H17.5"/><path d="M9 4.5c0 1 1 1 1 2M13 4.5c0 1 1 1 1 2"/>'),
  cold: ico('<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M5 10l7-2 7 2"/><path d="M9 14l2 1"/>'),
  bold: ico('<ellipse cx="12" cy="12" rx="6" ry="8" transform="rotate(25 12 12)"/><path d="M9.5 6.5c3 3 2 8 5 11"/>'),
  light: ico('<path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14z"/><path d="M5 19l8-8"/>'),
  classic: ico('<path d="M7 4h10M7 20h10"/><path d="M8 4c0 5 8 5 8 8s-8 3-8 8M16 4c0 5-8 5-8 8s8 3 8 8"/>'),
  milk: ico('<path d="M12 4c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 10.500 9 8 12 4z"/>'),
  black: ico('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3" fill="currentColor"/>'),
  tip: ico('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.500 10.900c.6.5 1 1.200 1 2.100h5c0-.9.4-1.600 1-2.100A6 6 0 0 0 12 3z"/>'),
  truck: ico('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>'),
  check: ico('<path d="M5 12.500l4.500 4.500L19 7.500"/>'),
};

let bagUid = 0;
function bagSVG(p) {
  const L = p.look;
  const mark = (y) => `<g transform="translate(70 ${y}) scale(.6)">${markSVG(L.mark)}</g>`;
  if (L.shape === "can") {
    return `<svg viewBox="0 0 200 260" aria-hidden="true">
      <rect x="20" y="14" width="160" height="18" rx="4" fill="${L.band}"/>
      <rect x="24" y="30" width="152" height="208" rx="12" fill="${L.body}" stroke="${L.text}" stroke-opacity=".3" stroke-width="1.2"/>
      <rect x="20" y="236" width="160" height="14" rx="4" fill="${L.band}"/>
      <rect x="36" y="44" width="128" height="180" rx="8" fill="none" stroke="${L.text}" stroke-opacity=".18"/>
      ${mark(66)}
      <text x="100" y="150" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-weight="800" font-size="15" letter-spacing="3" fill="${L.text}">THANH TÂN</text>
      <text x="100" y="168" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-weight="600" font-size="8.5" letter-spacing="2.2" fill="${L.sub}">${p.line}</text>
      <text x="100" y="206" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-weight="600" font-size="7" letter-spacing="1.6" fill="${L.sub}">COLD BREW</text>
    </svg>`;
  }
  const crimp = [18, 22, 26, 30, 34, 38].map((y) => `<line x1="22" x2="178" y1="${y}" y2="${y}" stroke="#000" stroke-opacity=".14"/>`).join("");
  return `<svg viewBox="0 0 200 260" aria-hidden="true">
    <rect x="22" y="14" width="156" height="30" rx="7" fill="${L.band}"/>
    ${crimp}
    <rect x="22" y="36" width="156" height="214" rx="24" fill="${L.body}" stroke="${L.text}" stroke-opacity=".3" stroke-width="1.2"/>
    <rect x="22" y="36" width="156" height="8" fill="${L.band}" opacity=".35"/>
    <rect x="34" y="56" width="132" height="182" rx="16" fill="none" stroke="${L.text}" stroke-opacity=".2"/>
    ${mark(74)}
    <text x="100" y="156" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-weight="800" font-size="15" letter-spacing="3" fill="${L.text}">THANH TÂN</text>
    <text x="100" y="174" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-weight="600" font-size="8.5" letter-spacing="2.2" fill="${L.sub}">${p.line}</text>
    <text x="100" y="226" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-weight="600" font-size="7" letter-spacing="1.4" fill="${L.sub}">BUÔN MA THUỘT · ĐẮK LẮK</text>
  </svg>`;
}

/* ---------- DỮ LIỆU: vùng đất (kể chuyện nguồn gốc) ---------- */
const origins = [
  { code: "BMT", name: "Buôn Ma Thuột", region: "Đắk Lắk", alt: "500m", soil: "Đất đỏ bazan", variety: "Robusta", products: "Nguyên Bản · Cổ Truyền", productId: 1,
    story: "Thủ phủ cà phê Việt Nam – nơi đất đỏ bazan ôm ấp từng gốc cà phê qua bao thế hệ nông dân Tây Nguyên. Robusta Buôn Ma Thuột là nền của dòng Nguyên Bản: rang mộc, giữ trọn vị đậm truyền thống.",
    quote: "Từ đất bazan, thanh tân vạn dặm.",
    sky: "#F3E6C8", sun: C.gold, hills: ["#B9783F", C.brown, C.ink], peaks: [0.35, 0.45, 0.3, 0.5, 0.4] },
  { code: "CD", name: "Cầu Đất", region: "Đà Lạt, Lâm Đồng", alt: "1.600m", soil: "Cao nguyên mát lạnh", variety: "Arabica", products: "Thượng Hạng", productId: 2,
    story: "Arabica Cầu Đất mang đến hương thơm tinh tế và hậu vị ngọt dịu. Phối cùng Robusta Buôn Ma Thuột, hai vùng đất gặp nhau trong dòng Thượng Hạng.",
    quote: "Nguyên chất từ đất, thanh tân từ tâm.",
    sky: "#E4EBD8", sun: C.paper, hills: ["#8FA884", C.forest, "#223A1C"], peaks: [0.55, 0.85, 0.6, 0.95, 0.7] },
];

function hillPath(peaks, base, amp, color, offset) {
  const w = 600, step = w / (peaks.length - 1);
  let d = `M-20 440 L-20 ${base - peaks[0] * amp}`;
  peaks.forEach((p, i) => {
    if (!i) return;
    const x = i * step + offset, px = (i - 1) * step + offset;
    d += ` Q${px + step / 2} ${base - p * amp * 1.25} ${x} ${base - p * amp}`;
  });
  return `<path d="${d} L620 440Z" fill="${color}"/>`;
}

function landscapeSVG(o) {
  const rev = [...o.peaks].reverse();
  const rows = [...Array(7)].map((_, r) => [...Array(12)].map((_, c) =>
    `<circle cx="${c * 54 + (r % 2) * 27 - 10}" cy="${350 + r * 16}" r="${6 + r}" fill="rgba(0,0,0,.18)"/>`).join("")).join("");
  return `<svg viewBox="0 0 600 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="600" height="440" fill="${o.sky}"/>
    <circle cx="430" cy="120" r="54" fill="${o.sun}"/>
    ${hillPath(o.peaks, 260, 180, o.hills[0], 0)}
    ${hillPath(rev, 320, 130, o.hills[1], -40)}
    ${hillPath(o.peaks.map((p) => p * 0.5), 380, 90, o.hills[2], 20)}
    ${rows}
  </svg>`;
}

/* ---------- DỮ LIỆU: cách pha ---------- */
const brews = [
  { icon: ICON.phin, name: "Phin", color: C.gold, rows: [["Tỉ lệ", "20g : 100ml"], ["Nhiệt độ", "92–94°C"], ["Độ xay", "Vừa – thô"], ["Thời gian", "4–5 phút"]], tip: "Ủ 20ml nước 30 giây cho hạt nở rồi mới rót tiếp. Hợp Nguyên Bản và Cổ Truyền." },
  { icon: ICON.pour, name: "Pour-over", color: "#B9C9B0", rows: [["Tỉ lệ", "15g : 250ml"], ["Nhiệt độ", "92–93°C"], ["Độ xay", "Vừa – mịn"], ["Thời gian", "2:30–3:00"]], tip: "Rót xoắn ốc 3 lần, hợp dòng Thượng Hạng." },
  { icon: ICON.espresso, name: "Espresso", color: "#D9B38C", rows: [["Tỉ lệ", "18g → 36g"], ["Nhiệt độ", "93°C"], ["Độ xay", "Mịn"], ["Thời gian", "25–30 giây"]], tip: "Để hạt nghỉ 7 ngày sau rang. Hợp dòng Thượng Hạng." },
  { icon: ICON.cold, name: "Cold brew", color: C.cream, rows: [["Tỉ lệ", "100g : 1L"], ["Nước", "Lạnh / thường"], ["Độ xay", "Thô"], ["Thời gian", "16–18 giờ"]], tip: "Ủ trong tủ lạnh, lọc 2 lần, giữ được 7 ngày. Ngại ủ? Đã có dòng Tươi Mới đóng lon." },
];
