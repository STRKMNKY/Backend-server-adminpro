//imports

var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Validar token
// Middleware: todas las peticiones debajo de este bloque de codigo requieren el token
exports.verificaToken = function(request, response, next) {

    var token = request.query.token;

    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                ok: false,
                mensaje: 'Token invalido',
                error: error
            });
        }
        //Obtener usuario del resultado decodificado
        request.usuario = decoded.usuario;
    });



    next();

}