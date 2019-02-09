// imports necesarios
var express = require('express');
var app = express();
//importar schema
var Usuario = require('../models/usuario');
//Libreria para cifrado de una via (npm install bcryptsjs --save)
var bcrypt = require('bcryptjs');
//imports para token
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion').verificaToken;
// liniea ya no necesaria var SEED = require('../config/config').SEED;


/*Aqui se definen las peticiones que se harán con HTTP*/

app.get('/', (request, response, next) => {
    //Obtener usuarios de mongo 
    Usuario.find({}, 'nombre email img role') //seleccion de campos a pedir
        .exec(
            (error, collection) => {
                if (error) {
                    return response.status(500).json({
                        /*Es importante estadarizar las respuetas */
                        ok: false,
                        mensaje: 'Error cargando colección',
                        errors: error
                    });
                }

                response.status(200).json({
                    /*Es importante estadarizar las respuetas */
                    ok: true,
                    mensaje: 'Peticion ejecutada de forma correcta para usuarios',
                    usuarios: collection
                });

            });


});

/*====================== 
    Para optimizar este middleware se movio a autenticacion.js
  ======================
    // Validar token
// Middleware: todas las peticiones debajo de este bloque de codigo requieren el token

app.use('/', (request, response, next) => {

    var token = request.query.token;

    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                ok: false,
                mensaje: 'Token invalido',
                error: error
            });
        }
    });

    next();

});
================================*/

//Crear usuario

//necesitaremos una libreria de node bdy-parser
//Para verificar el token mandamos a llamar a la funcion como parametro de la petición
app.post('/', mdAutenticacion, (request, response) => {

    var body = request.body; //esto es lo que envia el usuario como datos

    // Rescatamos los datos que nos envian en un objeto que hace referencia al modelo
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // contraseña encriptada 
        img: body.img,
        role: body.role
    });

    //Para guardarlo:
    usuario.save((error, usuarioGuardado) => {

        if (error) {
            return response.status(400).json({
                /*Es importante estadarizar las respuetas */
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }

        //Respuesta para creación exitosa
        response.status(201).json({
            ok: true,
            mensaje: 'Usuario creado exitosamente',
            usuario: usuarioGuardado,
            usuarioToken: request.usuario
        });

    });

    // response.status(200).json({
    //   ok: true,
    //  body: body
    //});

});

//Modificar usuario
app.put('/:id', mdAutenticacion, (request, response) => {

    var id = request.params.id; //guardar id de la ruta 
    var body = request.body;

    //verificamos si exite un usuario con ese id

    Usuario.findById(id, (error, usuario) => {

        //manejamos el error como de constumbre

        if (error) {
            return response.status(500).json({
                /*Es importante estadarizar las respuetas */
                ok: false,
                mensaje: 'No se encontro usuario',
                errors: error
            });
        }

        //Si no existe el usuario
        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                error: { message: 'No se encotro usuario registrado con el id ' + id }
            });
        }

        //Si exite el usuario

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((error, usuarioGuardado) => {
            if (error) {
                return response.status(400).json({
                    /*Es importante estadarizar las respuetas */
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: error
                });
            }
            usuarioGuardado.password = 'Dato protegido'
                //Respuesta para creación exitosa
            response.status(201).json({
                ok: true,
                mensaje: 'Datos del usuario actualizado exitosamente',
                usuario: usuarioGuardado,
                usuarioToken: request.usuario
            });
        });

    });

});

//Borrar usuario por ID
app.delete('/:id', mdAutenticacion, (request, response) => {

    var id = request.params.id;

    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {

        if (error) {
            return response.status(500).json({
                /*Es importante estadarizar las respuetas */
                ok: false,
                mensaje: 'Error al borrar usuario usuario',
                errors: error
            });
        }

        if (!usuarioBorrado) {
            return response.status(400).json({
                ok: false,
                message: 'No existe ningun usuario con ese ID',
                error: error
            });
        }

        usuarioBorrado.password = 'Dato protegido'
        response.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
            message: 'Eliminación exitosa',
            usuarioToken: request.usuario
        });
    })

});

//exportar
module.exports = app;