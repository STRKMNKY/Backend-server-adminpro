// imports necesarios
var express = require('express');
var app = express();

/*Aqui se definen las peticiones que se harán con HTTP*/

app.get('/', (request, response, next) => {

    response.status(200).json({ /*Es importante estadarizar las respuetas */
        ok: true,
        mensaje: 'Peticion ejecutada de forma correcta'
    });

});

//exportar
module.exports = app;