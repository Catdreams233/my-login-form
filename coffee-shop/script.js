/* ==========================================================
   THANH TÂN Coffee – tương tác trang chủ
   Dữ liệu và hàm dùng chung nằm trong common.js (nạp trước file này).
   ========================================================== */

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
   BẢN ĐỒ HƯƠNG VỊ + BỘ THỬ 4 DÒNG (đầu mục sản phẩm)
   ========================================================== */
const DOT = { 1: C.brown, 2: C.gold, 3: C.forest, 4: C.ink };
const SAMPLER = { key: "set-1", pid: "set", name: "Bộ thử 4 dòng", sub: "3 gói 50g + 1 lon", price: 129000 }; // giá mẫu

$("#flavorMap").innerHTML = `
  <div class="fmap__head"><h3>Bản đồ hương vị</h3><p>Bấm vào một dòng để xem chi tiết.</p></div>
  <div class="fmap__plot">
    <span class="fmap__ax fmap__ax--t">Truyền thống</span><span class="fmap__ax fmap__ax--b">Hiện đại</span>
    <span class="fmap__ax fmap__ax--l">Nhẹ nhàng</span><span class="fmap__ax fmap__ax--r">Đậm đà</span>
    ${products.map((p) => `<button class="fmap__dot ${p.body >= 4 ? "left" : ""}" data-id="${p.id}" style="left:${10 + ((p.body - 1) / 4) * 80}%;top:${100 - (12 + ((p.trad - 1) / 4) * 76)}%;--dot:${DOT[p.id]}"><i></i><span>${p.line}</span></button>`).join("")}
  </div>`;

$("#sampler").innerHTML = `
  <div class="sampler__bags">${[products[0], products[1], products[2], products[3]].map(bagSVG).join("")}</div>
  <div class="sampler__body">
    <h3>Bộ thử 4 dòng</h3>
    <p>Chưa biết hợp dòng nào? Thử cả bốn: 3 gói 50g (Nguyên Bản, Thượng Hạng, Cổ Truyền) và 1 lon Tươi Mới.</p>
    <button class="sampler__add"><span>Thêm bộ thử</span><b>${fmt(SAMPLER.price)}</b></button>
  </div>`;

$("#sampler").addEventListener("click", (e) => { if (e.target.closest(".sampler__add")) addItem(SAMPLER); });

$("#flavorMap").addEventListener("click", (e) => {
  const d = e.target.closest(".fmap__dot");
  if (!d) return;
  if (!$(`.card[data-id="${d.dataset.id}"]`)) { $$(".chip", $("#filters"))[0].click(); }
  const card = $(`.card[data-id="${d.dataset.id}"]`);
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.classList.remove("hit"); void card.offsetWidth; card.classList.add("hit");
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
        const img = i.pid === "set" ? `<div class="citem__img citem__img--set">${products.map(bagSVG).join("")}</div>` : `<div class="citem__img" style="background:${p.bg}">${bagSVG(p)}</div>`;
        return `<div class="citem">
          ${img}
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
