const Router = require("koa-router");
// const jwt = require("jsonwebtoken");
const jwt = require("koa-jwt");
// const { secret } = require("../config");
const router = new Router({ prefix: "/users" });
const { find, findById, create, update, del, login, checkOwner, listFollowing, listFollows, checkUesrExist, follow, unfollow } = require("../controllers/users");

// 添加认证
// const auth = async (ctx, next) => {
//   const { authorization = "" } = ctx.request.header;
//   const token = authorization.replace("Bearer ", "");
//   try {
//     const user = jwt.verify(token, secret);
//     // koa-jwt 默认也在 ctx.state.user 添加了用户信息
//     ctx.state.user = user;
//   } catch (err) {
//     ctx.throw(401, err.message);
//   }
//   await next();
// };

const secret = process.env.JWT_SECRET;
const auth = jwt({ secret });

router.get("/", find);
router.get("/:id", findById);
router.post("/", create);
router.patch("/:id", auth, checkOwner, update);
router.delete("/:id", auth, checkOwner, del);

router.post("/login", login);

router.get("/:id/follows", listFollows);
router.get("/:id/following", listFollowing);
router.put("/following/:id", auth, checkUesrExist, follow);
router.delete("/following/:id", auth, checkUesrExist, unfollow);

module.exports = router;
