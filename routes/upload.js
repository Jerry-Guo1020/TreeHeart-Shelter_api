const express = require('express');
const router = express.Router();
const multer = require('multer');
const { minioClient, BUCKET } = require('../utils/minioClient');
const mysql = require('../db/mysql57');
const fs = require('fs');
const path = require('path');

// 确保 uploads 目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

router.post('/image', upload.single('file'), async (req, res) => {
  let filePathToClean = null;
  try {
    const file = req.file;
    if (!file) return res.json({ code: 400, msg: '未选择文件' });

    filePathToClean = file.path;
    const objectName = Date.now() + '_' + file.originalname;

    // 上传到 minio
    await new Promise((resolve, reject) => {
      minioClient.fPutObject(BUCKET, objectName, file.path, {}, (err, etag) => {
        if (err) return reject(new Error('Minio 上传失败'));
        resolve();
      });
    });

    // 写入 MySQL
    const result = await mysql.sqlExec(
      'INSERT INTO PostImg (browser, uri, status) VALUES (?, ?, ?)',
      [BUCKET, objectName, '已完成']
    );
    const imgId = result.insertId;
    const url = `http://43.142.21.211/minio-public/${BUCKET}/${objectName}`;
    res.json({ code: 200, msg: '上传成功', data: { url, imgId } });

  } catch (e) {
    res.status(500).json({ code: 500, msg: `服务器内部错误: ${e.message}` });
  } finally {
    if (filePathToClean && fs.existsSync(filePathToClean)) {
      try { fs.unlinkSync(filePathToClean); } catch (_) {}
    }
  }
});
module.exports = router;
