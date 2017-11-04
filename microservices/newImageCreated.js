'use strict';

const connectionPromise = require('./queueConnection');

const q = 'createThumbnail';

// Publicador
module.exports=async function (rutaImagen) {
    // nos aseguramos de que está conectado
    const conn = await connectionPromise;

    // conectarnos a un canal
    const ch = await conn.createChannel();

    // conecto a una cola
    await ch.assertQueue(q, {
        durable: true // sobrevive a reinicios
    });

    const mensaje = {
        ruta: rutaImagen
    };

    // mandar mensaje
    const res = ch.sendToQueue(q, new Buffer(JSON.stringify(mensaje)), {
        persistent: true // para sobrevivir a reinicios
    });    
    return;
};
