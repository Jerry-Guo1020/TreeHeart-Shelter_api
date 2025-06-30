const mysql = require('../db/mysql57');

// 用openid查找用户
exports.getUserByOpenid = async (openid) => {
  const sql = 'SELECT * FROM User WHERE openid = ? LIMIT 1';
  const users = await mysql.sqlExec(sql, [openid]);
  return users[0];
};

// 注册新用户
exports.addUser = async (user) => {
  const sql = `
    INSERT INTO User (userTypeId, openid, nickname, avatar, sex)
    VALUES (?, ?, ?, ?, ?)`;
  const data = [user.userTypeId, user.openid, user.nickname, user.avatar, user.sex];
  const result = await mysql.sqlExec(sql, data);
  return result.insertId;
};
