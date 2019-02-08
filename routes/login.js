var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

app.post('/', (request, response) => {

    var body = request.body; //recuperar correo y contraseña

    //findOne ya que sabemos que solo debe existir un usuario registrado con ese email
    Usuario.findOne({ email: body.email }, (error, userLoged) => {

        if (error) {
            return response.status(500).json({
                /*Es importante estadarizar las respuetas */
                ok: false,
                mensaje: 'Error usuario no encontrado',
                errors: error
            });
        }

        if (!userLoged) {
            return response.status(400).json({
                ok: false,
                message: 'Credenciales invalidas -email',
                error: error
            });
        }

        //validar contraseña
        //compareSync compara ambos parametros ingresados, regresa un boolean
        if (!bcrypt.compareSync(body.password, userLoged.password)) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -password',
                error: error
            });
        }

        userLoged.password = 'Dato protegido';

        //Crear el Token. Libreria necesaria npm install jsonwebtoken --save

        var token = jwt.sign({ usuario: userLoged }, SEED, { expiresIn: 14400 }); //expira en 4 horas

        //Respuesta para creación exitosa
        response.status(201).json({
            ok: true,
            mensaje: 'Inicio de sesión exitoso',
            usuario: userLoged,
            token: token,
            id: userLoged._id
        });


    });

});

module.exports = app;