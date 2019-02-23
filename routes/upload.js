// imports necesarios
var express = require('express');
var app = express();

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

    try {

        //Metodo bueno para mover archivos
        fs.createReadStream(archivo.tempFilePath)
        fs.createWriteStream(path);

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

    /* fs.rename(archivo.tempFilePath, path, error => {
         if (error) {
             return response.status(500).json({
                 ok: false,
                 mensaje: 'error al mover archivo',
                 errors: error
             });
         }

         response.status(200).json({
             ok: true,
             mensaje: 'Archivo movido'
         });

     });*/
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

//exportar
module.exports = app;