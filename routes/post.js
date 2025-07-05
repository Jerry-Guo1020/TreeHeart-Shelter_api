const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql57'); // 确保路径正确
const postService = require('../services/postService'); // 导入 postService

// 发布帖子接口
router.post('/create', async (req, res) => {
  const { uid, title, content, typeName, imgId } = req.body;

  if (!uid || !content || !typeName) {
    return res.status(400).json({ code: 400, msg: '参数缺失' });
  }

  try {
    // 查询帖子类型ID
    const typeRows = await mysql.sqlExec('SELECT id FROM PostType WHERE name = ? LIMIT 1', [typeName]);
    if (typeRows.length === 0) {
      return res.status(400).json({ code: 400, msg: '帖子类型不存在' });
    }
    const typeId = typeRows[0].id;

    // 插入帖子
    const insertSql = 'INSERT INTO Post (uid, typeId, title, content, imgId) VALUES (?, ?, ?, ?, ?)';
    const result = await mysql.sqlExec(insertSql, [uid, typeId, title || '', content, imgId || null]);

    res.json({ code: 200, msg: '发布成功', data: { postId: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, msg: '服务器错误' });
  }
});

// {{ edit_1 }}
// 获取所有帖子类型接口
router.get('/types', async (req, res) => {
  try {
    const types = await mysql.sqlExec('SELECT id, name FROM PostType');
    res.json({ code: 200, data: types, msg: '获取帖子类型成功' });
  } catch (err) {
    console.error('获取帖子类型失败:', err);
    res.status(500).json({ code: 500, msg: '获取帖子类型失败', data: null });
  }
});

// 获取帖子列表接口
router.get('/list', async (req, res) => {
  try {
    const posts = await mysql.sqlExec(`
      SELECT
          p.id,
          p.uid,
          u.nickname,
          u.avatar,
          pt.name AS typeName,
          p.title,
          p.content,
          pi.uri AS imgUrl,
          p.likeCount,
          p.commentCount,
          p.collectCount,
          p.createTime
      FROM
          Post p
      JOIN
          User u ON p.uid = u.id
      JOIN
          PostType pt ON p.typeId = pt.id
      LEFT JOIN
          PostImg pi ON p.imgId = pi.id
      ORDER BY
          p.createTime DESC
    `);
    res.json({ code: 200, data: posts, msg: '获取帖子列表成功' });
  } catch (err) {
    console.error('获取帖子列表失败:', err);
    res.status(500).json({ code: 500, msg: '获取帖子列表失败', data: null });
  }
});

// 获取帖子详情接口
router.get('/detail', async (req, res) => {
  const postId = req.query.id;
  if (!postId) {
    return res.status(400).json({ code: 400, msg: '帖子ID不能为空' });
  }

  try {
    const result = await postService.getPostDetail(postId);
    if (result.success) {
      res.json({ code: 200, data: result.data, msg: '获取帖子详情成功' });
    } else {
      res.status(404).json({ code: 404, msg: result.msg });
    }
  } catch (err) {
    console.error('获取帖子详情失败:', err);
    res.status(500).json({ code: 500, msg: '获取帖子详情失败', data: null });
  }
});

module.exports = router;
