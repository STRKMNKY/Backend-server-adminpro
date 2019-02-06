// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// Rutas
//importar rutas: para importar dentro del require va la ruta de la carpeta
var appRoutes = require('./routes/app');
var UsuarioRoutes = require('./routes/usuario');

// Inicializar Variables

var app = express();

//Confifuracion del BodyParser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión a MongoDB

mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error, res) => {

    if (error) throw error; //si falla la conexion se muestra el error en consola

    console.log('Base de datos \x1b[32m%s\x1b[0m', 'Online');

});

//Middleware
//cuando en la aplicacion se haga una peticion con la ruta se usara el appRoutes
//hay que definir las demas rutas arriba de la raiz
app.use('/usuario', UsuarioRoutes);
app.use('/', appRoutes); //Raiz

// Escuchar peticiones

app.listen(3001, () => {
    console.log('Servidor Express corriendo. \x1b[32m%s\x1b[0m', 'Puerto 3001');
});