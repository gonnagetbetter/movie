import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Actor extends Model {}

Actor.init(
  {
    name: DataTypes.STRING(20),
  },
  { sequelize, modelName: 'actor' },
);
