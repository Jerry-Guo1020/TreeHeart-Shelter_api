const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql57');

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

module.exports = router;
