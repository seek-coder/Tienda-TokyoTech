/*==============================================================================
    BLOQUE 1: importaciones
==============================================================================*/
import UserModel from "../models/user.models.js";

/*==============================================================================
    BLOQUE 2: renderizar vista de login
==============================================================================*/
export const renderLogin = (req, res) => {
    res.render("login", { error: null });
}

/*==============================================================================
    BLOQUE 3: procesar login
==============================================================================*/
export const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        if (!correo || !password) {

            return res.render("login", { error: "Todos los campos son obligatorios" });
        }
        // 1. buscar usuario por email

        const [rows] = await UserModel.findUserByEmail(correo);


        if (rows.length === 0) {

            return res.render("login", { error: "Usuario o contraseña incorrectos" });
        }

        const user = rows[0];

        // 2. verificar contraseña (texto plano - solo académico)
        const isMatch = password === user.password;

        if (!isMatch) {
            return res.render("login", { error: "Usuario o contraseña incorrectos" });
        }

        // 3. crear sesión
        req.session.user = {
            id: user.id,
            email: user.correo,
            es_admin: user.es_admin
        };

        // 4. redirigir al dashboard
        res.redirect("/index");

    } catch (error) {
        console.error("Error en login:", error);
        res.render("login", { error: "Error interno del servidor" });
    }
}

/*==============================================================================
    BLOQUE 4: cerrar sesión
==============================================================================*/
export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
}

/*==============================================================================
    BLOQUE 5: crear usuario
==============================================================================*/
export const createUser = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los campos"
            });
        }

        // Verificar si el usuario ya existe
        const [existingUsers] = await UserModel.findUserByEmail(correo);
        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: "El correo ya está registrado"
            });
        }

        await UserModel.createUser(correo, password);

        res.status(201).json({
            message: "Usuario creado con exito",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno en el servidor",
            error: error.message
        });
    }
}
