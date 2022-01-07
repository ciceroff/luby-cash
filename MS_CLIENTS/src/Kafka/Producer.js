const { Kafka } = require('kafkajs');

class Producer {
  constructor() {
    const kafka = new Kafka({
      brokers: ['0.0.0.0:9092'],
    });
    this.producer = kafka.producer();
  }

  async produce(topic, value) {
    await this.producer.connect();
    await this.producer.send({
      topic: topic,
      messages: [
        {
          value: JSON.stringify(value),
        },
      ],
    });
  }
}
