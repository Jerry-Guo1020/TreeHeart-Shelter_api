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

// 获取当前用户信息
// 假设此路由文件在主应用中被 app.use('/api/user', router) 挂载
// 因此这里的路径直接是 '/current'
router.get('/current', async (req, res) => { // <-- 将 '/user/current' 改为 '/current'
  try {
    // 假设你通过 JWT token 获取用户ID，或者从 session 中获取
    // 这里需要根据你的认证机制来获取用户ID
    // 例如，如果使用 JWT 中间件，用户ID可能在 req.user.id 或 req.auth.id
    const userId = req.user ? req.user.id : null; // 示例：如果使用 JWT，req.user 会被中间件填充

    if (!userId) {
      return res.status(401).json({ code: 401, msg: '未授权或用户ID缺失' });
    }

    const user = await loginService.getUserById(userId); // 调用 loginService 中的方法
    if (user) {
      res.json({ code: 200, msg: '获取用户信息成功', data: user });
    } else {
      res.status(404).json({ code: 404, msg: '用户不存在' });
    }
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

module.exports = router;
