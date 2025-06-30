// entity/user/WxLogin.js

class WxLogin {
  constructor(req) {
    // 你可以根据实际项目调整字段名
    const body = req.body || {};
    this.code = body.code;
    this.userInfo = body.userInfo || {};
  }

  check() {
    // 检查参数是否齐全，返回结果格式和Response一致
    if (!this.code) {
      return { success: false, code: 400, msg: 'code不能为空' };
    }
    // 你可以补充更多校验
    return { success: true };
  }
}

module.exports = WxLogin;
