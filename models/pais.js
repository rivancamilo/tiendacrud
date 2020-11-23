const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaisSchema = Schema({
    nombre: String,
    prefijo: String
});

module.exports = mongoose.model('pais', PaisSchema);