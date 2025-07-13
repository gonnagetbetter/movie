import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password_salt: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'user' },
);
