const express = require('express');
const router = express.Router();
const db = require('../db/mysql57');

// 帖子类型列表
router.get('/types', async (req, res) => {
  const types = await db.sqlExec('SELECT * FROM PostType');
  res.json({ code: 200, data: types });
});

// 发帖
router.post('/create', async (req, res) => {
  try {
    const { uid, title, content, typeName, imgId } = req.body;
    if (!uid || !title || !content || !typeName) {
      return res.status(400).json({ code: 400, msg: '参数缺失' });
    }
    const typeRows = await db.sqlExec('SELECT id FROM PostType WHERE name = ? LIMIT 1', [typeName]);
    if (!typeRows.length) return res.status(400).json({ code: 400, msg: '帖子类型不存在' });
    const typeId = typeRows[0].id;

    const result = await db.sqlExec(
      'INSERT INTO Post (uid, typeId, title, content, imgId, likeCount, commentCount, collectCount) VALUES (?, ?, ?, ?, ?, 0, 0, 0)',
      [uid, typeId, title, content, imgId || null]
    );
    res.json({ code: 200, msg: '发布成功', data: { postId: result.insertId } });
  } catch (err) {
    res.status(500).json({ code: 500, msg: '服务器错误' });
  }
});

// 帖子列表
router.get('/list', async (req, res) => {
  try {
    const sql = `
      SELECT 
        Post.id, Post.title, Post.content, Post.likeCount, Post.commentCount, Post.collectCount,
        PostType.name as typeName,
        PostImg.uri as imgUrl
      FROM Post
      LEFT JOIN PostType ON Post.typeId = PostType.id
      LEFT JOIN PostImg ON Post.imgId = PostImg.id
      ORDER BY Post.id DESC
    `;
    const posts = await db.sqlExec(sql);
    res.json({ code: 200, data: posts });
  } catch (e) {
    res.status(500).json({ code: 500, msg: '服务器错误' });
  }
});

// 帖子详情
router.get('/detail', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ code: 400, msg: '参数缺失' });
  try {
    const sql = `
      SELECT 
        Post.*, 
        PostType.name as typeName, 
        PostImg.uri as imgUrl
      FROM Post
      LEFT JOIN PostType ON Post.typeId = PostType.id
      LEFT JOIN PostImg ON Post.imgId = PostImg.id
      WHERE Post.id = ?
      LIMIT 1
    `;
    const rows = await db.sqlExec(sql, [id]);
    if (!rows.length) return res.status(404).json({ code: 404, msg: '帖子不存在' });
    res.json({ code: 200, data: rows[0] });
  } catch (e) {
    res.status(500).json({ code: 500, msg: '服务器错误' });
  }
});
module.exports = router;
