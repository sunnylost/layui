# layui
layui 修改版

修改自 [layui](https://github.com/sentsin/layui/)

## 修改内容

### form

- 修复验证时，获取的 `value` 值为 `null` 的 bug

### table

- 当前实例增加 `table` 对象
- 增加 `expand` 类型的列，可以展开当前行
- 增加 ` getChecked()` 获取所有被选中的行数据
- 增加 `deleteRow(index)` 删除指定行
- `response` 属性支持传入 `a.b` 的形式来进行数据格式转换
- 增加 `cellSpan` 方法来实现单元格合并
- 增加 `globalCheck` 选项来实现跨页保持选中
- 增加列的自适应

### tree

- 增加 `accordion` 选项