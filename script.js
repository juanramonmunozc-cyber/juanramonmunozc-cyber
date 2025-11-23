// Manejar el formulario de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = {
        numero_servicio: document.getElementById('numero_servicio').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        numero_medidor: document.getElementById('numero_medidor').value
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

    // Generar folio y guardar datos
    formData.folio = generarFolio();
    formData.fecha = new Date().toLocaleString();
    
    // Guardar en localStorage (simula base de datos)
    localStorage.setItem('usuarioCespt', JSON.stringify(formData));
    
    // Redirigir al dashboard
    window.location.href = 'dashboard.html';
});

// Funciones de validación
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
    
    if (!usuario) {
        window.location.href = 'index.html';
        return;
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

// Sistema de reportes
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar la sección seleccionada
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
    
    // Guardar reporte (en una app real, esto iría a una base de datos)
    let reportes = JSON.parse(localStorage.getItem('reportesCespt') || '[]');
    reportes.push(reporte);
    localStorage.setItem('reportesCespt', JSON.stringify(reportes));
    
    alert(`✅ Reporte creado exitosamente!\nFolio: ${usuario.folio}`);
    
    // Limpiar formulario
    document.getElementById('reportForm').reset();
}

function cerrarSesion() {
    localStorage.removeItem('usuarioCespt');
    window.location.href = 'Pagina-login.html';
}