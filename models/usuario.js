// importar mongoose
var moongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// funcion que nos permite definir esquemas
var Schema = moongoose.Schema;


var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol permitido'
};

var usuarioSchema = new Schema({

    //Aqui dentro va la estructura de la "tabla" o coleccion de mongo

    nombre: { type: String, require: [true, 'El nombre es necesario'] }, //Asignacion del tipo y campo obligatorio asi como mensaje en caso de no ser ingresado
    email: { type: String, unique: true, require: [true, 'El correo es necesario'] },
    password: { type: String, require: [true, 'La contrseña es necesaria'] },
    img: { type: String, require: false },
    role: { type: String, require: true, default: 'USER_ROLE', enum: rolesValidos } //Para aplicar el arrego de valores aceptados

});

//Agregar el validador al schema
usuarioSchema.plugin(uniqueValidator, { message: 'El atributo {PATH} debe ser unico' });

// Exportar modelo para que sea usado fuera de este archivo
module.exports = moongoose.model('Usuario', usuarioSchema);

//========================
//NOTAS
//========================
//mongoose-unique-validator libreria para validaciones clase 104