const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    // 隐藏 MongoDB 默认带的 __v 字段
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    age: { type: Number },
    avatar_url: { type: String },
    gender: { type: String, enum: ["male", "female"], default: "male" },
    locations: { type: [{ type: Schema.Types.ObjectId, ref: "topics_koa" }], select: false },
    educations: {
      type: [
        {
          school: { type: Schema.Types.ObjectId, ref: "topics_koa" },
          diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
          entrance_year: { type: Number },
        },
      ],
    },
    following: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "users_koa",
        },
      ],
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = model("users_koa", userSchema);
