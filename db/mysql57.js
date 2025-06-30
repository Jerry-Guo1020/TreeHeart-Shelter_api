const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);

async function sqlExec(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (err) {
    console.error('SQL执行错误:', err);
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = { sqlExec };
