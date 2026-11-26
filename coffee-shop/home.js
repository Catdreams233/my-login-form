/* ==========================================================
   THANH TÂN – trang chủ: hero, giá khởi điểm, thẻ vùng trồng
   Cần common.js + app.js (+ shop.js cho lưới sản phẩm).
   ========================================================== */
/* ==========================================================
   HERO
   ========================================================== */
$("#heroBags").innerHTML = [products[1], products[0], products[2]].map(bagSVG).join("");

/* Giá khởi điểm lấy từ dữ liệu sản phẩm */
$("#heroFrom").textContent = `Từ ${fmt(Math.min(...products.filter((p) => p.cat === "bean").map((p) => p.price)))} / 250g`;

/* Hai vùng trồng, bấm để sang trang Nguồn gốc */
$("#originTiles").innerHTML = origins.map((o) => `
  <a class="otile" href="nguon-goc.html">
    <div class="otile__art">${landscapeSVG(o)}<div class="origin__alt"><b>${o.alt}</b>so với mực nước biển</div></div>
    <div class="otile__body"><h3>${o.name}</h3><p>${o.region}</p><span class="link-btn">Xem vùng trồng →</span></div>
  </a>`).join("");
