/* ==========================================================
   THANH TÂN Coffee – dữ liệu & tương tác
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
    flavor: ["Đậm đà", "Rang mộc", "Vị truyền thống"], body: 5, notes: "Đậm vị truyền thống, dành cho người yêu cà phê phin đậm đà.", price: 165000, sizes: "bean", bg: C.cream,
    look: { body: C.brown, band: C.ink, text: C.paper, sub: "#D9C7A5", mark: MARK_DARK, shape: "pouch" } },
  { id: 2, line: "THƯỢNG HẠNG", cat: "bean", name: "Thanh Tân Thượng Hạng", origin: "Arabica Cầu Đất pha Robusta Buôn Ma Thuột",
    flavor: ["Thơm tinh tế", "Hậu ngọt dịu", "Arabica Cầu Đất"], body: 3, notes: "Hương thơm tinh tế, hậu vị ngọt dịu.", price: 195000, sizes: "bean", bg: C.brown,
    look: { body: C.paper, band: C.gold, text: C.brown, sub: "#8A6A4D", mark: MARK_LIGHT, shape: "pouch" } },
  { id: 3, line: "CỔ TRUYỀN", cat: "bean", name: "Thanh Tân Cổ Truyền", origin: "Rang xay kiểu phin truyền thống",
    flavor: ["Phin truyền thống", "Hoài cổ", "Rang xay"], body: 4, notes: "Đóng gói hoài cổ, gợi nhớ hương vị cà phê xưa.", price: 135000, sizes: "bean", bg: C.gold,
    look: { body: C.paper, band: C.forest, text: C.brown, sub: "#7A5A43", mark: MARK_LIGHT, shape: "pouch" } },
  { id: 4, line: "TƯƠI MỚI", cat: "rtd", name: "Thanh Tân Tươi Mới", origin: "Cold Brew đóng lon",
    flavor: ["Cold brew", "Thanh mát", "Mở lon là uống"], body: 2, notes: "Trẻ trung, tiện lợi, dành cho người trẻ đô thị năng động.", price: 45000, sizes: "rtd", bg: C.forest,
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

/* ==========================================================
   HERO
   ========================================================== */
$("#heroBags").innerHTML = [products[1], products[0], products[2]].map(bagSVG).join("");

/* ==========================================================
   SHOP
   ========================================================== */
const grid = $("#productGrid");
const priceOf = (p, i) => round(p.price * SIZES[p.sizes][i].m);

function cardHTML(p, i = 0) {
  const sizes = SIZES[p.sizes];
  return `<article class="card" style="animation-delay:${i * 50}ms" data-id="${p.id}">
    <div class="card__media" style="--disc:${p.bg}">${bagSVG(p)}</div>
    <span class="card__origin">${p.origin}</span>
    <h3>${p.name}</h3>
    <p class="card__notes">${p.notes}</p>
    <ul class="card__tags">${p.flavor.map((t) => `<li>${t}</li>`).join("")}</ul>
    <div class="card__meter" role="img" aria-label="Độ đậm ${p.body} trên 5"><span>Độ đậm</span><i>${[1, 2, 3, 4, 5].map((n) => `<b class="${n <= p.body ? "on" : ""}"></b>`).join("")}</i></div>
    <div class="card__buy">
      ${sizes.length > 1 ? `<select aria-label="Chọn khối lượng">${sizes.map((s, k) => `<option value="${k}">${s.label}</option>`).join("")}</select>` : ""}
      <button class="card__add"><span>Thêm</span><b>${fmt(p.price)}</b></button>
    </div>
  </article>`;
}

function renderShop(filter = "all") {
  const list = filter === "all" ? products : products.filter((p) => p.cat === filter);
  grid.innerHTML = list.map(cardHTML).join("");
}
renderShop();

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  $$(".chip", $("#filters")).forEach((x) => x.classList.toggle("active", x === b));
  renderShop(b.dataset.filter);
});

grid.addEventListener("change", (e) => {
  if (!e.target.matches("select")) return;
  const card = e.target.closest(".card");
  const p = products.find((x) => x.id === +card.dataset.id);
  $(".card__add b", card).textContent = fmt(priceOf(p, +e.target.value));
});

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".card__add");
  if (!btn) return;
  const card = btn.closest(".card");
  const sel = $("select", card);
  addProduct(+card.dataset.id, sel ? +sel.value : 0);
});

/* ==========================================================
   CART (lưu localStorage, thanh tiến độ freeship)
   ========================================================== */
const FREESHIP = 300000;
let cart = [];
try { cart = JSON.parse(localStorage.getItem("thanhtan-cart-v1")) || []; } catch { cart = []; }
const save = () => { try { localStorage.setItem("thanhtan-cart-v1", JSON.stringify(cart)); } catch {} };

function addItem(item) {
  const found = cart.find((x) => x.key === item.key);
  found ? found.qty++ : cart.push({ ...item, qty: 1 });
  renderCart();
  const b = $("#cartCount");
  b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  toast(`Đã thêm ${item.name} (${item.sub})`);
}

function addProduct(id, sizeIdx) {
  const p = products.find((x) => x.id === id);
  addItem({ key: `${id}-${sizeIdx}`, pid: id, name: p.name, sub: SIZES[p.sizes][sizeIdx].label, price: priceOf(p, sizeIdx) });
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = fmt(total);
  const left = FREESHIP - total;
  $("#shipText").textContent = left > 0 ? `Mua thêm ${fmt(left)} để được freeship` : "Bạn đã được freeship";
  $("#shipBar").style.width = Math.min(100, (total / FREESHIP) * 100) + "%";
  $("#cartItems").innerHTML = cart.length
    ? cart.map((i) => {
        const p = products.find((x) => x.id === i.pid) || products[0];
        return `<div class="citem">
          <div class="citem__img" style="background:${p.bg}">${bagSVG(p)}</div>
          <div><h4>${i.name}</h4><small>${i.sub}</small>
            <div class="qty"><button data-act="dec" data-key="${i.key}" aria-label="Giảm">−</button><span>${i.qty}</span><button data-act="inc" data-key="${i.key}" aria-label="Tăng">+</button></div>
          </div>
          <div class="citem__price">${fmt(i.price * i.qty)}<button data-act="del" data-key="${i.key}">Xoá</button></div>
        </div>`;
      }).join("")
    : `<div class="cart__empty"><b>Giỏ hàng trống</b>Chọn một dòng cà phê Thanh Tân nhé.</div>`;
  save();
}

$("#cartItems").addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const it = cart.find((x) => x.key === b.dataset.key);
  if (b.dataset.act === "inc") it.qty++;
  if (b.dataset.act === "dec") it.qty--;
  if (b.dataset.act === "del" || it.qty < 1) cart = cart.filter((x) => x.key !== it.key);
  renderCart();
});

const openCart = () => { $("#cart").classList.add("open"); $("#overlay").classList.add("show"); };
const closeCart = () => { $("#cart").classList.remove("open"); $("#overlay").classList.remove("show"); };
$("#cartBtn").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());
$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return toast("Giỏ hàng đang trống");
  cart = []; renderCart(); closeCart();
  toast("Cảm ơn bạn! Thanh Tân sẽ liên hệ xác nhận đơn hàng.");
});
renderCart();

/* ==========================================================
   QUIZ – tìm gu
   ========================================================== */
const quiz = [
  { q: "Bạn thường pha cà phê bằng gì?", key: "tool", opts: [[ICON.phin, "Phin", "phin"], [ICON.espresso, "Máy espresso", "espresso"], [ICON.pour, "Pour-over / V60", "pour"], [ICON.cold, "Lười – uống liền", "rtd"]] },
  { q: "Gu vị của bạn là…", key: "taste", opts: [[ICON.bold, "Đậm đà, mạnh mẽ", "bold"], [ICON.light, "Thơm tinh tế, hậu ngọt dịu", "light"], [ICON.classic, "Hoài cổ, như cà phê xưa", "classic"]] },
  { q: "Bạn uống kèm sữa không?", key: "milk", opts: [[ICON.milk, "Có, phải có sữa", "milk"], [ICON.black, "Đen nguyên bản", "black"]] },
];
let qStep = 0, answers = {};

function recommend(a) {
  if (a.tool === "rtd") return [4, "Bạn cần nhanh gọn – Cold Brew đóng lon trẻ trung, mở nắp là uống."];
  if (a.taste === "light" || a.tool === "espresso" || a.tool === "pour") return [2, "Arabica Cầu Đất pha Robusta Buôn Ma Thuột – hương thơm tinh tế, hậu vị ngọt dịu."];
  if (a.taste === "classic" || a.milk === "milk") return [3, "Rang xay kiểu phin truyền thống – gợi nhớ hương vị cà phê xưa, hợp pha phin với sữa."];
  return [1, "Robusta Buôn Ma Thuột rang mộc – đậm vị truyền thống cho người yêu cà phê phin đậm đà."];
}

function renderQuiz() {
  const card = $("#quizCard");
  const bar = `<div class="quiz__progress">${quiz.map((_, i) => `<i class="${i <= qStep ? "on" : ""}"></i>`).join("")}</div>`;
  if (qStep < quiz.length) {
    const q = quiz[qStep];
    card.innerHTML = `${bar}<p class="quiz__q">${q.q}</p><div class="quiz__opts">${q.opts.map(([ic, t, v]) =>
      `<button class="quiz__opt" data-v="${v}"><span>${ic}</span>${t}</button>`).join("")}</div>`;
    return;
  }
  const [id, why] = recommend(answers);
  const p = products.find((x) => x.id === id);
  card.innerHTML = `${bar}<div class="quiz__result">
      <div class="card__media" style="--disc:${p.bg}">${bagSVG(p)}</div>
      <div><span class="kicker">Gu của bạn là</span><h4>${p.name}</h4><p>${why}</p><b>${fmt(p.price)}</b></div>
    </div>
    <div class="quiz__actions"><button class="btn btn--dark" id="quizAdd">Thêm vào giỏ</button><button class="link-btn" id="quizRedo">Làm lại</button></div>`;
  $("#quizAdd").onclick = () => addProduct(id, 0);
  $("#quizRedo").onclick = () => { qStep = 0; answers = {}; renderQuiz(); };
}

$("#quizCard").addEventListener("click", (e) => {
  const o = e.target.closest(".quiz__opt");
  if (!o) return;
  answers[quiz[qStep].key] = o.dataset.v;
  qStep++;
  if (answers.tool === "rtd" && qStep === 1) qStep = quiz.length; // uống liền thì bỏ qua câu còn lại
  renderQuiz();
});
renderQuiz();

/* ==========================================================
   NGUỒN GỐC + TRA CỨU MÃ LÔ
   ========================================================== */
let activeOrigin = 0;
function renderOrigin() {
  const o = origins[activeOrigin];
  $("#originTabs").innerHTML = origins.map((x, i) => `<button class="chip ${i === activeOrigin ? "active" : ""}" data-i="${i}">${x.name}</button>`).join("");
  $("#originPanel").innerHTML = `
    <div class="origin__art">${landscapeSVG(o)}<div class="origin__alt"><b>${o.alt}</b>so với mực nước biển</div></div>
    <div class="origin__body" key="${o.code}">
      <h3>${o.name}</h3>
      <p class="origin__region">${o.region}</p>
      <p>${o.story}</p>
      <div class="facts">
        <div><small>Thổ nhưỡng</small><b>${o.soil}</b></div>
        <div><small>Giống</small><b>${o.variety}</b></div>
        <div><small>Dòng sản phẩm</small><b>${o.products}</b></div>
        <div><small>Mua ngay</small><b><a href="#shop" class="link-btn" data-goto="${o.productId}">Xem sản phẩm →</a></b></div>
      </div>
      <div class="farmer">
        <span class="farmer__av" style="background:${o.hills[1]}">TT</span>
        <div><q>${o.quote}</q><small>THANH TÂN</small></div>
      </div>
    </div>`;
}
$("#originTabs").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  activeOrigin = +b.dataset.i;
  renderOrigin();
});
renderOrigin();

$("#traceForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = $("#traceInput").value.trim().toUpperCase();
  const m = raw.match(/^TT-(BMT|CD)-(\d{2})(\d{2})$/);
  const out = $("#traceResult");
  if (!m || +m[3] < 1 || +m[3] > 12) {
    out.innerHTML = `<p class="trace__err">Không tìm thấy mã lô. Thử: TT-BMT-2611 hoặc TT-CD-2611.</p>`;
    return;
  }
  const o = origins.find((x) => x.code === m[1]);
  const lot = (raw.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0) % 90) + 10;
  out.innerHTML = `<div class="trace__ok">
    <div><small>Vùng trồng</small><b>${o.name}, ${o.region}</b></div>
    <div><small>Giống</small><b>${o.variety}</b></div>
    <div><small>Lô rang</small><b>#${lot} · tháng ${+m[3]}/20${m[2]}</b></div>
    <div><small>Độ cao</small><b>${o.alt}</b></div>
  </div>`;
});

document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-goto]");
  if (!g) return;
  const p = products.find((x) => x.id === +g.dataset.goto);
  $$(".chip", $("#filters")).forEach((x) => x.classList.toggle("active", x.dataset.filter === p.cat));
  renderShop(p.cat);
});

/* ==========================================================
   GÓI ĐỊNH KỲ
   ========================================================== */
const plan = { freq: 2, size: 250 };
const PLAN_BASE = 180000; // giá trung bình 250g (demo)
const sizeMul = { 250: 1, 500: 1.9, 1000: 3.6 };
function renderPlan() {
  const full = round(PLAN_BASE * sizeMul[plan.size]);
  const price = round(full * 0.85);
  const perMonth = round(price * (4.3 / plan.freq));
  $("#planPrice").textContent = fmt(price);
  $("#planOld").textContent = fmt(full);
  $("#planNote").textContent = `≈ ${fmt(perMonth)}/tháng · tiết kiệm ${fmt(round((full - price) * (4.3 / plan.freq)))}/tháng`;
}
function bindSeg(id, key) {
  $(id).addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("button", $(id)).forEach((x) => x.classList.toggle("active", x === b));
    plan[key] = +b.dataset.v;
    renderPlan();
  });
}
bindSeg("#freqSeg", "freq");
bindSeg("#sizeSeg", "size");
renderPlan();
$("#planBtn").addEventListener("click", () => {
  const price = round(PLAN_BASE * sizeMul[plan.size] * 0.85);
  const sizeLabel = plan.size === 1000 ? "1kg" : plan.size + "g";
  addItem({ key: `sub-${plan.freq}-${plan.size}`, pid: 1, name: "Gói định kỳ Thanh Tân", sub: `${sizeLabel} / ${plan.freq} tuần`, price });
  openCart();
});

/* ==========================================================
   CÁCH PHA
   ========================================================== */
$("#brewGrid").innerHTML = brews.map((b) => `
  <article class="brew">
    <div class="brew__icon">${b.icon}</div>
    <h3>${b.name}</h3>
    <dl>${b.rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
    <p class="brew__tip">${ICON.tip}<span>${b.tip}</span></p>
  </article>`).join("");

/* ==========================================================
   CHUNG: header, menu, active link, reveal, toast, newsletter
   ========================================================== */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

const nav = $("#nav");
$("#menuToggle").addEventListener("click", () => nav.classList.toggle("open"));
nav.addEventListener("click", (e) => e.target.matches("a") && nav.classList.remove("open"));

const sections = $$("main section[id]");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  $("#header").classList.toggle("scrolled", y > 10);
  const cur = sections.filter((s) => s.offsetTop - 140 <= y).pop();
  $$("a", nav).forEach((a) => a.classList.toggle("active", !!cur && a.getAttribute("href") === "#" + cur.id));
}, { passive: true });


$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("Cảm ơn bạn đã đăng ký nhận tin từ Thanh Tân!");
});

$("#year").textContent = new Date().getFullYear();

/* Hero: giá khởi điểm lấy từ dữ liệu sản phẩm */
{
  const from = $("#heroFrom");
  if (from) from.textContent = `Từ ${fmt(Math.min(...products.filter((p) => p.cat === "bean").map((p) => p.price)))} / 250g`;
}
