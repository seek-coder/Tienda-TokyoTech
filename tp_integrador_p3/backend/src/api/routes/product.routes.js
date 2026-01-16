/*==============================================================================
    BLOQUE 1: importaciones y configuración
==============================================================================*/
// importamos el middleware router -> le decimos "mini aplicacion porque termina haciendo lo mismo que express para las rutas"
import { Router } from "express"; // lo mismo que import express from "express"
const router = Router(); // lo mismo que const app = express();

// importamos el middleware validateid
import { validateId } from "../middlewares/middlewares.js";
import { createProduct, removeProduct, getAllProducts, getProductById, updateProduct, searchProducts } from "../controllers/product.controllers.js";


/*==============================================================================
    BLOQUE 2: definición de rutas
==============================================================================*/
// get -> buscar productos
router.get("/search", searchProducts);

// get -> traer todos los productos
router.get("/", getAllProducts);

// get product by id -> consultar producto por su id
router.get("/:id", validateId, getProductById);

// post -> crear un nuevo producto
router.post("/", createProduct);

// to do, optimizacion ii -> actualizar solo los campos que hayan cambiado
// update -> actualizar un producto por su id
router.put("/", updateProduct);

// delete -> eliminar un producto por su id
router.delete("/:id", validateId, removeProduct);
/*==============================================================================
    BLOQUE 3: exportación
==============================================================================*/
// exportamos todas las rutas
export default router;