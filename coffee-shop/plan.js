/* THANH TÂN – trang Gói định kỳ. Cần common.js + app.js. */

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
