const express = require('express');
const router = express.Router();
const postService = require('../services/postService');

// 创建帖子接口
router.post('/create', async (req, res) => {
  try {
    const { uid, title, content, typeName, images } = req.body;
    if (!uid || !title || !content || !typeName) {
      return res.status(400).json({ code: 400, msg: '参数缺失', data: null });
    }
    const result = await postService.createPost(uid, title, content, typeName, images || []);
    if (result.success) {
      res.json({ code: 200, msg: '发布成功', data: { postId: result.postId } });
    } else {
      res.status(500).json({ code: 500, msg: '发布失败', data: null });
    }
  } catch (err) {
    console.error('发布帖子接口错误:', err);
    res.status(500).json({ code: 500, msg: '服务器错误', data: null });
  }
});

module.exports = router;