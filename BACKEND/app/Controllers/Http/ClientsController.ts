import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { Kafka } from 'kafkajs'
import axios from 'axios'
export default class ClientsController {
  
  public async store({request, response, auth}: HttpContextContract){
    const userId = auth.use('api').user?.id
    const user = auth.use('api').user
    const {
      full_name,
      phone,
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
      return response.status(400).json({message: 'You have already tried to become a client and your permission was denied'})
    }
    if(auth.use('api').user?.isAproved == true){
      return response.status(400).json({message: 'You have already tried to become a client and your permission was accepted'})
    }
    const consumer = kafka.consumer({groupId: 'luby-cash-group'})
    consumer.connect()
    consumer.subscribe({topic: 'client-status', fromBeginning: false})

    const producer = kafka.producer();
    await producer.connect();
    if(user){
      await producer.send({
        topic: 'new-client',
        messages: [
          {
            value: JSON.stringify({
              full_name: full_name,
              email: user.email,
              phone: phone,
              cpf_number: user.cpfNumber,
              address: address,
              city: city,
              state: state,
              zipcode: zipcode,
              current_balance: current_balance,
              average_salary: average_salary
            }),
          },
        ],
      })
      producer.disconnect()
    

    await consumer.run({
      eachMessage: async ({ message}) => {
        if (message.value){
          const status = JSON.parse(message.value.toString())
          console.log(status)
          
          const user = await User.findByOrFail('id', userId)
          if (status.approved == true){
            user.isAproved = true
            await user.save()
            response.send(status.newClient)           
          }
          if (status.approved == false){
            user.isAproved = false
            await user.save()
            response.status(400).json({message: status.error.toString()})
          }

          if(status.approved == null)
            response.status(400).json({message: status.error.toString()})
          
          
        }
      }
    })
    const api = await axios({
      url: `http://172.17.0.1:3000/clients/`,
      method: 'get'
    })

    
    if(api.status == 200){
      for(let i = 0; i < api.data.length; i++){
        if(api.data[i].cpf_number == user.cpfNumber)
          return response.status(200).send(api.data[i])
      }
     
    }else{
      return response.status(400).json({message: 'You do not have enough salary to become an client'})
    }
    
  }
  }

  public async index({response}: HttpContextContract){
    const api = await axios({
      url: 'http://172.17.0.1:3000/clients',
      method: 'get',
    }
    )
    response.send(api.data)
  }
}
