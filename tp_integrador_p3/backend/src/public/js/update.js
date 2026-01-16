let getProduct_form = document.getElementById("getProduct-form");
let listaProductos = document.getElementById("lista-productos");
let contenedor_update = document.getElementById("contenedor-update");
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

        let datos = await respuesta.json();

        console.log(datos); // {payload: Array(1), message: 'Producto encontrado'}
        console.log(datos.payload); // [{…}]
        console.log(datos.payload[0]); // {id: 1, nombre: 'La maquina de hacer pajaros - Peliculas', tipo: 'LP', precio: 10000, imagen: 'https://i.discogs.com/rKa1bYXYX2w5nIGDULFozlTjVbmM…y9SLTM1MDY2/NjctMTUwOTczNTA0/Ni01NzM4LmpwZWc.jpeg', …}

        let producto = datos.payload[0];

        mostrarProducto(producto); // Le pasamos el producto a la funcion mostrarProducto

    } catch (error) {
        console.log(error);
    }

});


// Recibe el producto y lo muestra por consola y por pantalla
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
                
                <div class="li-botonera" style="margin-top: 1rem;">
                    <input type="button" id="updateProduct_button" value="Actualizar producto" class="boton-verde">
                </div>
            </div>
        </li>
    `;

    listaProductos.innerHTML = htmlProducto;

    // Seleccionamos el boton de actualizar y le asignamos un evento
    let updateProduct_button = document.getElementById("updateProduct_button");

    updateProduct_button.addEventListener("click", event => {
        formularioPutProducto(event, producto);
    });
}


function formularioPutProducto(event, producto) {

    event.stopPropagation(); // Evita la propagacion de eventos para que un evento no pise al otro

    let updateForm_html = `
           <form id="updateProducts-form" class="update-form">

            <!-- ID (Campo Oculto) -->
            <input type="hidden" name="id" id="idProd" value="${producto.id}">

            <label for="nameProd">Nombre</label>
            <input type="text" name="name" id="nameProd" value="${producto.Nombre}" required>

            <label for="brandProd">Marca</label>
            <input type="text" name="brand" id="brandProd" value="${producto.Marca}" required>

            <label for="modelProd">Modelo</label>
            <input type="text" name="model" id="modelProd" value="${producto.Modelo}" required> 
            
            <label for="categoryProd">Categoría</label>
            <input type="text" name="category" id="categoryProd" value="${producto.Categoria}" required>

            <label for="descriptionProd">Descripción</label>
            <textarea name="description" id="descriptionProd" required>${producto.Descripcion}</textarea>

            <label for="priceProd">Precio</label>
            <input type="number" name="price" id="priceProd" value="${producto.Precio}" required>

            <label for="stockProd">Stock</label>
            <input type="number" name="stock" id="stockProd" value="${producto.Stock}" required>
            
            <label for="imageProd">Url imagen</label>
            <input type="text" name="image" id="imageProd" value="${producto.Imagen}" required>

            <label for="activeProd">Disponibilidad</label>
            <select name="active" id="activeProd" required>
                <option value="0" ${producto.Activo == 0 ? 'selected' : ''}>Inactivo</option>
                <option value="1" ${producto.Activo == 1 ? 'selected' : ''}>Activo</option>
            </select>

            <br>
            <input type="submit" value="Actualizar producto" class="boton-verde">
        </form>
    `;

    contenedor_update.innerHTML = updateForm_html;

    let updateProducts_form = document.getElementById("updateProducts-form");

    updateProducts_form.addEventListener("submit", async event => {

        event.preventDefault(); // Prevengo el envio por defecto del formulario

        // console.log(event.target); // Aca selecciono el formulario de actualizacion que acabo de crear

        // Transformo en un objeto FormData toda la data del nuevo formulario de actualización
        let formData = new FormData(event.target);

        // Transformo este objeto FormData a un objeto JavaScript
        let data = Object.fromEntries(formData.entries());

        console.log(data); // Los datos ya estan listos para ser parseados a JSON e insertos en el body de la peticion PUT

        try {
            console.log(`Haciendo peticion PUT a ${url}`);

            let response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            // Aca imprimimos la promesa que devuelve el fetch
            console.log(response);

            // Esperamos a procesar la respuesta del servidor
            let result = await response.json();
            console.log(result);

            if (response.ok) {
                console.log(result.message);
                alert(result.message);

                // Vaciamos la lista de productos y el formulario de actualizacion
                listaProductos.innerHTML = "";
                contenedor_update.innerHTML = "";

            } else {
                console.error("Error: ", result.message);
                alert(result.message);
            }

        } catch (error) { // El catch en nuestra solicitud fetch SOLO capturan errores reales de red
            console.error("Error al enviar los datos: ", error);
            alert("Error al procesar la solicitud")
        }
    });
}