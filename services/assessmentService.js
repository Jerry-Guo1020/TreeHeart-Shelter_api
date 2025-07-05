// ... existing code ...

/**
 * 根据测评ID获取题目列表
 * @param {number} assessmentId 测评ID
 * @returns {Promise<Array|null>} 题目列表或null
 */
exports.getQuestionsByAssessmentId = async (assessmentId) => {
  try {
    // 假设 assessmentDao.js 中有一个方法来获取题目
    const questions = await assessmentDao.getQuestionsByAssessmentId(assessmentId);
    return questions;
  } catch (err) {
    console.error(`[assessmentService] 获取测评ID ${assessmentId} 的题目失败:`, err); // 添加详细日志
    throw err; // 重新抛出错误，让上层（路由）捕获并返回500
  }
};

// ... existing code ...