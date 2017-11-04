'use strict';

//Literales
var mensajesEN = require('./english');
var mensajesES = require('./spanish');

//Constructor de error
module.exports = function CustomError(code, idioma) {
  var value = 'Error';
  if(idioma == 'es'){
    value = mensajesES[code];
  }else{
    value = mensajesEN[code];
  }
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = value;
};

require('util').inherits(module.exports, Error);