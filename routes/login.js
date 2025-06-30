  const express = require('express');
  const router = express.Router();
  const loginService = require('../services/loginService');
  const Response = require('../entity/http/Response');
  const WxLogin = require('../entity/user/WxLogin');

  // 微信登录接口
router.post('/wechat-login', async (req, res) => {
  try {
    const result = await loginService.wechatLogin(req.body);
    res.status(result.code).json(result);
  } catch (err) {
    console.error('接口/wechat-login异常:', err);
    res.status(500).json({ code: 500, msg: "微信登录失败", data: null });
  }
});

module.exports = router;