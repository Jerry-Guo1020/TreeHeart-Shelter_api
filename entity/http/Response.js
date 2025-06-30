// entity/http/Response.js

class Response {
  constructor() {
    this.code = 200;
    this.msg = 'success';
    this.data = null;
  }

  ok(data) {
    this.code = 200;
    this.msg = 'success';
    this.data = data;
    return this;
  }

  fail(code = 400, msg = 'fail') {
    this.code = code;
    this.msg = msg;
    this.data = null;
    return this;
  }
}

module.exports = Response;
