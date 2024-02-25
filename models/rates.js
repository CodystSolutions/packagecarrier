'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rates.init({
    weight: DataTypes.DOUBLE,
    rate: DataTypes.DOUBLE,
    branch: DataTypes.STRING,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'rates',
    timestamps: false,
    indexes: [
      {
        name: "rates_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return rates;
};