//imports
var express = require('express');
var bcrypt = require('bcryptjs');
//imports para token
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion').verificaToken;
//schema
var Hospital = require('../models/hospital');
var app = express();

app.get('/', (request, response) => {

    Hospital.find({}, 'nombre img usuario')
        .exec((error, collection) => {

            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando coleccion',
                    error: error
                });
            }
            response.status(200).json({
                ok: true,
                mensaje: 'Coleccion encontrada',
                hospitales: collection
            });

        });

});

app.post('/', mdAutenticacion, (request, response) => {

    var body = request.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: request.usuario._id
    });

    hospital.save((error, hospitalGuardado) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                error: error
            });
        }

        response.status(201).json({
            ok: true,
            mensaje: 'Hospital guardado exitosamente',
            hospital: hospitalGuardado
        });

    });

});

app.put('/:id', mdAutenticacion, (request, response) => {

    var id = request.params.id;
    var body = request.body;

    Hospital.findById(id, (error, hospital) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'No se encontro usuario',
                error: error
            });
        }

        if (!hospital) {

            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ID ' + id + ' no existe',
                error: error
            });

        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = request.usuario._id;

        hospital.save((error, hospitalGuardado) => {

            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    error: error
                });
            }

            response.status(201).json({
                ok: true,
                mensaje: 'Hospital guardado exitosamente',
                hospital: hospitalGuardado
            });


        });

    });

});

app.delete('/:id', mdAutenticacion, (request, response) => {

    var id = request.params.id;

    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Ocurrio un error al borrar registro',
                error: error
            });
        }

        if (!hospitalBorrado) {
            return response.status(404).json({
                ok: false,
                mensaje: 'No se encontro ningun registro con el ID: ' + id,
                error: error
            });
        }

        response.status(200).json({
            ok: true,
            mensaje: 'Hospital con el ID ' + id + ' se ha borrado',
            hospital: hospitalBorrado,
            usuarioToken: request.usuario
        });

    });

});

module.exports = app;