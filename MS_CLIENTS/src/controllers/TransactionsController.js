const Client = require('../models/Client');

module.exports = {
  async store(req, res) {
    const { recipient, sender, value } = req.body;
    const recipientClient = await Client.findOne({
      where: { cpf_number: recipient },
    });
    const senderClient = await Client.findOne({
      where: { cpf_number: sender },
    });

    if (!recipientClient || !senderClient) {
      res
        .status(400)
        .json({ message: 'One of the CPFs owners is not a client' });
    }

    if (parseFloat(senderClient.dataValues.current_balance) < value)
      res.status(400).json({ message: 'You do not have enough money' });

    const recipientValue = parseFloat(recipientClient.current_balance) + value;

    recipientClient.current_balance = recipientValue.toString();
    const senderValue = parseFloat(senderClient.current_balance) - value;

    senderClient.current_balance = senderValue.toString();

    await recipientClient.save();
    await senderClient.save();
    res.status(200).json({ message: 'Transaction made' });
  },
};
