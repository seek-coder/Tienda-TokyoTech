/*==============================================================================
    BLOQUE 1: importaciones
==============================================================================*/
import connection from "../database/db.js";

/*==============================================================================
    BLOQUE 2: buscar usuario por email
==============================================================================*/
const findUserByEmail = (email) => {
    const sql = "SELECT * FROM usuarios WHERE correo = ?";
    return connection.query(sql, [email]);
}

/*==============================================================================
    BLOQUE 3: crear usuario
==============================================================================*/
const createUser = (correo, password, es_admin = 0) => {
    const sql = "INSERT INTO usuarios (correo, password, es_admin) VALUES (?, ?, ?)";
    return connection.query(sql, [correo, password, es_admin]);
}

/*==============================================================================
    BLOQUE 4: exportación
==============================================================================*/
export default {
    findUserByEmail,
    createUser
}
