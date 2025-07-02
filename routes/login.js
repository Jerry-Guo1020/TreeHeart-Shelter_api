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
  res.json({
    code: 200,
    msg: '游客登录成功',
    data: {
      token: 'guest-token-' + Date.now(),
      user: {
        id: 0,
        nickname: '游客',
        avatar: '', // 可以给个默认头像链接
      }
    }
  });
});

module.exports = router;
