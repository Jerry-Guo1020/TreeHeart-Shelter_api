const express = require('express');
const router = express.Router();
const axios = require('axios');

const APISQL_BASE_URL = 'https://open.apisql.cn/api/tree_api';

// 1. 创建帖子（POST /community/publish）
router.post('/publish', async (req, res) => {
  try {
    // uid, title, content, imgId, type等参数
    const { uid, title, content, imgIds, typeId } = req.body;
    // apisql 插入帖子表，可支持多图（如用中间表 Post_Imgs，或只用一张图imgId）
    const resp = await axios.post(`${APISQL_BASE_URL}/insert/post`, {
      params: { uid, title, content, imgId: imgIds ? imgIds[0] : null, typeId }
    });
    res.json({ code: 200, data: { postId: resp.data.insertId } });
  } catch (e) {
    res.status(500).json({ code: 500, msg: e.message });
  }
});

// 2. 获取帖子详情/列表/类型等你原有的接口（略）
// 可以用 apisql 直接做，或这里用 axios 调用
module.exports = router;
