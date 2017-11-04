'use strict';

const jwt = require('jsonwebtoken');

module.exports = function() { // devuelve un middleware que si no hay token responde con error
  return function(req, res, next) {
    const token = req.body.token || req.query.token || req.get('x-access-token');
    if (!token) {
      res.status(401);
      res.json({ok: false, error:'unauthorized'});
    }
    
    // tengo token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err){
        res.status(401);
        res.json({ok: false, error:'token invalid'});
      }
      next();
    });

  }
}