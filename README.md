# layui
layui 修改版

修改自 [layui](https://github.com/sentsin/layui/)

## 修改内容

### all

- 修复 `layer` 和 `table` 的内存泄露问题
- 修复 `laytpl` 缓存问题

### form

- 修复验证时，获取的 `value` 值为 `null` 的 bug
- 修复数字验证，增加整数验证 `digit`
- 不验证 `name` 为空或 `disabled` 的元素，同样也不会提交
- 多个同名 `name` 的值会合并为数组
- `select` 可以通过 `data-value` 来设置默认值
- `select` 增加多选
- `render` 增加第三个参数来指定元素的 `filter`
- 修复 `submit` 事件获取不到 `form` 元素的问题

### table

- 当前实例增加 `table` 对象
- 增加 `expand` 类型的列，可以展开当前行
- 增加 ` getChecked()` 获取所有被选中的行数据
- 增加 `deleteRow(index)` 删除指定行
- `response` 属性支持传入 `a.b` 的形式来进行数据格式转换
- 增加 `cellSpan` 方法来实现单元格合并
- 增加 `globalCheck` 选项来实现跨页保持选中
- 增加 `table.select(id)` 来获得列表实例
- 增加列的自适应
- 列增加 `hide` 属性
- 增加列的 `click` 事件
- 增加 `reload` 事件，翻页也会触发
- 增加额外的 `$.ajax` 参数来自定义请求
- 增加行的条纹
- 当获取数据出错时隐藏翻页
- 可以设置列的 `class`
- 可以为 `checkbox` 列设置 `title`
- 增加列的 `mouseenter` 和 `mouseleave` 事件

### tree

- 增加 `accordion` 选项