'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class collection_requests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  collection_requests.init({
    user_id: DataTypes.INTEGER,
    packages: DataTypes.ARRAY(DataTypes.STRING),
    method: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    transaction_id: DataTypes.INTEGER,
    code: DataTypes.STRING,
    details: DataTypes.JSONB,
    notes: DataTypes.TEXT,
    is_deleted: DataTypes.BOOLEAN,
    collector_first_name: DataTypes.STRING,
    collector_last_name: DataTypes.STRING,
    collector_email: DataTypes.STRING,
    collector_contact: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'collection_requests',
    timestamps: false,
    indexes: [
      {
        name: "collection_requests_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return collection_requests;
};