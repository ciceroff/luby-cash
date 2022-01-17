/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.post('/login','AuthController.login')
Route.post('/users', 'UsersController.store')

Route.group(() => {
    // CLIENTS
    Route.post('/clients', 'ClientsController.store')
    Route.get('/clients', 'ClientsController.index').middleware('admin')
    // USER
    Route.get('/users', 'UsersController.index').middleware('admin')
    Route.get('/users/:id','UsersController.show')
    Route.put('users/:id', 'UsersController.update')
    Route.delete('users/:id', 'UsersController.destroy')
    
    // PROFILE
    Route.post('/profiles', 'UserRolesController.store').middleware('admin')
    
    // TRANSACTIONS
    Route.post('/transactions', 'TransactionsController.store')
    Route.get('/transactions/:id', 'TransactionsController.index')
}).middleware('auth')
