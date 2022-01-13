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
      const api = await axios({
        url: `http://172.17.0.1:3000/pix`,
        method: 'post',
        data: {
          recipient: recipient.cpfNumber,
          sender: sender.cpfNumber,
          value: value
        }
      })

      if(api.status == 200){
        console.log('oi')
        try{
          const transaction = await Transaction.create({
            cpfRecipient: cpf_recipient,
            cpfSender: sender.cpfNumber,
            value
          })
          return transaction
        }catch(error){
          return error.detail
        }
      }else{
        return response.status(api.status).json(api.data)
      }
      

    }
  }
}
