const express = require('express');
const router = express.Router();
const loginDao = require('./dao/loginDao');

// 假设你有 JWT 中间件，解析 req.user.id
router.get('/current', async (req, res) => {
  try {
    // 生产环境应从认证中间件获取用户ID
    const userId = req.user ? req.user.id : 1; // 开发阶段可用1
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
