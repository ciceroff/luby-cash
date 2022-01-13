const express = require('express');
const ClientsController = require('./controllers/ClientsController');
const TransactionsController = require('./controllers/TransactionsController');
const routes = express.Router();

// CLIENTS
routes.get('/clients', ClientsController.index);
routes.delete('/clients/:id', ClientsController.destroy);
routes.put('/clients/:id', ClientsController.update);

// TRANSACTIONS
routes.post('/pix', TransactionsController.store);

module.exports = routes;
