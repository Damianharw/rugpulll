const navToggler = document.querySelector(".nav-toggler");
const mobileNav = document.querySelector(".mobile-nav");

navToggler.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
});

const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

// Add a click event listener to the button
copyBtn.addEventListener('click', () => {
  const textToCopy = "0x6f1fa08c70c856439bf63e1d18b4e787c09e0463"; 
  navigator.clipboard.writeText(textToCopy)
  toast.style.display = 'block';

      // Hide the toast after 3 seconds
      setTimeout(() => {
        toast.style.display = 'none';
      }, 2000);
});
