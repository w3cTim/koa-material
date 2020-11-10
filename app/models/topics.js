const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const topicsSchema = new Schema({
  // 隐藏 MongoDB 默认带的 __v 字段
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  avatar_url: { type: String },
  introduction: { type: String, select: false },
});

module.exports = model("topics_koa", topicsSchema);
