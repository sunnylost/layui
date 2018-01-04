/** layui-v2.2.4 MIT License By http://www.layui.com */
 ;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

layui.define(['laytpl', 'laypage', 'layer', 'form'], function (exports) {
    'use strict';

    var MOD_NAME = 'table';
    var ELEM = '.layui-table';
    var HIDE = 'layui-hide';
    var NONE = 'layui-none';
    var ELEM_VIEW = 'layui-table-view';
    var ELEM_HEADER = '.layui-table-header';
    var ELEM_BODY = '.layui-table-body';
    var ELEM_MAIN = '.layui-table-main';
    var ELEM_FIXED = '.layui-table-fixed';
    var ELEM_FIXL = '.layui-table-fixed-l';
    var ELEM_FIXR = '.layui-table-fixed-r';
    var ELEM_TOOL = '.layui-table-tool';
    var ELEM_PAGE = '.layui-table-page';
    var ELEM_SORT = '.layui-table-sort';
    var ELEM_EDIT = 'layui-table-edit';
    var ELEM_HOVER = 'layui-table-hover';
    var ROW_EXPANDED = 'layui-row-expanded';
    var BLANK_FN = function BLANK_FN() {};

    var $ = layui.$,
        laytpl = layui.laytpl,
        laypage = layui.laypage,
        layer = layui.layer,
        form = layui.form,
        hint = layui.hint(),
        device = layui.device(),
        table = {
        config: {
            checkName: 'LAY_CHECKED',
            indexName: 'LAY_TABLE_INDEX' },
        cache: {},
        index: layui.table ? layui.table.index + 10000 : 0,

        set: function set(options) {
            var that = this;
            that.config = $.extend({}, that.config, options);
            return that;
        },

        on: function on(events, callback) {
            return layui.onevent.call(this, MOD_NAME, events, callback);
        }
    },
        TPL_HEADER = function TPL_HEADER(options) {
        options = options || {};

        var rowCols = '{{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}}';

        var setSkin = '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }}';
        var setSize = '{{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }}';
        var setEven = '{{# if(d.data.even){ }}lay-even{{# } }}';
        var generateFixed = '{{# layui.each(item1, function(i2, item2){\n                                    if(item2.fixed && item2.fixed !== "right"){ left = true; }\n                                    if(item2.fixed === "right"){ right = true; } }}' + function () {
            if (options.fixed) {
                if (options.fixed === 'right') {
                    return '{{# if(item2.fixed === "right"){ }}';
                } else {
                    return '{{# if(item2.fixed && item2.fixed !== "right"){ }}';
                }
            }

            return '';
        }();

        var generateCell = '<div class="layui-table-cell laytable-cell-{{# if(item2.colspan > 1){ }}group{{# } else { }}{{d.index}}-{{item2.field || i2}}{{# if(item2.type !== "normal"){ }} laytable-cell-{{ item2.type }}{{# } }}{{# } }}" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>\n    {{# if(item2.type === "checkbox"){ }}\n    <input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose" {{# if(item2[d.data.checkName]){ }}checked{{# }; }}>\n    {{# if(item2.title) { }}\n    <span class="layui-table-header-text">{{ item2.title }}</span>\n    {{# } }}\n    {{# } else { }}\n    <span>{{item2.title||""}}</span>\n        {{# if(!(item2.colspan > 1) && item2.sort){ }}\n        <span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc"></i><i class="layui-edge layui-table-sort-desc"></i></span>\n        {{# } }}\n    {{# } }}</div>';

        return ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ' + setSkin + ' ' + setSize + ' ' + setEven + '><thead>', '{{# layui.each(d.data.cols, function(i1, item1){ }}', '<tr>', generateFixed, '<th data-field="{{ item2.field||i2 }}" {{# if(item2.minWidth){ }}data-minwidth="{{item2.minWidth}}"{{# } }} ' + rowCols + ' {{# if(item2.unresize){ }}data-unresize="true"{{# } }}', ' {{# if(item2.hide){ }}class="layui-hide"{{# } }}>', generateCell, '</th>', options.fixed ? '{{# }; }}' : '', '{{# }); }}', '</tr>', '{{# }); }}', '</thead>', '</table>'].join('');
    },
        TPL_BODY = ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ', '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>', '<tbody></tbody>', '</table>'].join(''),
        TPL_MAIN = ['<div class="layui-form layui-border-box {{d.VIEW_CLASS}}" lay-filter="LAY-table-{{d.index}}" style="{{# if(d.data.width){ }}width:{{d.data.width}}px;{{# } }} {{# if(d.data.height){ }}height:{{d.data.height}}px;{{# } }}">', '{{# if(d.data.toolbar){ }}', '<div class="layui-table-tool"></div>', '{{# } }}', '<div class="layui-table-box">', '{{# var left, right; }}', '<div class="layui-table-header">', TPL_HEADER(), '</div>', '<div class="layui-table-body layui-table-main">', TPL_BODY, '</div>', '{{# if(left){ }}', '<div class="layui-table-fixed layui-table-fixed-l">', '<div class="layui-table-header">', TPL_HEADER({ fixed: true }), '</div>', '<div class="layui-table-body">', TPL_BODY, '</div>', '</div>', '{{# }; }}', '{{# if(right){ }}', '<div class="layui-table-fixed layui-table-fixed-r">', '<div class="layui-table-header">', TPL_HEADER({ fixed: 'right' }), '<div class="layui-table-mend"></div>', '</div>', '<div class="layui-table-body">', TPL_BODY, '</div>', '</div>', '{{# }; }}', '</div>', '{{# if(d.data.page){ }}', '<div class="layui-table-page">', '<div id="layui-table-page{{d.index}}"></div>', '</div>', '{{# } }}', '<style>', '{{# layui.each(d.data.cols, function(i1, item1){', 'layui.each(item1, function(i2, item2){ }}', '.laytable-cell-{{d.index}}-{{item2.field||i2}}{ ', '{{# if(item2.width){ }}', 'width: {{item2.width}}px;', '{{# } }}', ' }', '{{# });', '}); }}', '</style>', '</div>'].join(''),
        _WIN = $(window),
        _DOC = $(document);

    var RESPONSE_PROPS = ['statusName', 'msgName', 'dataName', 'countName'];

    function getProp(obj, props) {
        var val = obj[props[0]];

        for (var i = 1; i < props.length; i++) {
            if (val) {
                val = val[props[i]];
            }
        }

        return val;
    }

    function setProp(obj, props, val) {
        if (props.length === 1) {
            obj[props[0]] = val;
        } else {
            for (var i = 0; i < props.length - 1; i++) {
                var key = props[i];

                if (!obj[key]) {
                    obj[key] = {};
                }

                obj = obj[key];
            }

            if (obj) {
                obj[props[props.length - 1]] = val;
            }
        }
    }

    var Table = function Table(options) {
        var that = this;
        that.index = ++table.index;
        that.config = $.extend({}, that.config, table.config, options);
        that._handlers = [];
        that.render();
    };

    Table.prototype.config = {
        limit: 10,
        loading: true,
        cellMinWidth: 60 };

    Table.prototype.render = function () {
        var that = this;
        var options = that.config;
        var globalCheck = options.globalCheck;

        options.elem = $(options.elem);
        options.where = options.where || {};
        options.id = options.id || options.elem.attr('id');
        options.checkedMap = {};

        var checked = options.checked;
        var checkedMap = options.checkedMap;

        if (!checked) {
            checked = options.checked = [];
        }

        for (var i = 0; i < checked.length; i++) {
            var item = checked[i];
            checkedMap[item[globalCheck]] = item;
        }

        if (!options.expanded) {
            options.expanded = [];
        }

        options.request = $.extend({
            pageName: 'page',
            limitName: 'limit'
        }, options.request);

        options.response = $.extend({
            statusName: 'code',
            statusCode: 0,
            msgName: 'msg',
            dataName: 'data',
            countName: 'count'
        }, options.response);

        var key = void 0;
        for (var _i = 0; _i < RESPONSE_PROPS.length; _i++) {
            key = RESPONSE_PROPS[_i];
            var respVal = options.response[key];

            if (respVal && typeof respVal === 'string') {
                options.response[key] = respVal.split('.');
            }
        }

        if (_typeof(options.page) === 'object') {
            options.limit = options.page.limit || options.limit;
            options.limits = options.page.limits || options.limits;
            that.page = options.page.curr = options.page.curr || 1;
            delete options.page.elem;
            delete options.page.jump;
        }

        if (!options.elem[0]) return that;

        that.setArea();
        var othis = options.elem,
            hasRender = othis.next('.' + ELEM_VIEW),
            reElem = that.elem = $(laytpl(TPL_MAIN).render({
            VIEW_CLASS: ELEM_VIEW,
            data: options,
            index: that.index }));

        options.index = that.index;

        hasRender[0] && hasRender.remove();
        othis.after(reElem);

        that.layHeader = reElem.find(ELEM_HEADER);
        that.layMain = reElem.find(ELEM_MAIN);
        that.layBody = reElem.find(ELEM_BODY);
        that.layFixed = reElem.find(ELEM_FIXED);
        that.layFixLeft = reElem.find(ELEM_FIXL);
        that.layFixRight = reElem.find(ELEM_FIXR);
        that.layTool = reElem.find(ELEM_TOOL);
        that.layPage = reElem.find(ELEM_PAGE);

        that.layTool.html(laytpl($(options.toolbar).html() || '').render(options));

        if (options.height) that.fullSize();
        if (options.cols.length > 1) {
            var th = that.layFixed.find(ELEM_HEADER).find('th');
            th.height(that.layHeader.height() - 1 - parseFloat(th.css('padding-top')) - parseFloat(th.css('padding-bottom')));
        }

        var arr = that.resizedColumn = [];
        layui.each(options.cols[0], function (i, v) {
            if (!v.unresize) {
                arr.push(v);
            }
        });

        that.pullData(that.page);
        that.events();
    };

    Table.prototype.initOpts = function (item) {
        var initWidth = {
            checkbox: 48,
            space: 15,
            numbers: 40,
            expand: 48
        };

        if (item.checkbox) item.type = 'checkbox';
        if (item.space) item.type = 'space';
        if (!item.type) item.type = 'normal';

        if (item.type !== 'normal') {
            item.unresize = true;
            item.width = item.width || initWidth[item.type];
        }
    };

    Table.prototype.setArea = function () {
        var that = this,
            options = that.config,
            colNums = 0,
            autoColNums = 0,
            autoWidth = 0,
            countWidth = 0,
            cntrWidth = options.width || function () {
            var getWidth = function getWidth(parent) {
                var width = void 0,
                    isNone = void 0;
                parent = parent || options.elem.parent();
                width = parent.width();
                try {
                    isNone = parent.css('display') === 'none';
                } catch (e) {}

                if (parent[0] && (!width || isNone)) return getWidth(parent.parent());
                return width;
            };
            return getWidth();
        }();

        that.eachCols(function () {
            colNums++;
        });

        cntrWidth = cntrWidth - function () {
            return options.skin === 'line' || options.skin === 'nob' ? 2 : colNums + 1;
        }();

        layui.each(options.cols, function (i1, item1) {
            layui.each(item1, function (i2, item2) {
                var width = void 0;

                if (!item2) {
                    item1.splice(i2, 1);
                    return;
                }

                that.initOpts(item2);
                width = item2.width || 0;

                if (item2.colspan > 1) return;

                if (/\d+%$/.test(width)) {
                    item2.width = width = Math.floor(parseFloat(width) / 100 * cntrWidth);
                } else if (!width) {
                    item2.width = width = 0;
                    autoColNums++;
                }

                countWidth = countWidth + width;
            });
        });

        that.autoColNums = autoColNums;
        cntrWidth > countWidth && autoColNums && (autoWidth = (cntrWidth - countWidth) / autoColNums);

        layui.each(options.cols, function (i1, item1) {
            layui.each(item1, function (i2, item2) {
                var minWidth = item2.minWidth || options.cellMinWidth;
                if (item2.colspan > 1) return;
                if (item2.width === 0) {
                    item2.width = Math.floor(autoWidth >= minWidth ? autoWidth : minWidth);
                }
            });
        });

        if (options.height && /^full-\d+$/.test(options.height)) {
            that.fullHeightGap = options.height.split('-')[1];
            options.height = _WIN.height() - that.fullHeightGap;
        }
    };

    Table.prototype.reload = function (options) {
        var config = this.config;

        if (config.data && config.data.constructor === Array) {
            delete config.data;
        }

        this.config = $.extend({}, config, options);
        this.render();
    };

    Table.prototype.page = 1;

    Table.prototype.pullData = function (curr, loadIndex) {
        var that = this,
            options = that.config,
            request = options.request,
            response = options.response,
            sort = function sort() {
            if (_typeof(options.initSort) === 'object') {
                that.sort(options.initSort.field, options.initSort.type);
            }
        };

        that.startTime = new Date().getTime();

        if (options.data && options.data.constructor === Array) {
            var res = {},
                startLimit = curr * options.limit - options.limit;

            setProp(res, response.dataName, options.data.concat().splice(startLimit, options.limit));
            setProp(res, response.countName, options.data.length);

            that.renderData(res, curr, options.data.length);
            sort();

            if (typeof options.done === 'function') {
                options.done(res, curr, getProp(res, response.countName));
            }
        } else if (options.url) {
            var params = {};
            params[request.pageName] = curr;
            params[request.limitName] = options.limit;

            var opts = {
                type: options.method || 'get',
                url: options.url,
                data: $.extend(params, options.where),
                dataType: 'json',
                success: function success(res) {
                    if (getProp(res, response.statusName) != response.statusCode) {
                        that.renderForm();
                        that.layPage.hide();
                        return that.layMain.html('<div class="' + NONE + '">' + (getProp(res, response.msgName) || '返回的数据状态异常') + '</div>');
                    }
                    that.layPage.show();
                    that.renderData(res, curr, getProp(res, response.countName));
                    sort();
                    options.time = new Date().getTime() - that.startTime + ' ms';
                    loadIndex && layer.close(loadIndex);
                    typeof options.done === 'function' && options.done(res, curr, getProp(res, response.countName));
                },
                error: function error() {
                    that.layMain.html('<div class="' + NONE + '">数据接口请求异常</div>');
                    that.renderForm();
                    loadIndex && layer.close(loadIndex);
                }
            };

            if (options.contentType) {
                opts.contentType = options.contentType;
            }

            if (typeof options.processData !== 'undefined') {
                opts.processData = options.processData;

                if (!opts.processData) {
                    opts.data = JSON.stringify(opts.data);
                }
            }

            $.ajax(opts);
        }
    };

    Table.prototype.eachCols = function (callback) {
        var cols = $.extend(true, [], this.config.cols),
            arrs = [],
            index = 0;

        layui.each(cols, function (i1, item1) {
            layui.each(item1, function (i2, item2) {
                if (item2.colspan > 1) {
                    var childIndex = 0;
                    index++;
                    item2.CHILD_COLS = [];
                    layui.each(cols[i1 + 1], function (i22, item22) {
                        if (item22.PARENT_COL || childIndex == item2.colspan) return;
                        item22.PARENT_COL = index;
                        item2.CHILD_COLS.push(item22);
                        childIndex = childIndex + (item22.colspan > 1 ? item22.colspan : 1);
                    });
                }
                if (item2.PARENT_COL) return;
                arrs.push(item2);
            });
        });

        var eachArrs = function eachArrs(obj) {
            layui.each(obj || arrs, function (i, item) {
                if (item.CHILD_COLS) return eachArrs(item.CHILD_COLS);
                return callback(i, item);
            });
        };

        eachArrs();
    };

    function getSpan(fn, row, column, rowIndex, columnIndex) {
        var rowspan = 1;
        var colspan = 1;

        var ret = fn(row, column, rowIndex, columnIndex);

        if (ret) {
            rowspan = ret.rowspan || 0;
            colspan = ret.colspan || 0;
        }

        return {
            rowspan: rowspan,
            colspan: colspan
        };
    }

    Table.prototype.renderData = function (res, curr, count, sort) {
        var that = this,
            options = that.config,
            data = getProp(res, options.response.dataName) || [],
            trs = [],
            trs_fixed = [],
            trs_fixed_r = [],
            render = function render() {
            if (!sort && that.sortKey) {
                return that.sort(that.sortKey.field, that.sortKey.sort, true);
            }

            var cellSpan = options.cellSpan || BLANK_FN;

            layui.each(data, function (i1, item1) {
                var tds = [],
                    tds_fixed = [],
                    tds_fixed_r = [],
                    numbers = i1 + options.limit * (curr - 1) + 1;

                if (item1.length === 0) return;
                if (!sort) {
                    item1[table.config.indexName] = i1;
                }

                that.eachCols(function (i3, item3) {
                    var field = item3.field || i3,
                        content = item1[field];

                    if (content === undefined || content === null) content = '';
                    if (item3.colspan > 1) return;

                    var span = getSpan(cellSpan, item1, item3, i1, i3);

                    if (!span.rowspan || !span.colspan) {
                        return;
                    }

                    var colspan = '';
                    var rowspan = '';

                    if (span.colspan !== 1) {
                        colspan = 'colspan=' + span.colspan;
                    }

                    if (span.rowspan !== 1) {
                        rowspan = 'rowspan=' + span.rowspan;
                    }

                    var attr = [];
                    var classes = [];

                    if (item3.hide) {
                        classes.push('layui-hide');
                    }

                    if (item3.classes) {
                        classes.push(item3.classes);
                    }

                    if (item3.edit) {
                        attr.push('data-edit="' + item3.edit + '"');
                    }

                    if (item3.align) {
                        attr.push('align="' + item3.align + '"');
                    }

                    if (item3.templet) {
                        attr.push('data-content="' + content + '"');
                    }

                    if (item3.toolbar) {
                        attr.push('data-off="true"');
                    }

                    if (item3.event) {
                        attr.push('lay-event="' + item3.event + '"');
                    }

                    if (item3.style) {
                        attr.push('style="' + item3.style + '"');
                    }

                    if (item3.minWidth) {
                        attr.push('data-minwidth="' + item3.minWidth + '"');
                    }

                    if (classes.length) {
                        attr.push('class="' + classes.join(' ') + '"');
                    }

                    var td = ['<td data-field="' + field + '" ' + attr.join(' '), colspan, rowspan, '>', '<div class="layui-table-cell laytable-cell-' + function () {
                        var str = options.index + '-' + field;
                        return item3.type === 'normal' ? str : str + ' laytable-cell-' + item3.type;
                    }() + '">' + function () {
                        var tplData = $.extend(true, {
                            LAY_INDEX: numbers
                        }, item1);

                        if (item3.type === 'checkbox') {
                            return '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" ' + function () {
                                var globalChecked = that.config.checked || [];
                                var globalCheckedMap = that.config.checkedMap;
                                var checkName = table.config.checkName;
                                var key = that.config.globalCheck;

                                if (item3[checkName]) {
                                    item1[checkName] = item3[checkName];

                                    if (!item3[checkName]) {
                                        return '';
                                    }

                                    if (key && globalChecked.indexOf(item3) === -1) {
                                        var k = tplData[key];
                                        globalChecked.push(k);
                                        globalCheckedMap[k] = tplData;
                                    }
                                    return 'checked';
                                }

                                if (key && globalChecked.indexOf(tplData[key]) !== -1) {
                                    return 'checked';
                                }

                                return tplData[checkName] ? 'checked' : '';
                            }() + '>';
                        } else if (item3.type === 'numbers') {
                            return numbers;
                        } else if (item3.type === 'expand') {
                            return '<i class="layui-icon layui-table-expand" name="layTableExpand" lay-filter="layTableExpandCurrentRow">&#xe602;</i>';
                        }

                        if (item3.toolbar) {
                            return laytpl($(item3.toolbar).html() || '').render(tplData);
                        }

                        if (item3.templet) {
                            return laytpl($(item3.templet).html() || String(content)).render(tplData);
                        } else {
                            return content;
                        }
                    }(), '</div></td>'].join('');

                    tds.push(td);
                    if (item3.fixed && item3.fixed !== 'right') tds_fixed.push(td);
                    if (item3.fixed === 'right') tds_fixed_r.push(td);
                });

                var trClass = i1 % 2 ? 'layui-tr-odd' : 'layui-tr-even';
                trs.push('<tr data-index="' + i1 + '" class="' + trClass + '">' + tds.join('') + '</tr>');
                trs_fixed.push('<tr data-index="' + i1 + '"class="' + trClass + '">' + tds_fixed.join('') + '</tr>');
                trs_fixed_r.push('<tr data-index="' + i1 + '" class="' + trClass + '">' + tds_fixed_r.join('') + '</tr>');
            });

            that.layBody.scrollTop(0);
            that.layMain.find('.' + NONE).remove();
            that.layMain.find('tbody').html(trs.join(''));
            that.layFixLeft.find('tbody').html(trs_fixed.join(''));
            that.layFixRight.find('tbody').html(trs_fixed_r.join(''));

            that.renderForm();
            that.syncCheckAll();
            if (that.haveInit) {
                that.scrollPatch();
            } else {
                setTimeout(function () {
                    that.scrollPatch();
                }, 50);
            }
            that.haveInit = true;
            layer.close(that.tipsIndex);
        };

        that.key = options.id || options.index;
        table.cache[that.key] = data;
        if (sort) {
            return render();
        }

        if (data.length === 0) {
            that.renderForm();
            that.layFixed.remove();
            that.layMain.find('tbody').html('');
            that.layMain.find('.' + NONE).remove();
            return that.layMain.append('<div class="' + NONE + '">无数据</div>');
        }

        render();

        if (options.page) {
            options.page = $.extend({
                elem: 'layui-table-page' + options.index,
                count: count,
                limit: options.limit,
                limits: options.limits || [10, 20, 30, 40, 50, 60, 70, 80, 90],
                groups: 3,
                layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
                prev: '<i class="layui-icon">&#xe603;</i>',
                next: '<i class="layui-icon">&#xe602;</i>',
                jump: function jump(obj, first) {
                    if (!first) {
                        that.page = obj.curr;
                        options.limit = obj.limit;

                        that.pullData(obj.curr, that.loading());
                        setTimeout(function () {
                            layui.event.call(that, MOD_NAME, 'reload(' + that.key + ')');
                        }, 4);
                    }
                }
            }, options.page);
            options.page.count = count;
            laypage.render(options.page);
        }
    };

    Table.prototype.getColElem = function (parent, field) {
        var that = this,
            options = that.config;
        return parent.eq(0).find('.laytable-cell-' + (options.index + '-' + field) + ':eq(0)');
    };

    Table.prototype.renderForm = function (type) {
        form.render(type, 'LAY-table-' + this.index);
    };

    Table.prototype.sort = function (th, type, pull, formEvent) {
        var that = this,
            field = void 0,
            res = {},
            options = that.config,
            filter = options.elem.attr('lay-filter'),
            data = table.cache[that.key],
            thisData = void 0;

        if (typeof th === 'string') {
            that.layHeader.find('th').each(function () {
                var othis = $(this),
                    _field = othis.data('field');
                if (_field === th) {
                    th = othis;
                    field = _field;
                    return false;
                }
            });
        }

        try {
            field = field || th.data('field');

            if (that.sortKey && !pull) {
                if (field === that.sortKey.field && type === that.sortKey.sort) {
                    return;
                }
            }

            var elemSort = that.layHeader.find('th .laytable-cell-' + options.index + '-' + field).find(ELEM_SORT);
            that.layHeader.find('th').find(ELEM_SORT).removeAttr('lay-sort');
            elemSort.attr('lay-sort', type || null);
            that.layFixed.find('th');
        } catch (e) {
            return hint.error('Table modules: Did not match to field');
        }

        that.sortKey = {
            field: field,
            sort: type
        };

        if (type === 'asc') {
            thisData = layui.sort(data, field);
        } else if (type === 'desc') {
            thisData = layui.sort(data, field, true);
        } else {
            thisData = layui.sort(data, table.config.indexName);
            delete that.sortKey;
        }

        setProp(res, options.response.dataName, thisData);
        that.renderData(res, that.page, that.count, true);
        layer.close(that.tipsIndex);

        if (formEvent) {
            layui.event.call(th, MOD_NAME, 'sort(' + filter + ')', {
                field: field,
                type: type
            });
        }
    };

    Table.prototype.loading = function () {
        var that = this,
            options = that.config;
        if (options.loading && options.url) {
            return layer.msg('数据请求中', {
                icon: 16,
                offset: [that.elem.offset().top + that.elem.height() / 2 - 35 - _WIN.scrollTop() + 'px', that.elem.offset().left + that.elem.width() / 2 - 90 - _WIN.scrollLeft() + 'px'],
                time: -1,
                anim: -1,
                fixed: false
            });
        }
    };

    Table.prototype.setCheckData = function (index, checked) {
        var that = this,
            options = that.config,
            thisData = table.cache[that.key];
        if (!thisData[index]) return;
        if (thisData[index].constructor === Array) return;
        thisData[index][options.checkName] = checked;
    };

    Table.prototype.syncCheckAll = function () {
        var that = this,
            options = that.config,
            checkAllElem = that.layHeader.find('input[name="layTableCheckbox"]'),
            syncColsCheck = function syncColsCheck(checked) {
            that.eachCols(function (i, item) {
                if (item.type === 'checkbox') {
                    item[options.checkName] = checked;
                }
            });
            return checked;
        };

        if (!checkAllElem[0]) return;

        if (table.checkStatus(that.key).isAll) {
            if (!checkAllElem[0].checked) {
                checkAllElem.prop('checked', true);
                that.renderForm('checkbox');
            }
            syncColsCheck(true);
        } else {
            if (checkAllElem[0].checked) {
                checkAllElem.prop('checked', false);
                that.renderForm('checkbox');
            }
            syncColsCheck(false);
        }
    };

    Table.prototype.getCssRule = function (field, callback) {
        var that = this,
            style = that.elem.find('style')[0],
            sheet = style.sheet || style.styleSheet || {},
            rules = sheet.cssRules || sheet.rules;
        layui.each(rules, function (i, item) {
            if (item.selectorText === '.laytable-cell-' + that.index + '-' + field) {
                callback(item);
                return true;
            }
        });
    };

    Table.prototype.fullSize = function () {
        var that = this,
            options = that.config,
            height = options.height,
            bodyHeight = void 0;

        if (that.fullHeightGap) {
            height = _WIN.height() - that.fullHeightGap;
            if (height < 135) height = 135;
            that.elem.css('height', height);
        }

        bodyHeight = parseFloat(height) - parseFloat(that.layHeader.height()) - 1;
        if (options.toolbar) {
            bodyHeight = bodyHeight - that.layTool.outerHeight();
        }
        if (options.page) {
            bodyHeight = bodyHeight - that.layPage.outerHeight() - 1;
        }
        that.layMain.css('height', bodyHeight);
    };

    Table.prototype.getScrollWidth = function (elem) {
        var width = 0;
        if (elem) {
            width = elem.offsetWidth - elem.clientWidth;
        } else {
            elem = document.createElement('div');
            elem.style.width = '100px';
            elem.style.height = '100px';
            elem.style.overflowY = 'scroll';

            document.body.appendChild(elem);
            width = elem.offsetWidth - elem.clientWidth;
            document.body.removeChild(elem);
        }
        return width;
    };

    Table.prototype.scrollPatch = function () {
        var that = this,
            layMainTable = that.layMain.children('table'),
            scollWidth = that.layMain.width() - that.layMain.prop('clientWidth'),
            scollHeight = that.layMain.height() - that.layMain.prop('clientHeight'),
            getScrollWidth = that.getScrollWidth(that.layMain[0]),
            outWidth = layMainTable.outerWidth() - that.layMain.width();
        if (that.autoColNums && outWidth < 5 && !that.scrollPatchWStatus) {
            var th = that.layHeader.eq(0).find('thead th:last-child'),
                field = th.data('field');
            that.getCssRule(field, function (item) {
                var width = item.style.width || th.outerWidth();
                item.style.width = parseFloat(width) - getScrollWidth - outWidth + 'px';

                if (that.layMain.height() - that.layMain.prop('clientHeight') > 0) {
                    item.style.width = parseFloat(item.style.width) - 1 + 'px';
                }

                that.scrollPatchWStatus = true;
            });
        }

        if (scollWidth && scollHeight) {
            if (!that.elem.find('.layui-table-patch')[0]) {
                var patchElem = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>');
                patchElem.find('div').css({
                    width: scollWidth
                });
                that.layHeader.eq(0).find('thead tr').append(patchElem);
            }
        } else {
            that.layHeader.eq(0).find('.layui-table-patch').remove();
        }

        var mainHeight = that.layMain.height(),
            fixHeight = mainHeight - scollHeight;
        that.layFixed.find(ELEM_BODY).css('height', layMainTable.height() > fixHeight ? fixHeight : 'auto');

        that.layFixRight[outWidth > 0 ? 'removeClass' : 'addClass'](HIDE);

        that.layFixRight.css('right', scollWidth - 1);
    };

    Table.prototype.events = function () {
        var that = this,
            options = that.config,
            _BODY = $('body'),
            dict = {},
            th = that.layHeader.find('th'),
            resizing = void 0,
            ELEM_CELL = '.layui-table-cell',
            filter = options.elem.attr('lay-filter');

        var timeoutID = 0;

        options.filter = filter;

        function setFieldWidth(field, width) {
            clearTimeout(timeoutID);

            setTimeout(function () {
                layui.each(that.config.cols[0], function (i, v) {
                    if (v.field === field) {
                        v.width = width;
                        return true;
                    }
                });
            }, 10);
        }

        th.on('mousemove', function (e) {
            var othis = $(this),
                oLeft = othis.offset().left,
                pLeft = e.clientX - oLeft;
            if (othis.attr('colspan') > 1 || othis.data('unresize') || dict.resizeStart) {
                return;
            }
            dict.allowResize = othis.width() - pLeft <= 10;
            _BODY.css('cursor', dict.allowResize ? 'col-resize' : '');
        }).on('mouseleave', function () {
            if (dict.resizeStart) return;
            _BODY.css('cursor', '');
        }).on('mousedown', function (e) {
            var othis = $(this);
            if (dict.allowResize) {
                var field = othis.data('field');
                e.preventDefault();
                dict.resizeStart = true;
                dict.offset = [e.clientX, e.clientY];
                dict.field = field;

                that.getCssRule(field, function (item) {
                    var width = item.style.width || othis.outerWidth();
                    dict.rule = item;
                    dict.ruleWidth = parseFloat(width);
                    dict.minWidth = othis.data('minwidth') || options.cellMinWidth;
                });
            }
        });

        that._handlers.push({
            target: th,
            event: 'mousemove mouseleave mousedown'
        });

        var mousemoveHandler = function mousemoveHandler(e) {
            if (dict.resizeStart) {
                e.preventDefault();
                if (dict.rule) {
                    var setWidth = dict.ruleWidth + e.clientX - dict.offset[0];
                    if (setWidth < dict.minWidth) setWidth = dict.minWidth;
                    dict.rule.style.width = setWidth + 'px';
                    layer.close(that.tipsIndex);
                    setFieldWidth(dict.field, setWidth);
                }
                resizing = 1;
            }
        };
        var mouseupHandler = function mouseupHandler() {
            if (dict.resizeStart) {
                dict = {};
                _BODY.css('cursor', '');
                that.scrollPatch();
            }
            if (resizing === 2) {
                resizing = null;
            }
        };

        _DOC.on('mousemove', mousemoveHandler).on('mouseup', mouseupHandler);

        that._handlers.push({
            target: _DOC,
            event: 'mousemove',
            handler: mousemoveHandler
        });
        that._handlers.push({
            target: _DOC,
            event: 'mouseup',
            handler: mouseupHandler
        });

        th.on('click', function () {
            var othis = $(this),
                elemSort = othis.find(ELEM_SORT),
                nowType = elemSort.attr('lay-sort'),
                type = void 0;

            if (!elemSort[0] || resizing === 1) return resizing = 2;

            if (nowType === 'asc') {
                type = 'desc';
            } else if (nowType === 'desc') {
                type = null;
            } else {
                type = 'asc';
            }
            that.sort(othis, type, null, true);
        }).find(ELEM_SORT + ' .layui-edge ').on('click', function (e) {
            var othis = $(this),
                index = othis.index(),
                field = othis.parents('th').eq(0).data('field');
            layui.stope(e);
            if (index === 0) {
                that.sort(field, 'asc', null, true);
            } else {
                that.sort(field, 'desc', null, true);
            }
        });

        that._handlers.push({
            target: th,
            event: 'click'
        });

        function updateArray(arr, data, key, checked, map) {
            var id = data[key];
            var index = arr.indexOf(id);

            if (checked) {
                if (index === -1) {
                    arr.push(id);
                    map[id] = data;
                }
            } else {
                arr.splice(index, 1);
                delete map[id];
            }
        }

        that.elem.on('click', 'input[name="layTableCheckbox"]+', function () {
            var tableCheckArr = that.config.checked;
            var tableCheckMap = that.config.checkedMap;
            var key = that.config.globalCheck;
            var checkbox = $(this).prev(),
                childs = that.layBody.find('input[name="layTableCheckbox"]'),
                index = checkbox.parents('tr').eq(0).data('index'),
                checked = checkbox[0].checked,
                isAll = checkbox.attr('lay-filter') === 'layTableAllChoose';
            var allData = table.cache[that.key] || [];
            var data = allData[index] || {};

            if (isAll) {
                childs.each(function (i, item) {
                    item.checked = checked;
                    var $tr = $(item).parents('tr');
                    that.setCheckData($tr.data('index'), checked);
                });
                that.syncCheckAll();
                that.renderForm('checkbox');
            } else {
                that.setCheckData(index, checked);
                that.syncCheckAll();
            }

            if (key) {
                if (isAll) {
                    layui.each(allData, function (i, v) {
                        updateArray(tableCheckArr, v, key, checked, tableCheckMap);
                    });
                } else {
                    updateArray(tableCheckArr, data, key, checked, tableCheckMap);
                }
            }

            layui.event.call(this, MOD_NAME, 'checkbox(' + filter + ')', {
                checked: checked,
                data: data,
                type: isAll ? 'all' : 'one'
            });
        });

        that.elem.on('click', 'i[name="layTableExpand"]', function () {
            var $el = $(this);
            var $tr = $el.parents('tr[data-index]');
            var index = $tr.data('index');

            that.toggleRow(index);
        });

        that._handlers.push({
            target: that.elem,
            event: 'click'
        });

        var hoverTds = [];

        that.layBody.on('mouseenter', 'tr', function () {
            var othis = $(this),
                index = othis.index();
            that.layBody.find('tr:eq(' + index + ')').addClass(ELEM_HOVER);
            var $tds = that.layBody.find('td[rowspan]');

            for (var i = 0; i < $tds.length; i++) {
                var $el = $tds.eq(i);
                var trIndex = $el.parent().data('index');
                var rowspan = parseInt($el.attr('rowspan')) - 1;

                if (trIndex <= index && rowspan + trIndex >= index) {
                    $el.addClass(ELEM_HOVER);
                    hoverTds.push($el);
                }
            }

            layui.event.call(this, MOD_NAME, 'mouseenter(' + that.key + ')', {
                index: index,
                data: table.cache[that.key][index]
            });
        }).on('mouseleave', 'tr', function () {
            var othis = $(this),
                index = othis.index();
            that.layBody.find('tr:eq(' + index + ')').removeClass(ELEM_HOVER);

            if (hoverTds.length) {
                for (var i = 0; i < hoverTds.length; i++) {
                    hoverTds[i].removeClass(ELEM_HOVER);
                }
                hoverTds.length = 0;
            }

            layui.event.call(this, MOD_NAME, 'mouseleave(' + that.key + ')', {
                index: index,
                data: table.cache[that.key][index]
            });
        }).on('click', 'tr', function () {
            var othis = $(this),
                index = othis.index();

            layui.event.call(this, MOD_NAME, 'click(' + that.key + ')', {
                index: index,
                data: table.cache[that.key][index]
            });
        });

        that.layBody.on('change', '.' + ELEM_EDIT, function () {
            var othis = $(this),
                value = this.value,
                field = othis.parent().data('field'),
                index = othis.parents('tr').eq(0).data('index'),
                data = table.cache[that.key][index];

            data[field] = value;

            layui.event.call(this, MOD_NAME, 'edit(' + filter + ')', {
                value: value,
                data: data,
                field: field
            });
        }).on('blur', '.' + ELEM_EDIT, function () {
            var templet = void 0,
                othis = $(this),
                field = othis.parent().data('field'),
                index = othis.parents('tr').eq(0).data('index'),
                data = table.cache[that.key][index];
            that.eachCols(function (i, item) {
                if (item.field == field && item.templet) {
                    templet = item.templet;
                }
            });
            othis.siblings(ELEM_CELL).html(templet ? laytpl($(templet).html() || this.value).render(data) : this.value);
            othis.parent().data('content', this.value);
            othis.remove();
        });

        that._handlers.push({
            target: that.elem,
            event: 'click'
        });

        that.layBody.on('click', 'td', function () {
            var othis = $(this),
                editType = othis.data('edit'),
                elemCell = othis.children(ELEM_CELL);

            layer.close(that.tipsIndex);
            if (othis.data('off')) return;

            if (editType) {
                if (editType === 'select') {} else {
                    var input = $('<input class="layui-input ' + ELEM_EDIT + '">');
                    input[0].value = othis.data('content') || elemCell.text();
                    othis.find('.' + ELEM_EDIT)[0] || othis.append(input);
                    input.focus();
                }
                return;
            }

            if (elemCell.find('.layui-form-switch,.layui-form-checkbox')[0]) return;

            if (Math.round(elemCell.prop('scrollWidth')) > Math.round(elemCell.outerWidth())) {
                that.tipsIndex = layer.tips(['<div class="layui-table-tips-main" style="margin-top: -' + (elemCell.height() + 16) + 'px;' + function () {
                    if (options.size === 'sm') {
                        return 'padding: 4px 15px; font-size: 12px;';
                    }
                    if (options.size === 'lg') {
                        return 'padding: 14px 15px;';
                    }
                    return '';
                }() + '">', elemCell.html(), '</div>', '<i class="layui-icon layui-table-tips-c">&#x1006;</i>'].join(''), elemCell[0], {
                    tips: [3, ''],
                    time: -1,
                    anim: -1,
                    maxWidth: device.ios || device.android ? 300 : 600,
                    isOutAnim: false,
                    skin: 'layui-table-tips',
                    success: function success(layero, index) {
                        layero.find('.layui-table-tips-c').on('click', function () {
                            layer.close(index);
                        });
                    }
                });
            }
        });

        that.layBody.on('click', '*[lay-event]', function () {
            var othis = $(this),
                index = othis.parents('tr').eq(0).data('index'),
                tr = that.layBody.find('tr[data-index="' + index + '"]'),
                ELEM_CLICK = 'layui-table-click',
                data = table.cache[that.key][index];

            layui.event.call(this, MOD_NAME, 'tool(' + filter + ')', {
                data: table.clearCacheKey(data),
                event: othis.attr('lay-event'),
                tr: tr,
                del: function del() {
                    table.cache[that.key][index] = [];
                    tr.remove();
                    that.scrollPatch();
                },
                update: function update(fields) {
                    fields = fields || {};
                    layui.each(fields, function (key, value) {
                        if (key in data) {
                            var templet = void 0,
                                td = tr.children('td[data-field="' + key + '"]');
                            data[key] = value;
                            that.eachCols(function (i, item2) {
                                if (item2.field == key && item2.templet) {
                                    templet = item2.templet;
                                }
                            });
                            td.children(ELEM_CELL).html(templet ? laytpl($(templet).html() || value).render(data) : value);
                            td.data('content', value);
                        }
                    });
                }
            });
            tr.addClass(ELEM_CLICK).siblings('tr').removeClass(ELEM_CLICK);
        });

        that.layMain.on('scroll', function () {
            var othis = $(this),
                scrollLeft = othis.scrollLeft(),
                scrollTop = othis.scrollTop();

            that.layHeader.scrollLeft(scrollLeft);
            that.layFixed.find(ELEM_BODY).scrollTop(scrollTop);

            layer.close(that.tipsIndex);
        });

        var resizeHandler = function resizeHandler() {
            that.fullSize();
            !that.config.disableAutoColumn && that.resizeColumn();
        };

        _WIN.on('resize', resizeHandler);

        that._handlers.push({
            target: _WIN,
            event: 'resize',
            handler: resizeHandler
        });

        that._handlers.push({
            target: that.layBody,
            event: 'click mouseenter mouseleave change blur'
        });

        that._handlers.push({
            target: that.layMain,
            event: 'scroll'
        });
    };

    Table.prototype.resizeColumn = function () {
        var _this = this;

        var cellMinWidth = this.config.cellMinWidth,
            cols = this.resizedColumn,
            colsNum = cols.length,
            layMainTable = this.layMain.children('table'),
            oldWidth = this.layMain.width(),
            offset = layMainTable.outerWidth() - oldWidth;
        if (!layMainTable.length || !this.config.data || !this.config.data.length || offset === 0) {
            return;
        }

        if (offset < 0) {
            offset = Math.abs(offset);
            var extra = parseInt(offset / colsNum);

            layui.each(cols, function (i, v) {
                if (i === colsNum - 1) {
                    v.width += offset - extra * (colsNum - 1);
                } else {
                    v.width += extra;
                }
            });
        } else {
            var _extra = parseInt(offset / colsNum);

            layui.each(cols, function (i, v) {
                var result = void 0;

                if (i === colsNum - 1) {
                    result = v.width - offset;
                } else {
                    result = v.width - _extra;
                }

                if (result < v.minWidth || result < cellMinWidth) {
                    return;
                }

                v.width = result;
                offset -= _extra;
            });
        }

        var _loop = function _loop(i) {
            _this.getCssRule(cols[i].field, function (item) {
                item.style.width = cols[i].width + 'px';
            });
        };

        for (var i = 0; i < colsNum; i++) {
            _loop(i);
        }
    };

    Table.prototype.deleteRow = function (index) {
        var $tr = this.layBody.find('tr[data-index="' + index + '"]');

        table.cache[this.key][index] = [];
        $tr.remove();
        this.scrollPatch();
    };

    Table.prototype.getChecked = function (isAll) {
        var nums = 0;
        var invalidNum = 0;
        var arr = [];
        var instance = table.instances[this.key];
        var data = table.cache[this.key] || [];

        if (isAll) {
            return {
                data: instance.checkedMap,

                isAll: false
            };
        }

        layui.each(data, function (i, item) {
            if (item.constructor === Array) {
                invalidNum++;
                return;
            }
            if (item[table.config.checkName]) {
                nums++;
                arr.push(item);
            }
        });
        return {
            data: arr,
            isAll: data.length ? nums === data.length - invalidNum : false };
    };

    Table.prototype.toggleRow = function (index) {
        var id = this.key;
        var $tr = this.elem.find('tr[data-index="' + index + '"]');
        var $el = $tr.find('.layui-table-expand');
        var tableData = table.cache[id];
        var field = 'expand';
        var templet = void 0;
        var html = void 0;
        var isExpand = void 0;

        this.eachCols(function (i, item) {
            if (item.type === field && item.templet) {
                templet = item.templet;
            }
        });

        html = templet ? laytpl($(templet).html() || this.value).render(tableData[index]) : '';

        if ($tr.hasClass(ROW_EXPANDED)) {
            $tr.removeClass(ROW_EXPANDED);
            $el.html('&#xe602;');
            $tr.next('tr').remove();
            isExpand = false;
        } else {
            $tr.addClass(ROW_EXPANDED);
            $el.html('&#xe61a');
            $tr.after('<tr><td colspan="' + this.config.cols[0].length + '">' + html + '</td></tr>');
            isExpand = true;
        }

        layui.event.call(this, MOD_NAME, 'expand(' + id + ')', {
            index: index,
            data: tableData[index],
            isExpand: isExpand
        });
    };

    table.init = function (filter, settings) {
        settings = settings || {};
        var that = this,
            elemTable = filter ? $('table[lay-filter="' + filter + '"]') : $(ELEM + '[lay-data]'),
            errorTips = 'Table element property lay-data configuration item has a syntax error: ';

        elemTable.each(function () {
            var othis = $(this),
                tableData = othis.attr('lay-data');

            try {
                tableData = new Function('return ' + tableData)();
            } catch (e) {
                hint.error(errorTips + tableData);
            }

            var cols = [],
                options = $.extend({
                elem: this,
                cols: [],
                data: [],
                skin: othis.attr('lay-skin'),
                size: othis.attr('lay-size'),
                even: typeof othis.attr('lay-even') === 'string' }, table.config, settings, tableData);

            filter && othis.hide();

            othis.find('thead>tr').each(function (i) {
                options.cols[i] = [];
                $(this).children().each(function () {
                    var th = $(this),
                        itemData = th.attr('lay-data');

                    try {
                        itemData = new Function('return ' + itemData)();
                    } catch (e) {
                        return hint.error(errorTips + itemData);
                    }

                    var row = $.extend({
                        title: th.text(),
                        colspan: th.attr('colspan') || 0,
                        rowspan: th.attr('rowspan') || 0 }, itemData);

                    if (row.colspan < 2) cols.push(row);
                    options.cols[i].push(row);
                });
            });

            othis.find('tbody>tr').each(function (i1) {
                var tr = $(this),
                    row = {};

                tr.children('td').each(function () {
                    var td = $(this),
                        field = td.data('field');
                    if (field) {
                        return row[field] = td.html();
                    }
                });

                layui.each(cols, function (i3, item3) {
                    var td = tr.children('td').eq(i3);
                    row[item3.field] = td.html();
                });
                options.data[i1] = row;
            });
            table.render(options);
        });

        return that;
    };

    table.checkStatus = function (id) {
        var nums = 0,
            invalidNum = 0,
            arr = [],
            data = table.cache[id];
        if (!data) return {};

        layui.each(data, function (i, item) {
            if (item.constructor === Array) {
                invalidNum++;
                return;
            }
            if (item[table.config.checkName]) {
                nums++;
                arr.push(table.clearCacheKey(item));
            }
        });
        return {
            data: arr,
            isAll: nums === data.length - invalidNum };
    };

    function clearEventsHandler(table) {
        var handlers = table._handlers;
        for (var i = 0; i < handlers.length; i++) {
            var v = handlers[i];
            v.target.off(v.event, v.handler);
        }
        table._handlers.length = 0;
    }

    table.reload = function (id, options) {
        var config = table.instances[id];
        if (!config) return hint.error('The ID option was not found in the table instance');

        setTimeout(function () {
            layui.event.call(this, MOD_NAME, 'reload(' + id + ')');
        }, 4);

        if (options && options.data && options.data.constructor === Array) {
            delete config.data;
        }

        clearEventsHandler(config.table);

        return table.render($.extend(true, {}, config, options));
    };

    table.render = function (options) {
        var inst = new Table(options);

        var opts = inst.config,
            id = opts.id;

        if (id) {
            table.instances[id] = opts;
            opts.table = inst;
        }

        inst.table = inst;

        return inst;
    };

    table.clearCacheKey = function (data) {
        data = $.extend({}, data);
        delete data[table.config.checkName];
        delete data[table.config.indexName];
        return data;
    };

    table.select = function (id) {
        return this.instances[id] && this.instances[id].table;
    };

    table.instances = {};

    table.init();

    exports(MOD_NAME, table);
});