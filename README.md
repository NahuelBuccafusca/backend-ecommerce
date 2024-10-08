# eCommerce Backend

Este es un proyecto de backend para un sistema de eCommerce construido con Express.js. Proporciona una API RESTful para gestionar productos, usuarios y carritos de compras.


## Características

- Gestión de productos (CRUD)
- Registro y autenticación de usuarios
- Gestión de pedidos
- Middleware de autenticación
- Validación de datos
- Conexión a base de datos MongoDB

## Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

## Endpoints
- Productos
GET /products - Obtener todos los productos
POST /productsManager - Crear un nuevo producto
PUT /product/:uid - Actualizar un producto por ID
DELETE /productsManager/:uid - Eliminar un producto por ID
Usuarios
GET /api/users - Obtener todos los usuarios
POST /api/users/:uid/documents - Registrar un nuevo usuario
PUT /api/users/premium/:uid - Cambiar rol de usuario
DELETE /api/users/:uid- Eliminar usuario
