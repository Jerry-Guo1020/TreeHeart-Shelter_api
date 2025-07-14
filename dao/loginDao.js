const mysql = require('../db/mysql57');

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



// 修改：getUserByOpenid 现在用于根据 deviceId 查询用户 (重用 openid 字段)
exports.getUserByOpenid = async (deviceId) => { // 参数名改为 deviceId 更清晰
  try {
    console.log('【loginDao】根据 deviceId 查询用户 (使用 openid 字段):', deviceId);
    const sql = 'SELECT * FROM User WHERE openid = ? LIMIT 1'; // 查询 openid 字段
    const users = await mysql.sqlExec(sql, [deviceId]);
    console.log('【loginDao】根据 deviceId 查询结果:', users);
    return users.length > 0 ? users[0] : null;
  } catch (err) {
    console.error('loginDao.getUserByOpenid (as deviceId lookup) 错误:', err);
    throw err;
  }
};

// 修改：addUser 方法将 deviceId 插入到 openid 字段
exports.addUser = async (user) => {
  try {
    console.log('【loginDao】准备注册新用户:', user);
    const sql = `
      INSERT INTO User (userTypeId, openid, nickname, avatar, username, sex, isNewUser)
      VALUES (?, ?, ?, ?, ?, ?, ?)`; // 移除 deviceId 字段，因为我们用 openid 存储
    const data = [
      user.userTypeId,
      user.openid, // <--- 修正：直接使用 user.openid
      user.nickname,
      user.avatar,
      user.username,
      user.sex,
      user.isNewUser
    ];
    const result = await mysql.sqlExec(sql, data);
    return result.insertId;
  } catch (err) {
    console.error('loginDao.addUser 错误:', err);
    throw err;
  }
};

/**
 * 更新用户信息
 * @param {number} userId 用户ID
 * @param {object} userData 包含要更新的用户信息的对象
 */
async function updateUser(userId, userData) {
  let sql = 'UPDATE User SET ';
  const params = [];
  const updates = [];

  for (const key in userData) {
    if (userData.hasOwnProperty(key)) {
      updates.push(`${key} = ?`);
      params.push(userData[key]);
    }
  }

  if (updates.length === 0) {
    return { affectedRows: 0 }; // 没有要更新的数据
  }

  sql += updates.join(', ') + ' WHERE id = ?';
  params.push(userId);

  const result = await mysql.sqlExec(sql, params); // 将 sqlExec 改为 mysql.sqlExec
  return result; // 返回数据库操作结果，例如 { affectedRows: 1 }
}

module.exports = {
  getUserByNickname: exports.getUserByNickname,
  getUserById: exports.getUserById,
  getUserByOpenid: exports.getUserByOpenid,
  addUser: exports.addUser,
  updateUser: updateUser, // 确保 updateUser 也被导出
};
