require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: 'sdc', // why can't i import from .env?
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

db.connect();

db.query('SELECT NOW()')
  .then(res => console.log('Connected to DB successfully @', res.rows[0].now))
  .catch(e => console.log(e.stack));

module.exports = db;
