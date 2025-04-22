






// login.js - Sistema de autenticación y gestión de usuarios

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA315DhY3uEPGtgkTQZ99LhdnTn9hT6t1Q",
  authDomain: "login-27613.firebaseapp.com",
  projectId: "login-27613",
  storageBucket: "login-27613.appspot.com",
  messagingSenderId: "503807303549",
  appId: "1:503807303549:web:fa7056ec0112f3b1bef614",
  measurementId: "G-Z4H192M277"
};

// Inicializar Firebase si no está ya inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Mostrar formularios
function showLoginForm() {
  document.getElementById('register-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
}

function showRegisterForm() {
  document.getElementById('register-section').style.display = 'block';
  document.getElementById('login-section').style.display = 'none';
}

// Guardar usuario en localStorage
function saveUserToLocalStorage(user, data) {
  localStorage.setItem("usuarioUID", user.uid);
  localStorage.setItem("nombreUsuario", data?.nombre_completo || "");
  localStorage.setItem("correoUsuario", data?.email || "");
}

// Recuperar usuario actual
function getCurrentUserUID() {
  return localStorage.getItem("usuarioUID");
}

// Eventos al cargar DOM
document.addEventListener("DOMContentLoaded", () => {
  const isLogin = window.location.pathname.includes("login");

  if (isLogin) {
    setupLoginAndRegister();
  }

  if (!isLogin) {
    loadUserProfile();
    setupLogout();
  }

  if (window.location.pathname.includes("final.html")) {
    autocompletarCheckout();
  }
});

// REGISTRO E INICIO DE SESIÓN
function setupLoginAndRegister() {
  const btnRegistro = document.getElementById('registro');
  const btnLogin = document.getElementById('login');

  if (btnRegistro) {
    btnRegistro.addEventListener('click', () => {
      const email = document.getElementById('emailreg').value;
      const password = document.getElementById('passwordreg').value;
      const nombreCompleto = document.getElementById('nombre_completo').value;

      if (!email || !password || !nombreCompleto) {
        return alert("Completa todos los campos");
      }

      auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
          return db.collection("usuarios").doc(cred.user.uid).set({
            email: email,
            nombre_completo: nombreCompleto,
            fecha_registro: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            saveUserToLocalStorage(cred.user, { email, nombre_completo: nombreCompleto });
            window.location.href = "index.html";
          });
        })
        .catch(err => alert("Error: " + err.message));
    });
  }

  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      const email = document.getElementById('emaillogin').value;
      const password = document.getElementById('passwordlogin').value;

      if (!email || !password) {
        return alert("Completa todos los campos");
      }

      auth.signInWithEmailAndPassword(email, password)
        .then(cred => {
          return db.collection("usuarios").doc(cred.user.uid).get()
            .then(doc => {
              saveUserToLocalStorage(cred.user, doc.data());
              window.location.href = "index.html";
            });
        })
        .catch(err => alert("Error: " + err.message));
    });
  }
}

// MOSTRAR PERFIL EN index.html
function loadUserProfile() {
  const uid = getCurrentUserUID();
  if (!uid) return;

  db.collection("usuarios").doc(uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      document.getElementById("user-name").textContent = data.nombre_completo || "Sin nombre";
      document.getElementById("user-email").textContent = data.email;

      const fecha = data.fecha_registro?.toDate?.();
      document.getElementById("user-date").textContent = fecha
        ? `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth()+1).toString().padStart(2, '0')}/${fecha.getFullYear()}`
        : "No disponible";
    }
  });
}

// CERRAR SESIÓN
function setupLogout() {
  const btnLogout = document.getElementById("logout-btn");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      auth.signOut().then(() => {
        localStorage.clear();
        window.location.href = "login.html";
      });
    });
  }
}

// AUTOCOMPLETAR CAMPOS EN EL CHECKOUT (final.html)
function autocompletarCheckout() {
  const uid = getCurrentUserUID();
  if (!uid) return;

  db.collection("usuarios").doc(uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const nombre = data.nombre_completo || "";
      const correo = data.email || "";

      const inputNombre = document.getElementById("fullName");
      const inputCorreo = document.getElementById("email");

      if (inputNombre) inputNombre.value = nombre;
      if (inputCorreo) inputCorreo.value = correo;
    }
  });
}



















document.addEventListener("DOMContentLoaded", function() {
  // ... tu código existente ...

  document.getElementById("place-order").addEventListener("click", function() {
    if (validateForm()) {
      saveOrderToFirebase();
    }
  });

  // ... tu código existente ...
});

function saveOrderToFirebase() {
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const phone = document.getElementById("phone").value;
  const cardNumber = document.getElementById("cardNumber").value; // Recuerda la seguridad
  const expDate = document.getElementById("expDate").value;
  const cvv = document.getElementById("cvv").value; // Recuerda la seguridad
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCompra = parseFloat(document.getElementById("checkout-total").textContent.replace('$', ''));
  const fechaCompra = firebase.firestore.FieldValue.serverTimestamp(); // Obtiene la hora del servidor de Firebase

  db.collection("compras")
    .add({
      usuarioId: "ID del usuario (si está autenticado)", // Implementa tu lógica de autenticación
      fechaCompra: fechaCompra,
      datosCliente: {
        nombreCompleto: fullName,
        correoElectronico: email,
        direccion: address,
        ciudad: city,
        numeroTelefono: phone
      },
      informacionPago: {
        numeroTarjeta: cardNumber.slice(-4), // Solo guardar los últimos 4 dígitos
        fechaVencimiento: expDate,
        // Nunca guardar el CVV de forma persistente
      },
      productos: cart.map(item => ({
        productoId: item.id, // Asegúrate de que tus items en el carrito tengan un ID
        nombre: item.name,
        cantidad: item.quantity,
        precioUnitario: item.price
      })),
      totalCompra: totalCompra,
      estadoPedido: "Pendiente" // Estado inicial del pedido
    })
    .then((docRef) => {
      console.log("Pedido guardado con ID: ", docRef.id);
      showToast("Pedido realizado con éxito!");
      localStorage.removeItem("cart"); // Limpiar el carrito después de la compra
      setTimeout(() => {
        window.location.href = "comprafi.html"; // Redirigir a la página de confirmación
      }, 2000);
    })
    .catch((error) => {
      console.error("Error al guardar el pedido: ", error);
      showToast("Ocurrió un error al procesar su pedido. Por favor, inténtelo de nuevo.");
    });
}






document.getElementById("registro").addEventListener("click", () => {
  const email = document.getElementById("emailreg").value;
  const password = document.getElementById("passwordreg").value;
  const nombreCompleto = document.getElementById("nombre_completo").value;

  if (!email || !password || !nombreCompleto) {
    alert("Completa todos los campos");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      const uid = cred.user.uid;
      return db.collection("usuarios").doc(uid).set({
        email: email,
        nombre_completo: nombreCompleto,
        fecha_registro: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("Usuario registrado correctamente");
      window.location.href = "index.html";
    })
    .catch((error) => alert("Error al registrar: " + error.message));
});



document.getElementById("login").addEventListener("click", () => {
  const email = document.getElementById("emaillogin").value;
  const password = document.getElementById("passwordlogin").value;

  if (!email || !password) {
    alert("Completa todos los campos");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((cred) => {
      localStorage.setItem("usuarioUID", cred.user.uid);
      window.location.href = "index.html";
    })
    .catch((error) => alert("Error al iniciar sesión: " + error.message));
});


document.getElementById("place-order").addEventListener("click", () => {
  const uid = localStorage.getItem("usuarioUID");
  if (!uid) {
    alert("Debes iniciar sesión para hacer una compra");
    return;
  }

  const nombre = document.getElementById("fullName").value;
  const correo = document.getElementById("email").value;
  const direccion = document.getElementById("address").value;
  const ciudad = document.getElementById("city").value;
  const telefono = document.getElementById("phone").value;
  const tarjeta = document.getElementById("cardNumber").value;
  const vencimiento = document.getElementById("expDate").value;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = parseFloat(document.getElementById("checkout-total").textContent.replace('$', ''));

  db.collection("compras").add({
    usuarioId: uid,
    fechaCompra: firebase.firestore.FieldValue.serverTimestamp(),
    datosCliente: {
      nombreCompleto: nombre,
      correoElectronico: correo,
      direccion: direccion,
      ciudad: ciudad,
      numeroTelefono: telefono
    },
    informacionPago: {
      numeroTarjeta: tarjeta.slice(-4), // Solo los últimos 4 dígitos
      fechaVencimiento: vencimiento
    },
    productos: cart.map(item => ({
      productoId: item.id,
      nombre: item.name,
      cantidad: item.quantity,
      precioUnitario: item.price
    })),
    totalCompra: total,
    estadoPedido: "Pendiente"
  })
  .then(() => {
    alert("Compra realizada con éxito");
    localStorage.removeItem("cart");
    window.location.href = "comprafi.html";
  })
  .catch((error) => {
    console.error("Error al guardar la compra: ", error);
    alert("Error al realizar la compra");
  });
});



window.addEventListener("DOMContentLoaded", () => {
  const uid = localStorage.getItem("usuarioUID");
  if (!uid) return;

  db.collection("usuarios").doc(uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      document.getElementById("fullName").value = data.nombre_completo || "";
      document.getElementById("email").value = data.email || "";
    }
  });
});




