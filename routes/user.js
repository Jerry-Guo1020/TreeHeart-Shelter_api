const express = require('express');
const router = express.Router();
const loginDao = require('../dao/loginDao');

router.get('/current', async (req, res) => {
  try {
    // 这里示例用固定用户ID，生产环境应从认证中间件获取用户ID
    const userId = 1;
    const user = await loginDao.getUserById(userId);
    if (!user) {
      return res.status(404).json({ code: 404, msg: '用户不存在' });
    }
    res.json({ code: 200, data: user });
  } catch (err) {
    res.status(500).json({ code: 500, msg: '服务器错误' });
  }
});

module.exports = router;
