const loginDao = require('../dao/loginDao');
const { getOpenidByCode } = require('../utils/wechat');
const { signJwtToken } = require('../utils/jwt');
const Response = require('../entity/http/Response');

exports.wechatLogin = async (wxLogin) => {
  // 1. 用 code 换取 openid
  const { code, userInfo } = wxLogin;
  const openid = await getOpenidByCode(code); // 实现见下文
  if (!openid) {
    return (new Response()).fail(400, "获取openid失败");
  }

  // 2. 查找用户是否已存在
  let user = await loginDao.getUserByOpenid(openid);

  // 3. 未注册则自动注册
  if (!user) {
    const newUser = {
      openid,
      nickname: userInfo.nickName,
      avatar: userInfo.avatarUrl,
      sex: userInfo.gender === 1 ? '男' : (userInfo.gender === 2 ? '女' : null),
      userTypeId: 2, // 2 表示普通用户
    };
    const uid = await loginDao.addUser(newUser);
    user = await loginDao.getUserByOpenid(openid);
  }

  // 4. 生成token
  const token = signJwtToken({ uid: user.id, openid: user.openid });

  // 5. 返回用户信息和token
  return (new Response()).ok({
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
};
