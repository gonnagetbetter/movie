import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Actor extends Model {}

Actor.init(
  {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notOnlyWhitespace(value) {
          if (value.trim().length === 0) {
            throw new Error(
              'Actor name cannot consist only of whitespace characters',
            );
          }
        },
        isValidFormat(value) {
          if (!/^[A-Za-z\s\-\.,\']+$/.test(value)) {
            throw new Error(
              "Actor name can only contain letters and special characters like - , . '",
            );
          }
        },
      },
    },
  },
  { sequelize, modelName: 'actor' },
);
