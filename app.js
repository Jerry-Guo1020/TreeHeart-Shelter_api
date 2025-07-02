const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());  // 支持 application/json 请求体
app.use("/static", express.static(path.join(__dirname, "public")));

// 挂载你自己的业务路由
const loginRouter = require('./routes/login'); // 路径根据你实际项目
app.use('/login', loginRouter);

const userRouter = require('./routes/user'); // 导入用户路由
app.use('/user', userRouter); // 挂载用户路由

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
