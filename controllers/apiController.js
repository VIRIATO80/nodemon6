'use strict';
//Ciframos los métodos del API
const jwt = require('jsonwebtoken');
// importamos las variables desde nuestro archivo variables.env
//Usamos para ello el módulo dotenv
const dotenv = require('dotenv');
dotenv.config({ path: 'variables.env' });

const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const Tag = mongoose.model('Tag');

mongoose.Promise = global.Promise;


//Lista todos los anuncios de la base de datos en formato JSON o html
exports.getListadoAnuncios = async (req, res, next) =>{
    const Anuncios = await Anuncio.find();
    res.json(Anuncios);      
}


//Lista todos los tags de la base de datos en formato JSON
exports.getListadoTags = async (req, res, next) =>{
  
    //Query para listar todos los tags disponibles para los artículos de la tienda
    const Tags = await Tag.find();
    res.json(Tags);    
}


/* GET anuncios filtrados 
- Lista todos los anuncios de la base de datos en formato JSON o html que cumplen unos determinados criterios
- Los parámetros se pasan vía req.query.
-Los parametros aceptados son los siguientes:
    +tags = Categoría a la que pertenece el artículo
    +venta = Será true si el artículo está a la venta y false si se trata de una búsqueda de un particular
    +nombre = Contendrá parte del nombre de un artículo
    +precio = Rango del precio
-Hay dos filtros para modificar el orden de la lista y el número de resultados
    +sort = Ordena los resultados por el campo indicado (<campo> ascendente) (-<campo> Descendente)
    +limit = Limita el número de resultados a devolver en el JSON
    

Ejemplo:
  /apiv1/anuncios?tag=mobile&venta=false&nombre=ip&precio=50-&start=0&limit=2&sort=precio
*/
exports.getAnunciosFiltrados = async (req, res, next) =>{
    
    const tags = req.query.tags;
    const venta = req.query.venta;
    const nombre = req.query.nombre;
    const precio = req.query.precio;
    //Criterio de ordenación
    const sorter = req.query.sorter;
    //Número de resultados a mostrar
    const limite = req.query.limite;
    //Número de anuncio desde el que comienzo a mostrar
    const start = req.query.start;

    //Declaración del filtro vacío
    const filter = {};

    //Si se ha buscado por uno varios tags
    if(tags){
      let lista = [];
      lista = tags;
      filter.tags = { $in: lista } ;
    }

    //si el producto se vende o se busca
    if(venta){
      filter.venta = venta;
    }

    //Si el nombre comienza por la cadena introducida
    if(nombre){
      filter.nombre = new RegExp('^'+ nombre, "i");
    }

    //Filtro por precio
    if(precio){
      if(precio === '10-'){
          filter.precio = { '$gte': '10' };
      }else if(precio === '10-50'){
          filter.precio = { '$gte': '10', '$lte': '50' };          
      }else if (precio === '-50'){
          filter.precio = { '$lte': '50' };
      }else if (precio === '+50'){
        filter.precio = { '$gte': '50' };
      }else{
        filter.precio = '50';
      }
    }      

    //Recuperar una lista de anuncios de la base de datos
    const Anuncios = await Anuncio.find(filter).limit(parseInt(limite)).skip(parseInt(start)).sort(sorter);
    //Devolvemos JSON de resultados
    res.set({'Content-Type': 'application/json'});
    res.json(Anuncios);
}


/* POST Guarda un anuncio vía POST*/
exports.guardarAnuncio = async (req, res, next) => {
  //Recuperamos los datos en el body del método
  const anuncio = new Anuncio(req.body);
  //Lo guardamos en la base de datos
  const anuncioGuardado = await anuncio.save();
  res.json({success: true, result: anuncioGuardado});
}


//Método para autenticarse vía JWT y obtener un token para su uso posterior
exports.authenticate = async (req, res, next) => {

  const usuario = req.body.usuario;
  const password = req.body.password;
  // creamos el token si el usuario introducido coincide con el que tenemos
  //de prueba en las variables del entorno
  if(usuario != process.env.USUARIO_DEMO || password != process.env.PASSWORD_DEMO){
    // Respondemos que no son validas las credenciales
    res.json({success: false, error: 'Invalid credentials'});
  }
  //Si el usuario existe, entonces le devolvemos un token con caducidad de 2 horas
  jwt.sign({usuario: 'invitado'}, process.env.JWT_SECRET, {
    expiresIn: '2h'
  }, (err, token) => {
    if (err) {
      return next(err);
    }
    // respondemos con un JWT
    res.json({success: true, token: token});
  });
}

