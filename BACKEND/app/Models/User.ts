import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, ManyToMany, manyToMany, hasMany, HasMany, } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import  Hash  from '@ioc:Adonis/Core/Hash'
import Transaction from './Transaction'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cpfNumber: string
  
  @column()
  public email: string

  @column()
  public password: string

  @column()
  public isAproved: boolean | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public token: string | null

  @column.dateTime({})
  public tokenCreatedAt: DateTime | null
  
  @manyToMany(()=> Role, {
    pivotTimestamps: true, 
    pivotTable: 'user_roles'
  })
  public roles: ManyToMany<typeof Role>

  @hasMany(() => Transaction, {
  })
  public transactions: HasMany<typeof Transaction>

  @beforeSave()
  public static async hashPassword(user: User){
    if(user.$dirty.password){
      user.password = await Hash.make(user.password)
    }
  }
}
