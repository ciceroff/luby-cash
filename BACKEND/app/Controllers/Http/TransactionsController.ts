import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'
import User from 'App/Models/User'

export default class ExtractsController {
  public async store({request, response}:HttpContextContract){
    const {cpf_recipient, cpf_sender, value} = request.body()
    const recipient = User.findBy('cpf_number', cpf_recipient)
    const sender = User.findBy('cpf_number', cpf_sender)

    if(!recipient || !sender){
      return response.status(400).json({Message: 'One of the CPF numbers is not registered for a user'})
    }
    if(recipient['attributes'].isAproved == true && sender['attributes'].isAproved == true ){
      try{
        const transaction = await Transaction.create({
          cpfRecipient: cpf_recipient,
          cpfSender: cpf_sender,
          value
        })
        return transaction
      }catch(error){
        return error.detail
      }
    }
  }
}
