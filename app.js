const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());  // 支持 application/json 请求体
app.use("/static", express.static(path.join(__dirname, "public")));

// 登录的路由
const loginRouter = require('./routes/login'); // 路径根据你实际项目
app.use('/login', loginRouter);

// 用户管理
const userRouter = require('./routes/user'); // 导入用户路由
app.use('/user', userRouter); // 挂载用户路由

// 心理测评路由
const assessmentRouter = require('./routes/assessment'); // 导入测评路由
app.use('/assessment', assessmentRouter); // 挂载测评路由

// 帖子路由
const postRouter = require('./routes/post');
app.use('/post', postRouter);


const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
