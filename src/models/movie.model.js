import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Movie extends Model {}

Movie.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notOnlyWhitespace(value) {
          if (value.trim().length === 0) {
            throw new Error(
              'Title cannot consist only of whitespace characters',
            );
          }
        },
      },
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['VHS', 'DVD', 'Blu-Ray', 'Digital']],
          msg: 'Format must be one of: VHS, DVD, Blu-ray, Digital',
        },
      },
    },
  },
  { sequelize, modelName: 'Movie' },
);
