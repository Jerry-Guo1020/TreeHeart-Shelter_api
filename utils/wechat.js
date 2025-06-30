// 用微信小程序的 code 换 openid
const axios = require('axios');
const { appid, secret } = require('../utils/server_config').wx;

exports.getOpenidByCode = async (code) => {
  // 官方API: https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
  try {
    const res = await axios.get(url);
    if (res.data && res.data.openid) {
      return res.data.openid;
    }
    return null;
  } catch (err) {
    return null;
  }
  // return 'test_openid_123456';
};
