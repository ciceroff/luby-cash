const express = require('express');
const ClientsController = require('./controllers/ClientsController');
const routes = express.Router();

routes.get('/clients', ClientsController.index);
routes.delete('/clients/:id', ClientsController.destroy);
routes.put('/clients/:id', ClientsController.update);

module.exports = routes;
