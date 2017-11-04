'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const tagSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
}, { autoIndex: false });

//Crear el modelo
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;