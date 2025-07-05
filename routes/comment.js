const express = require('express');
const router = express.Router();
const commentService = require('../services/commentService');

// 假设你有一个认证中间件，将用户ID放入 req.user.id
// 例如：const authMiddleware = require('../middleware/auth');
// router.use(authMiddleware); // 如果有认证中间件，请在这里启用

// 发布评论
router.post('/add', async (req, res) => {
  const { postId, content, parentCommentId } = req.body;
  // 实际项目中，用户ID应从认证信息中获取，例如 req.user.id
  const uid = req.user ? req.user.id : 1; // 假设用户ID为1，请根据实际情况修改

  if (!postId || !content) {
    return res.status(400).json({ code: 400, msg: '缺少帖子ID或评论内容' });
  }

  try {
    const result = await commentService.createComment(postId, uid, content, parentCommentId);
    res.status(result.code).json(result);
  } catch (err) {
    console.error('发布评论失败:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// 获取评论列表
router.get('/list/:postId', async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return res.status(400).json({ code: 400, msg: '缺少帖子ID' });
  }

  try {
    const result = await commentService.getCommentsForPost(postId);
    res.status(result.code).json(result);
  } catch (err) {
    console.error('获取评论列表失败:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// 点赞/取消点赞评论
router.post('/like', async (req, res) => {
  const { commentId } = req.body;
  // 实际项目中，用户ID应从认证信息中获取，例如 req.user.id
  const uid = req.user ? req.user.id : 1; // 假设用户ID为1，请根据实际情况修改

  if (!commentId) {
    return res.status(400).json({ code: 400, msg: '缺少评论ID' });
  }

  try {
    const result = await commentService.toggleCommentLike(commentId, uid);
    res.status(result.code).json(result);
  } catch (err) {
    console.error('点赞评论失败:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

module.exports = router;