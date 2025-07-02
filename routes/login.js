const express = require('express');
const router = express.Router();
const loginService = require('../services/loginService');

router.post('/wechat-login', async (req, res) => {
  try {
    const result = await loginService.wechatLogin(req.body);
    res.status(result.code).json(result);
  } catch (err) {
    console.error('微信登录异常:', err);
    res.status(500).json({ code: 500, msg: '微信登录失败', data: null });
  }
});

module.exports = router;