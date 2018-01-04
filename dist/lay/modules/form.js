/** layui-v2.2.4 MIT License By http://www.layui.com */
 ;function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

layui.define('layer', function (exports) {
    'use strict';

    var $ = layui.$;
    var layer = layui.layer;
    var hint = layui.hint();
    var device = layui.device();

    var MOD_NAME = 'form',
        ELEM = '.layui-form',
        THIS = 'layui-this',
        HIDE = 'layui-hide',
        DISABLED = 'layui-disabled',
        Form = function Form() {
        this.config = {
            verify: {
                required: [/[\S]+/, '必填项不能为空'],
                phone: [/^1\d{10}$/, '请输入正确的手机号'],
                email: [/^([-a-zA-Z0-9_.])+@(([-a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/, '邮箱格式不正确'],
                url: [/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/, '链接格式不正确'],
                number: function number(value) {
                    value = $.trim(value);
                    if (!value || isNaN(value)) return '只能填写数字';
                },

                digit: function digit(value) {
                    value = $.trim(value);
                    if (!value || isNaN(value) || /[.e]/.test(value)) return '只能填写整数';
                },
                date: [/^(\d{4})[-/](\d|0\d|1[0-2])([-/](\d|0\d|[1-2][0-9]|3[0-1]))*$/, '日期格式不正确'],
                identity: [/(^\d{15}$)|(^\d{17}(x|X|\d)$)/, '请输入正确的身份证号']
            }
        };
    };

    Form.prototype.set = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    };

    Form.prototype.verify = function (settings) {
        var that = this;
        $.extend(true, that.config.verify, settings);
        return that;
    };

    Form.prototype.on = function (events, callback) {
        return layui.onevent.call(this, MOD_NAME, events, callback);
    };

    Form.prototype.render = function (type, filter, elFilter) {
        var that = this,
            elemForm = $(ELEM + (filter ? '[lay-filter="' + filter + '"]' : '')),
            items = {
            select: function select() {
                var cache = {};
                var uuid = 0;

                var TIPS = '请选择',
                    CLASS = 'layui-form-select',
                    TITLE = 'layui-select-title',
                    NONE = 'layui-select-none',
                    CLASS_MULTI = 'layui-form-select-multi',
                    MULTI = 'lay-multi',
                    initValue = '',
                    thatInput = void 0,
                    selects = elemForm.find('select'),
                    layerIndex = -1,
                    layerObj = void 0,
                    hide = function hide(e, clear) {
                    if (!$(e.target).parent().hasClass(TITLE) || clear) {
                        $('.' + CLASS).removeClass(CLASS + 'ed ' + CLASS + 'up');
                        thatInput && initValue && thatInput.val(initValue);
                        layer.close(layerIndex);
                        layerObj = null;
                    }
                    thatInput = null;
                },
                    events = function events(reElem, disabled, isSearch) {
                    var select = $(this);
                    var fieldName = select.attr('name');
                    var title = reElem.find('.' + TITLE);
                    var input = title.find('input');
                    var dl = void 0;
                    var dds = void 0;
                    var uuid = select.data('uuid');
                    var cacheObj = cache[uuid];
                    if (disabled) return;

                    function updateSelectValue($option, type, value) {
                        var $opt = void 0;
                        var val = void 0;

                        if ($option) {
                            $opt = $option && $option.clone();
                            $opt.children().remove();
                            val = $opt.html();
                        }

                        var $input = reElem.find('input');
                        var $div = reElem.find('div.layui-input');

                        if (type === 'add') {
                            $option && $option.addClass(THIS);
                            var _$input = cacheObj.inputs[value] = $('<input type="hidden" name="' + fieldName + '" value="' + value + '">');

                            reElem.append(_$input);

                            var $tag = $('<div class="layui-btn layui-btn-sm layui-btn-primary" lay-value="' + value + '">' + val + '<i class="layui-icon">&#x1006;</i></div>');
                            cacheObj.val[value] = $tag;
                            $div.append($tag);
                            cacheObj.inputsLength++;
                        } else {
                            $option && $option.removeClass(THIS);
                            cacheObj.inputs[value] && cacheObj.inputs[value].remove();
                            delete cacheObj.inputs[value];

                            cacheObj.val[value].remove();
                            delete cacheObj.val[value];
                            cacheObj.inputsLength--;
                        }

                        if (cacheObj.inputsLength) {
                            $div.removeClass(HIDE);
                            $input.addClass(HIDE);
                            select.attr('name', '');
                        } else {
                            $div.addClass(HIDE);
                            $input.removeClass(HIDE);
                            select.attr('name', fieldName);
                        }
                    }

                    function updateSelectOption(tag) {
                        var val = tag.attr('lay-value');
                        var $opt = void 0;

                        if (layerObj) {
                            $opt = layerObj.find('[lay-value="' + val + '"]');
                        }

                        updateSelectValue($opt, 'remove', val);
                    }

                    var showDown = function showDown() {
                        var offset = reElem.offset();
                        var h = reElem.height();
                        var scrollTop = void 0;
                        scrollTop = win.scrollTop();
                        offset.top = offset.top + h - scrollTop + 'px';
                        offset.left += 'px';

                        layerIndex = layer.open({
                            anim: -1,
                            isOutAnim: false,
                            closeBtn: false,
                            title: false,
                            content: cacheObj.renderListPanel(cacheObj.val || {}),
                            shade: 0,
                            time: 0,
                            type: 1,
                            area: reElem.width() + 'px',
                            offset: [offset.top, offset.left],
                            success: function success(layero) {
                                layerObj = layero;
                                dl = layero.find('.layui-select-options');
                                dds = dl.children('dd');

                                reElem.addClass(CLASS + 'ed');
                                dds.removeClass(HIDE);

                                var dlHeight = dl.outerHeight();

                                reElem.addClass(CLASS + 'ed');
                                dds.removeClass(HIDE);

                                if (layero.offset().top + dlHeight + 5 - scrollTop > win.height()) {
                                    layero.css({
                                        top: parseFloat(layero.css('top')) - dlHeight - h
                                    });
                                }

                                dl.css('visibility', 'visible');

                                dds.on('click', function () {
                                    var hasMulti = cacheObj.hasMulti;
                                    var othis = $(this);
                                    var value = othis.attr('lay-value');
                                    var filter = select.attr('lay-filter');
                                    var actionType = void 0;

                                    if (othis.hasClass(DISABLED)) return false;

                                    if (hasMulti) {
                                        if (value) {
                                            if (!othis.hasClass(THIS)) {
                                                actionType = 'add';
                                            } else {
                                                actionType = 'remove';
                                            }
                                            updateSelectValue(othis, actionType, value);
                                        }
                                    } else {
                                        if (othis.hasClass('layui-select-tips')) {
                                            input.val('');
                                            cacheObj.val = {};
                                        } else {
                                            input.val(othis.text());
                                            othis.addClass(THIS);

                                            cacheObj.val = _defineProperty({}, value, 1);
                                        }

                                        othis.siblings().removeClass(THIS);
                                        select.val(value).removeClass('layui-form-danger');
                                    }

                                    layui.event.call(this, MOD_NAME, 'select(' + filter + ')', {
                                        elem: select[0],
                                        value: value,
                                        othis: reElem
                                    });

                                    if (!hasMulti || !value) {
                                        hideDown(true);
                                    }

                                    return false;
                                });
                            }
                        });
                    },
                        hideDown = function hideDown(choose) {
                        layerObj = null;
                        reElem.removeClass(CLASS + 'ed ' + CLASS + 'up');
                        input.blur();
                        dds && dds.off('click');

                        layer.close(layerIndex);

                        if (choose) return;

                        notOption(input.val(), function (none) {
                            if (none) {
                                initValue = dl.find('.' + THIS).html();
                                input.hasClass(HIDE) || input.val(initValue);
                            }
                        });
                    };

                    title.on('click', function (e) {
                        var $el = $(e.target);
                        if ($el.hasClass('layui-icon')) {
                            var $tag = $el.parent();
                            $tag.remove();
                            e.stopPropagation();

                            updateSelectOption($tag);
                            return;
                        }

                        if (reElem.hasClass(CLASS + 'ed')) {
                            hideDown();
                        } else {
                            hide(e, true);
                            showDown();
                        }
                        dl.find('.' + NONE).remove();
                    });

                    title.find('.layui-edge').on('click', function () {
                        input.focus();
                    });

                    input.on('keyup', function (e) {
                        var keyCode = e.keyCode;

                        if (keyCode === 9) {
                            showDown();
                        }
                    }).on('keydown', function (e) {
                        var keyCode = e.keyCode;

                        if (keyCode === 9) {
                            hideDown();
                        } else if (keyCode === 13) {
                            e.preventDefault();
                        }
                    });

                    var notOption = function notOption(value, callback, origin) {
                        var num = 0;
                        layui.each(dds, function () {
                            var othis = $(this),
                                text = othis.text(),
                                not = text.indexOf(value) === -1;
                            if (value === '' || origin === 'blur' ? value !== text : not) num++;
                            origin === 'keyup' && othis[not ? 'addClass' : 'removeClass'](HIDE);
                        });
                        var none = num === dds.length;
                        callback(none);
                        return none;
                    };

                    var search = function search(e) {
                        var value = this.value,
                            keyCode = e.keyCode;

                        if (keyCode === 9 || keyCode === 13 || keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
                            return false;
                        }

                        notOption(value, function (none) {
                            if (none) {
                                dl.find('.' + NONE)[0] || dl.append('<p class="' + NONE + '">无匹配项</p>');
                            } else {
                                dl.find('.' + NONE).remove();
                            }
                        }, 'keyup');

                        if (value === '') {
                            dl.find('.' + NONE).remove();
                        }
                    };

                    if (isSearch) {
                        input.on('keyup', search).on('blur', function () {
                            thatInput = input;
                            initValue = dl.find('.' + THIS).html();
                            setTimeout(function () {
                                notOption(input.val(), function () {
                                    initValue || input.val('');
                                }, 'blur');
                            }, 200);
                        });
                    }

                    reElem.find('dl>dt').on('click', function () {
                        return false;
                    });

                    $(document).off('click', hide).on('click', hide);
                };

                if (elFilter) {
                    selects = selects.filter('[lay-filter="' + elFilter + '"]');
                }

                selects.each(function (index, select) {
                    var othis = $(this),
                        hasRender = othis.next('.' + CLASS),
                        disabled = this.disabled,
                        value = othis.data('value') || select.value,
                        hasDefaultVal = typeof value !== 'undefined',
                        selected = $(select.options[select.selectedIndex]),
                        optionsFirst = select.options[0];

                    var id = uuid++;
                    othis.data('uuid', id);

                    cache[id] = {};

                    if (typeof othis.attr('lay-ignore') === 'string') return othis.show();

                    var hasMulti = void 0;

                    if (typeof othis.attr(MULTI) === 'string') {
                        hasMulti = true;
                    }

                    if (hasDefaultVal) {
                        var vals = String(value).split(',');

                        if (vals.length === 1 && !hasMulti) {
                            selected = othis.find('option[value="' + value + '"]');

                            if (selected.length) {
                                cache[id].val = _defineProperty({}, value, 1);
                                othis.val(value);
                            } else {
                                value = '';
                            }
                        } else {
                            var valObj = cache[id].val = {};
                            for (var i = 0; i < vals.length; i++) {
                                var v = vals[i];

                                if (othis.find('option[value="' + v + '"]').length) {
                                    valObj[v] = 1;
                                }
                            }
                        }
                    }

                    var isSearch = typeof othis.attr('lay-search') === 'string',
                        placeholder = optionsFirst ? optionsFirst.value ? TIPS : optionsFirst.innerHTML || TIPS : TIPS;

                    var reElem = void 0;

                    if (hasMulti) {
                        reElem = $(['<div class="' + (isSearch ? '' : 'layui-unselect ') + CLASS + (hasMulti ? ' ' + CLASS_MULTI : '') + (disabled ? ' layui-select-disabled' : '') + '">', '<div class="' + TITLE + '"><div class="layui-hide layui-input"></div>' + '<input type="text" placeholder="' + placeholder + '" value="' + (value ? selected.html() : '') + '" readonly' + ' class="layui-input layui-unselect' + (disabled ? ' ' + DISABLED : '') + '">', '<i class="layui-edge"></i></div>', '</div>'].join(''));
                    } else {
                        reElem = $(['<div class="' + (isSearch ? '' : 'layui-unselect ') + CLASS + (hasMulti ? ' ' + CLASS_MULTI : '') + (disabled ? ' layui-select-disabled' : '') + '">', '<div class="' + TITLE + '"><input type="text" placeholder="' + placeholder + '" value="' + (value ? selected.html() : '') + '" ' + (isSearch ? '' : 'readonly') + ' class="layui-input' + (isSearch ? '' : ' layui-unselect') + (disabled ? ' ' + DISABLED : '') + '">', '<i class="layui-edge"></i></div>', '</div>'].join(''));
                    }

                    hasRender[0] && hasRender.remove();
                    othis.after(reElem);
                    events.call(this, reElem, disabled, isSearch);

                    cache[id].renderListPanel = renderListPanel;
                    cache[id].hasMulti = hasMulti;

                    if (hasMulti) {
                        cache[id].inputs = {};
                        cache[id].inputsLength = 0;

                        if (!cache[id].val || !value) {
                            cache[id].inputs = {};
                            cache[id].inputsLength = 0;
                            cache[id].val = {};
                        } else {
                            var addedNum = 0;
                            var valArr = value.split(',');
                            var fieldName = othis.attr('name');

                            for (var _i = 0; _i < valArr.length; _i++) {
                                var item = valArr[_i];
                                var $oriOpt = othis.find('option[value="' + item + '"]');

                                if (!$oriOpt.length) {
                                    continue;
                                }

                                var $opt = $oriOpt.clone();
                                $opt.children().remove();
                                var val = $opt.html();

                                var $input = $('<input type="hidden" name="' + fieldName + '" value="' + item + '">');

                                cache[id].inputs[item] = $input;
                                reElem.append($input);

                                var $tag = $('<div class="layui-btn layui-btn-sm layui-btn-primary" lay-value="' + item + '">' + val + '<i class="layui-icon">&#x1006;</i></div>');
                                reElem.find('div.layui-input').append($tag);
                                cache[id].val[item] = $tag;
                                addedNum++;
                            }

                            if (addedNum) {
                                cache[id].inputsLength = addedNum;
                                othis.attr('name', '');

                                reElem.find('div.layui-input').removeClass(HIDE);
                                reElem.find('input.layui-input').addClass(HIDE);
                            } else {
                                cache[id].inputs = {};
                                cache[id].inputsLength = 0;
                                cache[id].val = {};
                            }
                        }
                    }

                    function renderListPanel(valueMap) {
                        return ['<dl class="layui-select-options layui-anim layui-anim-upbit' + (othis.find('optgroup')[0] ? ' layui-select-group' : '') + '">' + function (options) {
                            var arr = [];
                            layui.each(options, function (index, item) {
                                if (index === 0 && !item.value) {
                                    arr.push('<dd lay-value="" class="layui-select-tips">' + (item.innerHTML || TIPS) + '</dd>');
                                } else if (item.tagName.toLowerCase() === 'optgroup') {
                                    arr.push('<dt>' + item.label + '</dt>');
                                } else {
                                    arr.push('<dd lay-value="' + item.value + '" class="' + (hasOwnProperty(valueMap, item.value) ? THIS : '') + (item.disabled ? ' ' + DISABLED : '') + '">' + (hasMulti ? '<i class="layui-icon">&#xe605;</i>' : '') + item.innerHTML + '</dd>');
                                }
                            });
                            arr.length === 0 && arr.push('<dd lay-value="" class="' + DISABLED + '">没有选项</dd>');
                            return arr.join('');
                        }(othis.find('*')) + '</dl>'].join('');
                    }
                });
            },

            checkbox: function checkbox() {
                var CLASS = {
                    checkbox: ['layui-form-checkbox', 'layui-form-checked', 'checkbox'],
                    _switch: ['layui-form-switch', 'layui-form-onswitch', 'switch']
                };
                var checks = elemForm.find('input[type=checkbox]');

                if (elFilter) {
                    checks = checks.filter('[lay-filter="' + elFilter + '"]');
                }

                var events = function events(reElem, RE_CLASS) {
                    var check = $(this);

                    reElem.on('click', function () {
                        var filter = check.attr('lay-filter'),
                            text = (check.attr('lay-text') || '').split('|');

                        if (check[0].disabled) return;

                        if (check[0].checked) {
                            check[0].checked = false;

                            reElem.removeClass(RE_CLASS[1]).find('em').text(text[1]).text(text[1]);
                        } else {
                            check[0].checked = true;

                            reElem.addClass(RE_CLASS[1]).find('em').text(text[0]).text(text[0]);
                        }

                        layui.event.call(check[0], MOD_NAME, RE_CLASS[2] + '(' + filter + ')', {
                            elem: check[0],
                            value: check[0].value,
                            othis: reElem
                        });
                    });
                };

                checks.each(function (index, check) {
                    var othis = $(this),
                        skin = othis.attr('lay-skin'),
                        text = (othis.attr('lay-text') || '').split('|'),
                        disabled = this.disabled;
                    if (skin === 'switch') skin = '_' + skin;
                    var RE_CLASS = CLASS[skin] || CLASS.checkbox;

                    if (typeof othis.attr('lay-ignore') === 'string') return othis.show();

                    var hasRender = othis.next('.' + RE_CLASS[0]);
                    var reElem = $(['<div class="layui-unselect ' + RE_CLASS[0] + (check.checked ? ' ' + RE_CLASS[1] : '') + (disabled ? ' layui-checkbox-disbaled ' + DISABLED : '') + '" lay-skin="' + (skin || '') + '">', {
                        _switch: '<em>' + ((check.checked ? text[0] : text[1]) || '') + '</em><i></i>'
                    }[skin] || (check.title.replace(/\s/g, '') ? '<span>' + check.title + '</span>' : '') + '<i class="layui-icon">' + (skin ? '&#xe605;' : '&#xe618;') + '</i>', '</div>'].join(''));

                    hasRender[0] && hasRender.remove();
                    othis.after(reElem);
                    events.call(this, reElem, RE_CLASS);
                });
            },

            radio: function radio() {
                var CLASS = 'layui-form-radio',
                    ICON = ['&#xe643;', '&#xe63f;'],
                    radios = elemForm.find('input[type=radio]'),
                    events = function events(reElem) {
                    var radio = $(this),
                        ANIM = 'layui-anim-scaleSpring';

                    reElem.on('click', function () {
                        var name = radio[0].name,
                            forms = radio.parents(ELEM);
                        var filter = radio.attr('lay-filter');
                        var sameRadio = forms.find('input[name=' + name.replace(/[.#[\]]/g, '\\$1') + ']');

                        if (radio[0].disabled) return;

                        layui.each(sameRadio, function () {
                            var next = $(this).next('.' + CLASS);
                            this.checked = false;
                            next.removeClass(CLASS + 'ed');
                            next.find('.layui-icon').removeClass(ANIM).html(ICON[1]);
                        });

                        radio[0].checked = true;
                        reElem.addClass(CLASS + 'ed');
                        reElem.find('.layui-icon').addClass(ANIM).html(ICON[0]);

                        layui.event.call(radio[0], MOD_NAME, 'radio(' + filter + ')', {
                            elem: radio[0],
                            value: radio[0].value,
                            othis: reElem
                        });
                    });
                };

                if (elFilter) {
                    radios = radios.filter('[lay-filter="' + elFilter + '"]');
                }

                radios.each(function (index, radio) {
                    var othis = $(this),
                        hasRender = othis.next('.' + CLASS),
                        disabled = this.disabled;

                    if (typeof othis.attr('lay-ignore') === 'string') return othis.show();

                    var reElem = $(['<div class="layui-unselect ' + CLASS + (radio.checked ? ' ' + CLASS + 'ed' : '') + (disabled ? ' layui-radio-disbaled ' + DISABLED : '') + '">', '<i class="layui-anim layui-icon">' + ICON[radio.checked ? 0 : 1] + '</i>', '<span>' + (radio.title || '') + '</span>', '</div>'].join(''));

                    hasRender[0] && hasRender.remove();
                    othis.after(reElem);
                    events.call(this, reElem);
                });
            }
        };

        elemForm = $(ELEM + (filter ? '[lay-filter="' + filter + '"]' : ''));

        if (type) {
            if (items[type]) {
                items[type]();
            } else {
                hint.error('不支持的' + type + '表单渲染');
            }
        } else {
            layui.each(items, function (index, item) {
                item();
            });
        }

        return that;
    };

    var submit = function submit() {
        var button = $(this),
            verify = form.config.verify,
            stop = null,
            DANGER = 'layui-form-danger',
            field = {},
            elem = button.parents(ELEM).eq(0),
            verifyElem = elem.find('*[lay-verify]'),
            formElem = button.parents('.layui-form')[0],
            fieldElem = elem.find('input,select,textarea'),
            filter = button.attr('lay-filter');
        layui.each(verifyElem, function (_, item) {
            var othis = $(this),
                vers = othis.attr('lay-verify').split('|'),
                verType = othis.attr('lay-verType'),
                value = othis.val();

            var name = void 0;
            name = item.name = (item.name || '').replace(/^\s*|\s*&/, '');

            if (!name || item.disabled) {
                return;
            }

            if (value === null || value === undefined) {
                value = '';
            }

            othis.removeClass(DANGER);
            layui.each(vers, function (_, thisVer) {
                var isTrue = void 0,
                    errorText = '',
                    isFn = typeof verify[thisVer] === 'function';

                if (verify[thisVer]) {
                    isTrue = isFn ? errorText = verify[thisVer](value, item) : !verify[thisVer][0].test(value);
                    errorText = errorText || verify[thisVer][1];

                    if (isTrue) {
                        if (verType === 'tips') {
                            var follow = othis;

                            if (typeof othis.attr('lay-ignore') !== 'string') {
                                if (item.tagName.toLowerCase() === 'select' || /^checkbox|radio$/.test(item.type)) {
                                    follow = othis.next();
                                }
                            }

                            layer.tips(errorText, follow, { tips: 1 });
                        } else if (verType === 'alert') {
                            layer.alert(errorText, { title: '提示', shadeClose: true });
                        } else {
                            layer.msg(errorText, { icon: 5, shift: 6 });
                        }
                        if (!device.android && !device.ios) item.focus();
                        othis.addClass(DANGER);
                        return stop = true;
                    }
                }
            });
            if (stop) return stop;
        });

        if (stop) return false;

        var nameIndex = 0;
        layui.each(fieldElem, function (_, item) {
            var name = void 0;
            name = item.name = (item.name || '').replace(/^\s*|\s*&/, '');

            if (!name || item.disabled) {
                return;
            }

            if (/^.*\[]$/.test(name)) {
                var key = name.match(/^(.*)\[]$/g)[0];
                nameIndex[key] = nameIndex[key] | 0;
                name = item.name = name.replace(/^(.*)\[]$/, '$1[' + nameIndex[key]++ + ']');
            }

            if (/^checkbox|radio$/.test(item.type) && !item.checked) {
                return;
            }

            if (isArray(field[name])) {
                field[name].push(item.value);
            } else {
                if (typeof field[name] !== 'undefined') {
                    field[name] = [field[name], item.value];
                } else {
                    field[name] = item.value;
                }
            }
        });

        return layui.event.call(this, MOD_NAME, 'submit(' + filter + ')', {
            elem: this,
            form: formElem,
            field: field
        });
    };

    var toString = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;
    function isArray(arr) {
        return toString.call(arr) === '[object Array]';
    }

    function hasOwnProperty(obj, val) {
        return hasOwn.call(obj, val);
    }

    var form = new Form(),
        dom = $(document),
        win = $(window);

    form.render();

    dom.on('reset', ELEM, function () {
        var filter = $(this).attr('lay-filter');
        setTimeout(function () {
            form.render(null, filter);
        }, 50);
    });

    dom.on('submit', ELEM, submit).on('click', '*[lay-submit]', submit);

    exports(MOD_NAME, form);
});