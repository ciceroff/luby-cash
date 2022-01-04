import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract){
    return User.all()
  }

  public async store({request}: HttpContextContract){
    const { cpfNumber, email, password } = request.body()
    try {
      const user = User.create({
        email,
        cpfNumber,
        password
      })
      return user
    } catch (error) {
      return error.detail
    }
  }

  public async show({request, response}: HttpContextContract){
    const { id } = request.params()

    const user = await User.findBy('id', id)
    
    if(!user)
      return response.badRequest({'message':'There is no user with this ID!'})

    return user
  }

  public async update({request, response, auth}: HttpContextContract){
    const {id} = request.params()
    const {cpfNumber, email, password} = request.body()
    const user = await User.findBy('id', id)
    const userId = auth.use('api').user?.id
    const role = await Role.findByOrFail('role_name', 'admin')

    if(!user)
      return response.badRequest({'message':'There is no user with this ID!'})

    if(userId && role){
      const check = await Database.from('user_roles').where('user_id', userId).where('role_id', role.id)
      if(check.length > 0 || id === userId){
        try {
          
          user.cpfNumber = cpfNumber
          user.email = email
          user.password = password
          user.save()
          return user

        } catch (error) {
          return error.detail
        }
      }else{
        return response.status(405).json({'message': 'Only the admin or the user himself have access to this method'})
      }
    }
  }

  public async destroy({request, response, auth}: HttpContextContract){
    const userId = auth.use('api').user?.id
    const role = await Role.findByOrFail('role_name', 'admin')
    if(userId && role){
      const check = await Database.from('user_roles').where('user_id', userId).where('role_id', role.id)
      const {id} = request.params()
      const user = await User.findBy('id', id)

      if(!user)
        return response.badRequest({'message':'There is no user with this ID!'})
      
      if(check.length > 0 || id === userId){
        user.delete()
        return {message: "User succesfully deleted"}
      }else{
        return response.status(405).json({'message':'Only the admin or the user himself have access to this method'})
      }
    }
  }
}
