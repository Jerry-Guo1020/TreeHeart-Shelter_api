const express = require('express');
const router = express.Router();
const loginService = require('../services/loginService');
const Response = require('../entity/http/Response'); // 确保引入 Response

// 移除 /wechat-login 路由，因为不再需要微信登录

// 游客登录接口 (现在用于设备ID登录)
router.post('/register', async (req, res) => {
  try {
    const result = await loginService.register();
    res.status(result.code).json(result);
  } catch (err) {
    console.error('游客登录接口错误:', err);
    res.status(500).json((new Response()).fail("服务器内部错误"));
  }
});

module.exports = router;
