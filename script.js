/* ======================================================
   ENCURTIDOS CLASSIC'S - SCRIPT PRINCIPAL
====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ====================================================
     1. MENÚ HAMBURGUESA (MÓVIL)
  ==================================================== */

  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {

    navToggle.addEventListener('click', () => {

      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    });

    // Cierra el menú al tocar cualquier link
    navLinks.querySelectorAll('a').forEach(link => {

      link.addEventListener('click', () => {

        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');

      });

    });

  }

  /* ====================================================
     2. LINK ACTIVO SEGÚN SECCIÓN VISIBLE
  ==================================================== */

  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('#nav-links a');

  if (sections.length && navAnchors.length) {

    const sectionObserver = new IntersectionObserver((entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          const id = entry.target.getAttribute('id');

          navAnchors.forEach(anchor => {

            anchor.classList.toggle(
              'active-link',
              anchor.getAttribute('href') === `#${id}`
            );

          });

        }

      });

    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));

  }

  /* ====================================================
     3. HEADER: SOMBRA/FONDO AL HACER SCROLL
  ==================================================== */

  const header = document.querySelector('header');

  const handleHeaderScroll = () => {

    if (!header) return;

    header.classList.toggle('scrolled', window.scrollY > 60);

  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ====================================================
     4. SCROLL REVEAL (ANIMACIÓN AL APARECER)
  ==================================================== */

  const revealSelectors = [
    '.card',
    '.producto',
    '.mango-producto',
    '.historia-texto',
    '.historia-video',
    'details',
    '.info',
    '.social',
    'table'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(','));

  revealElements.forEach((el, index) => {

    el.classList.add('reveal');
    // Pequeño retraso escalonado para elementos del mismo grupo
    el.style.transitionDelay = `${(index % 4) * 0.1}s`;

  });

  const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target);

      }

    });

  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ====================================================
     5. BOTÓN "VOLVER ARRIBA"
  ==================================================== */

  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {

    const toggleBackToTop = () => {

      backToTop.classList.toggle('show', window.scrollY > 500);

    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {

      window.scrollTo({ top: 0, behavior: 'smooth' });

    });

  }

  /* ====================================================
     6. BADGE LLAMATIVO EN EL BOTÓN DE INSTAGRAM
  ==================================================== */

  const igFloat = document.querySelector('.ig-float');

  if (igFloat) {

    setTimeout(() => {

      igFloat.classList.add('pulse');

    }, 4000);

  }

  /* ====================================================
     7. CARRITO DE PEDIDO
  ==================================================== */

  const WHATSAPP_NUMBER = '593978731507'; // +593 97 873 1507
  const INSTAGRAM_USER = 'encurtidosclassics1';

  const cart = {}; // { nombreProducto: { price, qty } }

  const cartToggle = document.getElementById('cart-toggle');
  const cartPanel = document.getElementById('cart-panel');
  const cartClose = document.getElementById('cart-close');
  const cartCount = document.getElementById('cart-count');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total-amount');
  const cartWhatsappBtn = document.getElementById('cart-whatsapp');
  const cartInstagramBtn = document.getElementById('cart-instagram');
  const cartToast = document.getElementById('cart-toast');

  const steppers = document.querySelectorAll('.qty-stepper');

  const formatMoney = (value) => `$${value.toFixed(2)}`;

  const showToast = (message) => {

    if (!cartToast) return;

    cartToast.textContent = message;
    cartToast.classList.add('show');

    clearTimeout(showToast._timer);

    showToast._timer = setTimeout(() => {
      cartToast.classList.remove('show');
    }, 2600);

  };

  const buildOrderText = () => {

    const items = Object.entries(cart);

    if (!items.length) return '';

    let text = 'Hola 👋, quiero hacer un pedido en Encurtidos Classic\'s:\n\n';

    let total = 0;

    items.forEach(([name, data]) => {

      const subtotal = data.price * data.qty;
      total += subtotal;

      text += `• ${data.qty} x ${name} — ${formatMoney(subtotal)}\n`;

    });

    text += `\nTotal: ${formatMoney(total)}`;
    text += '\n\n¿Me confirman disponibilidad y forma de entrega? ¡Gracias!';

    return text;

  };

  const updateCartLinks = () => {

    const orderText = buildOrderText();
    const encoded = encodeURIComponent(orderText);

    if (cartWhatsappBtn) {

      cartWhatsappBtn.href = orderText
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
        : `https://wa.me/${WHATSAPP_NUMBER}`;

    }

    if (cartInstagramBtn) {

      cartInstagramBtn.href = `https://ig.me/m/${INSTAGRAM_USER}`;

    }

  };

  const renderCart = () => {

    const entries = Object.entries(cart);

    const totalItems = entries.reduce((sum, [, data]) => sum + data.qty, 0);
    const totalAmount = entries.reduce((sum, [, data]) => sum + data.qty * data.price, 0);

    if (cartCount) {

      cartCount.textContent = totalItems;
      cartCount.classList.toggle('show', totalItems > 0);

    }

    if (cartTotalEl) cartTotalEl.textContent = formatMoney(totalAmount);

    if (cartItemsEl) {

      if (!entries.length) {

        cartItemsEl.innerHTML = '<p class="cart-empty">Aún no has agregado productos. Usa los botones + en cada producto.</p>';

      } else {

        cartItemsEl.innerHTML = entries.map(([name, data]) => `
          <div class="cart-item">
            <span class="cart-item-name">${name}</span>
            <span class="cart-item-qty">x${data.qty}</span>
            <span class="cart-item-subtotal">${formatMoney(data.qty * data.price)}</span>
          </div>
        `).join('');

      }

    }

    const disableSend = entries.length === 0;

    [cartWhatsappBtn, cartInstagramBtn].forEach(btn => {

      if (btn) btn.classList.toggle('disabled', disableSend);

    });

    updateCartLinks();

  };

  const syncStepperDisplay = (stepper, qty) => {

    const valueEl = stepper.querySelector('.qty-value');
    if (valueEl) valueEl.textContent = qty;

  };

  steppers.forEach(stepper => {

    const container = stepper.closest('[data-name]');
    if (!container) return;

    const name = container.getAttribute('data-name');
    const price = parseFloat(container.getAttribute('data-price')) || 0;

    const minusBtn = stepper.querySelector('.qty-minus');
    const plusBtn = stepper.querySelector('.qty-plus');

    minusBtn.addEventListener('click', () => {

      if (!cart[name] || cart[name].qty <= 0) return;

      cart[name].qty -= 1;

      if (cart[name].qty === 0) delete cart[name];

      syncStepperDisplay(stepper, cart[name] ? cart[name].qty : 0);
      renderCart();

    });

    plusBtn.addEventListener('click', () => {

      if (!cart[name]) cart[name] = { price, qty: 0 };

      cart[name].qty += 1;

      syncStepperDisplay(stepper, cart[name].qty);
      renderCart();

      if (cartPanel && !cartPanel.classList.contains('open')) {

        showToast(`${name} agregado al pedido 🛒`);

      }

    });

  });

  if (cartToggle && cartPanel) {

    cartToggle.addEventListener('click', () => {

      cartPanel.classList.toggle('open');

    });

  }

  if (cartClose && cartPanel) {

    cartClose.addEventListener('click', () => {

      cartPanel.classList.remove('open');

    });

  }

  if (cartInstagramBtn) {

    cartInstagramBtn.addEventListener('click', (event) => {

      const orderText = buildOrderText();

      if (!orderText) {

        event.preventDefault();
        showToast('Agrega al menos un producto primero 🙂');
        return;

      }

      if (navigator.clipboard && navigator.clipboard.writeText) {

        navigator.clipboard.writeText(orderText)
          .then(() => showToast('Pedido copiado. ¡Pégalo en el chat de Instagram! 📋'))
          .catch(() => showToast('Abriendo Instagram...'));

      }

    });

  }

  if (cartWhatsappBtn) {

    cartWhatsappBtn.addEventListener('click', (event) => {

      if (!Object.keys(cart).length) {

        event.preventDefault();
        showToast('Agrega al menos un producto primero 🙂');

      }

    });

  }

  renderCart();

});