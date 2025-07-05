const mysql = require('../db/mysql57');
const db = require('../utils/db'); // 假设你有一个数据库连接工具

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
 * 根据测评ID从数据库获取题目列表
 * @param {number} assessmentId 测评ID
 * @returns {Promise<Array|null>} 题目列表或null
 */
exports.getQuestionsByAssessmentId = async (assessmentId) => {
  try {
    const sql = `SELECT * FROM AssessmentQuestion WHERE assessmentId = ? ORDER BY id ASC`;
    const rows = await mysql.sqlExec(sql, [assessmentId]);
    console.log(`[assessmentDao] 查询测评ID ${assessmentId} 的题目结果:`, rows); // 新增日志
    if (rows && rows.length > 0) {
      return rows;
    }
    return null;
  } catch (err) {
    console.error(`[assessmentDao] 从数据库获取测评ID ${assessmentId} 的题目失败:`, err);
    throw err;
  }
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