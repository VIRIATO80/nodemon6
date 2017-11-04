'use strict';

const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const Tag = mongoose.model('Tag');
const multer = require('multer');
const uuid = require('uuid'); //Módulo para generar ids
const jimp = require('jimp'); //Comprime fotos
var CustomError = require('../handlers/customError');
//Importamos el invocador del microservicio que crea miniaturas
var imagePublisher = require('../microservices/newImageCreated');


mongoose.Promise = global.Promise;

//Configurar multer para subir fotos
const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next(new CustomError(415, req.query.idioma), false);
        }
    }
};


//Lista todos los anuncios de la base de datos en formato JSON o html
exports.getListadoAnuncios = async (req, res, next) =>{
    const Anuncios = await Anuncio.find();
    const Tags = await Tag.find();
    res.render('index', { title: 'NodePop!', Anuncios: Anuncios, Tags: Tags });
}


/*Carga la página del formulario de creación de anuncios*/
exports.cargarFormularioCreacion = async function(req, res, next){
    const Tags = await Tag.find();
    res.render('addAnuncio', { title: 'Crear Anuncio', Tags: Tags });
};


exports.upload = multer(multerOptions).single('foto');

exports.guardarFoto = async (req, res, next) => {
    //Comprueba si se necesita hacer resize de la foto
    if(!req.file) {
        next(); //Vete al siguiente middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.foto = `/images/${uuid.v4()}.${extension}`;
    //Now we resize
    const foto = await jimp.read(req.file.buffer);
    await foto.resize(800, jimp.AUTO);
    await foto.write(`./public${req.body.foto}`);
    //Llamamos al micro servicio que crea una miniatura en disco
    imagePublisher(`/public${req.body.foto}`);
    //Continuamos con el siguiente paso de guardado en la BBDD
    next();
}

/* POST Guarda un anuncio vía POST*/
exports.guardarAnuncio = async (req, res, next) => {
    //Recuperamos los datos en el body del método
    const anuncio = new Anuncio(req.body);
    //Lo guardamos en la base de datos
    const anuncioGuardado = await anuncio.save();
    res.redirect('/');
}

//Cambio de idioma
exports.cambiaIdioma =  (req, res, next) => {
    const locale = req.params.locale;
    const referer = req.query.redir || req.get('referer');
    res.cookie('nodeapi-lang', locale, { maxAge: 900000, httpOnly: true });
    res.redirect(referer);
}