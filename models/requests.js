'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class requests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    
     requests.belongsTo(models.users, { foreignKey: "user_id"});

    }
  }
  requests.init({
    user_id: DataTypes.BIGINT,
    sender_info: DataTypes.JSONB,
    sender_first_name:  DataTypes.STRING,
    sender_last_name:  DataTypes.STRING,
    code: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    request_type: DataTypes.STRING,
    status: DataTypes.STRING,
    transaction_id: DataTypes.BIGINT,
    method: DataTypes.STRING,
    details: DataTypes.JSONB,
    notes: DataTypes.TEXT,
    is_deleted: DataTypes.BOOLEAN,
    created_on: DataTypes.DATE,
    modified_on: DataTypes.DATE,

  }, {
    sequelize,
    modelName: 'requests',
    timestamps: false,
    indexes: [
      {
        name: "requests_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return requests;
};