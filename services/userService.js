const loginDao = require('./dao/loginDao'); // 复用 loginDao 来进行用户数据库操作
const Response = require('../entity/http/Response'); // 导入 Response 工具类，请确保此路径正确

// 更新用户信息
exports.updateUserInfo = async (userId, userInfo) => {
  const response = new Response();
  try {
    console.log(`【userService】更新用户ID: ${userId} 的信息:`, userInfo);

    // 1. 更新数据库中的用户信息
    const updateResult = await loginDao.updateUser(userId, userInfo);

    if (updateResult && updateResult.affectedRows > 0) {
      // 2. 更新成功后，重新查询最新的用户数据并返回
      const updatedUser = await loginDao.getUserById(userId);
      if (updatedUser) {
        // 移除敏感信息或不必要的信息，只返回前端需要的部分
        const userToReturn = {
          id: updatedUser.id,
          nickname: updatedUser.nickname,
          avatar: updatedUser.avatar,
          username: updatedUser.username,
          sex: updatedUser.sex,
          grade: updatedUser.grade,
          college: updatedUser.college,
          subCollege: updatedUser.subCollege,
          major: updatedUser.major,
          isNewUser: updatedUser.isNewUser,
          createTime: updatedUser.createTime,
          updateTime: updatedUser.updateTime,
          // ... 其他你希望返回给前端的用户字段
        };
        return response.ok({ user: userToReturn });
      } else {
        return response.fail(404, '更新成功但未找到用户');
      }
    } else {
      // 如果 affectedRows 为 0，可能是传入的字段与数据库中现有值相同，或者用户ID不存在
      return response.fail(400, '用户信息更新失败或没有变化');
    }
  } catch (err) {
    console.error('【userService】updateUserInfo 错误:', err);
    return response.fail(500, '服务器内部错误');
  }
};