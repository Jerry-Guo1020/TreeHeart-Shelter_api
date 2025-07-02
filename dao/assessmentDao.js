const mysql = require('../db/mysql57');

exports.getQuestionsByAssessmentId = async (assessmentId) => {
  const sql = 'SELECT id, content, options FROM AssessmentQuestion WHERE assessmentId = ? ORDER BY id ASC';
  const result = await mysql.sqlExec(sql, [assessmentId]);
  return result;
};

exports.getAssessmentRule = async (assessmentId, score) => {
  const sql = 'SELECT level, report FROM AssessmentRule WHERE assessmentId = ? AND ? BETWEEN minScore AND maxScore';
  const result = await mysql.sqlExec(sql, [assessmentId, score]);
  return result[0]; // 返回第一个匹配的规则
};