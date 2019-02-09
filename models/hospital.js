// Imports
var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var hospitalSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }, // hace referencia al schema Usuario

}, { collection: 'hospitales' }); // moongose intentara crear una coleccion en plural, aqui definimos como se llamara esta coleccion y no lo haga automaticamente

module.exports = mongoose.model('Hospital', hospitalSchema);