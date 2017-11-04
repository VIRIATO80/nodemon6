'use strict';

const connectionPromise = require('./queueConnection');
const Jimp = require('jimp'); //Comprime fotos

const q = 'createThumbnail';

// Recolecta las rutas de las nuevas imágenes y crea sus miniatura
(async () => {

  // nos aseguramos de que está conectado
  const conn = await connectionPromise;

  // conectarnos a un canal
  const ch = await conn.createChannel();

  // conecto a una cola
  await ch.assertQueue(q);
  
  // le decimos a rabbitMQ
  // cuantos mensaje puede darme 
  // en paralelo
  ch.prefetch(1);
  await ch.consume(q, function(msg) {
    

    // procesamos el mensaje   
    const rutaImagen = JSON.parse(msg.content);
    //Extraemos nombre de imagen y extensión
    let splitImagen = rutaImagen.ruta.split('/');
    const nombre = splitImagen[splitImagen.length-1].split('.')[0] + '_thumb';
    const extension = splitImagen[splitImagen.length-1].split('.')[1];
    // abrimos la imagen
    Jimp.read(`..${rutaImagen.ruta}`, function (err, imagen) {
        if (err) {
            console.log(err);
        };
        imagen.resize(100, 100)// resize 
        .write(`../public/images/thumbnails/${nombre}.${extension}`); // guardar en carpeta
    });

    // confirmamos a rabbit que está procesado
    ch.ack(msg);   
  })

})().catch(err => console.error(err));
