document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("nav-list");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });
});