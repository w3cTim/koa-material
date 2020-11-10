const Topics = require("../models/topics");
const { queryFields } = require("../util");

class TopicsCtl {
  async find(ctx) {
    const { pagesize = 10, pageindex = 1, q } = ctx.query;
    const pageIndex = Math.max(pageindex * 1, 1) - 1;
    const pageSize = Math.max(pagesize * 1, 1);

    // mongoos 使用正值处理模糊查询
    ctx.body = await Topics.find({ name: new RegExp(q) })
      .limit(pageSize)
      .skip(pageIndex * pageSize);
  }

  async findById(ctx) {
    console.log(ctx.query);
    const selectFields = queryFields(ctx.query);
    console.log(selectFields);
    const topic = await Topics.findById(ctx.params.id).select(selectFields);
    ctx.body = topic;
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });

    const topic = await new Topics(ctx.request.body).save();
    ctx.body = topic;
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });
    const topic = await Topics.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = topic;
  }
}

module.exports = new TopicsCtl();
