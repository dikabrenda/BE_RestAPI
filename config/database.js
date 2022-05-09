import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DATABASE,
  DB_DIALECT,
} = process.env;

const db = new Sequelize({
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  host: DB_HOST,
  dialect: DB_DIALECT,
});

export default db;
