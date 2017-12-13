/**
 @Name：layui.table 表格操作
 @Author：贤心
 @License：MIT

 */

layui.define(['laytpl', 'laypage', 'layer', 'form'], function(exports) {
    'use strict'

    const MOD_NAME = 'table'
    const ELEM = '.layui-table'
    const HIDE = 'layui-hide'
    const NONE = 'layui-none'
    const ELEM_VIEW = 'layui-table-view'
    const ELEM_HEADER = '.layui-table-header'
    const ELEM_BODY = '.layui-table-body'
    const ELEM_MAIN = '.layui-table-main'
    const ELEM_FIXED = '.layui-table-fixed'
    const ELEM_FIXL = '.layui-table-fixed-l'
    const ELEM_FIXR = '.layui-table-fixed-r'
    const ELEM_TOOL = '.layui-table-tool'
    const ELEM_PAGE = '.layui-table-page'
    const ELEM_SORT = '.layui-table-sort'
    const ELEM_EDIT = 'layui-table-edit'
    const ELEM_HOVER = 'layui-table-hover'
    const ROW_EXPANDED = 'layui-row-expanded'
    const BLANK_FN = () => {}

    let $ = layui.$,
        laytpl = layui.laytpl,
        laypage = layui.laypage,
        layer = layui.layer,
        form = layui.form,
        hint = layui.hint(),
        device = layui.device(),
        //外部接口
        table = {
            config: {
                checkName: 'LAY_CHECKED', //是否选中状态的字段名
                indexName: 'LAY_TABLE_INDEX' //下标索引名
            }, //全局配置项
            cache: {}, //数据缓存
            index: layui.table ? layui.table.index + 10000 : 0,

            //设置全局项
            set: function(options) {
                let that = this
                that.config = $.extend({}, that.config, options)
                return that
            },

            //事件监听
            on: function(events, callback) {
                return layui.onevent.call(this, MOD_NAME, events, callback)
            }
        },
        //thead区域模板
        TPL_HEADER = function(options) {
            options = options || {}

            let rowCols =
                '{{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}}'

            let setSkin = '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }}'
            let setSize = '{{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }}'
            let setEven = '{{# if(d.data.even){ }}lay-even{{# } }}'
            let generateFixed =
                `{{# layui.each(item1, function(i2, item2){
                                    if(item2.fixed && item2.fixed !== "right"){ left = true; }
                                    if(item2.fixed === "right"){ right = true; } }}` +
                (function() {
                    if (options.fixed) {
                        if (options.fixed === 'right') {
                            return '{{# if(item2.fixed === "right"){ }}'
                        } else {
                            return '{{# if(item2.fixed && item2.fixed !== "right"){ }}'
                        }
                    }

                    return ''
                })()

            let generateCell = `<div class="layui-table-cell laytable-cell-{{# if(item2.colspan > 1){ }}group{{# } else { }}{{d.index}}-{{item2.field || i2}}{{# if(item2.type !== "normal"){ }} laytable-cell-{{ item2.type }}{{# } }}{{# } }}" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>
    {{# if(item2.type === "checkbox"){ }}
    <input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose" {{# if(item2[d.data.checkName]){ }}checked{{# }; }}>
    {{# if(item2.title) { }}
    <span class="layui-table-header-text">{{ item2.title }}</span>
    {{# } }}
    {{# } else { }}
    <span>{{item2.title||""}}</span>
        {{# if(!(item2.colspan > 1) && item2.sort){ }}
        <span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc"></i><i class="layui-edge layui-table-sort-desc"></i></span>
        {{# } }}
    {{# } }}</div>`

            return [
                `<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ${setSkin} ${
                    setSize
                } ${setEven}><thead>`,
                '{{# layui.each(d.data.cols, function(i1, item1){ }}',
                '<tr>',
                generateFixed,
                '<th data-field="{{ item2.field||i2 }}" {{# if(item2.minWidth){ }}data-minwidth="{{item2.minWidth}}"{{# } }} ' +
                    rowCols +
                    ' {{# if(item2.unresize){ }}data-unresize="true"{{# } }}',
                ' {{# if(item2.hide){ }}class="layui-hide"{{# } }}>',
                generateCell,
                '</th>',
                options.fixed ? '{{# }; }}' : '',
                '{{# }); }}',
                '</tr>',
                '{{# }); }}',
                '</thead>',
                '</table>'
            ].join('')
        },
        //tbody区域模板
        TPL_BODY = [
            '<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ',
            '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>',
            '<tbody></tbody>',
            '</table>'
        ].join(''),
        //主模板
        TPL_MAIN = [
            '<div class="layui-form layui-border-box {{d.VIEW_CLASS}}" lay-filter="LAY-table-{{d.index}}" style="{{# if(d.data.width){ }}width:{{d.data.width}}px;{{# } }} {{# if(d.data.height){ }}height:{{d.data.height}}px;{{# } }}">',

            '{{# if(d.data.toolbar){ }}',
            '<div class="layui-table-tool"></div>',
            '{{# } }}',

            '<div class="layui-table-box">',
            '{{# var left, right; }}',
            '<div class="layui-table-header">',
            TPL_HEADER(),
            '</div>',
            '<div class="layui-table-body layui-table-main">',
            TPL_BODY,
            '</div>',

            '{{# if(left){ }}',
            '<div class="layui-table-fixed layui-table-fixed-l">',
            '<div class="layui-table-header">',
            TPL_HEADER({ fixed: true }),
            '</div>',
            '<div class="layui-table-body">',
            TPL_BODY,
            '</div>',
            '</div>',
            '{{# }; }}',

            '{{# if(right){ }}',
            '<div class="layui-table-fixed layui-table-fixed-r">',
            '<div class="layui-table-header">',
            TPL_HEADER({ fixed: 'right' }),
            '<div class="layui-table-mend"></div>',
            '</div>',
            '<div class="layui-table-body">',
            TPL_BODY,
            '</div>',
            '</div>',
            '{{# }; }}',
            '</div>',

            '{{# if(d.data.page){ }}',
            '<div class="layui-table-page">',
            '<div id="layui-table-page{{d.index}}"></div>',
            '</div>',
            '{{# } }}',

            '<style>',
            '{{# layui.each(d.data.cols, function(i1, item1){',
            'layui.each(item1, function(i2, item2){ }}',
            '.laytable-cell-{{d.index}}-{{item2.field||i2}}{ ',
            '{{# if(item2.width){ }}',
            'width: {{item2.width}}px;',
            '{{# } }}',
            ' }',
            '{{# });',
            '}); }}',
            '</style>',
            '</div>'
        ].join(''),
        _WIN = $(window),
        _DOC = $(document)

    const RESPONSE_PROPS = ['statusName', 'msgName', 'dataName', 'countName']
    /**
     * 获取 obj 上的属性，props 为属性数组
     * @param obj
     * @param props
     * @returns {*}
     */
    function getProp(obj, props) {
        let val = obj[props[0]]

        for (let i = 1; i < props.length; i++) {
            if (val) {
                val = val[props[i]]
            }
        }

        return val
    }

    /**
     * 设置 obj 的属性值，props 为属性数组
     * @param obj
     * @param props
     * @param val
     */
    function setProp(obj, props, val) {
        if (props.length === 1) {
            obj[props[0]] = val
        } else {
            for (let i = 0; i < props.length - 1; i++) {
                if (obj) {
                    obj = obj[props[i]]
                }
            }

            if (obj) {
                obj[props[props.length - 1]] = val
            }
        }
    }
    //构造器
    let Table = function(options) {
        let that = this
        that.index = ++table.index
        that.config = $.extend({}, that.config, table.config, options)
        that.render()
    }

    //默认配置
    Table.prototype.config = {
        limit: 10, //每页显示的数量
        loading: true, //请求数据时，是否显示loading
        cellMinWidth: 60 //所有单元格默认最小宽度
    }

    //表格渲染
    Table.prototype.render = function() {
        let that = this,
            options = that.config

        options.elem = $(options.elem)
        options.where = options.where || {}
        options.id = options.id || options.elem.attr('id')

        if (!options.checked) {
            options.checked = [] //选中
        }

        if (!options.expanded) {
            options.expanded = [] //展开
        }

        //请求参数的自定义格式
        options.request = $.extend(
            {
                pageName: 'page',
                limitName: 'limit'
            },
            options.request
        )

        //响应数据的自定义格式
        options.response = $.extend(
            {
                statusName: 'code',
                statusCode: 0,
                msgName: 'msg',
                dataName: 'data',
                countName: 'count'
            },
            options.response
        )

        let key
        for (let i = 0; i < RESPONSE_PROPS.length; i++) {
            key = RESPONSE_PROPS[i]
            let respVal = options.response[key]

            if (respVal && typeof respVal === 'string') {
                options.response[key] = respVal.split('.')
            }
        }

        //如果 page 传入 laypage 对象
        if (typeof options.page === 'object') {
            options.limit = options.page.limit || options.limit
            options.limits = options.page.limits || options.limits
            that.page = options.page.curr = options.page.curr || 1
            delete options.page.elem
            delete options.page.jump
        }

        if (!options.elem[0]) return that

        that.setArea() //动态分配列宽高

        //开始插入替代元素
        let othis = options.elem,
            hasRender = othis.next('.' + ELEM_VIEW),
            //主容器
            reElem = (that.elem = $(
                laytpl(TPL_MAIN).render({
                    VIEW_CLASS: ELEM_VIEW,
                    data: options,
                    index: that.index //索引
                })
            ))

        options.index = that.index

        //生成替代元素
        hasRender[0] && hasRender.remove() //如果已经渲染，则Rerender
        othis.after(reElem)

        //各级容器
        that.layHeader = reElem.find(ELEM_HEADER)
        that.layMain = reElem.find(ELEM_MAIN)
        that.layBody = reElem.find(ELEM_BODY)
        that.layFixed = reElem.find(ELEM_FIXED)
        that.layFixLeft = reElem.find(ELEM_FIXL)
        that.layFixRight = reElem.find(ELEM_FIXR)
        that.layTool = reElem.find(ELEM_TOOL)
        that.layPage = reElem.find(ELEM_PAGE)

        that.layTool.html(laytpl($(options.toolbar).html() || '').render(options))

        if (options.height) that.fullSize() //设置body区域高度

        //如果多级表头，则填补表头高度
        if (options.cols.length > 1) {
            let th = that.layFixed.find(ELEM_HEADER).find('th')
            th.height(
                that.layHeader.height() -
                    1 -
                    parseFloat(th.css('padding-top')) -
                    parseFloat(th.css('padding-bottom'))
            )
        }

        let arr = (that.resizedColumn = [])
        layui.each(options.cols[0], (i, v) => {
            if (!v.unresize) {
                arr.push(v)
            }
        })

        //请求数据
        that.pullData(that.page)
        that.events()
    }

    //根据列类型，定制化参数
    Table.prototype.initOpts = function(item) {
        let initWidth = {
            checkbox: 48,
            space: 15,
            numbers: 40,
            expand: 48
        }

        //让 type 参数兼容旧版本
        if (item.checkbox) item.type = 'checkbox'
        if (item.space) item.type = 'space'
        if (!item.type) item.type = 'normal'

        if (item.type !== 'normal') {
            item.unresize = true
            item.width = item.width || initWidth[item.type]
        }
    }

    //动态分配列宽高
    Table.prototype.setArea = function() {
        let that = this,
            options = that.config,
            colNums = 0, //列个数
            autoColNums = 0, //自动列宽的列个数
            autoWidth = 0, //自动列分配的宽度
            countWidth = 0, //所有列总宽度和
            cntrWidth =
                options.width ||
                (function() {
                    //获取容器宽度
                    //如果父元素宽度为0（一般为隐藏元素），则继续查找上层元素，直到找到真实宽度为止
                    let getWidth = function(parent) {
                        let width, isNone
                        parent = parent || options.elem.parent()
                        width = parent.width()
                        try {
                            isNone = parent.css('display') === 'none'
                            /* eslint-disable */
                        } catch (e) {}
                        /* eslint-enable */
                        if (parent[0] && (!width || isNone)) return getWidth(parent.parent())
                        return width
                    }
                    return getWidth()
                })()

        //统计列个数
        that.eachCols(function() {
            colNums++
        })

        //减去边框差
        cntrWidth =
            cntrWidth -
            (function() {
                return options.skin === 'line' || options.skin === 'nob' ? 2 : colNums + 1
            })()

        //遍历所有列
        layui.each(options.cols, function(i1, item1) {
            layui.each(item1, function(i2, item2) {
                let width

                if (!item2) {
                    item1.splice(i2, 1)
                    return
                }

                that.initOpts(item2)
                width = item2.width || 0

                if (item2.colspan > 1) return

                if (/\d+%$/.test(width)) {
                    item2.width = width = Math.floor(parseFloat(width) / 100 * cntrWidth)
                } else if (!width) {
                    //列宽未填写
                    item2.width = width = 0
                    autoColNums++
                }

                countWidth = countWidth + width
            })
        })

        that.autoColNums = autoColNums //记录自动列数

        //如果未填充满，则将剩余宽度平分。否则，给未设定宽度的列赋值一个默认宽
        cntrWidth > countWidth &&
            autoColNums &&
            (autoWidth = (cntrWidth - countWidth) / autoColNums)

        layui.each(options.cols, function(i1, item1) {
            layui.each(item1, function(i2, item2) {
                let minWidth = item2.minWidth || options.cellMinWidth
                if (item2.colspan > 1) return
                if (item2.width === 0) {
                    item2.width = Math.floor(autoWidth >= minWidth ? autoWidth : minWidth) //不能低于设定的最小宽度
                }
            })
        })

        //高度铺满：full-差距值
        if (options.height && /^full-\d+$/.test(options.height)) {
            that.fullHeightGap = options.height.split('-')[1]
            options.height = _WIN.height() - that.fullHeightGap
        }
    }

    //表格重载
    Table.prototype.reload = function(options) {
        let config = this.config

        if (config.data && config.data.constructor === Array) {
            delete config.data
        }

        this.config = $.extend({}, config, options)
        this.render()
    }

    //页码
    Table.prototype.page = 1

    //获得数据
    Table.prototype.pullData = function(curr, loadIndex) {
        let that = this,
            options = that.config,
            request = options.request,
            response = options.response,
            sort = function() {
                if (typeof options.initSort === 'object') {
                    that.sort(options.initSort.field, options.initSort.type)
                }
            }

        that.startTime = new Date().getTime() //渲染开始时间

        if (options.url) {
            //Ajax请求
            let params = {}
            params[request.pageName] = curr
            params[request.limitName] = options.limit

            $.ajax({
                type: options.method || 'get',
                url: options.url,
                data: $.extend(params, options.where),
                dataType: 'json',
                success: function(res) {
                    if (getProp(res, response.statusName) != response.statusCode) {
                        that.renderForm()
                        return that.layMain.html(
                            '<div class="' +
                                NONE +
                                '">' +
                                (getProp(res, response.msgName) || '返回的数据状态异常') +
                                '</div>'
                        )
                    }
                    that.renderData(res, curr, getProp(res, response.countName)), sort()
                    options.time = new Date().getTime() - that.startTime + ' ms' //耗时（接口请求+视图渲染）
                    loadIndex && layer.close(loadIndex)
                    typeof options.done === 'function' &&
                        options.done(res, curr, getProp(res, response.countName))
                },
                error: function() {
                    that.layMain.html('<div class="' + NONE + '">数据接口请求异常</div>')
                    that.renderForm()
                    loadIndex && layer.close(loadIndex)
                }
            })
        } else if (options.data && options.data.constructor === Array) {
            //已知数据
            let res = {},
                startLimit = curr * options.limit - options.limit

            setProp(res, response.dataName, options.data.concat().splice(startLimit, options.limit))
            setProp(res, response.countName, options.data.length)

            that.renderData(res, curr, options.data.length)
            sort()
            typeof options.done === 'function' &&
                options.done(res, curr, getProp(res, response.countName))
        }
    }

    //遍历表头
    Table.prototype.eachCols = function(callback) {
        let cols = $.extend(true, [], this.config.cols),
            arrs = [],
            index = 0

        //重新整理表头结构
        layui.each(cols, function(i1, item1) {
            layui.each(item1, function(i2, item2) {
                //如果是组合列，则捕获对应的子列
                if (item2.colspan > 1) {
                    let childIndex = 0
                    index++
                    item2.CHILD_COLS = []
                    layui.each(cols[i1 + 1], function(i22, item22) {
                        if (item22.PARENT_COL || childIndex == item2.colspan) return
                        item22.PARENT_COL = index
                        item2.CHILD_COLS.push(item22)
                        childIndex = childIndex + (item22.colspan > 1 ? item22.colspan : 1)
                    })
                }
                if (item2.PARENT_COL) return //如果是子列，则不进行追加，因为已经存储在父列中
                arrs.push(item2)
            })
        })

        //重新遍历列，如果有子列，则进入递归
        let eachArrs = function(obj) {
            layui.each(obj || arrs, function(i, item) {
                if (item.CHILD_COLS) return eachArrs(item.CHILD_COLS)
                return callback(i, item)
            })
        }

        eachArrs()
    }

    function getSpan(fn, row, column, rowIndex, columnIndex) {
        let rowspan = 1
        let colspan = 1

        let ret = fn(row, column, rowIndex, columnIndex)

        if (ret) {
            rowspan = ret.rowspan || 0
            colspan = ret.colspan || 0
        }

        return {
            rowspan,
            colspan
        }
    }

    //数据渲染
    Table.prototype.renderData = function(res, curr, count, sort) {
        let that = this,
            options = that.config,
            data = getProp(res, options.response.dataName) || [],
            trs = [],
            trs_fixed = [],
            trs_fixed_r = [],
            //渲染视图
            render = function() {
                //后续性能提升的重点
                if (!sort && that.sortKey) {
                    return that.sort(that.sortKey.field, that.sortKey.sort, true)
                }

                let cellSpan = options.cellSpan || BLANK_FN

                layui.each(data, function(i1, item1) {
                    let tds = [],
                        tds_fixed = [],
                        tds_fixed_r = [],
                        numbers = i1 + options.limit * (curr - 1) + 1 //序号

                    if (item1.length === 0) return
                    if (!sort) {
                        item1[table.config.indexName] = i1
                    }

                    that.eachCols(function(i3, item3) {
                        let field = item3.field || i3,
                            content = item1[field]

                        if (content === undefined || content === null) content = ''
                        if (item3.colspan > 1) return

                        let span = getSpan(cellSpan, item1, item3, i1, i3)

                        if (!span.rowspan || !span.colspan) {
                            return
                        }

                        let colspan = ''
                        let rowspan = ''

                        if (span.colspan !== 1) {
                            colspan = 'colspan=' + span.colspan
                        }

                        if (span.rowspan !== 1) {
                            rowspan = 'rowspan=' + span.rowspan
                        }

                        let attr = []

                        if (item3.hide) {
                            //是否允许单元格编辑
                            attr.push('class="layui-hide"')
                        }

                        if (item3.edit) {
                            //是否允许单元格编辑
                            attr.push('data-edit="' + item3.edit + '"')
                        }

                        if (item3.align) {
                            //对齐方式
                            attr.push('align="' + item3.align + '"')
                        }

                        if (item3.templet) {
                            //自定义模板
                            attr.push('data-content="' + content + '"')
                        }

                        if (item3.toolbar) {
                            //自定义模板
                            attr.push('data-off="true"')
                        }

                        if (item3.event) {
                            //自定义事件
                            attr.push('lay-event="' + item3.event + '"')
                        }

                        if (item3.style) {
                            //自定义样式
                            attr.push('style="' + item3.style + '"')
                        }

                        if (item3.minWidth) {
                            //单元格最小宽度
                            attr.push('data-minwidth="' + item3.minWidth + '"')
                        }

                        //td内容
                        let td = [
                            '<td data-field="' + field + '" ' + attr.join(' '),
                            colspan,
                            rowspan,
                            '>',
                            '<div class="layui-table-cell laytable-cell-' +
                                (function() {
                                    //返回对应的CSS类标识
                                    let str = options.index + '-' + field
                                    return item3.type === 'normal'
                                        ? str
                                        : str + ' laytable-cell-' + item3.type
                                })() +
                                '">' +
                                (function() {
                                    let tplData = $.extend(
                                        true,
                                        {
                                            LAY_INDEX: numbers
                                        },
                                        item1
                                    )

                                    //渲染复选框列视图
                                    if (item3.type === 'checkbox') {
                                        return (
                                            '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" ' +
                                            (function() {
                                                let globalChecked = that.config.checked || []
                                                let checkName = table.config.checkName
                                                let key = that.config.globalCheck

                                                //如果是全选
                                                if (item3[checkName]) {
                                                    item1[checkName] = item3[checkName]

                                                    if (item3[checkName]) {
                                                        if (
                                                            key &&
                                                            globalChecked.indexOf(item3) === -1
                                                        ) {
                                                            globalChecked.push(tplData[key])
                                                        }
                                                        return 'checked'
                                                    } else {
                                                        return ''
                                                    }
                                                }

                                                if (
                                                    key &&
                                                    globalChecked.indexOf(tplData[key]) !== -1
                                                ) {
                                                    return 'checked'
                                                }

                                                return tplData[checkName] ? 'checked' : ''
                                            })() +
                                            '>'
                                        )
                                    } else if (item3.type === 'numbers') {
                                        //渲染序号
                                        return numbers
                                    } else if (item3.type === 'expand') {
                                        //渲染展开按钮
                                        return '<i class="layui-icon layui-table-expand" name="layTableExpand" lay-filter="layTableExpandCurrentRow">&#xe602;</i>'
                                    }

                                    //解析工具列模板
                                    if (item3.toolbar) {
                                        return laytpl($(item3.toolbar).html() || '').render(tplData)
                                    }

                                    if (item3.templet) {
                                        return laytpl(
                                            $(item3.templet).html() || String(content)
                                        ).render(tplData)
                                    } else {
                                        return content
                                    }
                                })(),
                            '</div></td>'
                        ].join('')

                        tds.push(td)
                        if (item3.fixed && item3.fixed !== 'right') tds_fixed.push(td)
                        if (item3.fixed === 'right') tds_fixed_r.push(td)
                    })

                    trs.push('<tr data-index="' + i1 + '">' + tds.join('') + '</tr>')
                    trs_fixed.push('<tr data-index="' + i1 + '">' + tds_fixed.join('') + '</tr>')
                    trs_fixed_r.push(
                        '<tr data-index="' + i1 + '">' + tds_fixed_r.join('') + '</tr>'
                    )
                })

                that.layBody.scrollTop(0)
                that.layMain.find('.' + NONE).remove()
                that.layMain.find('tbody').html(trs.join(''))
                that.layFixLeft.find('tbody').html(trs_fixed.join(''))
                that.layFixRight.find('tbody').html(trs_fixed_r.join(''))

                that.renderForm()
                that.syncCheckAll()
                if (that.haveInit) {
                    that.scrollPatch()
                } else {
                    setTimeout(function() {
                        that.scrollPatch()
                    }, 50)
                }
                that.haveInit = true
                layer.close(that.tipsIndex)
            }

        that.key = options.id || options.index
        table.cache[that.key] = data //记录数据

        //排序
        if (sort) {
            return render()
        }

        if (data.length === 0) {
            that.renderForm()
            that.layFixed.remove()
            that.layMain.find('tbody').html('')
            that.layMain.find('.' + NONE).remove()
            return that.layMain.append('<div class="' + NONE + '">无数据</div>')
        }

        render()

        //同步分页状态
        if (options.page) {
            options.page = $.extend(
                {
                    elem: 'layui-table-page' + options.index,
                    count: count,
                    limit: options.limit,
                    limits: options.limits || [10, 20, 30, 40, 50, 60, 70, 80, 90],
                    groups: 3,
                    layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
                    prev: '<i class="layui-icon">&#xe603;</i>',
                    next: '<i class="layui-icon">&#xe602;</i>',
                    jump: function(obj, first) {
                        if (!first) {
                            //分页本身并非需要做以下更新，下面参数的同步，主要是因为其它处理统一用到了它们
                            //而并非用的是 options.page 中的参数（以确保分页未开启的情况仍能正常使用）
                            that.page = obj.curr //更新页码
                            options.limit = obj.limit //更新每页条数

                            that.pullData(obj.curr, that.loading())
                        }
                    }
                },
                options.page
            )
            options.page.count = count //更新总条数
            laypage.render(options.page)
        }
    }

    //找到对应的列元素
    Table.prototype.getColElem = function(parent, field) {
        let that = this,
            options = that.config
        return parent.eq(0).find('.laytable-cell-' + (options.index + '-' + field) + ':eq(0)')
    }

    //渲染表单
    Table.prototype.renderForm = function(type) {
        form.render(type, 'LAY-table-' + this.index)
    }

    //数据排序
    Table.prototype.sort = function(th, type, pull, formEvent) {
        let that = this,
            field,
            res = {},
            options = that.config,
            filter = options.elem.attr('lay-filter'),
            data = table.cache[that.key],
            thisData

        //字段匹配
        if (typeof th === 'string') {
            that.layHeader.find('th').each(function() {
                let othis = $(this),
                    _field = othis.data('field')
                if (_field === th) {
                    th = othis
                    field = _field
                    return false
                }
            })
        }

        try {
            field = field || th.data('field')

            //如果欲执行的排序已在状态中，则不执行渲染
            if (that.sortKey && !pull) {
                if (field === that.sortKey.field && type === that.sortKey.sort) {
                    return
                }
            }

            let elemSort = that.layHeader
                .find('th .laytable-cell-' + options.index + '-' + field)
                .find(ELEM_SORT)
            that.layHeader
                .find('th')
                .find(ELEM_SORT)
                .removeAttr('lay-sort') //清除其它标题排序状态
            elemSort.attr('lay-sort', type || null)
            that.layFixed.find('th')
        } catch (e) {
            return hint.error('Table modules: Did not match to field')
        }

        //记录排序索引和类型
        that.sortKey = {
            field: field,
            sort: type
        }

        if (type === 'asc') {
            //升序
            thisData = layui.sort(data, field)
        } else if (type === 'desc') {
            //降序
            thisData = layui.sort(data, field, true)
        } else {
            //清除排序
            thisData = layui.sort(data, table.config.indexName)
            delete that.sortKey
        }

        setProp(res, options.response.dataName, thisData)
        that.renderData(res, that.page, that.count, true)
        layer.close(that.tipsIndex)

        if (formEvent) {
            layui.event.call(th, MOD_NAME, 'sort(' + filter + ')', {
                field: field,
                type: type
            })
        }
    }

    //请求loading
    Table.prototype.loading = function() {
        let that = this,
            options = that.config
        if (options.loading && options.url) {
            return layer.msg('数据请求中', {
                icon: 16,
                offset: [
                    that.elem.offset().top + that.elem.height() / 2 - 35 - _WIN.scrollTop() + 'px',
                    that.elem.offset().left + that.elem.width() / 2 - 90 - _WIN.scrollLeft() + 'px'
                ],
                time: -1,
                anim: -1,
                fixed: false
            })
        }
    }

    //同步选中值状态
    Table.prototype.setCheckData = function(index, checked) {
        let that = this,
            options = that.config,
            thisData = table.cache[that.key]
        if (!thisData[index]) return
        if (thisData[index].constructor === Array) return
        thisData[index][options.checkName] = checked
    }

    /**
     * 同步全选按钮状态
     * 可能会有多列存在 checkbox
     */
    Table.prototype.syncCheckAll = function() {
        let that = this,
            options = that.config,
            checkAllElem = that.layHeader.find('input[name="layTableCheckbox"]'),
            syncColsCheck = function(checked) {
                that.eachCols(function(i, item) {
                    if (item.type === 'checkbox') {
                        item[options.checkName] = checked
                    }
                })
                return checked
            }

        if (!checkAllElem[0]) return

        if (table.checkStatus(that.key).isAll) {
            if (!checkAllElem[0].checked) {
                checkAllElem.prop('checked', true)
                that.renderForm('checkbox')
            }
            syncColsCheck(true)
        } else {
            if (checkAllElem[0].checked) {
                checkAllElem.prop('checked', false)
                that.renderForm('checkbox')
            }
            syncColsCheck(false)
        }
    }

    //获取cssRule
    Table.prototype.getCssRule = function(field, callback) {
        let that = this,
            style = that.elem.find('style')[0],
            sheet = style.sheet || style.styleSheet || {},
            rules = sheet.cssRules || sheet.rules
        layui.each(rules, function(i, item) {
            if (item.selectorText === '.laytable-cell-' + that.index + '-' + field) {
                callback(item)
                return true
            }
        })
    }

    //铺满表格主体高度
    Table.prototype.fullSize = function() {
        let that = this,
            options = that.config,
            height = options.height,
            bodyHeight

        if (that.fullHeightGap) {
            height = _WIN.height() - that.fullHeightGap
            if (height < 135) height = 135
            that.elem.css('height', height)
        }

        //tbody区域高度
        bodyHeight = parseFloat(height) - parseFloat(that.layHeader.height()) - 1
        if (options.toolbar) {
            bodyHeight = bodyHeight - that.layTool.outerHeight()
        }
        if (options.page) {
            bodyHeight = bodyHeight - that.layPage.outerHeight() - 1
        }
        that.layMain.css('height', bodyHeight)
    }

    //获取滚动条宽度
    Table.prototype.getScrollWidth = function(elem) {
        let width = 0
        if (elem) {
            width = elem.offsetWidth - elem.clientWidth
        } else {
            elem = document.createElement('div')
            elem.style.width = '100px'
            elem.style.height = '100px'
            elem.style.overflowY = 'scroll'

            document.body.appendChild(elem)
            width = elem.offsetWidth - elem.clientWidth
            document.body.removeChild(elem)
        }
        return width
    }

    //滚动条补丁
    Table.prototype.scrollPatch = function() {
        let that = this,
            layMainTable = that.layMain.children('table'),
            scollWidth = that.layMain.width() - that.layMain.prop('clientWidth'), //纵向滚动条宽度
            scollHeight = that.layMain.height() - that.layMain.prop('clientHeight'), //横向滚动条高度
            getScrollWidth = that.getScrollWidth(that.layMain[0]), //获取主容器滚动条宽度，如果有的话
            outWidth = layMainTable.outerWidth() - that.layMain.width() //表格内容器的超出宽度

        //如果存在自动列宽，则要保证绝对填充满，并且不能出现横向滚动条
        if (that.autoColNums && outWidth < 5 && !that.scrollPatchWStatus) {
            let th = that.layHeader.eq(0).find('thead th:last-child'),
                field = th.data('field')
            that.getCssRule(field, function(item) {
                let width = item.style.width || th.outerWidth()
                item.style.width = parseFloat(width) - getScrollWidth - outWidth + 'px'

                //二次校验，如果仍然出现横向滚动条
                if (that.layMain.height() - that.layMain.prop('clientHeight') > 0) {
                    item.style.width = parseFloat(item.style.width) - 1 + 'px'
                }

                that.scrollPatchWStatus = true
            })
        }

        if (scollWidth && scollHeight) {
            if (!that.elem.find('.layui-table-patch')[0]) {
                let patchElem = $(
                    '<th class="layui-table-patch"><div class="layui-table-cell"></div></th>'
                ) //补丁元素
                patchElem.find('div').css({
                    width: scollWidth
                })
                that.layHeader
                    .eq(0)
                    .find('thead tr')
                    .append(patchElem)
            }
        } else {
            that.layHeader
                .eq(0)
                .find('.layui-table-patch')
                .remove()
        }

        //固定列区域高度
        let mainHeight = that.layMain.height(),
            fixHeight = mainHeight - scollHeight
        that.layFixed
            .find(ELEM_BODY)
            .css('height', layMainTable.height() > fixHeight ? fixHeight : 'auto')

        //表格宽度小于容器宽度时，隐藏固定列
        that.layFixRight[outWidth > 0 ? 'removeClass' : 'addClass'](HIDE)

        //操作栏
        that.layFixRight.css('right', scollWidth - 1)
    }

    //事件处理
    Table.prototype.events = function() {
        let that = this,
            options = that.config,
            _BODY = $('body'),
            dict = {},
            th = that.layHeader.find('th'),
            resizing,
            ELEM_CELL = '.layui-table-cell',
            filter = options.elem.attr('lay-filter')

        let timeoutID = 0

        options.filter = filter

        function setFieldWidth(field, width) {
            clearTimeout(timeoutID)

            setTimeout(() => {
                /**
                 * TODO: 目前不考虑嵌套表头
                 */
                layui.each(that.config.cols[0], (i, v) => {
                    if (v.field === field) {
                        v.width = width
                        return true
                    }
                })
            }, 10)
        }

        //拖拽调整宽度
        th
            .on('mousemove', function(e) {
                let othis = $(this),
                    oLeft = othis.offset().left,
                    pLeft = e.clientX - oLeft
                if (othis.attr('colspan') > 1 || othis.data('unresize') || dict.resizeStart) {
                    return
                }
                dict.allowResize = othis.width() - pLeft <= 10 //是否处于拖拽允许区域
                _BODY.css('cursor', dict.allowResize ? 'col-resize' : '')
            })
            .on('mouseleave', function() {
                if (dict.resizeStart) return
                _BODY.css('cursor', '')
            })
            .on('mousedown', function(e) {
                let othis = $(this)
                if (dict.allowResize) {
                    let field = othis.data('field')
                    e.preventDefault()
                    dict.resizeStart = true //开始拖拽
                    dict.offset = [e.clientX, e.clientY] //记录初始坐标
                    dict.field = field

                    that.getCssRule(field, function(item) {
                        let width = item.style.width || othis.outerWidth()
                        dict.rule = item
                        dict.ruleWidth = parseFloat(width)
                        dict.minWidth = othis.data('minwidth') || options.cellMinWidth
                    })
                }
            })
        //拖拽中
        _DOC
            .on('mousemove', function(e) {
                if (dict.resizeStart) {
                    e.preventDefault()
                    if (dict.rule) {
                        let setWidth = dict.ruleWidth + e.clientX - dict.offset[0]
                        if (setWidth < dict.minWidth) setWidth = dict.minWidth
                        dict.rule.style.width = setWidth + 'px'
                        layer.close(that.tipsIndex)
                        setFieldWidth(dict.field, setWidth)
                    }
                    resizing = 1
                }
            })
            .on('mouseup', function() {
                if (dict.resizeStart) {
                    dict = {}
                    _BODY.css('cursor', '')
                    that.scrollPatch()
                }
                if (resizing === 2) {
                    resizing = null
                }
            })

        //排序
        th
            .on('click', function() {
                let othis = $(this),
                    elemSort = othis.find(ELEM_SORT),
                    nowType = elemSort.attr('lay-sort'),
                    type

                if (!elemSort[0] || resizing === 1) return (resizing = 2)

                if (nowType === 'asc') {
                    type = 'desc'
                } else if (nowType === 'desc') {
                    type = null
                } else {
                    type = 'asc'
                }
                that.sort(othis, type, null, true)
            })
            .find(ELEM_SORT + ' .layui-edge ')
            .on('click', function(e) {
                let othis = $(this),
                    index = othis.index(),
                    field = othis
                        .parents('th')
                        .eq(0)
                        .data('field')
                layui.stope(e)
                if (index === 0) {
                    that.sort(field, 'asc', null, true)
                } else {
                    that.sort(field, 'desc', null, true)
                }
            })

        function updateArray(arr, val, forceAdd) {
            let index = arr.indexOf(val)

            if (index === -1) {
                arr.push(val)
            } else if (!forceAdd) {
                arr.splice(index, 1)
            }
        }

        //复选框选择
        that.elem.on('click', 'input[name="layTableCheckbox"]+', function() {
            let tableCheckArr = that.config.checked
            let key = that.config.globalCheck
            let checkbox = $(this).prev(),
                childs = that.layBody.find('input[name="layTableCheckbox"]'),
                index = checkbox
                    .parents('tr')
                    .eq(0)
                    .data('index'),
                checked = checkbox[0].checked,
                isAll = checkbox.attr('lay-filter') === 'layTableAllChoose'
            let allData = table.cache[that.key] || []
            let data = allData[index] || {}

            //全选
            if (isAll) {
                childs.each(function(i, item) {
                    item.checked = checked
                    let $tr = $(item).parents('tr')
                    that.setCheckData($tr.data('index'), checked)
                })
                that.syncCheckAll()
                that.renderForm('checkbox')
            } else {
                that.setCheckData(index, checked)
                that.syncCheckAll()
            }

            /**
             * TODO:
             * 保存选中的数据，用于跨页显示
             */
            if (key) {
                if (isAll) {
                    layui.each(allData, function(i, v) {
                        updateArray(tableCheckArr, v[key], true)
                    })
                } else {
                    updateArray(tableCheckArr, data[key])
                }
            }

            layui.event.call(this, MOD_NAME, 'checkbox(' + filter + ')', {
                checked: checked,
                data,
                type: isAll ? 'all' : 'one'
            })
        })

        that.elem.on('click', 'i[name="layTableExpand"]', function() {
            let $el = $(this)
            let $tr = $el.parents('tr[data-index]')
            let index = $tr.data('index')

            that.toggleRow(index)
        })

        let hoverTds = []

        //行事件
        that.layBody
            .on('mouseenter', 'tr', function() {
                let othis = $(this),
                    index = othis.index()
                that.layBody.find('tr:eq(' + index + ')').addClass(ELEM_HOVER)
                let $tds = that.layBody.find('td[rowspan]')

                for (let i = 0; i < $tds.length; i++) {
                    let $el = $tds.eq(i)
                    let trIndex = $el.parent().data('index')
                    let rowspan = parseInt($el.attr('rowspan')) - 1

                    if (trIndex <= index && rowspan + trIndex >= index) {
                        $el.addClass(ELEM_HOVER)
                        hoverTds.push($el)
                    }
                }

                layui.event.call(this, MOD_NAME, 'mouseenter(' + that.key + ')', {
                    index,
                    data: table.cache[that.key][index]
                })
            })
            .on('mouseleave', 'tr', function() {
                let othis = $(this),
                    index = othis.index()
                that.layBody.find('tr:eq(' + index + ')').removeClass(ELEM_HOVER)

                if (hoverTds.length) {
                    for (let i = 0; i < hoverTds.length; i++) {
                        hoverTds[i].removeClass(ELEM_HOVER)
                    }
                    hoverTds.length = 0
                }

                layui.event.call(this, MOD_NAME, 'mouseleave(' + that.key + ')', {
                    index,
                    data: table.cache[that.key][index]
                })
            })

        //单元格编辑
        that.layBody
            .on('change', '.' + ELEM_EDIT, function() {
                let othis = $(this),
                    value = this.value,
                    field = othis.parent().data('field'),
                    index = othis
                        .parents('tr')
                        .eq(0)
                        .data('index'),
                    data = table.cache[that.key][index]

                data[field] = value //更新缓存中的值

                layui.event.call(this, MOD_NAME, 'edit(' + filter + ')', {
                    value: value,
                    data: data,
                    field: field
                })
            })
            .on('blur', '.' + ELEM_EDIT, function() {
                let templet,
                    othis = $(this),
                    field = othis.parent().data('field'),
                    index = othis
                        .parents('tr')
                        .eq(0)
                        .data('index'),
                    data = table.cache[that.key][index]
                that.eachCols(function(i, item) {
                    if (item.field == field && item.templet) {
                        templet = item.templet
                    }
                })
                othis
                    .siblings(ELEM_CELL)
                    .html(
                        templet ? laytpl($(templet).html() || this.value).render(data) : this.value
                    )
                othis.parent().data('content', this.value)
                othis.remove()
            })

        //单元格事件
        that.layBody.on('click', 'td', function() {
            let othis = $(this),
                editType = othis.data('edit'),
                elemCell = othis.children(ELEM_CELL)

            layer.close(that.tipsIndex)
            if (othis.data('off')) return

            //显示编辑表单
            if (editType) {
                if (editType === 'select') {
                    //选择框
                    //var select = $('<select class="'+ ELEM_EDIT +'" lay-ignore><option></option></select>');
                    //othis.find('.'+ELEM_EDIT)[0] || othis.append(select);
                } else {
                    //输入框
                    let input = $('<input class="layui-input ' + ELEM_EDIT + '">')
                    input[0].value = othis.data('content') || elemCell.text()
                    othis.find('.' + ELEM_EDIT)[0] || othis.append(input)
                    input.focus()
                }
                return
            }

            //如果出现省略，则可查看更多
            if (elemCell.find('.layui-form-switch,.layui-form-checkbox')[0]) return //限制不出现更多（暂时）

            if (Math.round(elemCell.prop('scrollWidth')) > Math.round(elemCell.outerWidth())) {
                that.tipsIndex = layer.tips(
                    [
                        '<div class="layui-table-tips-main" style="margin-top: -' +
                            (elemCell.height() + 16) +
                            'px;' +
                            (function() {
                                if (options.size === 'sm') {
                                    return 'padding: 4px 15px; font-size: 12px;'
                                }
                                if (options.size === 'lg') {
                                    return 'padding: 14px 15px;'
                                }
                                return ''
                            })() +
                            '">',
                        elemCell.html(),
                        '</div>',
                        '<i class="layui-icon layui-table-tips-c">&#x1006;</i>'
                    ].join(''),
                    elemCell[0],
                    {
                        tips: [3, ''],
                        time: -1,
                        anim: -1,
                        maxWidth: device.ios || device.android ? 300 : 600,
                        isOutAnim: false,
                        skin: 'layui-table-tips',
                        success: function(layero, index) {
                            layero.find('.layui-table-tips-c').on('click', function() {
                                layer.close(index)
                            })
                        }
                    }
                )
            }
        })

        //工具条操作事件
        that.layBody.on('click', '*[lay-event]', function() {
            let othis = $(this),
                index = othis
                    .parents('tr')
                    .eq(0)
                    .data('index'),
                tr = that.layBody.find('tr[data-index="' + index + '"]'),
                ELEM_CLICK = 'layui-table-click',
                data = table.cache[that.key][index]

            layui.event.call(this, MOD_NAME, 'tool(' + filter + ')', {
                data: table.clearCacheKey(data),
                event: othis.attr('lay-event'),
                tr: tr,
                del: function() {
                    table.cache[that.key][index] = []
                    tr.remove()
                    that.scrollPatch()
                },
                update: function(fields) {
                    fields = fields || {}
                    layui.each(fields, function(key, value) {
                        if (key in data) {
                            let templet,
                                td = tr.children('td[data-field="' + key + '"]')
                            data[key] = value
                            that.eachCols(function(i, item2) {
                                if (item2.field == key && item2.templet) {
                                    templet = item2.templet
                                }
                            })
                            td
                                .children(ELEM_CELL)
                                .html(
                                    templet
                                        ? laytpl($(templet).html() || value).render(data)
                                        : value
                                )
                            td.data('content', value)
                        }
                    })
                }
            })
            tr
                .addClass(ELEM_CLICK)
                .siblings('tr')
                .removeClass(ELEM_CLICK)
        })

        //同步滚动条
        that.layMain.on('scroll', function() {
            let othis = $(this),
                scrollLeft = othis.scrollLeft(),
                scrollTop = othis.scrollTop()

            that.layHeader.scrollLeft(scrollLeft)
            that.layFixed.find(ELEM_BODY).scrollTop(scrollTop)

            layer.close(that.tipsIndex)
        })

        _WIN.on('resize', function() {
            //自适应
            that.fullSize()
            !that.config.disableAutoColumn && that.resizeColumn()
        })
    }

    Table.prototype.resizeColumn = function() {
        let cellMinWidth = this.config.cellMinWidth,
            cols = this.resizedColumn,
            colsNum = cols.length,
            layMainTable = this.layMain.children('table'),
            oldWidth = this.layMain.width(),
            offset = layMainTable.outerWidth() - oldWidth //表格内容器的超出宽度

        if (offset === 0) {
            return
        }

        /**
         * 宽度增加，均匀分配给列
         */
        if (offset < 0) {
            offset = Math.abs(offset)
            let extra = parseInt(offset / colsNum)

            layui.each(cols, (i, v) => {
                if (i === colsNum - 1) {
                    v.width += offset - extra * (colsNum - 1)
                } else {
                    v.width += extra
                }
            })
        } else {
            let extra = parseInt(offset / colsNum)

            layui.each(cols, (i, v) => {
                let result

                if (i === colsNum - 1) {
                    result = v.width - offset
                } else {
                    result = v.width - extra
                }

                if (result < v.minWidth || result < cellMinWidth) {
                    return
                }

                v.width = result
                offset -= extra
            })
        }

        for (let i = 0; i < colsNum; i++) {
            this.getCssRule(cols[i].field, item => {
                item.style.width = cols[i].width + 'px'
            })
        }
    }

    Table.prototype.deleteRow = function(index) {
        let $tr = this.layBody.find('tr[data-index="' + index + '"]')

        table.cache[this.key][index] = []
        $tr.remove()
        this.scrollPatch()
    }

    Table.prototype.getChecked = function() {
        let nums = 0,
            invalidNum = 0,
            arr = [],
            data = table.cache[this.key] || []

        //计算全选个数
        layui.each(data, function(i, item) {
            if (item.constructor === Array) {
                invalidNum++ //无效数据，或已删除的
                return
            }
            if (item[table.config.checkName]) {
                nums++
                arr.push(item)
            }
        })
        return {
            data: arr, //选中的数据
            isAll: data.length ? nums === data.length - invalidNum : false //是否全选
        }
    }

    /**
     * TODO: 行展开
     * 指定某些行自动展开
     */
    Table.prototype.toggleRow = function(index) {
        let id = this.key
        let $tr = this.elem.find(`tr[data-index="${index}"]`)
        let $el = $tr.find('.layui-table-expand')
        let tableData = table.cache[id]
        let field = 'expand'
        let templet
        let html
        let isExpand

        this.eachCols(function(i, item) {
            if (item.type === field && item.templet) {
                templet = item.templet
            }
        })

        html = templet ? laytpl($(templet).html() || this.value).render(tableData[index]) : ''

        if ($tr.hasClass(ROW_EXPANDED)) {
            $tr.removeClass(ROW_EXPANDED)
            $el.html('&#xe602;') //right
            $tr.next('tr').remove()
            isExpand = false
        } else {
            $tr.addClass(ROW_EXPANDED)
            $el.html('&#xe61a') //down
            $tr.after(`<tr><td colspan="${this.config.cols[0].length}">${html}</td></tr>`)
            isExpand = true
        }

        layui.event.call(this, MOD_NAME, `expand(${id})`, {
            index,
            data: tableData[index],
            isExpand
        })
    }

    //初始化
    table.init = function(filter, settings) {
        settings = settings || {}
        let that = this,
            elemTable = filter ? $('table[lay-filter="' + filter + '"]') : $(ELEM + '[lay-data]'),
            errorTips = 'Table element property lay-data configuration item has a syntax error: '

        //遍历数据表格
        elemTable.each(function() {
            let othis = $(this),
                tableData = othis.attr('lay-data')

            try {
                tableData = new Function('return ' + tableData)()
            } catch (e) {
                hint.error(errorTips + tableData)
            }

            let cols = [],
                options = $.extend(
                    {
                        elem: this,
                        cols: [],
                        data: [],
                        skin: othis.attr('lay-skin'), //风格
                        size: othis.attr('lay-size'), //尺寸
                        even: typeof othis.attr('lay-even') === 'string' //偶数行背景
                    },
                    table.config,
                    settings,
                    tableData
                )

            filter && othis.hide()

            //获取表头数据
            othis.find('thead>tr').each(function(i) {
                options.cols[i] = []
                $(this)
                    .children()
                    .each(function() {
                        let th = $(this),
                            itemData = th.attr('lay-data')

                        try {
                            itemData = new Function('return ' + itemData)()
                        } catch (e) {
                            return hint.error(errorTips + itemData)
                        }

                        let row = $.extend(
                            {
                                title: th.text(),
                                colspan: th.attr('colspan') || 0, //列单元格
                                rowspan: th.attr('rowspan') || 0 //行单元格
                            },
                            itemData
                        )

                        if (row.colspan < 2) cols.push(row)
                        options.cols[i].push(row)
                    })
            })

            //获取表体数据
            othis.find('tbody>tr').each(function(i1) {
                let tr = $(this),
                    row = {}
                //如果定义了字段名
                tr.children('td').each(function() {
                    let td = $(this),
                        field = td.data('field')
                    if (field) {
                        return (row[field] = td.html())
                    }
                })
                //如果未定义字段名
                layui.each(cols, function(i3, item3) {
                    let td = tr.children('td').eq(i3)
                    row[item3.field] = td.html()
                })
                options.data[i1] = row
            })
            table.render(options)
        })

        return that
    }

    //表格选中状态
    table.checkStatus = function(id) {
        let nums = 0,
            invalidNum = 0,
            arr = [],
            data = table.cache[id]
        if (!data) return {}
        //计算全选个数
        layui.each(data, function(i, item) {
            if (item.constructor === Array) {
                invalidNum++ //无效数据，或已删除的
                return
            }
            if (item[table.config.checkName]) {
                nums++
                arr.push(table.clearCacheKey(item))
            }
        })
        return {
            data: arr, //选中的数据
            isAll: nums === data.length - invalidNum //是否全选
        }
    }

    //表格重载
    table.reload = function(id, options) {
        let config = table.instances[id]
        if (!config) return hint.error('The ID option was not found in the table instance')

        setTimeout(function() {
            layui.event.call(this, MOD_NAME, 'reload(' + id + ')')
        }, 4)

        if (options && options.data && options.data.constructor === Array) {
            delete config.data
        }

        return table.render($.extend(true, {}, config, options))
    }

    //核心入口
    table.render = function(options) {
        let inst = new Table(options)

        let opts = inst.config,
            id = opts.id

        id && (table.instances[id] = opts)

        inst.table = inst

        return inst
    }

    //清除临时Key
    table.clearCacheKey = function(data) {
        data = $.extend({}, data)
        delete data[table.config.checkName]
        delete data[table.config.indexName]
        return data
    }

    table.instances = {}

    //自动完成渲染
    table.init()

    exports(MOD_NAME, table)
})
