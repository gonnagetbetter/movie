import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';
import { Actor } from './actor.model';

export class Movie extends Model {}

Movie.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    year: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      unsigned: true,
      validate: {
        isValidYearRange(value) {
          const FIRST_PUBLISHED_FILM_YEAR = 1888;
          if (
            value < FIRST_PUBLISHED_FILM_YEAR ||
            value > new Date().getFullYear()
          ) {
            throw new Error(
              'Year must be between ' +
                FIRST_PUBLISHED_FILM_YEAR +
                ' and the current year',
            );
          }
        },
      },
    },
    format: {
      type: DataTypes.ENUM('VHS', 'DVD', 'Blu-ray', 'Digital'),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'Movie' },
);

Movie.belongsToMany(Actor, { through: 'ActorMovies' });
