const express = require('express');
const ClientController = require('./controllers/ClientController');
const routes = express.Router();

routes.get('/clients', ClientController.index);
routes.delete('/clients', ClientController.destroy);
routes.put('/clients', ClientController.update);

module.exports = routes;
