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

  // --- WhatsApp Cart Logic ---
  
  let cart = [];
  const WHATSAPP_NUMBER = "254795429932";
  
  const cartBtn = document.getElementById('cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalPriceEl = document.getElementById('cart-total-price');
  const cartBadge = document.querySelector('.cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Toggle Drawer
  const openCart = () => {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
  };
  
  const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
  };

  cartBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Render Cart UI
  const updateCartUI = () => {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Render Items
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
      cartTotalPriceEl.textContent = 'KES 0';
      return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      
      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">KES ${item.price.toLocaleString()}</span>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn minus" data-id="${item.id}">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.id}">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    cartTotalPriceEl.textContent = `KES ${total.toLocaleString()}`;

    // Attach +/- listeners
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (e.target.classList.contains('plus')) updateQuantity(id, 1);
        if (e.target.classList.contains('minus')) updateQuantity(id, -1);
      });
    });
  };

  // State Management
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
  };

  const updateQuantity = (id, delta) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
      }
    }
    updateCartUI();
  };

  // Bind Add To Cart Buttons
  const addBtns = document.querySelectorAll('.add-to-cart-btn');
  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const product = {
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: parseInt(btn.getAttribute('data-price'))
      };
      
      addToCart(product);
      
      // Feedback animation
      const originalText = btn.textContent;
      btn.textContent = "Added!";
      btn.style.backgroundColor = "#2F0808";
      btn.style.color = "#D4AF37";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }, 1500);

      openCart();
    });
  });

  // WhatsApp Checkout
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    let total = 0;
    let message = "Hello Divine Heritage! I'd like to place an order:%0A%0A";

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      message += `- ${item.quantity}x *${item.name}* (KES ${itemTotal.toLocaleString()})%0A`;
    });

    message += `%0A*Total: KES ${total.toLocaleString()}*%0A%0APlease let me know how to pay!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  });

});
