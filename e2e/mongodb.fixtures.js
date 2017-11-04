'use strict';
const mongoose = require('mongoose');
const Anuncio = require('../models/Anuncio');

module.exports.initAnuncios = async function() {
  await Anuncio.deleteMany();
  await Anuncio.insertMany([
    {
        "nombre": "Bicicleta",
        "descripcion": "Una magnífica bicicleta de montaña apenas sin uso.",
        "venta": true,
        "precio": 230,
        "foto": "bici.jpg",
        "tags": [ "lifestyle", "motor"]
    },    
    {
        "nombre": "Cargadores Samsung",
        "descripcion": "Se venden cargadores de teléfono Samsung para todas sus versiones. ¡Pregúntame por la tuya!",    
        "venta": true,
        "precio": 15,
        "foto": "samsung.jpg",
        "tags": [ "lifestyle", "mobile"]
     }
  ]);
}
