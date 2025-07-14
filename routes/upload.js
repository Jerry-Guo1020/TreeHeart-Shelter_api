const express = require('express');
const router = express.Router();
const { minioClient, BUCKET } = require('../utils/minioClient');
const axios = require('axios');
const uuid = require('uuid').v4;

// apisql配置
const APISQL_BASE_URL = 'https://open.apisql.cn/api/tree_api';

// 1. 获取预签名上传URL（POST /upload/presign）
router.post('/presign', async (req, res) => {
  try {
    // 假设你前端传图片数量和图片扩展名列表
    const { imgCount, extList = [] } = req.body;
    if (!imgCount || imgCount <= 0) return res.json({ code: 400, msg: '图片数量错误' });
    // 创建多张图片的预签名url和img记录
    const communityImageList = [];
    for (let i = 0; i < imgCount; i++) {
      const ext = extList[i] || '.jpg';
      const objectName = `${Date.now()}_${uuid()}${ext}`;
      // 1. 创建mysql记录，status='待上传'
      const resp = await axios.post(`${APISQL_BASE_URL}/insert/postimg`, {
        params: {
          browser: BUCKET,
          uri: objectName,
          status: '待上传'
        }
      });
      const imgId = resp.data.insertId || (resp.data.data && resp.data.data.insertId);
      // 2. 生成预签名url（有效期30分钟）
      const url = await minioClient.presignedPutObject(BUCKET, objectName, 30 * 60);
      communityImageList.push({ id: imgId, url });
    }
    res.json({ code: 200, data: { communityImageList } });
  } catch (e) {
    res.status(500).json({ code: 500, msg: e.message });
  }
});

// 2. 标记图片上传完成（POST /upload/complete）
router.post('/complete', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ code: 400, msg: '缺少图片id' });
    // apisql更新图片表status
    await axios.post(`${APISQL_BASE_URL}/update/postimgstatus`, {
      params: { id, status: '已完成' }
    });
    res.json({ code: 200, msg: '图片状态已更新' });
  } catch (e) {
    res.status(500).json({ code: 500, msg: e.message });
  }
});

module.exports = router;
