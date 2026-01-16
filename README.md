# 🛒 TokyoTech - Sistema de Autoservicio
<img width="1920" height="1440" alt="625shots_so" src="https://github.com/user-attachments/assets/d9416ca9-27fb-4b84-babb-cd2a1c27b7e8" />

## 📋 Descripción del Proyecto

**TokyoTech** es un sistema completo de autoservicio para la venta de productos electrónicos, desarrollado como Trabajo Integrador Final de la materia Programación III. El proyecto está dividido en dos componentes principales: una aplicación **frontend** orientada al cliente y un **backend** con API REST y panel de administración.

El sistema simula un kiosco de autoservicio (similar a los terminales de comida rápida), donde los clientes pueden:
- Seleccionar productos de manera autónoma
- Gestionar su carrito de compras
- Finalizar la compra y recibir un ticket digital

A diferencia de un e-commerce tradicional, el sistema se reinicia después de cada compra, permitiendo que el siguiente cliente comience un nuevo proceso.

## 🎯 Características Principales

### 👤 Módulo Cliente (Frontend)
- ✅ **Pantalla de Bienvenida**: Registro del nombre del cliente
- 🛍️ **Catálogo de Productos**: Visualización de productos electrónicos por categorías
- 🔍 **Búsqueda y Filtrado**: Búsqueda por nombre y ordenamiento por precio
- 🛒 **Carrito de Compras**: Gestión de productos con cantidades variables
- 🎫 **Generación de Ticket**: Ticket digital descargable en PDF
- 🌓 **Modo Claro/Oscuro**: Tema personalizable persistente
- 📱 **Diseño Responsive**: Adaptado para móviles y desktop

### 🔐 Módulo Administrador (Backend con EJS)
- 🔑 **Sistema de Login**: Autenticación con credenciales seguras
- 📊 **Dashboard**: Panel de control con listado completo de productos
- ➕ **Alta de Productos**: Formulario para agregar nuevos productos con imágenes
- ✏️ **Modificación de Productos**: Edición de datos e imágenes
- 🗑️ **Baja Lógica**: Activación/desactivación de productos
- 📈 **Gestión de Ventas**: Visualización y descarga de registros en Excel
- 🚀 **Acceso Rápido**: Botón de autocompletado para testing

### 🔌 API REST
- 📡 **Endpoints JSON**: API completa para operaciones CRUD
- 🗄️ **Base de Datos MySQL**: Gestión persistente de productos, usuarios y ventas
- 🔒 **Seguridad**: Encriptación de contraseñas con bcrypt
- 🛡️ **Validación**: Middlewares de validación de datos
- 📦 **Relaciones**: Modelo Many-to-Many entre productos y ventas
- 📄 **Paginación**: Carga optimizada de productos
- 🖼️ **Carga de Imágenes**: Sistema de almacenamiento en servidor

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (con tema Tokyo Night)
- JavaScript (Vanilla)
- jsPDF (generación de PDFs)

### Backend
- Node.js
- Express.js
- EJS (Motor de plantillas)
- MySQL2 (Base de datos)
- Bcrypt (Encriptación)
- Express-session (Manejo de sesiones)
- CORS (Control de acceso)
- Dotenv (Variables de entorno)

## 📂 Estructura del Proyecto

```
tp_p3/
├── tp_integrador_p3/          # Backend
│   ├── backend/
│   │   ├── database/          # Configuración de BD
│   │   ├── public/            # Imágenes de productos
│   │   └── src/
│   │       ├── api/
│   │       │   ├── config/    # Configuración y entornos
│   │       │   ├── controllers/  # Lógica de negocio
│   │       │   ├── middlewares/ # Validaciones
│   │       │   ├── models/    # Modelos de datos
│   │       │   ├── routes/    # Definición de rutas
│   │       │   └── utils/     # Utilidades
│   │       ├── public/        # CSS y JS del backoffice
│   │       └── views/         # Plantillas EJS
│   └── index.js               # Punto de entrada
│
└── tp_integrador_p3_cliente/  # Frontend
    └── code/
        ├── css/               # Estilos
        ├── js/                # Lógica del cliente
        ├── img/               # Recursos visuales
        └── index.html         # Página principal
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL (v8 o superior)
- npm o yarn

### Configuración del Backend

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/gatto_coria_programacion3_tp_final.git
cd gatto_coria_programacion3_tp_final/tp_integrador_p3
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tokyotech_db
PORT=3000
SESSION_KEY=tu_clave_secreta_aleatoria
```

4. **Crear la base de datos**
```sql
CREATE DATABASE tokyotech_db;
```

5. **Iniciar el servidor**
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### Configuración del Frontend

1. **Navegar al directorio del cliente**
```bash
cd ../tp_integrador_p3_cliente/code
```

2. **Abrir con Live Server o servidor local**
El frontend es estático, puede abrirse directamente con:
- Live Server (VS Code)
- `python -m http.server`
- Cualquier servidor HTTP local

## 📖 Uso del Sistema

### Como Cliente
1. Abrir `index.html` en el navegador
2. Ingresar nombre en la pantalla de bienvenida
3. Navegar por el catálogo de productos
4. Agregar productos al carrito
5. Revisar el carrito y confirmar compra
6. Descargar el ticket en PDF
7. Finalizar (el sistema se reinicia)

### Como Administrador
1. Acceder a `http://localhost:3000/login`
2. Usar el botón de "Acceso Rápido" o ingresar credenciales
3. Gestionar productos desde el dashboard
4. Ver estadísticas de ventas
5. Descargar reportes en Excel

## 👥 Autores

- **Catriel Gatto**
- **Diego Coria**

*Programación III - UTN*

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos como parte del curso de Programación III.

## 🙏 Agradecimientos

- Universidad Tecnológica Nacional (UTN)
- Profesores de Programación III
- Compañeros de cursada
