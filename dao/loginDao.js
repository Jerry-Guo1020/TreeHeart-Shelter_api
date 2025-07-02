const mysql = require('../db/mysql57');

// {{ edit_1 }}
// 根据昵称查询用户
exports.getUserByNickname = async (nickname) => {
  try {
    console.log('【loginDao】查询 nickname:', nickname);
    const sql = 'SELECT * FROM User WHERE nickname = ? LIMIT 1';
    const users = await mysql.sqlExec(sql, [nickname]);
    console.log('【loginDao】查询 nickname 结果:', users);
    return users[0];
  } catch (err) {
    console.error('loginDao.getUserByNickname 错误:', err);
    throw err;
  }
};

// 根据用户ID查询用户
exports.getUserById = async (id) => {
  try {
    console.log('【loginDao】查询用户ID:', id);
    const sql = 'SELECT * FROM User WHERE id = ? LIMIT 1';
    const users = await mysql.sqlExec(sql, [id]);
    console.log('【loginDao】查询用户ID 结果:', users);
    return users[0];
  } catch (err) {
    console.error('loginDao.getUserById 错误:', err);
    throw err;
  }
};

// 添加新用户 (适配游客登录字段)
exports.addUser = async (user) => {
  try {
    console.log('【loginDao】准备注册新用户:', user);
    // 注意：这里根据你的 User 表结构，可能需要调整插入的字段
    // 确保 User 表有 nickname, avatar, username, sex, isNewUser 等字段
    const sql = `
      INSERT INTO User (userTypeId, nickname, avatar, username, sex, isNewUser)
      VALUES (?, ?, ?, ?, ?, ?)`;
    const data = [
      user.userTypeId,
      user.nickname,
      user.avatar,
      user.username,
      user.sex,
      user.isNewUser
    ];
    const result = await mysql.sqlExec(sql, data);
    console.log('【loginDao】注册新用户结果:', result);
    return result.insertId; // 返回新插入的ID
  } catch (err) {
    console.error('loginDao.addUser 错误:', err);
    throw err;
  }
};

// {{ edit_1 }}
// 更新用户信息
exports.updateUser = async (userId, updateFields) => {
  try {
    console.log(`【loginDao】准备更新用户ID: ${userId} 的信息:`, updateFields);
    const fields = Object.keys(updateFields);
    const values = Object.values(updateFields);

    if (fields.length === 0) {
      console.log('【loginDao】没有要更新的字段。');
      return null;
    }

    // 构建 SET 子句，例如 "sex = ?, college = ?"
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const sql = `UPDATE User SET ${setClause}, updateTime = CURRENT_TIMESTAMP WHERE id = ?`;
    const params = [...values, userId];

    const result = await mysql.sqlExec(sql, params);
    console.log('【loginDao】更新用户结果:', result);
    return result;
  } catch (err) {
    console.error('loginDao.updateUser 错误:', err);
    throw err;
  }
};

// 原有的 getUserByOpenid 如果不再使用，可以删除或注释掉
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
