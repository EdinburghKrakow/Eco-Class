import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'EcoTaste',
  password: '123126',
  port: 5432,
});

pool.on('error', (err) => {
  console.error('Ошибка подключения к базе данных:', err);
});

export default pool;
