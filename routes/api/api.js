'use strict';

const express = require('express');
const router = express.Router();
const apiController = require('../../controllers/apiController');
const { catchErrors } = require('../../handlers/errorHandlers');

//Crendenciales para el API
const jwtAuth = require('../../lib/jwtAuth');

/* POST /api/authenticate
Se autentica utilizando protocolo JWT */
router.post('/authenticate',  catchErrors(apiController.authenticate));

/* GET /api/anuncios
Lista todos los Anuncios*/
router.get('/anuncios', jwtAuth(), catchErrors(apiController.getListadoAnuncios));

/* GET /api/anuncios
Devuelve los anuncios que cumplen unos determinados criterios*/
router.get('/busqueda', jwtAuth(), catchErrors(apiController.getAnunciosFiltrados));

/* POST /api/crearAnuncio
Guarda un anuncio vía petición POST*/
router.post('/crearAnuncio', jwtAuth(), catchErrors(apiController.guardarAnuncio));
module.exports = router;

/* GET /api/tags
Lista todos los tags disponibles*/
router.get('/tags', catchErrors(apiController.getListadoTags));