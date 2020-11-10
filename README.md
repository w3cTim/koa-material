# Koa 入门

1. `npm init` 项目
2. `npm i koa --save` --save：把命令保存到 package.json 中
3. `npm i nodemon --save-dev` nodemon：热重启，开阶段依赖
4. `npm i dotenv --save` 管理环境变量
5. `npm i koa-router --save` koa 路由
6. ~~`npm i koa-bodyparser --save` 解析 http 请求 Body~~
7. `npm i koa-body --save` 解析 http 请求 Body，并支持文件上传，所以替换 `npm uninstall koa-bodyparser -S`
8. `npm i koa-json-error -S` 自定义错误功能有限，该中间件处理错误，可以根据配置返回堆栈信息和信息
9. `npm i cross-env --save-dev` 模拟生产环境的轮子
10. `npm i koa-parameter -S` 校验参数
11. `npm i mongoose -S` 链接管理 MongoDB 数据库
12. `npm i koa-jwt -S` 管理登录授权，比 `jsonwebtoken` 功能强大些，能保护接口，获取用户信息
13. `npm koa-static -S` 静态资源访问
