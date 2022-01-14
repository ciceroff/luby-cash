const Client = require('../models/Client');

module.exports = {
  async index(req, res) {
    try {
      const clients = await Client.findAll();

      return res.json(clients);
    } catch (error) {
      return error.detail;
    }
  },

  async destroy(req, res) {
    const { id } = req.params;
    const destroyed = await Client.destroy({ where: { id } });

    if (destroyed) {
      return res.json({ message: `Client ${id} succesfully deleted` });
    } else {
      return res.status(400).json({ message: 'Client does not exist' });
    }
  },
  async update(req, res) {
    const { id } = req.params;
    const {
      full_name,
      email,
      phone,
      cpf_number,
      address,
      city,
      state,
      zipcode,
      current_balance,
      average_salary,
      status,
    } = req.body;

    const client = await Client.findByPk(id);
    if (!client)
      return res.status(400).json({ error: 'Client does not exist' });

    if (await Client.findOne({ where: { cpf_number } }))
      return res.status(400).json({ error: 'CPF Already in use' });

    try {
      client.full_name = full_name;
      client.email = email;
      client.phone = phone;
      client.cpf_number = cpf_number;
      client.address = address;
      client.city = city;
      client.state = state;
      client.zipcode = zipcode;
      client.current_balance = current_balance;
      client.average_salary = average_salary;
      client.status = status;
      await client.save();
    } catch (error) {
      res.status(400).json({ message: error });
    }

    return res.json(client);
  },
};
