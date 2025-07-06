const loginDao = require('../dao/loginDao');
// const { getOpenidByCode } = require('../utils/wechat'); // 不再需要微信登录，可以注释或删除
const { signJwtToken } = require('../utils/jwt');
const { generateRandomName, generateRandomAvatar } = require('../utils/randomData');
const Response = require('../entity/http/Response');
const { v4: uuidv4 } = require('uuid'); // 引入 uuid 库

// 移除 wechatLogin 方法，因为不再需要微信登录检测

// 游客登录逻辑 (现在用于设备ID登录，重用 openid 字段)
exports.guestLogin = async (userData) => {
  console.log('【loginService】进入 guestLogin 方法');
  const response = new Response();
  try {
    let { deviceId, nickname, avatar } = userData; // deviceId 现在是输入参数

    let user = null;
    if (deviceId) {
      // 如果前端提供了 deviceId，尝试通过 loginDao.getUserByOpenid 查询用户
      // 这里的 openid 字段实际上存储的是 deviceId
      user = await loginDao.getUserByOpenid(deviceId);
      console.log('【loginService】通过 deviceId (使用 openid 字段) 查询用户结果:', user ? '已存在' : '不存在');
    }

    if (!user) {
      // 如果没有提供 deviceId，或者通过 deviceId 没有找到用户，则认为是新设备/新用户
      if (!deviceId) {
        // 如果前端没有提供 deviceId，则后端生成一个新的 deviceId
        deviceId = uuidv4();
        console.log('【loginService】生成新的 deviceId:', deviceId);
      }
      // 如果没有提供昵称和头像，则生成随机的
      nickname = nickname || generateRandomName();
      avatar = avatar || generateRandomAvatar();

      const newUser = {
        deviceId: deviceId, // 这个 deviceId 将被插入到 User 表的 openid 字段
        nickname: nickname,
        avatar: avatar,
        userTypeId: 2, // 普通用户
        username: nickname, // 默认用户名同昵称
        sex: '男', // 默认值
        isNewUser: 1 // 标记为新用户
      };
      console.log('【loginService】准备创建新用户:', newUser);
      const newUserId = await loginDao.addUser(newUser);
      user = await loginDao.getUserById(newUserId); // 重新查询新创建的用户信息
      console.log('【loginService】新用户创建成功，ID:', newUserId);
    } else {
      console.log('【loginService】用户已存在，直接登录');
      // 如果用户已存在，可以根据需要更新其昵称、头像等信息
    }

    // 生成 JWT token，包含 uid 和 deviceId (从 user.openid 中获取，因为它是 deviceId)
    const token = signJwtToken({ uid: user.id, deviceId: user.openid, nickname: user.nickname });
    console.log('【loginService】生成 token 成功');

    return response.ok({
      token,
      user: {
        id: user.id,
        deviceId: user.openid, // 返回 deviceId 给前端，从 user.openid 中获取
        nickname: user.nickname,
        avatar: user.avatar,
        sex: user.sex,
        grade: user.grade,
        college: user.college,
        subCollege: user.subCollege,
        major: user.major,
        isNewUser: user.isNewUser,
        createTime: user.createTime
      }
    });
  } catch (err) {
    console.error('【loginService】guestLogin 错误:', err);
    return response.fail(500, "登录失败");
  }
};