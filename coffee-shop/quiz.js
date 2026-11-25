/* THANH TÂN – trang Tìm gu. Cần common.js + app.js. */

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
