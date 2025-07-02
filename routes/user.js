const express = require('express');
const router = express.Router();
const userService = require('../services/userService'); // 导入 userService

// TODO: 这里需要添加一个认证中间件来获取用户ID
// 假设你有一个中间件可以从 JWT token 中解析出用户ID并挂载到 req.user.id
// 例如：const authMiddleware = require('../middleware/auth');
// router.put('/userInfo', authMiddleware, async (req, res) => { ... });

router.put('/userInfo', async (req, res) => {
  try {
    // !!! 警告：以下获取 userId 的方式仅为演示和测试方便，生产环境务必通过认证获取用户ID !!!
    // 生产环境应通过 JWT token 解析用户ID，例如：
    // const userId = req.user.id; // 假设认证中间件已将用户ID挂载到 req.user.id
    // 为了测试方便，这里暂时从请求体中获取 userId，或者假设为某个固定值
    const userId = req.body.userId || 1; // 临时方案，假设用户ID为1，或者从请求体中获取

    const userInfo = req.body; // 请求体包含要更新的用户信息，例如 { sex: '男' }

    // 移除 userId 字段，因为它不应该被更新到数据库中
    delete userInfo.userId;

    const result = await userService.updateUserInfo(userId, userInfo);
    res.status(result.code).json(result);
  } catch (err) {
    console.error('更新用户信息异常:', err);
    res.status(500).json({ code: 500, msg: '更新用户信息失败', data: null });
  }
});

module.exports = router;