'use strict';

const amqplib = require('amqplib');

const url = process.env.AMQP_URL || 'amqp://injdyhmz:oIArfzO1HJDt2ILfEkPS447HhQa_pHfr@impala.rmq.cloudamqp.com/injdyhmz';

const connectionPromise = amqplib.connect(url)
.catch(err => {
  console.log('[queueConnection]', err);
});

module.exports = connectionPromise;