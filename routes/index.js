'use strict';

const express = require('express');
const router = express.Router();
const webController = require('../controllers/webController');
const { catchErrors } = require('../handlers/errorHandlers');


//Load home page
router.get('/', catchErrors(webController.getListadoAnuncios));

//Búsqueda
router.get('/busqueda', catchErrors(webController.getAnunciosFiltrados));

//Load create form
router.get('/add', webController.cargarFormularioCreacion);

//Save store data
router.post('/add', webController.upload, webController.guardarFoto, catchErrors(webController.guardarAnuncio));

//Change language
router.get('/lang/:locale', catchErrors(webController.cambiaIdioma));

module.exports = router;
