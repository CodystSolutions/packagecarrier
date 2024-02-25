'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transactions.init({
    user_id: DataTypes.BIGINT,
    paymentmethod: DataTypes.STRING,
    reference: DataTypes.STRING,
    type: DataTypes.STRING,
    cclast4: DataTypes.STRING,
    cctype: DataTypes.STRING,
    tendered: DataTypes.DOUBLE,
    change: DataTypes.DOUBLE,
    total: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    order_number: DataTypes.STRING,
    package_ids: DataTypes.ARRAY(DataTypes.STRING),
    details: DataTypes.JSONB,
    notes: DataTypes.TEXT,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'transactions',
    timestamps: false,
    indexes: [
      {
        name: "transactions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return transactions;
};