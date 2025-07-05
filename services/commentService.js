const commentDao = require('../dao/commentDao');
const likeDao = require('../dao/likeDao'); // 引入 likeDao
const Response = require('../entity/http/Response');

/**
 * 创建新评论
 * @param {number} postId 帖子ID
 * @param {number} uid 评论用户ID
 * @param {string} content 评论内容
 * @param {number|null} parentCommentId 父评论ID (可选)
 * @returns {Object} 包含新评论信息的响应
 */
exports.createComment = async (postId, uid, content, parentCommentId = null) => {
  const response = new Response();
  try {
    const result = await commentDao.addComment(postId, uid, content, parentCommentId);
    if (result.insertId) {
      // 评论成功后，更新帖子的评论数量
      await commentDao.updatePostCommentCount(postId, 1);

      // 重新查询新评论的完整信息，包括用户头像和昵称
      const newComment = (await commentDao.getCommentsByPostId(postId)).find(c => c.id === result.insertId);
      return response.ok({ comment: newComment });
    } else {
      return response.fail(500, '评论失败');
    }
  } catch (err) {
    console.error('commentService.createComment 错误:', err);
    return response.fail(500, '服务器内部错误');
  }
};

/**
 * 获取帖子的评论列表
 * @param {number} postId 帖子ID
 * @returns {Object} 包含评论列表的响应
 */
exports.getCommentsForPost = async (postId) => {
  const response = new Response();
  try {
    const comments = await commentDao.getCommentsByPostId(postId);
    return response.ok({ comments });
  } catch (err) {
    console.error('commentService.getCommentsForPost 错误:', err);
    return response.fail(500, '服务器内部错误');
  }
};

/**
 * 切换评论点赞状态
 * @param {number} commentId 评论ID
 * @param {number} uid 用户ID
 * @returns {Object} 响应
 */
exports.toggleCommentLike = async (commentId, uid) => {
  const response = new Response();
  try {
    const isLiked = await likeDao.checkIfCommentLiked(commentId, uid);
    if (isLiked) {
      // 已点赞，则取消点赞
      await likeDao.removeCommentLike(commentId, uid);
      await commentDao.updateCommentLikes(commentId, -1);
      return response.ok({ action: 'unliked' });
    } else {
      // 未点赞，则添加点赞
      await likeDao.addCommentLike(commentId, uid);
      await commentDao.updateCommentLikes(commentId, 1);
      return response.ok({ action: 'liked' });
    }
  } catch (err) {
    console.error('commentService.toggleCommentLike 错误:', err);
    return response.fail(500, '服务器内部错误');
  }
};