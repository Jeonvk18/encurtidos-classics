/* ======================================================
   ENCURTIDOS CLASSIC'S - BASE DE DATOS DE PEDIDOS (Firebase)
   ------------------------------------------------------
   Este archivo hace UNA sola cosa: conectarse a Firestore
   y guardar ahí cada pedido que un cliente env\u00eda por
   WhatsApp o Instagram. script.js lo usa, pero no necesita
   saber c\u00f3mo funciona por dentro.
 
   IMPORTANTE: reemplaza los valores de abajo por los tuyos.
   Los obtienes en Firebase Console > Configuraci\u00f3n del
   proyecto > Tus apps > (ic\u00f3no </>) > "SDK setup and
   configuration".
====================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyAMgKD4Qr1KbBnrXRV1Z56BByPkqP7-4SA",
  authDomain: "encurtidos-classics.firebaseapp.com",
  projectId: "encurtidos-classics",
  storageBucket: "encurtidos-classics.firebasestorage.app",
  messagingSenderId: "682702588606",
  appId: "1:682702588606:web:202738ef606600f9ccacef"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/**
 * Guarda un pedido en la colección "pedidos" de Firestore.
 *
 * @param {Object} datosPedido
 * @param {Array}  datosPedido.productos   - [{ nombre, precio, cantidad }, ...]
 * @param {number} datosPedido.total       - total del pedido en dólares
 * @param {string} datosPedido.metodoEnvio - "whatsapp" o "instagram"
 */
function guardarPedidoEnBaseDeDatos(datosPedido) {

  return db.collection('pedidos').add({
    productos: datosPedido.productos,
    total: datosPedido.total,
    metodoEnvio: datosPedido.metodoEnvio,
    fecha: firebase.firestore.FieldValue.serverTimestamp()
  })
    .then(() => {
      console.log('Pedido guardado en la base de datos ✅');
    })
    .catch((error) => {
      // Si falla el guardado, no queremos romper el flujo del cliente:
      // el pedido igual se envía por WhatsApp/Instagram, solo no
      // quedará registrado. Lo dejamos en consola para revisarlo luego.
      console.error('No se pudo guardar el pedido en la base de datos:', error);
    });

}