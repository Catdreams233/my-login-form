/* ==========================================================
   THANH TÂN – trang thử nghiệm
   Đồng hồ (timerHTML, mountTimer, toast) nằm trong timer.js.
   Dùng dữ liệu chung từ common.js (products, brews, SIZES, bagSVG, ICON, ico, fmt, round).
   Giỏ hàng dùng chung localStorage với trang chủ (khoá "thanhtan-cart-v1").
   ========================================================== */
const CART_KEY = "thanhtan-cart-v1";
const priceOf = (p, i) => round(p.price * SIZES[p.sizes][i].m);

/* Mỗi cách pha -> dòng gợi ý (lấy theo lời khuyên trong dữ liệu "brews") + đồng hồ */
const METHODS = [
  { brew: brews[0], main: 1, alt: 3, timer: { total: 300, stages: [[30, "Ủ hạt"], [300, "Nhỏ giọt"]] } },
  { brew: brews[1], main: 2, timer: { total: 180, stages: [[180, "Đang pha"]] } },
  { brew: brews[2], main: 2, timer: { total: 30, stages: [[30, "Đang chiết"]] } },
  { brew: brews[3], main: 1, alt: 4, timer: null, note: "Ủ 16–18 giờ trong tủ lạnh – hãy đặt nhắc giờ trên điện thoại." },
];

/* ---------- Giỏ hàng ---------- */
function addToCart(pid, sizeIdx) {
  const p = products.find((x) => x.id === pid);
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { cart = []; }
  const key = `${pid}-${sizeIdx}`;
  const found = cart.find((x) => x.key === key);
  found ? found.qty++ : cart.push({ key, pid, name: p.name, sub: SIZES[p.sizes][sizeIdx].label, price: priceOf(p, sizeIdx), qty: 1 });
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  toast(`Đã thêm ${p.name} (${SIZES[p.sizes][sizeIdx].label}) – xem giỏ ở trang chủ`);
}

/* ---------- Chọn theo cách pha ---------- */
const tabs = $("#methodTabs"), panel = $("#methodPanel");
tabs.innerHTML = METHODS.map((m, i) => `<button class="lab-tab" role="tab" id="tab${i}" aria-selected="${i === 0}" aria-controls="methodPanel" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">${m.brew.icon}<span>${m.brew.name}</span></button>`).join("");

function renderMethod(i) {
  clearInterval(tick); tick = null;
  const m = METHODS[i], p = products.find((x) => x.id === m.main), alt = m.alt && products.find((x) => x.id === m.alt);
  const sizes = SIZES[p.sizes];
  panel.setAttribute("aria-labelledby", `tab${i}`);
  panel.innerHTML = `
    <div>
      <h3>Công thức ${m.brew.name}</h3>
      <ul class="recipe">${m.brew.rows.map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join("")}</ul>
      <p class="method__tip">${m.brew.tip}</p>
    </div>
    <div class="rec">
      <h3>Nên dùng</h3>
      <div class="rec__bag">${bagSVG(p)}</div>
      <div class="rec__name">${p.name}</div>
      <p class="rec__why">${p.notes}</p>
      <div class="rec__buy">
        ${sizes.length > 1 ? `<select aria-label="Chọn khối lượng">${sizes.map((s, k) => `<option value="${k}">${s.label}</option>`).join("")}</select>` : ""}
        <button class="rec__add" data-pid="${p.id}"><span>Thêm</span><b>${fmt(priceOf(p, 0))}</b></button>
      </div>
      ${alt ? `<p class="rec__alt">Hoặc: <button data-alt="${alt.id}">${alt.name}</button></p>` : ""}
      <a class="rec__go" href="index.html#shop">Xem giỏ hàng ở trang chủ →</a>
    </div>
    <div class="timer">
      <h3>Đồng hồ pha</h3>
      ${m.timer ? timerHTML(m.timer.total) : `<p class="timer__none">${m.note}</p>`}
    </div>`;
  const sel = $("select", panel), add = $(".rec__add", panel);
  if (sel) sel.addEventListener("change", () => { $("b", add).textContent = fmt(priceOf(p, +sel.value)); });
  add.addEventListener("click", () => addToCart(p.id, sel ? +sel.value : 0));
  const altBtn = $("[data-alt]", panel);
  if (altBtn) altBtn.addEventListener("click", () => {
    const a = products.find((x) => x.id === +altBtn.dataset.alt);
    addToCart(a.id, 0);
  });
  if (m.timer) mountTimer($(".timer", panel), m.timer);
}

function selectTab(i) {
  $$(".lab-tab", tabs).forEach((b, k) => { b.setAttribute("aria-selected", k === i); b.tabIndex = k === i ? 0 : -1; });
  renderMethod(i);
}
tabs.addEventListener("click", (e) => { const b = e.target.closest(".lab-tab"); if (b) selectTab(+b.dataset.i); });
tabs.addEventListener("keydown", (e) => {
  if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  const cur = $$(".lab-tab", tabs).findIndex((b) => b.getAttribute("aria-selected") === "true");
  const next = (cur + (e.key === "ArrowRight" ? 1 : -1) + METHODS.length) % METHODS.length;
  selectTab(next); $$(".lab-tab", tabs)[next].focus();
});
renderMethod(0);

/* ---------- Hành trình hạt cà phê ---------- */
const STEPS = [
  [ico('<path d="M3 19h18"/><path d="M5 19c1.5-5 4-7 7-7s5.5 2 7 7"/><circle cx="12" cy="6" r="2.2"/>'), "Đất đỏ bazan", "Cà phê lớn lên trên đất đỏ bazan Buôn Ma Thuột, vùng cao nguyên nắng gió."],
  [ico('<path d="M12 4c0 4-2 6-5 8"/><path d="M12 4c2 1 4 3 4 6"/><circle cx="7" cy="15" r="3"/><circle cx="16" cy="13" r="3"/>'), "Hái chín", "Chọn quả chín đỏ, hái đúng độ để vị ngọt tự nhiên đủ đầy."],
  [ico('<circle cx="12" cy="9" r="3.5"/><path d="M12 2.5v2M5.5 5l1.4 1.4M18.5 5l-1.4 1.4M3 9h2M19 9h2"/><path d="M4 18h16M6 21h12"/>'), "Sơ chế và phơi", "Hạt được làm sạch và phơi nắng trước khi bảo quản."],
  [ico('<rect x="4" y="7" width="13" height="10" rx="2"/><path d="M17 12h3"/><path d="M8 20h5M8 4c0 1 1 1 1 2M12 4c0 1 1 1 1 2"/>'), "Rang mộc", "Chỉ rang hạt cà phê, không ướp bơ, không hương liệu."],
  [ICON.pour, "Ly cà phê", "Xay, pha và thưởng thức: đậm đà nguyên bản, thanh tân như thuở ban đầu."],
];
$("#journey").innerHTML = STEPS.map(([icon, t, d]) => `<li class="step"><div class="step__ico">${icon}</div><div><h3>${t}</h3><p>${d}</p></div></li>`).join("");
const steps = $$(".step");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.4 });
  steps.forEach((s, i) => { s.style.transitionDelay = `${i * 90}ms`; io.observe(s); });
} else steps.forEach((s) => s.classList.add("in"));
