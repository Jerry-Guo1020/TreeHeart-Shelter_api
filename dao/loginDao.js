const mysql = require('../db/mysql57');

exports.getUserByOpenid = async (openid) => {
  try {
    console.log('准备查用户', openid);
    const sql = 'SELECT * FROM User WHERE openid = ? LIMIT 1';
    const users = await mysql.sqlExec(sql, [openid]);
    console.log('查用户结束', users);
    return users[0];
  } catch (err) {
    console.error('loginDao.getUserByOpenid 错误:', err);
    throw err;
  }
};

exports.addUser = async (user) => {
  try {
    console.log('准备注册新用户', user);
    const sql = `
      INSERT INTO User (userTypeId, openid, nickname, avatar, sex)
      VALUES (?, ?, ?, ?, ?)`;
    const data = [user.userTypeId, user.openid, user.nickname, user.avatar, user.sex];
    const result = await mysql.sqlExec(sql, data);
    console.log('注册新用户结果', result);
    return result.insertId || (result[0] && result[0].insertId);
  } catch (err) {
    console.error('loginDao.addUser 错误:', err);
    throw err;
  }
};
