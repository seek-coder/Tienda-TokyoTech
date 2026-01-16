/*==============================================================================
    BLOQUE 1: importaciones
==============================================================================*/
// import userroutes from "./user.routes.js"; // importar eventuales rutas de usuario
import productRoutes from "./product.routes.js"; // importamos las rutas de producto que definimos en product.routes.js
import viewRoutes from "./view.routes.js";


/*==============================================================================
    BLOQUE 2: exportación
==============================================================================*/
// exportamos las rutas
export {
    productRoutes,
    viewRoutes,
}
