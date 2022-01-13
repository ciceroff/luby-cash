const express = require('express');
const Consumer = require('./Kafka/Consumer');
const routes = require('./routes');
require('./database');

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3000);
const consumer = new Consumer();
consumer.consume('new-client');
