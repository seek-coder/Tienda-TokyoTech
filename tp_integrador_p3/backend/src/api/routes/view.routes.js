/*==============================================================================
    BLOQUE 1: importaciones y configuración
==============================================================================*/
import { Router } from "express";
const router = Router();
import { vistaProductos } from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";

/*==============================================================================
    BLOQUE 2: rutas de las vistas
==============================================================================*/
router.get("/", requireLogin, vistaProductos);
router.get("/index", requireLogin, vistaProductos);

router.get("/consultar", requireLogin, (req, res) => {
    res.render("get");
});

router.get("/crear", requireLogin, (req, res) => {
    res.render("create");
});

router.get("/modificar", requireLogin, (req, res) => {
    res.render("update");
});

router.get("/eliminar", requireLogin, (req, res) => {
    res.render("delete");
});

router.get("/login", (req, res) => {
    res.render("login");
});

/*==============================================================================
    BLOQUE 3: exportación
==============================================================================*/
// exportamos todas las rutas
export default router;