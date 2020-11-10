const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { queryFields } = require("../util");

class UsersCtl {
  async find(ctx) {
    ctx.body = await User.find();
  }

  async findById(ctx) {
    const id = ctx.params.id;
    if (id && id <= 0) {
      ctx.throw(412, "WTF");
    }
    // 根据传入字段 查询已隐藏的字段
    const selectFields = queryFields(ctx.query);

    const user = await User.findById(id).select(selectFields).populate("following locations educations.school");
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
      age: { type: "number", required: false },
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) {
      ctx.throw(409, "用户名已经存在");
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
      password: { type: "string", required: false },
      age: { type: "number", required: false },
      locations: { type: "array", itemType: "string", required: false },
      educations: { type: "array", itemType: "object", required: false },
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }

  async del(ctx) {
    const user = await User.findByIdAndDelete(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.status = 204;
  }

  async login(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, "用户名或密码不正确");
    }
    const { _id, name } = user;
    const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, { expiresIn: "1d" });
    ctx.body = { token };
  }

  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }

  // 粉丝列表
  async listFollows(ctx) {
    const users = await User.find({ following: ctx.params.id });
    ctx.body = users;
  }

  // 关注的人列表
  async listFollowing(ctx) {
    // populate 获取详细信息
    const user = await User.findById(ctx.params.id).select("+following").populate("following");
    if (!user) {
      ctx.throw(404);
    }
    ctx.body = user.following;
  }

  async checkUesrExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    await next();
  }

  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    // MongoDB ObjectID 与传入的 ID 比较时需要转型一下
    if (!me.following.map((id) => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }

  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    const index = me.following.map((id) => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}

module.exports = new UsersCtl();
