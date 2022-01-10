const { Kafka } = require('kafkajs');
const Mailer = require('../Mails/mailer');
const Client = require('../models/Client');
const Producer = require('./Producer');
class Consumer {
  constructor() {
    const kafka = new Kafka({
      brokers: ['0.0.0.0:9092'],
    });
    this.consumer = kafka.consumer({ groupId: 'test-group' });
  }

  async consume(topic) {
    let mail = new Mailer();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        switch (topic) {
          case 'new-client':
            const mail = new Mailer();
            var client = JSON.parse(message.value);

            if (
              await Client.findOne({ where: { cpf_number: client.cpf_number } })
            )
              return res.status(400).send({ error: 'CPF Already in use' });

            if (client.average_salary < 500) {
              mail.newClient(client, 'denied');
              return {
                Message:
                  'Your solicitation have been denied, you do not have enough salary to be a client',
              };
            }
            try {
              const newClient = await Client.create({
                full_name: client.full_name,
                email: client.email,
                phone: client.phone,
                cpf_number: client.cpf_number,
                address: client.address,
                city: client.city,
                state: client.state,
                zipcode: client.zipcode,
                current_balance: client.current_balance,
                average_salary: client.average_salary,
                status: 'Approved',
              });
              const producer = new Producer();
              producer.produce('client-status', {
                approved: true,
              });
              mail.newClient(client, newClient.status);
              return newClient;
            } catch (error) {
              return error.detail;
            }
        }
      },
    });
  }
}

module.exports = Consumer;
