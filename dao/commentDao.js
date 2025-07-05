const mysql = require('../db/mysql57');

/**
 * 添加新评论
 * @param {number} postId 帖子ID
 * @param {number} uid 评论用户ID
 * @param {string} content 评论内容
 * @param {number|null} parentCommentId 父评论ID (可选)
 * @returns {Object} 插入结果
 */
exports.addComment = async (postId, uid, content, parentCommentId = null) => {
  const sql = `INSERT INTO Comment (postId, uid, content, parentCommentId) VALUES (?, ?, ?, ?)`;
  return await mysql.sqlExec(sql, [postId, uid, content, parentCommentId]);
};

/**
 * 根据帖子ID获取评论列表，并附带评论者信息
 * @param {number} postId 帖子ID
 * @returns {Array} 评论列表
 */
exports.getCommentsByPostId = async (postId) => {
  const sql = `
    SELECT
        c.id,
        c.postId,
        c.uid,
        u.nickname AS username,
        u.avatar,
        c.content,
        c.likes,
        c.parentCommentId,
        c.createTime
    FROM
        Comment c
    JOIN
        User u ON c.uid = u.id
    WHERE
        c.postId = ?
    ORDER BY
        c.createTime DESC
  `;
  return await mysql.sqlExec(sql, [postId]);
};

/**
 * 更新评论的点赞数量
 * @param {number} commentId 评论ID
 * @param {number} increment 增量 (1 或 -1)
 * @returns {Object} 更新结果
 */
exports.updateCommentLikes = async (commentId, increment) => {
  const sql = `UPDATE Comment SET likes = likes + ? WHERE id = ?`;
  return await mysql.sqlExec(sql, [increment, commentId]);
};

/**
 * 更新帖子的评论数量
 * @param {number} postId 帖子ID
 * @param {number} increment 增量 (1 或 -1)
 * @returns {Object} 更新结果
 */
exports.updatePostCommentCount = async (postId, increment) => {
  const sql = `UPDATE Post SET commentCount = commentCount + ? WHERE id = ?`;
  return await mysql.sqlExec(sql, [increment, postId]);
};