require('dotenv').config();

module.exports = {
  wx: {
    appid: process.env.WX_APPID || 'dummy',
    secret: process.env.WX_SECRET || 'dummy'
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }
};
