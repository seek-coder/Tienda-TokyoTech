// Lógica para la creación de un nuevo producto (Disco)

let contenedorProductos = document.getElementById("contenedor-productos"); // Incluido para coincidir con la estructura original (aunque no se use en esta página)
let altaProductsForm = document.getElementById("altaProducts-form");
let url = "";

// Elementos del Modal (Para reemplazar alert())
let modal = document.getElementById("messageModal");
let modalMessage = document.getElementById("modal-message");
let closeBtn = document.querySelector(".close-btn");

// Función para mostrar el modal
// Muestra el mensaje de éxito o error en una ventana emergente (modal) de la página.
// Usamos este método en lugar de 'alert()' para dar una mejor experiencia al usuario sin interrumpir la navegación.
function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = "block";
}

// Eventos para cerrar el modal
closeBtn.onclick = function () { modal.style.display = "none"; }
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


altaProductsForm.addEventListener("submit", async (event) => {

    event.preventDefault(); // Formulario no enviado por defecto

    // Obtenemos los datos de este formulario a traves de un objeto FormData
    let formData = new FormData(event.target);
    console.log(formData);

    // Ahora creamos un objeto JS a partir de los datos de este objeto FormData
    // Captura TODOS los 9 campos del HTML
    // MODIFICACIÓN 22/11: Mapeamos a nombres en español con mayúscula inicial
    let data = {
        Nombre: formData.get("name"),
        Marca: formData.get("brand"),
        Modelo: formData.get("model"),
        Descripcion: formData.get("description"),
        Categoria: formData.get("category"),
        Precio: parseFloat(formData.get("price")),
        Stock: parseInt(formData.get("stock"), 10),
        Imagen: formData.get("image"),
        Activo: 1 // por defecto, el producto se crea activo
    };
    console.log(data);

    // Ahora, con el nuevo objeto JS creado a partir de los valores de nuestros formularios, se lo enviamos al servidor en formato JSON
    try {
        let response = await fetch(`${url}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response);

        let result = await response.json();
        console.log(result);

        if (response.ok) {
            console.log(result.message);
            showModal(`Producto creado con exito con id: ${result.productId}`);
            event.target.reset(); // Limpia el formulario
        } else {
            showModal(`Error al crear producto: ${result.message || 'Verifique los datos.'}`);
        }


    } catch (error) {
        console.error("Error al enviar los datos: ", error);
        showModal("Error al procesar la solicitud. Verifique la conexión del servidor.");
    }

});

/*===========================
    Creacion de usuarios
===========================*/
let altaUsers_container = document.getElementById("altaUsers-container");

// ALTA USUARIOS
altaUsers_container.addEventListener("submit", async (event) => {

    event.preventDefault(); // Evitamos el envio por defecto del formulario

    let formData = new FormData(event.target);

    let data = Object.fromEntries(formData.entries());

    try {
        let response = await fetch(`${url}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log(response);

            let result = await response.json();
            console.log(result);
            alert(result.message)
        }

    } catch (error) { // El catch solo captura errores de red
        console.error("Error al enviar los datos: ", error);
        alert("Error al procesar la solicitud");
    }
});