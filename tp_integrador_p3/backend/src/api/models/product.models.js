/*==============================================================================
    BLOQUE 1: importaciones
==============================================================================*/
import connection from "../database/db.js"; // importamos la conexion a la bbdd

/*==============================================================================
    BLOQUE 2: trae todos los productos
==============================================================================*/
const selectAllProducts = () => {
    // optimizacion 1: seleccionar solamente los campos necesarios, evitar select *
    // la idea es devolver solo las columnas que necesita el front: - datos transferidos, - carga de red, + seguridad

    /* modificación - 17/11: nos tiraba error por inconsistencia entre mayúsculas y minúsculas. lo arreglamos fácilmente modificando esta función, usando alias (lo mismo en selectproductwhereid)  */
    const sql = "SELECT ID AS id, Nombre, Marca, Modelo, Precio, Imagen, Categoria, Stock, Descripcion FROM productos WHERE Activo = 1";

    // con rows extraemos exclusivamente los datos que solicitamos en la consulta
    return connection.query(sql);
}

/*==============================================================================
    BLOQUE 3: selecciona producto por id
==============================================================================*/
const selectProductWhereId = (id) => {
    // gracias al uso de los placeholders -> ? evitamos ataques de inyeccion sql
    //let sql = `select * from productos where productos.id = ${id}`; // opcion 1. consulta no segura
    let sql = "SELECT ID AS id, Nombre, Marca, Modelo, Precio, Imagen, Activo, Categoria, Stock, Descripcion FROM productos WHERE productos.ID = ? AND Activo = 1";

    //let [rows] = await connection.query(sql); // aca introducimos la consulta 1 no segura

    // optimizacion 2: limitar los resultados de la consulta
    return connection.query(sql, [id]); // este id reemplazara el placeholder ?
}

/*==============================================================================
    BLOQUE 4: insertar producto
==============================================================================*/
const insertProduct = (Nombre, Marca, Modelo, Descripcion, Precio, Stock, Imagen, Categoria, Activo) => {
    /* modificación - 17/11: modificamos los argumentos en el insert para evitar errores en la consulta del front  */
    let sql = `INSERT INTO productos (Nombre, Marca, Modelo, Descripcion, Precio, Stock, Imagen, Categoria, Activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return connection.query(sql, [Nombre, Marca, Modelo, Descripcion, Precio, Stock, Imagen, Categoria, Activo]);
}

/*==============================================================================
    BLOQUE 5: actualiza producto
==============================================================================*/
const updateProduct = (name, brand, model, description, price, stock, image, category, active, id) => {

    let sql = `
        UPDATE productos
        SET
            Nombre = ?, 
            Marca = ?, 
            Modelo = ?, 
            Descripcion = ?, 
            Precio = ?, 
            Stock = ?, 
            Imagen = ?, 
            Categoria = ?, 
            Activo = ?
        WHERE ID = ?
    `;

    return connection.query(sql, [
        name, brand, model, description, price, stock, image, category, active, id]);
}

/*==============================================================================
    BLOQUE 6: eliminar producto
==============================================================================*/
const deleteProduct = (id) => {

    // implementación de baja lógica:
    // en lugar de borrar el registro (delete), actualizamos el campo 'activo' a 0.
    // esto mantiene el registro histórico del producto en la base de datos.

    let sql = "UPDATE productos SET activo = 0 WHERE id = ?";


    return connection.query(sql, [id]);
}

/*==============================================================================
    BLOQUE 7: buscar productos
==============================================================================*/
const searchProducts = (searchTerm) => {
    const sql = `
        SELECT ID AS id, Nombre, Marca, Modelo, Precio, Imagen, Categoria, Stock, Descripcion 
        FROM productos 
        WHERE Activo = 1 
        AND (
            Nombre LIKE ? OR 
            Marca LIKE ? OR 
            Modelo LIKE ? OR 
            Categoria LIKE ?
        )
    `;
    const searchPattern = `%${searchTerm}%`;
    return connection.query(sql, [searchPattern, searchPattern, searchPattern, searchPattern]);
}

/*==============================================================================
    BLOQUE 8: exportación
==============================================================================*/
export default {
    selectAllProducts,
    selectProductWhereId,
    insertProduct,
    updateProduct,
    deleteProduct,
    searchProducts
}
