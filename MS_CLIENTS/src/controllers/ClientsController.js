const Client = require('../models/Client');
const { Op } = require('sequelize');
module.exports = {
  async index(req, res) {
    const { status, statusDate } = req.query;
    const tomorrow = new Date(statusDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    console.log(statusDate);
    if (!statusDate) return Client.findAll({ where: { status } });

    const clients = await Client.findAll({
      where: { status, created_at: { [Op.between]: [statusDate, tomorrow] } },
    });
    return res.json(clients);
  },
};
