'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class packages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      packages.belongsTo(models.users, { foreignKey: "sender_id"});
      packages.belongsTo(models.users, { foreignKey: "receiver_id"});
      packages.belongsTo(models.requests, { foreignKey: "request_id"});
      packages.belongsTo(models.batches, { foreignKey: "batch_id"});


    }
  }
  packages.init({
    sender_first_name:  DataTypes.STRING,
    sender_last_name:  DataTypes.STRING,
    sender_email:  DataTypes.STRING,
    sender_contact:  DataTypes.BIGINT,
    receiver_first_name: DataTypes.STRING,
    receiver_last_name:  DataTypes.STRING,
    receiver_email:  DataTypes.STRING,
    receiver_contact: DataTypes.BIGINT,
    sender_id: DataTypes.BIGINT,
    receiver_id: DataTypes.BIGINT,
    sender_info: DataTypes.JSONB,
    receiver_info: DataTypes.JSONB,
    request_id: DataTypes.BIGINT,
    batch_id: DataTypes.BIGINT,
    destination: DataTypes.STRING,
    source: DataTypes.STRING,
    tracking_number: DataTypes.STRING,
    code: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    method: DataTypes.STRING,
    details: DataTypes.JSONB,
    notes: DataTypes.TEXT,
    is_deleted: DataTypes.BOOLEAN,
    transaction_id: DataTypes.STRING,
    current_location: DataTypes.STRING,
    category: DataTypes.STRING, 
    actual_weight: DataTypes.DOUBLE,
    collector_first_name:  DataTypes.STRING,
    collector_last_name: DataTypes.STRING,
    collector_email:  DataTypes.STRING,
    collector_contact:  DataTypes.STRING ,
    collector_id: DataTypes.BIGINT ,
    collected_on:  DataTypes.DATE,
    collection_id: DataTypes.BIGINT


  }, {
    sequelize,
    modelName: 'packages',
    timestamps: false,
    indexes: [
      {
        name: "packages_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return packages;
};