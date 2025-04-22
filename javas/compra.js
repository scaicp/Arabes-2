// auth.js - Sistema de autenticación conectado a tu base de datos específica

// Configuración de Firebase para el proyecto "infocompras"
const firebaseConfig = {
    apiKey: "AIzaSyD9z6TXcVAoxzU3XTaQLNGV6ZN8kvArkpQ",
    authDomain: "infocompras-b995b.firebaseapp.com",
    projectId: "infocompras-b995b",
    storageBucket: "infocompras-b995b.firebasestorage.app",
    messagingSenderId: "384206438890",
    appId: "1:384206438890:web:a91caa9d0ce391bb2a3293",
    measurementId: "G-RNKWY62CV9"
  };
  
  // Inicializar Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  
  // Referencia a servicios de Firebase
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Referencia específica a la colección "usuarios"
  const usuariosRef = db.collection("usuarios");
  
  // Funciones para mostrar/ocultar formularios
  function showLoginForm() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
  }
  
  function showRegisterForm() {
    document.getElementById('register-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
  }
  
  // Función para guardar usuario en localStorage
  function saveUserToLocalStorage(user, userData) {
    localStorage.setItem("usuarioUID", user.uid);
    localStorage.setItem("nombreUsuario", userData?.nombreCompleto || "");
    localStorage.setItem("correoUsuario", userData?.correoElectronico || "");
  }
  
  // Función para recuperar el UID del usuario actual
  function getCurrentUserUID() {
    return localStorage.getItem("usuarioUID");
  }
  
  // Detectar si el usuario está autenticado
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // Usuario autenticado
      console.log("Usuario autenticado:", user.uid);
      
      // Obtener datos del usuario desde Firestore
      usuariosRef.doc(user.uid).get()
        .then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            saveUserToLocalStorage(user, userData.datosCliente || userData);
          }
        })
        .catch(error => {
          console.error("Error al obtener datos del usuario:", error);
        });
    } else {
      // Usuario no autenticado
      console.log("Usuario no autenticado");
      
      // Comprobar si estamos en una página protegida
      const currentPage = window.location.pathname;
      const protectedPages = ["/admin.html", "/perfil.html", "/checkout.html"];
      
      if (protectedPages.some(page => currentPage.includes(page))) {
        window.location.href = "login.html";
      }
    }
  });
  
  // Eventos al cargar DOM
  document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM cargado y Firebase inicializado");
    
    // Configurar botones para cambiar entre formularios
    const btnShowLogin = document.getElementById('show-login');
    const btnShowRegister = document.getElementById('show-register');
    
    if (btnShowLogin) {
      btnShowLogin.addEventListener('click', showLoginForm);
    }
    
    if (btnShowRegister) {
      btnShowRegister.addEventListener('click', showRegisterForm);
    }
    
    // Detectar en qué página estamos
    const isLoginPage = window.location.pathname.includes("login");
    
    if (isLoginPage) {
      setupLoginAndRegister();
    } else {
      // En otras páginas
      loadUserProfile();
      setupLogout();
      
      // Si estamos en la página de checkout
      if (window.location.pathname.includes("final.html") || 
          window.location.pathname.includes("checkout.html")) {
        autocompletarCheckout();
        setupOrderPlacement();
      }
    }
  });
  
  // Configuración de registro e inicio de sesión
  function setupLoginAndRegister() {
    // Registro de usuario
    const btnRegistro = document.getElementById('registro');
    if (btnRegistro) {
      btnRegistro.addEventListener('click', function() {
        const email = document.getElementById('emailreg').value;
        const password = document.getElementById('passwordreg').value;
        const nombreCompleto = document.getElementById('nombre_completo').value;
        
        if (!email || !password || !nombreCompleto) {
          alert("Completa todos los campos");
          return;
        }
        
        auth.createUserWithEmailAndPassword(email, password)
          .then(function(userCredential) {
            const user = userCredential.user;
            
            // Guardar datos en formato compatible con tu estructura existente
            return usuariosRef.doc(user.uid).set({
              datosCliente: {
                nombreCompleto: nombreCompleto,
                correoElectronico: email,
                direccion: "",
                ciudad: "",
                usuarioId: user.uid
              },
              fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
              saveUserToLocalStorage(user, { 
                nombreCompleto: nombreCompleto, 
                correoElectronico: email 
              });
              alert("Usuario registrado correctamente");
              window.location.href = "index.html";
            });
          })
          .catch(function(error) {
            console.error("Error al registrar:", error);
            alert("Error al registrar: " + error.message);
          });
      });
    }
    
    // Inicio de sesión
    const btnLogin = document.getElementById('login');
    if (btnLogin) {
      btnLogin.addEventListener('click', function() {
        const email = document.getElementById('emaillogin').value;
        const password = document.getElementById('passwordlogin').value;
        
        if (!email || !password) {
          alert("Completa todos los campos");
          return;
        }
        
        auth.signInWithEmailAndPassword(email, password)
          .then(function(userCredential) {
            const user = userCredential.user;
            
            // Obtener datos del usuario desde Firestore
            return usuariosRef.doc(user.uid).get()
              .then(doc => {
                if (doc.exists) {
                  const userData = doc.data();
                  saveUserToLocalStorage(user, userData.datosCliente || userData);
                }
                alert("Inicio de sesión exitoso");
                window.location.href = "index.html";
              });
          })
          .catch(function(error) {
            console.error("Error de inicio de sesión:", error);
            alert("Error al iniciar sesión: " + error.message);
          });
      });
    }
  }
  
  // Cargar datos del perfil del usuario
  function loadUserProfile() {
    const uid = getCurrentUserUID();
    if (!uid) return;
    
    const userNameElement = document.getElementById("user-name");
    const userEmailElement = document.getElementById("user-email");
    const userDateElement = document.getElementById("user-date");
    
    if (!userNameElement && !userEmailElement && !userDateElement) return;
    
    usuariosRef.doc(uid).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        const userData = data.datosCliente || data;
        
        if (userNameElement) {
          userNameElement.textContent = userData.nombreCompleto || "Sin nombre";
        }
        
        if (userEmailElement) {
          userEmailElement.textContent = userData.correoElectronico || "Sin email";
        }
        
        if (userDateElement && data.fechaRegistro) {
          const fecha = data.fechaRegistro.toDate();
          userDateElement.textContent = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth()+1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
        }
      }
    }).catch(error => {
      console.error("Error al cargar datos del usuario:", error);
    });
  }
  
  // Configurar cierre de sesión
  function setupLogout() {
    const btnLogout = document.getElementById("logout-btn");
    if (btnLogout) {
      btnLogout.addEventListener("click", function() {
        auth.signOut().then(() => {
          localStorage.clear();
          alert("Sesión cerrada correctamente");
          window.location.href = "login.html";
        }).catch(error => {
          console.error("Error al cerrar sesión:", error);
        });
      });
    }
  }
  
  // Autocompletar campos en checkout
  function autocompletarCheckout() {
    const uid = getCurrentUserUID();
    if (!uid) return;
    
    usuariosRef.doc(uid).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        const userData = data.datosCliente || data;
        
        const inputNombre = document.getElementById("fullName");
        const inputCorreo = document.getElementById("email");
        const inputDireccion = document.getElementById("address");
        const inputCiudad = document.getElementById("city");
        
        if (inputNombre) inputNombre.value = userData.nombreCompleto || "";
        if (inputCorreo) inputCorreo.value = userData.correoElectronico || "";
        if (inputDireccion) inputDireccion.value = userData.direccion || "";
        if (inputCiudad) inputCiudad.value = userData.ciudad || "";
      }
    }).catch(error => {
      console.error("Error al autocompletar campos:", error);
    });
  }
  
  // Configurar procesamiento de pedidos
  function setupOrderPlacement() {
    const btnPlaceOrder = document.getElementById("place-order");
    if (btnPlaceOrder) {
      btnPlaceOrder.addEventListener("click", function() {
        const uid = getCurrentUserUID();
        if (!uid) {
          alert("Debes iniciar sesión para hacer una compra");
          window.location.href = "login.html";
          return;
        }
        
        // Validar formulario
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const city = document.getElementById("city").value;
        const phone = document.getElementById("phone").value;
        const cardNumber = document.getElementById("cardNumber").value;
        const expDate = document.getElementById("expDate").value;
        const cvv = document.getElementById("cvv").value;
        
        if (!fullName || !email || !address || !city || !phone || !cardNumber || !expDate || !cvv) {
          alert("Por favor, completa todos los campos");
          return;
        }
        
        // Obtener carrito del localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
          alert("Tu carrito está vacío");
          return;
        }
        
        // Obtener total de la compra
        const totalElement = document.getElementById("checkout-total");
        let total = 0;
        if (totalElement) {
          total = parseFloat(totalElement.textContent.replace('$', ''));
        } else {
          // Calcular total desde el carrito
          total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        
        // Guardar el pedido en Firestore siguiendo la estructura observada
        db.collection("compras").add({
          cvv: cvv,
          datosCliente: {
            ciudad: city,
            correoElectronico: email,
            direccion: address,
            nombreCompleto: fullName,
            numero_tarjeta: cardNumber.slice(-4), // Solo los últimos 4 dígitos
            fechaVencimiento: expDate,
            usuarioId: uid
          },
          productos: cart.map(item => ({
            id: item.id,
            nombre: item.name,
            cantidad: item.quantity,
            precio: item.price
          })),
          totalCompra: total,
          estadoPedido: "Pendiente",
          fechaCompra: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          alert("¡Compra realizada con éxito!");
          localStorage.removeItem("cart"); // Limpiar el carrito
          window.location.href = "comprafi.html"; // Redirigir a página de confirmación
        })
        .catch((error) => {
          console.error("Error al guardar la compra:", error);
          alert("Error al procesar la compra: " + error.message);
        });
        
        // También actualizar los datos del usuario con la información del checkout
        usuariosRef.doc(uid).update({
          datosCliente: {
            nombreCompleto: fullName,
            correoElectronico: email,
            direccion: address,
            ciudad: city,
            usuarioId: uid
          }
        }).catch(error => {
          console.error("Error al actualizar datos del usuario:", error);
        });
      });
    }
  }
  
  // Exportar funciones para uso externo
  window.showLoginForm = showLoginForm;
  window.showRegisterForm = showRegisterForm;