document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header Logic
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // Scroll Animation Observer (Micro-animations)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-right, .fade-in-left');
  animatedElements.forEach(el => observer.observe(el));

  // Quick Add To Cart demo logic
  const cartBtns = document.querySelectorAll('.add-to-cart-btn');
  const cartCountEl = document.querySelector('.cart-count');
  let cartCount = 0;

  cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // prevent navigation
      cartCount++;
      cartCountEl.textContent = cartCount;
      
      // Feedback animation
      const originalText = btn.textContent;
      btn.textContent = "Added!";
      btn.style.backgroundColor = "#2F0808"; // Dark maroon
      btn.style.color = "#D4AF37"; // Gold text
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }, 2000);
    });
  });
});
