const mysql = require('../db/mysql57');

async function createPost(uid, title, content, typeName, images) {
  try {
    // 1. 查询帖子类型ID
    const typeRows = await mysql.sqlExec('SELECT id FROM PostType WHERE name = ? LIMIT 1', [typeName]);
    if (typeRows.length === 0) {
      return { success: false, msg: '帖子类型不存在' };
    }
    const typeId = typeRows[0].id;

    // 2. 处理图片，假设images是图片URL数组，先插入PostImg表，获取imgId
    let imgId = null;
    if (images.length > 0) {
      // 这里简单插入第一张图片，实际可扩展多图处理
      const imgUrl = images[0];
      const insertImgResult = await mysql.sqlExec(
        'INSERT INTO PostImg (browser, uri, status) VALUES (?, ?, ?)',
        ['default', imgUrl, '已完成']
      );
      imgId = insertImgResult.insertId;
    }

    // 3. 插入帖子表
    const insertPostResult = await mysql.sqlExec(
      `INSERT INTO Post (uid, typeId, title, content, imgId, likeCount, commentCount, collectCount)
       VALUES (?, ?, ?, ?, ?, 0, 0, 0)`,
      [uid, typeId, title, content, imgId]
    );

    return { success: true, postId: insertPostResult.insertId };
  } catch (err) {
    console.error('postService.createPost错误:', err);
    return { success: false, msg: '服务器错误' };
  }
}

module.exports = { createPost };