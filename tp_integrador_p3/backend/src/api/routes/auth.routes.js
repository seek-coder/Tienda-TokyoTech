/*==============================================================================
    BLOQUE 1: importaciones
==============================================================================*/
import { Router } from "express";
import { renderLogin, login, logout, createUser } from "../controllers/auth.controllers.js";

/*==============================================================================
    BLOQUE 2: configuración del router
==============================================================================*/
const router = Router();

/*==============================================================================
    BLOQUE 3: rutas de autenticación
==============================================================================*/
// vista de login
router.get("/login", renderLogin);

// procesar login
router.post("/login", login);

// logout
router.post("/logout", logout);

// crear usuario
router.post("/api/users", createUser);

/*==============================================================================
    BLOQUE 4: exportación
==============================================================================*/
export default router;
