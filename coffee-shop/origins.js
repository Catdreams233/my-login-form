/* THANH TÂN – trang Nguồn gốc (tab vùng trồng + tra cứu mã lô). Cần common.js + app.js. */

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
        <div><small>Mua ngay</small><b><a href="san-pham.html#p${o.productId}" class="link-btn">Xem sản phẩm →</a></b></div>
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
