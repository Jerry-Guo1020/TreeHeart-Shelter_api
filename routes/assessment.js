const express = require('express');
const router = express.Router();
const assessmentDao = require('../dao/assessmentDao');

// 获取测评题目 (修改为接收路径参数)
router.get('/questions/:assessmentId', async (req, res) => {
  const assessmentId = req.params.assessmentId; // 从路径参数中获取 assessmentId
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
  // 假设你从请求头或session中获取用户ID，这里只是一个占位符
  // 实际项目中，用户ID通常通过认证中间件从token中解析出来
  // 这里假设用户ID从 req.user.id 获取，如果你的认证方式不同，请自行调整
  const userId = req.user ? req.user.id : 1; // 假设用户ID为1，实际请替换为真实用户ID

  if (!assessmentId || score === undefined) {
    return res.status(400).json({ code: 400, msg: '缺少测评ID或分数' });
  }
  try {
    const rule = await assessmentDao.getAssessmentRule(assessmentId, score);
    if (rule) {
      // 保存用户测评记录到数据库
      await assessmentDao.saveUserAssessmentRecord(userId, assessmentId, score, rule.level, rule.report);

      res.json({ code: 200, msg: '提交成功', data: { level: rule.level, report: rule.report } });
    } else {
      res.status(404).json({ code: 404, msg: '未找到对应的测评规则' });
    }
  } catch (error) {
    console.error('提交测评结果失败:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// 新增路由：获取用户测评记录
router.get('/records', async (req, res) => {
  // 假设用户ID从 req.user.id 获取，如果你的认证方式不同，请自行调整
  const userId = req.user ? req.user.id : 1; // 假设用户ID为1，实际请替换为真实用户ID

  if (!userId) {
    return res.status(401).json({ code: 401, msg: '用户未登录' });
  }

  try {
    const records = await assessmentDao.getUserAssessmentRecords(userId);
    res.json({ code: 200, msg: '获取成功', data: records });
  } catch (error) {
    console.error('获取用户测评记录失败:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// 新增路由：删除用户测评记录
router.delete('/records/:recordId', async (req, res) => {
  const recordId = req.params.recordId;
  // 假设用户ID从 req.user.id 获取，如果你的认证方式不同，请自行调整
  // 这里为了演示方便，仍然使用固定值或从请求中获取，生产环境请务必通过认证中间件获取
  const userId = req.user ? req.user.id : 1; // 假设用户ID为1，实际请替换为真实用户ID

  if (!recordId) {
    return res.status(400).json({ code: 400, msg: '缺少记录ID' });
  }

  try {
    // 调用 DAO 层删除记录，并传入 userId 进行权限验证
    const result = await assessmentDao.deleteUserAssessmentRecord(recordId, userId);
    if (result.affectedRows > 0) {
      res.json({ code: 200, msg: '删除成功', data: null });
    } else {
      // 如果 affectedRows 为 0，可能是记录不存在，或者该用户无权删除此记录
      res.status(404).json({ code: 404, msg: '记录不存在或无权删除' });
    }
  } catch (error) {
    console.error('删除测评记录异常:', error);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

module.exports = router;