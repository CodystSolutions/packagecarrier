'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class branches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  branches.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    address: DataTypes.JSONB,
    notes: DataTypes.TEXT,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'branches',
    timestamps: false,
    indexes: [
      {
        name: "branches_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return branches;
};