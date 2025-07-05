const express = require('express');
const router = express.Router();
const assessmentService = require('../services/assessmentService'); // 假设你有对应的 service

// 获取指定ID的测评题目
router.get('/questions/:id', async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const questions = await assessmentService.getQuestionsByAssessmentId(assessmentId); // 调用 service 层方法
    if (questions) {
      res.json({ code: 200, msg: '获取题目成功', data: questions });
    } else {
      res.status(404).json({ code: 404, msg: '未找到该测评或题目' });
    }
  } catch (error) {
    console.error('获取测评题目失败:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

module.exports = router;