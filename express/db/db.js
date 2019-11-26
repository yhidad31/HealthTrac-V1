const { Pool } = require('pg');

const databaseUrl = process.env.POSTGRES_URI;
if( !databaseUrl ) throw "POSTGRES_URI env variable not found";

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: true
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  connect: (err, client, done) => {
    return pool.connect(err, client, done);
  }
}