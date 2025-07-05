const mysql = require('../db/mysql57');

/**
 * 获取所有测评列表
 * @returns {Array} 测评列表
 */
exports.getAllAssessments = async () => {
  const sql = `SELECT id, name, description, createTime FROM Assessment ORDER BY createTime DESC`;
  return await mysql.sqlExec(sql);
};

/**
 * 根据ID获取单个测评的详细信息
 * @param {number} assessmentId 测评ID
 * @returns {Object|null} 测评信息
 */
exports.getAssessmentById = async (assessmentId) => {
  const sql = `SELECT id, name, description, createTime FROM Assessment WHERE id = ?`;
  const rows = await mysql.sqlExec(sql, [assessmentId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * 根据测评ID获取所有题目
 * @param {number} assessmentId 测评ID
 * @returns {Array} 题目列表
 */
exports.getQuestionsByAssessmentId = async (assessmentId) => {
  const sql = `SELECT id, assessmentId, content, options FROM AssessmentQuestion WHERE assessmentId = ? ORDER BY id ASC`;
  const questions = await mysql.sqlExec(sql, [assessmentId]);
  // 解析 options 字段，因为它是 JSON 字符串
  return questions.map(q => ({
    ...q,
    options: JSON.parse(q.options) // 将 JSON 字符串解析为数组
  }));
};

/**
 * 根据测评ID获取评分规则
 * @param {number} assessmentId 测评ID
 * @returns {Array} 评分规则列表
 */
exports.getRulesByAssessmentId = async (assessmentId) => {
  const sql = `SELECT id, assessmentId, minScore, maxScore, level, report FROM AssessmentRule WHERE assessmentId = ? ORDER BY minScore ASC`;
  return await mysql.sqlExec(sql, [assessmentId]);
};

/**
 * 保存用户测评记录
 * @param {number} uid 用户ID
 * @param {number} assessmentId 测评ID
 * @param {number} score 总分
 * @param {string} level 结果分级
 * @param {string} report 评价内容
 * @returns {Object} 插入结果
 */
exports.saveUserAssessmentRecord = async (uid, assessmentId, score, level, report) => {
  const sql = `INSERT INTO UserAssessmentRecord (uid, assessmentId, score, level, report) VALUES (?, ?, ?, ?, ?)`;
  return await mysql.sqlExec(sql, [uid, assessmentId, score, level, report]);
};

/**
 * 获取用户测评历史记录
 * @param {number} uid 用户ID
 * @returns {Array} 测评历史记录列表
 */
exports.getUserAssessmentRecords = async (uid) => {
  const sql = `
    SELECT
        uar.id,
        uar.uid,
        uar.assessmentId,
        a.name AS assessmentName,
        uar.score,
        uar.level,
        uar.report,
        uar.createTime
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