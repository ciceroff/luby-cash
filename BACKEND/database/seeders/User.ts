import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    const user = await User.create({
      email: 'admin@lubycash.com',
      password: 'secret',
      cpfNumber: '044.058.034-22',
      isAproved: true
    })

    const role = await Role.create({
      roleName: 'admin'
    })

    await Role.create({
      roleName: 'client'
    })

    await user.related('roles').attach([role.id])
  }
}

