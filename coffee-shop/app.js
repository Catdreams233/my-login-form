/* ==========================================================
   THANH TÂN Coffee – phần dùng chung mọi trang
   Giỏ hàng (localStorage), thông báo, menu mobile, bản tin, năm ở chân trang.
   Cần common.js nạp trước. Nạp trước các file riêng của từng trang.
   ========================================================== */

/* ==========================================================
   CART (lưu localStorage, thanh tiến độ freeship)
   ========================================================== */
const priceOf = (p, i) => round(p.price * SIZES[p.sizes][i].m);
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
   CHUNG: header, menu, toast, newsletter
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

window.addEventListener("scroll", () => $("#header").classList.toggle("scrolled", window.scrollY > 10), { passive: true });


$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("Cảm ơn bạn đã đăng ký nhận tin từ Thanh Tân!");
});

$("#year").textContent = new Date().getFullYear();
