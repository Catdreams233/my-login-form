/* ==========================================================
   THANH TÂN – đồng hồ pha dùng chung cho các trang thử nghiệm
   Cần common.js ($, $$) và một phần tử #toast trong trang.
   ========================================================== */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ---------- Đồng hồ ---------- */
const R = 84, CIRC = 2 * Math.PI * R;
let tick = null;
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach((t) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.15, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.2);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.2);
    });
  } catch {}
  try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch {}
}

function mountTimer(root, cfg) {
  const { total, stages } = cfg;
  let remaining = total, endAt = 0;
  const ring = $(".fg", root), time = $(".timer__num", root), label = $(".timer__label", root);
  const start = $("[data-t=start]", root), reset = $("[data-t=reset]", root);

  const stageOf = (elapsed) => (stages.find(([until]) => elapsed < until) || stages[stages.length - 1])[1];
  function paint() {
    const elapsed = total - remaining;
    time.textContent = mmss(remaining);
    ring.style.strokeDashoffset = CIRC * (1 - remaining / total);
    label.textContent = remaining === 0 ? "Xong rồi" : tick ? stageOf(elapsed) : (remaining === total ? "Sẵn sàng" : "Tạm dừng");
  }
  function stop() { clearInterval(tick); tick = null; }
  function run() {
    endAt = Date.now() + remaining * 1000;
    tick = setInterval(() => {
      remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      paint();
      if (remaining === 0) { stop(); root.classList.add("done"); start.textContent = "Pha lại"; beep(); toast("Xong rồi – thưởng thức ngay nhé."); }
    }, 250);
    start.textContent = "Tạm dừng";
  }
  start.addEventListener("click", () => {
    if (remaining === 0) { remaining = total; root.classList.remove("done"); }
    if (tick) { stop(); start.textContent = "Tiếp tục"; } else run();
    paint();
  });
  reset.addEventListener("click", () => { stop(); remaining = total; root.classList.remove("done"); start.textContent = "Bắt đầu"; paint(); });
  ring.style.strokeDasharray = CIRC;
  paint();
}

/* Markup vòng đếm + nút; gắn bằng mountTimer(phần tử .timer, { total, stages }) */
function timerHTML(total) {
  return `
    <div class="timer__ring">
      <svg viewBox="0 0 190 190" aria-hidden="true"><circle class="bg" cx="95" cy="95" r="${R}"/><circle class="fg" cx="95" cy="95" r="${R}"/></svg>
      <div class="timer__time"><span class="timer__num">${mmss(total)}</span><small class="timer__label">Sẵn sàng</small></div>
    </div>
    <div class="timer__btns"><button class="timer__btn" data-t="start">Bắt đầu</button><button class="timer__btn timer__btn--ghost" data-t="reset">Đặt lại</button></div>`;
}
