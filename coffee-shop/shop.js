/* ==========================================================
   THANH TÂN Coffee – danh sách sản phẩm
   Dùng ở trang chủ (4 thẻ sản phẩm) và trang Sản phẩm (kèm bộ lọc, bản đồ hương vị, bộ thử).
   Cần common.js và app.js nạp trước.
   ========================================================== */

/* ==========================================================
   SHOP
   ========================================================== */
const grid = $("#productGrid");

function cardHTML(p, i = 0) {
  const sizes = SIZES[p.sizes];
  return `<article class="card" id="p${p.id}" style="animation-delay:${i * 50}ms" data-id="${p.id}">
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

$("#filters")?.addEventListener("click", (e) => {
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
if ($("#flavorMap")) {
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
  if (!$(`.card[data-id="${d.dataset.id}"]`)) { $$(".chip", $("#filters"))[0]?.click(); }
  const card = $(`.card[data-id="${d.dataset.id}"]`);
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.classList.remove("hit"); void card.offsetWidth; card.classList.add("hit");
});
}

/* Mở từ trang khác: san-pham.html#p2 → cuộn tới thẻ sản phẩm và làm nổi bật */
{
  const m = location.hash.match(/^#p(\d+)$/);
  const card = m && $("#p" + m[1]);
  if (card) setTimeout(() => {
    card.scrollIntoView({ block: "center" });
    card.classList.add("hit");
  }, 300);
}
