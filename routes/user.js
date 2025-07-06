const express = require('express');
const router = express.Router();
const loginDao = require('./dao/loginDao');
const loginService = require('../services/loginService'); // 假设你有一个 loginService 来处理业务逻辑
const { checkJWTMiddleware } = require('../middleware/auth'); // 假设你有 JWT 认证中间件

// 假设你有 JWT 中间件，解析 req.user.id
router.get('/current', checkJWTMiddleware, async (req, res) => { // 建议添加 JWT 中间件
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

// {{ edit_2 }}
// 新增：更新用户信息路由
router.put('/', checkJWTMiddleware, async (req, res) => { // 建议添加 JWT 中间件
  try {
    const userId = req.user ? req.user.id : 1; // 从 JWT 获取用户ID
    const userData = req.body; // 获取请求体中的更新数据

    // 调用服务层来处理更新逻辑
    const response = await loginService.updateUserInfo(userId, userData);
    res.status(response.code).json(response);
  } catch (err) {
    console.error('更新用户信息路由错误:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

module.exports = router;
