// 用微信小程序的 code 换 openid
const axios = require('axios');
const { appid, secret } = require('../utils/server_config').wx;

// 本地mock，直接返回固定openid（用于apifox本地联调）
exports.getOpenidByCode = async (code) => {
  if (code === 'test_code_from_miniprogram') { // 如果传入这个 code，会直接返回一个固定的 openid
    console.log('Mocking openid for test code');
    return 'test_openid_123456'; // 这是一个有效值，不会触发 !openid
  }
  console.log('【Mock模式】getOpenidByCode called, code:', code);
  if (code === 'fail') return null;
  return 'test_openid_123456';
};

// ====== 微信真机调试，请用下面这段，取消注释即可 ======
// const axios = require('axios');
// const { appid, secret } = require('../utils/server_config').wx;

// exports.getOpenidByCode = async (code) => {
//   const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
//   try {
//     const res = await axios.get(url);
//     console.log('【微信服务器模式】返回:', res.data);
//     if (res.data && res.data.openid) {
//       return res.data.openid;
//     }
//     return null;
//   } catch (err) {
//     console.error('getOpenidByCode微信API请求错误:', err);
//     return null;
//   }
// };
