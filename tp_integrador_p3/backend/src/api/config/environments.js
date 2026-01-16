/*==============================================================================
    BLOQUE 1: configuración de variables de entorno
==============================================================================*/
// importamos dotenv usando la sintaxis moderna para modo "module". 
// 'dotenv/config' lee el archivo .env automáticamente al importarse.
import 'dotenv/config';

/*==============================================================================
    BLOQUE 2: objeto de configuración
==============================================================================*/
// este archivo exporta las variables de entorno configuradas
const environments = {
    // servidor
    port: process.env.PORT || 3000, // usamos 3100 si ese es el puerto que usa el profesor

    // base de datos
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    session_key: process.env.SESSION_KEY || "secreto_temporal_para_desarrollo"
};

export default environments;