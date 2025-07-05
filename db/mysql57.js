const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);

async function sqlExec(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (err) {
    console.error('SQL执行错误:', err.message); // 打印错误消息
    console.error('SQL查询:', sql); // 打印出错的SQL
    console.error('SQL参数:', params); // 打印出错的参数
    throw err; // 重新抛出错误，让上层捕获
  } finally {
    connection.release();
  }
}

module.exports = { sqlExec };
