import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { Movie } from './movie.model';

export class Actor extends Model {}

Actor.init(
  {
    name: DataTypes.STRING(20),
  },
  { sequelize, modelName: 'actor' },
);

Actor.belongsToMany(Movie, { through: 'ActorMovies' });
