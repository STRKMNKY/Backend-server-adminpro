// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar Variables

var app = express();

// Conexión a MongoDB

mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error, res) => {

    if (error) throw error; //si falla la conexion se muestra el error en consola

    console.log('Base de datos \x1b[32m%s\x1b[0m', 'Online');

});


// Rutas
/*Aqui se definen las peticiones que se harán con HTTP*/

app.get('/', (request, response, next) => {

    response.status(200).json({ /*Es importante estadarizar las respuetas */
        ok: true,
        mensaje: 'Peticion ejecutada de forma correcta'
    });

});

// Escuchar peticiones

app.listen(3001, () => {
    console.log('Servidor Express corriendo. \x1b[32m%s\x1b[0m', 'Puerto 3001');
});