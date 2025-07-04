const express = require('express')
const router = express.Router()
const multer = require('multer')
const { minioClient, BUCKET } = require('../utils/minioClient')
const mysql = require('../db/mysql57')
const fs = require('fs')

const upload = multer({ dest: 'uploads/' })

router.post('/image', upload.single('file'), (req, res) => {
  const file = req.file
  if (!file) return res.json({ code: 400, msg: '未选择文件' })

  const objectName = Date.now() + '_' + file.originalname
  minioClient.fPutObject(BUCKET, objectName, file.path, {}, async (err, etag) => {
    fs.unlinkSync(file.path);
    if (err) return res.json({ code: 500, msg: '上传失败' });

    try {
      const result = await mysql.sqlExec(
        'INSERT INTO PostImg (browser, uri, status) VALUES (?, ?, ?)',
        [BUCKET, objectName, '已完成']
      );
      const imgId = result.insertId;
      // 这里的 URL 是直接访问 Minio 的地址
      const url = `http://43.142.21.211:59001/${BUCKET}/${objectName}`; // 确保这个 IP 和端口是 Minio 的公共访问地址
      res.json({ code: 200, msg: '上传成功', data: { url, imgId } });
    } catch (e) {
      res.json({ code: 500, msg: '数据库保存失败' });
    }
  });
});

module.exports = router
