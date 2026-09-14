/* ======================================================
   ENCURTIDOS CLASSIC'S - SCRIPT PRINCIPAL
====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ====================================================
     1. MENÚ HAMBURGUESA (MÓVIL)
  ==================================================== */

  const botonMenu = document.getElementById('nav-toggle');
  const enlacesMenu = document.getElementById('nav-links');

  if (botonMenu && enlacesMenu) {

    botonMenu.addEventListener('click', () => {

      const estaAbierto = enlacesMenu.classList.toggle('open');
      botonMenu.classList.toggle('active', estaAbierto);
      botonMenu.setAttribute('aria-expanded', estaAbierto ? 'true' : 'false');

    });

    enlacesMenu.querySelectorAll('a').forEach(enlace => {

      enlace.addEventListener('click', () => {

        enlacesMenu.classList.remove('open');
        botonMenu.classList.remove('active');
        botonMenu.setAttribute('aria-expanded', 'false');

      });

    });

  }

  /* ====================================================
     2. LINK ACTIVO SEGÚN SECCIÓN VISIBLE
  ==================================================== */

  const secciones = document.querySelectorAll('section[id], header[id]');
  const anclasMenu = document.querySelectorAll('#nav-links a');

  if (secciones.length && anclasMenu.length) {

    const observadorSecciones = new IntersectionObserver((entradas) => {

      entradas.forEach(entrada => {

        if (entrada.isIntersecting) {

          const id = entrada.target.getAttribute('id');

          anclasMenu.forEach(ancla => {

            ancla.classList.toggle(
              'active-link',
              ancla.getAttribute('href') === `#${id}`
            );

          });

        }

      });

    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    secciones.forEach(seccion => observadorSecciones.observe(seccion));

  }

  /* ====================================================
     3. HEADER: SOMBRA/FONDO AL HACER SCROLL
  ==================================================== */

  const encabezado = document.querySelector('header');

  const manejarScrollEncabezado = () => {

    if (!encabezado) return;

    encabezado.classList.toggle('scrolled', window.scrollY > 60);

  };

  window.addEventListener('scroll', manejarScrollEncabezado, { passive: true });
  manejarScrollEncabezado();

  /* ====================================================
     4. SCROLL REVEAL (ANIMACIÓN AL APARECER)
  ==================================================== */

  const selectoresRevelado = [
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

  const observadorRevelado = new IntersectionObserver((entradas) => {

    entradas.forEach(entrada => {

      if (entrada.isIntersecting) {

        entrada.target.classList.add('reveal-active');
        observadorRevelado.unobserve(entrada.target);

      }

    });

  }, { threshold: 0.15 });

  // Se separó en una función porque ahora se necesita ejecutar dos veces:
  // una vez al cargar la página (tarjetas, tabla, historia, etc.) y otra
  // vez cuando producto.js termina de insertar las tarjetas de producto.
  function activarScrollReveal(elementos) {

    elementos.forEach((elemento, indice) => {

      elemento.classList.add('reveal');
      elemento.style.transitionDelay = `${(indice % 4) * 0.1}s`;
      observadorRevelado.observe(elemento);

    });

  }

  activarScrollReveal(document.querySelectorAll(selectoresRevelado.join(',')));

  /* ====================================================
     5. BOTÓN "VOLVER ARRIBA"
  ==================================================== */

  const botonVolverArriba = document.getElementById('back-to-top');

  if (botonVolverArriba) {

    const alternarVolverArriba = () => {

      botonVolverArriba.classList.toggle('show', window.scrollY > 500);

    };

    window.addEventListener('scroll', alternarVolverArriba, { passive: true });
    alternarVolverArriba();

    botonVolverArriba.addEventListener('click', () => {

      window.scrollTo({ top: 0, behavior: 'smooth' });

    });

  }

  /* ====================================================
     6. BADGE LLAMATIVO EN EL BOTÓN DE INSTAGRAM
  ==================================================== */

  const flotanteInstagram = document.querySelector('.ig-float');

  if (flotanteInstagram) {

    setTimeout(() => {

      flotanteInstagram.classList.add('pulse');

    }, 4000);

  }

  /* ====================================================
     7. CARRITO DE PEDIDO
  ==================================================== */

  const NUMERO_WHATSAPP = '593978731507'; // +593 97 873 1507
  const USUARIO_INSTAGRAM = 'encurtidosclassics1';

  const carrito = {}; // { nombreProducto: { price, qty } }

  const botonCarrito = document.getElementById('cart-toggle');
  const panelCarrito = document.getElementById('cart-panel');
  const cerrarCarrito = document.getElementById('cart-close');
  const contadorCarrito = document.getElementById('cart-count');
  const elementosCarritoEl = document.getElementById('cart-items');
  const totalCarritoEl = document.getElementById('cart-total-amount');
  const botonWhatsappCarrito = document.getElementById('cart-whatsapp');
  const botonInstagramCarrito = document.getElementById('cart-instagram');
  const avisoCarrito = document.getElementById('cart-toast');

  const formatearDinero = (valor) => `$${valor.toFixed(2)}`;

  const mostrarAviso = (mensaje) => {

    if (!avisoCarrito) return;

    avisoCarrito.textContent = mensaje;
    avisoCarrito.classList.add('show');

    clearTimeout(mostrarAviso._temporizador);

    mostrarAviso._temporizador = setTimeout(() => {
      avisoCarrito.classList.remove('show');
    }, 2600);

  };

  const construirTextoPedido = () => {

    const items = Object.entries(carrito);

    if (!items.length) return '';

    let texto = 'Hola 👋, quiero hacer un pedido en Encurtidos Classic\'s:\n\n';

    let total = 0;

    items.forEach(([nombre, datos]) => {

      const subtotal = datos.price * datos.qty;
      total += subtotal;

      texto += `• ${datos.qty} x ${nombre} — ${formatearDinero(subtotal)}\n`;

    });

    texto += `\nTotal: ${formatearDinero(total)}`;
    texto += '\n\n¿Me confirman disponibilidad y forma de entrega? ¡Gracias!';

    return texto;

  };

  const actualizarEnlacesCarrito = () => {

    const textoPedido = construirTextoPedido();
    const textoCodificado = encodeURIComponent(textoPedido);

    if (botonWhatsappCarrito) {

      botonWhatsappCarrito.href = textoPedido
        ? `https://wa.me/${NUMERO_WHATSAPP}?text=${textoCodificado}`
        : `https://wa.me/${NUMERO_WHATSAPP}`;

    }

    if (botonInstagramCarrito) {

      botonInstagramCarrito.href = `https://ig.me/m/${USUARIO_INSTAGRAM}`;

    }

  };

  const renderizarCarrito = () => {

    const entradas = Object.entries(carrito);

    const totalItems = entradas.reduce((suma, [, datos]) => suma + datos.qty, 0);
    const totalMonto = entradas.reduce((suma, [, datos]) => suma + datos.qty * datos.price, 0);

    if (contadorCarrito) {

      contadorCarrito.textContent = totalItems;
      contadorCarrito.classList.toggle('show', totalItems > 0);

    }

    if (totalCarritoEl) totalCarritoEl.textContent = formatearDinero(totalMonto);

    if (elementosCarritoEl) {

      if (!entradas.length) {

        elementosCarritoEl.innerHTML = '<p class="cart-empty">Aún no has agregado productos. Usa los botones + en cada producto.</p>';

      } else {

        elementosCarritoEl.innerHTML = entradas.map(([nombre, datos]) => `
          <div class="cart-item">
            <span class="cart-item-name">${nombre}</span>
            <span class="cart-item-qty">x${datos.qty}</span>
            <span class="cart-item-subtotal">${formatearDinero(datos.qty * datos.price)}</span>
          </div>
        `).join('');

      }

    }

    const deshabilitarEnvio = entradas.length === 0;

    [botonWhatsappCarrito, botonInstagramCarrito].forEach(boton => {

      if (boton) boton.classList.toggle('disabled', deshabilitarEnvio);

    });

    actualizarEnlacesCarrito();

  };

  const sincronizarVistaContador = (contador, cantidad) => {

    const valorEl = contador.querySelector('.qty-value');
    if (valorEl) valorEl.textContent = cantidad;

  };

  /**
   * Conecta los botones +/- de UN stepper de cantidad al carrito.
   * Antes esto vivía suelto dentro de un forEach que se ejecutaba
   * una sola vez. Ahora es una función aparte porque necesitamos
   * poder llamarla de nuevo cuando producto.js agrega tarjetas
   * nuevas al DOM (los productos que vienen del JSON).
   */
  function conectarStepper(contador) {

    // Evita conectar el mismo stepper dos veces si esta función
    // se llama más de una vez (por ejemplo, si el carrito se
    // recarga o se agregan más productos después).
    if (contador.dataset.wired === 'true') return;
    contador.dataset.wired = 'true';

    const contenedorProducto = contador.closest('[data-name]');
    if (!contenedorProducto) return;

    const nombre = contenedorProducto.getAttribute('data-name');
    const precio = parseFloat(contenedorProducto.getAttribute('data-price')) || 0;

    const botonMenos = contador.querySelector('.qty-minus');
    const botonMas = contador.querySelector('.qty-plus');

    botonMenos.addEventListener('click', () => {

      if (!carrito[nombre] || carrito[nombre].qty <= 0) return;

      carrito[nombre].qty -= 1;

      if (carrito[nombre].qty === 0) delete carrito[nombre];

      sincronizarVistaContador(contador, carrito[nombre] ? carrito[nombre].qty : 0);
      renderizarCarrito();

    });

    botonMas.addEventListener('click', () => {

      if (!carrito[nombre]) carrito[nombre] = { price: precio, qty: 0 };

      carrito[nombre].qty += 1;

      sincronizarVistaContador(contador, carrito[nombre].qty);
      renderizarCarrito();

      if (panelCarrito && !panelCarrito.classList.contains('open')) {

        mostrarAviso(`${nombre} agregado al pedido 🛒`);

      }

    });

  }

  /**
   * Busca TODOS los .qty-stepper que haya en la página en este
   * momento (los que ya existían, como el de Mango, y los que
   * producto.js haya podido agregar) y los conecta al carrito.
   */
  function conectarTodosLosSteppers() {

    document.querySelectorAll('.qty-stepper').forEach(conectarStepper);

  }

  if (botonCarrito && panelCarrito) {

    botonCarrito.addEventListener('click', () => {

      panelCarrito.classList.toggle('open');

    });

  }

  if (cerrarCarrito && panelCarrito) {

    cerrarCarrito.addEventListener('click', () => {

      panelCarrito.classList.remove('open');

    });

  }

  if (botonInstagramCarrito) {

    botonInstagramCarrito.addEventListener('click', (evento) => {

      const textoPedido = construirTextoPedido();

      if (!textoPedido) {

        evento.preventDefault();
        mostrarAviso('Agrega al menos un producto primero 🙂');
        return;

      }

      if (navigator.clipboard && navigator.clipboard.writeText) {

        navigator.clipboard.writeText(textoPedido)
          .then(() => mostrarAviso('Pedido copiado. ¡Pégalo en el chat de Instagram! 📋'))
          .catch(() => mostrarAviso('Abriendo Instagram...'));

      }

    });

  }

  if (botonWhatsappCarrito) {

    botonWhatsappCarrito.addEventListener('click', (evento) => {

      if (!Object.keys(carrito).length) {

        evento.preventDefault();
        mostrarAviso('Agrega al menos un producto primero 🙂');

      }

    });

  }

  // Conecta lo que ya exista en el HTML al cargar (por ejemplo, el
  // stepper del Encurtido de Mango, que sigue escrito a mano).
  conectarTodosLosSteppers();
  renderizarCarrito();

  // Cuando producto.js termina de insertar las tarjetas de Pepino
  // y Rábano (cargadas desde productos.json), esta página se entera
  // por este evento y conecta también esos steppers nuevos, y les
  // aplica la misma animación de aparición que al resto de la página.
  document.addEventListener('productos:listos', () => {

    conectarTodosLosSteppers();
    activarScrollReveal(document.querySelectorAll('.productos .producto'));

  });

});