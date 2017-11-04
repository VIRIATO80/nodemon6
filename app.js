'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const errorHandlers = require('./handlers/errorHandlers');

//Conexión a la base de datos
require('./lib/connectMongoose');
//Modelos a importar
require('./models/Anuncio');
require('./models/Tag');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


if (process.env.LOG_FORMAT !== 'nolog' ) {
    app.use(logger(process.env.LOG_FORMAT || 'dev'));
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Contenido estático
app.use(express.static(path.join(__dirname, 'public')));


const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init); // para inferir locale actual desde el request

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api/api'));


// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;