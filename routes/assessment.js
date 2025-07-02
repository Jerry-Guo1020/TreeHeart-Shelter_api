const express = require('express');
const router = express.Router();
const assessmentDao = require('../dao/assessmentDao'); // 假设你有一个 assessmentDao

// 获取测评题目
router.get('/questions', async (req, res) => {
  const assessmentId = req.query.assessmentId;
  if (!assessmentId) {
    return res.status(400).json({ code: 400, msg: '缺少测评ID' });
  }
  try {
    const questions = await assessmentDao.getQuestionsByAssessmentId(assessmentId);
    res.json({ code: 200, msg: '获取成功', data: { questions } });
  } catch (error) {
    console.error('获取测评题目失败:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// 提交测评结果
router.post('/submit', async (req, res) => {
  const { assessmentId, score } = req.body;
  if (!assessmentId || score === undefined) {
    return res.status(400).json({ code: 400, msg: '缺少测评ID或分数' });
  }
  try {
    // 这里需要根据 assessmentId 和 score 查询 AssessmentRule 表，计算出 level 和 report
    const rule = await assessmentDao.getAssessmentRule(assessmentId, score);
    if (rule) {
      res.json({ code: 200, msg: '提交成功', data: { level: rule.level, report: rule.report } });
    } else {
      res.status(404).json({ code: 404, msg: '未找到对应的测评规则' });
    }
  } catch (error) {
    console.error('提交测评结果失败:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

module.exports = router;