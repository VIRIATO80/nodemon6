'use strict';

var CustomError = require('./customError');

/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
  Not Found Error Handler
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err, req, res);
};


/*
  Production Error Handler
*/
exports.productionErrors = (err, req, res, next) => {

  const idioma = req.query.idioma;
  let error = new CustomError(err.status||500, idioma);
  if(isAPI(req)){//Si venimos de una petición web, usamos la página de error para mostrar el error
    res.json({'Error': error.message});
    return;
  }
  res.render('error', { title: 'NodePop!', cabecera: 'Error', mensaje: error.message});
};


//Funcion que comprueba si la petición viene del API o de la web
function isAPI(req){
  return req.originalUrl.indexOf('/api') === 0;
}