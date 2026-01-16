/*-------------------
VARIABLES GLOBALES
--------------------*/
let tecnologiaTienda = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let usuarioNombre = "";

/*---------------------
VARIABLES DEL DOM
-----------------------*/
// Pantallas
const pantallaBienvenida = document.getElementById("pantalla-bienvenida");
const pantallaProductos = document.getElementById("pantalla-productos");
const pantallaCarrito = document.getElementById("pantalla-carrito");
const pantallaTicket = document.getElementById("pantalla-ticket");

// Elementos Bienvenida
const inputNombreUsuario = document.getElementById("input-nombre-usuario");

// Elementos Productos
const barraBusqueda = document.getElementById("barra-busqueda");
const contenedorProductos = document.getElementById("contenedor-productos");
const contadorCarrito = document.getElementById("carritos-contador");
const nombreUsuarioDisplay = document.getElementById("nombre-usuario-display");

// Elementos Carrito
const contenedorItemsCarrito = document.getElementById("contenedor-items-carrito");

// Elementos Ticket
const contenidoTicket = document.getElementById("contenido-ticket");


/*----------------------------
INIT & NAVIGATION
----------------------------*/
async function init() {
    // Check if user already entered name (optional, for now we ask every time on reload as per flow)
    mostrarPantalla('bienvenida');
    await fetchProducts();
    actualizarContadorCarrito();
}

function mostrarPantalla(nombrePantalla) {
    // Hide all
    pantallaBienvenida.style.display = "none";
    pantallaProductos.style.display = "none";
    pantallaCarrito.style.display = "none";
    pantallaTicket.style.display = "none";

    // Show specific
    if (nombrePantalla === 'bienvenida') pantallaBienvenida.style.display = "flex"; // Flex to center content
    if (nombrePantalla === 'productos') pantallaProductos.style.display = "block";
    if (nombrePantalla === 'carrito') {
        pantallaCarrito.style.display = "block";
        mostrarCarrito();
    }
    if (nombrePantalla === 'ticket') pantallaTicket.style.display = "block";
}

/*----------------------------
LOGICA BIENVENIDA
----------------------------*/
function ingresarTienda() {
    const nombre = inputNombreUsuario.value.trim();
    if (nombre) {
        usuarioNombre = nombre;
        nombreUsuarioDisplay.textContent = usuarioNombre;
        mostrarPantalla('productos');
    } else {
        alert("Por favor, ingresa tu nombre.");
    }
}

/*----------------------------
LOGICA PRODUCTOS
----------------------------*/
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) throw new Error('Error al obtener productos');
        const data = await response.json();

        tecnologiaTienda = data.payload.map(prod => ({
            id: prod.id,
            nombre: prod.Nombre,
            precio: prod.Precio,
            ruta_img: prod.Imagen,
            categoria: prod.Categoria,
            stock: prod.Stock
        }));

        mostrarLista(tecnologiaTienda);
    } catch (error) {
        console.error('Error fetching products:', error);
        contenedorProductos.innerHTML = '<p class="mensaje-error">Error al cargar los productos. Asegúrese de que el servidor esté corriendo.</p>';
    }
}

function mostrarLista(array) {
    let htmlProductos = "";
    array.forEach(producto => {
        htmlProductos += `
        <div class="card-producto">
            <div class="card-imagen">
                <img src="${producto.ruta_img}" alt="${producto.nombre}">
            </div>
            <div class="card-contenido">
                <div class="card-badges">
                    <span class="badge badge-id-small">ID: ${producto.id}</span>
                    <span class="badge badge-categoria">${producto.categoria}</span>
                </div>
                <h4 class="card-titulo">${producto.nombre}</h4>
                <div class="card-footer">
                    <span class="card-precio">$${producto.precio}</span>
                </div>
                <button onclick="agregarACarrito(${producto.id})" style="border-radius: 8px; width: 100%; margin-top: 1rem;">Agregar al carrito</button>
            </div>
        </div>
        `
    });
    contenedorProductos.innerHTML = htmlProductos;
}

// Filtrado
barraBusqueda.addEventListener("input", () => {
    let valor = barraBusqueda.value.toLowerCase();
    let filtrados = tecnologiaTienda.filter(p => p.nombre.toLowerCase().includes(valor));
    mostrarLista(filtrados);
});

// Ordenamiento
function ordenarPorNombre() {
    let ordenados = [...tecnologiaTienda].sort((a, b) => a.nombre.localeCompare(b.nombre));
    mostrarLista(ordenados);
}

function ordenarPorPrecio() {
    let ordenados = [...tecnologiaTienda].sort((a, b) => a.precio - b.precio);
    mostrarLista(ordenados);
}

/*----------------------------
LOGICA CARRITO
----------------------------*/
function agregarACarrito(id) {
    const producto = tecnologiaTienda.find(p => p.id === id);
    const itemEnCarrito = carrito.find(p => p.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    actualizarContadorCarrito();
    // Optional: alert or toast
}

function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = `🛒 Carrito: ${totalItems}`;
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function irAlCarrito() {
    mostrarPantalla('carrito');
}

function volverAProductos() {
    mostrarPantalla('productos');
}

function mostrarCarrito() {
    if (carrito.length === 0) {
        contenedorItemsCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let html = "<ul>";
    let total = 0;

    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
        <li class="bloque-item">
            <div class="item-info">
                <p class="nombre-item"><strong>${item.nombre}</strong></p>
                <p>Precio unitario: $${item.precio}</p>
            </div>
            <div class="item-controls">
                <button class="btn-qty" onclick="cambiarCantidad(${index}, -1)">-</button>
                <span class="qty">${item.cantidad}</span>
                <button class="btn-qty" onclick="cambiarCantidad(${index}, 1)">+</button>
            </div>
            <div class="item-subtotal">
                <p>$${subtotal}</p>
            </div>
            <button class="boton-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
        </li>
        `;
    });
    html += "</ul>";

    html += `<div class="contenedor-total"><p class="total-carrito">Total: <strong>$${total}</strong></p></div>`;

    contenedorItemsCarrito.innerHTML = html;
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
}

/*----------------------------
LOGICA TICKET
----------------------------*/
function generarTicket() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    let fecha = new Date().toLocaleString();

    let html = `
        <div class="ticket">
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Cliente:</strong> ${usuarioNombre}</p>
            <hr>
            <ul>
    `;

    carrito.forEach(item => {
        html += `<li>${item.cantidad} x ${item.nombre} - $${item.precio * item.cantidad}</li>`;
    });

    html += `
            </ul>
            <hr>
            <h3>Total a Pagar: $${total}</h3>
            <div class="ticket-actions" style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;">
                <button onclick="descargarTicket()" style="background-color: #7aa2f7; color: #1a1b26; border-radius: 8px; font-weight: bold;">Descargar Ticket</button>
            </div>
        </div>
    `;

    contenidoTicket.innerHTML = html;
    mostrarPantalla('ticket');
}

function descargarTicket() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    let fecha = new Date().toLocaleString();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("TOKYOTECH", 105, 20, null, null, "center");

    doc.setFontSize(14);
    doc.text("Ticket de Compra", 105, 30, null, null, "center");

    // Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Fecha: ${fecha}`, 20, 45);
    doc.text(`Cliente: ${usuarioNombre}`, 20, 52);

    doc.setLineWidth(0.5);
    doc.line(20, 57, 190, 57);

    // Productos
    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("Detalle:", 20, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    carrito.forEach(item => {
        let textoProducto = `${item.cantidad} x ${item.nombre}`;
        let textoPrecio = `$${item.precio * item.cantidad}`;

        doc.text(textoProducto, 20, y);
        doc.text(textoPrecio, 190, y, null, null, "right");
        y += 8;
    });

    y += 5;
    doc.line(20, y, 190, y);
    y += 15;

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`TOTAL: $${total}`, 190, y, null, null, "right");

    // Footer
    y += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("¡Gracias por tu compra!", 105, y, null, null, "center");

    doc.save(`Ticket_TokyoTech_${Date.now()}.pdf`);
}

function finalizarCompra() {
    alert("¡Gracias por tu compra!");
    vaciarCarrito();
    usuarioNombre = "";
    inputNombreUsuario.value = "";
    mostrarPantalla('bienvenida');
}

// Start
init();

// EJERCICIO 2
function imprimirDatosAlumno(dni, nombre, apellido) {
    // Atendiendo a las bases de la programación, una función debería ser reutilizable (de ahí que esté parametrizada)
    const alumno = {
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        mostrarDatos: function () {
            // Muestro por consola
            console.log(`¡Hola! Mi nombre completo es ${nombre} ${apellido} y mi DNI es ${dni} `);

            // Muestro por nav
            nombreApellido.textContent = `${nombre} ${apellido} `; // De nuevo textContent, que me deja leer/modificar el texto del HTML.
        }
    }
    alumno.mostrarDatos();
    return alumno;
}

// EJERCICIO 8
// Ordeno alfabéticamente
function ordenarPorNombre() {
    let productosOrdenados = tecnologiaTienda.slice().sort((a, b) => { // Si uso slice() sin pasarle ningún argumento, hago una copia del array. Con sort() modifico esa copia
        return a.nombre.localeCompare(b.nombre); // devuelvo un valor on the fly. Uso localeCompare es práctico porque me permite comparar los strings según el idioma configurado en el navegador. Es una forma confiable de hacer comparaciones cuando trabajamos con "texto" en sí. Comparo el nombre"a" con el nombre "b" y los ordeno en base al UNICODE, donde cada carácter es en realidad un entero. También se podrían hacer las comparaciones mediante operadores de comparación como "<" o ">", pero creo que esta alternativa es más sencilla al conocer la herramienta.
    });

    mostrarLista(productosOrdenados);
}

// Ordeno precios de menor a mayor
function ordenarPorPrecio() {
    let productosOrdenados = tecnologiaTienda.slice().sort((a, b) => { // Misma lógica que la función anterior
        return a.precio - b.precio; // devuelvo un valor on the fly que es el resultado de restar un precio con otro.
    });

    mostrarLista(productosOrdenados);
}

init()