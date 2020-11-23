const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    tipoId: String,
    numeroId: String,
    nombre: String,
    apellidos: String,
    email: String,
    numCel: String,
    pais: String,
    ciudad: String,
    barrio: String,
    user: String,
    password: String
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);