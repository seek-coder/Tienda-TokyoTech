let getProduct_form = document.getElementById("getProduct-form");
let listaProductos = document.getElementById("lista-productos");
let url = "/api/products";


getProduct_form.addEventListener("submit", async (event) => {

    event.preventDefault(); // Evitamos el envio por defecto del formulario

    console.log("Formulario no enviado");
    console.log(event.target); // Con event target accedemos al evento que disparo el addEventListener

    // Vamos a guardar como objetos los valores del formulario HTML
    let formData = new FormData(event.target);
    console.log(formData); // FormData { idProd → "2" }

    // Vamos a transformar este objeto FormData en un objeto normal JavaScript
    let data = Object.fromEntries(formData.entries());
    console.log(data); // Object { idProd: "3" }

    let idProd = data.idProd;
    console.log(idProd); // 3

    console.log(`Extraido valor numerico del formulario en la variable idProd, que vale ${idProd}`)

    try {
        console.log(`Haciendo peticion GET a la url: ${url}/${idProd}`)
        //let respuesta = await fetch(`${url}/${idProd}`);
        let respuesta = await fetch(`/api/products/${idProd}`);
        console.log(respuesta);

        let datos = await respuesta.json();
        console.log(datos); // {payload: Array(1), message: 'Producto encontrado'}

        if (respuesta.ok) {
            console.log(datos.payload); // [{…}]
            console.log(datos.payload[0]); // {id: 1, nombre: 'La maquina de hacer pajaros - Peliculas', tipo: 'LP', precio: 10000, imagen: 'https://i.discogs.com/rKa1bYXYX2w5nIGDULFozlTjVbmM…y9SLTM1MDY2/NjctMTUwOTczNTA0/Ni01NzM4LmpwZWc.jpeg', …}

            let producto = datos.payload[0];

            mostrarProducto(producto);

        } else {
            console.error(datos.message);

            mostrarError(datos.message);
        }

    } catch (error) {
        console.log(error);
    }

});

function mostrarProducto(producto) {
    console.table(producto);

    let htmlProducto = `
        <li class="producto-card">
            <div class="producto-imagen">
                <img src="${producto.Imagen}?t=${Date.now()}" alt="${producto.Nombre}">
            </div>
            <div class="producto-info">
                <div class="producto-header">
                    <span class="badge badge-id">ID: ${producto.id}</span>
                    <span class="badge badge-precio">$${producto.Precio.toLocaleString('es-AR')}</span>
                </div>
                <h3 class="producto-nombre">${producto.Nombre}</h3>
                <div class="producto-detalles">
                    <p><span class="label">Marca:</span> ${producto.Marca}</p>
                    <p><span class="label">Modelo:</span> ${producto.Modelo}</p>
                    <p><span class="label">Categoría:</span> ${producto.Categoria}</p>
                    <p><span class="label">Stock:</span> ${producto.Stock} unidades</p>
                </div>
                <p class="producto-descripcion">${producto.Descripcion}</p>
            </div>
        </li>
    `;

    listaProductos.innerHTML = htmlProducto;
}

// Imprimimos un mensaje visual de error
function mostrarError(error) {

    let htmlError = `
        <li class="mensaje-error">
            <p>
                <strong>Error:</strong>
                <span>${error}</span>
            </p>
        </li>
    `;

    listaProductos.innerHTML = htmlError;
}