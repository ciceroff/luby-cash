import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { Kafka } from 'kafkajs'
import axios from 'axios'
import Role from 'App/Models/Role';
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
      await producer.disconnect()
    

    await consumer.run({
      eachMessage: async ({ message}) => {
        if (message.value){
          const status = JSON.parse(message.value.toString())
       
          const user = await User.findByOrFail('id', userId)
          if (status.approved == true){
            user.isAproved = true
            const role = await Role.findByOrFail('role_name', 'client')
            await user.related('roles').attach([role.id])
            await user.save()
          }
          if (status.approved == false){
            user.isAproved = false
            await user.save()
          }
        }
      }
    })
    await consumer.disconnect()
    const api = await axios({
      url: `http://172.17.0.1:3000/clients?status=undefined&statusDate=undefined`,
      method: 'get'
    })

    if(api.status == 200){
      for(let i = 0; i < api.data.length; i++){
        if(api.data[i].cpf_number == user.cpfNumber && api.data[i].status == 'Approved'){
          const role = await Role.findByOrFail('role_name', 'client')
          await user.related('roles').attach([role.id])
          user.isAproved = true
          await user.save()
          return response.status(200).send(api.data[i])
        }
      }
      user.isAproved = false
      await user.save()
      return response.status(400).json({message: 'You do not have enough salary to become a client'})
    }
    
  }
  }

  public async index({response, request}: HttpContextContract){
    const {status, statusDate} = request.qs()
    const api = await axios({
      url: `http://172.17.0.1:3000/clients?status=${status}&statusDate=${statusDate}`,
      method: 'get',
    }
    )
    response.json(api.data)
  }
}
