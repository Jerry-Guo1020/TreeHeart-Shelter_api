const jwt = require('jsonwebtoken');
const SECRET = 'TreeHeartSecret';

exports.signJwtToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};
