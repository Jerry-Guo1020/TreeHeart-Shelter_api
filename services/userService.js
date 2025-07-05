const express = require('express');
const router = express.Router();
const userService = require('../services/userService'); // 确保引入 userService

// 用户注册接口
router.post('/register', async (req, res) => {
  const { openid, nickname, avatar, sex, grade, college, subCollege, major } = req.body;
  try {
    const result = await userService.registerUser(openid, nickname, avatar, sex, grade, college, subCollege, major);
    if (result.success) {
      res.json({ code: 200, msg: '注册成功', data: result.data });
    } else {
      res.status(400).json({ code: 400, msg: result.msg });
    }
  } catch (err) {
    console.error('注册失败:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// 用户登录接口 (微信登录)
router.post('/login', async (req, res) => {
  const { openid } = req.body;
  try {
    const result = await userService.loginUser(openid);
    if (result.success) {
      res.json({ code: 200, msg: '登录成功', data: result.data });
    } else {
      res.status(404).json({ code: 404, msg: result.msg });
    }
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// 游客登录接口 (新增)
router.post('/guest-login', async (req, res) => {
  try {
    const result = await userService.guestLogin(); // 调用游客登录服务
    if (result.success) {
      res.json({ code: 200, msg: '游客登录成功', data: result.data });
    } else {
      res.status(500).json({ code: 500, msg: result.msg || '游客登录失败' });
    }
  } catch (err) {
    console.error('游客登录失败:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// 获取用户信息接口
router.get('/info/:uid', async (req, res) => {
  const uid = req.params.uid;
  try {
    const result = await userService.getUserInfo(uid);
    if (result.success) {
      res.json({ code: 200, msg: '获取用户信息成功', data: result.data });
    } else {
      res.status(404).json({ code: 404, msg: result.msg });
    }
  } catch (err) {
    console.error('获取用户信息失败:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// 更新用户信息接口
router.put('/update/:uid', async (req, res) => {
  const uid = req.params.uid;
  const { nickname, avatar, sex, grade, college, subCollege, major } = req.body;
  try {
    const result = await userService.updateUserInfo(uid, nickname, avatar, sex, grade, college, subCollege, major);
    if (result.success) {
      res.json({ code: 200, msg: '用户信息更新成功' });
    } else {
      res.status(400).json({ code: 400, msg: result.msg });
    }
  } catch (err) {
    console.error('更新用户信息失败:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

module.exports = router;