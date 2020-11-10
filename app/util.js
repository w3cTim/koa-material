module.exports = {
  // 根据传入字段 查询已隐藏的字段
  queryFields: (query) => {
    if (!query || !query.fields) return "";

    const selectFields =
      "+" +
      query.fields.split(";").reduce((a, v) => {
        if (v) {
          a += ` +${v.trim()}`;
        }
        return a;
      });
    return selectFields;
  },
};
