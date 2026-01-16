/*==============================================================================
    BLOQUE 1: importaciones
==============================================================================*/
import ProductModel from "../models/product.models.js";

/*==============================================================================
    BLOQUE 2: vista productos
==============================================================================*/
export const vistaProductos = async (req, res) => {

    /* de esta comprobacion ya se encarga el middleware requirelogin
    // chequeamos si no existe la sesion de usuario, de ser asi, redirigimos a /login
    if(!req.session.user) {
        return res.redirect("/login")
    }
    */

    try {
        const [rows] = await ProductModel.selectAllProducts();
        res.render("index", {
            productos: rows
        });

    } catch (error) {
        console.error(error);
        res.render("index", {
            productos: [],
            error: "Error al cargar los productos"
        });
    }
}