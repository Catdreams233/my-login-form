/* Mộc Coffee – script nhẹ cho trang blog (không dùng script.js vì trang này không có giỏ hàng/cửa hàng) */
const nav = document.getElementById("nav");
const header = document.getElementById("header");

document.getElementById("menuToggle").addEventListener("click", () => nav.classList.toggle("open"));
nav.addEventListener("click", (e) => e.target.matches("a") && nav.classList.remove("open"));

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

document.getElementById("year").textContent = new Date().getFullYear();
