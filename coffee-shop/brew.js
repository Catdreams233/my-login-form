/* THANH TÂN – trang Cách pha (bảng công thức nhanh). Cần common.js. */

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
