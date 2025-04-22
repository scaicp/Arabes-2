function showLoginForm() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

function showRegisterForm() {
    document.getElementById('register-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
}






// Funciones para mostrar/ocultar formularios
function showLoginForm() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

function showRegisterForm() {
    document.getElementById('register-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
}

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA315DhY3uEPGtgkTQZ99LhdnTn9hT6t1Q",
  authDomain: "login-27613.firebaseapp.com",
  projectId: "login-27613",
  storageBucket: "login-27613.firebasestorage.app",
  messagingSenderId: "503807303549",
  appId: "1:503807303549:web:fa7056ec0112f3b1bef614",
  measurementId: "G-Z4H192M277"
};

// Inicializar Firebase con la versión compat
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM cargado y Firebase inicializado");
  
  // Registrar usuario
  const btnRegistro = document.getElementById('registro');
  if (btnRegistro) {
    btnRegistro.addEventListener('click', function() {
      const email = document.getElementById('emailreg').value;
      const password = document.getElementById('passwordreg').value;
      const nombreCompleto = document.getElementById('nombre_completo').value;
      
      console.log("Intentando registrar a:", email);
      
      auth.createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
          // Usuario registrado exitosamente
          const user = userCredential.user;
          console.log("Usuario registrado:", user.uid);
          
          // Guardar datos adicionales en Firestore
          return db.collection("usuarios").doc(user.uid).set({
            email: email,
            nombre_completo: nombreCompleto,
            fecha_registro: new Date()
          });
        })
        .then(function() {
          console.log("Datos guardados en Firestore");
          alert("Usuario registrado correctamente");
          showLoginForm();
        })
        .catch(function(error) {
          console.error("Error:", error);
          alert("Error al registrar: " + error.message);
        });
    });
  }
  
  // Login de usuario
  const btnLogin = document.getElementById('login');
  if (btnLogin) {
    btnLogin.addEventListener('click', function() {
      const email = document.getElementById('emaillogin').value;
      const password = document.getElementById('passwordlogin').value;
      
      console.log("Intentando iniciar sesión con:", email);
      
      auth.signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
          const user = userCredential.user;
          console.log("Sesión iniciada:", user.uid);
          alert("Inicio de sesión exitoso");
          window.location.href = "index.html";
        })
        .catch(function(error) {
          console.error("Error de inicio de sesión:", error);
          alert("Error al iniciar sesión: " + error.message);
        });
    });
  }
});


















