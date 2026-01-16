/*==============================================================================
    BLOQUE 1: estructuras de middlewares
==============================================================================*/
// middleware de aplicacion -> Se aplica a todas las rutas
// middleware logger para mostrar por consola todas las peticiones a nuestro servidor
const loggerUrl = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);

    // Con next continuamos al siguiente middleware o a la respuesta
    next();
}

// middleware de ruta -> Se aplica a rutas especificas
const validateId = (req, res, next) => {
    let { id } = req.params;

    // nos aseguramos que el ID sea un numero (La consulta podria fallar o generar un error en la BBDD)
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            message: "El id del producto debe ser un numero valido"
        })
    }

    // convertimos el parametro id (originalmente un string porque viene de la URL) a un numero entero (en base 10 decimal)
    req.id = parseInt(id, 10);

    console.log("Id validado: ", req.id);
    next();
}

// middleware de ruta 
const requireLogin = (req, res, next) => {
    // chequeamos si no existe la sesion de usuario, de ser asi, redirigimos a /login
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    // Importante: Hacemos disponible el usuario para las vistas
    res.locals.user = req.session.user;

    next(); // sin el next, nunca llega a procesar la respuesta -> response
};

export {
    loggerUrl,
    validateId,
    requireLogin
}