const jwt = require('jsonwebtoken');
const SECRET = '你的自定义密钥';

exports.signJwtToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};
