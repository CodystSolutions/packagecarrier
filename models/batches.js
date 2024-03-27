'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class batches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  batches.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    count: DataTypes.INTEGER,
    source: DataTypes.STRING,
    destination: DataTypes.STRING,
    current_location: DataTypes.STRING,
    code: DataTypes.STRING,
    details: DataTypes.JSONB,
    notes: DataTypes.TEXT,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'batches',
    timestamps: false,
    indexes: [
      {
        name: "batches_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return batches;
};