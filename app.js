const express = require("express");
const path = require("path");
const multer = require('multer'); // {{ edit_1 }}

const app = express();

app.use(express.json());  // 支持 application/json 请求体

// 添加这行日志，确认静态文件服务的实际路径
console.log('Serving static files from:', path.join(__dirname, "public"));

app.use("/static", express.static(path.join(__dirname, "public")));

// 登录的路由
const loginRouter = require('./routes/login'); // 引入 login 路由文件
app.use('/login', loginRouter); // 将 loginRouter 挂载到 /login 路径下

// 用户管理
const userRouter = require('./routes/user'); // 导入用户路由
app.use('/user', userRouter); // 挂载用户路由

// 心理测评路由
const assessmentRouter = require('./routes/assessment'); // 导入测评路由
app.use('/assessment', assessmentRouter); // 挂载测评路由

// 帖子路由
const postRouter = require('./routes/post');
app.use('/api/post', postRouter);

// 上传接口
const uploadRouter = require('./routes/upload');
app.use('/api/upload', uploadRouter);

// {{ edit_2 }}
// 全局错误处理中间件 - 必须放在所有路由定义的后面
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err); // 打印错误到控制台，便于调试

  // 如果响应头已经发送，则将错误传递给 Express 默认的错误处理
  if (res.headersSent) {
    return next(err);
  }

  // 特殊处理 Multer 错误（文件上传错误）
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      code: 400,
      msg: `文件上传错误: ${err.message}`,
      error: err.code // Multer 错误码，如 LIMIT_FILE_SIZE
    });
  }

  // 处理其他所有未捕获的错误
  res.status(500).json({
    code: 500,
    msg: '服务器内部错误',
    // 在开发环境下提供更详细的错误信息，生产环境则隐藏
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
