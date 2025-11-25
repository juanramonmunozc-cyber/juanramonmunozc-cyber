// Configuración de Firebase
const firebaseConfig = {
      apiKey: "AIzaSyBKBEacMSzpEjh2Pd2zX-ij6EsDMxcb84M",
      authDomain: "mapa-de-quejas-e5354.firebaseapp.com",
      databaseURL: "https://mapa-de-quejas-e5354-default-rtdb.firebaseio.com",
      projectId: "mapa-de-quejas-e5354",
      storageBucket: "mapa-de-quejas-e5354.appspot.com",
      messagingSenderId: "1098104212670",
      appId: "1:1098104212670:web:fa91e20fb729dcd8be22ef",
      measurementId: "G-XJ015E8YWX"
    };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Manejar el formulario de login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = {
        numero_servicio: document.getElementById('numero_servicio').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        numero_medidor: document.getElementById('numero_medidor').value,
        clave: document.getElementById('clave').value // Campo nuevo para la clave
    };

    // Validaciones
    if (!validarNumeroServicio(formData.numero_servicio)) {
        alert('❌ El número de servicio debe tener 8-10 dígitos');
        return;
    }

    if (!validarTelefono(formData.telefono)) {
        alert('❌ El teléfono debe tener 10 dígitos');
        return;
    }

    if (formData.numero_medidor && !validarMedidor(formData.numero_medidor)) {
        alert('❌ El número de medidor debe tener 8 dígitos');
        return;
    }

    if (!formData.clave) {
        alert('❌ La clave es obligatoria');
        return;
    }

    try {
        // Buscar usuario en Firestore por clave y número de servicio
        const usersRef = db.collection('usuarios');
        const querySnapshot = await usersRef
            .where('clave', '==', formData.clave)
            .where('numero_servicio', '==', formData.numero_servicio)
            .get();

        if (querySnapshot.empty) {
            alert('❌ Clave o número de servicio incorrectos');
            return;
        }

        // Obtener datos del usuario
        let usuarioData;
        querySnapshot.forEach(doc => {
            usuarioData = { id: doc.id, ...doc.data() };
        });

        // Generar folio y guardar datos
        formData.folio = generarFolio();
        formData.fecha = new Date().toLocaleString();
        formData.nombre = usuarioData.nombre;
        
        // Guardar en localStorage
        localStorage.setItem('usuarioCespt', JSON.stringify(formData));
        localStorage.setItem('userName', usuarioData.nombre);
        
        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Error al autenticar:', error);
        alert('❌ Error al iniciar sesión. Intente nuevamente.');
    }
});

// Funciones de validación (mantener las mismas)
function validarNumeroServicio(numero) {
    return /^\d{8,10}$/.test(numero);
}

function validarTelefono(telefono) {
    return /^\d{10}$/.test(telefono);
}

function validarMedidor(medidor) {
    return /^\d{8}$/.test(medidor);
}

function generarFolio() {
    return 'CESPT-' + Math.floor(100000 + Math.random() * 900000);
}

// Cargar datos del usuario en el dashboard
function cargarUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuarioCespt'));
    const userName = localStorage.getItem('userName');
    
    if (!usuario) {
        window.location.href = 'index.html';
        return;
    }

    // Mostrar mensaje de bienvenida personalizado
    if (userName) {
        document.getElementById('welcomeMessage').textContent = `Bienvenido, ${userName}`;
    }

    // Mostrar información del usuario
    document.getElementById('userService').textContent = usuario.numero_servicio;
    document.getElementById('userPhone').textContent = usuario.telefono;
    document.getElementById('userFolio').textContent = usuario.folio;
    
    if (usuario.email) {
        document.getElementById('userEmail').textContent = usuario.email;
    } else {
        document.getElementById('emailRow').style.display = 'none';
    }
    
    if (usuario.numero_medidor) {
        document.getElementById('userMedidor').textContent = usuario.numero_medidor;
    } else {
        document.getElementById('medidorRow').style.display = 'none';
    }
}

// Sistema de reportes (mantener igual)
function mostrarSeccion(seccionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(seccionId).classList.remove('hidden');
}

function crearReporte() {
    const tipo = document.getElementById('tipoProblema').value;
    const descripcion = document.getElementById('descripcionProblema').value;
    const ubicacion = document.getElementById('ubicacionProblema').value;
    
    if (!tipo || !descripcion || !ubicacion) {
        alert('❌ Por favor complete todos los campos');
        return;
    }
    
    const usuario = JSON.parse(localStorage.getItem('usuarioCespt'));
    const reporte = {
        folio: usuario.folio,
        tipo,
        descripcion,
        ubicacion,
        fecha: new Date().toLocaleString(),
        estatus: 'Pendiente'
    };
    
    let reportes = JSON.parse(localStorage.getItem('reportesCespt') || '[]');
    reportes.push(reporte);
    localStorage.setItem('reportesCespt', JSON.stringify(reportes));
    
    alert(`✅ Reporte creado exitosamente!\nFolio: ${usuario.folio}`);
    document.getElementById('reportForm').reset();
}

function cerrarSesion() {
    localStorage.removeItem('usuarioCespt');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}