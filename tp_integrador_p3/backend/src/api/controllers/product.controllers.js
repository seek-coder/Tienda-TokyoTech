/*==============================================================================
    BLOQUE 1: importaciones
==============================================================================*/
import ProductModel from "../models/product.models.js";

/*==============================================================================
    BLOQUE 2: get all products -> traer todos los productos
==============================================================================*/
export const getAllProducts = async (req, res) => {

    try {

        // con rows extraemos exclusivamente los datos que solicitamos en la consulta
        const [rows] = await ProductModel.selectAllProducts();

        // comprobamos que se reciban correctamente los productos
        //console.log(rows);

        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : "Productos encontrados"
        });


    } catch (error) {
        console.error("Error obteniendo productos", error.message);

        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
}

/*==============================================================================
    BLOQUE 3: get product by id -> traer producto por id
==============================================================================*/
export const getProductById = async (req, res) => {

    /* modificación - 17/11: movemos la línea 38 desde dentro del try para evitar problemas de scope y poder realizar las consultas adecuadamente en el front.  */
    let { id } = req.params; // aca extraemos el valor "2" de localhost:3000/products/2

    try {
        // let id = req.params.id;


        /* logica exportada al middleware validateid
        // optimizacion 1: validacion de parametros antes de acceder a la bbdd para evitar hacer una consulta donde el parametro id no sea valido
        if(!id || isNaN(Number(id))) {
            return res.status(400).json({
                message: "El id del producto debe ser un numero valido"
            })
        }
        */

        let [rows] = await ProductModel.selectProductWhereId(id);

        // optimizacion 3: comprobamos que exista el producto con ese id
        if (rows.length === 0) {
            // este console.log es desde la consola del servidor
            console.log(`Error! No se encontro producto con id ${id}`);

            // esta respuesta se la brindamos al usuario y puede elegir verla por consola o por pantalla
            return res.status(404).json({
                message: `No se encontro producto con id ${id}`
            });
        }


        res.status(200).json({
            payload: rows,
            message: "Producto encontrado"
        });

        /*
        los placeholders en sql son marcadores especiales, como el carácter ? o nombres como :nombre, que se utilizan en consultas sql 
        para indicar dónde se insertarán los valores reales durante la ejecución de la consulta.
        
        su uso principal es prevenir inyecciones sql al separar el código de la consulta del contenido de los datos, 
        ya que los valores se vinculan de forma segura a los placeholders en lugar de ser incrustados directamente en la cadena de consulta.

        // gracias al destructuring, en rows guardamos y devolvemos especificamente los datos del producto, el resultado especifico de la consulta
        //let [rows, fields] = await connection.query(sql, [id]); // este id reemplazara el placeholder ?
        //console.log(rows);
       */

    } catch (error) {
        console.error(`Error obteniendo productos con id ${id}`, error.message);

        res.status(500).json({
            message: "Error interno al obtener producto con id"
        })
    }

}

/*==============================================================================
    BLOQUE 4: create product -> crear un nuevo producto
==============================================================================*/
export const createProduct = async (req, res) => {

    try {
        // gracias al destructuring, recogemos estos datos del body (ahora en español)
        let { Nombre, Marca, Modelo, Descripcion, Precio, Stock, Imagen, Categoria, Activo } = req.body;
        console.log(req.body);

        // si no viene activo, usamos 1 por defecto
        if (Activo === undefined) Activo = 1;

        // optimizacion 1: validacion de datos de entrada
        if (!Nombre || !Marca || !Modelo || !Descripcion || !Precio || !Stock || !Imagen || !Categoria) {
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los campos"
            });
        }

        let [result] = await ProductModel.insertProduct(Nombre, Marca, Modelo, Descripcion, Precio, Stock, Imagen, Categoria, Activo);
        console.log(result);

        // codigo de estado 201 -> created
        res.status(201).json({
            message: "Producto creado con exito",
            productId: result.insertId
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
}


/*==============================================================================
    BLOQUE 5: update product -> actualiza un producto
==============================================================================*/
export const updateProduct = async (req, res) => {
    try {
        let { id, name, brand, model, description, price, stock, image, category, active } = req.body;

        // optimizacion 1: validacion basica de datos recibidos
        if (!id || !name || !brand || !model || !description || !price || !stock || !image || !category || !active) {
            return res.status(400).json({
                message: "Faltan campos requeridos"
            });
        }

        // llamamos al modelo con todos los parametros necesarios
        let [result] = await ProductModel.updateProduct(name, brand, model, description, price, stock, image, category, active, id);
        console.log(result);

        // optimizacion 2: testeamos que se actualizara, esto lo sabemos gracias a affectedrows que devuelve result
        if (result.affectedRows === 0) { // no se actualizo nada
            return res.status(400).json({
                message: "No se actualizo el producto"
            });
        }

        res.status(200).json({
            message: `Producto con id ${id} actualizado correctamente`
        });

    } catch (error) {
        console.error("Error al actualizar productos", error);

        res.status(500).json({
            message: "Error interno del servidor", error
        });
    }
}


/*==============================================================================
    BLOQUE 6: delete product -> eliminar un producto
==============================================================================*/
export const removeProduct = async (req, res) => {
    try {
        let { id } = req.params;

        let [result] = await ProductModel.deleteProduct(id);
        console.log(result);

        // optimizacion 2: testeamos que se borro, esto lo sabemos gracias a affectedrows que devuelve result
        if (result.affectedRows === 0) { // no se borro nada
            return res.status(400).json({
                message: "No se eliminó el producto"
            });
        }

        return res.status(200).json({
            message: `Producto con id ${id} eliminado correctamente`
        });

    } catch (error) {
        console.error("Error al eliminar un producto: ", error);

        res.status(500).json({
            message: `Error al eliminar un producto con id ${id}: `, error,
            error: error.message
        })
    }
}

/*==============================================================================
    BLOQUE 7: search products -> buscar productos
==============================================================================*/
export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query; // ?q=intel

        // validación: verificar que se envió un término de búsqueda
        if (!q || q.trim() === '') {
            return res.status(400).json({
                message: "Se requiere un término de búsqueda"
            });
        }

        const [rows] = await ProductModel.searchProducts(q.trim());

        // si no se encontraron productos
        if (rows.length === 0) {
            return res.status(404).json({
                payload: [],
                message: `No se encontraron productos con el término: "${q}"`
            });
        }

        res.status(200).json({
            payload: rows,
            message: `${rows.length} producto(s) encontrado(s)`
        });

    } catch (error) {
        console.error("Error al buscar productos:", error.message);
        res.status(500).json({
            message: "Error interno al buscar productos"
        });
    }
}