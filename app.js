const express = require("express");
const path = require("path");

const app = express();
app.use("/static", express.static(path.join(__dirname, "public")));

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
