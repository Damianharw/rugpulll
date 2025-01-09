const navToggler = document.querySelector(".nav-toggler");
const mobileNav = document.querySelector(".mobile-nav");

navToggler.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
});
