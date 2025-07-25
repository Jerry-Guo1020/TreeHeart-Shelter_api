const mysql = require('../db/mysql57');

/**
 * 根据测评ID获取测评题目
 * @param {number} assessmentId 测评ID
 * @returns {Array} 题目列表
 */
exports.getQuestionsByAssessmentId = async (assessmentId) => {
  const sql = `SELECT id, content, options FROM AssessmentQuestion WHERE assessmentId = ?`;
  const rows = await mysql.sqlExec(sql, [assessmentId]);
  // 移除 JSON.parse，因为 mysql2 驱动在读取 JSON 类型字段时通常会自动解析
  return rows;
};

/**
 * 根据测评ID和分数获取对应的测评规则（等级和报告）
 * @param {number} assessmentId 测评ID
 * @param {number} score 用户得分
 * @returns {Object|null} 匹配的规则对象，包含 level 和 report
 */
exports.getAssessmentRule = async (assessmentId, score) => {
  const sql = `SELECT level, report FROM AssessmentRule WHERE assessmentId = ? AND ? BETWEEN minScore AND maxScore`;
  const rows = await mysql.sqlExec(sql, [assessmentId, score]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * 保存用户测评记录
 * @param {number} uid 用户ID
 * @param {number} assessmentId 测评ID
 * @param {number} score 得分
 * @param {string} level 测评等级
 * @param {string} report 测评报告
 * @returns {Object} 插入结果
 */
exports.saveUserAssessmentRecord = async (uid, assessmentId, score, level, report) => {
  const sql = `INSERT INTO UserAssessmentRecord (uid, assessmentId, score, level, report) VALUES (?, ?, ?, ?, ?)`;
  return await mysql.sqlExec(sql, [uid, assessmentId, score, level, report]);
};

/**
 * 获取指定用户的所有测评记录
 * @param {number} uid 用户ID
 * @returns {Array} 测评记录列表
 */
exports.getUserAssessmentRecords = async (uid) => {
  // 联结 UserAssessmentRecord 和 Assessment 表，以获取测评名称
  const sql = `
    SELECT 
      uar.id, 
      uar.score, 
      uar.level, 
      uar.report, 
      uar.createTime, 
      a.name AS assessmentName 
    FROM 
      UserAssessmentRecord uar
    JOIN 
      Assessment a ON uar.assessmentId = a.id
    WHERE 
      uar.uid = ?
    ORDER BY 
      uar.createTime DESC
  `;
  return await mysql.sqlExec(sql, [uid]);
};

/**
 * 删除指定用户的测评记录
 * @param {number} recordId 测评记录ID
 * @param {number} uid 用户ID (用于验证，确保用户只能删除自己的记录)
 * @returns {Object} 删除结果，包含 affectedRows
 */
exports.deleteUserAssessmentRecord = async (recordId, uid) => {
  // 确保用户只能删除自己的记录，防止越权删除
  const sql = `DELETE FROM UserAssessmentRecord WHERE id = ? AND uid = ?`;
  return await mysql.sqlExec(sql, [recordId, uid]);
};