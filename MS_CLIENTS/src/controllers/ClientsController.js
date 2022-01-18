const Client = require('../models/Client');
const { Op } = require('sequelize');
module.exports = {
  async index(req, res) {
    const { status, statusDate } = req.query;

    if (status == 'undefined') {
      const clients = await Client.findAll();
      return res.json(clients);
    }
    if (statusDate == 'undefined') {
      const clients = await Client.findAll({ where: { status } });
      return res.json(clients);
    }

    const tomorrow = new Date(statusDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const clients = await Client.findAll({
      where: { status, created_at: { [Op.between]: [statusDate, tomorrow] } },
    });
    return res.json(clients);
  },
};
