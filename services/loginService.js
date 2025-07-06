const loginDao = require('./dao/loginDao');
const { getOpenidByCode } = require('../utils/wechat'); // 确保这里没有被注释掉，并且指向正确的 wechat 工具
const { signJwtToken } = require('../utils/jwt');
const { generateRandomName, generateRandomAvatar } = require('../utils/randomData'); // 假设你有这些工具函数
const Response = require('../entity/http/Response'); // 引入 Response 实体类

// {{ edit_1 }}
// 微信登录逻辑
exports.wechatLogin = async (loginData) => {
  console.log('【loginService】进入 wechatLogin 方法');
  const response = new Response();
  try {
    const { code, userInfo } = loginData; // userInfo 包含昵称、头像等

    if (!code) {
      return response.fail(400, '微信登录 code 不能为空');
    }

    // 1. 使用 code 换取 openid
    const openid = await getOpenidByCode(code);
    if (!openid) {
      return response.fail(400, '获取 openid 失败，请重试');
    }
    console.log('【loginService】获取到 openid:', openid);

    // 2. 根据 openid 查询用户
    let user = await loginDao.getUserByOpenid(openid);
    console.log('【loginService】查询用户结果:', user ? '已存在' : '不存在');

    if (!user) {
      // 3. 如果用户不存在，则创建新用户
      const newUser = {
        openid: openid,
        nickname: userInfo.nickName || generateRandomName(), // 使用微信昵称，或生成随机昵称
        avatar: userInfo.avatarUrl || generateRandomAvatar(), // 使用微信头像，或生成随机头像
        userTypeId: 2, // 普通用户
        username: userInfo.nickName || generateRandomName(), // 默认用户名同昵称
        sex: userInfo.gender === 1 ? '男' : (userInfo.gender === 2 ? '女' : '未知'), // 微信性别 0:未知 1:男 2:女
        isNewUser: 1 // 标记为新用户
      };
      console.log('【loginService】准备创建新用户:', newUser);
      const newUserId = await loginDao.addUser(newUser);
      user = await loginDao.getUserById(newUserId); // 重新查询新创建的用户信息
      console.log('【loginService】新用户创建成功，ID:', newUserId);
    } else {
      console.log('【loginService】用户已存在，直接登录');
      // 如果用户已存在，可以考虑更新其昵称、头像等信息
      // 例如：await loginDao.updateUser(user.id, { nickname: userInfo.nickName, avatar: userInfo.avatarUrl });
    }

    // 4. 生成 JWT token
    const token = signJwtToken({ uid: user.id, openid: user.openid, nickname: user.nickname });
    console.log('【loginService】生成 token 成功');

    return response.ok({
      token,
      user: {
        id: user.id,
        openid: user.openid,
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
    console.error('【loginService】wechatLogin 错误:', err);
    return response.fail(500, "微信登录失败");
  }
};

// 游客登录逻辑 (保持不变，但请注意其与微信登录的区别)
exports.guestLogin = async (userData) => {
  console.log('【loginService】进入 guestLogin 方法');
  console.log('接收到的用户数据:', userData);

  try {
    const { nickname, avatar } = userData;

    // 1. 根据昵称查询用户
    let user = await loginDao.getUserByNickname(nickname);
    console.log('【loginService】查询用户结果:', user ? '已存在' : '不存在');

    if (!user) {
      // 2. 如果用户不存在，则创建新用户
      const newUser = {
        nickname,
        avatar,
        userTypeId: 2, // 普通用户
        username: nickname, // 假设 username 默认就是 nickname
        sex: '男', // 默认值，如果前端没有提供
        isNewUser: 1 // 标记为新用户
      };
      console.log('【loginService】准备创建新用户:', newUser);
      const newUserId = await loginDao.addUser(newUser);
      user = await loginDao.getUserById(newUserId); // 重新查询新创建的用户信息
      console.log('【loginService】新用户创建成功，ID:', newUserId);
    } else {
      console.log('【loginService】用户已存在，直接登录');
      // 如果用户已存在，你可能需要更新一些信息，或者直接返回
    }

    // 3. 生成 JWT token
    const token = signJwtToken({ uid: user.id, nickname: user.nickname });
    console.log('【loginService】生成 token 成功');

    return {
      code: 200,
      msg: "登录成功",
      data: {
        token,
        user: {
          id: user.id,
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
      }
    };
  } catch (err) {
    console.error('【loginService】guestLogin 错误:', err);
    return { code: 500, msg: "登录失败", data: null };
  }
};

/**
 * 根据用户ID获取用户信息
 * @param {number} id 用户ID
 * @returns {Promise<Object|null>} 用户对象或null
 */
exports.getUserById = async (id) => {
  try {
    const user = await loginDao.getUserById(id);
    // 可以在这里对用户数据进行一些处理，例如移除敏感信息
    if (user) {
      // 假设你希望返回的字段
      return {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        isNewUser: user.isNewUser,
        // ... 其他你希望返回的字段
      };
    }
    return null;
  } catch (err) {
    console.error('loginService.getUserById 错误:', err);
    throw err;
  }
};