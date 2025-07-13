import { Sequelize } from 'sequelize';
import { DB_DIALECT, DB_HOST } from './config.js';

export const sequelize = new Sequelize({
  dialect: DB_DIALECT,
  host: DB_HOST,
});

export const connectDB = async () => {
  await sequelize.sync({ force: true });

  await sequelize.authenticate();
  console.log('Connected to DB');
};
