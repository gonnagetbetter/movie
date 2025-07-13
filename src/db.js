import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  host: './dev.sqlite',
});

export const connectDB = async () => {
  await sequelize.sync();

  await sequelize.authenticate();
  console.log('Connected to DB'.yellow.underline);
};
