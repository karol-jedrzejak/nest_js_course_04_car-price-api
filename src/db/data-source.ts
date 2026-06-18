import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const dbConfig: DataSourceOptions = {
  type: 'better-sqlite3',

  database:
    process.env.NODE_ENV === 'test'
      ? 'test.sqlite'
      : 'db.sqlite',

  entities:
    process.env.NODE_ENV === 'test'
      ? ['src/**/*.entity.ts']
      : ['dist/**/*.entity.js'],

  migrations: ['migrations/*.ts'],
  synchronize: false,
};

export default new DataSource(dbConfig);