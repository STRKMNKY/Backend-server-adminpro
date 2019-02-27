// imports necesarios
var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

//fielupload import
var fileUpload = require('express-fileupload');
var fs = require('fs');
util = require('util');
//Para subir archivos usaremos la libreria express-fileupload
//Documentacion de la libreria :https://github.com/richardgirges/express-fileupload
//npm install --save express-fileupload

app.use(fileUpload({
    createParentPath: true
}));

app.put('/:tipo/:id', (request, response) => {

    var tipo = request.params.tipo;
    var id = request.params.id;

    if (!request.files) {

        return response.status(400).json({
            /*Es importante estadarizar las respuetas */
            ok: false,
            mensaje: 'No se seleccionaron archivos',
            errors: { meesage: 'Debe selecionar una imagen' }
        });

    }

    //Validaciones
    //obtener nombre del archivo

    var archivo = request.files.imagen;
    var nombre = archivo.name.split('.'); //corta el nombre por puntos esto es un arreglo
    var extension = nombre[nombre.length - 1];

    //validacion de coleccion;

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return response.status(400).json({
            /*Es importante estadarizar las respuetas */
            ok: false,
            mensaje: 'Coleccion no valida',
        });

    }

    // Arreglo de extensiones validas

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return response.status(400).json({
            /*Es importante estadarizar las respuetas */
            ok: false,
            mensaje: 'Tipo de archivo no valido',
            errors: { meesage: 'Debe selecionar una imagen tipo png, jpg, gif, jpeg' }
        });

    }

    //Nombre de archivo personalizado
    var nombre = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    //Mover archivo del temeporal a un path
    var path = `./uploads/${ tipo }/${ nombre }`;

    //Metodo bueno para mover archivos

    try {

        fs.createReadStream(archivo.tempFilePath)
        var wr = fs.createWriteStream(path);
        wr.write(archivo.data);

        return response.status(200).json({
            ok: true,
            mensaje: 'Archivo subido exitosamente',
            ruta: path
        });

    } catch {

        return response.status(500).json({
            ok: false,
            mensaje: 'error al mover archivo',
        });

    }
    /*
        archivo.mv(path, (error) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'error al mover archivo',
                    errors: error,
                    archivo: archivo
                });
            }

            response.status(200).json({
                ok: true,
                mensaje: 'Archivo movido'
            });

        });
    */
});

function subirTipo(tipo, id, nombreArchivo) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (error, usuario) => {

            if (error) {
                return response.status('500').json({
                    ok: false,
                    message: 'Usuario no encontrado para el ID: ' + id
                });
            }

            var oldPath = './uploads/usuarios/' + usuario.img;

            //Valida la existencia de una imagen previa, en caso de que exista borra lo que esta en el oldpath

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            usuario.img = nombreArchivo;

            usuario.save((error, usuarioGuardado) => {

                return response.status(200).json({
                    ok: true,
                    message: 'Imagen actualizada',
                    usuario: 'ID: ' + usuarioGuardado.id + 'Nombre' + usuarioGuardado.nombre,
                    imagen: usuario.img
                });

            });

        });

    }

    if (tipo === 'medicos') {
        Medico.findById(id, (error, medico) => {

            if (error) {
                return response.status('500').json({
                    ok: false,
                    message: 'Medico no encontrado para el ID: ' + id
                });
            }

            var oldPath = './uploads/medicos/' + medico.img;


            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            medico.img = nombreArchivo;

            medico.save((error, medicoGuardado) => {
                return response.status(200).json({
                    ok: true,
                    message: 'Imagen actualizada',
                    medico: 'ID: ' + medicoGuardado.id + 'Nombre: ' + medicoGuardado.nombre,
                    imagen: medicoGuardado.img
                });
            });

        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (error, hospital) => {

            if (error) {
                return response.status('500').json({
                    ok: false,
                    message: 'Hospital no encontrado para el ID: ' + id
                });
            }

            var oldPath = './uploads/hospitales' + hospital.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            hospital.img = nombreArchivo;

            hospital.save((error, hospitalGuardado) => {
                return response.status(200).json({
                    ok: true,
                    message: 'Image actualizada',
                    hospital: 'ID: ' + hospitalGuardado.id + 'Nombre: ' + hospitalGuardado.nombre,
                    imagen: hospitalGuardado.img
                });
            });

        });
    }

}

//exportarimag
module.exports = app;