const loginDao = require('../dao/loginDao');
// const { getOpenidByCode } = require('../utils/wechat'); // 如果不再使用微信登录，可以移除此行
const { signJwtToken } = require('../utils/jwt');

// {{ edit_1 }}
// 游客登录逻辑
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

// 原有的 wechatLogin 如果不再使用，可以删除或注释掉
exports.wechatLogin = async (wxLogin) => {
  try {
    const { code, userInfo } = wxLogin;
    // const openid = await getOpenidByCode(code); // 如果移除了 getOpenidByCode，这里会报错
    // if (!openid) {
    //   return { code: 400, msg: "获取openid失败", data: null };
    // }

    // let user = await loginDao.getUserByOpenid(openid);

    // if (!user) {
    //   const newUser = {
    //     openid,
    //     nickname: userInfo.nickName,
    //     avatar: userInfo.avatarUrl,
    //     sex: userInfo.gender || null,
    //     userTypeId: 2, // 普通用户
    //   };
    //   await loginDao.addUser(newUser);
    //   user = await loginDao.getUserByOpenid(openid);
    // }

    // const token = signJwtToken({ uid: user.id, openid: user.openid });

    return {
      code: 501, // 假设不再支持微信登录，返回一个未实现的状态码
      msg: "微信登录功能已禁用",
      data: null
    };
  } catch (err) {
    console.error('loginService.wechatLogin错误:', err);
    return { code: 500, msg: "微信登录失败", data: null };
  }
};