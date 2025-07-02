const express = require('express');
const router = express.Router();
const loginService = require('../services/loginService');

// 微信登录
router.post('/wechat-login', async (req, res) => {
  try {
    const result = await loginService.wechatLogin(req.body);
    res.status(result.code).json(result);
  } catch (err) {
    console.error('微信登录异常:', err);
    res.status(500).json({ code: 500, msg: '微信登录失败', data: null });
  }
});

// 游客登录
router.post('/guest-login', async (req, res) => {
  try {
    // {{ edit_1 }}
    const result = await loginService.guestLogin(req.body); // 调用 loginService 中的 guestLogin 方法
    res.status(result.code).json(result);
  } catch (err) {
    console.error('游客登录异常:', err);
    res.status(500).json({ code: 500, msg: '游客登录失败', data: null });
  }
});

module.exports = router;
