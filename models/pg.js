const { Pool } = require("pg");

const db = new Pool({
  host: "localhost",
  user: "rishad",
  port: 5432,
  password: "pass123",
  database: "posdb",
});

module.exports = db;
