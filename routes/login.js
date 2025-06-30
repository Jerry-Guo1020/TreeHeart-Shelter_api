  const express = require('express');
  const router = express.Router();
  const loginService = require('../services/loginService');
  const Response = require('../entity/http/Response');
  const WxLogin = require('../entity/user/WxLogin');

  // 微信登录接口
  router.post('/wechat-login', async (req, res) => {
    let wxLogin = new WxLogin(req);
    let flag = wxLogin.check();
    if (!flag.success) {
      return res.status(400).json(flag);
    }
    try {
      const result = await loginService.wechatLogin(wxLogin);
      res.status(result.code).json(result);
    } catch (err) {
      res.status(500).json((new Response()).fail(500, "微信登录失败"));
    }
  });

  module.exports = router;
