var express = require('express');
var bcrypt = require('bcryptjs');
//imports para token
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion').verificaToken;
//schema
var Medico = require('../models/medico');
var app = express();

app.get('/', (request, response) => {

    Medico.find({})
        .exec((error, collection) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error cargado conexion',
                    error: error
                });
            }

            response.status(200).json({
                ok: true,
                mensaje: 'Coleccion cargada exitosamente',
                medicos: collection
            });

        });

});

app.post('/', mdAutenticacion, (request, response) => {

    var body = request.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: request.usuario._id,
        hospital: body.hospital
    });

    medico.save((error, medicoGuardado) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                error: error
            });
        }

        response.status(201).json({
            ok: true,
            mensaje: 'Medico guardado exitosamente',
            hospital: medicoGuardado
        });

    });

});

app.put('/:id', mdAutenticacion, (request, response) => {

    var body = request.body;
    var id = request.params.id;

    Medico.findById(id, (error, medico) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'No se encontro medico',
                error: error
            });
        }

        if (!medico) {

            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ID ' + id + ' no existe',
                error: error
            });

        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = request.usuario._id;
        medico.hospital = body.hospital;

        medico.save((error, medicoGuardado) => {

            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    error: error
                });
            }

            response.status(201).json({
                ok: true,
                mensaje: 'Medio Actualizado exitosamente',
                hospital: medicoGuardado
            });
        });

    });

});

app.delete('/:id', mdAutenticacion, (request, response) => {

    var id = request.params.id;

    Medico.findByIdAndRemove(id, (error, medicoBorrado) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Ocurrio un error al borrar registro',
                error: error
            });
        }

        if (!medicoBorrado) {
            return response.status(404).json({
                ok: false,
                mensaje: 'No se encontro ningun registro con el ID: ' + id,
                error: error
            });
        }

        response.status(200).json({
            ok: true,
            mensaje: 'Medico con el ID ' + id + ' se ha borrado',
            hospital: medicoBorrado,
            usuarioToken: request.usuario
        });

    });

});

module.exports = app;