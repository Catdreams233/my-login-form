// ===== Dữ liệu sản phẩm (sửa tại đây để thay đổi sản phẩm) =====
const IMG = (id) => `https://images.unsplash.com/${id}?w=600&q=80`;

const products = [
  { id: 1, name: "Robusta Honey Buôn Ma Thuột", cat: "bean", price: 165000, old: 190000, tag: "Bán chạy",
    desc: "Đậm đà, hậu ngọt, crema dày – lý tưởng pha phin.", notes: ["Socola đen", "Caramel"], img: IMG("photo-1559056199-641a0ac8b55e") },
  { id: 2, name: "Arabica Cầu Đất", cat: "bean", price: 240000, tag: "Specialty",
    desc: "Chua thanh, hương hoa quả – hợp pha máy & pour-over.", notes: ["Cam", "Hoa nhài"], img: IMG("photo-1611854779393-1b2da9d400fe") },
  { id: 3, name: "Culi Đặc Biệt", cat: "bean", price: 185000,
    desc: "Hạt tròn, vị mạnh, hương thơm nồng nàn.", notes: ["Hạt rang", "Đường nâu"], img: IMG("photo-1514432324607-a09d9b4aefdd") },
  { id: 4, name: "Bột Pha Phin Truyền Thống", cat: "ground", price: 120000, old: 140000,
    desc: "Phối trộn 70% Robusta – 30% Arabica, xay vừa.", notes: ["Đậm", "Thơm lâu"], img: IMG("photo-1610632380989-680fe40816c6") },
  { id: 5, name: "Bột Espresso Blend", cat: "ground", price: 150000,
    desc: "Xay mịn cho máy espresso, cân bằng đắng – chua.", notes: ["Mật ong", "Hạnh nhân"], img: IMG("photo-1510707577719-ae7c14805e3a") },
  { id: 6, name: "Cold Brew Chai 330ml", cat: "drink", price: 45000, tag: "Mới",
    desc: "Ủ lạnh 18 giờ, mượt mà, ít đắng. Bảo quản lạnh 7 ngày.", notes: ["Mượt", "Ít acid"], img: IMG("photo-1517701604599-bb29b565090c") },
  { id: 7, name: "Cà Phê Sữa Đóng Chai", cat: "drink", price: 35000,
    desc: "Công thức cà phê sữa Sài Gòn, uống liền tiện lợi.", notes: ["Béo", "Ngọt dịu"], img: IMG("photo-1461023058943-07fcbe16d735") },
  { id: 8, name: "Hộp Quà Mộc Premium", cat: "gift", price: 590000, old: 650000, tag: "Quà Tết",
    desc: "2 túi hạt 250g + phin đồng + ly sứ, hộp gỗ khắc tên.", notes: ["Sang trọng", "Khắc tên"], img: IMG("photo-1512568400610-62da28bc8a13") },
];

const fmt = (n) => n.toLocaleString("vi-VN") + "đ";
const $ = (s) => document.querySelector(s);

// ===== Render sản phẩm =====
const grid = $("#productGrid");
function renderProducts(filter = "all") {
  const list = filter === "all" ? products : products.filter((p) => p.cat === filter);
  grid.innerHTML = list.map((p, i) => `
    <article class="product" style="animation-delay:${i * 60}ms">
      <div class="product__img" style="background-image:url('${p.img}')">
        ${p.tag ? `<span class="product__tag">${p.tag}</span>` : ""}
      </div>
      <div class="product__body">
        <h3>${p.name}</h3>
        <p class="product__desc">${p.desc}</p>
        <div class="product__notes">${p.notes.map((n) => `<span>${n}</span>`).join("")}</div>
        <div class="product__foot">
          <div class="price">${p.old ? `<small>${fmt(p.old)}</small>` : ""}${fmt(p.price)}</div>
          <button class="add-btn" data-id="${p.id}" aria-label="Thêm ${p.name} vào giỏ">+</button>
        </div>
      </div>
    </article>`).join("");
}
renderProducts();

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
  renderProducts(btn.dataset.filter);
});

// ===== Giỏ hàng (lưu localStorage) =====
let cart = [];
try { cart = JSON.parse(localStorage.getItem("moc-cart")) || []; } catch { cart = []; }
const save = () => { try { localStorage.setItem("moc-cart", JSON.stringify(cart)); } catch {} };

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * products.find((p) => p.id === i.id).price, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = fmt(total);
  $("#cartItems").innerHTML = cart.length
    ? cart.map((i) => {
        const p = products.find((x) => x.id === i.id);
        return `
        <div class="cart-item">
          <div class="cart-item__img" style="background-image:url('${p.img}')"></div>
          <div>
            <h4>${p.name}</h4>
            <small>${fmt(p.price)}</small>
            <div class="qty">
              <button data-act="dec" data-id="${p.id}">−</button>
              <span>${i.qty}</span>
              <button data-act="inc" data-id="${p.id}">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-act="del" data-id="${p.id}">Xóa</button>
        </div>`;
      }).join("")
    : `<div class="cart__empty"><span>☕</span>Giỏ hàng đang trống</div>`;
  save();
}

function addToCart(id) {
  const item = cart.find((i) => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  renderCart();
  const badge = $("#cartCount");
  badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  toast(`Đã thêm “${products.find((p) => p.id === id).name}” vào giỏ`);
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (btn) addToCart(+btn.dataset.id);
});

$("#cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const id = +btn.dataset.id;
  const item = cart.find((i) => i.id === id);
  if (btn.dataset.act === "inc") item.qty++;
  if (btn.dataset.act === "dec") item.qty--;
  if (btn.dataset.act === "del" || item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  renderCart();
});

const openCart = () => { $("#cart").classList.add("open"); $("#overlay").classList.add("show"); };
const closeCart = () => { $("#cart").classList.remove("open"); $("#overlay").classList.remove("show"); };
$("#cartBtn").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());

$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return toast("Giỏ hàng trống, hãy chọn sản phẩm nhé!");
  cart = [];
  renderCart();
  closeCart();
  toast("🎉 Đặt hàng thành công! Mộc sẽ gọi xác nhận trong 15 phút.");
});
renderCart();

// ===== Toast =====
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

// ===== Header, menu mobile, active link, back-to-top =====
const header = $("#header");
const nav = $("#nav");
$("#menuToggle").addEventListener("click", () => nav.classList.toggle("open"));
nav.addEventListener("click", (e) => e.target.matches(".nav__link") && nav.classList.remove("open"));

const sections = [...document.querySelectorAll("section[id]")];
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 40);
  $("#toTop").classList.toggle("show", y > 600);
  const current = sections.filter((s) => s.offsetTop - 120 <= y).pop();
  if (current) {
    document.querySelectorAll(".nav__link").forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id));
  }
});
$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== Hiệu ứng xuất hiện khi cuộn =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Form liên hệ =====
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name"), phone = $("#phone"), note = $("#formNote");
  const okName = name.value.trim().length >= 2;
  const okPhone = /^0\d{9}$/.test(phone.value.replace(/\s/g, ""));
  name.classList.toggle("invalid", !okName);
  phone.classList.toggle("invalid", !okPhone);
  if (!okName || !okPhone) {
    note.className = "form-note err";
    note.textContent = "Vui lòng nhập họ tên và số điện thoại hợp lệ (10 số).";
    return;
  }
  note.className = "form-note ok";
  note.textContent = `Cảm ơn ${name.value.trim()}! Chúng tôi sẽ liên hệ lại sớm nhất.`;
  e.target.reset();
});

$("#newsletter").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("Đăng ký thành công! Mã ưu đãi đã được gửi vào email.");
});

$("#year").textContent = new Date().getFullYear();
