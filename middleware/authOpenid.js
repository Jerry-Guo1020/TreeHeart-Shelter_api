// middleware/authOpenid.js
const mysql = require('../db/mysql57') // 改成你的 mysql 实例

module.exports = async function(req, res, next) {
  const openid = req.headers['authorization']
  if (!openid) return res.status(401).json({ code: 401, msg: '未授权' })
  // 校验用户
  const rows = await mysql.sqlExec('SELECT * FROM User WHERE openid = ?', [openid])
  if (!rows || !rows.length) return res.status(401).json({ code: 401, msg: 'openid 不存在' })
  req.user = rows[0]
  next()
}
