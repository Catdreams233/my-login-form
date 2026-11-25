/* ==========================================================
   THANH TÂN – bản blog thử nghiệm: thanh tiến độ đọc + đồng hồ cho từng công thức
   ========================================================== */

/* Thanh tiến độ đọc: tính theo phần thân bài */
(() => {
  const bar = $(".read-progress i"), body = $(".post-body");
  if (!bar || !body) return;
  let queued = false;
  const update = () => {
    queued = false;
    const top = body.getBoundingClientRect().top + scrollY;
    const span = body.offsetHeight - innerHeight * 0.6;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, (scrollY - top + innerHeight * 0.3) / span))})`;
  };
  addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
})();

/* Đồng hồ ngay dưới bảng thông số của từng cách pha (số liệu lấy đúng theo các bước trong bài) */
const TIMERS = {
  "pha-phin": { total: 300, stages: [[30, "Ủ hạt"], [300, "Nhỏ giọt"]], hint: "Ủ 30 giây, sau đó rót đủ nước và chờ nhỏ giọt (4–5 phút)." },
  "pour-over": { total: 180, stages: [[45, "Ủ hạt"], [180, "Rót 3 lần"]], hint: "Ủ hạt 30–45 giây, rót 3 lần theo vòng xoắn ốc, tổng 2:30–3:00." },
  "espresso": { total: 30, stages: [[30, "Đang chiết"]], hint: "Thời gian chiết lý tưởng 25–30 giây." },
};
Object.entries(TIMERS).forEach(([id, cfg]) => {
  const h2 = document.getElementById(id);
  const spec = h2 && (() => { let n = h2.nextElementSibling; while (n && !n.classList.contains("spec")) n = n.nextElementSibling; return n; })();
  if (!spec) return;
  const box = document.createElement("div");
  box.className = "timer timer--inline";
  box.innerHTML = `${timerHTML(cfg.total)}<div class="timer__side"><h3>Bấm giờ</h3><p>${cfg.hint}</p></div>`;
  spec.after(box);
  mountTimer(box, cfg);
});
