// imports necesarios
var express = require('express');
var app = express();

/*Se necesitan los modelos de datos para hacer las busquedas en esas colecciones*/

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

/*Aqui se definen las peticiones que se harán con HTTP*/

app.get('/todo/:busqueda', (request, response) => {

    var busqueda = request.params.busqueda;

    //Para hacer una busqueda insensible tenemos que aplicar una expresión regular

    var regex = new RegExp(busqueda, 'i');

    // Permite enviar un arreglo de promesas. Si todas son exitosas se dispara un then y si una falla usamos el catch

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => { //es un arreglo de las respuestas que que arrojan las promesas

            response.status(200).json({
                ok: true,
                hospitales: respuestas[0], //Hospitales
                medicos: respuestas[1],
                usuarios: respuestas[2] // Medios
            });

        });

});

app.get('/coleccion/:tabla/:busqueda', (request, response) => {

    var tabla = request.params.tabla;
    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            return response.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son usuarios, medicos y hospitales',
                error: error
            });

    }

    promesa.then(data => {
        response.status(200).json({
            ok: true,
            [tabla]: data //propiedades de objeto computadas (poner el valor de la variable como nobre de caracteristica de la respuesta)
        })
    })

});

//Para hacer consultas en varias colecciones debemos hacer procesos asincronos (promesas)

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((error, hospitales) => {

                if (error) {
                    reject('Error al cargar Hospitales', error);
                } else {
                    resolve(hospitales);
                }

            });

    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((error, medicos) => {

                if (error) {
                    reject('Error al cargar Hospitales', error);
                } else {
                    resolve(medicos);
                }

            });

    });

}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre role email img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((error, usuarios) => {
                if (error) {
                    reject('Error al cargar Usuarios', error)
                } else {
                    resolve(usuarios);
                }
            })

    });

}

//exportar
module.exports = app;