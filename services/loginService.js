const loginDao = require('../dao/loginDao');
const { getOpenidByCode } = require('../utils/wechat');
const { signJwtToken } = require('../utils/jwt');

exports.wechatLogin = async (wxLogin) => {
  try {
    const { code, userInfo } = wxLogin;
    const openid = await getOpenidByCode(code);
    if (!openid) { // 只有当 openid 为 null 或 undefined 时，才会进入这里
      return { code: 400, msg: "获取openid失败", data: null };
    }

    let user = await loginDao.getUserByOpenid(openid);

    if (!user) {
      const newUser = {
        openid,
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        sex: userInfo.gender || null,
        userTypeId: 2, // 普通用户
      };
      await loginDao.addUser(newUser);
      user = await loginDao.getUserByOpenid(openid);
    }

    const token = signJwtToken({ uid: user.id, openid: user.openid });

    return {
      code: 200,
      msg: "登录成功",
      data: {
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
      }
    };
  } catch (err) {
    console.error('loginService.wechatLogin错误:', err);
    return { code: 500, msg: "微信登录失败", data: null };
  }
};