'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const anuncioSchema = new mongoose.Schema({
    nombre:{type: String, index: true},
    descripcion: String,
    venta: { type: Boolean, index: true},
    precio: { type: Number, index: true},
    foto: String,
    tags: { type: [String], index: true }
}, { autoIndex: false });


//Crear el modelo
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;