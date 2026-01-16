/*==============================================================================
    BLOQUE 1: importaciones
==============================================================================*/
import express from "express";
const app = express(); // app es la instancia de la aplicacion express

// corrección final de ruta: apunta a la ubicación real del backend dentro de la carpeta 'backend/'
import environments from "./backend/src/api/config/environments.js";
const PORT = environments.port;
const SESSION_KEY = environments.session_key;

import cors from "cors";

// corrección final de ruta: todas las importaciones usan './backend/'
import { loggerUrl } from "./backend/src/api/middlewares/middlewares.js";
import { productRoutes, viewRoutes, } from "./backend/src/api/routes/index.js";
import authRoutes from "./backend/src/api/routes/auth.routes.js";
import { join, __dirname } from "./backend/src/api/utils/index.js";
import connection from "./backend/src/api/database/db.js";
import session from "express-session";

/*==============================================================================
    BLOQUE 2: middlewares globales
==============================================================================*/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // para leer datos de formularios html
app.use(loggerUrl);

/*==============================================================================
    BLOQUE 3: middleware de autenticación
==============================================================================*/
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user; // para usar el usuario en las vistas
        return next();
    }
    res.redirect("/login");
};

/*==============================================================================
    BLOQUE 4: middleware para servir archivos estaticos
==============================================================================*/
// 1. css y js del front (están en backend/src/public)
app.use(express.static(join(__dirname, "src/public")));
// 2. imágenes (están en backend/public)
app.use(express.static(join(__dirname, "public")));

/*==============================================================================
     BLOQUE 5: config login (sesiones)
==============================================================================
    - http es un protocolo sin estado, lo que significa que cada solicitud del cliente al servidor se trata como una transacción independiente, sin relación con solicitudes anteriores.
    - esto implica que el servidor no guarda ninguna información sobre conexiones o interacciones previas, y por tanto, al finalizar una transacción, todos los datos se pierden

sin sesiones no hay forma de saber si el usuario esta logueado, a menos que usemos tokens jwt, cookies firmadas u otro sistema, por eso usamos express-session

1. instalamos express-session
2. creamos una clave secreta y la exportamos con environments.js

3. hacemos la configuracion para el middleware de sesion:*/
app.use(session({
    secret: SESSION_KEY, // firma las cookies para evitar manipulacion (por eso debe ser aleatoria y secreta)
    resave: false, // evita guardar la sesion si no hubo cambios
    saveUninitialized: true // no guarda sesiones vacias
}));

// 4. crear vista login e incorporar el middleware para parsear datos de un <form>

// 5. habilitar la creacion de usuarios -> creando un endpoint y una vista

// 6. ahora vamos a crear el endpoint que va a recibir los datos del <form> de login.ejs

// ========================================

// middleware para parsear info de un <form>
// middleware necesario para leer formularios html <form method="post">
app.use(express.urlencoded({
    extended: true
}));

/*==============================================================================
    BLOQUE 6: configuracion de vistas
==============================================================================*/
app.set("view engine", "ejs");
// corrección: las vistas están en backend/src/views
app.set("views", join(__dirname, "src/views"));

/*==============================================================================
    BLOQUE 7: rutas / endpoints
==============================================================================*/
// ruta raíz - redirige a /index
app.get("/", (req, res) => {
    res.redirect("/index");
});

// rutas de autenticación (login/logout)
app.use("/", authRoutes);

app.get("/test", (req, res) => {
    console.log("Este endpoint no ofrece ninguna respuesta y se queda aca trabado...");
});

// rutas de la api (datos json)
app.use("/api/products", productRoutes);

// rutas de las vistas (html renderizado con ejs)
app.use("/", viewRoutes);

/*==============================================================================
    BLOQUE 8: servidor
==============================================================================*/
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log("Tipo de PORT:", typeof PORT, PORT);
});

server.on('error', (err) => {
    console.error("Error en el servidor:", err);
});

server.on('close', () => {
    console.log("El servidor se ha cerrado");
});