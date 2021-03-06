import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'
import User from 'App/Models/User'
import axios from 'axios';
export default class ExtractsController {
  public async store({request, response, auth}:HttpContextContract){
    const {cpf_recipient, value} = request.body()
    const recipient = await User.findBy('cpf_number', cpf_recipient)
    const sender = auth.use('api').user
    
    if(!recipient || !sender){
      return response.status(400).json({Message: 'One of the CPF numbers is not registered for a user'})
    }
    
    if(recipient['$attributes'].isAproved == true && sender['$attributes'].isAproved == true ){
      await axios({
        url: `http://172.17.0.1:3000/pix`,
        method: 'post',
        data: {
          recipient: recipient.cpfNumber,
          sender: sender.cpfNumber,
          value: value
        }
      }).then(async () => {
        try{
          const transaction = await Transaction.create({
            cpfRecipient: cpf_recipient,
            cpfSender: sender.cpfNumber,
            value
          })
          return response.json(transaction)
        }catch(error){
          return error.detail
        }
      }
      ).catch(
        ()=>{
          return response.status(400).json({message: 'Something went wrong, please check you current balance'})
        })

    }
  }

  public async index({request, response}: HttpContextContract){
    const { id } = request.params()
    const user = await User.findByOrFail('id', id)
    const { start, end } = request.qs()
    
    if(!user)
      return response.status(400).json({message: 'There is no user with this id!'})

    if(start && end){
      const userTransactions = await Transaction.query().select('*').where('cpf_sender', user.cpfNumber)
      .orWhere('cpf_recipient', user.cpfNumber)
      .whereBetween('created_at',[start, end])
      return response.json(userTransactions)
    }

    const userTransactions = await Transaction.query().select('*').where('cpf_sender', user.cpfNumber).orWhere('cpf_recipient', user.cpfNumber)

    return response.json(userTransactions)
  } 
}
