import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { Kafka } from 'kafkajs'
import Axios from 'axios'
export default class ClientsController {
  public async store({request, response, auth}: HttpContextContract){
    const userId = auth.use('api').user?.id
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
    } = request.body();

    const kafka = new Kafka({
      brokers: ['kafka:29092'],
    });
    if(auth.use('api').user?.isAproved == false){
      return response.status(400).json({message: 'You have already tried to become a client and you permission was denied'})
    }
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: 'new-client',
      messages: [
        {
          value: JSON.stringify({
            full_name: full_name,
            email: email,
            phone: phone,
            cpf_number: cpf_number,
            address: address,
            city: city,
            state: state,
            zipcode: zipcode,
            current_balance: current_balance,
            average_salary: average_salary
          }),
        },
      ],
    });

    const consumer = kafka.consumer({groupId: 'test-group'})
    consumer.connect()
    consumer.subscribe({topic: 'client-status', fromBeginning: true})
    await consumer.run({
      eachMessage: async ({ message}) => {
        if (message.value){
          const status = JSON.parse(message.value.toString())
          const user = await User.findByOrFail('id', userId)

          user.isAproved = status.approved
          await user.save()    
        }
      }
    })
  }

  public async index(){
    const instance = Axios.create({
      baseURL: 'localhost:3000'
    }
    )

    instance.get('/clients')
    .then((response) => { return response })
    .catch((error) => {return error.detail})
  }
}
