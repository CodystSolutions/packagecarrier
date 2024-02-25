'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class charges extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  charges.init({
    name: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'charges',
    timestamps: false,
    indexes: [
      {
        name: "charges_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return charges;
};