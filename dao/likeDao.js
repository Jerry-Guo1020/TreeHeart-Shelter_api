const mysql = require('../db/mysql57');

/**
 * 添加帖子点赞记录
 * @param {number} postId 帖子ID
 * @param {number} uid 用户ID
 * @returns {Object} 插入结果
 */
exports.addPostLike = async (postId, uid) => {
  const sql = `INSERT INTO PostLike (postId, uid) VALUES (?, ?)`;
  return await mysql.sqlExec(sql, [postId, uid]);
};

/**
 * 移除帖子点赞记录
 * @param {number} postId 帖子ID
 * @param {number} uid 用户ID
 * @returns {Object} 删除结果
 */
exports.removePostLike = async (postId, uid) => {
  const sql = `DELETE FROM PostLike WHERE postId = ? AND uid = ?`;
  return await mysql.sqlExec(sql, [postId, uid]);
};

/**
 * 检查用户是否已点赞某个帖子
 * @param {number} postId 帖子ID
 * @param {number} uid 用户ID
 * @returns {boolean} 是否已点赞
 */
exports.checkIfPostLiked = async (postId, uid) => {
  const sql = `SELECT COUNT(*) AS count FROM PostLike WHERE postId = ? AND uid = ?`;
  const rows = await mysql.sqlExec(sql, [postId, uid]);
  return rows[0].count > 0;
};

/**
 * 更新帖子的点赞数量
 * @param {number} postId 帖子ID
 * @param {number} increment 增量 (1 或 -1)
 * @returns {Object} 更新结果
 */
exports.updatePostLikeCount = async (postId, increment) => {
  const sql = `UPDATE Post SET likeCount = likeCount + ? WHERE id = ?`;
  return await mysql.sqlExec(sql, [increment, postId]);
};

/**
 * 添加评论点赞记录
 * @param {number} commentId 评论ID
 * @param {number} uid 用户ID
 * @returns {Object} 插入结果
 */
exports.addCommentLike = async (commentId, uid) => {
  const sql = `INSERT INTO CommentLike (commentId, uid) VALUES (?, ?)`;
  return await mysql.sqlExec(sql, [commentId, uid]);
};

/**
 * 移除评论点赞记录
 * @param {number} commentId 评论ID
 * @param {number} uid 用户ID
 * @returns {Object} 删除结果
 */
exports.removeCommentLike = async (commentId, uid) => {
  const sql = `DELETE FROM CommentLike WHERE commentId = ? AND uid = ?`;
  return await mysql.sqlExec(sql, [commentId, uid]);
};

/**
 * 检查用户是否已点赞某个评论
 * @param {number} commentId 评论ID
 * @param {number} uid 用户ID
 * @returns {boolean} 是否已点赞
 */
exports.checkIfCommentLiked = async (commentId, uid) => {
  const sql = `SELECT COUNT(*) AS count FROM CommentLike WHERE commentId = ? AND uid = ?`;
  const rows = await mysql.sqlExec(sql, [commentId, uid]);
  return rows[0].count > 0;
};