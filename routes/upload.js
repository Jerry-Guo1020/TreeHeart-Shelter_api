const express = require('express')
const router = express.Router()
const multer = require('multer')
const { minioClient, BUCKET } = require('../utils/minioClient')
const mysql = require('../db/mysql57')
const fs = require('fs')
const path = require('path') // 导入 path 模块

// 确保 uploads 目录存在，用于 multer 临时存储文件
const uploadDir = path.join(__dirname, '../uploads'); // 相对于项目根目录的 uploads 文件夹
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir }) // 使用绝对路径作为 dest

router.post('/image', upload.single('file'), async (req, res) => { // 将路由处理函数声明为 async
  let filePathToClean = null; // 用于存储需要清理的临时文件路径
  try {
    const file = req.file
    if (!file) {
      return res.json({ code: 400, msg: '未选择文件' })
    }

    filePathToClean = file.path; // 记录临时文件路径

    const objectName = Date.now() + '_' + file.originalname
    
    // 将 Minio 上传操作封装成 Promise，以便使用 async/await
    await new Promise((resolve, reject) => {
      minioClient.fPutObject(BUCKET, objectName, file.path, {}, (err, etag) => {
        if (err) {
          console.error('Minio 上传失败:', err);
          return reject(new Error('Minio 上传失败'));
        }
        resolve();
      });
    });

    // 如果 Minio 上传成功，则继续保存到数据库
    const result = await mysql.sqlExec(
      'INSERT INTO PostImg (browser, uri, status) VALUES (?, ?, ?)',
      [BUCKET, objectName, '已完成']
    );
    const imgId = result.insertId;
    // 这里的 URL 是直接访问 Minio 的地址
    const url = `http://43.142.21.211:59001/${BUCKET}/${objectName}`; // 确保这个 IP 和端口是 Minio 的公共访问地址
    res.json({ code: 200, msg: '上传成功', data: { url, imgId } });

  } catch (e) {
    console.error('图片上传过程中发生错误:', e);
    // 统一返回 JSON 格式的错误响应
    res.status(500).json({ code: 500, msg: `服务器内部错误: ${e.message}` }); 
  } finally {
    // 无论成功或失败，都在这里尝试删除临时文件
    if (filePathToClean && fs.existsSync(filePathToClean)) {
      try {
        fs.unlinkSync(filePathToClean);
        console.log(`临时文件 ${filePathToClean} 已删除。`);
      } catch (unlinkErr) {
        console.error(`删除临时文件 ${filePathToClean} 失败:`, unlinkErr);
      }
    }
  }
});

module.exports = router
