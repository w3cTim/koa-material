const fs = require("fs");

// app 运行时，根据 routers 文件夹文件名自动注册 router
module.exports = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === "index.js") return;
    const route = require(`./${file}`);
    // 注册 router 并允许 options 请求
    app.use(route.routes()).use(route.allowedMethods());
  });
};
