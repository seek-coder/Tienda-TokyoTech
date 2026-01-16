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

        let datos = await respuesta.json();

        console.log(datos); // {payload: Array(1), message: 'Producto encontrado'}
        console.log(datos.payload); // [{…}]
        console.log(datos.payload[0]); // {id: 1, nombre: 'La maquina de hacer pajaros - Peliculas', tipo: 'LP', precio: 10000, imagen: 'https://i.discogs.com/rKa1bYXYX2w5nIGDULFozlTjVbmM…y9SLTM1MDY2/NjctMTUwOTczNTA0/Ni01NzM4LmpwZWc.jpeg', …}

        let producto = datos.payload[0];
        console.table(producto);

        // Creamos un nuevo boton a nuestro listado de ver producto
        // Creamos un nuevo boton a nuestro listado de ver producto
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
                        <input type="button" id="deleteProduct_button" value="Eliminar producto" class="boton-rojo" style="background-color: #f7768e; color: #1a1b26; border: none; padding: 0.5rem 1rem; border-radius: 4px; font-weight: bold; cursor: pointer;">
                    </div>
                </div>
            </li>
        `;

        // Renderizamos el listado en la pagina
        listaProductos.innerHTML = htmlProducto;


        // Vamos a asignarle un evento click a nuestro boton "Eliminar producto"
        let deleteProduct_button = document.getElementById("deleteProduct_button");

        deleteProduct_button.addEventListener("click", event => {

            event.stopPropagation(); // Evitamos la propagacion de eventos

            let confirmacion = confirm("Queres eliminar este producto?");

            if (!confirmacion) {
                alert("Eliminacion cancelada");

            } else {
                eliminarProducto(idProd);
            }
        });

        async function eliminarProducto(id) {
            console.log(id); // Recibimos correctamente el id

            try {
                let response = await fetch(`/api/products/${id}`, {
                    method: "DELETE"
                });

                let result = await response.json();

                if (response.ok) {
                    alert(result.message);

                    // Vaciamos la lista
                    listaProductos.innerHTML = "";
                }

            } catch (error) {
                console.error("Error en la solicitud DELETE: ", error);
                alert("Ocurrio un error al eliminar un producto");
            }
        }

    } catch (error) {
        console.log(error);
    }

});