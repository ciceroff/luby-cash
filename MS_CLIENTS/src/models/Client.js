const { Model, DataTypes } = require('sequelize');

class Client extends Model {
  static init(sequelize) {
    super.init(
      {
        full_name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        cpf_number: DataTypes.STRING,
        addres: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        zipcode: DataTypes.STRING,
        current_balance: DataTypes.STRING,
        average_salary: DataTypes.STRING,
        status: DataTypes.STRING,
      },
      {
        sequelize,
      },
    );
  }
}

module.exports = Client;
