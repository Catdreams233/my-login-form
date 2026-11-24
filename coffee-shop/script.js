/* ==========================================================
   Mộc Coffee v2 – dữ liệu & tương tác
   Sửa sản phẩm / vùng trồng / công thức ở phần DỮ LIỆU bên dưới.
   ========================================================== */

const C = { ink: "#1c1712", paper: "#fbf8f2", cream: "#f5efe4", terracotta: "#e2572b", mustard: "#f2b33d", forest: "#2f5d3a", cobalt: "#2b4bd8", pink: "#f4a6b8" };
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = (n) => n.toLocaleString("vi-VN") + "đ";
const round = (n) => Math.round(n / 1000) * 1000;

/* ---------- DỮ LIỆU: sản phẩm ---------- */
const SIZES = {
  bean: [{ label: "250g", m: 1 }, { label: "500g", m: 1.9 }, { label: "1kg", m: 3.6 }],
  rtd: [{ label: "1 chai", m: 1 }, { label: "Lốc 6", m: 5.5 }],
  gift: [{ label: "1 hộp", m: 1 }],
};

const products = [
  { id: 1, short: "CẦU ĐẤT", cat: "single", name: "Arabica Cầu Đất", origin: "Lâm Đồng · 1.600m", notes: "Cam vàng · Hoa nhài · Mật ong", roast: 2, price: 240000, tag: "Specialty",
    bg: C.cobalt, bag: C.pink, label: C.paper, motif: "mountain", sizes: "bean" },
  { id: 2, short: "BMT HONEY", cat: "single", name: "Robusta Honey Buôn Ma Thuột", origin: "Đắk Lắk · 500m", notes: "Socola đen · Caramel · Đường thốt nốt", roast: 4, price: 165000, tag: "Bán chạy",
    bg: C.mustard, bag: C.terracotta, label: C.paper, motif: "sun", sizes: "bean" },
  { id: 3, short: "SƠN LA", cat: "single", name: "Arabica Sơn La Washed", origin: "Sơn La · 1.200m", notes: "Táo xanh · Trà đen · Hạt dẻ", roast: 3, price: 210000,
    bg: C.pink, bag: C.forest, label: C.paper, motif: "leaf", sizes: "bean" },
  { id: 4, short: "KHE SANH", cat: "single", name: "Robusta Khe Sanh Natural", origin: "Quảng Trị · 450m", notes: "Mận chín · Cacao · Vang đỏ", roast: 4, price: 175000, tag: "Micro-lot",
    bg: C.forest, bag: C.mustard, label: C.paper, motif: "star", sizes: "bean" },
  { id: 5, short: "PHIN BLEND", cat: "blend", name: "Mộc Phin Blend", origin: "Robusta 70 · Arabica 30", notes: "Đậm đà · Socola · Hạt rang", roast: 5, price: 135000,
    bg: C.terracotta, bag: C.ink, label: C.mustard, motif: "bean", sizes: "bean" },
  { id: 6, short: "ESPRESSO", cat: "blend", name: "Mộc Espresso Blend", origin: "Robusta 40 · Arabica 60", notes: "Caramel · Hạnh nhân · Crema dày", roast: 4, price: 155000,
    bg: C.cream, bag: C.cobalt, label: C.mustard, motif: "wave", sizes: "bean" },
  { id: 7, short: "COLD BREW", cat: "rtd", name: "Cold Brew Mộc", origin: "Ủ lạnh 18 giờ · 330ml", notes: "Mượt · Ít đắng · Ngọt hậu", roast: 3, price: 45000, tag: "Mới",
    bg: C.cobalt, bag: C.ink, label: C.mustard, motif: "bottle", sizes: "rtd" },
  { id: 8, short: "BỐN VÙNG", cat: "gift", name: "Hộp Quà Bốn Vùng", origin: "4 túi 100g + phin đồng", notes: "Hộp gỗ · Khắc tên miễn phí", roast: 0, price: 590000, tag: "Quà Tết",
    bg: C.mustard, bag: C.forest, label: C.terracotta, motif: "box", sizes: "gift" },
];

/* ---------- Minh hoạ SVG (không cần ảnh, chạy offline) ---------- */
const MOTIF = {
  mountain: (c) => `<path d="M62 190 92 150 106 166 124 140 152 190Z" fill="${c}"/><circle cx="134" cy="150" r="7" fill="${C.mustard}"/>`,
  sun: (c) => `<circle cx="100" cy="166" r="16" fill="${c}"/>${[...Array(8)].map((_, i) => `<rect x="98" y="134" width="4" height="9" rx="2" fill="${c}" transform="rotate(${i * 45} 100 166)"/>`).join("")}`,
  leaf: (c) => `<path d="M100 192C74 174 78 146 112 138c8 26-2 44-12 54Z" fill="${c}"/><path d="M100 190c2-16 6-30 12-50" stroke="${C.paper}" stroke-width="2" fill="none"/>`,
  star: (c) => `<path d="m100 138 8 18 20 2-15 13 5 19-18-10-18 10 5-19-15-13 20-2Z" fill="${c}"/>`,
  bean: (c) => `<ellipse cx="100" cy="166" rx="18" ry="25" fill="${c}" transform="rotate(25 100 166)"/><path d="M92 146c12 10 4 30 16 40" stroke="${C.mustard}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  wave: (c) => `<path d="M64 160q9-12 18 0t18 0 18 0 18 0M64 176q9-12 18 0t18 0 18 0 18 0" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
};

function bagSVG(p) {
  if (p.motif === "bottle") {
    return `<svg viewBox="0 0 200 260" aria-hidden="true">
      <rect x="80" y="10" width="40" height="26" rx="5" fill="${C.mustard}"/>
      <path d="M82 36h36v20c22 12 30 26 30 48v136q0 12-12 12H64q-12 0-12-12V104c0-22 8-36 30-48Z" fill="${p.bag}"/>
      <rect x="58" y="112" width="84" height="96" rx="8" fill="${p.label}"/>
      <text x="100" y="146" text-anchor="middle" font-family="Fraunces,serif" font-weight="900" font-size="22" fill="${C.ink}">mộc.</text>
      <text x="100" y="172" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-weight="800" font-size="13" fill="${C.ink}">COLD BREW</text>
      <path d="M72 188q7-8 14 0t14 0 14 0 14 0" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`;
  }
  if (p.motif === "box") {
    return `<svg viewBox="0 0 200 260" aria-hidden="true">
      <path d="M100 60c-14-30-46-24-40-4 4 12 26 10 40 4Zm0 0c14-30 46-24 40-4-4 12-26 10-40 4Z" fill="${p.label}"/>
      <rect x="18" y="64" width="164" height="46" rx="8" fill="${p.bag}" />
      <rect x="28" y="108" width="144" height="136" rx="6" fill="${p.bag}" opacity=".88"/>
      <rect x="88" y="64" width="24" height="180" fill="${p.label}"/>
      <rect x="44" y="150" width="34" height="50" rx="4" fill="${C.paper}"/><rect x="122" y="150" width="34" height="50" rx="4" fill="${C.paper}"/>
      <text x="61" y="181" text-anchor="middle" font-family="Fraunces,serif" font-weight="900" font-size="13" fill="${C.ink}">m.</text>
      <text x="139" y="181" text-anchor="middle" font-family="Fraunces,serif" font-weight="900" font-size="13" fill="${C.ink}">m.</text>
    </svg>`;
  }
  const short = p.short;
  return `<svg viewBox="0 0 200 260" aria-hidden="true">
    <path d="M24 20h152l4 26H20Z" fill="${p.bag}"/>
    <path d="M24 20l8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 4 0" stroke="rgba(0,0,0,.25)" stroke-width="2" fill="none"/>
    <path d="M20 46h160l10 198q1 12-11 12H21q-12 0-11-12Z" fill="${p.bag}"/>
    <path d="M20 46h160v6H20z" fill="rgba(0,0,0,.18)"/>
    <rect x="46" y="84" width="108" height="140" rx="12" fill="${p.label}"/>
    <text x="100" y="116" text-anchor="middle" font-family="Fraunces,serif" font-weight="900" font-size="24" fill="${C.ink}">mộc.</text>
    ${MOTIF[p.motif](p.bag === C.ink ? C.terracotta : p.bag)}
    <text x="100" y="212" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-weight="800" font-size="11" letter-spacing="1" fill="${C.ink}">${short}</text>
  </svg>`;
}

/* ---------- DỮ LIỆU: vùng trồng (kể chuyện kiểu Escape) ---------- */
const origins = [
  { code: "CD", name: "Cầu Đất", region: "Đà Lạt, Lâm Đồng", alt: "1.600m", variety: "Bourbon, Typica", process: "Washed (sơ chế ướt)", harvest: "Tháng 11 – 1", productId: 1,
    story: "Vùng Arabica lâu đời nhất Việt Nam, người Pháp đưa giống về từ năm 1927. Sương mù quanh năm và đêm lạnh 12°C giúp quả chín chậm, tích nhiều đường – tạo vị chua thanh như cam vàng.",
    farmer: "Anh Phạm Văn Tú", farmerNote: "18 năm trồng Arabica", quote: "Hái chín đỏ từng quả, chậm mà chắc.",
    sky: "#f8d9cf", sun: C.mustard, hills: ["#7e8fe8", C.cobalt, "#1a2f8f"], peaks: [0.55, 0.85, 0.6, 0.95, 0.7] },
  { code: "BMT", name: "Buôn Ma Thuột", region: "Đắk Lắk", alt: "500m", variety: "Robusta TR4, TR9", process: "Honey (giữ lớp nhớt)", harvest: "Tháng 10 – 12", productId: 2,
    story: "Thủ phủ cà phê của Việt Nam với đất đỏ bazan giàu khoáng. Lô Honey được phơi giàn cùng lớp nhớt quả, cho vị ngọt caramel và hậu socola đặc trưng.",
    farmer: "Chị H'Mai Niê", farmerNote: "Hợp tác xã Ea Tu", quote: "Đất đỏ cho hạt đậm, mình cho hạt cái tâm.",
    sky: "#fde7b5", sun: C.terracotta, hills: ["#e8955f", C.terracotta, "#8f2e12"], peaks: [0.35, 0.45, 0.3, 0.5, 0.4] },
  { code: "SL", name: "Sơn La", region: "Thuận Châu, Sơn La", alt: "1.200m", variety: "Catimor", process: "Washed (sơ chế ướt)", harvest: "Tháng 10 – 12", productId: 3,
    story: "Arabica vùng Tây Bắc trồng xen rừng trên sườn đồi dốc. Biên độ nhiệt ngày–đêm lớn cho hạt chắc, vị sạch như trà đen với chút táo xanh.",
    farmer: "Anh Lò Văn Pọm", farmerNote: "Dân tộc Thái, 3 ha", quote: "Cây cà phê ở đây sống cùng rừng.",
    sky: "#dbe9d2", sun: C.pink, hills: ["#7fae86", C.forest, "#183a22"], peaks: [0.7, 0.5, 0.9, 0.6, 0.8] },
  { code: "KS", name: "Khe Sanh", region: "Hướng Hoá, Quảng Trị", alt: "450m", variety: "Robusta", process: "Natural (phơi nguyên quả)", harvest: "Tháng 11 – 1", productId: 4,
    story: "Vùng đất lịch sử với khí hậu giao thoa Đông – Tây Trường Sơn. Phơi nguyên quả 25 ngày cho lô micro-lot vị mận chín, cacao và chút vang đỏ.",
    farmer: "Ông Lê Văn Thắng", farmerNote: "Vườn 40 năm tuổi", quote: "Nắng gió Lào làm quả ngọt lạ.",
    sky: "#f4ddb0", sun: "#fff4d6", hills: ["#d9a441", "#a87522", "#5a3d0e"], peaks: [0.4, 0.55, 0.45, 0.6, 0.35] },
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
  { icon: "🫖", name: "Phin", color: C.mustard, rows: [["Tỉ lệ", "20g : 100ml"], ["Nhiệt độ", "92–94°C"], ["Độ xay", "Vừa – thô"], ["Thời gian", "4–5 phút"]], tip: "Ủ 20ml nước 30 giây cho hạt nở rồi mới rót tiếp." },
  { icon: "☕", name: "Pour-over", color: C.pink, rows: [["Tỉ lệ", "15g : 250ml"], ["Nhiệt độ", "92–93°C"], ["Độ xay", "Vừa – mịn"], ["Thời gian", "2:30–3:00"]], tip: "Rót xoắn ốc 3 lần, hợp Arabica Cầu Đất & Sơn La." },
  { icon: "⚡", name: "Espresso", color: C.terracotta, rows: [["Tỉ lệ", "18g → 36g"], ["Nhiệt độ", "93°C"], ["Độ xay", "Mịn"], ["Thời gian", "25–30 giây"]], tip: "Dùng Espresso Blend, để hạt nghỉ 7 ngày sau rang." },
  { icon: "🧊", name: "Cold brew", color: "#9fb4ff", rows: [["Tỉ lệ", "100g : 1L"], ["Nước", "Lạnh / thường"], ["Độ xay", "Thô"], ["Thời gian", "16–18 giờ"]], tip: "Ủ trong tủ lạnh, lọc 2 lần, giữ được 7 ngày." },
];

/* ==========================================================
   HERO
   ========================================================== */
$("#heroBags").innerHTML = [products[2], products[0], products[3]].map(bagSVG).join("");

/* ==========================================================
   SHOP
   ========================================================== */
const grid = $("#productGrid");
const priceOf = (p, i) => round(p.price * SIZES[p.sizes][i].m);

function roastHTML(n) {
  if (!n) return `<div class="roast">Set quà tặng</div>`;
  return `<div class="roast">Độ rang <span class="roast__dots">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span></div>`;
}

function cardHTML(p, i = 0) {
  const sizes = SIZES[p.sizes];
  return `<article class="card" style="animation-delay:${i * 50}ms" data-id="${p.id}">
    <div class="card__media" style="background:${p.bg}">${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}${bagSVG(p)}</div>
    <span class="card__origin">${p.origin}</span>
    <h3>${p.name}</h3>
    <p class="card__notes">${p.notes}</p>
    ${roastHTML(p.roast)}
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
try { cart = JSON.parse(localStorage.getItem("moc-cart-v2")) || []; } catch { cart = []; }
const save = () => { try { localStorage.setItem("moc-cart-v2", JSON.stringify(cart)); } catch {} };

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
  $("#shipText").textContent = left > 0 ? `Mua thêm ${fmt(left)} để được freeship 🚚` : "🎉 Bạn đã được freeship!";
  $("#shipBar").style.width = Math.min(100, (total / FREESHIP) * 100) + "%";
  $("#cartItems").innerHTML = cart.length
    ? cart.map((i) => {
        const p = products.find((x) => x.id === i.pid) || products[4];
        return `<div class="citem">
          <div class="citem__img" style="background:${p.bg}">${bagSVG(p)}</div>
          <div><h4>${i.name}</h4><small>${i.sub}</small>
            <div class="qty"><button data-act="dec" data-key="${i.key}" aria-label="Giảm">−</button><span>${i.qty}</span><button data-act="inc" data-key="${i.key}" aria-label="Tăng">+</button></div>
          </div>
          <div class="citem__price">${fmt(i.price * i.qty)}<button data-act="del" data-key="${i.key}">Xoá</button></div>
        </div>`;
      }).join("")
    : `<div class="cart__empty"><b>Giỏ hàng trống</b>Chọn một túi hạt rang tuần này nhé ☕</div>`;
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
  toast("🎉 Đặt hàng thành công! Mộc sẽ gọi xác nhận trong 15 phút.");
});
renderCart();

/* ==========================================================
   QUIZ – tìm gu (Single O style)
   ========================================================== */
const quiz = [
  { q: "Bạn thường pha cà phê bằng gì?", key: "tool", opts: [["🫖", "Phin", "phin"], ["⚡", "Máy espresso", "espresso"], ["☕", "Pour-over / V60", "pour"], ["🧊", "Lười – uống liền", "rtd"]] },
  { q: "Gu vị của bạn là…", key: "taste", opts: [["💪", "Đậm, đắng mạnh", "bold"], ["⚖️", "Cân bằng, dễ uống", "balanced"], ["🍊", "Chua thanh, trái cây", "fruity"], ["🍷", "Lạ miệng, phức hợp", "funky"]] },
  { q: "Bạn uống kèm sữa không?", key: "milk", opts: [["🥛", "Có, phải có sữa", "milk"], ["⚫", "Đen nguyên bản", "black"]] },
];
let qStep = 0, answers = {};

function recommend(a) {
  if (a.tool === "rtd") return [7, "Bạn cần nhanh gọn – Cold Brew ủ sẵn, mở nắp là uống, pha thêm sữa cũng ngon."];
  if (a.taste === "fruity") return [1, "Vị chua thanh hương cam, hoa nhài – sinh ra để pha pour-over và uống đen."];
  if (a.taste === "funky") return [4, "Micro-lot phơi nguyên quả: mận chín, cacao, chút vang – trải nghiệm rất khác."];
  if (a.tool === "espresso") return [6, "Crema dày, caramel hạnh nhân – lên latte hay cappuccino đều tròn vị."];
  if (a.taste === "balanced") return [3, "Sạch vị, nhẹ nhàng như trà đen – uống cả ngày không ngán."];
  if (a.milk === "milk") return [5, "Đậm đặc kiểu Sài Gòn, pha phin với sữa đặc là chuẩn bài."];
  return [2, "Đậm, ngọt hậu socola – Robusta Honey pha phin uống đen cực đã."];
}

function renderQuiz() {
  const card = $("#quizCard");
  const bar = `<div class="quiz__progress">${quiz.map((_, i) => `<i class="${i < qStep || qStep >= quiz.length ? "on" : i === qStep ? "on" : ""}"></i>`).join("")}</div>`;
  if (qStep < quiz.length) {
    const q = quiz[qStep];
    card.innerHTML = `${bar}<p class="quiz__q">${q.q}</p><div class="quiz__opts">${q.opts.map(([ic, t, v]) =>
      `<button class="quiz__opt" data-v="${v}"><span>${ic}</span>${t}</button>`).join("")}</div>`;
    return;
  }
  const [id, why] = recommend(answers);
  const p = products.find((x) => x.id === id);
  card.innerHTML = `${bar}<div class="quiz__result">
      <div class="card__media" style="background:${p.bg}">${bagSVG(p)}</div>
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
   ORIGINS + TRUY XUẤT (Escape style)
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
        <div><small>Giống</small><b>${o.variety}</b></div>
        <div><small>Sơ chế</small><b>${o.process}</b></div>
        <div><small>Mùa vụ</small><b>${o.harvest}</b></div>
        <div><small>Sản phẩm</small><b><a href="#shop" class="link-btn" data-goto="${o.productId}">Xem túi hạt →</a></b></div>
      </div>
      <div class="farmer">
        <span class="farmer__av" style="background:${o.hills[1]}">${o.farmer.split(" ").pop()[0]}</span>
        <div><q>${o.quote}</q><small>${o.farmer} · ${o.farmerNote}</small></div>
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
  const m = raw.match(/^MOC-(CD|BMT|SL|KS)-(\d{2})(\d{2})$/);
  const out = $("#traceResult");
  if (!m || +m[3] < 1 || +m[3] > 12) {
    out.innerHTML = `<p class="trace__err">Không tìm thấy mã lô. Thử: MOC-CD-2611, MOC-BMT-2611, MOC-SL-2610 hoặc MOC-KS-2611.</p>`;
    return;
  }
  const o = origins.find((x) => x.code === m[1]);
  const lot = (raw.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0) % 90) + 10;
  out.innerHTML = `<div class="trace__ok">
    <div><small>Vùng trồng</small><b>${o.name}, ${o.region}</b></div>
    <div><small>Nông hộ</small><b>${o.farmer}</b></div>
    <div><small>Lô rang</small><b>#${lot} · tháng ${+m[3]}/20${m[2]}</b></div>
    <div><small>Sơ chế</small><b>${o.process}</b></div>
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
const PLAN_BASE = 180000; // giá trung bình 250g
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
  addItem({ key: `sub-${plan.freq}-${plan.size}`, pid: 5, name: "Gói định kỳ Mộc", sub: `${sizeLabel} / ${plan.freq} tuần`, price });
  openCart();
});

/* ==========================================================
   CÁCH PHA
   ========================================================== */
$("#brewGrid").innerHTML = brews.map((b) => `
  <article class="brew reveal">
    <div class="brew__icon" style="background:${b.color}">${b.icon}</div>
    <h3>${b.name}</h3>
    <dl>${b.rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
    <p>💡 ${b.tip}</p>
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

$$(".section__head, .origin, .trace, .plan, .review-row blockquote, .quiz__inner").forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver((ents) => ents.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
}), { threshold: 0.1 });
$$(".reveal").forEach((el) => io.observe(el));

$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("Đăng ký thành công! Mã MOC20 đã được gửi vào email.");
});

$("#year").textContent = new Date().getFullYear();
