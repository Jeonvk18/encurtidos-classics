/* ======================================================
   ENCURTIDOS CLASSIC'S - CARGA DE PRODUCTOS DESDE JSON
====================================================== */

function crearTarjetaProducto(producto) {

  return `
    <div class="producto" data-name="${producto.nombre}" data-price="${producto.precio.toFixed(2)}">

      <img src="${producto.imagen}" alt="${producto.alt}">

      <h3>${producto.nombre}</h3>

      <p>${producto.descripcion}</p>

      <span>$${producto.precio.toFixed(2)}</span>

      <div class="qty-stepper">

        <button class="qty-btn qty-minus" aria-label="Quitar uno">−</button>

        <span class="qty-value">0</span>

        <button class="qty-btn qty-plus" aria-label="Agregar uno">+</button>

      </div>

    </div>
  `;

}

function cargarProductos() {

  const contenedor = document.querySelector('.productos');

  if (!contenedor) return;

  fetch('productos.json')
    .then((respuesta) => {

      if (!respuesta.ok) throw new Error('No se pudo cargar productos.json');
      return respuesta.json();

    })
    .then((productos) => {

      contenedor.innerHTML = productos.map(crearTarjetaProducto).join('');

      document.dispatchEvent(new CustomEvent('productos:listos'));

    })
    .catch((error) => {

      contenedor.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#6b7280;">No se pudieron cargar los productos. Intenta recargar la página.</p>';
      console.error(error);

    });

}

document.addEventListener('DOMContentLoaded', cargarProductos);