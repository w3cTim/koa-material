const Koa = require("koa");
const app = new Koa();

app.use(async (ctx, next) => {
  console.log(1);
  await next(); // 调用下个中间件
  console.log(2);
  ctx.body = "Hello heiheihei World";
});
app.use(async (ctx, next) => {
  console.log(3);
  await next();
  console.log(4);
});

app.use(async (ctx, next) => {
  console.log(5);
  await next();
  console.log(6);
});

// 执行顺序：1、3、5、6、4、2；执行 next() 等下一个中间件执行完毕后，再执行当前代码。这就是著名洋葱模型。

app.listen(3800);
console.log("http://localhost:3800");
