require("dotenv").config();

const Koa = require("koa");
const koabody = require("koa-body");
const koastatic = require("koa-static");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");
const routing = require("./routes");
const path = require("path");
const app = new Koa();

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("MongoDB 数据库已连接"));
mongoose.connection.on("error", console.error);

// 静态文件管理
app.use(koastatic(path.join(__dirname, "public")));

// 自定义错误捕获，写在所有中间件的前面即可捕获所有中间件错误（除了 404）
// 自定义错误捕获功能有限，所有一般使用 koa-json-error 中间件处理错误
// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (err) {
//     ctx.status = err.status || err.statusCode || 500;
//     ctx.body = {
//       message: err.message,
//     };
//   }
// });

app.use(
  // 配置如果是生产环境就不显示堆栈信息
  error({
    postFormat: (err, { stack, ...rest }) => (process.env.NODE_ENV === "production" ? rest : { stack, ...rest }),
  })
);
// 请求体解析
app.use(
  koabody({
    multipart: true,
    formidable: {
      // 上传文件保存地址
      uploadDir: path.join(__dirname, "/public/uploads"),
      // 保存扩展名
      keepExtensions: true,
    },
  })
);

// 参数校验
app.use(parameter(app));

// 注册 router
routing(app);

app.listen(process.env.KOA_PORT, () => {
  console.log(`程序已启动：http://localhost:${process.env.KOA_PORT}`);
});
