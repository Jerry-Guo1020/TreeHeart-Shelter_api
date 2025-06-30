const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);

exports.sqlExec = async (sql, params) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};