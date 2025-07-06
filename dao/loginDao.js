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

// 移除原有的 getUserByDeviceId 方法，因为我们将重用 getUserByOpenid

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
      user.deviceId || null, // 将 user.deviceId 插入到 openid 字段
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
