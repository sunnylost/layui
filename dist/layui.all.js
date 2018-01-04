/** layui-v2.2.4 MIT License By http://www.layui.com */
 ;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (win) {
    'use strict';

    var doc = document,
        config = {
        modules: {},
        status: {},
        timeout: 10,
        event: {} },
        Layui = function Layui() {
        this.v = '2.2.3';
    },
        getPath = function () {
        var jsPath = void 0;

        if (doc.currentScript) {
            jsPath = doc.currentScript.src;
        } else {
            jsPath = function () {
                var js = doc.scripts,
                    last = js.length - 1,
                    src = void 0;
                for (var i = last; i > 0; i--) {
                    if (js[i].readyState === 'interactive') {
                        src = js[i].src;
                        break;
                    }
                }
                return src || js[last].src;
            }();
        }

        return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }(),
        error = function error(msg) {
        win.console && win.console.error && win.console.error('Layui hint: ' + msg);
    },
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        modules = {
        layer: 'modules/layer',
        laydate: 'modules/laydate',
        laypage: 'modules/laypage',
        laytpl: 'modules/laytpl',
        layim: 'modules/layim',
        layedit: 'modules/layedit',
        form: 'modules/form',
        upload: 'modules/upload',
        tree: 'modules/tree',
        table: 'modules/table',
        element: 'modules/element',
        util: 'modules/util',
        flow: 'modules/flow',
        carousel: 'modules/carousel',
        code: 'modules/code',
        jquery: 'modules/jquery',

        mobile: 'modules/mobile',
        'layui.all': '../layui.all' };

    Layui.prototype.cache = config;

    Layui.prototype.define = function (deps, callback) {
        var that = this,
            type = typeof deps === 'function',
            mods = function mods() {
            typeof callback === 'function' && callback(function (app, exports) {
                layui[app] = exports;
                config.status[app] = true;
            });
            return this;
        };

        type && (callback = deps, deps = []);

        if (layui['layui.all'] || !layui['layui.all'] && layui['layui.mobile']) {
            return mods.call(that);
        }

        that.use(deps, mods);
        return that;
    };

    Layui.prototype.use = function (apps, callback, exports) {
        var that = this,
            dir = config.dir = config.dir ? config.dir : getPath,
            head = doc.getElementsByTagName('head')[0];

        apps = typeof apps === 'string' ? [apps] : apps;

        if (window.jQuery && jQuery.fn.on) {
            that.each(apps, function (index, item) {
                if (item === 'jquery') {
                    apps.splice(index, 1);
                }
            });
            layui.jquery = layui.$ = jQuery;
        }

        var item = apps[0],
            timeout = 0;
        exports = exports || [];

        config.host = config.host || (dir.match(/\/\/([\s\S]+?)\//) || ['//' + location.host + '/'])[0];

        function onScriptLoad(e, url) {
            var readyRegExp = navigator.platform === 'PLaySTATION 3' ? /^complete$/ : /^(complete|loaded)$/,
                node = e.currentTarget || e.srcElement;

            if (e.type === 'load' || readyRegExp.test(node.readyState)) {
                config.modules[item] = url;
                head.removeChild(node);(function poll() {
                    if (++timeout > config.timeout * 1000 / 4) {
                        return error(item + ' is not a valid module');
                    }

                    config.status[item] ? onCallback() : setTimeout(poll, 4);
                })();
            }
        }

        function onCallback() {
            exports.push(layui[item]);
            apps.length > 1 ? that.use(apps.slice(1), callback, exports) : typeof callback === 'function' && callback.apply(layui, exports);
        }

        if (apps.length === 0 || layui['layui.all'] && modules[item] || !layui['layui.all'] && layui['layui.mobile'] && modules[item]) {
            return onCallback(), that;
        }

        if (!config.modules[item]) {
            var node = doc.createElement('script'),
                url = (modules[item] ? dir + 'lay/' : /^\{\/\}/.test(that.modules[item]) ? '' : config.base || '') + (that.modules[item] || item) + '.js';

            url = url.replace(/^\{\/\}/, '');

            node.async = true;
            node.charset = 'utf-8';
            node.src = url + function () {
                var version = config.version === true ? config.v || new Date().getTime() : config.version || '';
                return version ? '?v=' + version : '';
            }();

            head.appendChild(node);

            if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) && !isOpera) {
                node.attachEvent('onreadystatechange', function (e) {
                    onScriptLoad(e, url);
                });
            } else {
                node.addEventListener('load', function (e) {
                    onScriptLoad(e, url);
                }, false);
            }

            config.modules[item] = url;
        } else {
            ~function poll() {
                if (++timeout > config.timeout * 1000 / 4) {
                    return error(item + ' is not a valid module');
                }

                if (typeof config.modules[item] === 'string' && config.status[item]) {
                    onCallback();
                } else {
                    setTimeout(poll, 4);
                }
            }();
        }

        return that;
    };

    Layui.prototype.getStyle = function (node, name) {
        var style = node.currentStyle ? node.currentStyle : win.getComputedStyle(node, null);
        return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
    };

    Layui.prototype.link = function (href, fn, cssname) {
        var that = this,
            link = doc.createElement('link'),
            head = doc.getElementsByTagName('head')[0];

        if (typeof fn === 'string') cssname = fn;

        var app = (cssname || href).replace(/\.|\//g, ''),
            id = link.id = 'layuicss-' + app,
            timeout = 0;

        link.rel = 'stylesheet';
        link.href = href + (config.debug ? '?v=' + new Date().getTime() : '');
        link.media = 'all';

        if (!doc.getElementById(id)) {
            head.appendChild(link);
        }

        if (typeof fn !== 'function') return that;

        function poll() {
            if (++timeout > config.timeout * 1000 / 100) {
                return error(href + ' timeout');
            }

            if (parseInt(that.getStyle(doc.getElementById(id), 'width')) === 1989) {
                fn();
            } else {
                setTimeout(poll, 100);
            }
        }

        poll();

        return that;
    };

    Layui.prototype.addcss = function (firename, fn, cssname) {
        return layui.link(config.dir + 'css/' + firename, fn, cssname);
    };

    Layui.prototype.img = function (url, callback, error) {
        var img = new Image();
        img.src = url;
        if (img.complete) {
            return callback(img);
        }
        img.onload = function () {
            img.onload = null;
            callback(img);
        };
        img.onerror = function (e) {
            img.onerror = null;
            error(e);
        };
    };

    Layui.prototype.config = function (options) {
        options = options || {};
        for (var key in options) {
            config[key] = options[key];
        }
        return this;
    };

    Layui.prototype.modules = function () {
        var clone = {};
        for (var o in modules) {
            clone[o] = modules[o];
        }
        return clone;
    }();

    Layui.prototype.extend = function (options) {
        var that = this;

        options = options || {};
        for (var o in options) {
            if (that[o] || that.modules[o]) {
                error('\u6A21\u5757\u540D ' + o + ' \u5DF2\u88AB\u5360\u7528');
            } else {
                that.modules[o] = options[o];
            }
        }

        return that;
    };

    Layui.prototype.router = function (hash) {
        hash = hash || location.hash;

        var that = this,
            data = {
            path: [],
            search: {},
            hash: (hash.match(/[^#](#.*$)/) || [])[1] || ''
        };

        if (!/^#\//.test(hash)) return data;

        hash = hash.replace(/^#\//, '').replace(/([^#])(#.*$)/, '$1').split('/') || [];

        that.each(hash, function (index, item) {
            if (/^\w+=/.test(item)) {
                item = item.split('=');
                data.search[item[0]] = item[1];
            } else {
                data.path.push(item);
            }
        });

        return data;
    };

    Layui.prototype.data = function (table, settings) {
        table = table || 'layui';

        if (!win.JSON || !win.JSON.parse) return;

        if (settings === null) {
            return delete localStorage[table];
        }

        settings = (typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) === 'object' ? settings : { key: settings };

        var data = void 0;

        try {
            data = JSON.parse(localStorage[table]);
        } catch (e) {
            data = {};
        }

        if ('value' in settings) data[settings.key] = settings.value;
        if (settings.remove) delete data[settings.key];
        localStorage[table] = JSON.stringify(data);

        return settings.key ? data[settings.key] : data;
    };

    Layui.prototype.device = function (key) {
        var agent = navigator.userAgent.toLowerCase(),
            getVersion = function getVersion(label) {
            var exp = new RegExp(label + '/([^\\s\\_\\-]+)');
            label = (agent.match(exp) || [])[1];
            return label || false;
        },
            result = {
            os: function () {
                if (/windows/.test(agent)) {
                    return 'windows';
                } else if (/linux/.test(agent)) {
                    return 'linux';
                } else if (/iphone|ipod|ipad|ios/.test(agent)) {
                    return 'ios';
                } else if (/mac/.test(agent)) {
                    return 'mac';
                }
            }(),
            ie: function () {
                return !!win.ActiveXObject || 'ActiveXObject' in win ? (agent.match(/msie\s(\d+)/) || [])[1] || '11' : false;
            }(),
            weixin: getVersion('micromessenger') };

        if (key && !result[key]) {
            result[key] = getVersion(key);
        }

        result.android = /android/.test(agent);
        result.ios = result.os === 'ios';

        return result;
    };

    Layui.prototype.hint = function () {
        return {
            error: error
        };
    };

    Layui.prototype.each = function (obj, fn) {
        var key = void 0,
            that = this;
        if (typeof fn !== 'function') return that;
        obj = obj || [];
        if (obj.constructor === Object) {
            for (key in obj) {
                if (fn.call(obj[key], key, obj[key])) break;
            }
        } else {
            for (key = 0; key < obj.length; key++) {
                if (fn.call(obj[key], key, obj[key])) break;
            }
        }
        return that;
    };

    Layui.prototype.sort = function (obj, key, desc) {
        var clone = JSON.parse(JSON.stringify(obj || []));

        if (!key) return clone;

        clone.sort(function (o1, o2) {
            var isNum = /^-?\d+$/,
                v1 = o1[key],
                v2 = o2[key];

            if (isNum.test(v1)) v1 = parseFloat(v1);
            if (isNum.test(v2)) v2 = parseFloat(v2);

            if (v1 && !v2) {
                return 1;
            } else if (!v1 && v2) {
                return -1;
            }

            if (v1 > v2) {
                return 1;
            } else if (v1 < v2) {
                return -1;
            } else {
                return 0;
            }
        });

        desc && clone.reverse();
        return clone;
    };

    Layui.prototype.stope = function (e) {
        e = e || win.event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    };

    Layui.prototype.onevent = function (modName, events, callback) {
        if (typeof modName !== 'string' || typeof callback !== 'function') return this;
        config.event[modName + '.' + events] = [callback];

        return this;
    };

    Layui.prototype.event = function (modName, events, params) {
        var that = this,
            result = null,
            filter = events.match(/\(.*\)$/) || [],
            set = (events = modName + '.' + events).replace(filter, ''),
            callback = function callback(_, item) {
            var res = item && item.call(that, params);
            res === false && result === null && (result = false);
        };
        layui.each(config.event[set], callback);
        filter[0] && layui.each(config.event[events], callback);
        return result;
    };

    win.layui = new Layui();
}(window);

layui.define(function (exports) {
  var cache = layui.cache;
  layui.config({
    dir: cache.dir.replace(/lay\/dest\/$/, '')
  });
  exports('layui.all', layui.v);
});var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

layui.define('jquery', function (exports) {
    'use strict';

    var $ = layui.jquery;
    var config = {
        open: '{{',
        close: '}}'
    };

    var cache = {};

    var tool = {
        exp: function exp(str) {
            return new RegExp(str, 'g');
        },

        query: function query(type, _, __, config) {
            var types = ['#([\\s\\S])+?', '([^{#}])*?'][type || 0];
            return exp((_ || '') + config.open + types + config.close + (__ || ''));
        },
        escape: function escape(html) {
            return String(html || '').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        },
        error: function error(e, tplog) {
            var error = 'Laytpl Error：';
            (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' && window.console.error(error + e + '\n' + (tplog || ''));
            return error + e;
        }
    };

    var exp = tool.exp;
    var Tpl = function Tpl(tpl, opt) {
        this.tpl = tpl;
        this.config = $.extend({}, config, opt);
    };

    Tpl.pt = Tpl.prototype;

    window.errors = 0;

    Tpl.pt.parse = function (tpl) {
        var tplStr = tpl;
        var config = this.config;

        if (cache[tplStr]) {
            return cache[tplStr];
        }

        var jss = exp('^' + config.open + '#', ''),
            jsse = exp(config.close + '$', '');

        tpl = tpl.replace(/\s+|\r|\t|\n/g, ' ').replace(exp(config.open + '#'), config.open + '# ').replace(exp(config.close + '}'), '} ' + config.close).replace(/\\/g, '\\\\').replace(exp(config.open + '!(.+?)!' + config.close), function (str) {
            str = str.replace(exp('^' + config.open + '!'), '').replace(exp('!' + config.close), '').replace(exp(config.open + '|' + config.close), function (tag) {
                return tag.replace(/(.)/g, '\\$1');
            });
            return str;
        }).replace(/(?=['"])/g, '\\').replace(tool.query(null, null, null, config), function (str) {
            str = str.replace(jss, '').replace(jsse, '');
            return '";' + str.replace(/\\/g, '') + ';view+="';
        }).replace(tool.query(1, null, null, config), function (str) {
            var start = '"+(';
            if (str.replace(/\s/g, '') === config.open + config.close) {
                return '';
            }
            str = str.replace(exp(config.open + '|' + config.close), '');
            if (/^=/.test(str)) {
                str = str.replace(/^=/, '');
                start = '"+_escape_(';
            }
            return start + str.replace(/\\/g, '') + ')+"';
        });
        tpl = '"use strict";var view = "' + tpl + '";return view;';

        return cache[tplStr] = new Function('d, _escape_', tpl);
    };

    Tpl.pt.render = function (data, callback) {
        var fn = void 0;
        var result = void 0;

        data = data || {};
        fn = cache[this.tpl] || this.parse(this.tpl);

        try {
            result = fn(data, tool.escape);
        } catch (e) {
            return tool.error(e, fn.toString());
        }

        if (!callback) return result;
        callback(result);
    };

    var laytpl = function laytpl(tpl) {
        if (typeof tpl !== 'string') return tool.error('Template not found');
        return new Tpl(tpl);
    };

    laytpl.config = function (options) {
        options = options || {};
        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                config[i] = options[i];
            }
        }
    };

    laytpl.v = '1.2.0';

    exports('laytpl', laytpl);
});var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

layui.define(function (exports) {
    'use strict';

    var laypage = {
        render: function render(options) {
            var o = new Page(options);
            return o.index;
        },
        index: layui.laypage ? layui.laypage.index + 10000 : 0,
        on: function on(elem, even, fn) {
            if (elem.attachEvent) {
                elem.attachEvent('on' + even, function (e) {
                    e.target = e.srcElement;
                    fn.call(elem, e);
                });
            } else {
                elem.addEventListener(even, fn, false);
            }
            return this;
        }
    };

    var doc = document,
        id = 'getElementById',
        tag = 'getElementsByTagName',
        MOD_NAME = 'laypage',
        DISABLED = 'layui-disabled',
        Page = function Page(options) {
        var that = this;
        that.config = options || {};
        that.config.index = ++laypage.index;
        that.render(true);
    };

    Page.prototype.type = function () {
        var config = this.config;
        if (_typeof(config.elem) === 'object') {
            return config.elem.length === undefined ? 2 : 3;
        }
    };

    Page.prototype.view = function () {
        var that = this,
            config = that.config,
            groups = config.groups = 'groups' in config ? config.groups | 0 : 5;
        config.layout = _typeof(config.layout) === 'object' ? config.layout : ['prev', 'page', 'next'];

        config.count = config.count | 0;
        config.curr = config.curr | 0 || 1;
        config.limits = _typeof(config.limits) === 'object' ? config.limits : [10, 20, 30, 40, 50];
        config.limit = config.limit | 0 || 10;
        config.pages = Math.ceil(config.count / config.limit) || 1;

        if (config.curr > config.pages) {
            config.curr = config.pages;
        }

        if (groups < 0) {
            groups = 1;
        } else if (groups > config.pages) {
            groups = config.pages;
        }

        config.prev = 'prev' in config ? config.prev : '&#x4E0A;&#x4E00;&#x9875;';
        config.next = 'next' in config ? config.next : '&#x4E0B;&#x4E00;&#x9875;';
        var index = config.pages > groups ? Math.ceil((config.curr + (groups > 1 ? 1 : 0)) / (groups > 0 ? groups : 1)) : 1,
            views = {
            prev: function () {
                return config.prev ? '<a href="javascript:;" class="layui-laypage-prev' + (config.curr === 1 ? ' ' + DISABLED : '') + '" data-page="' + (config.curr - 1) + '">' + config.prev + '</a>' : '';
            }(),

            page: function () {
                var pager = [];

                if (config.count < 1) {
                    return '';
                }

                if (index > 1 && config.first !== false && groups !== 0) {
                    pager.push('<a href="javascript:;" class="layui-laypage-first" data-page="1"  title="&#x9996;&#x9875;">' + (config.first || 1) + '</a>');
                }

                var halve = Math.floor((groups - 1) / 2),
                    start = index > 1 ? config.curr - halve : 1,
                    max = config.curr + (groups - halve - 1),
                    end = index > 1 ? max > config.pages ? config.pages : max : groups;

                if (end - start < groups - 1) {
                    start = end - groups + 1;
                }

                if (config.first !== false && start > 2) {
                    pager.push('<span class="layui-laypage-spr">&#x2026;</span>');
                }

                for (; start <= end; start++) {
                    if (start === config.curr) {
                        pager.push('<span class="layui-laypage-curr"><em class="layui-laypage-em" ' + (/^#/.test(config.theme) ? 'style="background-color:' + config.theme + ';"' : '') + '></em><em>' + start + '</em></span>');
                    } else {
                        pager.push('<a href="javascript:;" data-page="' + start + '">' + start + '</a>');
                    }
                }

                if (config.pages > groups && config.pages > end && config.last !== false) {
                    if (end + 1 < config.pages) {
                        pager.push('<span class="layui-laypage-spr">&#x2026;</span>');
                    }
                    if (groups !== 0) {
                        pager.push('<a href="javascript:;" class="layui-laypage-last" title="&#x5C3E;&#x9875;"  data-page="' + config.pages + '">' + (config.last || config.pages) + '</a>');
                    }
                }

                return pager.join('');
            }(),

            next: function () {
                return config.next ? '<a href="javascript:;" class="layui-laypage-next' + (config.curr === config.pages ? ' ' + DISABLED : '') + '" data-page="' + (config.curr + 1) + '">' + config.next + '</a>' : '';
            }(),

            count: '<span class="layui-laypage-count">共 ' + config.count + ' 条</span>',

            limit: function () {
                var options = ['<span class="layui-laypage-limits"><select lay-ignore>'];
                layui.each(config.limits, function (index, item) {
                    options.push('<option value="' + item + '"' + (item === config.limit ? 'selected' : '') + '>' + item + ' 条/页</option>');
                });
                return options.join('') + '</select></span>';
            }(),

            skip: function () {
                return ['<span class="layui-laypage-skip">&#x5230;&#x7B2C;', '<input type="text" min="1" value="' + config.curr + '" class="layui-input">', '&#x9875;<button type="button" class="layui-laypage-btn">&#x786e;&#x5b9a;</button>', '</span>'].join('');
            }()
        };

        var plate = [];
        layui.each(config.layout, function (index, item) {
            if (views[item]) {
                plate.push(views[item]);
            }
        });

        return ['<div class="layui-box layui-laypage layui-laypage-' + (config.theme ? /^#/.test(config.theme) ? 'molv' : config.theme : 'default') + '" id="layui-laypage-' + config.index + '">', plate.join(''), '</div>'].join('');
    };

    Page.prototype.jump = function (elem, isskip) {
        if (!elem) return;
        var that = this,
            config = that.config,
            childs = elem.children,
            btn = elem[tag]('button')[0],
            input = elem[tag]('input')[0],
            select = elem[tag]('select')[0],
            skip = function skip() {
            var curr = input.value.replace(/\s|\D/g, '') | 0;
            if (curr) {
                config.curr = curr;
                that.render();
            }
        };

        if (isskip) return skip();

        for (var i = 0, len = childs.length; i < len; i++) {
            if (childs[i].nodeName.toLowerCase() === 'a') {
                laypage.on(childs[i], 'click', function () {
                    var curr = this.getAttribute('data-page') | 0;
                    if (curr < 1 || curr > config.pages) return;
                    config.curr = curr;
                    that.render();
                });
            }
        }

        if (select) {
            laypage.on(select, 'change', function () {
                var value = this.value;
                if (config.curr * value > config.count) {
                    config.curr = Math.ceil(config.count / value);
                }
                config.limit = value;
                that.render();
            });
        }

        if (btn) {
            laypage.on(btn, 'click', function () {
                skip();
            });
        }
    };

    Page.prototype.skip = function (elem) {
        if (!elem) return;
        var that = this,
            input = elem[tag]('input')[0];
        if (!input) return;
        laypage.on(input, 'keyup', function (e) {
            var value = this.value,
                keyCode = e.keyCode;
            if (/^(37|38|39|40)$/.test(keyCode)) return;
            if (/\D/.test(value)) {
                this.value = value.replace(/\D/, '');
            }
            if (keyCode === 13) {
                that.jump(elem, true);
            }
        });
    };

    Page.prototype.render = function (load) {
        var that = this,
            config = that.config,
            type = that.type(),
            view = that.view();

        if (type === 2) {
            config.elem && (config.elem.innerHTML = view);
        } else if (type === 3) {
            config.elem.html(view);
        } else {
            if (doc[id](config.elem)) {
                doc[id](config.elem).innerHTML = view;
            }
        }

        config.jump && config.jump(config, load);

        var elem = doc[id]('layui-laypage-' + config.index);
        that.jump(elem);

        if (config.hash && !load) {
            location.hash = '!' + config.hash + '=' + config.curr;
        }

        that.skip(elem);
    };

    exports(MOD_NAME, laypage);
});var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function () {
    'use strict';

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var isLayui = window.layui && layui.define,
        _ready = {
        getPath: function () {
            var jsPath = void 0;

            if (document.currentScript) {
                jsPath = document.currentScript.src;
            } else {
                var js = document.scripts,
                    last = js.length - 1,
                    src = void 0;

                for (var i = last; i > 0; i--) {
                    if (js[i].readyState === 'interactive') {
                        src = js[i].src;
                        break;
                    }
                }

                jsPath = src || js[last].src;
            }

            return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
        }(),

        getStyle: function getStyle(node, name) {
            var style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
            return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
        },

        link: function link(href, fn, cssname) {
            if (!laydate.path) return;

            var head = document.getElementsByTagName('head')[0],
                link = document.createElement('link');
            if (typeof fn === 'string') cssname = fn;
            var app = (cssname || href).replace(/[./]/g, '');
            var id = 'layuicss-' + app,
                timeout = 0;

            link.rel = 'stylesheet';
            link.href = laydate.path + href;
            link.id = id;

            if (!document.getElementById(id)) {
                head.appendChild(link);
            }

            if (typeof fn !== 'function') return;(function poll() {
                if (++timeout > 8 * 1000 / 100) {
                    return window.console && window.console.error('laydate.css: Invalid');
                }

                parseInt(_ready.getStyle(document.getElementById(id), 'width')) === 1989 ? fn() : setTimeout(poll, 100);
            })();
        }
    },
        laydate = {
        v: '5.0.9',
        config: {},
        index: window.laydate && window.laydate.v ? 100000 : 0,
        path: _ready.getPath,

        set: function set(options) {
            var that = this;
            that.config = lay.extend({}, that.config, options);
            return that;
        },

        ready: function ready(fn) {
            var cssname = 'laydate',
                ver = '',
                path = (isLayui ? 'modules/laydate/' : 'theme/') + 'default/laydate.css?v=' + laydate.v + ver;
            isLayui ? layui.addcss(path, fn, cssname) : _ready.link(path, fn, cssname);
            return this;
        }
    },
        thisDate = function thisDate() {
        var that = this;
        return {
            hint: function hint(content) {
                that.hint.call(that, content);
            },
            config: that.config
        };
    },
        MOD_NAME = 'laydate',
        ELEM = '.layui-laydate',
        THIS = 'layui-this',
        DISABLED = 'laydate-disabled',
        TIPS_OUT = '开始日期超出了结束日期<br>建议重新选择',
        LIMIT_YEAR = [100, 200000],
        ELEM_STATIC = 'layui-laydate-static',
        ELEM_LIST = 'layui-laydate-list',
        ELEM_SELECTED = 'laydate-selected',
        ELEM_HINT = 'layui-laydate-hint',
        ELEM_PREV = 'laydate-day-prev',
        ELEM_NEXT = 'laydate-day-next',
        ELEM_FOOTER = 'layui-laydate-footer',
        ELEM_CONFIRM = '.laydate-btns-confirm',
        ELEM_TIME_TEXT = 'laydate-time-text',
        ELEM_TIME_BTN = '.laydate-btns-time',
        Class = function Class(options) {
        var that = this;
        that.index = ++laydate.index;
        that.config = lay.extend({}, that.config, laydate.config, options);
        laydate.ready(function () {
            that.init();
        });
    },
        lay = function lay(selector) {
        return new LAY(selector);
    },
        LAY = function LAY(selector) {
        var index = 0,
            nativeDOM = (typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) === 'object' ? [selector] : (this.selector = selector, document.querySelectorAll(selector || null));
        for (; index < nativeDOM.length; index++) {
            this.push(nativeDOM[index]);
        }
    };

    LAY.prototype = [];
    LAY.prototype.constructor = LAY;

    lay.extend = function () {
        var ai = 1,
            args = arguments,
            clone = function clone(target, obj) {
            target = target || (obj.constructor === Array ? [] : {});
            for (var i in obj) {
                if (hasOwnProperty.call(obj, i)) {
                    target[i] = obj[i] && obj[i].constructor === Object ? clone(target[i], obj[i]) : obj[i];
                }
            }
            return target;
        };

        args[0] = _typeof(args[0]) === 'object' ? args[0] : {};

        for (; ai < args.length; ai++) {
            if (_typeof(args[ai]) === 'object') {
                clone(args[0], args[ai]);
            }
        }
        return args[0];
    };

    lay.ie = function () {
        var agent = navigator.userAgent.toLowerCase();
        return !!window.ActiveXObject || 'ActiveXObject' in window ? (agent.match(/msie\s(\d+)/) || [])[1] || '11' : false;
    }();

    lay.stope = function (e) {
        e = e || window.event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    };

    lay.each = function (obj, fn) {
        var key = void 0,
            that = this;
        if (typeof fn !== 'function') return that;
        obj = obj || [];
        if (obj.constructor === Object) {
            for (key in obj) {
                if (hasOwnProperty.call(obj, key)) {
                    if (fn.call(obj[key], key, obj[key])) break;
                }
            }
        } else {
            for (key = 0; key < obj.length; key++) {
                if (fn.call(obj[key], key, obj[key])) break;
            }
        }
        return that;
    };

    lay.digit = function (num, length) {
        var str = '';
        num = String(num);
        length = length || 2;
        for (var i = num.length; i < length; i++) {
            str += '0';
        }
        return num < Math.pow(10, length) ? str + (num | 0) : num;
    };

    lay.elem = function (elemName, attr) {
        var elem = document.createElement(elemName);
        lay.each(attr || {}, function (key, value) {
            elem.setAttribute(key, value);
        });
        return elem;
    };

    LAY.addStr = function (str, new_str) {
        str = str.replace(/\s+/, ' ');
        new_str = new_str.replace(/\s+/, ' ').split(' ');
        lay.each(new_str, function (ii, item) {
            if (!new RegExp('\\b' + item + '\\b').test(str)) {
                str = str + ' ' + item;
            }
        });
        return str.replace(/^\s|\s$/, '');
    };

    LAY.removeStr = function (str, new_str) {
        str = str.replace(/\s+/, ' ');
        new_str = new_str.replace(/\s+/, ' ').split(' ');
        lay.each(new_str, function (ii, item) {
            var exp = new RegExp('\\b' + item + '\\b');
            if (exp.test(str)) {
                str = str.replace(exp, '');
            }
        });
        return str.replace(/\s+/, ' ').replace(/^\s|\s$/, '');
    };

    LAY.prototype.find = function (selector) {
        var that = this;
        var index = 0,
            arr = [],
            isObject = (typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) === 'object';

        this.each(function (i, item) {
            var nativeDOM = isObject ? [selector] : item.querySelectorAll(selector || null);
            for (; index < nativeDOM.length; index++) {
                arr.push(nativeDOM[index]);
            }
            that.shift();
        });

        if (!isObject) {
            that.selector = (that.selector ? that.selector + ' ' : '') + selector;
        }

        lay.each(arr, function (i, item) {
            that.push(item);
        });

        return that;
    };

    LAY.prototype.each = function (fn) {
        return lay.each.call(this, this, fn);
    };

    LAY.prototype.addClass = function (className, type) {
        return this.each(function (index, item) {
            item.className = LAY[type ? 'removeStr' : 'addStr'](item.className, className);
        });
    };

    LAY.prototype.removeClass = function (className) {
        return this.addClass(className, true);
    };

    LAY.prototype.hasClass = function (className) {
        var has = false;
        this.each(function (index, item) {
            if (new RegExp('\\b' + className + '\\b').test(item.className)) {
                has = true;
            }
        });
        return has;
    };

    LAY.prototype.attr = function (key, value) {
        var that = this;

        if (value === undefined) {
            if (that.length > 0) {
                return that[0].getAttribute(key);
            }
        } else {
            return that.each(function (index, item) {
                item.setAttribute(key, value);
            });
        }
    };

    LAY.prototype.removeAttr = function (key) {
        return this.each(function (index, item) {
            item.removeAttribute(key);
        });
    };

    LAY.prototype.html = function (html) {
        return this.each(function (index, item) {
            item.innerHTML = html;
        });
    };

    LAY.prototype.val = function (value) {
        return this.each(function (index, item) {
            item.value = value;
        });
    };

    LAY.prototype.append = function (elem) {
        return this.each(function (index, item) {
            (typeof elem === 'undefined' ? 'undefined' : _typeof(elem)) === 'object' ? item.appendChild(elem) : item.innerHTML = item.innerHTML + elem;
        });
    };

    LAY.prototype.remove = function (elem) {
        return this.each(function (index, item) {
            elem ? item.removeChild(elem) : item.parentNode.removeChild(item);
        });
    };

    LAY.prototype.on = function (eventName, fn) {
        return this.each(function (index, item) {
            if (item.attachEvent) {
                item.attachEvent('on' + eventName, function (e) {
                    e.target = e.srcElement;
                    fn.call(item, e);
                });
            } else {
                item.addEventListener(eventName, fn, false);
            }
        });
    };

    LAY.prototype.off = function (eventName, fn) {
        return this.each(function (index, item) {
            item.detachEvent ? item.detachEvent('on' + eventName, fn) : item.removeEventListener(eventName, fn, false);
        });
    };

    Class.isLeapYear = function (year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    };

    Class.prototype.config = {
        type: 'date',
        range: false,
        format: 'yyyy-MM-dd',
        value: null,
        min: '1900-1-1',
        max: '2099-12-31',
        trigger: 'focus',
        show: false,
        showBottom: true,
        btns: ['clear', 'now', 'confirm'],
        lang: 'cn',
        theme: 'default',
        position: null,
        calendar: false,
        mark: {},
        zIndex: null,
        done: null,
        change: null };

    Class.prototype.lang = function () {
        var that = this,
            options = that.config,
            text = {
            cn: {
                weeks: ['日', '一', '二', '三', '四', '五', '六'],
                time: ['时', '分', '秒'],
                timeTips: '选择时间',
                startTime: '开始时间',
                endTime: '结束时间',
                dateTips: '返回日期',
                month: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                tools: {
                    confirm: '确定',
                    clear: '清空',
                    now: '现在'
                }
            },
            en: {
                weeks: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                time: ['Hours', 'Minutes', 'Seconds'],
                timeTips: 'Select Time',
                startTime: 'Start Time',
                endTime: 'End Time',
                dateTips: 'Select Date',
                month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                tools: {
                    confirm: 'Confirm',
                    clear: 'Clear',
                    now: 'Now'
                }
            }
        };
        return text[options.lang] || text['cn'];
    };

    Class.prototype.init = function () {
        var that = this,
            options = that.config,
            dateType = 'yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s',
            isStatic = options.position === 'static',
            format = {
            year: 'yyyy',
            month: 'yyyy-MM',
            date: 'yyyy-MM-dd',
            time: 'HH:mm:ss',
            datetime: 'yyyy-MM-dd HH:mm:ss'
        };

        options.elem = lay(options.elem);
        options.eventElem = lay(options.eventElem);

        if (!options.elem[0]) return;

        if (options.range === true) {
            options.range = '-';
        }

        if (options.format === format.date) {
            options.format = format[options.type];
        }

        that.format = options.format.match(new RegExp(dateType + '|.', 'g')) || [];

        that.EXP_IF = '';
        that.EXP_SPLIT = '';
        lay.each(that.format, function (i, item) {
            var result = function () {
                if (new RegExp(dateType).test(that.format[i === 0 ? i + 1 : i - 1] || '')) {
                    if (/^yyyy|y$/.test(item)) return 4;
                    return item.length;
                }
                if (/^yyyy$/.test(item)) return '1,4';
                if (/^y$/.test(item)) return '1,308';
                return '1,2';
            }();

            var EXP = new RegExp(dateType).test(item) ? '\\d{' + result + '}' : '\\' + item;
            that.EXP_IF = that.EXP_IF + EXP;
            that.EXP_SPLIT = that.EXP_SPLIT + '(' + EXP + ')';
        });
        that.EXP_IF = new RegExp('^' + (options.range ? that.EXP_IF + '\\s\\' + options.range + '\\s' + that.EXP_IF : that.EXP_IF) + '$');
        that.EXP_SPLIT = new RegExp('^' + that.EXP_SPLIT + '$', '');

        if (!that.isInput(options.elem[0])) {
            if (options.trigger === 'focus') {
                options.trigger = 'click';
            }
        }

        if (!options.elem.attr('lay-key')) {
            options.elem.attr('lay-key', that.index);
            options.eventElem.attr('lay-key', that.index);
        }

        var chinaHolidays = {
            '0-1-1': '元旦',
            '0-2-14': '情人',
            '0-3-8': '妇女',
            '0-3-12': '植树',
            '0-4-1': '愚人',
            '0-5-1': '劳动',
            '0-5-4': '青年',
            '0-6-1': '儿童',
            '0-9-10': '教师',
            '0-9-18': '国耻',
            '0-10-1': '国庆',
            '0-12-25': '圣诞'
        };

        options.mark = lay.extend({}, options.calendar && options.lang === 'cn' ? chinaHolidays : {}, options.mark);

        lay.each(['min', 'max'], function (i, item) {
            var ymd = [],
                hms = [];
            if (typeof options[item] === 'number') {
                var day = options[item],
                    time = new Date().getTime(),
                    STAMP = 86400000,
                    _thisDate = new Date(day ? day < STAMP ? time + day * STAMP : day : time);
                ymd = [_thisDate.getFullYear(), _thisDate.getMonth() + 1, _thisDate.getDate()];
                day < STAMP || (hms = [_thisDate.getHours(), _thisDate.getMinutes(), _thisDate.getSeconds()]);
            } else {
                ymd = (options[item].match(/\d+-\d+-\d+/) || [''])[0].split('-');
                hms = (options[item].match(/\d+:\d+:\d+/) || [''])[0].split(':');
            }
            options[item] = {
                year: ymd[0] | 0 || new Date().getFullYear(),
                month: ymd[1] ? (ymd[1] | 0) - 1 : new Date().getMonth(),
                date: ymd[2] | 0 || new Date().getDate(),
                hours: hms[0] | 0,
                minutes: hms[1] | 0,
                seconds: hms[2] | 0
            };
        });

        that.elemID = 'layui-laydate' + options.elem.attr('lay-key');

        if (options.show || isStatic) that.render();
        isStatic || that.events();

        if (options.value) {
            if (options.value.constructor === Date) {
                that.setValue(that.parse(0, that.systemDate(options.value)));
            } else {
                that.setValue(options.value);
            }
        }
    };

    Class.prototype.render = function () {
        var that = this,
            options = that.config,
            lang = that.lang(),
            isStatic = options.position === 'static',
            elem = that.elem = lay.elem('div', {
            id: that.elemID,
            'class': ['layui-laydate', options.range ? ' layui-laydate-range' : '', isStatic ? ' ' + ELEM_STATIC : '', options.theme && options.theme !== 'default' && !/^#/.test(options.theme) ? ' laydate-theme-' + options.theme : ''].join('')
        }),
            elemMain = that.elemMain = [],
            elemHeader = that.elemHeader = [],
            elemCont = that.elemCont = [],
            elemTable = that.table = [],
            divFooter = that.footer = lay.elem('div', {
            'class': ELEM_FOOTER
        });

        if (options.zIndex) elem.style.zIndex = options.zIndex;

        lay.each(new Array(2), function (i) {
            if (!options.range && i > 0) {
                return true;
            }

            var divHeader = lay.elem('div', {
                'class': 'layui-laydate-header'
            }),
                headerChild = [function () {
                var elem = lay.elem('i', {
                    'class': 'layui-icon laydate-icon laydate-prev-y'
                });
                elem.innerHTML = '&#xe65a;';
                return elem;
            }(), function () {
                var elem = lay.elem('i', {
                    'class': 'layui-icon laydate-icon laydate-prev-m'
                });
                elem.innerHTML = '&#xe603;';
                return elem;
            }(), function () {
                var elem = lay.elem('div', {
                    'class': 'laydate-set-ym'
                }),
                    spanY = lay.elem('span'),
                    spanM = lay.elem('span');
                elem.appendChild(spanY);
                elem.appendChild(spanM);
                return elem;
            }(), function () {
                var elem = lay.elem('i', {
                    'class': 'layui-icon laydate-icon laydate-next-m'
                });
                elem.innerHTML = '&#xe602;';
                return elem;
            }(), function () {
                var elem = lay.elem('i', {
                    'class': 'layui-icon laydate-icon laydate-next-y'
                });
                elem.innerHTML = '&#xe65b;';
                return elem;
            }()],
                divContent = lay.elem('div', {
                'class': 'layui-laydate-content'
            }),
                table = lay.elem('table'),
                thead = lay.elem('thead'),
                theadTr = lay.elem('tr');

            lay.each(headerChild, function (i, item) {
                divHeader.appendChild(item);
            });

            thead.appendChild(theadTr);
            lay.each(new Array(6), function (i) {
                var tr = table.insertRow(0);
                lay.each(new Array(7), function (j) {
                    if (i === 0) {
                        var th = lay.elem('th');
                        th.innerHTML = lang.weeks[j];
                        theadTr.appendChild(th);
                    }
                    tr.insertCell(j);
                });
            });
            table.insertBefore(thead, table.children[0]);
            divContent.appendChild(table);

            elemMain[i] = lay.elem('div', {
                'class': 'layui-laydate-main laydate-main-list-' + i
            });

            elemMain[i].appendChild(divHeader);
            elemMain[i].appendChild(divContent);

            elemHeader.push(headerChild);
            elemCont.push(divContent);
            elemTable.push(table);
        });

        lay(divFooter).html(function () {
            var html = [],
                btns = [];
            if (options.type === 'datetime') {
                html.push('<span lay-type="datetime" class="laydate-btns-time">' + lang.timeTips + '</span>');
            }
            lay.each(options.btns, function (i, item) {
                var title = lang.tools[item] || 'btn';
                if (options.range && item === 'now') return;
                if (isStatic && item === 'clear') title = options.lang === 'cn' ? '重置' : 'Reset';
                btns.push('<span lay-type="' + item + '" class="laydate-btns-' + item + '">' + title + '</span>');
            });
            html.push('<div class="laydate-footer-btns">' + btns.join('') + '</div>');
            return html.join('');
        }());

        lay.each(elemMain, function (i, main) {
            elem.appendChild(main);
        });
        options.showBottom && elem.appendChild(divFooter);

        if (/^#/.test(options.theme)) {
            var style = lay.elem('style'),
                styleText = ['#{{id}} .layui-laydate-header{background-color:{{theme}};}', '#{{id}} .layui-this{background-color:{{theme}} !important;}'].join('').replace(/{{id}}/g, that.elemID).replace(/{{theme}}/g, options.theme);

            if ('styleSheet' in style) {
                style.setAttribute('type', 'text/css');
                style.styleSheet.cssText = styleText;
            } else {
                style.innerHTML = styleText;
            }

            lay(elem).addClass('laydate-theme-molv');
            elem.appendChild(style);
        }

        that.remove(Class.thisElemDate);

        if (isStatic) {
            options.elem.append(elem);
        } else {
            document.body.appendChild(elem);
            that.position();
        }

        that.checkDate().calendar();
        that.changeEvent();

        Class.thisElemDate = that.elemID;

        typeof options.ready === 'function' && options.ready(lay.extend({}, options.dateTime, {
            month: options.dateTime.month + 1
        }));
    };

    Class.prototype.remove = function (prev) {
        var elem = lay('#' + (prev || this.elemID));

        if (!elem.hasClass(ELEM_STATIC)) {
            this.checkDate(function () {
                elem.remove();
            });
        }
        return this;
    };

    Class.prototype.position = function () {
        var that = this,
            options = that.config,
            elem = that.bindElem || options.elem[0],
            rect = elem.getBoundingClientRect(),
            elemWidth = that.elem.offsetWidth,
            elemHeight = that.elem.offsetHeight,
            scrollArea = function scrollArea(type) {
            type = type ? 'scrollLeft' : 'scrollTop';
            return document.body[type] | document.documentElement[type];
        },
            winArea = function winArea(type) {
            return document.documentElement[type ? 'clientWidth' : 'clientHeight'];
        },
            margin = 5,
            left = rect.left,
            top = rect.bottom;

        if (left + elemWidth + margin > winArea('width')) {
            left = winArea('width') - elemWidth - margin;
        }

        if (top + elemHeight + margin > winArea()) {
            top = rect.top > elemHeight ? rect.top - elemHeight : winArea() - elemHeight;
            top = top - margin * 2;
        }

        if (options.position) {
            that.elem.style.position = options.position;
        }
        that.elem.style.left = left + (options.position === 'fixed' ? 0 : scrollArea(1)) + 'px';
        that.elem.style.top = top + (options.position === 'fixed' ? 0 : scrollArea()) + 'px';
    };

    Class.prototype.hint = function (content) {
        var that = this,
            div = lay.elem('div', {
            'class': ELEM_HINT
        });

        div.innerHTML = content || '';
        lay(that.elem).find('.' + ELEM_HINT).remove();
        that.elem.appendChild(div);

        clearTimeout(that.hinTimer);
        that.hinTimer = setTimeout(function () {
            lay(that.elem).find('.' + ELEM_HINT).remove();
        }, 3000);
    };

    Class.prototype.getAsYM = function (Y, M, type) {
        type ? M-- : M++;
        if (M < 0) {
            M = 11;
            Y--;
        }
        if (M > 11) {
            M = 0;
            Y++;
        }
        return [Y, M];
    };

    Class.prototype.systemDate = function (newDate) {
        var thisDate = newDate || new Date();
        return {
            year: thisDate.getFullYear(),
            month: thisDate.getMonth(),
            date: thisDate.getDate(),
            hours: newDate ? newDate.getHours() : 0,
            minutes: newDate ? newDate.getMinutes() : 0,
            seconds: newDate ? newDate.getSeconds() : 0 };
    };

    Class.prototype.checkDate = function (fn) {
        var that = this,
            options = that.config,
            dateTime = options.dateTime = options.dateTime || that.systemDate(),
            thisMaxDate = void 0,
            error = void 0,
            elem = that.bindElem || options.elem[0],
            value = that.isInput(elem) ? elem.value : options.position === 'static' ? '' : elem.innerHTML,
            checkValid = function checkValid(dateTime) {
            if (dateTime.year > LIMIT_YEAR[1]) {
                dateTime.year = LIMIT_YEAR[1];
                error = true;
            }
            if (dateTime.month > 11) {
                dateTime.month = 11;
                error = true;
            }
            if (dateTime.hours > 23) {
                dateTime.hours = 0;
                error = true;
            }
            if (dateTime.minutes > 59) {
                dateTime.minutes = 0;
                dateTime.hours++;
                error = true;
            }
            if (dateTime.seconds > 59) {
                dateTime.seconds = 0;
                dateTime.minutes++;
                error = true;
            }

            thisMaxDate = laydate.getEndDate(dateTime.month + 1, dateTime.year);
            if (dateTime.date > thisMaxDate) {
                dateTime.date = thisMaxDate;
                error = true;
            }
        },
            initDate = function initDate(dateTime, value, index) {
            var startEnd = ['startTime', 'endTime'];
            value = (value.match(that.EXP_SPLIT) || []).slice(1);
            index = index || 0;
            if (options.range) {
                that[startEnd[index]] = that[startEnd[index]] || {};
            }
            lay.each(that.format, function (i, item) {
                var thisv = parseFloat(value[i]);
                if (value[i].length < item.length) {
                    error = true;
                }
                if (/yyyy|y/.test(item)) {
                    if (thisv < LIMIT_YEAR[0]) {
                        thisv = LIMIT_YEAR[0];
                        error = true;
                    }
                    dateTime.year = thisv;
                } else if (/MM|M/.test(item)) {
                    if (thisv < 1) {
                        thisv = 1;
                        error = true;
                    }
                    dateTime.month = thisv - 1;
                } else if (/dd|d/.test(item)) {
                    if (thisv < 1) {
                        thisv = 1;
                        error = true;
                    }
                    dateTime.date = thisv;
                } else if (/HH|H/.test(item)) {
                    if (thisv < 1) {
                        thisv = 0;
                        error = true;
                    }
                    dateTime.hours = thisv;
                    options.range && (that[startEnd[index]].hours = thisv);
                } else if (/mm|m/.test(item)) {
                    if (thisv < 1) {
                        thisv = 0;
                        error = true;
                    }
                    dateTime.minutes = thisv;
                    options.range && (that[startEnd[index]].minutes = thisv);
                } else if (/ss|s/.test(item)) {
                    if (thisv < 1) {
                        thisv = 0;
                        error = true;
                    }
                    dateTime.seconds = thisv;
                    options.range && (that[startEnd[index]].seconds = thisv);
                }
            });
            checkValid(dateTime);
        };

        if (fn === 'limit') {
            checkValid(dateTime);
            return that;
        }

        value = value || options.value;
        if (typeof value === 'string') {
            value = value.replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
        }

        if (that.startState && !that.endState) {
            delete that.startState;
            that.endState = true;
        }

        if (typeof value === 'string' && value) {
            if (that.EXP_IF.test(value)) {
                if (options.range) {
                    value = value.split(' ' + options.range + ' ');
                    that.startDate = that.startDate || that.systemDate();
                    that.endDate = that.endDate || that.systemDate();
                    options.dateTime = lay.extend({}, that.startDate);
                    lay.each([that.startDate, that.endDate], function (i, item) {
                        initDate(item, value[i], i);
                    });
                } else {
                    initDate(dateTime, value);
                }
            } else {
                that.hint('日期格式不合法<br>必须遵循下述格式：<br>' + (options.range ? options.format + ' ' + options.range + ' ' + options.format : options.format) + '<br>已为你重置');
                error = true;
            }
        } else if (value && value.constructor === Date) {
            options.dateTime = that.systemDate(value);
        } else {
            options.dateTime = that.systemDate();
            delete that.startState;
            delete that.endState;
            delete that.startDate;
            delete that.endDate;
            delete that.startTime;
            delete that.endTime;
        }

        checkValid(dateTime);

        if (error && value) {
            that.setValue(options.range ? that.endDate ? that.parse() : '' : that.parse());
        }
        fn && fn();
        return that;
    };

    Class.prototype.mark = function (td, YMD) {
        var that = this,
            mark = void 0,
            options = that.config;
        lay.each(options.mark, function (key, title) {
            var keys = key.split('-');
            if ((keys[0] == YMD[0] || keys[0] == 0) && (keys[1] == YMD[1] || keys[1] == 0) && keys[2] == YMD[2]) {
                mark = title || YMD[2];
            }
        });
        mark && td.html('<span class="laydate-day-mark">' + mark + '</span>');

        return that;
    };

    Class.prototype.limit = function (elem, date, index, time) {
        var that = this,
            options = that.config,
            timestrap = {},
            dateTime = options[index > 41 ? 'endDate' : 'dateTime'],
            isOut = void 0,
            thisDateTime = lay.extend({}, dateTime, date || {});
        lay.each({
            now: thisDateTime,
            min: options.min,
            max: options.max
        }, function (key, item) {
            timestrap[key] = that.newDate(lay.extend({
                year: item.year,
                month: item.month,
                date: item.date
            }, function () {
                var hms = {};
                lay.each(time, function (i, keys) {
                    hms[keys] = item[keys];
                });
                return hms;
            }())).getTime();
        });

        isOut = timestrap.now < timestrap.min || timestrap.now > timestrap.max;
        elem && elem[isOut ? 'addClass' : 'removeClass'](DISABLED);
        return isOut;
    };

    Class.prototype.calendar = function (value) {
        var that = this,
            options = that.config,
            dateTime = value || options.dateTime,
            thisDate = new Date(),
            startWeek = void 0,
            prevMaxDate = void 0,
            thisMaxDate = void 0,
            lang = that.lang(),
            isAlone = options.type !== 'date' && options.type !== 'datetime',
            index = value ? 1 : 0,
            tds = lay(that.table[index]).find('td'),
            elemYM = lay(that.elemHeader[index][2]).find('span');

        if (dateTime.year < LIMIT_YEAR[0]) {
            dateTime.year = LIMIT_YEAR[0];
            that.hint('最低只能支持到公元' + LIMIT_YEAR[0] + '年');
        }

        if (dateTime.year > LIMIT_YEAR[1]) {
            dateTime.year = LIMIT_YEAR[1];
            that.hint('最高只能支持到公元' + LIMIT_YEAR[1] + '年');
        }

        if (!that.firstDate) {
            that.firstDate = lay.extend({}, dateTime);
        }

        thisDate.setFullYear(dateTime.year, dateTime.month, 1);
        startWeek = thisDate.getDay();

        prevMaxDate = laydate.getEndDate(dateTime.month || 12, dateTime.year);
        thisMaxDate = laydate.getEndDate(dateTime.month + 1, dateTime.year);
        lay.each(tds, function (index, item) {
            var YMD = [dateTime.year, dateTime.month],
                st = 0;
            item = lay(item);
            item.removeAttr('class');
            if (index < startWeek) {
                st = prevMaxDate - startWeek + index;
                item.addClass('laydate-day-prev');
                YMD = that.getAsYM(dateTime.year, dateTime.month, 'sub');
            } else if (index >= startWeek && index < thisMaxDate + startWeek) {
                st = index - startWeek;
                if (!options.range) {
                    st + 1 === dateTime.date && item.addClass(THIS);
                }
            } else {
                st = index - thisMaxDate - startWeek;
                item.addClass('laydate-day-next');
                YMD = that.getAsYM(dateTime.year, dateTime.month);
            }
            YMD[1]++;
            YMD[2] = st + 1;
            item.attr('lay-ymd', YMD.join('-')).html(YMD[2]);
            that.mark(item, YMD).limit(item, {
                year: YMD[0],
                month: YMD[1] - 1,
                date: YMD[2]
            }, index);
        });

        lay(elemYM[0]).attr('lay-ym', dateTime.year + '-' + (dateTime.month + 1));
        lay(elemYM[1]).attr('lay-ym', dateTime.year + '-' + (dateTime.month + 1));

        if (options.lang === 'cn') {
            lay(elemYM[0]).attr('lay-type', 'year').html(dateTime.year + '年');
            lay(elemYM[1]).attr('lay-type', 'month').html(dateTime.month + 1 + '月');
        } else {
            lay(elemYM[0]).attr('lay-type', 'month').html(lang.month[dateTime.month]);
            lay(elemYM[1]).attr('lay-type', 'year').html(dateTime.year);
        }

        if (isAlone) {
            if (options.range) {
                if (value) {
                    that.endDate = that.endDate || {
                        year: dateTime.year + (options.type === 'year' ? 1 : 0),
                        month: dateTime.month + (options.type === 'month' ? 0 : -1)
                    };
                } else {
                    that.startDate = that.startDate || {
                        year: dateTime.year,
                        month: dateTime.month
                    };
                }

                if (value) {
                    that.listYM = [[that.startDate.year, that.startDate.month + 1], [that.endDate.year, that.endDate.month + 1]];
                    that.list(options.type, 0).list(options.type, 1);

                    if (options.type === 'time') {
                        that.setBtnStatus('时间', lay.extend({}, that.systemDate(), that.startTime), lay.extend({}, that.systemDate(), that.endTime));
                    } else {
                        that.setBtnStatus(true);
                    }
                }
            }
            if (!options.range) {
                that.listYM = [[dateTime.year, dateTime.month + 1]];
                that.list(options.type, 0);
            }
        }

        if (options.range && !value) {
            var EYM = that.getAsYM(dateTime.year, dateTime.month);
            that.calendar(lay.extend({}, dateTime, {
                year: EYM[0],
                month: EYM[1]
            }));
        }

        if (!options.range) that.limit(lay(that.footer).find(ELEM_CONFIRM), null, 0, ['hours', 'minutes', 'seconds']);

        if (options.range && value && !isAlone) that.stampRange();
        return that;
    };

    Class.prototype.list = function (type, index) {
        var that = this,
            options = that.config,
            dateTime = options.dateTime,
            lang = that.lang(),
            isAlone = options.range && options.type !== 'date' && options.type !== 'datetime',
            ul = lay.elem('ul', {
            'class': ELEM_LIST + ' ' + {
                year: 'laydate-year-list',
                month: 'laydate-month-list',
                time: 'laydate-time-list'
            }[type]
        }),
            elemHeader = that.elemHeader[index],
            elemYM = lay(elemHeader[2]).find('span'),
            elemCont = that.elemCont[index || 0],
            haveList = lay(elemCont).find('.' + ELEM_LIST)[0],
            isCN = options.lang === 'cn',
            text = isCN ? '年' : '',
            listYM = that.listYM[index] || {},
            hms = ['hours', 'minutes', 'seconds'],
            startEnd = ['startTime', 'endTime'][index],
            setTimeStatus = void 0;

        if (listYM[0] < 1) listYM[0] = 1;

        if (type === 'year') {
            var yearNum = void 0,
                startY = yearNum = listYM[0] - 7;
            if (startY < 1) startY = yearNum = 1;
            lay.each(new Array(15), function () {
                var li = lay.elem('li', {
                    'lay-ym': yearNum
                }),
                    ymd = { year: yearNum };
                yearNum == listYM[0] && lay(li).addClass(THIS);
                li.innerHTML = yearNum + text;
                ul.appendChild(li);
                if (yearNum < that.firstDate.year) {
                    ymd.month = options.min.month;
                    ymd.date = options.min.date;
                } else if (yearNum >= that.firstDate.year) {
                    ymd.month = options.max.month;
                    ymd.date = options.max.date;
                }
                that.limit(lay(li), ymd, index);
                yearNum++;
            });
            lay(elemYM[isCN ? 0 : 1]).attr('lay-ym', yearNum - 8 + '-' + listYM[1]).html(startY + text + ' - ' + (yearNum - 1 + text));
        } else if (type === 'month') {
            lay.each(new Array(12), function (i) {
                var li = lay.elem('li', {
                    'lay-ym': i
                }),
                    ymd = { year: listYM[0], month: i };
                i + 1 == listYM[1] && lay(li).addClass(THIS);
                li.innerHTML = lang.month[i] + (isCN ? '月' : '');
                ul.appendChild(li);
                if (listYM[0] < that.firstDate.year) {
                    ymd.date = options.min.date;
                } else if (listYM[0] >= that.firstDate.year) {
                    ymd.date = options.max.date;
                }
                that.limit(lay(li), ymd, index);
            });
            lay(elemYM[isCN ? 0 : 1]).attr('lay-ym', listYM[0] + '-' + listYM[1]).html(listYM[0] + text);
        } else if (type === 'time') {
            setTimeStatus = function setTimeStatus() {
                lay(ul).find('ol').each(function (i, ol) {
                    lay(ol).find('li').each(function (ii, li) {
                        that.limit(lay(li), [{
                            hours: ii
                        }, {
                            hours: that[startEnd].hours,
                            minutes: ii
                        }, {
                            hours: that[startEnd].hours,
                            minutes: that[startEnd].minutes,
                            seconds: ii
                        }][i], index, [['hours'], ['hours', 'minutes'], ['hours', 'minutes', 'seconds']][i]);
                    });
                });
                if (!options.range) that.limit(lay(that.footer).find(ELEM_CONFIRM), that[startEnd], 0, ['hours', 'minutes', 'seconds']);
            };
            if (options.range) {
                if (!that[startEnd]) that[startEnd] = {
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                };
            } else {
                that[startEnd] = dateTime;
            }
            lay.each([24, 60, 60], function (i, item) {
                var li = lay.elem('li'),
                    childUL = ['<p>' + lang.time[i] + '</p><ol>'];
                lay.each(new Array(item), function (ii) {
                    childUL.push('<li' + (that[startEnd][hms[i]] === ii ? ' class="' + THIS + '"' : '') + '>' + lay.digit(ii, 2) + '</li>');
                });
                li.innerHTML = childUL.join('') + '</ol>';
                ul.appendChild(li);
            });
            setTimeStatus();
        }

        if (haveList) elemCont.removeChild(haveList);
        elemCont.appendChild(ul);

        if (type === 'year' || type === 'month') {
            lay(that.elemMain[index]).addClass('laydate-ym-show');

            lay(ul).find('li').on('click', function () {
                var ym = lay(this).attr('lay-ym') | 0;
                if (lay(this).hasClass(DISABLED)) return;

                if (index === 0) {
                    dateTime[type] = ym;
                    if (isAlone) that.startDate[type] = ym;
                    that.limit(lay(that.footer).find(ELEM_CONFIRM), null, 0);
                } else {
                    if (isAlone) {
                        that.endDate[type] = ym;
                    } else {
                        var YM = type === 'year' ? that.getAsYM(ym, listYM[1] - 1, 'sub') : that.getAsYM(listYM[0], ym, 'sub');
                        lay.extend(dateTime, {
                            year: YM[0],
                            month: YM[1]
                        });
                    }
                }

                if (options.type === 'year' || options.type === 'month') {
                    lay(ul).find('.' + THIS).removeClass(THIS);
                    lay(this).addClass(THIS);

                    if (options.type === 'month' && type === 'year') {
                        that.listYM[index][0] = ym;
                        isAlone && (that[['startDate', 'endDate'][index]].year = ym);
                        that.list('month', index);
                    }
                } else {
                    that.checkDate('limit').calendar();
                    that.closeList();
                }

                that.setBtnStatus();
                options.range || that.done(null, 'change');
                lay(that.footer).find(ELEM_TIME_BTN).removeClass(DISABLED);
            });
        } else {
            var span = lay.elem('span', {
                'class': ELEM_TIME_TEXT
            }),
                scroll = function scroll() {
                lay(ul).find('ol').each(function (i) {
                    var ol = this,
                        li = lay(ol).find('li');
                    ol.scrollTop = 30 * (that[startEnd][hms[i]] - 2);
                    if (ol.scrollTop <= 0) {
                        li.each(function (ii) {
                            if (!lay(this).hasClass(DISABLED)) {
                                ol.scrollTop = 30 * (ii - 2);
                                return true;
                            }
                        });
                    }
                });
            },
                haveSpan = lay(elemHeader[2]).find('.' + ELEM_TIME_TEXT);
            scroll();
            span.innerHTML = options.range ? [lang.startTime, lang.endTime][index] : lang.timeTips;
            lay(that.elemMain[index]).addClass('laydate-time-show');
            if (haveSpan[0]) haveSpan.remove();
            elemHeader[2].appendChild(span);

            lay(ul).find('ol').each(function (i) {
                var ol = this;

                lay(ol).find('li').on('click', function () {
                    var value = this.innerHTML | 0;
                    if (lay(this).hasClass(DISABLED)) return;
                    if (options.range) {
                        that[startEnd][hms[i]] = value;
                    } else {
                        dateTime[hms[i]] = value;
                    }
                    lay(ol).find('.' + THIS).removeClass(THIS);
                    lay(this).addClass(THIS);

                    setTimeStatus();
                    scroll();(that.endDate || options.type === 'time') && that.done(null, 'change');

                    that.setBtnStatus();
                });
            });
        }

        return that;
    };

    Class.prototype.listYM = [];

    Class.prototype.closeList = function () {
        var that = this;

        lay.each(that.elemCont, function (index) {
            lay(this).find('.' + ELEM_LIST).remove();
            lay(that.elemMain[index]).removeClass('laydate-ym-show laydate-time-show');
        });
        lay(that.elem).find('.' + ELEM_TIME_TEXT).remove();
    };

    Class.prototype.setBtnStatus = function (tips, start, end) {
        var that = this,
            options = that.config,
            isOut = void 0,
            elemBtn = lay(that.footer).find(ELEM_CONFIRM),
            isAlone = options.range && options.type !== 'date' && options.type !== 'time';

        if (isAlone) {
            start = start || that.startDate;
            end = end || that.endDate;
            isOut = that.newDate(start).getTime() > that.newDate(end).getTime();

            that.limit(null, start) || that.limit(null, end) ? elemBtn.addClass(DISABLED) : elemBtn[isOut ? 'addClass' : 'removeClass'](DISABLED);

            if (tips && isOut) that.hint(typeof tips === 'string' ? TIPS_OUT.replace(/日期/g, tips) : TIPS_OUT);
        }
    };

    Class.prototype.parse = function (state, date) {
        var that = this,
            options = that.config,
            dateTime = void 0,
            format = that.format.concat();

        if (date) {
            dateTime = date;
        } else {
            if (state) {
                dateTime = lay.extend({}, that.endDate, that.endTime);
            } else {
                dateTime = options.range ? lay.extend({}, that.startDate, that.startTime) : options.dateTime;
            }
        }

        lay.each(format, function (i, item) {
            if (/yyyy|y/.test(item)) {
                format[i] = lay.digit(dateTime.year, item.length);
            } else if (/MM|M/.test(item)) {
                format[i] = lay.digit(dateTime.month + 1, item.length);
            } else if (/dd|d/.test(item)) {
                format[i] = lay.digit(dateTime.date, item.length);
            } else if (/HH|H/.test(item)) {
                format[i] = lay.digit(dateTime.hours, item.length);
            } else if (/mm|m/.test(item)) {
                format[i] = lay.digit(dateTime.minutes, item.length);
            } else if (/ss|s/.test(item)) {
                format[i] = lay.digit(dateTime.seconds, item.length);
            }
        });

        if (options.range && !state) {
            return format.join('') + ' ' + options.range + ' ' + that.parse(1);
        }

        return format.join('');
    };

    Class.prototype.newDate = function (dateTime) {
        dateTime = dateTime || {};
        return new Date(dateTime.year || 1, dateTime.month || 0, dateTime.date || 1, dateTime.hours || 0, dateTime.minutes || 0, dateTime.seconds || 0);
    };

    Class.prototype.setValue = function (value) {
        var that = this,
            options = that.config,
            elem = that.bindElem || options.elem[0],
            valType = that.isInput(elem) ? 'val' : 'html';

        options.position === 'static' || lay(elem)[valType](value || '');
        return this;
    };

    Class.prototype.stampRange = function () {
        var that = this,
            options = that.config,
            startTime = void 0,
            endTime = void 0,
            tds = lay(that.elem).find('td');

        if (options.range && !that.endDate) lay(that.footer).find(ELEM_CONFIRM).addClass(DISABLED);
        if (!that.endDate) return;

        startTime = that.newDate({
            year: that.startDate.year,
            month: that.startDate.month,
            date: that.startDate.date
        }).getTime();

        endTime = that.newDate({
            year: that.endDate.year,
            month: that.endDate.month,
            date: that.endDate.date
        }).getTime();

        if (startTime > endTime) return that.hint(TIPS_OUT);

        lay.each(tds, function (i, item) {
            var ymd = lay(item).attr('lay-ymd').split('-'),
                thisTime = that.newDate({
                year: ymd[0],
                month: ymd[1] - 1,
                date: ymd[2]
            }).getTime();
            lay(item).removeClass(ELEM_SELECTED + ' ' + THIS);
            if (thisTime === startTime || thisTime === endTime) {
                lay(item).addClass(lay(item).hasClass(ELEM_PREV) || lay(item).hasClass(ELEM_NEXT) ? ELEM_SELECTED : THIS);
            }
            if (thisTime > startTime && thisTime < endTime) {
                lay(item).addClass(ELEM_SELECTED);
            }
        });
    };

    Class.prototype.done = function (param, type) {
        var that = this,
            options = that.config,
            start = lay.extend({}, that.startDate ? lay.extend(that.startDate, that.startTime) : options.dateTime),
            end = lay.extend({}, lay.extend(that.endDate, that.endTime));

        lay.each([start, end], function (i, item) {
            if (!('month' in item)) return;
            lay.extend(item, {
                month: item.month + 1
            });
        });

        param = param || [that.parse(), start, end];
        typeof options[type || 'done'] === 'function' && options[type || 'done'].apply(options, param);

        return that;
    };

    Class.prototype.choose = function (td) {
        var that = this,
            options = that.config,
            dateTime = options.dateTime,
            tds = lay(that.elem).find('td'),
            YMD = td.attr('lay-ymd').split('-'),
            setDateTime = function setDateTime(one) {
            one && lay.extend(dateTime, YMD);

            if (options.range) {
                that.startDate ? lay.extend(that.startDate, YMD) : that.startDate = lay.extend({}, YMD, that.startTime);
                that.startYMD = YMD;
            }
        };

        YMD = {
            year: YMD[0] | 0,
            month: (YMD[1] | 0) - 1,
            date: YMD[2] | 0
        };

        if (td.hasClass(DISABLED)) return;

        if (options.range) {
            lay.each(['startTime', 'endTime'], function (i, item) {
                that[item] = that[item] || {
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                };
            });

            if (that.endState) {
                setDateTime();
                delete that.endState;
                delete that.endDate;
                that.startState = true;
                tds.removeClass(THIS + ' ' + ELEM_SELECTED);
                td.addClass(THIS);
            } else if (that.startState) {
                td.addClass(THIS);

                that.endDate ? lay.extend(that.endDate, YMD) : that.endDate = lay.extend({}, YMD, that.endTime);

                if (that.newDate(YMD).getTime() < that.newDate(that.startYMD).getTime()) {
                    var startDate = lay.extend({}, that.endDate, {
                        hours: that.startDate.hours,
                        minutes: that.startDate.minutes,
                        seconds: that.startDate.seconds
                    });
                    lay.extend(that.endDate, that.startDate, {
                        hours: that.endDate.hours,
                        minutes: that.endDate.minutes,
                        seconds: that.endDate.seconds
                    });
                    that.startDate = startDate;
                }

                options.showBottom || that.done();
                that.stampRange();
                that.endState = true;
                that.done(null, 'change');
            } else {
                td.addClass(THIS);
                setDateTime();
                that.startState = true;
            }

            var $confirm = lay(that.footer).find(ELEM_CONFIRM);

            $confirm[that.endDate ? 'removeClass' : 'addClass'](DISABLED);
        } else if (options.position === 'static') {
            setDateTime(true);
            that.calendar().done().done(null, 'change');
        } else if (options.type === 'date') {
            setDateTime(true);
            that.setValue(that.parse()).remove().done();
        } else if (options.type === 'datetime') {
            setDateTime(true);
            that.calendar().done(null, 'change');
        }
    };

    Class.prototype.tool = function (btn, type) {
        var that = this,
            options = that.config,
            dateTime = options.dateTime,
            isStatic = options.position === 'static',
            active = {
            datetime: function datetime() {
                if (lay(btn).hasClass(DISABLED)) return;
                that.list('time', 0);
                options.range && that.list('time', 1);
                lay(btn).attr('lay-type', 'date').html(that.lang().dateTips);
            },

            date: function date() {
                that.closeList();
                lay(btn).attr('lay-type', 'datetime').html(that.lang().timeTips);
            },

            clear: function clear() {
                that.setValue('').remove();

                if (isStatic) {
                    lay.extend(dateTime, that.firstDate);
                    that.calendar();
                }

                if (options.range) {
                    delete that.startState;
                    delete that.endState;
                    delete that.endDate;
                    delete that.startTime;
                    delete that.endTime;
                }
                that.done(['', {}, {}]);
            },

            now: function now() {
                var thisDate = new Date();
                lay.extend(dateTime, that.systemDate(), {
                    hours: thisDate.getHours(),
                    minutes: thisDate.getMinutes(),
                    seconds: thisDate.getSeconds()
                });
                that.setValue(that.parse()).remove();
                isStatic && that.calendar();
                that.done();
            },

            confirm: function confirm() {
                if (options.range) {
                    if (!that.endDate) return that.hint('请先选择日期范围');
                    if (lay(btn).hasClass(DISABLED)) return that.hint(options.type === 'time' ? TIPS_OUT.replace(/日期/g, '时间') : TIPS_OUT);
                } else {
                    if (lay(btn).hasClass(DISABLED)) return that.hint('不在有效日期或时间范围内');
                }
                that.done();
                that.setValue(that.parse()).remove();
            }
        };
        active[type] && active[type]();
    };

    Class.prototype.change = function (index) {
        var that = this,
            options = that.config,
            dateTime = options.dateTime,
            isAlone = options.range && (options.type === 'year' || options.type === 'month'),
            elemCont = that.elemCont[index || 0],
            listYM = that.listYM[index],
            addSubYeay = function addSubYeay(type) {
            var startEnd = ['startDate', 'endDate'][index],
                isYear = lay(elemCont).find('.laydate-year-list')[0],
                isMonth = lay(elemCont).find('.laydate-month-list')[0];

            if (isYear) {
                listYM[0] = type ? listYM[0] - 15 : listYM[0] + 15;
                that.list('year', index);
            }

            if (isMonth) {
                type ? listYM[0]-- : listYM[0]++;
                that.list('month', index);
            }

            if (isYear || isMonth) {
                lay.extend(dateTime, {
                    year: listYM[0]
                });
                if (isAlone) that[startEnd].year = listYM[0];
                options.range || that.done(null, 'change');
                that.setBtnStatus();
                options.range || that.limit(lay(that.footer).find(ELEM_CONFIRM), {
                    year: listYM[0]
                });
            }
            return isYear || isMonth;
        };

        return {
            prevYear: function prevYear() {
                if (addSubYeay('sub')) return;
                dateTime.year--;
                that.checkDate('limit').calendar();
                options.range || that.done(null, 'change');
            },
            prevMonth: function prevMonth() {
                var YM = that.getAsYM(dateTime.year, dateTime.month, 'sub');
                lay.extend(dateTime, {
                    year: YM[0],
                    month: YM[1]
                });
                that.checkDate('limit').calendar();
                options.range || that.done(null, 'change');
            },
            nextMonth: function nextMonth() {
                var YM = that.getAsYM(dateTime.year, dateTime.month);
                lay.extend(dateTime, {
                    year: YM[0],
                    month: YM[1]
                });
                that.checkDate('limit').calendar();
                options.range || that.done(null, 'change');
            },
            nextYear: function nextYear() {
                if (addSubYeay()) return;
                dateTime.year++;
                that.checkDate('limit').calendar();
                options.range || that.done(null, 'change');
            }
        };
    };

    Class.prototype.changeEvent = function () {
        var that = this;

        lay(that.elem).on('click', function (e) {
            lay.stope(e);
        });

        lay.each(that.elemHeader, function (i, header) {
            lay(header[0]).on('click', function () {
                that.change(i).prevYear();
            });

            lay(header[1]).on('click', function () {
                that.change(i).prevMonth();
            });

            lay(header[2]).find('span').on('click', function () {
                var othis = lay(this),
                    layYM = othis.attr('lay-ym'),
                    layType = othis.attr('lay-type');

                if (!layYM) return;

                layYM = layYM.split('-');

                that.listYM[i] = [layYM[0] | 0, layYM[1] | 0];
                that.list(layType, i);
                lay(that.footer).find(ELEM_TIME_BTN).addClass(DISABLED);
            });

            lay(header[3]).on('click', function () {
                that.change(i).nextMonth();
            });

            lay(header[4]).on('click', function () {
                that.change(i).nextYear();
            });
        });

        lay.each(that.table, function (i, table) {
            var tds = lay(table).find('td');
            tds.on('click', function () {
                that.choose(lay(this));
            });
        });

        lay(that.footer).find('span').on('click', function () {
            var type = lay(this).attr('lay-type');
            that.tool(this, type);
        });
    };

    Class.prototype.isInput = function (elem) {
        return (/input|textarea/.test(elem.tagName.toLocaleLowerCase())
        );
    };

    Class.prototype.events = function () {
        var that = this,
            options = that.config,
            showEvent = function showEvent(elem, bind) {
            elem.on(options.trigger, function () {
                bind && (that.bindElem = this);
                that.render();
            });
        };

        if (!options.elem[0] || options.elem[0].eventHandler) return;

        showEvent(options.elem, 'bind');
        showEvent(options.eventElem);

        lay(document).on('click', function (e) {
            if (e.target === options.elem[0] || e.target === options.eventElem[0] || e.target === lay(options.closeStop)[0]) {
                return;
            }
            that.remove();
        }).on('keydown', function (e) {
            if (e.keyCode === 13) {
                if (lay('#' + that.elemID)[0] && that.elemID === Class.thisElem) {
                    e.preventDefault();
                    lay(that.footer).find(ELEM_CONFIRM)[0].click();
                }
            }
        });

        lay(window).on('resize', function () {
            if (!that.elem || !lay(ELEM)[0]) {
                return false;
            }
            that.position();
        });

        options.elem[0].eventHandler = true;
    };

    laydate.render = function (options) {
        var inst = new Class(options);
        return thisDate.call(inst);
    };

    laydate.getEndDate = function (month, year) {
        var thisDate = new Date();

        thisDate.setFullYear(year || thisDate.getFullYear(), month || thisDate.getMonth() + 1, 1);

        return new Date(thisDate.getTime() - 1000 * 60 * 60 * 24).getDate();
    };

    window.lay = window.lay || lay;

    if (isLayui) {
        laydate.ready();
        layui.define(function (exports) {
            laydate.path = layui.cache.dir;
            exports(MOD_NAME, laydate);
        });
    } else {
        if (typeof define === 'function' && define.amd) {
            define(function () {
                return laydate;
            });
        } else {
            laydate.ready();
            window.laydate = laydate;
        }
    }
}();var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {

	if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
		module.exports = global.document ? factory(global, true) : function (w) {
			if (!w.document) {
				throw new Error("jQuery requires a window with a document");
			}
			return factory(w);
		};
	} else {
		factory(global);
	}
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
	var deletedIds = [];

	var document = window.document;

	var _slice = deletedIds.slice;

	var concat = deletedIds.concat;

	var push = deletedIds.push;

	var indexOf = deletedIds.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var support = {};

	var version = "1.12.3",
	    jQuery = function jQuery(selector, context) {
		return new jQuery.fn.init(selector, context);
	},
	    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	    rmsPrefix = /^-ms-/,
	    rdashAlpha = /-([\da-z])/gi,
	    fcamelCase = function fcamelCase(all, letter) {
		return letter.toUpperCase();
	};

	jQuery.fn = jQuery.prototype = {
		jquery: version,

		constructor: jQuery,

		selector: "",

		length: 0,

		toArray: function toArray() {
			return _slice.call(this);
		},

		get: function get(num) {
			return num != null ? num < 0 ? this[num + this.length] : this[num] : _slice.call(this);
		},

		pushStack: function pushStack(elems) {
			var ret = jQuery.merge(this.constructor(), elems);

			ret.prevObject = this;
			ret.context = this.context;

			return ret;
		},

		each: function each(callback) {
			return jQuery.each(this, callback);
		},

		map: function map(callback) {
			return this.pushStack(jQuery.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		slice: function slice() {
			return this.pushStack(_slice.apply(this, arguments));
		},

		first: function first() {
			return this.eq(0);
		},

		last: function last() {
			return this.eq(-1);
		},

		eq: function eq(i) {
			var len = this.length,
			    j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end: function end() {
			return this.prevObject || this.constructor();
		},

		push: push,
		sort: deletedIds.sort,
		splice: deletedIds.splice
	};

	jQuery.extend = jQuery.fn.extend = function () {
		var src,
		    copyIsArray,
		    copy,
		    name,
		    options,
		    clone,
		    target = arguments[0] || {},
		    i = 1,
		    length = arguments.length,
		    deep = false;

		if (typeof target === "boolean") {
			deep = target;

			target = arguments[i] || {};
			i++;
		}

		if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}

					if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {

						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						target[name] = jQuery.extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};

	jQuery.extend({
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

		isReady: true,

		error: function error(msg) {
			throw new Error(msg);
		},

		noop: function noop() {},

		isFunction: function isFunction(obj) {
			return jQuery.type(obj) === "function";
		},

		isArray: Array.isArray || function (obj) {
			return jQuery.type(obj) === "array";
		},

		isWindow: function isWindow(obj) {
			return obj != null && obj == obj.window;
		},

		isNumeric: function isNumeric(obj) {
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray(obj) && realStringObj - parseFloat(realStringObj) + 1 >= 0;
		},

		isEmptyObject: function isEmptyObject(obj) {
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},

		isPlainObject: function isPlainObject(obj) {
			var key;

			if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
				return false;
			}

			try {
				if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
					return false;
				}
			} catch (e) {
				return false;
			}

			if (!support.ownFirst) {
				for (key in obj) {
					return hasOwn.call(obj, key);
				}
			}

			for (key in obj) {}

			return key === undefined || hasOwn.call(obj, key);
		},

		type: function type(obj) {
			if (obj == null) {
				return obj + "";
			}
			return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
		},

		globalEval: function globalEval(data) {
			if (data && jQuery.trim(data)) {
				(window.execScript || function (data) {
					window["eval"].call(window, data);
				})(data);
			}
		},

		camelCase: function camelCase(string) {
			return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
		},

		nodeName: function nodeName(elem, name) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		each: function each(obj, callback) {
			var length,
			    i = 0;

			if (isArrayLike(obj)) {
				length = obj.length;
				for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			}

			return obj;
		},

		trim: function trim(text) {
			return text == null ? "" : (text + "").replace(rtrim, "");
		},

		makeArray: function makeArray(arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArrayLike(Object(arr))) {
					jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
				} else {
					push.call(ret, arr);
				}
			}

			return ret;
		},

		inArray: function inArray(elem, arr, i) {
			var len;

			if (arr) {
				if (indexOf) {
					return indexOf.call(arr, elem, i);
				}

				len = arr.length;
				i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

				for (; i < len; i++) {
					if (i in arr && arr[i] === elem) {
						return i;
					}
				}
			}

			return -1;
		},

		merge: function merge(first, second) {
			var len = +second.length,
			    j = 0,
			    i = first.length;

			while (j < len) {
				first[i++] = second[j++];
			}

			if (len !== len) {
				while (second[j] !== undefined) {
					first[i++] = second[j++];
				}
			}

			first.length = i;

			return first;
		},

		grep: function grep(elems, callback, invert) {
			var callbackInverse,
			    matches = [],
			    i = 0,
			    length = elems.length,
			    callbackExpect = !invert;

			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		},

		map: function map(elems, callback, arg) {
			var length,
			    value,
			    i = 0,
			    ret = [];

			if (isArrayLike(elems)) {
				length = elems.length;
				for (; i < length; i++) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}
			} else {
				for (i in elems) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}
			}

			return concat.apply([], ret);
		},

		guid: 1,

		proxy: function proxy(fn, context) {
			var args, proxy, tmp;

			if (typeof context === "string") {
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			if (!jQuery.isFunction(fn)) {
				return undefined;
			}

			args = _slice.call(arguments, 2);
			proxy = function proxy() {
				return fn.apply(context || this, args.concat(_slice.call(arguments)));
			};

			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: function now() {
			return +new Date();
		},

		support: support
	});

	if (typeof Symbol === "function") {
		jQuery.fn[Symbol.iterator] = deletedIds[Symbol.iterator];
	}

	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	function isArrayLike(obj) {
		var length = !!obj && "length" in obj && obj.length,
		    type = jQuery.type(obj);

		if (type === "function" || jQuery.isWindow(obj)) {
			return false;
		}

		return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
	}
	var Sizzle = function (window) {

		var i,
		    support,
		    Expr,
		    getText,
		    isXML,
		    tokenize,
		    compile,
		    select,
		    outermostContext,
		    sortInput,
		    hasDuplicate,
		    setDocument,
		    document,
		    docElem,
		    documentIsHTML,
		    rbuggyQSA,
		    rbuggyMatches,
		    matches,
		    contains,
		    expando = "sizzle" + 1 * new Date(),
		    preferredDoc = window.document,
		    dirruns = 0,
		    done = 0,
		    classCache = createCache(),
		    tokenCache = createCache(),
		    compilerCache = createCache(),
		    sortOrder = function sortOrder(a, b) {
			if (a === b) {
				hasDuplicate = true;
			}
			return 0;
		},
		    MAX_NEGATIVE = 1 << 31,
		    hasOwn = {}.hasOwnProperty,
		    arr = [],
		    pop = arr.pop,
		    push_native = arr.push,
		    push = arr.push,
		    slice = arr.slice,
		    indexOf = function indexOf(list, elem) {
			var i = 0,
			    len = list.length;
			for (; i < len; i++) {
				if (list[i] === elem) {
					return i;
				}
			}
			return -1;
		},
		    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
		    whitespace = "[\\x20\\t\\r\\n\\f]",
		    identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
		    attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
		    pseudos = ":(" + identifier + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + ".*" + ")\\)|)",
		    rwhitespace = new RegExp(whitespace + "+", "g"),
		    rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
		    rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
		    rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
		    rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
		    rpseudo = new RegExp(pseudos),
		    ridentifier = new RegExp("^" + identifier + "$"),
		    matchExpr = {
			"ID": new RegExp("^#(" + identifier + ")"),
			"CLASS": new RegExp("^\\.(" + identifier + ")"),
			"TAG": new RegExp("^(" + identifier + "|[*])"),
			"ATTR": new RegExp("^" + attributes),
			"PSEUDO": new RegExp("^" + pseudos),
			"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
			"bool": new RegExp("^(?:" + booleans + ")$", "i"),

			"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
		},
		    rinputs = /^(?:input|select|textarea|button)$/i,
		    rheader = /^h\d$/i,
		    rnative = /^[^{]+\{\s*\[native \w/,
		    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
		    rsibling = /[+~]/,
		    rescape = /'|\\/g,
		    runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
		    funescape = function funescape(_, escaped, escapedWhitespace) {
			var high = "0x" + escaped - 0x10000;

			return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
		},
		    unloadHandler = function unloadHandler() {
			setDocument();
		};

		try {
			push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);

			arr[preferredDoc.childNodes.length].nodeType;
		} catch (e) {
			push = { apply: arr.length ? function (target, els) {
					push_native.apply(target, slice.call(els));
				} : function (target, els) {
					var j = target.length,
					    i = 0;

					while (target[j++] = els[i++]) {}
					target.length = j - 1;
				}
			};
		}

		function Sizzle(selector, context, results, seed) {
			var m,
			    i,
			    elem,
			    nid,
			    nidselect,
			    match,
			    groups,
			    newSelector,
			    newContext = context && context.ownerDocument,
			    nodeType = context ? context.nodeType : 9;

			results = results || [];

			if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

				return results;
			}

			if (!seed) {

				if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
					setDocument(context);
				}
				context = context || document;

				if (documentIsHTML) {
					if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
						if (m = match[1]) {
							if (nodeType === 9) {
								if (elem = context.getElementById(m)) {
									if (elem.id === m) {
										results.push(elem);
										return results;
									}
								} else {
									return results;
								}
							} else {
								if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {

									results.push(elem);
									return results;
								}
							}
						} else if (match[2]) {
							push.apply(results, context.getElementsByTagName(selector));
							return results;
						} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {

							push.apply(results, context.getElementsByClassName(m));
							return results;
						}
					}

					if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {

						if (nodeType !== 1) {
							newContext = context;
							newSelector = selector;
						} else if (context.nodeName.toLowerCase() !== "object") {
							if (nid = context.getAttribute("id")) {
								nid = nid.replace(rescape, "\\$&");
							} else {
								context.setAttribute("id", nid = expando);
							}

							groups = tokenize(selector);
							i = groups.length;
							nidselect = ridentifier.test(nid) ? "#" + nid : "[id='" + nid + "']";
							while (i--) {
								groups[i] = nidselect + " " + toSelector(groups[i]);
							}
							newSelector = groups.join(",");

							newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
						}

						if (newSelector) {
							try {
								push.apply(results, newContext.querySelectorAll(newSelector));
								return results;
							} catch (qsaError) {} finally {
								if (nid === expando) {
									context.removeAttribute("id");
								}
							}
						}
					}
				}
			}

			return select(selector.replace(rtrim, "$1"), context, results, seed);
		}

		function createCache() {
			var keys = [];

			function cache(key, value) {
				if (keys.push(key + " ") > Expr.cacheLength) {
					delete cache[keys.shift()];
				}
				return cache[key + " "] = value;
			}
			return cache;
		}

		function markFunction(fn) {
			fn[expando] = true;
			return fn;
		}

		function assert(fn) {
			var div = document.createElement("div");

			try {
				return !!fn(div);
			} catch (e) {
				return false;
			} finally {
				if (div.parentNode) {
					div.parentNode.removeChild(div);
				}

				div = null;
			}
		}

		function addHandle(attrs, handler) {
			var arr = attrs.split("|"),
			    i = arr.length;

			while (i--) {
				Expr.attrHandle[arr[i]] = handler;
			}
		}

		function siblingCheck(a, b) {
			var cur = b && a,
			    diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);

			if (diff) {
				return diff;
			}

			if (cur) {
				while (cur = cur.nextSibling) {
					if (cur === b) {
						return -1;
					}
				}
			}

			return a ? 1 : -1;
		}

		function createInputPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === type;
			};
		}

		function createButtonPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && elem.type === type;
			};
		}

		function createPositionalPseudo(fn) {
			return markFunction(function (argument) {
				argument = +argument;
				return markFunction(function (seed, matches) {
					var j,
					    matchIndexes = fn([], seed.length, argument),
					    i = matchIndexes.length;

					while (i--) {
						if (seed[j = matchIndexes[i]]) {
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}

		function testContext(context) {
			return context && typeof context.getElementsByTagName !== "undefined" && context;
		}

		support = Sizzle.support = {};

		isXML = Sizzle.isXML = function (elem) {
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};

		setDocument = Sizzle.setDocument = function (node) {
			var hasCompare,
			    parent,
			    doc = node ? node.ownerDocument || node : preferredDoc;

			if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
				return document;
			}

			document = doc;
			docElem = document.documentElement;
			documentIsHTML = !isXML(document);

			if ((parent = document.defaultView) && parent.top !== parent) {
				if (parent.addEventListener) {
					parent.addEventListener("unload", unloadHandler, false);
				} else if (parent.attachEvent) {
					parent.attachEvent("onunload", unloadHandler);
				}
			}

			support.attributes = assert(function (div) {
				div.className = "i";
				return !div.getAttribute("className");
			});

			support.getElementsByTagName = assert(function (div) {
				div.appendChild(document.createComment(""));
				return !div.getElementsByTagName("*").length;
			});

			support.getElementsByClassName = rnative.test(document.getElementsByClassName);

			support.getById = assert(function (div) {
				docElem.appendChild(div).id = expando;
				return !document.getElementsByName || !document.getElementsByName(expando).length;
			});

			if (support.getById) {
				Expr.find["ID"] = function (id, context) {
					if (typeof context.getElementById !== "undefined" && documentIsHTML) {
						var m = context.getElementById(id);
						return m ? [m] : [];
					}
				};
				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						return elem.getAttribute("id") === attrId;
					};
				};
			} else {
				delete Expr.find["ID"];

				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
						return node && node.value === attrId;
					};
				};
			}

			Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
				if (typeof context.getElementsByTagName !== "undefined") {
					return context.getElementsByTagName(tag);
				} else if (support.qsa) {
					return context.querySelectorAll(tag);
				}
			} : function (tag, context) {
				var elem,
				    tmp = [],
				    i = 0,
				    results = context.getElementsByTagName(tag);

				if (tag === "*") {
					while (elem = results[i++]) {
						if (elem.nodeType === 1) {
							tmp.push(elem);
						}
					}

					return tmp;
				}
				return results;
			};

			Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
				if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
					return context.getElementsByClassName(className);
				}
			};

			rbuggyMatches = [];

			rbuggyQSA = [];

			if (support.qsa = rnative.test(document.querySelectorAll)) {
				assert(function (div) {
					docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";

					if (div.querySelectorAll("[msallowcapture^='']").length) {
						rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
					}

					if (!div.querySelectorAll("[selected]").length) {
						rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
					}

					if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
						rbuggyQSA.push("~=");
					}

					if (!div.querySelectorAll(":checked").length) {
						rbuggyQSA.push(":checked");
					}

					if (!div.querySelectorAll("a#" + expando + "+*").length) {
						rbuggyQSA.push(".#.+[+~]");
					}
				});

				assert(function (div) {
					var input = document.createElement("input");
					input.setAttribute("type", "hidden");
					div.appendChild(input).setAttribute("name", "D");

					if (div.querySelectorAll("[name=d]").length) {
						rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
					}

					if (!div.querySelectorAll(":enabled").length) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					div.querySelectorAll("*,:x");
					rbuggyQSA.push(",.*:");
				});
			}

			if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {

				assert(function (div) {
					support.disconnectedMatch = matches.call(div, "div");

					matches.call(div, "[s!='']:x");
					rbuggyMatches.push("!=", pseudos);
				});
			}

			rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
			rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

			hasCompare = rnative.test(docElem.compareDocumentPosition);

			contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
				    bup = b && b.parentNode;
				return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
			} : function (a, b) {
				if (b) {
					while (b = b.parentNode) {
						if (b === a) {
							return true;
						}
					}
				}
				return false;
			};

			sortOrder = hasCompare ? function (a, b) {
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
				if (compare) {
					return compare;
				}

				compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;

				if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
					if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
						return -1;
					}
					if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
						return 1;
					}

					return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
				}

				return compare & 4 ? -1 : 1;
			} : function (a, b) {
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				var cur,
				    i = 0,
				    aup = a.parentNode,
				    bup = b.parentNode,
				    ap = [a],
				    bp = [b];

				if (!aup || !bup) {
					return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
				} else if (aup === bup) {
					return siblingCheck(a, b);
				}

				cur = a;
				while (cur = cur.parentNode) {
					ap.unshift(cur);
				}
				cur = b;
				while (cur = cur.parentNode) {
					bp.unshift(cur);
				}

				while (ap[i] === bp[i]) {
					i++;
				}

				return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
			};

			return document;
		};

		Sizzle.matches = function (expr, elements) {
			return Sizzle(expr, null, null, elements);
		};

		Sizzle.matchesSelector = function (elem, expr) {
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			expr = expr.replace(rattributeQuotes, "='$1']");

			if (support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {

				try {
					var ret = matches.call(elem, expr);

					if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
						return ret;
					}
				} catch (e) {}
			}

			return Sizzle(expr, document, null, [elem]).length > 0;
		};

		Sizzle.contains = function (context, elem) {
			if ((context.ownerDocument || context) !== document) {
				setDocument(context);
			}
			return contains(context, elem);
		};

		Sizzle.attr = function (elem, name) {
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			var fn = Expr.attrHandle[name.toLowerCase()],
			    val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;

			return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
		};

		Sizzle.error = function (msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg);
		};

		Sizzle.uniqueSort = function (results) {
			var elem,
			    duplicates = [],
			    j = 0,
			    i = 0;

			hasDuplicate = !support.detectDuplicates;
			sortInput = !support.sortStable && results.slice(0);
			results.sort(sortOrder);

			if (hasDuplicate) {
				while (elem = results[i++]) {
					if (elem === results[i]) {
						j = duplicates.push(i);
					}
				}
				while (j--) {
					results.splice(duplicates[j], 1);
				}
			}

			sortInput = null;

			return results;
		};

		getText = Sizzle.getText = function (elem) {
			var node,
			    ret = "",
			    i = 0,
			    nodeType = elem.nodeType;

			if (!nodeType) {
				while (node = elem[i++]) {
					ret += getText(node);
				}
			} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				if (typeof elem.textContent === "string") {
					return elem.textContent;
				} else {
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						ret += getText(elem);
					}
				}
			} else if (nodeType === 3 || nodeType === 4) {
				return elem.nodeValue;
			}


			return ret;
		};

		Expr = Sizzle.selectors = {
			cacheLength: 50,

			createPseudo: markFunction,

			match: matchExpr,

			attrHandle: {},

			find: {},

			relative: {
				">": { dir: "parentNode", first: true },
				" ": { dir: "parentNode" },
				"+": { dir: "previousSibling", first: true },
				"~": { dir: "previousSibling" }
			},

			preFilter: {
				"ATTR": function ATTR(match) {
					match[1] = match[1].replace(runescape, funescape);

					match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

					if (match[2] === "~=") {
						match[3] = " " + match[3] + " ";
					}

					return match.slice(0, 4);
				},

				"CHILD": function CHILD(match) {
					match[1] = match[1].toLowerCase();

					if (match[1].slice(0, 3) === "nth") {
						if (!match[3]) {
							Sizzle.error(match[0]);
						}

						match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
						match[5] = +(match[7] + match[8] || match[3] === "odd");
					} else if (match[3]) {
						Sizzle.error(match[0]);
					}

					return match;
				},

				"PSEUDO": function PSEUDO(match) {
					var excess,
					    unquoted = !match[6] && match[2];

					if (matchExpr["CHILD"].test(match[0])) {
						return null;
					}

					if (match[3]) {
						match[2] = match[4] || match[5] || "";
					} else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
						match[0] = match[0].slice(0, excess);
						match[2] = unquoted.slice(0, excess);
					}

					return match.slice(0, 3);
				}
			},

			filter: {

				"TAG": function TAG(nodeNameSelector) {
					var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
					return nodeNameSelector === "*" ? function () {
						return true;
					} : function (elem) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
				},

				"CLASS": function CLASS(className) {
					var pattern = classCache[className + " "];

					return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
						return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
					});
				},

				"ATTR": function ATTR(name, operator, check) {
					return function (elem) {
						var result = Sizzle.attr(elem, name);

						if (result == null) {
							return operator === "!=";
						}
						if (!operator) {
							return true;
						}

						result += "";

						return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
					};
				},

				"CHILD": function CHILD(type, what, argument, first, last) {
					var simple = type.slice(0, 3) !== "nth",
					    forward = type.slice(-4) !== "last",
					    ofType = what === "of-type";

					return first === 1 && last === 0 ? function (elem) {
						return !!elem.parentNode;
					} : function (elem, context, xml) {
						var cache,
						    uniqueCache,
						    outerCache,
						    node,
						    nodeIndex,
						    start,
						    dir = simple !== forward ? "nextSibling" : "previousSibling",
						    parent = elem.parentNode,
						    name = ofType && elem.nodeName.toLowerCase(),
						    useCache = !xml && !ofType,
						    diff = false;

						if (parent) {
							if (simple) {
								while (dir) {
									node = elem;
									while (node = node[dir]) {
										if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {

											return false;
										}
									}

									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [forward ? parent.firstChild : parent.lastChild];

							if (forward && useCache) {
								node = parent;
								outerCache = node[expando] || (node[expando] = {});

								uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

								cache = uniqueCache[type] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = nodeIndex && cache[2];
								node = nodeIndex && parent.childNodes[nodeIndex];

								while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
									if (node.nodeType === 1 && ++diff && node === elem) {
										uniqueCache[type] = [dirruns, nodeIndex, diff];
										break;
									}
								}
							} else {
								if (useCache) {
									node = elem;
									outerCache = node[expando] || (node[expando] = {});

									uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

									cache = uniqueCache[type] || [];
									nodeIndex = cache[0] === dirruns && cache[1];
									diff = nodeIndex;
								}

								if (diff === false) {
									while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {

										if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
											if (useCache) {
												outerCache = node[expando] || (node[expando] = {});

												uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

												uniqueCache[type] = [dirruns, diff];
											}

											if (node === elem) {
												break;
											}
										}
									}
								}
							}

							diff -= last;
							return diff === first || diff % first === 0 && diff / first >= 0;
						}
					};
				},

				"PSEUDO": function PSEUDO(pseudo, argument) {
					var args,
					    fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);

					if (fn[expando]) {
						return fn(argument);
					}

					if (fn.length > 1) {
						args = [pseudo, pseudo, "", argument];
						return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
							var idx,
							    matched = fn(seed, argument),
							    i = matched.length;
							while (i--) {
								idx = indexOf(seed, matched[i]);
								seed[idx] = !(matches[idx] = matched[i]);
							}
						}) : function (elem) {
							return fn(elem, 0, args);
						};
					}

					return fn;
				}
			},

			pseudos: {
				"not": markFunction(function (selector) {
					var input = [],
					    results = [],
					    matcher = compile(selector.replace(rtrim, "$1"));

					return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
						var elem,
						    unmatched = matcher(seed, null, xml, []),
						    i = seed.length;

						while (i--) {
							if (elem = unmatched[i]) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) : function (elem, context, xml) {
						input[0] = elem;
						matcher(input, null, xml, results);

						input[0] = null;
						return !results.pop();
					};
				}),

				"has": markFunction(function (selector) {
					return function (elem) {
						return Sizzle(selector, elem).length > 0;
					};
				}),

				"contains": markFunction(function (text) {
					text = text.replace(runescape, funescape);
					return function (elem) {
						return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
					};
				}),

				"lang": markFunction(function (lang) {
					if (!ridentifier.test(lang || "")) {
						Sizzle.error("unsupported lang: " + lang);
					}
					lang = lang.replace(runescape, funescape).toLowerCase();
					return function (elem) {
						var elemLang;
						do {
							if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {

								elemLang = elemLang.toLowerCase();
								return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
							}
						} while ((elem = elem.parentNode) && elem.nodeType === 1);
						return false;
					};
				}),

				"target": function target(elem) {
					var hash = window.location && window.location.hash;
					return hash && hash.slice(1) === elem.id;
				},

				"root": function root(elem) {
					return elem === docElem;
				},

				"focus": function focus(elem) {
					return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
				},

				"enabled": function enabled(elem) {
					return elem.disabled === false;
				},

				"disabled": function disabled(elem) {
					return elem.disabled === true;
				},

				"checked": function checked(elem) {
					var nodeName = elem.nodeName.toLowerCase();
					return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
				},

				"selected": function selected(elem) {
					if (elem.parentNode) {
						elem.parentNode.selectedIndex;
					}

					return elem.selected === true;
				},

				"empty": function empty(elem) {
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						if (elem.nodeType < 6) {
							return false;
						}
					}
					return true;
				},

				"parent": function parent(elem) {
					return !Expr.pseudos["empty"](elem);
				},

				"header": function header(elem) {
					return rheader.test(elem.nodeName);
				},

				"input": function input(elem) {
					return rinputs.test(elem.nodeName);
				},

				"button": function button(elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && elem.type === "button" || name === "button";
				},

				"text": function text(elem) {
					var attr;
					return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
				},

				"first": createPositionalPseudo(function () {
					return [0];
				}),

				"last": createPositionalPseudo(function (matchIndexes, length) {
					return [length - 1];
				}),

				"eq": createPositionalPseudo(function (matchIndexes, length, argument) {
					return [argument < 0 ? argument + length : argument];
				}),

				"even": createPositionalPseudo(function (matchIndexes, length) {
					var i = 0;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"odd": createPositionalPseudo(function (matchIndexes, length) {
					var i = 1;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument;
					for (; --i >= 0;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument;
					for (; ++i < length;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				})
			}
		};

		Expr.pseudos["nth"] = Expr.pseudos["eq"];

		for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
			Expr.pseudos[i] = createInputPseudo(i);
		}
		for (i in { submit: true, reset: true }) {
			Expr.pseudos[i] = createButtonPseudo(i);
		}

		function setFilters() {}
		setFilters.prototype = Expr.filters = Expr.pseudos;
		Expr.setFilters = new setFilters();

		tokenize = Sizzle.tokenize = function (selector, parseOnly) {
			var matched,
			    match,
			    tokens,
			    type,
			    soFar,
			    groups,
			    preFilters,
			    cached = tokenCache[selector + " "];

			if (cached) {
				return parseOnly ? 0 : cached.slice(0);
			}

			soFar = selector;
			groups = [];
			preFilters = Expr.preFilter;

			while (soFar) {
				if (!matched || (match = rcomma.exec(soFar))) {
					if (match) {
						soFar = soFar.slice(match[0].length) || soFar;
					}
					groups.push(tokens = []);
				}

				matched = false;

				if (match = rcombinators.exec(soFar)) {
					matched = match.shift();
					tokens.push({
						value: matched,

						type: match[0].replace(rtrim, " ")
					});
					soFar = soFar.slice(matched.length);
				}

				for (type in Expr.filter) {
					if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
						matched = match.shift();
						tokens.push({
							value: matched,
							type: type,
							matches: match
						});
						soFar = soFar.slice(matched.length);
					}
				}

				if (!matched) {
					break;
				}
			}

			return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
		};

		function toSelector(tokens) {
			var i = 0,
			    len = tokens.length,
			    selector = "";
			for (; i < len; i++) {
				selector += tokens[i].value;
			}
			return selector;
		}

		function addCombinator(matcher, combinator, base) {
			var dir = combinator.dir,
			    checkNonElements = base && dir === "parentNode",
			    doneName = done++;

			return combinator.first ? function (elem, context, xml) {
				while (elem = elem[dir]) {
					if (elem.nodeType === 1 || checkNonElements) {
						return matcher(elem, context, xml);
					}
				}
			} : function (elem, context, xml) {
				var oldCache,
				    uniqueCache,
				    outerCache,
				    newCache = [dirruns, doneName];

				if (xml) {
					while (elem = elem[dir]) {
						if (elem.nodeType === 1 || checkNonElements) {
							if (matcher(elem, context, xml)) {
								return true;
							}
						}
					}
				} else {
					while (elem = elem[dir]) {
						if (elem.nodeType === 1 || checkNonElements) {
							outerCache = elem[expando] || (elem[expando] = {});

							uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

							if ((oldCache = uniqueCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
								return newCache[2] = oldCache[2];
							} else {
								uniqueCache[dir] = newCache;

								if (newCache[2] = matcher(elem, context, xml)) {
									return true;
								}
							}
						}
					}
				}
			};
		}

		function elementMatcher(matchers) {
			return matchers.length > 1 ? function (elem, context, xml) {
				var i = matchers.length;
				while (i--) {
					if (!matchers[i](elem, context, xml)) {
						return false;
					}
				}
				return true;
			} : matchers[0];
		}

		function multipleContexts(selector, contexts, results) {
			var i = 0,
			    len = contexts.length;
			for (; i < len; i++) {
				Sizzle(selector, contexts[i], results);
			}
			return results;
		}

		function condense(unmatched, map, filter, context, xml) {
			var elem,
			    newUnmatched = [],
			    i = 0,
			    len = unmatched.length,
			    mapped = map != null;

			for (; i < len; i++) {
				if (elem = unmatched[i]) {
					if (!filter || filter(elem, context, xml)) {
						newUnmatched.push(elem);
						if (mapped) {
							map.push(i);
						}
					}
				}
			}

			return newUnmatched;
		}

		function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
			if (postFilter && !postFilter[expando]) {
				postFilter = setMatcher(postFilter);
			}
			if (postFinder && !postFinder[expando]) {
				postFinder = setMatcher(postFinder, postSelector);
			}
			return markFunction(function (seed, results, context, xml) {
				var temp,
				    i,
				    elem,
				    preMap = [],
				    postMap = [],
				    preexisting = results.length,
				    elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
				    matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
				    matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;

				if (matcher) {
					matcher(matcherIn, matcherOut, context, xml);
				}

				if (postFilter) {
					temp = condense(matcherOut, postMap);
					postFilter(temp, [], context, xml);

					i = temp.length;
					while (i--) {
						if (elem = temp[i]) {
							matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
						}
					}
				}

				if (seed) {
					if (postFinder || preFilter) {
						if (postFinder) {
							temp = [];
							i = matcherOut.length;
							while (i--) {
								if (elem = matcherOut[i]) {
									temp.push(matcherIn[i] = elem);
								}
							}
							postFinder(null, matcherOut = [], temp, xml);
						}

						i = matcherOut.length;
						while (i--) {
							if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

								seed[temp] = !(results[temp] = elem);
							}
						}
					}
				} else {
					matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
					if (postFinder) {
						postFinder(null, results, matcherOut, xml);
					} else {
						push.apply(results, matcherOut);
					}
				}
			});
		}

		function matcherFromTokens(tokens) {
			var checkContext,
			    matcher,
			    j,
			    len = tokens.length,
			    leadingRelative = Expr.relative[tokens[0].type],
			    implicitRelative = leadingRelative || Expr.relative[" "],
			    i = leadingRelative ? 1 : 0,
			    matchContext = addCombinator(function (elem) {
				return elem === checkContext;
			}, implicitRelative, true),
			    matchAnyContext = addCombinator(function (elem) {
				return indexOf(checkContext, elem) > -1;
			}, implicitRelative, true),
			    matchers = [function (elem, context, xml) {
				var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));

				checkContext = null;
				return ret;
			}];

			for (; i < len; i++) {
				if (matcher = Expr.relative[tokens[i].type]) {
					matchers = [addCombinator(elementMatcher(matchers), matcher)];
				} else {
					matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

					if (matcher[expando]) {
						j = ++i;
						for (; j < len; j++) {
							if (Expr.relative[tokens[j].type]) {
								break;
							}
						}
						return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
					}
					matchers.push(matcher);
				}
			}

			return elementMatcher(matchers);
		}

		function matcherFromGroupMatchers(elementMatchers, setMatchers) {
			var bySet = setMatchers.length > 0,
			    byElement = elementMatchers.length > 0,
			    superMatcher = function superMatcher(seed, context, xml, results, outermost) {
				var elem,
				    j,
				    matcher,
				    matchedCount = 0,
				    i = "0",
				    unmatched = seed && [],
				    setMatched = [],
				    contextBackup = outermostContext,
				    elems = seed || byElement && Expr.find["TAG"]("*", outermost),
				    dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
				    len = elems.length;

				if (outermost) {
					outermostContext = context === document || context || outermost;
				}

				for (; i !== len && (elem = elems[i]) != null; i++) {
					if (byElement && elem) {
						j = 0;
						if (!context && elem.ownerDocument !== document) {
							setDocument(elem);
							xml = !documentIsHTML;
						}
						while (matcher = elementMatchers[j++]) {
							if (matcher(elem, context || document, xml)) {
								results.push(elem);
								break;
							}
						}
						if (outermost) {
							dirruns = dirrunsUnique;
						}
					}

					if (bySet) {
						if (elem = !matcher && elem) {
							matchedCount--;
						}

						if (seed) {
							unmatched.push(elem);
						}
					}
				}

				matchedCount += i;

				if (bySet && i !== matchedCount) {
					j = 0;
					while (matcher = setMatchers[j++]) {
						matcher(unmatched, setMatched, context, xml);
					}

					if (seed) {
						if (matchedCount > 0) {
							while (i--) {
								if (!(unmatched[i] || setMatched[i])) {
									setMatched[i] = pop.call(results);
								}
							}
						}

						setMatched = condense(setMatched);
					}

					push.apply(results, setMatched);

					if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {

						Sizzle.uniqueSort(results);
					}
				}

				if (outermost) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

			return bySet ? markFunction(superMatcher) : superMatcher;
		}

		compile = Sizzle.compile = function (selector, match) {
			var i,
			    setMatchers = [],
			    elementMatchers = [],
			    cached = compilerCache[selector + " "];

			if (!cached) {
				if (!match) {
					match = tokenize(selector);
				}
				i = match.length;
				while (i--) {
					cached = matcherFromTokens(match[i]);
					if (cached[expando]) {
						setMatchers.push(cached);
					} else {
						elementMatchers.push(cached);
					}
				}

				cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

				cached.selector = selector;
			}
			return cached;
		};

		select = Sizzle.select = function (selector, context, results, seed) {
			var i,
			    tokens,
			    token,
			    type,
			    find,
			    compiled = typeof selector === "function" && selector,
			    match = !seed && tokenize(selector = compiled.selector || selector);

			results = results || [];

			if (match.length === 1) {
				tokens = match[0] = match[0].slice(0);
				if (tokens.length > 2 && (token = tokens[0]).type === "ID" && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

					context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
					if (!context) {
						return results;
					} else if (compiled) {
						context = context.parentNode;
					}

					selector = selector.slice(tokens.shift().value.length);
				}

				i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
				while (i--) {
					token = tokens[i];

					if (Expr.relative[type = token.type]) {
						break;
					}
					if (find = Expr.find[type]) {
						if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
							tokens.splice(i, 1);
							selector = seed.length && toSelector(tokens);
							if (!selector) {
								push.apply(results, seed);
								return results;
							}

							break;
						}
					}
				}
			}

			(compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
			return results;
		};

		support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

		support.detectDuplicates = !!hasDuplicate;

		setDocument();

		support.sortDetached = assert(function (div1) {
			return div1.compareDocumentPosition(document.createElement("div")) & 1;
		});

		if (!assert(function (div) {
			div.innerHTML = "<a href='#'></a>";
			return div.firstChild.getAttribute("href") === "#";
		})) {
			addHandle("type|href|height|width", function (elem, name, isXML) {
				if (!isXML) {
					return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
				}
			});
		}

		if (!support.attributes || !assert(function (div) {
			div.innerHTML = "<input/>";
			div.firstChild.setAttribute("value", "");
			return div.firstChild.getAttribute("value") === "";
		})) {
			addHandle("value", function (elem, name, isXML) {
				if (!isXML && elem.nodeName.toLowerCase() === "input") {
					return elem.defaultValue;
				}
			});
		}

		if (!assert(function (div) {
			return div.getAttribute("disabled") == null;
		})) {
			addHandle(booleans, function (elem, name, isXML) {
				var val;
				if (!isXML) {
					return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
				}
			});
		}

		return Sizzle;
	}(window);

	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;

	var dir = function dir(elem, _dir, until) {
		var matched = [],
		    truncate = until !== undefined;

		while ((elem = elem[_dir]) && elem.nodeType !== 9) {
			if (elem.nodeType === 1) {
				if (truncate && jQuery(elem).is(until)) {
					break;
				}
				matched.push(elem);
			}
		}
		return matched;
	};

	var _siblings = function _siblings(n, elem) {
		var matched = [];

		for (; n; n = n.nextSibling) {
			if (n.nodeType === 1 && n !== elem) {
				matched.push(n);
			}
		}

		return matched;
	};

	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;

	var risSimple = /^.[^:#\[\.,]*$/;

	function winnow(elements, qualifier, not) {
		if (jQuery.isFunction(qualifier)) {
			return jQuery.grep(elements, function (elem, i) {
				return !!qualifier.call(elem, i, elem) !== not;
			});
		}

		if (qualifier.nodeType) {
			return jQuery.grep(elements, function (elem) {
				return elem === qualifier !== not;
			});
		}

		if (typeof qualifier === "string") {
			if (risSimple.test(qualifier)) {
				return jQuery.filter(qualifier, elements, not);
			}

			qualifier = jQuery.filter(qualifier, elements);
		}

		return jQuery.grep(elements, function (elem) {
			return jQuery.inArray(elem, qualifier) > -1 !== not;
		});
	}

	jQuery.filter = function (expr, elems, not) {
		var elem = elems[0];

		if (not) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
			return elem.nodeType === 1;
		}));
	};

	jQuery.fn.extend({
		find: function find(selector) {
			var i,
			    ret = [],
			    self = this,
			    len = self.length;

			if (typeof selector !== "string") {
				return this.pushStack(jQuery(selector).filter(function () {
					for (i = 0; i < len; i++) {
						if (jQuery.contains(self[i], this)) {
							return true;
						}
					}
				}));
			}

			for (i = 0; i < len; i++) {
				jQuery.find(selector, self[i], ret);
			}

			ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function filter(selector) {
			return this.pushStack(winnow(this, selector || [], false));
		},
		not: function not(selector) {
			return this.pushStack(winnow(this, selector || [], true));
		},
		is: function is(selector) {
			return !!winnow(this, typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
		}
	});

	var rootjQuery,
	    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	    init = jQuery.fn.init = function (selector, context, root) {
		var match, elem;

		if (!selector) {
			return this;
		}

		root = root || rootjQuery;

		if (typeof selector === "string") {
			if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
				match = [null, selector, null];
			} else {
				match = rquickExpr.exec(selector);
			}

			if (match && (match[1] || !context)) {
				if (match[1]) {
					context = context instanceof jQuery ? context[0] : context;

					jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));

					if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
						for (match in context) {
							if (jQuery.isFunction(this[match])) {
								this[match](context[match]);
							} else {
								this.attr(match, context[match]);
							}
						}
					}

					return this;
				} else {
					elem = document.getElementById(match[2]);

					if (elem && elem.parentNode) {
						if (elem.id !== match[2]) {
							return rootjQuery.find(selector);
						}

						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}
			} else if (!context || context.jquery) {
				return (context || root).find(selector);
			} else {
				return this.constructor(context).find(selector);
			}
		} else if (selector.nodeType) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		} else if (jQuery.isFunction(selector)) {
			return typeof root.ready !== "undefined" ? root.ready(selector) : selector(jQuery);
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray(selector, this);
	};

	init.prototype = jQuery.fn;

	rootjQuery = jQuery(document);

	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	    guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

	jQuery.fn.extend({
		has: function has(target) {
			var i,
			    targets = jQuery(target, this),
			    len = targets.length;

			return this.filter(function () {
				for (i = 0; i < len; i++) {
					if (jQuery.contains(this, targets[i])) {
						return true;
					}
				}
			});
		},

		closest: function closest(selectors, context) {
			var cur,
			    i = 0,
			    l = this.length,
			    matched = [],
			    pos = rneedsContext.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;

			for (; i < l; i++) {
				for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
					if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {

						matched.push(cur);
						break;
					}
				}
			}

			return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
		},

		index: function index(elem) {
			if (!elem) {
				return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
			}

			if (typeof elem === "string") {
				return jQuery.inArray(this[0], jQuery(elem));
			}

			return jQuery.inArray(elem.jquery ? elem[0] : elem, this);
		},

		add: function add(selector, context) {
			return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
		},

		addBack: function addBack(selector) {
			return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
		}
	});

	function sibling(cur, dir) {
		do {
			cur = cur[dir];
		} while (cur && cur.nodeType !== 1);

		return cur;
	}

	jQuery.each({
		parent: function parent(elem) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function parents(elem) {
			return dir(elem, "parentNode");
		},
		parentsUntil: function parentsUntil(elem, i, until) {
			return dir(elem, "parentNode", until);
		},
		next: function next(elem) {
			return sibling(elem, "nextSibling");
		},
		prev: function prev(elem) {
			return sibling(elem, "previousSibling");
		},
		nextAll: function nextAll(elem) {
			return dir(elem, "nextSibling");
		},
		prevAll: function prevAll(elem) {
			return dir(elem, "previousSibling");
		},
		nextUntil: function nextUntil(elem, i, until) {
			return dir(elem, "nextSibling", until);
		},
		prevUntil: function prevUntil(elem, i, until) {
			return dir(elem, "previousSibling", until);
		},
		siblings: function siblings(elem) {
			return _siblings((elem.parentNode || {}).firstChild, elem);
		},
		children: function children(elem) {
			return _siblings(elem.firstChild);
		},
		contents: function contents(elem) {
			return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
		}
	}, function (name, fn) {
		jQuery.fn[name] = function (until, selector) {
			var ret = jQuery.map(this, fn, until);

			if (name.slice(-5) !== "Until") {
				selector = until;
			}

			if (selector && typeof selector === "string") {
				ret = jQuery.filter(selector, ret);
			}

			if (this.length > 1) {
				if (!guaranteedUnique[name]) {
					ret = jQuery.uniqueSort(ret);
				}

				if (rparentsprev.test(name)) {
					ret = ret.reverse();
				}
			}

			return this.pushStack(ret);
		};
	});
	var rnotwhite = /\S+/g;

	function createOptions(options) {
		var object = {};
		jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
			object[flag] = true;
		});
		return object;
	}

	jQuery.Callbacks = function (options) {
		options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);

		var firing,
		    memory,
		    _fired,
		    _locked,
		    list = [],
		    queue = [],
		    firingIndex = -1,
		    fire = function fire() {
			_locked = options.once;

			_fired = firing = true;
			for (; queue.length; firingIndex = -1) {
				memory = queue.shift();
				while (++firingIndex < list.length) {
					if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			if (!options.memory) {
				memory = false;
			}

			firing = false;

			if (_locked) {
				if (memory) {
					list = [];
				} else {
					list = "";
				}
			}
		},
		    self = {
			add: function add() {
				if (list) {
					if (memory && !firing) {
						firingIndex = list.length - 1;
						queue.push(memory);
					}

					(function add(args) {
						jQuery.each(args, function (_, arg) {
							if (jQuery.isFunction(arg)) {
								if (!options.unique || !self.has(arg)) {
									list.push(arg);
								}
							} else if (arg && arg.length && jQuery.type(arg) !== "string") {
								add(arg);
							}
						});
					})(arguments);

					if (memory && !firing) {
						fire();
					}
				}
				return this;
			},

			remove: function remove() {
				jQuery.each(arguments, function (_, arg) {
					var index;
					while ((index = jQuery.inArray(arg, list, index)) > -1) {
						list.splice(index, 1);

						if (index <= firingIndex) {
							firingIndex--;
						}
					}
				});
				return this;
			},

			has: function has(fn) {
				return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
			},

			empty: function empty() {
				if (list) {
					list = [];
				}
				return this;
			},

			disable: function disable() {
				_locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function disabled() {
				return !list;
			},

			lock: function lock() {
				_locked = true;
				if (!memory) {
					self.disable();
				}
				return this;
			},
			locked: function locked() {
				return !!_locked;
			},

			fireWith: function fireWith(context, args) {
				if (!_locked) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];
					queue.push(args);
					if (!firing) {
						fire();
					}
				}
				return this;
			},

			fire: function fire() {
				self.fireWith(this, arguments);
				return this;
			},

			fired: function fired() {
				return !!_fired;
			}
		};

		return self;
	};

	jQuery.extend({

		Deferred: function Deferred(func) {
			var tuples = [["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]],
			    _state = "pending",
			    _promise = {
				state: function state() {
					return _state;
				},
				always: function always() {
					deferred.done(arguments).fail(arguments);
					return this;
				},
				then: function then() {
					var fns = arguments;
					return jQuery.Deferred(function (newDefer) {
						jQuery.each(tuples, function (i, tuple) {
							var fn = jQuery.isFunction(fns[i]) && fns[i];

							deferred[tuple[1]](function () {
								var returned = fn && fn.apply(this, arguments);
								if (returned && jQuery.isFunction(returned.promise)) {
									returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
								} else {
									newDefer[tuple[0] + "With"](this === _promise ? newDefer.promise() : this, fn ? [returned] : arguments);
								}
							});
						});
						fns = null;
					}).promise();
				},

				promise: function promise(obj) {
					return obj != null ? jQuery.extend(obj, _promise) : _promise;
				}
			},
			    deferred = {};

			_promise.pipe = _promise.then;

			jQuery.each(tuples, function (i, tuple) {
				var list = tuple[2],
				    stateString = tuple[3];

				_promise[tuple[1]] = list.add;

				if (stateString) {
					list.add(function () {
						_state = stateString;
					}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
				}

				deferred[tuple[0]] = function () {
					deferred[tuple[0] + "With"](this === deferred ? _promise : this, arguments);
					return this;
				};
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			_promise.promise(deferred);

			if (func) {
				func.call(deferred, deferred);
			}

			return deferred;
		},

		when: function when(subordinate) {
			var i = 0,
			    resolveValues = _slice.call(arguments),
			    length = resolveValues.length,
			    remaining = length !== 1 || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0,
			    deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
			    updateFunc = function updateFunc(i, contexts, values) {
				return function (value) {
					contexts[i] = this;
					values[i] = arguments.length > 1 ? _slice.call(arguments) : value;
					if (values === progressValues) {
						deferred.notifyWith(contexts, values);
					} else if (! --remaining) {
						deferred.resolveWith(contexts, values);
					}
				};
			},
			    progressValues,
			    progressContexts,
			    resolveContexts;

			if (length > 1) {
				progressValues = new Array(length);
				progressContexts = new Array(length);
				resolveContexts = new Array(length);
				for (; i < length; i++) {
					if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
						resolveValues[i].promise().progress(updateFunc(i, progressContexts, progressValues)).done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject);
					} else {
						--remaining;
					}
				}
			}

			if (!remaining) {
				deferred.resolveWith(resolveContexts, resolveValues);
			}

			return deferred.promise();
		}
	});

	var readyList;

	jQuery.fn.ready = function (fn) {
		jQuery.ready.promise().done(fn);

		return this;
	};

	jQuery.extend({
		isReady: false,

		readyWait: 1,

		holdReady: function holdReady(hold) {
			if (hold) {
				jQuery.readyWait++;
			} else {
				jQuery.ready(true);
			}
		},

		ready: function ready(wait) {
			if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
				return;
			}

			jQuery.isReady = true;

			if (wait !== true && --jQuery.readyWait > 0) {
				return;
			}

			readyList.resolveWith(document, [jQuery]);

			if (jQuery.fn.triggerHandler) {
				jQuery(document).triggerHandler("ready");
				jQuery(document).off("ready");
			}
		}
	});

	function detach() {
		if (document.addEventListener) {
			document.removeEventListener("DOMContentLoaded", completed);
			window.removeEventListener("load", completed);
		} else {
			document.detachEvent("onreadystatechange", completed);
			window.detachEvent("onload", completed);
		}
	}

	function completed() {
		if (document.addEventListener || window.event.type === "load" || document.readyState === "complete") {

			detach();
			jQuery.ready();
		}
	}

	jQuery.ready.promise = function (obj) {
		if (!readyList) {

			readyList = jQuery.Deferred();

			if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {
				window.setTimeout(jQuery.ready);
			} else if (document.addEventListener) {
				document.addEventListener("DOMContentLoaded", completed);

				window.addEventListener("load", completed);
			} else {
				document.attachEvent("onreadystatechange", completed);

				window.attachEvent("onload", completed);

				var top = false;

				try {
					top = window.frameElement == null && document.documentElement;
				} catch (e) {}

				if (top && top.doScroll) {
					(function doScrollCheck() {
						if (!jQuery.isReady) {

							try {
								top.doScroll("left");
							} catch (e) {
								return window.setTimeout(doScrollCheck, 50);
							}

							detach();

							jQuery.ready();
						}
					})();
				}
			}
		}
		return readyList.promise(obj);
	};

	jQuery.ready.promise();

	var i;
	for (i in jQuery(support)) {
		break;
	}
	support.ownFirst = i === "0";

	support.inlineBlockNeedsLayout = false;

	jQuery(function () {
		var val, div, body, container;

		body = document.getElementsByTagName("body")[0];
		if (!body || !body.style) {
			return;
		}

		div = document.createElement("div");
		container = document.createElement("div");
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild(container).appendChild(div);

		if (typeof div.style.zoom !== "undefined") {
			div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

			support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
			if (val) {
				body.style.zoom = 1;
			}
		}

		body.removeChild(container);
	});

	(function () {
		var div = document.createElement("div");

		support.deleteExpando = true;
		try {
			delete div.test;
		} catch (e) {
			support.deleteExpando = false;
		}

		div = null;
	})();
	var acceptData = function acceptData(elem) {
		var noData = jQuery.noData[(elem.nodeName + " ").toLowerCase()],
		    nodeType = +elem.nodeType || 1;

		return nodeType !== 1 && nodeType !== 9 ? false : !noData || noData !== true && elem.getAttribute("classid") === noData;
	};

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	    rmultiDash = /([A-Z])/g;

	function dataAttr(elem, key, data) {
		if (data === undefined && elem.nodeType === 1) {

			var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();

			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = data === "true" ? true : data === "false" ? false : data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
				} catch (e) {}

				jQuery.data(elem, key, data);
			} else {
				data = undefined;
			}
		}

		return data;
	}

	function isEmptyDataObject(obj) {
		var name;
		for (name in obj) {
			if (name === "data" && jQuery.isEmptyObject(obj[name])) {
				continue;
			}
			if (name !== "toJSON") {
				return false;
			}
		}

		return true;
	}

	function internalData(elem, name, data, pvt) {
		if (!acceptData(elem)) {
			return;
		}

		var ret,
		    thisCache,
		    internalKey = jQuery.expando,
		    isNode = elem.nodeType,
		    cache = isNode ? jQuery.cache : elem,
		    id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;

		if ((!id || !cache[id] || !pvt && !cache[id].data) && data === undefined && typeof name === "string") {
			return;
		}

		if (!id) {
			if (isNode) {
				id = elem[internalKey] = deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if (!cache[id]) {
			cache[id] = isNode ? {} : { toJSON: jQuery.noop };
		}

		if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object" || typeof name === "function") {
			if (pvt) {
				cache[id] = jQuery.extend(cache[id], name);
			} else {
				cache[id].data = jQuery.extend(cache[id].data, name);
			}
		}

		thisCache = cache[id];

		if (!pvt) {
			if (!thisCache.data) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if (data !== undefined) {
			thisCache[jQuery.camelCase(name)] = data;
		}

		if (typeof name === "string") {
			ret = thisCache[name];

			if (ret == null) {
				ret = thisCache[jQuery.camelCase(name)];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	}

	function internalRemoveData(elem, name, pvt) {
		if (!acceptData(elem)) {
			return;
		}

		var thisCache,
		    i,
		    isNode = elem.nodeType,
		    cache = isNode ? jQuery.cache : elem,
		    id = isNode ? elem[jQuery.expando] : jQuery.expando;

		if (!cache[id]) {
			return;
		}

		if (name) {

			thisCache = pvt ? cache[id] : cache[id].data;

			if (thisCache) {
				if (!jQuery.isArray(name)) {
					if (name in thisCache) {
						name = [name];
					} else {
						name = jQuery.camelCase(name);
						if (name in thisCache) {
							name = [name];
						} else {
							name = name.split(" ");
						}
					}
				} else {
					name = name.concat(jQuery.map(name, jQuery.camelCase));
				}

				i = name.length;
				while (i--) {
					delete thisCache[name[i]];
				}

				if (pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache)) {
					return;
				}
			}
		}

		if (!pvt) {
			delete cache[id].data;

			if (!isEmptyDataObject(cache[id])) {
				return;
			}
		}

		if (isNode) {
			jQuery.cleanData([elem], true);
		} else if (support.deleteExpando || cache != cache.window) {
			delete cache[id];
		} else {
			cache[id] = undefined;
		}
	}

	jQuery.extend({
		cache: {},

		noData: {
			"applet ": true,
			"embed ": true,

			"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
		},

		hasData: function hasData(elem) {
			elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
			return !!elem && !isEmptyDataObject(elem);
		},

		data: function data(elem, name, _data) {
			return internalData(elem, name, _data);
		},

		removeData: function removeData(elem, name) {
			return internalRemoveData(elem, name);
		},

		_data: function _data(elem, name, data) {
			return internalData(elem, name, data, true);
		},

		_removeData: function _removeData(elem, name) {
			return internalRemoveData(elem, name, true);
		}
	});

	jQuery.fn.extend({
		data: function data(key, value) {
			var i,
			    name,
			    data,
			    elem = this[0],
			    attrs = elem && elem.attributes;

			if (key === undefined) {
				if (this.length) {
					data = jQuery.data(elem);

					if (elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs")) {
						i = attrs.length;
						while (i--) {
							if (attrs[i]) {
								name = attrs[i].name;
								if (name.indexOf("data-") === 0) {
									name = jQuery.camelCase(name.slice(5));
									dataAttr(elem, name, data[name]);
								}
							}
						}
						jQuery._data(elem, "parsedAttrs", true);
					}
				}

				return data;
			}

			if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
				return this.each(function () {
					jQuery.data(this, key);
				});
			}

			return arguments.length > 1 ? this.each(function () {
				jQuery.data(this, key, value);
			}) : elem ? dataAttr(elem, key, jQuery.data(elem, key)) : undefined;
		},

		removeData: function removeData(key) {
			return this.each(function () {
				jQuery.removeData(this, key);
			});
		}
	});

	jQuery.extend({
		queue: function queue(elem, type, data) {
			var queue;

			if (elem) {
				type = (type || "fx") + "queue";
				queue = jQuery._data(elem, type);

				if (data) {
					if (!queue || jQuery.isArray(data)) {
						queue = jQuery._data(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function dequeue(elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type),
			    startLength = queue.length,
			    fn = queue.shift(),
			    hooks = jQuery._queueHooks(elem, type),
			    next = function next() {
				jQuery.dequeue(elem, type);
			};

			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {
				if (type === "fx") {
					queue.unshift("inprogress");
				}

				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		_queueHooks: function _queueHooks(elem, type) {
			var key = type + "queueHooks";
			return jQuery._data(elem, key) || jQuery._data(elem, key, {
				empty: jQuery.Callbacks("once memory").add(function () {
					jQuery._removeData(elem, type + "queue");
					jQuery._removeData(elem, key);
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function queue(type, data) {
			var setter = 2;

			if (typeof type !== "string") {
				data = type;
				type = "fx";
				setter--;
			}

			if (arguments.length < setter) {
				return jQuery.queue(this[0], type);
			}

			return data === undefined ? this : this.each(function () {
				var queue = jQuery.queue(this, type, data);

				jQuery._queueHooks(this, type);

				if (type === "fx" && queue[0] !== "inprogress") {
					jQuery.dequeue(this, type);
				}
			});
		},
		dequeue: function dequeue(type) {
			return this.each(function () {
				jQuery.dequeue(this, type);
			});
		},
		clearQueue: function clearQueue(type) {
			return this.queue(type || "fx", []);
		},

		promise: function promise(type, obj) {
			var tmp,
			    count = 1,
			    defer = jQuery.Deferred(),
			    elements = this,
			    i = this.length,
			    resolve = function resolve() {
				if (! --count) {
					defer.resolveWith(elements, [elements]);
				}
			};

			if (typeof type !== "string") {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while (i--) {
				tmp = jQuery._data(elements[i], type + "queueHooks");
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});

	(function () {
		var shrinkWrapBlocksVal;

		support.shrinkWrapBlocks = function () {
			if (shrinkWrapBlocksVal != null) {
				return shrinkWrapBlocksVal;
			}

			shrinkWrapBlocksVal = false;

			var div, body, container;

			body = document.getElementsByTagName("body")[0];
			if (!body || !body.style) {
				return;
			}

			div = document.createElement("div");
			container = document.createElement("div");
			container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
			body.appendChild(container).appendChild(div);

			if (typeof div.style.zoom !== "undefined") {
				div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;" + "padding:1px;width:1px;zoom:1";
				div.appendChild(document.createElement("div")).style.width = "5px";
				shrinkWrapBlocksVal = div.offsetWidth !== 3;
			}

			body.removeChild(container);

			return shrinkWrapBlocksVal;
		};
	})();
	var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

	var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");

	var cssExpand = ["Top", "Right", "Bottom", "Left"];

	var isHidden = function isHidden(elem, el) {
		elem = el || elem;
		return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
	};

	function adjustCSS(elem, prop, valueParts, tween) {
		var adjusted,
		    scale = 1,
		    maxIterations = 20,
		    currentValue = tween ? function () {
			return tween.cur();
		} : function () {
			return jQuery.css(elem, prop, "");
		},
		    initial = currentValue(),
		    unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),
		    initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));

		if (initialInUnit && initialInUnit[3] !== unit) {
			unit = unit || initialInUnit[3];

			valueParts = valueParts || [];

			initialInUnit = +initial || 1;

			do {
				scale = scale || ".5";

				initialInUnit = initialInUnit / scale;
				jQuery.style(elem, prop, initialInUnit + unit);
			} while (scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations);
		}

		if (valueParts) {
			initialInUnit = +initialInUnit || +initial || 0;

			adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
			if (tween) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}

	var access = function access(elems, fn, key, value, chainable, emptyGet, raw) {
		var i = 0,
		    length = elems.length,
		    bulk = key == null;

		if (jQuery.type(key) === "object") {
			chainable = true;
			for (i in key) {
				access(elems, fn, i, key[i], true, emptyGet, raw);
			}
		} else if (value !== undefined) {
			chainable = true;

			if (!jQuery.isFunction(value)) {
				raw = true;
			}

			if (bulk) {
				if (raw) {
					fn.call(elems, value);
					fn = null;
				} else {
					bulk = fn;
					fn = function fn(elem, key, value) {
						return bulk.call(jQuery(elem), value);
					};
				}
			}

			if (fn) {
				for (; i < length; i++) {
					fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
				}
			}
		}

		return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
	};
	var rcheckableType = /^(?:checkbox|radio)$/i;

	var rtagName = /<([\w:-]+)/;

	var rscriptType = /^$|\/(?:java|ecma)script/i;

	var rleadingWhitespace = /^\s+/;

	var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" + "details|dialog|figcaption|figure|footer|header|hgroup|main|" + "mark|meter|nav|output|picture|progress|section|summary|template|time|video";

	function createSafeFragment(document) {
		var list = nodeNames.split("|"),
		    safeFrag = document.createDocumentFragment();

		if (safeFrag.createElement) {
			while (list.length) {
				safeFrag.createElement(list.pop());
			}
		}
		return safeFrag;
	}

	(function () {
		var div = document.createElement("div"),
		    fragment = document.createDocumentFragment(),
		    input = document.createElement("input");

		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

		support.leadingWhitespace = div.firstChild.nodeType === 3;

		support.tbody = !div.getElementsByTagName("tbody").length;

		support.htmlSerialize = !!div.getElementsByTagName("link").length;

		support.html5Clone = document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>";

		input.type = "checkbox";
		input.checked = true;
		fragment.appendChild(input);
		support.appendChecked = input.checked;

		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;

		fragment.appendChild(div);

		input = document.createElement("input");
		input.setAttribute("type", "radio");
		input.setAttribute("checked", "checked");
		input.setAttribute("name", "t");

		div.appendChild(input);

		support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

		support.noCloneEvent = !!div.addEventListener;

		div[jQuery.expando] = 1;
		support.attributes = !div.getAttribute(jQuery.expando);
	})();

	var wrapMap = {
		option: [1, "<select multiple='multiple'>", "</select>"],
		legend: [1, "<fieldset>", "</fieldset>"],
		area: [1, "<map>", "</map>"],

		param: [1, "<object>", "</object>"],
		thead: [1, "<table>", "</table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

		_default: support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
	};

	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	function getAll(context, tag) {
		var elems,
		    elem,
		    i = 0,
		    found = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== "undefined" ? context.querySelectorAll(tag || "*") : undefined;

		if (!found) {
			for (found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++) {
				if (!tag || jQuery.nodeName(elem, tag)) {
					found.push(elem);
				} else {
					jQuery.merge(found, getAll(elem, tag));
				}
			}
		}

		return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], found) : found;
	}

	function setGlobalEval(elems, refElements) {
		var elem,
		    i = 0;
		for (; (elem = elems[i]) != null; i++) {
			jQuery._data(elem, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
		}
	}

	var rhtml = /<|&#?\w+;/,
	    rtbody = /<tbody/i;

	function fixDefaultChecked(elem) {
		if (rcheckableType.test(elem.type)) {
			elem.defaultChecked = elem.checked;
		}
	}

	function buildFragment(elems, context, scripts, selection, ignored) {
		var j,
		    elem,
		    contains,
		    tmp,
		    tag,
		    tbody,
		    wrap,
		    l = elems.length,
		    safe = createSafeFragment(context),
		    nodes = [],
		    i = 0;

		for (; i < l; i++) {
			elem = elems[i];

			if (elem || elem === 0) {
				if (jQuery.type(elem) === "object") {
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
				} else if (!rhtml.test(elem)) {
					nodes.push(context.createTextNode(elem));
				} else {
					tmp = tmp || safe.appendChild(context.createElement("div"));

					tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
					wrap = wrapMap[tag] || wrapMap._default;

					tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

					j = wrap[0];
					while (j--) {
						tmp = tmp.lastChild;
					}

					if (!support.leadingWhitespace && rleadingWhitespace.test(elem)) {
						nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
					}

					if (!support.tbody) {
						elem = tag === "table" && !rtbody.test(elem) ? tmp.firstChild : wrap[1] === "<table>" && !rtbody.test(elem) ? tmp : 0;

						j = elem && elem.childNodes.length;
						while (j--) {
							if (jQuery.nodeName(tbody = elem.childNodes[j], "tbody") && !tbody.childNodes.length) {

								elem.removeChild(tbody);
							}
						}
					}

					jQuery.merge(nodes, tmp.childNodes);

					tmp.textContent = "";

					while (tmp.firstChild) {
						tmp.removeChild(tmp.firstChild);
					}

					tmp = safe.lastChild;
				}
			}
		}

		if (tmp) {
			safe.removeChild(tmp);
		}

		if (!support.appendChecked) {
			jQuery.grep(getAll(nodes, "input"), fixDefaultChecked);
		}

		i = 0;
		while (elem = nodes[i++]) {
			if (selection && jQuery.inArray(elem, selection) > -1) {
				if (ignored) {
					ignored.push(elem);
				}

				continue;
			}

			contains = jQuery.contains(elem.ownerDocument, elem);

			tmp = getAll(safe.appendChild(elem), "script");

			if (contains) {
				setGlobalEval(tmp);
			}

			if (scripts) {
				j = 0;
				while (elem = tmp[j++]) {
					if (rscriptType.test(elem.type || "")) {
						scripts.push(elem);
					}
				}
			}
		}

		tmp = null;

		return safe;
	}

	(function () {
		var i,
		    eventName,
		    div = document.createElement("div");

		for (i in { submit: true, change: true, focusin: true }) {
			eventName = "on" + i;

			if (!(support[i] = eventName in window)) {
				div.setAttribute(eventName, "t");
				support[i] = div.attributes[eventName].expando === false;
			}
		}

		div = null;
	})();

	var rformElems = /^(?:input|select|textarea)$/i,
	    rkeyEvent = /^key/,
	    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}

	function _on(elem, types, selector, data, fn, one) {
		var origFn, type;

		if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {
			if (typeof selector !== "string") {
				data = data || selector;
				selector = undefined;
			}
			for (type in types) {
				_on(elem, type, selector, data, types[type], one);
			}
			return elem;
		}

		if (data == null && fn == null) {
			fn = selector;
			data = selector = undefined;
		} else if (fn == null) {
			if (typeof selector === "string") {
				fn = data;
				data = undefined;
			} else {
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if (fn === false) {
			fn = returnFalse;
		} else if (!fn) {
			return elem;
		}

		if (one === 1) {
			origFn = fn;
			fn = function fn(event) {
				jQuery().off(event);
				return origFn.apply(this, arguments);
			};

			fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
		}
		return elem.each(function () {
			jQuery.event.add(this, types, fn, data, selector);
		});
	}

	jQuery.event = {

		global: {},

		add: function add(elem, types, handler, data, selector) {
			var tmp,
			    events,
			    t,
			    handleObjIn,
			    special,
			    eventHandle,
			    handleObj,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = jQuery._data(elem);

			if (!elemData) {
				return;
			}

			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function (e) {
					return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
				};

				eventHandle.elem = elem;
			}

			types = (types || "").match(rnotwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				if (!type) {
					continue;
				}

				special = jQuery.event.special[type] || {};

				type = (selector ? special.delegateType : special.bindType) || type;

				special = jQuery.event.special[type] || {};

				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test(selector),
					namespace: namespaces.join(".")
				}, handleObjIn);

				if (!(handlers = events[type])) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle, false);
						} else if (elem.attachEvent) {
							elem.attachEvent("on" + type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				jQuery.event.global[type] = true;
			}

			elem = null;
		},

		remove: function remove(elem, types, handler, selector, mappedTypes) {
			var j,
			    handleObj,
			    tmp,
			    origCount,
			    t,
			    events,
			    special,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = jQuery.hasData(elem) && jQuery._data(elem);

			if (!elemData || !(events = elemData.events)) {
				return;
			}

			types = (types || "").match(rnotwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				if (!type) {
					for (type in events) {
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = jQuery.event.special[type] || {};
				type = (selector ? special.delegateType : special.bindType) || type;
				handlers = events[type] || [];
				tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

				origCount = j = handlers.length;
				while (j--) {
					handleObj = handlers[j];

					if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
						handlers.splice(j, 1);

						if (handleObj.selector) {
							handlers.delegateCount--;
						}
						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				if (origCount && !handlers.length) {
					if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {

						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			if (jQuery.isEmptyObject(events)) {
				delete elemData.handle;

				jQuery._removeData(elem, "events");
			}
		},

		trigger: function trigger(event, data, elem, onlyHandlers) {
			var handle,
			    ontype,
			    cur,
			    bubbleType,
			    special,
			    tmp,
			    i,
			    eventPath = [elem || document],
			    type = hasOwn.call(event, "type") ? event.type : event,
			    namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

			cur = tmp = elem = elem || document;

			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			if (type.indexOf(".") > -1) {
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			event = event[jQuery.expando] ? event : new jQuery.Event(type, (typeof event === "undefined" ? "undefined" : _typeof(event)) === "object" && event);

			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			event.result = undefined;
			if (!event.target) {
				event.target = elem;
			}

			data = data == null ? [event] : jQuery.makeArray(data, [event]);

			special = jQuery.event.special[type] || {};
			if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

				bubbleType = special.delegateType || type;
				if (!rfocusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}
				for (; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(tmp.defaultView || tmp.parentWindow || window);
				}
			}

			i = 0;
			while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

				event.type = i > 1 ? bubbleType : special.bindType || type;

				handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");

				if (handle) {
					handle.apply(cur, data);
				}

				handle = ontype && cur[ontype];
				if (handle && handle.apply && acceptData(cur)) {
					event.result = handle.apply(cur, data);
					if (event.result === false) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			if (!onlyHandlers && !event.isDefaultPrevented()) {

				if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
					if (ontype && elem[type] && !jQuery.isWindow(elem)) {
						tmp = elem[ontype];

						if (tmp) {
							elem[ontype] = null;
						}

						jQuery.event.triggered = type;
						try {
							elem[type]();
						} catch (e) {}
						jQuery.event.triggered = undefined;

						if (tmp) {
							elem[ontype] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		dispatch: function dispatch(event) {
			event = jQuery.event.fix(event);

			var i,
			    j,
			    ret,
			    matched,
			    handleObj,
			    handlerQueue = [],
			    args = _slice.call(arguments),
			    handlers = (jQuery._data(this, "events") || {})[event.type] || [],
			    special = jQuery.event.special[event.type] || {};

			args[0] = event;
			event.delegateTarget = this;

			if (special.preDispatch && special.preDispatch.call(this, event) === false) {
				return;
			}

			handlerQueue = jQuery.event.handlers.call(this, event, handlers);

			i = 0;
			while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
				event.currentTarget = matched.elem;

				j = 0;
				while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
					if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

						if (ret !== undefined) {
							if ((event.result = ret) === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			if (special.postDispatch) {
				special.postDispatch.call(this, event);
			}

			return event.result;
		},

		handlers: function handlers(event, _handlers) {
			var i,
			    matches,
			    sel,
			    handleObj,
			    handlerQueue = [],
			    delegateCount = _handlers.delegateCount,
			    cur = event.target;

			if (delegateCount && cur.nodeType && (event.type !== "click" || isNaN(event.button) || event.button < 1)) {
				for (; cur != this; cur = cur.parentNode || this) {
					if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
						matches = [];
						for (i = 0; i < delegateCount; i++) {
							handleObj = _handlers[i];

							sel = handleObj.selector + " ";

							if (matches[sel] === undefined) {
								matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
							}
							if (matches[sel]) {
								matches.push(handleObj);
							}
						}
						if (matches.length) {
							handlerQueue.push({ elem: cur, handlers: matches });
						}
					}
				}
			}

			if (delegateCount < _handlers.length) {
				handlerQueue.push({ elem: this, handlers: _handlers.slice(delegateCount) });
			}

			return handlerQueue;
		},

		fix: function fix(event) {
			if (event[jQuery.expando]) {
				return event;
			}

			var i,
			    prop,
			    copy,
			    type = event.type,
			    originalEvent = event,
			    fixHook = this.fixHooks[type];

			if (!fixHook) {
				this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
			}
			copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = new jQuery.Event(originalEvent);

			i = copy.length;
			while (i--) {
				prop = copy[i];
				event[prop] = originalEvent[prop];
			}

			if (!event.target) {
				event.target = originalEvent.srcElement || document;
			}

			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			event.metaKey = !!event.metaKey;

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},

		props: ("altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " + "metaKey relatedTarget shiftKey target timeStamp view which").split(" "),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function filter(event, original) {
				if (event.which == null) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: ("button buttons clientX clientY fromElement offsetX offsetY " + "pageX pageY screenX screenY toElement").split(" "),
			filter: function filter(event, original) {
				var body,
				    eventDoc,
				    doc,
				    button = original.button,
				    fromElement = original.fromElement;

				if (event.pageX == null && original.clientX != null) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
					event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
				}

				if (!event.relatedTarget && fromElement) {
					event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
				}

				if (!event.which && button !== undefined) {
					event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
				}

				return event;
			}
		},

		special: {
			load: {
				noBubble: true
			},
			focus: {
				trigger: function trigger() {
					if (this !== safeActiveElement() && this.focus) {
						try {
							this.focus();
							return false;
						} catch (e) {}
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function trigger() {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
				trigger: function trigger() {
					if (jQuery.nodeName(this, "input") && this.type === "checkbox" && this.click) {
						this.click();
						return false;
					}
				},

				_default: function _default(event) {
					return jQuery.nodeName(event.target, "a");
				}
			},

			beforeunload: {
				postDispatch: function postDispatch(event) {
					if (event.result !== undefined && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},

		simulate: function simulate(type, elem, event) {
			var e = jQuery.extend(new jQuery.Event(), event, {
				type: type,
				isSimulated: true

			});

			jQuery.event.trigger(e, null, elem);

			if (e.isDefaultPrevented()) {
				event.preventDefault();
			}
		}
	};

	jQuery.removeEvent = document.removeEventListener ? function (elem, type, handle) {
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle);
		}
	} : function (elem, type, handle) {
		var name = "on" + type;

		if (elem.detachEvent) {
			if (typeof elem[name] === "undefined") {
				elem[name] = null;
			}

			elem.detachEvent(name, handle);
		}
	};

	jQuery.Event = function (src, props) {
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && src.returnValue === false ? returnTrue : returnFalse;
		} else {
			this.type = src;
		}

		if (props) {
			jQuery.extend(this, props);
		}

		this.timeStamp = src && src.timeStamp || jQuery.now();

		this[jQuery.expando] = true;
	};

	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,

		preventDefault: function preventDefault() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;
			if (!e) {
				return;
			}

			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		},
		stopPropagation: function stopPropagation() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (!e || this.isSimulated) {
				return;
			}

			if (e.stopPropagation) {
				e.stopPropagation();
			}

			e.cancelBubble = true;
		},
		stopImmediatePropagation: function stopImmediatePropagation() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if (e && e.stopImmediatePropagation) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function (orig, fix) {
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function handle(event) {
				var ret,
				    target = this,
				    related = event.relatedTarget,
				    handleObj = event.handleObj;

				if (!related || related !== target && !jQuery.contains(target, related)) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	if (!support.submit) {

		jQuery.event.special.submit = {
			setup: function setup() {
				if (jQuery.nodeName(this, "form")) {
					return false;
				}

				jQuery.event.add(this, "click._submit keypress._submit", function (e) {
					var elem = e.target,
					    form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? jQuery.prop(elem, "form") : undefined;

					if (form && !jQuery._data(form, "submit")) {
						jQuery.event.add(form, "submit._submit", function (event) {
							event._submitBubble = true;
						});
						jQuery._data(form, "submit", true);
					}
				});
			},

			postDispatch: function postDispatch(event) {
				if (event._submitBubble) {
					delete event._submitBubble;
					if (this.parentNode && !event.isTrigger) {
						jQuery.event.simulate("submit", this.parentNode, event);
					}
				}
			},

			teardown: function teardown() {
				if (jQuery.nodeName(this, "form")) {
					return false;
				}

				jQuery.event.remove(this, "._submit");
			}
		};
	}

	if (!support.change) {

		jQuery.event.special.change = {

			setup: function setup() {

				if (rformElems.test(this.nodeName)) {
					if (this.type === "checkbox" || this.type === "radio") {
						jQuery.event.add(this, "propertychange._change", function (event) {
							if (event.originalEvent.propertyName === "checked") {
								this._justChanged = true;
							}
						});
						jQuery.event.add(this, "click._change", function (event) {
							if (this._justChanged && !event.isTrigger) {
								this._justChanged = false;
							}

							jQuery.event.simulate("change", this, event);
						});
					}
					return false;
				}

				jQuery.event.add(this, "beforeactivate._change", function (e) {
					var elem = e.target;

					if (rformElems.test(elem.nodeName) && !jQuery._data(elem, "change")) {
						jQuery.event.add(elem, "change._change", function (event) {
							if (this.parentNode && !event.isSimulated && !event.isTrigger) {
								jQuery.event.simulate("change", this.parentNode, event);
							}
						});
						jQuery._data(elem, "change", true);
					}
				});
			},

			handle: function handle(event) {
				var elem = event.target;

				if (this !== elem || event.isSimulated || event.isTrigger || elem.type !== "radio" && elem.type !== "checkbox") {

					return event.handleObj.handler.apply(this, arguments);
				}
			},

			teardown: function teardown() {
				jQuery.event.remove(this, "._change");

				return !rformElems.test(this.nodeName);
			}
		};
	}

	if (!support.focusin) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {
			var handler = function handler(event) {
				jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
			};

			jQuery.event.special[fix] = {
				setup: function setup() {
					var doc = this.ownerDocument || this,
					    attaches = jQuery._data(doc, fix);

					if (!attaches) {
						doc.addEventListener(orig, handler, true);
					}
					jQuery._data(doc, fix, (attaches || 0) + 1);
				},
				teardown: function teardown() {
					var doc = this.ownerDocument || this,
					    attaches = jQuery._data(doc, fix) - 1;

					if (!attaches) {
						doc.removeEventListener(orig, handler, true);
						jQuery._removeData(doc, fix);
					} else {
						jQuery._data(doc, fix, attaches);
					}
				}
			};
		});
	}

	jQuery.fn.extend({

		on: function on(types, selector, data, fn) {
			return _on(this, types, selector, data, fn);
		},
		one: function one(types, selector, data, fn) {
			return _on(this, types, selector, data, fn, 1);
		},
		off: function off(types, selector, fn) {
			var handleObj, type;
			if (types && types.preventDefault && types.handleObj) {
				handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
				return this;
			}
			if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {
				for (type in types) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if (selector === false || typeof selector === "function") {
				fn = selector;
				selector = undefined;
			}
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function () {
				jQuery.event.remove(this, types, fn, selector);
			});
		},

		trigger: function trigger(type, data) {
			return this.each(function () {
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler: function triggerHandler(type, data) {
			var elem = this[0];
			if (elem) {
				return jQuery.event.trigger(type, data, elem, true);
			}
		}
	});

	var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	    rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
	    rnoInnerhtml = /<script|<style|<link/i,
	    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	    rscriptTypeMasked = /^true\/(.*)/,
	    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	    safeFragment = createSafeFragment(document),
	    fragmentDiv = safeFragment.appendChild(document.createElement("div"));

	function manipulationTarget(elem, content) {
		return jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
	}

	function disableScript(elem) {
		elem.type = (jQuery.find.attr(elem, "type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript(elem) {
		var match = rscriptTypeMasked.exec(elem.type);
		if (match) {
			elem.type = match[1];
		} else {
			elem.removeAttribute("type");
		}
		return elem;
	}

	function cloneCopyEvent(src, dest) {
		if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
			return;
		}

		var type,
		    i,
		    l,
		    oldData = jQuery._data(src),
		    curData = jQuery._data(dest, oldData),
		    events = oldData.events;

		if (events) {
			delete curData.handle;
			curData.events = {};

			for (type in events) {
				for (i = 0, l = events[type].length; i < l; i++) {
					jQuery.event.add(dest, type, events[type][i]);
				}
			}
		}

		if (curData.data) {
			curData.data = jQuery.extend({}, curData.data);
		}
	}

	function fixCloneNodeIssues(src, dest) {
		var nodeName, e, data;

		if (dest.nodeType !== 1) {
			return;
		}

		nodeName = dest.nodeName.toLowerCase();

		if (!support.noCloneEvent && dest[jQuery.expando]) {
			data = jQuery._data(dest);

			for (e in data.events) {
				jQuery.removeEvent(dest, e, data.handle);
			}

			dest.removeAttribute(jQuery.expando);
		}

		if (nodeName === "script" && dest.text !== src.text) {
			disableScript(dest).text = src.text;
			restoreScript(dest);
		} else if (nodeName === "object") {
			if (dest.parentNode) {
				dest.outerHTML = src.outerHTML;
			}

			if (support.html5Clone && src.innerHTML && !jQuery.trim(dest.innerHTML)) {
				dest.innerHTML = src.innerHTML;
			}
		} else if (nodeName === "input" && rcheckableType.test(src.type)) {

			dest.defaultChecked = dest.checked = src.checked;

			if (dest.value !== src.value) {
				dest.value = src.value;
			}
		} else if (nodeName === "option") {
			dest.defaultSelected = dest.selected = src.defaultSelected;
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip(collection, args, callback, ignored) {
		args = concat.apply([], args);

		var first,
		    node,
		    hasScripts,
		    scripts,
		    doc,
		    fragment,
		    i = 0,
		    l = collection.length,
		    iNoClone = l - 1,
		    value = args[0],
		    isFunction = jQuery.isFunction(value);

		if (isFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
			return collection.each(function (index) {
				var self = collection.eq(index);
				if (isFunction) {
					args[0] = value.call(this, index, self.html());
				}
				domManip(self, args, callback, ignored);
			});
		}

		if (l) {
			fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
			first = fragment.firstChild;

			if (fragment.childNodes.length === 1) {
				fragment = first;
			}

			if (first || ignored) {
				scripts = jQuery.map(getAll(fragment, "script"), disableScript);
				hasScripts = scripts.length;

				for (; i < l; i++) {
					node = fragment;

					if (i !== iNoClone) {
						node = jQuery.clone(node, true, true);

						if (hasScripts) {
							jQuery.merge(scripts, getAll(node, "script"));
						}
					}

					callback.call(collection[i], node, i);
				}

				if (hasScripts) {
					doc = scripts[scripts.length - 1].ownerDocument;

					jQuery.map(scripts, restoreScript);

					for (i = 0; i < hasScripts; i++) {
						node = scripts[i];
						if (rscriptType.test(node.type || "") && !jQuery._data(node, "globalEval") && jQuery.contains(doc, node)) {

							if (node.src) {
								if (jQuery._evalUrl) {
									jQuery._evalUrl(node.src);
								}
							} else {
								jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, ""));
							}
						}
					}
				}

				fragment = first = null;
			}
		}

		return collection;
	}

	function _remove(elem, selector, keepData) {
		var node,
		    elems = selector ? jQuery.filter(selector, elem) : elem,
		    i = 0;

		for (; (node = elems[i]) != null; i++) {

			if (!keepData && node.nodeType === 1) {
				jQuery.cleanData(getAll(node));
			}

			if (node.parentNode) {
				if (keepData && jQuery.contains(node.ownerDocument, node)) {
					setGlobalEval(getAll(node, "script"));
				}
				node.parentNode.removeChild(node);
			}
		}

		return elem;
	}

	jQuery.extend({
		htmlPrefilter: function htmlPrefilter(html) {
			return html.replace(rxhtmlTag, "<$1></$2>");
		},

		clone: function clone(elem, dataAndEvents, deepDataAndEvents) {
			var destElements,
			    node,
			    clone,
			    i,
			    srcElements,
			    inPage = jQuery.contains(elem.ownerDocument, elem);

			if (support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">")) {

				clone = elem.cloneNode(true);
			} else {
				fragmentDiv.innerHTML = elem.outerHTML;
				fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
			}

			if ((!support.noCloneEvent || !support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
				destElements = getAll(clone);
				srcElements = getAll(elem);

				for (i = 0; (node = srcElements[i]) != null; ++i) {
					if (destElements[i]) {
						fixCloneNodeIssues(node, destElements[i]);
					}
				}
			}

			if (dataAndEvents) {
				if (deepDataAndEvents) {
					srcElements = srcElements || getAll(elem);
					destElements = destElements || getAll(clone);

					for (i = 0; (node = srcElements[i]) != null; i++) {
						cloneCopyEvent(node, destElements[i]);
					}
				} else {
					cloneCopyEvent(elem, clone);
				}
			}

			destElements = getAll(clone, "script");
			if (destElements.length > 0) {
				setGlobalEval(destElements, !inPage && getAll(elem, "script"));
			}

			destElements = srcElements = node = null;

			return clone;
		},

		cleanData: function cleanData(elems, forceAcceptData) {
			var elem,
			    type,
			    id,
			    data,
			    i = 0,
			    internalKey = jQuery.expando,
			    cache = jQuery.cache,
			    attributes = support.attributes,
			    special = jQuery.event.special;

			for (; (elem = elems[i]) != null; i++) {
				if (forceAcceptData || acceptData(elem)) {

					id = elem[internalKey];
					data = id && cache[id];

					if (data) {
						if (data.events) {
							for (type in data.events) {
								if (special[type]) {
									jQuery.event.remove(elem, type);
								} else {
									jQuery.removeEvent(elem, type, data.handle);
								}
							}
						}

						if (cache[id]) {

							delete cache[id];

							if (!attributes && typeof elem.removeAttribute !== "undefined") {
								elem.removeAttribute(internalKey);
							} else {
								elem[internalKey] = undefined;
							}

							deletedIds.push(id);
						}
					}
				}
			}
		}
	});

	jQuery.fn.extend({
		domManip: domManip,

		detach: function detach(selector) {
			return _remove(this, selector, true);
		},

		remove: function remove(selector) {
			return _remove(this, selector);
		},

		text: function text(value) {
			return access(this, function (value) {
				return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
			}, null, value, arguments.length);
		},

		append: function append() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},

		prepend: function prepend() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild);
				}
			});
		},

		before: function before() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this);
				}
			});
		},

		after: function after() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				}
			});
		},

		empty: function empty() {
			var elem,
			    i = 0;

			for (; (elem = this[i]) != null; i++) {
				if (elem.nodeType === 1) {
					jQuery.cleanData(getAll(elem, false));
				}

				while (elem.firstChild) {
					elem.removeChild(elem.firstChild);
				}

				if (elem.options && jQuery.nodeName(elem, "select")) {
					elem.options.length = 0;
				}
			}

			return this;
		},

		clone: function clone(dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function () {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html: function html(value) {
			return access(this, function (value) {
				var elem = this[0] || {},
				    i = 0,
				    l = this.length;

				if (value === undefined) {
					return elem.nodeType === 1 ? elem.innerHTML.replace(rinlinejQuery, "") : undefined;
				}

				if (typeof value === "string" && !rnoInnerhtml.test(value) && (support.htmlSerialize || !rnoshimcache.test(value)) && (support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

					value = jQuery.htmlPrefilter(value);

					try {
						for (; i < l; i++) {
							elem = this[i] || {};
							if (elem.nodeType === 1) {
								jQuery.cleanData(getAll(elem, false));
								elem.innerHTML = value;
							}
						}

						elem = 0;
					} catch (e) {}
				}

				if (elem) {
					this.empty().append(value);
				}
			}, null, value, arguments.length);
		},

		replaceWith: function replaceWith() {
			var ignored = [];

			return domManip(this, arguments, function (elem) {
				var parent = this.parentNode;

				if (jQuery.inArray(this, ignored) < 0) {
					jQuery.cleanData(getAll(this));
					if (parent) {
						parent.replaceChild(elem, this);
					}
				}
			}, ignored);
		}
	});

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (name, original) {
		jQuery.fn[name] = function (selector) {
			var elems,
			    i = 0,
			    ret = [],
			    insert = jQuery(selector),
			    last = insert.length - 1;

			for (; i <= last; i++) {
				elems = i === last ? this : this.clone(true);
				jQuery(insert[i])[original](elems);

				push.apply(ret, elems.get());
			}

			return this.pushStack(ret);
		};
	});

	var iframe,
	    elemdisplay = {
		HTML: "block",
		BODY: "block"
	};

	function actualDisplay(name, doc) {
		var elem = jQuery(doc.createElement(name)).appendTo(doc.body),
		    display = jQuery.css(elem[0], "display");

		elem.detach();

		return display;
	}

	function defaultDisplay(nodeName) {
		var doc = document,
		    display = elemdisplay[nodeName];

		if (!display) {
			display = actualDisplay(nodeName, doc);

			if (display === "none" || !display) {
				iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);

				doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;

				doc.write();
				doc.close();

				display = actualDisplay(nodeName, doc);
				iframe.detach();
			}

			elemdisplay[nodeName] = display;
		}

		return display;
	}
	var rmargin = /^margin/;

	var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

	var swap = function swap(elem, options, callback, args) {
		var ret,
		    name,
		    old = {};

		for (name in options) {
			old[name] = elem.style[name];
			elem.style[name] = options[name];
		}

		ret = callback.apply(elem, args || []);

		for (name in options) {
			elem.style[name] = old[name];
		}

		return ret;
	};

	var documentElement = document.documentElement;

	(function () {
		var pixelPositionVal,
		    pixelMarginRightVal,
		    boxSizingReliableVal,
		    reliableHiddenOffsetsVal,
		    reliableMarginRightVal,
		    reliableMarginLeftVal,
		    container = document.createElement("div"),
		    div = document.createElement("div");

		if (!div.style) {
			return;
		}

		div.style.cssText = "float:left;opacity:.5";

		support.opacity = div.style.opacity === "0.5";

		support.cssFloat = !!div.style.cssFloat;

		div.style.backgroundClip = "content-box";
		div.cloneNode(true).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container = document.createElement("div");
		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" + "padding:0;margin-top:1px;position:absolute";
		div.innerHTML = "";
		container.appendChild(div);

		support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" || div.style.WebkitBoxSizing === "";

		jQuery.extend(support, {
			reliableHiddenOffsets: function reliableHiddenOffsets() {
				if (pixelPositionVal == null) {
					computeStyleTests();
				}
				return reliableHiddenOffsetsVal;
			},

			boxSizingReliable: function boxSizingReliable() {
				if (pixelPositionVal == null) {
					computeStyleTests();
				}
				return boxSizingReliableVal;
			},

			pixelMarginRight: function pixelMarginRight() {
				if (pixelPositionVal == null) {
					computeStyleTests();
				}
				return pixelMarginRightVal;
			},

			pixelPosition: function pixelPosition() {
				if (pixelPositionVal == null) {
					computeStyleTests();
				}
				return pixelPositionVal;
			},

			reliableMarginRight: function reliableMarginRight() {
				if (pixelPositionVal == null) {
					computeStyleTests();
				}
				return reliableMarginRightVal;
			},

			reliableMarginLeft: function reliableMarginLeft() {
				if (pixelPositionVal == null) {
					computeStyleTests();
				}
				return reliableMarginLeftVal;
			}
		});

		function computeStyleTests() {
			var contents,
			    divStyle,
			    documentElement = document.documentElement;

			documentElement.appendChild(container);

			div.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;" + "position:relative;display:block;" + "margin:auto;border:1px;padding:1px;" + "top:1%;width:50%";

			pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
			pixelMarginRightVal = reliableMarginRightVal = true;

			if (window.getComputedStyle) {
				divStyle = window.getComputedStyle(div);
				pixelPositionVal = (divStyle || {}).top !== "1%";
				reliableMarginLeftVal = (divStyle || {}).marginLeft === "2px";
				boxSizingReliableVal = (divStyle || { width: "4px" }).width === "4px";

				div.style.marginRight = "50%";
				pixelMarginRightVal = (divStyle || { marginRight: "4px" }).marginRight === "4px";

				contents = div.appendChild(document.createElement("div"));

				contents.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				contents.style.marginRight = contents.style.width = "0";
				div.style.width = "1px";

				reliableMarginRightVal = !parseFloat((window.getComputedStyle(contents) || {}).marginRight);

				div.removeChild(contents);
			}

			div.style.display = "none";
			reliableHiddenOffsetsVal = div.getClientRects().length === 0;
			if (reliableHiddenOffsetsVal) {
				div.style.display = "";
				div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
				contents = div.getElementsByTagName("td");
				contents[0].style.cssText = "margin:0;border:0;padding:0;display:none";
				reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
				if (reliableHiddenOffsetsVal) {
					contents[0].style.display = "";
					contents[1].style.display = "none";
					reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
				}
			}

			documentElement.removeChild(container);
		}
	})();

	var getStyles,
	    curCSS,
	    rposition = /^(top|right|bottom|left)$/;

	if (window.getComputedStyle) {
		getStyles = function getStyles(elem) {
			var view = elem.ownerDocument.defaultView;

			if (!view || !view.opener) {
				view = window;
			}

			return view.getComputedStyle(elem);
		};

		curCSS = function curCSS(elem, name, computed) {
			var width,
			    minWidth,
			    maxWidth,
			    ret,
			    style = elem.style;

			computed = computed || getStyles(elem);

			ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;

			if ((ret === "" || ret === undefined) && !jQuery.contains(elem.ownerDocument, elem)) {
				ret = jQuery.style(elem, name);
			}

			if (computed) {
				if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {
					width = style.width;
					minWidth = style.minWidth;
					maxWidth = style.maxWidth;

					style.minWidth = style.maxWidth = style.width = ret;
					ret = computed.width;

					style.width = width;
					style.minWidth = minWidth;
					style.maxWidth = maxWidth;
				}
			}

			return ret === undefined ? ret : ret + "";
		};
	} else if (documentElement.currentStyle) {
		getStyles = function getStyles(elem) {
			return elem.currentStyle;
		};

		curCSS = function curCSS(elem, name, computed) {
			var left,
			    rs,
			    rsLeft,
			    ret,
			    style = elem.style;

			computed = computed || getStyles(elem);
			ret = computed ? computed[name] : undefined;

			if (ret == null && style && style[name]) {
				ret = style[name];
			}

			if (rnumnonpx.test(ret) && !rposition.test(name)) {
				left = style.left;
				rs = elem.runtimeStyle;
				rsLeft = rs && rs.left;

				if (rsLeft) {
					rs.left = elem.currentStyle.left;
				}
				style.left = name === "fontSize" ? "1em" : ret;
				ret = style.pixelLeft + "px";

				style.left = left;
				if (rsLeft) {
					rs.left = rsLeft;
				}
			}

			return ret === undefined ? ret : ret + "" || "auto";
		};
	}

	function addGetHookIf(conditionFn, hookFn) {
		return {
			get: function get() {
				if (conditionFn()) {
					delete this.get;
					return;
				}

				return (this.get = hookFn).apply(this, arguments);
			}
		};
	}

	var ralpha = /alpha\([^)]*\)/i,
	    ropacity = /opacity\s*=\s*([^)]*)/i,
	    rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	    rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"),
	    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	    cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},
	    cssPrefixes = ["Webkit", "O", "Moz", "ms"],
	    emptyStyle = document.createElement("div").style;

	function vendorPropName(name) {
		if (name in emptyStyle) {
			return name;
		}

		var capName = name.charAt(0).toUpperCase() + name.slice(1),
		    i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;
			if (name in emptyStyle) {
				return name;
			}
		}
	}

	function showHide(elements, show) {
		var display,
		    elem,
		    hidden,
		    values = [],
		    index = 0,
		    length = elements.length;

		for (; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}

			values[index] = jQuery._data(elem, "olddisplay");
			display = elem.style.display;
			if (show) {
				if (!values[index] && display === "none") {
					elem.style.display = "";
				}

				if (elem.style.display === "" && isHidden(elem)) {
					values[index] = jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
				}
			} else {
				hidden = isHidden(elem);

				if (display && display !== "none" || !hidden) {
					jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
				}
			}
		}

		for (index = 0; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}
			if (!show || elem.style.display === "none" || elem.style.display === "") {
				elem.style.display = show ? values[index] || "" : "none";
			}
		}

		return elements;
	}

	function setPositiveNumber(elem, value, subtract) {
		var matches = rnumsplit.exec(value);
		return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
	}

	function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		var i = extra === (isBorderBox ? "border" : "content") ? 4 : name === "width" ? 1 : 0,
		    val = 0;

		for (; i < 4; i += 2) {
			if (extra === "margin") {
				val += jQuery.css(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {
				if (extra === "content") {
					val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
				}

				if (extra !== "margin") {
					val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			} else {
				val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

				if (extra !== "padding") {
					val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(elem, name, extra) {
		var valueIsBorderBox = true,
		    val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		    styles = getStyles(elem),
		    isBorderBox = support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box";

		if (document.msFullscreenElement && window.top !== window) {
			if (elem.getClientRects().length) {
				val = Math.round(elem.getBoundingClientRect()[name] * 100);
			}
		}

		if (val <= 0 || val == null) {
			val = curCSS(elem, name, styles);
			if (val < 0 || val == null) {
				val = elem.style[name];
			}

			if (rnumnonpx.test(val)) {
				return val;
			}

			valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);

			val = parseFloat(val) || 0;
		}

		return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
	}

	jQuery.extend({
		cssHooks: {
			opacity: {
				get: function get(elem, computed) {
					if (computed) {
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		cssProps: {
			"float": support.cssFloat ? "cssFloat" : "styleFloat"
		},

		style: function style(elem, name, value, extra) {
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			var ret,
			    type,
			    hooks,
			    origName = jQuery.camelCase(name),
			    style = elem.style;

			name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);

			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			if (value !== undefined) {
				type = typeof value === "undefined" ? "undefined" : _typeof(value);

				if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
					value = adjustCSS(elem, name, ret);

					type = "number";
				}

				if (value == null || value !== value) {
					return;
				}

				if (type === "number") {
					value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
				}

				if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
					style[name] = "inherit";
				}

				if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
					try {
						style[name] = value;
					} catch (e) {}
				}
			} else {
				if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {

					return ret;
				}

				return style[name];
			}
		},

		css: function css(elem, name, extra, styles) {
			var num,
			    val,
			    hooks,
			    origName = jQuery.camelCase(name);

			name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);

			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			if (val === undefined) {
				val = curCSS(elem, name, styles);
			}

			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || isFinite(num) ? num || 0 : val;
			}
			return val;
		}
	});

	jQuery.each(["height", "width"], function (i, name) {
		jQuery.cssHooks[name] = {
			get: function get(elem, computed, extra) {
				if (computed) {
					return rdisplayswap.test(jQuery.css(elem, "display")) && elem.offsetWidth === 0 ? swap(elem, cssShow, function () {
						return getWidthOrHeight(elem, name, extra);
					}) : getWidthOrHeight(elem, name, extra);
				}
			},

			set: function set(elem, value, extra) {
				var styles = extra && getStyles(elem);
				return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles) : 0);
			}
		};
	});

	if (!support.opacity) {
		jQuery.cssHooks.opacity = {
			get: function get(elem, computed) {
				return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : computed ? "1" : "";
			},

			set: function set(elem, value) {
				var style = elem.style,
				    currentStyle = elem.currentStyle,
				    opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
				    filter = currentStyle && currentStyle.filter || style.filter || "";

				style.zoom = 1;

				if ((value >= 1 || value === "") && jQuery.trim(filter.replace(ralpha, "")) === "" && style.removeAttribute) {
					style.removeAttribute("filter");

					if (value === "" || currentStyle && !currentStyle.filter) {
						return;
					}
				}

				style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
			}
		};
	}

	jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function (elem, computed) {
		if (computed) {
			return swap(elem, { "display": "inline-block" }, curCSS, [elem, "marginRight"]);
		}
	});

	jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
		if (computed) {
			return (parseFloat(curCSS(elem, "marginLeft")) || (jQuery.contains(elem.ownerDocument, elem) ? elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function () {
				return elem.getBoundingClientRect().left;
			}) : 0)) + "px";
		}
	});

	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function (prefix, suffix) {
		jQuery.cssHooks[prefix + suffix] = {
			expand: function expand(value) {
				var i = 0,
				    expanded = {},
				    parts = typeof value === "string" ? value.split(" ") : [value];

				for (; i < 4; i++) {
					expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
				}

				return expanded;
			}
		};

		if (!rmargin.test(prefix)) {
			jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
		}
	});

	jQuery.fn.extend({
		css: function css(name, value) {
			return access(this, function (elem, name, value) {
				var styles,
				    len,
				    map = {},
				    i = 0;

				if (jQuery.isArray(name)) {
					styles = getStyles(elem);
					len = name.length;

					for (; i < len; i++) {
						map[name[i]] = jQuery.css(elem, name[i], false, styles);
					}

					return map;
				}

				return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
			}, name, value, arguments.length > 1);
		},
		show: function show() {
			return showHide(this, true);
		},
		hide: function hide() {
			return showHide(this);
		},
		toggle: function toggle(state) {
			if (typeof state === "boolean") {
				return state ? this.show() : this.hide();
			}

			return this.each(function () {
				if (isHidden(this)) {
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});
		}
	});

	function Tween(elem, options, prop, end, easing) {
		return new Tween.prototype.init(elem, options, prop, end, easing);
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function init(elem, options, prop, end, easing, unit) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
		},
		cur: function cur() {
			var hooks = Tween.propHooks[this.prop];

			return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
		},
		run: function run(percent) {
			var eased,
			    hooks = Tween.propHooks[this.prop];

			if (this.options.duration) {
				this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
			} else {
				this.pos = eased = percent;
			}
			this.now = (this.end - this.start) * eased + this.start;

			if (this.options.step) {
				this.options.step.call(this.elem, this.now, this);
			}

			if (hooks && hooks.set) {
				hooks.set(this);
			} else {
				Tween.propHooks._default.set(this);
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function get(tween) {
				var result;

				if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
					return tween.elem[tween.prop];
				}

				result = jQuery.css(tween.elem, tween.prop, "");

				return !result || result === "auto" ? 0 : result;
			},
			set: function set(tween) {
				if (jQuery.fx.step[tween.prop]) {
					jQuery.fx.step[tween.prop](tween);
				} else if (tween.elem.nodeType === 1 && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
					jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
				} else {
					tween.elem[tween.prop] = tween.now;
				}
			}
		}
	};

	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function set(tween) {
			if (tween.elem.nodeType && tween.elem.parentNode) {
				tween.elem[tween.prop] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function linear(p) {
			return p;
		},
		swing: function swing(p) {
			return 0.5 - Math.cos(p * Math.PI) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	jQuery.fx.step = {};

	var fxNow,
	    timerId,
	    rfxtypes = /^(?:toggle|show|hide)$/,
	    rrun = /queueHooks$/;

	function createFxNow() {
		window.setTimeout(function () {
			fxNow = undefined;
		});
		return fxNow = jQuery.now();
	}

	function genFx(type, includeWidth) {
		var which,
		    attrs = { height: type },
		    i = 0;

		includeWidth = includeWidth ? 1 : 0;
		for (; i < 4; i += 2 - includeWidth) {
			which = cssExpand[i];
			attrs["margin" + which] = attrs["padding" + which] = type;
		}

		if (includeWidth) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween(value, prop, animation) {
		var tween,
		    collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
		    index = 0,
		    length = collection.length;
		for (; index < length; index++) {
			if (tween = collection[index].call(animation, prop, value)) {
				return tween;
			}
		}
	}

	function defaultPrefilter(elem, props, opts) {
		var prop,
		    value,
		    toggle,
		    tween,
		    hooks,
		    oldfire,
		    display,
		    checkDisplay,
		    anim = this,
		    orig = {},
		    style = elem.style,
		    hidden = elem.nodeType && isHidden(elem),
		    dataShow = jQuery._data(elem, "fxshow");

		if (!opts.queue) {
			hooks = jQuery._queueHooks(elem, "fx");
			if (hooks.unqueued == null) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function () {
					if (!hooks.unqueued) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function () {
				anim.always(function () {
					hooks.unqueued--;
					if (!jQuery.queue(elem, "fx").length) {
						hooks.empty.fire();
					}
				});
			});
		}

		if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
			opts.overflow = [style.overflow, style.overflowX, style.overflowY];

			display = jQuery.css(elem, "display");

			checkDisplay = display === "none" ? jQuery._data(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;

			if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {
				if (!support.inlineBlockNeedsLayout || defaultDisplay(elem.nodeName) === "inline") {
					style.display = "inline-block";
				} else {
					style.zoom = 1;
				}
			}
		}

		if (opts.overflow) {
			style.overflow = "hidden";
			if (!support.shrinkWrapBlocks()) {
				anim.always(function () {
					style.overflow = opts.overflow[0];
					style.overflowX = opts.overflow[1];
					style.overflowY = opts.overflow[2];
				});
			}
		}

		for (prop in props) {
			value = props[prop];
			if (rfxtypes.exec(value)) {
				delete props[prop];
				toggle = toggle || value === "toggle";
				if (value === (hidden ? "hide" : "show")) {
					if (value === "show" && dataShow && dataShow[prop] !== undefined) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
			} else {
				display = undefined;
			}
		}

		if (!jQuery.isEmptyObject(orig)) {
			if (dataShow) {
				if ("hidden" in dataShow) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = jQuery._data(elem, "fxshow", {});
			}

			if (toggle) {
				dataShow.hidden = !hidden;
			}
			if (hidden) {
				jQuery(elem).show();
			} else {
				anim.done(function () {
					jQuery(elem).hide();
				});
			}
			anim.done(function () {
				var prop;
				jQuery._removeData(elem, "fxshow");
				for (prop in orig) {
					jQuery.style(elem, prop, orig[prop]);
				}
			});
			for (prop in orig) {
				tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

				if (!(prop in dataShow)) {
					dataShow[prop] = tween.start;
					if (hidden) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}
		} else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
			style.display = display;
		}
	}

	function propFilter(props, specialEasing) {
		var index, name, easing, value, hooks;

		for (index in props) {
			name = jQuery.camelCase(index);
			easing = specialEasing[name];
			value = props[index];
			if (jQuery.isArray(value)) {
				easing = value[1];
				value = props[index] = value[0];
			}

			if (index !== name) {
				props[name] = value;
				delete props[index];
			}

			hooks = jQuery.cssHooks[name];
			if (hooks && "expand" in hooks) {
				value = hooks.expand(value);
				delete props[name];

				for (index in value) {
					if (!(index in props)) {
						props[index] = value[index];
						specialEasing[index] = easing;
					}
				}
			} else {
				specialEasing[name] = easing;
			}
		}
	}

	function Animation(elem, properties, options) {
		var result,
		    stopped,
		    index = 0,
		    length = Animation.prefilters.length,
		    deferred = jQuery.Deferred().always(function () {
			delete tick.elem;
		}),
		    tick = function tick() {
			if (stopped) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
			    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
			    temp = remaining / animation.duration || 0,
			    percent = 1 - temp,
			    index = 0,
			    length = animation.tweens.length;

			for (; index < length; index++) {
				animation.tweens[index].run(percent);
			}

			deferred.notifyWith(elem, [animation, percent, remaining]);

			if (percent < 1 && length) {
				return remaining;
			} else {
				deferred.resolveWith(elem, [animation]);
				return false;
			}
		},
		    animation = deferred.promise({
			elem: elem,
			props: jQuery.extend({}, properties),
			opts: jQuery.extend(true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function createTween(prop, end) {
				var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
				animation.tweens.push(tween);
				return tween;
			},
			stop: function stop(gotoEnd) {
				var index = 0,
				    length = gotoEnd ? animation.tweens.length : 0;
				if (stopped) {
					return this;
				}
				stopped = true;
				for (; index < length; index++) {
					animation.tweens[index].run(1);
				}

				if (gotoEnd) {
					deferred.notifyWith(elem, [animation, 1, 0]);
					deferred.resolveWith(elem, [animation, gotoEnd]);
				} else {
					deferred.rejectWith(elem, [animation, gotoEnd]);
				}
				return this;
			}
		}),
		    props = animation.props;

		propFilter(props, animation.opts.specialEasing);

		for (; index < length; index++) {
			result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
			if (result) {
				if (jQuery.isFunction(result.stop)) {
					jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(result.stop, result);
				}
				return result;
			}
		}

		jQuery.map(props, createTween, animation);

		if (jQuery.isFunction(animation.opts.start)) {
			animation.opts.start.call(elem, animation);
		}

		jQuery.fx.timer(jQuery.extend(tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		}));

		return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
	}

	jQuery.Animation = jQuery.extend(Animation, {

		tweeners: {
			"*": [function (prop, value) {
				var tween = this.createTween(prop, value);
				adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
				return tween;
			}]
		},

		tweener: function tweener(props, callback) {
			if (jQuery.isFunction(props)) {
				callback = props;
				props = ["*"];
			} else {
				props = props.match(rnotwhite);
			}

			var prop,
			    index = 0,
			    length = props.length;

			for (; index < length; index++) {
				prop = props[index];
				Animation.tweeners[prop] = Animation.tweeners[prop] || [];
				Animation.tweeners[prop].unshift(callback);
			}
		},

		prefilters: [defaultPrefilter],

		prefilter: function prefilter(callback, prepend) {
			if (prepend) {
				Animation.prefilters.unshift(callback);
			} else {
				Animation.prefilters.push(callback);
			}
		}
	});

	jQuery.speed = function (speed, easing, fn) {
		var opt = speed && (typeof speed === "undefined" ? "undefined" : _typeof(speed)) === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		if (opt.queue == null || opt.queue === true) {
			opt.queue = "fx";
		}

		opt.old = opt.complete;

		opt.complete = function () {
			if (jQuery.isFunction(opt.old)) {
				opt.old.call(this);
			}

			if (opt.queue) {
				jQuery.dequeue(this, opt.queue);
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function fadeTo(speed, to, easing, callback) {
			return this.filter(isHidden).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
		},
		animate: function animate(prop, speed, easing, callback) {
			var empty = jQuery.isEmptyObject(prop),
			    optall = jQuery.speed(speed, easing, callback),
			    doAnimation = function doAnimation() {
				var anim = Animation(this, jQuery.extend({}, prop), optall);

				if (empty || jQuery._data(this, "finish")) {
					anim.stop(true);
				}
			};
			doAnimation.finish = doAnimation;

			return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
		},
		stop: function stop(type, clearQueue, gotoEnd) {
			var stopQueue = function stopQueue(hooks) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop(gotoEnd);
			};

			if (typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function () {
				var dequeue = true,
				    index = type != null && type + "queueHooks",
				    timers = jQuery.timers,
				    data = jQuery._data(this);

				if (index) {
					if (data[index] && data[index].stop) {
						stopQueue(data[index]);
					}
				} else {
					for (index in data) {
						if (data[index] && data[index].stop && rrun.test(index)) {
							stopQueue(data[index]);
						}
					}
				}

				for (index = timers.length; index--;) {
					if (timers[index].elem === this && (type == null || timers[index].queue === type)) {

						timers[index].anim.stop(gotoEnd);
						dequeue = false;
						timers.splice(index, 1);
					}
				}

				if (dequeue || !gotoEnd) {
					jQuery.dequeue(this, type);
				}
			});
		},
		finish: function finish(type) {
			if (type !== false) {
				type = type || "fx";
			}
			return this.each(function () {
				var index,
				    data = jQuery._data(this),
				    queue = data[type + "queue"],
				    hooks = data[type + "queueHooks"],
				    timers = jQuery.timers,
				    length = queue ? queue.length : 0;

				data.finish = true;

				jQuery.queue(this, type, []);

				if (hooks && hooks.stop) {
					hooks.stop.call(this, true);
				}

				for (index = timers.length; index--;) {
					if (timers[index].elem === this && timers[index].queue === type) {
						timers[index].anim.stop(true);
						timers.splice(index, 1);
					}
				}

				for (index = 0; index < length; index++) {
					if (queue[index] && queue[index].finish) {
						queue[index].finish.call(this);
					}
				}

				delete data.finish;
			});
		}
	});

	jQuery.each(["toggle", "show", "hide"], function (i, name) {
		var cssFn = jQuery.fn[name];
		jQuery.fn[name] = function (speed, easing, callback) {
			return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
		};
	});

	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function (name, props) {
		jQuery.fn[name] = function (speed, easing, callback) {
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.timers = [];
	jQuery.fx.tick = function () {
		var timer,
		    timers = jQuery.timers,
		    i = 0;

		fxNow = jQuery.now();

		for (; i < timers.length; i++) {
			timer = timers[i];

			if (!timer() && timers[i] === timer) {
				timers.splice(i--, 1);
			}
		}

		if (!timers.length) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function (timer) {
		jQuery.timers.push(timer);
		if (timer()) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;

	jQuery.fx.start = function () {
		if (!timerId) {
			timerId = window.setInterval(jQuery.fx.tick, jQuery.fx.interval);
		}
	};

	jQuery.fx.stop = function () {
		window.clearInterval(timerId);
		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		_default: 400
	};

	jQuery.fn.delay = function (time, type) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue(type, function (next, hooks) {
			var timeout = window.setTimeout(next, time);
			hooks.stop = function () {
				window.clearTimeout(timeout);
			};
		});
	};

	(function () {
		var a,
		    input = document.createElement("input"),
		    div = document.createElement("div"),
		    select = document.createElement("select"),
		    opt = select.appendChild(document.createElement("option"));

		div = document.createElement("div");
		div.setAttribute("className", "t");
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
		a = div.getElementsByTagName("a")[0];

		input.setAttribute("type", "checkbox");
		div.appendChild(input);

		a = div.getElementsByTagName("a")[0];

		a.style.cssText = "top:1px";

		support.getSetAttribute = div.className !== "t";

		support.style = /top/.test(a.getAttribute("style"));

		support.hrefNormalized = a.getAttribute("href") === "/a";

		support.checkOn = !!input.value;

		support.optSelected = opt.selected;

		support.enctype = !!document.createElement("form").enctype;

		select.disabled = true;
		support.optDisabled = !opt.disabled;

		input = document.createElement("input");
		input.setAttribute("value", "");
		support.input = input.getAttribute("value") === "";

		input.value = "t";
		input.setAttribute("type", "radio");
		support.radioValue = input.value === "t";
	})();

	var rreturn = /\r/g,
	    rspaces = /[\x20\t\r\n\f]+/g;

	jQuery.fn.extend({
		val: function val(value) {
			var hooks,
			    ret,
			    isFunction,
			    elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

					if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ? ret.replace(rreturn, "") : ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);

			return this.each(function (i) {
				var val;

				if (this.nodeType !== 1) {
					return;
				}

				if (isFunction) {
					val = value.call(this, i, jQuery(this).val());
				} else {
					val = value;
				}

				if (val == null) {
					val = "";
				} else if (typeof val === "number") {
					val += "";
				} else if (jQuery.isArray(val)) {
					val = jQuery.map(val, function (value) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function get(elem) {
					var val = jQuery.find.attr(elem, "value");
					return val != null ? val : jQuery.trim(jQuery.text(elem)).replace(rspaces, " ");
				}
			},
			select: {
				get: function get(elem) {
					var value,
					    option,
					    options = elem.options,
					    index = elem.selectedIndex,
					    one = elem.type === "select-one" || index < 0,
					    values = one ? null : [],
					    max = one ? index + 1 : options.length,
					    i = index < 0 ? max : one ? index : 0;

					for (; i < max; i++) {
						option = options[i];

						if ((option.selected || i === index) && (support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
							value = jQuery(option).val();

							if (one) {
								return value;
							}

							values.push(value);
						}
					}

					return values;
				},

				set: function set(elem, value) {
					var optionSet,
					    option,
					    options = elem.options,
					    values = jQuery.makeArray(value),
					    i = options.length;

					while (i--) {
						option = options[i];

						if (jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
							try {
								option.selected = optionSet = true;
							} catch (_) {
								option.scrollHeight;
							}
						} else {
							option.selected = false;
						}
					}

					if (!optionSet) {
						elem.selectedIndex = -1;
					}

					return options;
				}
			}
		}
	});

	jQuery.each(["radio", "checkbox"], function () {
		jQuery.valHooks[this] = {
			set: function set(elem, value) {
				if (jQuery.isArray(value)) {
					return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
				}
			}
		};
		if (!support.checkOn) {
			jQuery.valHooks[this].get = function (elem) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});

	var nodeHook,
	    boolHook,
	    attrHandle = jQuery.expr.attrHandle,
	    ruseDefault = /^(?:checked|selected)$/i,
	    getSetAttribute = support.getSetAttribute,
	    getSetInput = support.input;

	jQuery.fn.extend({
		attr: function attr(name, value) {
			return access(this, jQuery.attr, name, value, arguments.length > 1);
		},

		removeAttr: function removeAttr(name) {
			return this.each(function () {
				jQuery.removeAttr(this, name);
			});
		}
	});

	jQuery.extend({
		attr: function attr(elem, name, value) {
			var ret,
			    hooks,
			    nType = elem.nodeType;

			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (typeof elem.getAttribute === "undefined") {
				return jQuery.prop(elem, name, value);
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
			}

			if (value !== undefined) {
				if (value === null) {
					jQuery.removeAttr(elem, name);
					return;
				}

				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				elem.setAttribute(name, value + "");
				return value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			ret = jQuery.find.attr(elem, name);

			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function set(elem, value) {
					if (!support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
						var val = elem.value;
						elem.setAttribute("type", value);
						if (val) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function removeAttr(elem, value) {
			var name,
			    propName,
			    i = 0,
			    attrNames = value && value.match(rnotwhite);

			if (attrNames && elem.nodeType === 1) {
				while (name = attrNames[i++]) {
					propName = jQuery.propFix[name] || name;

					if (jQuery.expr.match.bool.test(name)) {
						if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
							elem[propName] = false;
						} else {
							elem[jQuery.camelCase("default-" + name)] = elem[propName] = false;
						}
					} else {
						jQuery.attr(elem, name, "");
					}

					elem.removeAttribute(getSetAttribute ? name : propName);
				}
			}
		}
	});

	boolHook = {
		set: function set(elem, value, name) {
			if (value === false) {
				jQuery.removeAttr(elem, name);
			} else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
				elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name);
			} else {
				elem[jQuery.camelCase("default-" + name)] = elem[name] = true;
			}
			return name;
		}
	};

	jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
		var getter = attrHandle[name] || jQuery.find.attr;

		if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
			attrHandle[name] = function (elem, name, isXML) {
				var ret, handle;
				if (!isXML) {
					handle = attrHandle[name];
					attrHandle[name] = ret;
					ret = getter(elem, name, isXML) != null ? name.toLowerCase() : null;
					attrHandle[name] = handle;
				}
				return ret;
			};
		} else {
			attrHandle[name] = function (elem, name, isXML) {
				if (!isXML) {
					return elem[jQuery.camelCase("default-" + name)] ? name.toLowerCase() : null;
				}
			};
		}
	});

	if (!getSetInput || !getSetAttribute) {
		jQuery.attrHooks.value = {
			set: function set(elem, value, name) {
				if (jQuery.nodeName(elem, "input")) {
					elem.defaultValue = value;
				} else {
					return nodeHook && nodeHook.set(elem, value, name);
				}
			}
		};
	}

	if (!getSetAttribute) {
		nodeHook = {
			set: function set(elem, value, name) {
				var ret = elem.getAttributeNode(name);
				if (!ret) {
					elem.setAttributeNode(ret = elem.ownerDocument.createAttribute(name));
				}

				ret.value = value += "";

				if (name === "value" || value === elem.getAttribute(name)) {
					return value;
				}
			}
		};

		attrHandle.id = attrHandle.name = attrHandle.coords = function (elem, name, isXML) {
			var ret;
			if (!isXML) {
				return (ret = elem.getAttributeNode(name)) && ret.value !== "" ? ret.value : null;
			}
		};

		jQuery.valHooks.button = {
			get: function get(elem, name) {
				var ret = elem.getAttributeNode(name);
				if (ret && ret.specified) {
					return ret.value;
				}
			},
			set: nodeHook.set
		};

		jQuery.attrHooks.contenteditable = {
			set: function set(elem, value, name) {
				nodeHook.set(elem, value === "" ? false : value, name);
			}
		};

		jQuery.each(["width", "height"], function (i, name) {
			jQuery.attrHooks[name] = {
				set: function set(elem, value) {
					if (value === "") {
						elem.setAttribute(name, "auto");
						return value;
					}
				}
			};
		});
	}

	if (!support.style) {
		jQuery.attrHooks.style = {
			get: function get(elem) {
				return elem.style.cssText || undefined;
			},
			set: function set(elem, value) {
				return elem.style.cssText = value + "";
			}
		};
	}

	var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	    rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend({
		prop: function prop(name, value) {
			return access(this, jQuery.prop, name, value, arguments.length > 1);
		},

		removeProp: function removeProp(name) {
			name = jQuery.propFix[name] || name;
			return this.each(function () {
				try {
					this[name] = undefined;
					delete this[name];
				} catch (e) {}
			});
		}
	});

	jQuery.extend({
		prop: function prop(elem, name, value) {
			var ret,
			    hooks,
			    nType = elem.nodeType;

			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				return elem[name] = value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			return elem[name];
		},

		propHooks: {
			tabIndex: {
				get: function get(elem) {
					var tabindex = jQuery.find.attr(elem, "tabindex");

					return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	});

	if (!support.hrefNormalized) {
		jQuery.each(["href", "src"], function (i, name) {
			jQuery.propHooks[name] = {
				get: function get(elem) {
					return elem.getAttribute(name, 4);
				}
			};
		});
	}

	if (!support.optSelected) {
		jQuery.propHooks.selected = {
			get: function get(elem) {
				var parent = elem.parentNode;

				if (parent) {
					parent.selectedIndex;

					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
				return null;
			},
			set: function set(elem) {
				var parent = elem.parentNode;
				if (parent) {
					parent.selectedIndex;

					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
		jQuery.propFix[this.toLowerCase()] = this;
	});

	if (!support.enctype) {
		jQuery.propFix.enctype = "encoding";
	}

	var rclass = /[\t\r\n\f]/g;

	function getClass(elem) {
		return jQuery.attr(elem, "class") || "";
	}

	jQuery.fn.extend({
		addClass: function addClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).addClass(value.call(this, j, getClass(this)));
				});
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnotwhite) || [];

				while (elem = this[i++]) {
					curValue = getClass(elem);
					cur = elem.nodeType === 1 && (" " + curValue + " ").replace(rclass, " ");

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}

						finalValue = jQuery.trim(cur);
						if (curValue !== finalValue) {
							jQuery.attr(elem, "class", finalValue);
						}
					}
				}
			}

			return this;
		},

		removeClass: function removeClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).removeClass(value.call(this, j, getClass(this)));
				});
			}

			if (!arguments.length) {
				return this.attr("class", "");
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnotwhite) || [];

				while (elem = this[i++]) {
					curValue = getClass(elem);

					cur = elem.nodeType === 1 && (" " + curValue + " ").replace(rclass, " ");

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {
							while (cur.indexOf(" " + clazz + " ") > -1) {
								cur = cur.replace(" " + clazz + " ", " ");
							}
						}

						finalValue = jQuery.trim(cur);
						if (curValue !== finalValue) {
							jQuery.attr(elem, "class", finalValue);
						}
					}
				}
			}

			return this;
		},

		toggleClass: function toggleClass(value, stateVal) {
			var type = typeof value === "undefined" ? "undefined" : _typeof(value);

			if (typeof stateVal === "boolean" && type === "string") {
				return stateVal ? this.addClass(value) : this.removeClass(value);
			}

			if (jQuery.isFunction(value)) {
				return this.each(function (i) {
					jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
				});
			}

			return this.each(function () {
				var className, i, self, classNames;

				if (type === "string") {
					i = 0;
					self = jQuery(this);
					classNames = value.match(rnotwhite) || [];

					while (className = classNames[i++]) {
						if (self.hasClass(className)) {
							self.removeClass(className);
						} else {
							self.addClass(className);
						}
					}
				} else if (value === undefined || type === "boolean") {
					className = getClass(this);
					if (className) {
						jQuery._data(this, "__className__", className);
					}

					jQuery.attr(this, "class", className || value === false ? "" : jQuery._data(this, "__className__") || "");
				}
			});
		},

		hasClass: function hasClass(selector) {
			var className,
			    elem,
			    i = 0;

			className = " " + selector + " ";
			while (elem = this[i++]) {
				if (elem.nodeType === 1 && (" " + getClass(elem) + " ").replace(rclass, " ").indexOf(className) > -1) {
					return true;
				}
			}

			return false;
		}
	});

	jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {
		jQuery.fn[name] = function (data, fn) {
			return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
		};
	});

	jQuery.fn.extend({
		hover: function hover(fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});

	var location = window.location;

	var nonce = jQuery.now();

	var rquery = /\?/;

	var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

	jQuery.parseJSON = function (data) {
		if (window.JSON && window.JSON.parse) {
			return window.JSON.parse(data + "");
		}

		var requireNonComma,
		    depth = null,
		    str = jQuery.trim(data + "");

		return str && !jQuery.trim(str.replace(rvalidtokens, function (token, comma, open, close) {
			if (requireNonComma && comma) {
				depth = 0;
			}

			if (depth === 0) {
				return token;
			}

			requireNonComma = open || comma;

			depth += !close - !open;

			return "";
		})) ? Function("return " + str)() : jQuery.error("Invalid JSON: " + data);
	};

	jQuery.parseXML = function (data) {
		var xml, tmp;
		if (!data || typeof data !== "string") {
			return null;
		}
		try {
			if (window.DOMParser) {
				tmp = new window.DOMParser();
				xml = tmp.parseFromString(data, "text/xml");
			} else {
				xml = new window.ActiveXObject("Microsoft.XMLDOM");
				xml.async = "false";
				xml.loadXML(data);
			}
		} catch (e) {
			xml = undefined;
		}
		if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
			jQuery.error("Invalid XML: " + data);
		}
		return xml;
	};

	var rhash = /#.*$/,
	    rts = /([?&])_=[^&]*/,
	    rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
	    rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	    rnoContent = /^(?:GET|HEAD)$/,
	    rprotocol = /^\/\//,
	    rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
	    prefilters = {},
	    transports = {},
	    allTypes = "*/".concat("*"),
	    ajaxLocation = location.href,
	    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

	function addToPrefiltersOrTransports(structure) {
		return function (dataTypeExpression, func) {

			if (typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
			    i = 0,
			    dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];

			if (jQuery.isFunction(func)) {
				while (dataType = dataTypes[i++]) {
					if (dataType.charAt(0) === "+") {
						dataType = dataType.slice(1) || "*";
						(structure[dataType] = structure[dataType] || []).unshift(func);
					} else {
						(structure[dataType] = structure[dataType] || []).push(func);
					}
				}
			}
		};
	}

	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

		var inspected = {},
		    seekingTransport = structure === transports;

		function inspect(dataType) {
			var selected;
			inspected[dataType] = true;
			jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
				var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
				if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {

					options.dataTypes.unshift(dataTypeOrTransport);
					inspect(dataTypeOrTransport);
					return false;
				} else if (seekingTransport) {
					return !(selected = dataTypeOrTransport);
				}
			});
			return selected;
		}

		return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
	}

	function ajaxExtend(target, src) {
		var deep,
		    key,
		    flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for (key in src) {
			if (src[key] !== undefined) {
				(flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}

		return target;
	}

	function ajaxHandleResponses(s, jqXHR, responses) {
		var firstDataType,
		    ct,
		    finalDataType,
		    type,
		    contents = s.contents,
		    dataTypes = s.dataTypes;

		while (dataTypes[0] === "*") {
			dataTypes.shift();
			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		if (ct) {
			for (type in contents) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}
				if (!firstDataType) {
					firstDataType = type;
				}
			}

			finalDataType = finalDataType || firstDataType;
		}

		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	function ajaxConvert(s, response, jqXHR, isSuccess) {
		var conv2,
		    current,
		    conv,
		    tmp,
		    prev,
		    converters = {},
		    dataTypes = s.dataTypes.slice();

		if (dataTypes[1]) {
			for (conv in s.converters) {
				converters[conv.toLowerCase()] = s.converters[conv];
			}
		}

		current = dataTypes.shift();

		while (current) {

			if (s.responseFields[current]) {
				jqXHR[s.responseFields[current]] = response;
			}

			if (!prev && isSuccess && s.dataFilter) {
				response = s.dataFilter(response, s.dataType);
			}

			prev = current;
			current = dataTypes.shift();

			if (current) {
				if (current === "*") {

					current = prev;
				} else if (prev !== "*" && prev !== current) {
					conv = converters[prev + " " + current] || converters["* " + current];

					if (!conv) {
						for (conv2 in converters) {
							tmp = conv2.split(" ");
							if (tmp[1] === current) {
								conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
								if (conv) {
									if (conv === true) {
										conv = converters[conv2];
									} else if (converters[conv2] !== true) {
										current = tmp[0];
										dataTypes.unshift(tmp[1]);
									}
									break;
								}
							}
						}
					}

					if (conv !== true) {
						if (conv && s["throws"]) {
							response = conv(response);
						} else {
							try {
								response = conv(response);
							} catch (e) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend({
		active: 0,

		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: ajaxLocation,
			type: "GET",
			isLocal: rlocalProtocol.test(ajaxLocParts[1]),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",


			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			converters: {
				"* text": String,

				"text html": true,

				"text json": jQuery.parseJSON,

				"text xml": jQuery.parseXML
			},

			flatOptions: {
				url: true,
				context: true
			}
		},

		ajaxSetup: function ajaxSetup(target, settings) {
			return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
		},

		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),

		ajax: function ajax(url, options) {
			if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
				options = url;
				url = undefined;
			}

			options = options || {};

			var parts,
			    i,
			    cacheURL,
			    responseHeadersString,
			    timeoutTimer,
			    fireGlobals,
			    transport,
			    responseHeaders,
			    s = jQuery.ajaxSetup({}, options),
			    callbackContext = s.context || s,
			    globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,
			    deferred = jQuery.Deferred(),
			    completeDeferred = jQuery.Callbacks("once memory"),
			    _statusCode = s.statusCode || {},
			    requestHeaders = {},
			    requestHeadersNames = {},
			    state = 0,
			    strAbort = "canceled",
			    jqXHR = {
				readyState: 0,

				getResponseHeader: function getResponseHeader(key) {
					var match;
					if (state === 2) {
						if (!responseHeaders) {
							responseHeaders = {};
							while (match = rheaders.exec(responseHeadersString)) {
								responseHeaders[match[1].toLowerCase()] = match[2];
							}
						}
						match = responseHeaders[key.toLowerCase()];
					}
					return match == null ? null : match;
				},

				getAllResponseHeaders: function getAllResponseHeaders() {
					return state === 2 ? responseHeadersString : null;
				},

				setRequestHeader: function setRequestHeader(name, value) {
					var lname = name.toLowerCase();
					if (!state) {
						name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
						requestHeaders[name] = value;
					}
					return this;
				},

				overrideMimeType: function overrideMimeType(type) {
					if (!state) {
						s.mimeType = type;
					}
					return this;
				},

				statusCode: function statusCode(map) {
					var code;
					if (map) {
						if (state < 2) {
							for (code in map) {
								_statusCode[code] = [_statusCode[code], map[code]];
							}
						} else {
							jqXHR.always(map[jqXHR.status]);
						}
					}
					return this;
				},

				abort: function abort(statusText) {
					var finalText = statusText || strAbort;
					if (transport) {
						transport.abort(finalText);
					}
					done(0, finalText);
					return this;
				}
			};

			deferred.promise(jqXHR).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;

			s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

			s.type = options.method || options.type || s.method || s.type;

			s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];

			if (s.crossDomain == null) {
				parts = rurl.exec(s.url.toLowerCase());
				s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === "http:" ? "80" : "443")) !== (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443"))));
			}

			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			if (state === 2) {
				return jqXHR;
			}

			fireGlobals = jQuery.event && s.global;

			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			s.type = s.type.toUpperCase();

			s.hasContent = !rnoContent.test(s.type);

			cacheURL = s.url;

			if (!s.hasContent) {
				if (s.data) {
					cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data;

					delete s.data;
				}

				if (s.cache === false) {
					s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + nonce++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
				}
			}

			if (s.ifModified) {
				if (jQuery.lastModified[cacheURL]) {
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
				}
				if (jQuery.etag[cacheURL]) {
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
				}
			}

			if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);

			for (i in s.headers) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
				return jqXHR.abort();
			}

			strAbort = "abort";

			for (i in { success: 1, error: 1, complete: 1 }) {
				jqXHR[i](s[i]);
			}

			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;

				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}

				if (state === 2) {
					return jqXHR;
				}

				if (s.async && s.timeout > 0) {
					timeoutTimer = window.setTimeout(function () {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					state = 1;
					transport.send(requestHeaders, done);
				} catch (e) {
					if (state < 2) {
						done(-1, e);
					} else {
						throw e;
					}
				}
			}

			function done(status, nativeStatusText, responses, headers) {
				var isSuccess,
				    success,
				    error,
				    response,
				    modified,
				    statusText = nativeStatusText;

				if (state === 2) {
					return;
				}

				state = 2;

				if (timeoutTimer) {
					window.clearTimeout(timeoutTimer);
				}

				transport = undefined;

				responseHeadersString = headers || "";

				jqXHR.readyState = status > 0 ? 4 : 0;

				isSuccess = status >= 200 && status < 300 || status === 304;

				if (responses) {
					response = ajaxHandleResponses(s, jqXHR, responses);
				}

				response = ajaxConvert(s, response, jqXHR, isSuccess);

				if (isSuccess) {
					if (s.ifModified) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if (modified) {
							jQuery.lastModified[cacheURL] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if (modified) {
							jQuery.etag[cacheURL] = modified;
						}
					}

					if (status === 204 || s.type === "HEAD") {
						statusText = "nocontent";
					} else if (status === 304) {
						statusText = "notmodified";
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
					error = statusText;
					if (status || !statusText) {
						statusText = "error";
						if (status < 0) {
							status = 0;
						}
					}
				}

				jqXHR.status = status;
				jqXHR.statusText = (nativeStatusText || statusText) + "";

				if (isSuccess) {
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else {
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				jqXHR.statusCode(_statusCode);
				_statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
				}

				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

					if (! --jQuery.active) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},

		getJSON: function getJSON(url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},

		getScript: function getScript(url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		}
	});

	jQuery.each(["get", "post"], function (i, method) {
		jQuery[method] = function (url, data, callback, type) {
			if (jQuery.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			return jQuery.ajax(jQuery.extend({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject(url) && url));
		};
	});

	jQuery._evalUrl = function (url) {
		return jQuery.ajax({
			url: url,

			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		});
	};

	jQuery.fn.extend({
		wrapAll: function wrapAll(html) {
			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapAll(html.call(this, i));
				});
			}

			if (this[0]) {
				var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function () {
					var elem = this;

					while (elem.firstChild && elem.firstChild.nodeType === 1) {
						elem = elem.firstChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner: function wrapInner(html) {
			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function () {
				var self = jQuery(this),
				    contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);
				} else {
					self.append(html);
				}
			});
		},

		wrap: function wrap(html) {
			var isFunction = jQuery.isFunction(html);

			return this.each(function (i) {
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
			});
		},

		unwrap: function unwrap() {
			return this.parent().each(function () {
				if (!jQuery.nodeName(this, "body")) {
					jQuery(this).replaceWith(this.childNodes);
				}
			}).end();
		}
	});

	function getDisplay(elem) {
		return elem.style && elem.style.display || jQuery.css(elem, "display");
	}

	function filterHidden(elem) {
		while (elem && elem.nodeType === 1) {
			if (getDisplay(elem) === "none" || elem.type === "hidden") {
				return true;
			}
			elem = elem.parentNode;
		}
		return false;
	}

	jQuery.expr.filters.hidden = function (elem) {
		return support.reliableHiddenOffsets() ? elem.offsetWidth <= 0 && elem.offsetHeight <= 0 && !elem.getClientRects().length : filterHidden(elem);
	};

	jQuery.expr.filters.visible = function (elem) {
		return !jQuery.expr.filters.hidden(elem);
	};

	var r20 = /%20/g,
	    rbracket = /\[\]$/,
	    rCRLF = /\r?\n/g,
	    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	    rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams(prefix, obj, traditional, add) {
		var name;

		if (jQuery.isArray(obj)) {
			jQuery.each(obj, function (i, v) {
				if (traditional || rbracket.test(prefix)) {
					add(prefix, v);
				} else {
					buildParams(prefix + "[" + ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" && v != null ? i : "") + "]", v, traditional, add);
				}
			});
		} else if (!traditional && jQuery.type(obj) === "object") {
			for (name in obj) {
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}
		} else {
			add(prefix, obj);
		}
	}

	jQuery.param = function (a, traditional) {
		var prefix,
		    s = [],
		    add = function add(key, value) {
			value = jQuery.isFunction(value) ? value() : value == null ? "" : value;
			s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		};

		if (traditional === undefined) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}

		if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
			jQuery.each(a, function () {
				add(this.name, this.value);
			});
		} else {
			for (prefix in a) {
				buildParams(prefix, a[prefix], traditional, add);
			}
		}

		return s.join("&").replace(r20, "+");
	};

	jQuery.fn.extend({
		serialize: function serialize() {
			return jQuery.param(this.serializeArray());
		},
		serializeArray: function serializeArray() {
			return this.map(function () {
				var elements = jQuery.prop(this, "elements");
				return elements ? jQuery.makeArray(elements) : this;
			}).filter(function () {
				var type = this.type;

				return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
			}).map(function (i, elem) {
				var val = jQuery(this).val();

				return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val) {
					return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
				}) : { name: elem.name, value: val.replace(rCRLF, "\r\n") };
			}).get();
		}
	});

	jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ? function () {
		if (this.isLocal) {
			return createActiveXHR();
		}

		if (document.documentMode > 8) {
			return createStandardXHR();
		}

		return (/^(get|post|head|put|delete|options)$/i.test(this.type) && createStandardXHR() || createActiveXHR()
		);
	} : createStandardXHR;

	var xhrId = 0,
	    xhrCallbacks = {},
	    xhrSupported = jQuery.ajaxSettings.xhr();

	if (window.attachEvent) {
		window.attachEvent("onunload", function () {
			for (var key in xhrCallbacks) {
				xhrCallbacks[key](undefined, true);
			}
		});
	}

	support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
	xhrSupported = support.ajax = !!xhrSupported;

	if (xhrSupported) {

		jQuery.ajaxTransport(function (options) {
			if (!options.crossDomain || support.cors) {

				var _callback;

				return {
					send: function send(headers, complete) {
						var i,
						    xhr = options.xhr(),
						    id = ++xhrId;

						xhr.open(options.type, options.url, options.async, options.username, options.password);

						if (options.xhrFields) {
							for (i in options.xhrFields) {
								xhr[i] = options.xhrFields[i];
							}
						}

						if (options.mimeType && xhr.overrideMimeType) {
							xhr.overrideMimeType(options.mimeType);
						}

						if (!options.crossDomain && !headers["X-Requested-With"]) {
							headers["X-Requested-With"] = "XMLHttpRequest";
						}

						for (i in headers) {
							if (headers[i] !== undefined) {
								xhr.setRequestHeader(i, headers[i] + "");
							}
						}

						xhr.send(options.hasContent && options.data || null);

						_callback = function callback(_, isAbort) {
							var status, statusText, responses;

							if (_callback && (isAbort || xhr.readyState === 4)) {
								delete xhrCallbacks[id];
								_callback = undefined;
								xhr.onreadystatechange = jQuery.noop;

								if (isAbort) {
									if (xhr.readyState !== 4) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;

									if (typeof xhr.responseText === "string") {
										responses.text = xhr.responseText;
									}

									try {
										statusText = xhr.statusText;
									} catch (e) {
										statusText = "";
									}

									if (!status && options.isLocal && !options.crossDomain) {
										status = responses.text ? 200 : 404;
									} else if (status === 1223) {
										status = 204;
									}
								}
							}

							if (responses) {
								complete(status, statusText, responses, xhr.getAllResponseHeaders());
							}
						};

						if (!options.async) {
							_callback();
						} else if (xhr.readyState === 4) {
							window.setTimeout(_callback);
						} else {
							xhr.onreadystatechange = xhrCallbacks[id] = _callback;
						}
					},

					abort: function abort() {
						if (_callback) {
							_callback(undefined, true);
						}
					}
				};
			}
		});
	}

	function createStandardXHR() {
		try {
			return new window.XMLHttpRequest();
		} catch (e) {}
	}

	function createActiveXHR() {
		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {}
	}

	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function textScript(text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	jQuery.ajaxPrefilter("script", function (s) {
		if (s.cache === undefined) {
			s.cache = false;
		}
		if (s.crossDomain) {
			s.type = "GET";
			s.global = false;
		}
	});

	jQuery.ajaxTransport("script", function (s) {
		if (s.crossDomain) {

			var script,
			    head = document.head || jQuery("head")[0] || document.documentElement;

			return {

				send: function send(_, callback) {

					script = document.createElement("script");

					script.async = true;

					if (s.scriptCharset) {
						script.charset = s.scriptCharset;
					}

					script.src = s.url;

					script.onload = script.onreadystatechange = function (_, isAbort) {

						if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
							script.onload = script.onreadystatechange = null;

							if (script.parentNode) {
								script.parentNode.removeChild(script);
							}

							script = null;

							if (!isAbort) {
								callback(200, "success");
							}
						}
					};

					head.insertBefore(script, head.firstChild);
				},

				abort: function abort() {
					if (script) {
						script.onload(undefined, true);
					}
				}
			};
		}
	});

	var oldCallbacks = [],
	    rjsonp = /(=)\?(?=&|$)|\?\?/;

	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function jsonpCallback() {
			var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
			this[callback] = true;
			return callback;
		}
	});

	jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

		var callbackName,
		    overwritten,
		    responseContainer,
		    jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");

		if (jsonProp || s.dataTypes[0] === "jsonp") {
			callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;

			if (jsonProp) {
				s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
			} else if (s.jsonp !== false) {
				s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
			}

			s.converters["script json"] = function () {
				if (!responseContainer) {
					jQuery.error(callbackName + " was not called");
				}
				return responseContainer[0];
			};

			s.dataTypes[0] = "json";

			overwritten = window[callbackName];
			window[callbackName] = function () {
				responseContainer = arguments;
			};

			jqXHR.always(function () {
				if (overwritten === undefined) {
					jQuery(window).removeProp(callbackName);
				} else {
					window[callbackName] = overwritten;
				}

				if (s[callbackName]) {
					s.jsonpCallback = originalSettings.jsonpCallback;

					oldCallbacks.push(callbackName);
				}

				if (responseContainer && jQuery.isFunction(overwritten)) {
					overwritten(responseContainer[0]);
				}

				responseContainer = overwritten = undefined;
			});

			return "script";
		}
	});

	jQuery.parseHTML = function (data, context, keepScripts) {
		if (!data || typeof data !== "string") {
			return null;
		}
		if (typeof context === "boolean") {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec(data),
		    scripts = !keepScripts && [];

		if (parsed) {
			return [context.createElement(parsed[1])];
		}

		parsed = buildFragment([data], context, scripts);

		if (scripts && scripts.length) {
			jQuery(scripts).remove();
		}

		return jQuery.merge([], parsed.childNodes);
	};

	var _load = jQuery.fn.load;

	jQuery.fn.load = function (url, params, callback) {
		if (typeof url !== "string" && _load) {
			return _load.apply(this, arguments);
		}

		var selector,
		    type,
		    response,
		    self = this,
		    off = url.indexOf(" ");

		if (off > -1) {
			selector = jQuery.trim(url.slice(off, url.length));
			url = url.slice(0, off);
		}

		if (jQuery.isFunction(params)) {
			callback = params;
			params = undefined;
		} else if (params && (typeof params === "undefined" ? "undefined" : _typeof(params)) === "object") {
			type = "POST";
		}

		if (self.length > 0) {
			jQuery.ajax({
				url: url,

				type: type || "GET",
				dataType: "html",
				data: params
			}).done(function (responseText) {
				response = arguments;

				self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
			}).always(callback && function (jqXHR, status) {
				self.each(function () {
					callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
				});
			});
		}

		return this;
	};

	jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
		jQuery.fn[type] = function (fn) {
			return this.on(type, fn);
		};
	});

	jQuery.expr.filters.animated = function (elem) {
		return jQuery.grep(jQuery.timers, function (fn) {
			return elem === fn.elem;
		}).length;
	};

	function getWindow(elem) {
		return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
	}

	jQuery.offset = {
		setOffset: function setOffset(elem, options, i) {
			var curPosition,
			    curLeft,
			    curCSSTop,
			    curTop,
			    curOffset,
			    curCSSLeft,
			    calculatePosition,
			    position = jQuery.css(elem, "position"),
			    curElem = jQuery(elem),
			    props = {};

			if (position === "static") {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css(elem, "top");
			curCSSLeft = jQuery.css(elem, "left");
			calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1;

			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (jQuery.isFunction(options)) {
				options = options.call(elem, i, jQuery.extend({}, curOffset));
			}

			if (options.top != null) {
				props.top = options.top - curOffset.top + curTop;
			}
			if (options.left != null) {
				props.left = options.left - curOffset.left + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);
			} else {
				curElem.css(props);
			}
		}
	};

	jQuery.fn.extend({
		offset: function offset(options) {
			if (arguments.length) {
				return options === undefined ? this : this.each(function (i) {
					jQuery.offset.setOffset(this, options, i);
				});
			}

			var docElem,
			    win,
			    box = { top: 0, left: 0 },
			    elem = this[0],
			    doc = elem && elem.ownerDocument;

			if (!doc) {
				return;
			}

			docElem = doc.documentElement;

			if (!jQuery.contains(docElem, elem)) {
				return box;
			}

			if (typeof elem.getBoundingClientRect !== "undefined") {
				box = elem.getBoundingClientRect();
			}
			win = getWindow(doc);
			return {
				top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
				left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
			};
		},

		position: function position() {
			if (!this[0]) {
				return;
			}

			var offsetParent,
			    offset,
			    parentOffset = { top: 0, left: 0 },
			    elem = this[0];

			if (jQuery.css(elem, "position") === "fixed") {
				offset = elem.getBoundingClientRect();
			} else {
				offsetParent = this.offsetParent();

				offset = this.offset();
				if (!jQuery.nodeName(offsetParent[0], "html")) {
					parentOffset = offsetParent.offset();
				}

				parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
				parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
			}

			return {
				top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
				left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
			};
		},

		offsetParent: function offsetParent() {
			return this.map(function () {
				var offsetParent = this.offsetParent;

				while (offsetParent && !jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static") {
					offsetParent = offsetParent.offsetParent;
				}
				return offsetParent || documentElement;
			});
		}
	});

	jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
		var top = /Y/.test(prop);

		jQuery.fn[method] = function (val) {
			return access(this, function (elem, method, val) {
				var win = getWindow(elem);

				if (val === undefined) {
					return win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method];
				}

				if (win) {
					win.scrollTo(!top ? val : jQuery(win).scrollLeft(), top ? val : jQuery(win).scrollTop());
				} else {
					elem[method] = val;
				}
			}, method, val, arguments.length, null);
		};
	});

	jQuery.each(["top", "left"], function (i, prop) {
		jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
			if (computed) {
				computed = curCSS(elem, prop);

				return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
			}
		});
	});

	jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
		jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {
			jQuery.fn[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
				    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

				return access(this, function (elem, type, value) {
					var doc;

					if (jQuery.isWindow(elem)) {
						return elem.document.documentElement["client" + name];
					}

					if (elem.nodeType === 9) {
						doc = elem.documentElement;

						return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
					}

					return value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable, null);
			};
		});
	});

	jQuery.fn.extend({

		bind: function bind(types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind: function unbind(types, fn) {
			return this.off(types, null, fn);
		},

		delegate: function delegate(selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate: function undelegate(selector, types, fn) {
			return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
		}
	});

	jQuery.fn.size = function () {
		return this.length;
	};

	jQuery.fn.andSelf = jQuery.fn.addBack;

	layui.define(function (exports) {
		layui.$ = jQuery;
		exports('jquery', jQuery);
	});

	return jQuery;
});var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (window, undefined) {
    'use strict';

    var isLayui = window.layui && layui.define,
        $ = void 0,
        $win = void 0,
        _DOC = void 0,
        _ready = {
        getPath: function () {
            var jsPath = void 0;

            if (document.currentScript) {
                jsPath = document.currentScript.src;
            } else {
                var js = document.scripts,
                    last = js.length - 1,
                    src = void 0;
                for (var i = last; i > 0; i--) {
                    if (js[i].readyState === 'interactive') {
                        src = js[i].src;
                        break;
                    }
                }

                jsPath = src || js[last].src;
            }

            return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
        }(),

        config: {},
        end: {},
        minIndex: 0,
        minLeft: [],
        btn: ['&#x786E;&#x5B9A;', '&#x53D6;&#x6D88;'],

        type: ['dialog', 'page', 'iframe', 'loading', 'tips'],

        getStyle: function getStyle(node, name) {
            var style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
            return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
        },

        link: function link(href, fn, cssname) {
            if (!layer.path) return;

            var head = document.getElementsByTagName('head')[0],
                link = document.createElement('link');
            if (typeof fn === 'string') cssname = fn;
            var app = (cssname || href).replace(/[./]/g, '');
            var id = 'layuicss-' + app,
                timeout = 0;

            link.rel = 'stylesheet';
            link.href = layer.path + href;
            link.id = id;

            if (!document.getElementById(id)) {
                head.appendChild(link);
            }

            if (typeof fn !== 'function') return;(function poll() {
                if (++timeout > 8 * 1000 / 100) {
                    return window.console && window.console.error('layer.css: Invalid');
                }

                parseInt(_ready.getStyle(document.getElementById(id), 'width')) === 1989 ? fn() : setTimeout(poll, 100);
            })();
        }
    };

    var globalCache = {};

    var layer = {
        v: '3.1.0',
        ie: function () {
            var agent = navigator.userAgent.toLowerCase();
            return !!window.ActiveXObject || 'ActiveXObject' in window ? (agent.match(/msie\s(\d+)/) || [])[1] || '11' : false;
        }(),
        index: window.layer && window.layer.v ? 100000 : 0,
        path: _ready.getPath,
        config: function config(options) {
            options = options || {};
            layer.cache = _ready.config = $.extend({}, _ready.config, options);
            layer.path = _ready.config.path || layer.path;
            typeof options.extend === 'string' && (options.extend = [options.extend]);

            if (_ready.config.path) layer.ready();

            if (!options.extend) return this;

            isLayui ? layui.addcss('modules/layer/' + options.extend) : _ready.link('theme/' + options.extend);

            return this;
        },

        ready: function ready(callback) {
            var cssname = 'layer',
                ver = '',
                path = (isLayui ? 'modules/layer/' : 'theme/') + 'default/layer.css?v=' + layer.v + ver;
            isLayui ? layui.addcss(path, callback, cssname) : _ready.link(path, callback, cssname);
            return this;
        },

        alert: function alert(content, options, yes) {
            var type = typeof options === 'function';
            if (type) yes = options;
            return layer.open($.extend({
                content: content,
                yes: yes
            }, type ? {} : options));
        },

        confirm: function confirm(content, options, yes, cancel) {
            var type = typeof options === 'function';
            if (type) {
                cancel = yes;
                yes = options;
            }
            return layer.open($.extend({
                content: content,
                btn: _ready.btn,
                yes: yes,
                btn2: cancel
            }, type ? {} : options));
        },

        msg: function msg(content, options, end) {
            var type = typeof options === 'function',
                rskin = _ready.config.skin;
            var skin = (rskin ? rskin + ' ' + rskin + '-msg' : '') || 'layui-layer-msg';
            var anim = doms.anim.length - 1;

            if (type) {
                end = options;
            }

            var extObj = void 0;

            if (type && !_ready.config.skin) {
                extObj = {
                    skin: skin + ' layui-layer-hui',
                    anim: anim
                };
            } else {
                options = options || {};
                if (options.icon === -1 || options.icon === undefined && !_ready.config.skin) {
                    options.skin = skin + ' ' + (options.skin || 'layui-layer-hui');
                }

                extObj = options;
            }

            return layer.open($.extend({
                content: content,
                time: 3000,
                shade: false,
                skin: skin,
                title: false,
                closeBtn: false,
                btn: false,
                resize: false,
                end: end
            }, extObj));
        },

        load: function load(icon, options) {
            return layer.open($.extend({
                type: 3,
                icon: icon || 0,
                resize: false,
                shade: 0.01
            }, options));
        },

        tips: function tips(content, follow, options) {
            return layer.open($.extend({
                type: 4,
                content: [content, follow],
                closeBtn: false,
                time: 3000,
                shade: false,
                resize: false,
                fixed: false,
                maxWidth: 210
            }, options));
        }
    };

    var Layer = function Layer(setings) {
        var _this = this;

        this.index = ++layer.index;
        this.config = $.extend({}, this.config, _ready.config, setings);

        if (document.body) {
            this.create();
        } else {
            setTimeout(function () {
                _this.create();
            }, 30);
        }
    };

    Layer.pt = Layer.prototype;

    var doms = ['layui-layer', '.layui-layer-title', '.layui-layer-main', '.layui-layer-dialog', 'layui-layer-iframe', 'layui-layer-content', 'layui-layer-btn', 'layui-layer-close'];
    doms.anim = ['layer-anim-00', 'layer-anim-01', 'layer-anim-02', 'layer-anim-03', 'layer-anim-04', 'layer-anim-05', 'layer-anim-06'];

    Layer.pt.config = {
        type: 0,
        shade: 0.3,
        fixed: true,
        move: doms[1],
        title: '&#x4FE1;&#x606F;',
        offset: 'auto',
        area: 'auto',
        closeBtn: 1,
        time: 0,
        zIndex: 19891014,
        maxWidth: 360,
        anim: 0,
        isOutAnim: true,
        icon: -1,
        moveType: 1,
        resize: true,
        scrollbar: true,
        tips: 2
    };

    Layer.pt.vessel = function (conType, callback) {
        var that = this,
            times = that.index,
            config = that.config;
        var zIndex = config.zIndex + times,
            titype = _typeof(config.title) === 'object';
        var ismax = config.maxmin && (config.type === 1 || config.type === 2);
        var titleHTML = config.title ? '<div class="layui-layer-title" style="' + (titype ? config.title[1] : '') + '">' + (titype ? config.title[0] : config.title) + '</div>' : '';

        config.zIndex = zIndex;

        var btnStr = '';

        if (config.btn) {
            var button = '';
            typeof config.btn === 'string' && (config.btn = [config.btn]);
            for (var i = 0, len = config.btn.length; i < len; i++) {
                button += '<a class="' + doms[6] + '' + i + '">' + config.btn[i] + '</a>';
            }
            btnStr = '<div class="' + doms[6] + ' layui-layer-btn-' + (config.btnAlign || '') + '">' + button + '</div>';
        }

        callback([config.shade ? '<div class="layui-layer-shade" id="layui-layer-shade' + times + '" times="' + times + '" style="' + ('z-index:' + (zIndex - 1) + '; ') + '"></div>' : '', '<div class="' + doms[0] + (' layui-layer-' + _ready.type[config.type]) + ((config.type === 0 || config.type === 2) && !config.shade ? ' layui-layer-border' : '') + ' ' + (config.skin || '') + '" id="' + doms[0] + times + '" type="' + _ready.type[config.type] + '" times="' + times + '" showtime="' + config.time + '" conType="' + (conType ? 'object' : 'string') + '" style="z-index: ' + zIndex + '; width:' + config.area[0] + ';height:' + config.area[1] + (config.fixed ? '' : ';position:absolute;') + '">' + (conType && config.type !== 2 ? '' : titleHTML) + '<div id="' + (config.id || '') + '" class="layui-layer-content' + (config.type === 0 && config.icon !== -1 ? ' layui-layer-padding' : '') + (config.type === 3 ? ' layui-layer-loading' + config.icon : '') + '">' + (config.type === 0 && config.icon !== -1 ? '<i class="layui-layer-ico layui-layer-ico' + config.icon + '"></i>' : '') + (config.type === 1 && conType ? '' : config.content || '') + '</div>' + '<span class="layui-layer-setwin">' + function () {
            var closebtn = ismax ? '<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : '';
            config.closeBtn && (closebtn += '<a class="layui-layer-ico ' + doms[7] + ' ' + doms[7] + (config.title ? config.closeBtn : config.type === 4 ? '1' : '2') + '" href="javascript:;"></a>');
            return closebtn;
        }() + '</span>' + btnStr + (config.resize ? '<span class="layui-layer-resize"></span>' : '') + '</div>'], titleHTML, $('<div class="layui-layer-move"></div>'));
        return that;
    };

    Layer.pt.create = function () {
        var _this2 = this;

        var that = this,
            config = this.config,
            times = this.index,
            content = config.content,
            conType = (typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object',
            body = $('body');

        if (config.id && $('#' + config.id)[0]) return;

        var cache = globalCache[times] = {};
        cache.config = config;

        if (typeof config.area === 'string') {
            config.area = config.area === 'auto' ? ['', ''] : [config.area, ''];
        }

        if (config.shift) {
            config.anim = config.shift;
        }

        if (layer.ie === 6) {
            config.fixed = false;
        }

        switch (config.type) {
            case 0:
                config.btn = 'btn' in config ? config.btn : _ready.btn[0];
                layer.closeAll('dialog');
                break;
            case 2:
                config.content = conType ? config.content : [config.content || 'http://layer.layui.com', 'auto'];
                config.content = '<iframe scrolling="' + (config.content[1] || 'auto') + '" allowtransparency="true" id="' + doms[4] + '' + times + '" name="' + doms[4] + '' + times + '" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="' + config.content[0] + '"></iframe>';
                break;
            case 3:
                delete config.title;
                delete config.closeBtn;
                layer.closeAll('loading');
                break;
            case 4:
                conType || (config.content = [config.content, 'body']);
                config.follow = config.content[1];
                config.content = config.content[0] + '<i class="layui-layer-TipsG"></i>';
                delete config.title;
                config.tips = _typeof(config.tips) === 'object' ? config.tips : [config.tips, true];
                config.tipsMore || layer.closeAll('tips');
                break;
        }

        this.vessel(conType, function (html, titleHTML, moveElem) {
            body.append(html[0]);

            if (conType) {
                if (config.type === 2 || config.type === 4) {
                    $('body').append(html[1]);
                } else {
                    if (!content.parents('.' + doms[0])[0]) {
                        content.data('display', content.css('display')).show().addClass('layui-layer-wrap').wrap(html[1]);
                        $('#' + doms[0] + times).find('.' + doms[5]).before(titleHTML);
                    }
                }
            } else {
                body.append(html[1]);
            }
            $('.layui-layer-move')[0] || body.append(_ready.moveElem = moveElem);
            cache.layero = that.layero = $('#' + doms[0] + times);
            config.scrollbar || doms.html.css('overflow', 'hidden').attr('layer-full', times);
        }).auto(times);

        $('#layui-layer-shade' + that.index).css({
            'background-color': config.shade[1] || '#000',
            opacity: config.shade[0] || config.shade
        });

        config.type === 2 && layer.ie === 6 && that.layero.find('iframe').attr('src', content[0]);

        config.type === 4 ? that.tips() : that.offset();

        if (config.fixed) {
            cache.resize = function () {
                _this2.offset();
                if (/^\d+%$/.test(config.area[0]) || /^\d+%$/.test(config.area[1])) {
                    _this2.auto(times);
                }
                config.type === 4 && _this2.tips();
            };
            $win.on('resize', cache.resize);
        }

        config.time <= 0 || setTimeout(function () {
            layer.close(_this2.index);
        }, config.time);
        this.move().callback();

        if (doms.anim[config.anim]) {
            var animClass = 'layer-anim ' + doms.anim[config.anim];
            this.layero.addClass(animClass).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass(animClass);
            });
        }

        if (config.isOutAnim) {
            this.layero.data('isOutAnim', true);
        }
    };

    Layer.pt.auto = function (index) {
        var that = this,
            config = that.config,
            layero = $('#' + doms[0] + index);

        if (config.area[0] === '' && config.maxWidth > 0) {
            if (layer.ie && layer.ie < 8 && config.btn) {
                layero.width(layero.innerWidth());
            }
            layero.outerWidth() > config.maxWidth && layero.width(config.maxWidth);
        }

        var area = [layero.innerWidth(), layero.innerHeight()],
            titHeight = layero.find(doms[1]).outerHeight() || 0,
            btnHeight = layero.find('.' + doms[6]).outerHeight() || 0,
            setHeight = function setHeight(elem) {
            elem = layero.find(elem);
            elem.height(area[1] - titHeight - btnHeight - 2 * (parseFloat(elem.css('padding-top')) | 0));
        };

        switch (config.type) {
            case 2:
                setHeight('iframe');
                break;
            default:
                if (config.area[1] === '') {
                    if (config.maxHeight > 0 && layero.outerHeight() > config.maxHeight) {
                        area[1] = config.maxHeight;
                        setHeight('.' + doms[5]);
                    } else if (config.fixed && area[1] >= $win.height()) {
                        area[1] = $win.height();
                        setHeight('.' + doms[5]);
                    }
                } else {
                    setHeight('.' + doms[5]);
                }
                break;
        }

        return that;
    };

    Layer.pt.offset = function () {
        var that = this,
            config = that.config,
            layero = that.layero;
        var area = [layero.outerWidth(), layero.outerHeight()];
        var type = _typeof(config.offset) === 'object';
        that.offsetTop = ($win.height() - area[1]) / 2;
        that.offsetLeft = ($win.width() - area[0]) / 2;

        if (type) {
            that.offsetTop = config.offset[0];
            that.offsetLeft = config.offset[1] || that.offsetLeft;
        } else if (config.offset !== 'auto') {
            if (config.offset === 't') {
                that.offsetTop = 0;
            } else if (config.offset === 'r') {
                that.offsetLeft = $win.width() - area[0];
            } else if (config.offset === 'b') {
                that.offsetTop = $win.height() - area[1];
            } else if (config.offset === 'l') {
                that.offsetLeft = 0;
            } else if (config.offset === 'lt') {
                that.offsetTop = 0;
                that.offsetLeft = 0;
            } else if (config.offset === 'lb') {
                that.offsetTop = $win.height() - area[1];
                that.offsetLeft = 0;
            } else if (config.offset === 'rt') {
                that.offsetTop = 0;
                that.offsetLeft = $win.width() - area[0];
            } else if (config.offset === 'rb') {
                that.offsetTop = $win.height() - area[1];
                that.offsetLeft = $win.width() - area[0];
            } else {
                that.offsetTop = config.offset;
            }
        }

        if (!config.fixed) {
            that.offsetTop = /%$/.test(that.offsetTop) ? $win.height() * parseFloat(that.offsetTop) / 100 : parseFloat(that.offsetTop);
            that.offsetLeft = /%$/.test(that.offsetLeft) ? $win.width() * parseFloat(that.offsetLeft) / 100 : parseFloat(that.offsetLeft);
            that.offsetTop += $win.scrollTop();
            that.offsetLeft += $win.scrollLeft();
        }

        if (layero.attr('minLeft')) {
            that.offsetTop = $win.height() - (layero.find(doms[1]).outerHeight() || 0);
            that.offsetLeft = layero.css('left');
        }

        layero.css({ top: that.offsetTop, left: that.offsetLeft });
    };

    Layer.pt.tips = function () {
        var that = this,
            config = that.config,
            layero = that.layero;
        var layArea = [layero.outerWidth(), layero.outerHeight()],
            follow = $(config.follow);
        if (!follow[0]) follow = $('body');
        var goal = {
            width: follow.outerWidth(),
            height: follow.outerHeight(),
            top: follow.offset().top,
            left: follow.offset().left
        },
            tipsG = layero.find('.layui-layer-TipsG');

        var guide = config.tips[0];
        config.tips[1] || tipsG.remove();

        goal.autoLeft = function () {
            if (goal.left + layArea[0] - $win.width() > 0) {
                goal.tipLeft = goal.left + goal.width - layArea[0];
                tipsG.css({ right: 12, left: 'auto' });
            } else {
                goal.tipLeft = goal.left;
            }
        };

        goal.where = [function () {
            goal.autoLeft();
            goal.tipTop = goal.top - layArea[1] - 10;
            tipsG.removeClass('layui-layer-TipsB').addClass('layui-layer-TipsT').css('border-right-color', config.tips[1]);
        }, function () {
            goal.tipLeft = goal.left + goal.width + 10;
            goal.tipTop = goal.top;
            tipsG.removeClass('layui-layer-TipsL').addClass('layui-layer-TipsR').css('border-bottom-color', config.tips[1]);
        }, function () {
            goal.autoLeft();
            goal.tipTop = goal.top + goal.height + 10;
            tipsG.removeClass('layui-layer-TipsT').addClass('layui-layer-TipsB').css('border-right-color', config.tips[1]);
        }, function () {
            goal.tipLeft = goal.left - layArea[0] - 10;
            goal.tipTop = goal.top;
            tipsG.removeClass('layui-layer-TipsR').addClass('layui-layer-TipsL').css('border-bottom-color', config.tips[1]);
        }];
        goal.where[guide - 1]();

        if (guide === 1) {
            goal.top - ($win.scrollTop() + layArea[1] + 8 * 2) < 0 && goal.where[2]();
        } else if (guide === 2) {
            $win.width() - (goal.left + goal.width + layArea[0] + 8 * 2) > 0 || goal.where[3]();
        } else if (guide === 3) {
            goal.top - $win.scrollTop() + goal.height + layArea[1] + 8 * 2 - $win.height() > 0 && goal.where[0]();
        } else if (guide === 4) {
            layArea[0] + 8 * 2 - goal.left > 0 && goal.where[1]();
        }

        layero.find('.' + doms[5]).css({
            'background-color': config.tips[1],
            'padding-right': config.closeBtn ? '30px' : ''
        });
        layero.css({
            left: goal.tipLeft - (config.fixed ? $win.scrollLeft() : 0),
            top: goal.tipTop - (config.fixed ? $win.scrollTop() : 0)
        });
    };

    Layer.pt.move = function () {
        var that = this,
            config = that.config,
            layero = that.layero,
            moveElem = layero.find(config.move),
            resizeElem = layero.find('.layui-layer-resize'),
            dict = {},
            cache = globalCache[that.index];

        if (config.move) {
            moveElem.css('cursor', 'move');
        }

        moveElem.on('mousedown', function (e) {
            e.preventDefault();
            if (config.move) {
                dict.moveStart = true;
                dict.offset = [e.clientX - parseFloat(layero.css('left')), e.clientY - parseFloat(layero.css('top'))];
                _ready.moveElem.css('cursor', 'move').show();
            }
        });

        resizeElem.on('mousedown', function (e) {
            e.preventDefault();
            dict.resizeStart = true;
            dict.offset = [e.clientX, e.clientY];
            dict.area = [layero.outerWidth(), layero.outerHeight()];
            _ready.moveElem.css('cursor', 'se-resize').show();
        });

        cache.docMousemove = function (e) {
            if (dict.moveStart) {
                var X = e.clientX - dict.offset[0],
                    Y = e.clientY - dict.offset[1],
                    fixed = layero.css('position') === 'fixed';

                e.preventDefault();

                dict.stX = fixed ? 0 : $win.scrollLeft();
                dict.stY = fixed ? 0 : $win.scrollTop();

                if (!config.moveOut) {
                    var setRig = $win.width() - layero.outerWidth() + dict.stX,
                        setBot = $win.height() - layero.outerHeight() + dict.stY;
                    X < dict.stX && (X = dict.stX);
                    X > setRig && (X = setRig);
                    Y < dict.stY && (Y = dict.stY);
                    Y > setBot && (Y = setBot);
                }

                layero.css({
                    left: X,
                    top: Y
                });
            }

            if (config.resize && dict.resizeStart) {
                var _X = e.clientX - dict.offset[0],
                    _Y = e.clientY - dict.offset[1];

                e.preventDefault();

                layer.style(that.index, {
                    width: dict.area[0] + _X,
                    height: dict.area[1] + _Y
                });
                dict.isResize = true;
                config.resizing && config.resizing(layero);
            }
        };
        cache.docMouseup = function () {
            if (dict.moveStart) {
                delete dict.moveStart;
                _ready.moveElem.hide();
                config.moveEnd && config.moveEnd(layero);
            }
            if (dict.resizeStart) {
                delete dict.resizeStart;
                _ready.moveElem.hide();
            }
        };

        _DOC.on('mousemove', cache.docMousemove).on('mouseup', cache.docMouseup);

        return that;
    };

    Layer.pt.callback = function () {
        var that = this,
            layero = that.layero,
            config = that.config;
        that.openLayer();
        if (config.success) {
            if (config.type === 2) {
                layero.find('iframe').on('load', function () {
                    config.success(layero, that.index);
                });
            } else {
                config.success(layero, that.index);
            }
        }
        layer.ie === 6 && that.IE6(layero);

        layero.find('.' + doms[6]).children('a').on('click', function () {
            var index = $(this).index();
            if (index === 0) {
                if (config.yes) {
                    config.yes(that.index, layero);
                } else if (config['btn1']) {
                    config['btn1'](that.index, layero);
                } else {
                    layer.close(that.index);
                }
            } else {
                var close = config['btn' + (index + 1)] && config['btn' + (index + 1)](that.index, layero);
                close === false || layer.close(that.index);
            }
        });

        function cancel() {
            var close = config.cancel && config.cancel(that.index, layero);
            close === false || layer.close(that.index);
        }

        layero.find('.' + doms[7]).on('click', cancel);

        if (config.shadeClose) {
            $('#layui-layer-shade' + that.index).on('click', function () {
                layer.close(that.index);
            });
        }

        layero.find('.layui-layer-min').on('click', function () {
            var min = config.min && config.min(layero);
            min === false || layer.min(that.index, config);
        });

        layero.find('.layui-layer-max').on('click', function () {
            if ($(this).hasClass('layui-layer-maxmin')) {
                layer.restore(that.index);
                config.restore && config.restore(layero);
            } else {
                layer.full(that.index, config);
                setTimeout(function () {
                    config.full && config.full(layero);
                }, 100);
            }
        });

        config.end && (_ready.end[that.index] = config.end);
    };

    _ready.reselect = function () {
        $.each($('select'), function () {
            var sthis = $(this);
            if (!sthis.parents('.' + doms[0])[0]) {
                sthis.attr('layer') == 1 && $('.' + doms[0]).length < 1 && sthis.removeAttr('layer').show();
            }
            sthis = null;
        });
    };

    Layer.pt.IE6 = function () {
        $('select').each(function () {
            var sthis = $(this);
            if (!sthis.parents('.' + doms[0])[0]) {
                sthis.css('display') === 'none' || sthis.attr({ layer: '1' }).hide();
            }
            sthis = null;
        });
    };

    Layer.pt.openLayer = function () {
        var that = this;

        layer.zIndex = that.config.zIndex;
        layer.setTop = function (layero) {
            var setZindex = function setZindex() {
                layer.zIndex++;
                layero.css('z-index', layer.zIndex + 1);
            };
            layer.zIndex = parseInt(layero[0].style.zIndex);
            layero.on('mousedown', setZindex);
            return layer.zIndex;
        };
    };

    _ready.record = function (layero) {
        var area = [layero.width(), layero.height(), layero.position().top, layero.position().left + parseFloat(layero.css('margin-left'))];
        layero.find('.layui-layer-max').addClass('layui-layer-maxmin');
        layero.attr({ area: area });
    };

    _ready.rescollbar = function (index) {
        if (doms.html.attr('layer-full') == index) {
            if (doms.html[0].style.removeProperty) {
                doms.html[0].style.removeProperty('overflow');
            } else {
                doms.html[0].style.removeAttribute('overflow');
            }
            doms.html.removeAttr('layer-full');
        }
    };

    window.layer = layer;

    layer.getChildFrame = function (selector, index) {
        index = index || $('.' + doms[4]).attr('times');
        return $('#' + doms[0] + index).find('iframe').contents().find(selector);
    };

    layer.getFrameIndex = function (name) {
        return $('#' + name).parents('.' + doms[4]).attr('times');
    };

    layer.iframeAuto = function (index) {
        if (!index) return;
        var heg = layer.getChildFrame('html', index).outerHeight();
        var layero = $('#' + doms[0] + index);
        var titHeight = layero.find(doms[1]).outerHeight() || 0;
        var btnHeight = layero.find('.' + doms[6]).outerHeight() || 0;
        layero.css({ height: heg + titHeight + btnHeight });
        layero.find('iframe').css({ height: heg });
    };

    layer.iframeSrc = function (index, url) {
        $('#' + doms[0] + index).find('iframe').attr('src', url);
    };

    layer.style = function (index, options, limit) {
        var layero = $('#' + doms[0] + index),
            contElem = layero.find('.layui-layer-content'),
            type = layero.attr('type'),
            titHeight = layero.find(doms[1]).outerHeight() || 0,
            btnHeight = layero.find('.' + doms[6]).outerHeight() || 0;

        if (type === _ready.type[3] || type === _ready.type[4]) {
            return;
        }

        if (!limit) {
            if (parseFloat(options.width) <= 260) {
                options.width = 260;
            }

            if (parseFloat(options.height) - titHeight - btnHeight <= 64) {
                options.height = 64 + titHeight + btnHeight;
            }
        }

        layero.css(options);
        btnHeight = layero.find('.' + doms[6]).outerHeight();

        if (type === _ready.type[2]) {
            layero.find('iframe').css({
                height: parseFloat(options.height) - titHeight - btnHeight
            });
        } else {
            contElem.css({
                height: parseFloat(options.height) - titHeight - btnHeight - parseFloat(contElem.css('padding-top')) - parseFloat(contElem.css('padding-bottom'))
            });
        }
    };

    layer.min = function (index) {
        var layero = $('#' + doms[0] + index),
            titHeight = layero.find(doms[1]).outerHeight() || 0,
            left = layero.attr('minLeft') || 181 * _ready.minIndex + 'px',
            position = layero.css('position');

        _ready.record(layero);

        if (_ready.minLeft[0]) {
            left = _ready.minLeft[0];
            _ready.minLeft.shift();
        }

        layero.attr('position', position);

        layer.style(index, {
            width: 180,
            height: titHeight,
            left: left,
            top: $win.height() - titHeight,
            position: 'fixed',
            overflow: 'hidden'
        }, true);

        layero.find('.layui-layer-min').hide();
        layero.attr('type') === 'page' && layero.find(doms[4]).hide();
        _ready.rescollbar(index);

        if (!layero.attr('minLeft')) {
            _ready.minIndex++;
        }
        layero.attr('minLeft', left);
    };

    layer.restore = function (index) {
        var layero = $('#' + doms[0] + index),
            area = layero.attr('area').split(',');
        layer.style(index, {
            width: parseFloat(area[0]),
            height: parseFloat(area[1]),
            top: parseFloat(area[2]),
            left: parseFloat(area[3]),
            position: layero.attr('position'),
            overflow: 'visible'
        }, true);
        layero.find('.layui-layer-max').removeClass('layui-layer-maxmin');
        layero.find('.layui-layer-min').show();
        layero.attr('type') === 'page' && layero.find(doms[4]).show();
        _ready.rescollbar(index);
    };

    layer.full = function (index) {
        var layero = $('#' + doms[0] + index);
        _ready.record(layero);
        if (!doms.html.attr('layer-full')) {
            doms.html.css('overflow', 'hidden').attr('layer-full', index);
        }
        setTimeout(function () {
            var isfix = layero.css('position') === 'fixed';
            layer.style(index, {
                top: isfix ? 0 : $win.scrollTop(),
                left: isfix ? 0 : $win.scrollLeft(),
                width: $win.width(),
                height: $win.height()
            }, true);
            layero.find('.layui-layer-min').hide();
        }, 100);
    };

    layer.title = function (name, index) {
        var title = $('#' + doms[0] + (index || layer.index)).find(doms[1]);
        title.html(name);
    };

    function clearCache(index) {
        var cache = globalCache[index];

        if (!cache) {
            return;
        }

        var layero = cache.layero;
        var config = cache.config;

        if (cache.resize) {
            $win.off('resize', cache.resize);
        }

        layero.off('mousedown').find('.' + doms[6]).children('a').off('click');

        layero.find('.layui-layer-resize').off('mousedown');
        layero.find(config.move).off('mousedown');
        layero.find('.layui-layer-title').children().off('mousedown');

        layero.find('.' + doms[7]).off('click');

        $('#layui-layer-shade' + index).off('click');

        layero.find('.layui-layer-min').off('click');

        layero.find('.layui-layer-max').off('click');

        _DOC.off('mousemove', cache.docMousemove).off('mouseup', cache.docMouseup);

        globalCache[index] = cache = null;
    }

    layer.close = function (index) {
        var layero = $('#' + doms[0] + index),
            type = layero.attr('type'),
            closeAnim = 'layer-anim-close';
        if (!layero[0]) return;

        clearCache(index);

        var WRAP = 'layui-layer-wrap',
            remove = function remove() {
            if (type === _ready.type[1] && layero.attr('conType') === 'object') {
                layero.children(':not(.' + doms[5] + ')').remove();
                var wrap = layero.find('.' + WRAP);
                for (var i = 0; i < 2; i++) {
                    wrap.unwrap();
                }
                wrap.css('display', wrap.data('display')).removeClass(WRAP);
            } else {
                if (type === _ready.type[2]) {
                    try {
                        var iframe = $('#' + doms[4] + index)[0];
                        iframe.contentWindow.document.write('');
                        iframe.contentWindow.close();
                        layero.find('.' + doms[5])[0].removeChild(iframe);
                    } catch (e) {
                        window.console && window.console.log(e);
                    }
                }
                layero[0].innerHTML = '';
                layero.remove();
            }
            typeof _ready.end[index] === 'function' && _ready.end[index]();
            delete _ready.end[index];
        };

        if (layero.data('isOutAnim')) {
            layero.addClass('layer-anim ' + closeAnim);
        }

        $('#layui-layer-moves, #layui-layer-shade' + index).remove();
        layer.ie === 6 && _ready.reselect();
        _ready.rescollbar(index);
        if (layero.attr('minLeft')) {
            _ready.minIndex--;
            _ready.minLeft.push(layero.attr('minLeft'));
        }

        if (layer.ie && layer.ie < 10 || !layero.data('isOutAnim')) {
            remove();
        } else {
            setTimeout(function () {
                remove();
            }, 200);
        }
    };

    layer.closeAll = function (type) {
        $.each($('.' + doms[0]), function () {
            var othis = $(this);
            var is = type ? othis.attr('type') === type : 1;
            is && layer.close(othis.attr('times'));
            is = null;
        });
    };

    var cache = layer.cache || {},
        skin = function skin(type) {
        return cache.skin ? ' ' + cache.skin + ' ' + cache.skin + '-' + type : '';
    };

    layer.prompt = function (options, _yes) {
        var style = '';
        options = options || {};

        if (typeof options === 'function') _yes = options;

        if (options.area) {
            var area = options.area;
            style = 'style="width: ' + area[0] + '; height: ' + area[1] + ';"';
            delete options.area;
        }
        var prompt = void 0,
            content = void 0;

        if (options.formType === 2) {
            content = '<textarea class="layui-layer-input"' + style + '>' + (options.value || '') + '</textarea>';
        } else {
            content = '<input type="' + (options.formType === 1 ? 'password' : 'text') + '" class="layui-layer-input" value="' + (options.value || '') + '">';
        }

        var _success = options.success;
        delete options.success;

        return layer.open($.extend({
            type: 1,
            btn: ['&#x786E;&#x5B9A;', '&#x53D6;&#x6D88;'],
            content: content,
            skin: 'layui-layer-prompt' + skin('prompt'),
            maxWidth: $win.width(),
            success: function success(layero) {
                prompt = layero.find('.layui-layer-input');
                prompt.focus();
                typeof _success === 'function' && _success(layero);
            },
            resize: false,
            yes: function yes(index) {
                var value = prompt.val();
                if (value === '') {
                    prompt.focus();
                } else if (value.length > (options.maxlength || 500)) {
                    layer.tips('&#x6700;&#x591A;&#x8F93;&#x5165;' + (options.maxlength || 500) + '&#x4E2A;&#x5B57;&#x6570;', prompt, { tips: 1 });
                } else {
                    _yes && _yes(value, index, prompt);
                }
            }
        }, options));
    };

    layer.tab = function (options) {
        options = options || {};

        var tab = options.tab || {},
            THIS = 'layui-this',
            _success2 = options.success;

        delete options.success;

        return layer.open($.extend({
            type: 1,
            skin: 'layui-layer-tab' + skin('tab'),
            resize: false,
            title: function () {
                var len = tab.length,
                    ii = 1,
                    str = '';
                if (len > 0) {
                    str = '<span class="' + THIS + '">' + tab[0].title + '</span>';
                    for (; ii < len; ii++) {
                        str += '<span>' + tab[ii].title + '</span>';
                    }
                }
                return str;
            }(),
            content: '<ul class="layui-layer-tabmain">' + function () {
                var len = tab.length,
                    ii = 1,
                    str = '';
                if (len > 0) {
                    str = '<li class="layui-layer-tabli ' + THIS + '">' + (tab[0].content || 'no content') + '</li>';
                    for (; ii < len; ii++) {
                        str += '<li class="layui-layer-tabli">' + (tab[ii].content || 'no  content') + '</li>';
                    }
                }
                return str;
            }() + '</ul>',
            success: function success(layero) {
                var btn = layero.find('.layui-layer-title').children();
                var main = layero.find('.layui-layer-tabmain').children();
                btn.off('mousedown').on('mousedown', function (e) {
                    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                    var othis = $(this),
                        index = othis.index();
                    othis.addClass(THIS).siblings().removeClass(THIS);
                    main.eq(index).show().siblings().hide();
                    typeof options.change === 'function' && options.change(index);
                });
                typeof _success2 === 'function' && _success2(layero);
            }
        }, options));
    };

    layer.photos = function (options, loop, key) {
        var dict = {};
        options = options || {};
        if (!options.photos) return;
        var type = options.photos.constructor === Object;
        var photos = type ? options.photos : {},
            data = photos.data || [];
        var start = photos.start || 0;
        dict.imgIndex = (start | 0) + 1;

        options.img = options.img || 'img';

        var _success3 = options.success;
        delete options.success;

        if (!type) {
            var parent = $(options.photos),
                pushData = function pushData() {
                data = [];
                parent.find(options.img).each(function (index) {
                    var othis = $(this);
                    othis.attr('layer-index', index);
                    data.push({
                        alt: othis.attr('alt'),
                        pid: othis.attr('layer-pid'),
                        src: othis.attr('layer-src') || othis.attr('src'),
                        thumb: othis.attr('src')
                    });
                });
            };

            pushData();

            if (data.length === 0) return;

            loop || parent.on('click', options.img, function () {
                var othis = $(this),
                    index = othis.attr('layer-index');
                layer.photos($.extend(options, {
                    photos: {
                        start: index,
                        data: data,
                        tab: options.tab
                    },
                    full: options.full
                }), true);
                pushData();
            });

            if (!loop) return;
        } else if (data.length === 0) {
            return layer.msg('&#x6CA1;&#x6709;&#x56FE;&#x7247;');
        }

        dict.imgprev = function (key) {
            dict.imgIndex--;
            if (dict.imgIndex < 1) {
                dict.imgIndex = data.length;
            }
            dict.tabimg(key);
        };

        dict.imgnext = function (key, errorMsg) {
            dict.imgIndex++;
            if (dict.imgIndex > data.length) {
                dict.imgIndex = 1;
                if (errorMsg) {
                    return;
                }
            }
            dict.tabimg(key);
        };

        dict.keyup = function (event) {
            if (!dict.end) {
                var code = event.keyCode;
                event.preventDefault();
                if (code === 37) {
                    dict.imgprev(true);
                } else if (code === 39) {
                    dict.imgnext(true);
                } else if (code === 27) {
                    layer.close(dict.index);
                }
            }
        };

        dict.tabimg = function (key) {
            if (data.length <= 1) return;
            photos.start = dict.imgIndex - 1;
            layer.close(dict.index);
            return layer.photos(options, true, key);
        };

        dict.event = function () {
            dict.bigimg.hover(function () {
                dict.imgsee.show();
            }, function () {
                dict.imgsee.hide();
            });

            dict.bigimg.find('.layui-layer-imgprev').on('click', function (event) {
                event.preventDefault();
                dict.imgprev();
            });

            dict.bigimg.find('.layui-layer-imgnext').on('click', function (event) {
                event.preventDefault();
                dict.imgnext();
            });

            $(document).on('keyup', dict.keyup);
        };

        function loadImage(url, callback, error) {
            var img = new Image();
            img.src = url;
            if (img.complete) {
                return callback(img);
            }
            img.onload = function () {
                img.onload = null;
                callback(img);
            };
            img.onerror = function (e) {
                img.onerror = null;
                error(e);
            };
        }

        dict.loadi = layer.load(1, {
            shade: 'shade' in options ? false : 0.9,
            scrollbar: false
        });

        loadImage(data[start].src, function (img) {
            layer.close(dict.loadi);
            dict.index = layer.open($.extend({
                type: 1,
                id: 'layui-layer-photos',
                area: function () {
                    var imgarea = [img.width, img.height];
                    var winarea = [$win.width() - 100, $win.height() - 100];

                    if (!options.full && (imgarea[0] > winarea[0] || imgarea[1] > winarea[1])) {
                        var wh = [imgarea[0] / winarea[0], imgarea[1] / winarea[1]];
                        if (wh[0] > wh[1]) {
                            imgarea[0] = imgarea[0] / wh[0];
                            imgarea[1] = imgarea[1] / wh[0];
                        } else if (wh[0] < wh[1]) {
                            imgarea[0] = imgarea[0] / wh[1];
                            imgarea[1] = imgarea[1] / wh[1];
                        }
                    }

                    return [imgarea[0] + 'px', imgarea[1] + 'px'];
                }(),
                title: false,
                shade: 0.9,
                shadeClose: true,
                closeBtn: false,
                move: '.layui-layer-phimg img',
                moveType: 1,
                scrollbar: false,
                moveOut: true,

                isOutAnim: false,
                skin: 'layui-layer-photos' + skin('photos'),
                content: '<div class="layui-layer-phimg">' + '<img src="' + data[start].src + '" alt="' + (data[start].alt || '') + '" layer-pid="' + data[start].pid + '">' + '<div class="layui-layer-imgsee">' + (data.length > 1 ? '<span class="layui-layer-imguide"><a href="javascript:;" class="layui-layer-iconext layui-layer-imgprev"></a><a href="javascript:;" class="layui-layer-iconext layui-layer-imgnext"></a></span>' : '') + '<div class="layui-layer-imgbar" style="display:' + (key ? 'block' : '') + '"><span class="layui-layer-imgtit"><a href="javascript:;">' + (data[start].alt || '') + '</a><em>' + dict.imgIndex + '/' + data.length + '</em></span></div>' + '</div>' + '</div>',
                success: function success(layero) {
                    dict.bigimg = layero.find('.layui-layer-phimg');
                    dict.imgsee = layero.find('.layui-layer-imguide,.layui-layer-imgbar');
                    dict.event(layero);
                    options.tab && options.tab(data[start], layero);
                    typeof _success3 === 'function' && _success3(layero);
                },
                end: function end() {
                    dict.end = true;
                    $(document).off('keyup', dict.keyup);
                }
            }, options));
        }, function () {
            layer.close(dict.loadi);
            layer.msg('&#x5F53;&#x524D;&#x56FE;&#x7247;&#x5730;&#x5740;&#x5F02;&#x5E38;<br>&#x662F;&#x5426;&#x7EE7;&#x7EED;&#x67E5;&#x770B;&#x4E0B;&#x4E00;&#x5F20;&#xFF1F;', {
                time: 30000,
                btn: ['&#x4E0B;&#x4E00;&#x5F20;', '&#x4E0D;&#x770B;&#x4E86;'],
                yes: function yes() {
                    data.length > 1 && dict.imgnext(true, true);
                }
            });
        });
    };

    _ready.run = function (_$) {
        $ = _$;
        $win = $(window);
        _DOC = $(document);
        doms.html = $('html');
        layer.open = function (deliver) {
            var o = new Layer(deliver);
            return o.index;
        };
    };

    if (window.layui && layui.define) {
        layer.ready();
        layui.define('jquery', function (exports) {
            layer.path = layui.cache.dir;
            _ready.run(layui.$);

            window.layer = layer;
            exports('layer', layer);
        });
    } else {
        if (typeof define === 'function' && define.amd) {
            define(['jquery'], function () {
                _ready.run(window.jQuery);
                return layer;
            });
        } else {
            _ready.run(window.jQuery);
            layer.ready();
        }
    }
}(window);

layui.define('jquery', function (exports) {
    'use strict';

    var $ = layui.$,
        device = layui.device(),
        MOD_NAME = 'element',
        THIS = 'layui-this',
        SHOW = 'layui-show',
        Element = function Element() {
        this.config = {};
    };

    Element.prototype.set = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    };

    Element.prototype.on = function (events, callback) {
        return layui.onevent.call(this, MOD_NAME, events, callback);
    };

    Element.prototype.tabAdd = function (filter, options) {
        var TITLE = '.layui-tab-title',
            tabElem = $('.layui-tab[lay-filter=' + filter + ']'),
            titElem = tabElem.children(TITLE),
            barElem = titElem.children('.layui-tab-bar'),
            contElem = tabElem.children('.layui-tab-content'),
            li = '<li lay-id="' + (options.id || '') + '">' + (options.title || 'unnaming') + '</li>';

        barElem[0] ? barElem.before(li) : titElem.append(li);
        contElem.append('<div class="layui-tab-item">' + (options.content || '') + '</div>');
        call.hideTabMore(true);
        call.tabAuto();
        return this;
    };

    Element.prototype.tabDelete = function (filter, layid) {
        var TITLE = '.layui-tab-title',
            tabElem = $('.layui-tab[lay-filter=' + filter + ']'),
            titElem = tabElem.children(TITLE),
            liElem = titElem.find('>li[lay-id="' + layid + '"]');
        call.tabDelete(null, liElem);
        return this;
    };

    Element.prototype.tabChange = function (filter, layid) {
        var TITLE = '.layui-tab-title',
            tabElem = $('.layui-tab[lay-filter=' + filter + ']'),
            titElem = tabElem.children(TITLE),
            liElem = titElem.find('>li[lay-id="' + layid + '"]');
        call.tabClick.call(liElem[0], null, null, liElem);
        return this;
    };

    Element.prototype.tab = function (options) {
        options = options || {};
        dom.on('click', options.headerElem, function (e) {
            var index = $(this).index();
            call.tabClick.call(this, e, index, null, options);
        });
    };

    Element.prototype.progress = function (filter, percent) {
        var ELEM = 'layui-progress',
            elem = $('.' + ELEM + '[lay-filter=' + filter + ']'),
            elemBar = elem.find('.' + ELEM + '-bar'),
            text = elemBar.find('.' + ELEM + '-text');
        elemBar.css('width', percent);
        text.text(percent);
        return this;
    };

    var NAV_ELEM = '.layui-nav',
        NAV_ITEM = 'layui-nav-item',
        NAV_BAR = 'layui-nav-bar',
        NAV_TREE = 'layui-nav-tree',
        NAV_CHILD = 'layui-nav-child',
        NAV_MORE = 'layui-nav-more',
        NAV_ANIM = 'layui-anim layui-anim-upbit',
        call = {
        tabClick: function tabClick(e, index, liElem, options) {
            options = options || {};
            var othis = liElem || $(this),
                parents = options.headerElem ? othis.parent() : othis.parents('.layui-tab').eq(0),
                item = options.bodyElem ? $(options.bodyElem) : parents.children('.layui-tab-content').children('.layui-tab-item'),
                elemA = othis.find('a'),
                filter = parents.attr('lay-filter');

            index = index || othis.parent().children('li').index(othis);

            if (!(elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank')) {
                othis.addClass(THIS).siblings().removeClass(THIS);
                item.eq(index).addClass(SHOW).siblings().removeClass(SHOW);
            }

            layui.event.call(this, MOD_NAME, 'tab(' + filter + ')', {
                elem: parents,
                index: index
            });
        },

        tabDelete: function tabDelete(e, othis) {
            var li = othis || $(this).parent(),
                index = li.index(),
                parents = li.parents('.layui-tab').eq(0),
                item = parents.children('.layui-tab-content').children('.layui-tab-item'),
                filter = parents.attr('lay-filter');

            if (li.hasClass(THIS)) {
                if (li.next()[0]) {
                    call.tabClick.call(li.next()[0], null, index + 1);
                } else if (li.prev()[0]) {
                    call.tabClick.call(li.prev()[0], null, index - 1);
                }
            }

            li.remove();
            item.eq(index).remove();
            setTimeout(function () {
                call.tabAuto();
            }, 50);

            layui.event.call(this, MOD_NAME, 'tabDelete(' + filter + ')', {
                elem: parents,
                index: index
            });
        },

        tabAuto: function tabAuto() {
            var MORE = 'layui-tab-more',
                BAR = 'layui-tab-bar',
                CLOSE = 'layui-tab-close',
                that = this;

            $('.layui-tab').each(function () {
                var othis = $(this),
                    title = othis.children('.layui-tab-title'),
                    STOPE = 'lay-stope="tabmore"',
                    span = $('<span class="layui-unselect layui-tab-bar" ' + STOPE + '><i ' + STOPE + ' class="layui-icon">&#xe61a;</i></span>');

                if (that === window && device.ie !== 8) {
                    call.hideTabMore(true);
                }

                if (othis.attr('lay-allowClose')) {
                    title.find('li').each(function () {
                        var li = $(this);
                        if (!li.find('.' + CLOSE)[0]) {
                            var close = $('<i class="layui-icon layui-unselect ' + CLOSE + '">&#x1006;</i>');
                            close.on('click', call.tabDelete);
                            li.append(close);
                        }
                    });
                }

                if (title.prop('scrollWidth') > title.outerWidth() + 1) {
                    if (title.find('.' + BAR)[0]) return;
                    title.append(span);
                    othis.attr('overflow', '');
                    span.on('click', function () {
                        title[this.title ? 'removeClass' : 'addClass'](MORE);
                        this.title = this.title ? '' : '收缩';
                    });
                } else {
                    title.find('.' + BAR).remove();
                    othis.removeAttr('overflow');
                }
            });
        },

        hideTabMore: function hideTabMore(e) {
            var tsbTitle = $('.layui-tab-title');
            if (e === true || $(e.target).attr('lay-stope') !== 'tabmore') {
                tsbTitle.removeClass('layui-tab-more');
                tsbTitle.find('.layui-tab-bar').attr('title', '');
            }
        },

        clickThis: function clickThis() {
            var othis = $(this),
                parents = othis.parents(NAV_ELEM),
                filter = parents.attr('lay-filter'),
                elemA = othis.find('a'),
                unselect = typeof othis.attr('lay-unselect') === 'string';

            if (othis.find('.' + NAV_CHILD)[0]) return;

            if (!(elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank') && !unselect) {
                parents.find('.' + THIS).removeClass(THIS);
                othis.addClass(THIS);
            }

            layui.event.call(this, MOD_NAME, 'nav(' + filter + ')', othis);
        },

        clickChild: function clickChild() {
            var othis = $(this),
                parents = othis.parents(NAV_ELEM),
                filter = parents.attr('lay-filter');
            parents.find('.' + THIS).removeClass(THIS);
            othis.addClass(THIS);
            layui.event.call(this, MOD_NAME, 'nav(' + filter + ')', othis);
        },

        showChild: function showChild() {
            var othis = $(this),
                parents = othis.parents(NAV_ELEM);
            var parent = othis.parent(),
                child = othis.siblings('.' + NAV_CHILD);
            if (parents.hasClass(NAV_TREE)) {
                child.removeClass(NAV_ANIM);
                parent[child.css('display') === 'none' ? 'addClass' : 'removeClass'](NAV_ITEM + 'ed');
            }
        },

        collapse: function collapse() {
            var othis = $(this),
                icon = othis.find('.layui-colla-icon'),
                elemCont = othis.siblings('.layui-colla-content'),
                parents = othis.parents('.layui-collapse').eq(0),
                filter = parents.attr('lay-filter'),
                isNone = elemCont.css('display') === 'none';

            if (typeof parents.attr('lay-accordion') === 'string') {
                var show = parents.children('.layui-colla-item').children('.' + SHOW);
                show.siblings('.layui-colla-title').children('.layui-colla-icon').html('&#xe602;');
                show.removeClass(SHOW);
            }
            elemCont[isNone ? 'addClass' : 'removeClass'](SHOW);
            icon.html(isNone ? '&#xe61a;' : '&#xe602;');

            layui.event.call(this, MOD_NAME, 'collapse(' + filter + ')', {
                title: othis,
                content: elemCont,
                show: isNone
            });
        }
    };

    Element.prototype.init = function (type, filter) {
        var elemFilter = filter ? '[lay-filter="' + filter + '"]' : '',
            items = {
            tab: function tab() {
                call.tabAuto.call({});
            },

            nav: function nav() {
                var TIME = 200,
                    timer = {},
                    timerMore = {},
                    timeEnd = {},
                    follow = function follow(bar, nav, index) {
                    var othis = $(this),
                        child = othis.find('.' + NAV_CHILD);

                    if (nav.hasClass(NAV_TREE)) {
                        bar.css({
                            top: othis.position().top,
                            height: othis.children('a').height(),
                            opacity: 1
                        });
                    } else {
                        child.addClass(NAV_ANIM);
                        bar.css({
                            left: othis.position().left + parseFloat(othis.css('marginLeft')),
                            top: othis.position().top + othis.height() - bar.height()
                        });

                        timer[index] = setTimeout(function () {
                            bar.css({
                                width: othis.width(),
                                opacity: 1
                            });
                        }, device.ie && device.ie < 10 ? 0 : TIME);

                        clearTimeout(timeEnd[index]);
                        if (child.css('display') === 'block') {
                            clearTimeout(timerMore[index]);
                        }
                        timerMore[index] = setTimeout(function () {
                            child.addClass(SHOW);
                            othis.find('.' + NAV_MORE).addClass(NAV_MORE + 'd');
                        }, 300);
                    }
                };

                $(NAV_ELEM + elemFilter).each(function (index) {
                    var othis = $(this),
                        bar = $('<span class="' + NAV_BAR + '"></span>'),
                        itemElem = othis.find('.' + NAV_ITEM);

                    if (!othis.find('.' + NAV_BAR)[0]) {
                        othis.append(bar);
                        itemElem.on('mouseenter', function () {
                            follow.call(this, bar, othis, index);
                        }).on('mouseleave', function () {
                            if (!othis.hasClass(NAV_TREE)) {
                                clearTimeout(timerMore[index]);
                                timerMore[index] = setTimeout(function () {
                                    othis.find('.' + NAV_CHILD).removeClass(SHOW);
                                    othis.find('.' + NAV_MORE).removeClass(NAV_MORE + 'd');
                                }, 300);
                            }
                        });
                        othis.on('mouseleave', function () {
                            clearTimeout(timer[index]);
                            timeEnd[index] = setTimeout(function () {
                                if (othis.hasClass(NAV_TREE)) {
                                    bar.css({
                                        height: 0,
                                        top: bar.position().top + bar.height() / 2,
                                        opacity: 0
                                    });
                                } else {
                                    bar.css({
                                        width: 0,
                                        left: bar.position().left + bar.width() / 2,
                                        opacity: 0
                                    });
                                }
                            }, TIME);
                        });
                    }

                    itemElem.each(function () {
                        var oitem = $(this),
                            child = oitem.find('.' + NAV_CHILD);

                        if (child[0] && !oitem.find('.' + NAV_MORE)[0]) {
                            var one = oitem.children('a');
                            one.append('<span class="' + NAV_MORE + '"></span>');
                        }

                        oitem.off('click', call.clickThis).on('click', call.clickThis);
                        oitem.children('a').off('click', call.showChild).on('click', call.showChild);
                        child.children('dd').off('click', call.clickChild).on('click', call.clickChild);
                    });
                });
            },

            breadcrumb: function breadcrumb() {
                var ELEM = '.layui-breadcrumb';

                $(ELEM + elemFilter).each(function () {
                    var othis = $(this),
                        ATTE_SPR = 'lay-separator',
                        separator = othis.attr(ATTE_SPR) || '/',
                        aNode = othis.find('a');
                    if (aNode.next('span[' + ATTE_SPR + ']')[0]) return;
                    aNode.each(function (index) {
                        if (index === aNode.length - 1) return;
                        $(this).after('<span ' + ATTE_SPR + '>' + separator + '</span>');
                    });
                    othis.css('visibility', 'visible');
                });
            },

            progress: function progress() {
                var ELEM = 'layui-progress';
                $('.' + ELEM + elemFilter).each(function () {
                    var othis = $(this),
                        elemBar = othis.find('.layui-progress-bar'),
                        percent = elemBar.attr('lay-percent');

                    elemBar.css('width', function () {
                        return (/^.+\/.+$/.test(percent) ? new Function('return ' + percent)() * 100 + '%' : percent
                        );
                    }());

                    if (othis.attr('lay-showPercent')) {
                        setTimeout(function () {
                            elemBar.html('<span class="' + ELEM + '-text">' + percent + '</span>');
                        }, 350);
                    }
                });
            },

            collapse: function collapse() {
                var ELEM = 'layui-collapse';

                $('.' + ELEM + elemFilter).each(function () {
                    var elemItem = $(this).find('.layui-colla-item');
                    elemItem.each(function () {
                        var othis = $(this),
                            elemTitle = othis.find('.layui-colla-title'),
                            elemCont = othis.find('.layui-colla-content'),
                            isNone = elemCont.css('display') === 'none';

                        elemTitle.find('.layui-colla-icon').remove();
                        elemTitle.append('<i class="layui-icon layui-colla-icon">' + (isNone ? '&#xe602;' : '&#xe61a;') + '</i>');

                        elemTitle.off('click', call.collapse).on('click', call.collapse);
                    });
                });
            }
        };

        if (items[type]) {
            return items[type]();
        } else {
            layui.each(items, function (index, item) {
                item();
            });
        }
    };

    Element.prototype.render = Element.prototype.init;

    var element = new Element(),
        dom = $(document);
    element.render();

    var TITLE = '.layui-tab-title li';
    dom.on('click', TITLE, call.tabClick);
    dom.on('click', call.hideTabMore);
    $(window).on('resize', call.tabAuto);

    exports(MOD_NAME, element);
});var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

layui.define('layer', function (exports) {
    'use strict';

    var $ = layui.$,
        layer = layui.layer,
        hint = layui.hint(),
        device = layui.device();

    var upload = {
        config: {},
        set: function set(options) {
            var that = this;
            that.config = $.extend({}, that.config, options);
            return that;
        },

        on: function on(events, callback) {
            return layui.onevent.call(this, MOD_NAME, events, callback);
        }
    };

    var thisUpload = function thisUpload() {
        var that = this;
        return {
            upload: function upload(files) {
                that.upload.call(that, files);
            },
            config: that.config
        };
    },
        MOD_NAME = 'upload',
        ELEM_FILE = 'layui-upload-file',
        ELEM_FORM = 'layui-upload-form',
        ELEM_IFRAME = 'layui-upload-iframe',
        ELEM_CHOOSE = 'layui-upload-choose',
        Class = function Class(options) {
        var that = this;
        that.config = $.extend({}, that.config, upload.config, options);
        that.render();
    };

    Class.prototype.config = {
        accept: 'images',
        exts: '',
        auto: true,
        bindAction: '',
        url: '',
        field: 'file',
        method: 'post',
        data: {},
        drag: true,
        size: 0,
        number: 0,
        multiple: false };

    Class.prototype.render = function () {
        var that = this,
            options = that.config;

        options.elem = $(options.elem);
        options.bindAction = $(options.bindAction);

        that.file();
        that.events();
    };

    Class.prototype.file = function () {
        var that = this,
            options = that.config,
            elemFile = that.elemFile = $(['<input class="' + ELEM_FILE + '" type="file" name="' + options.field + '"', options.multiple ? ' multiple' : '', '>'].join('')),
            next = options.elem.next();

        if (next.hasClass(ELEM_FILE) || next.hasClass(ELEM_FORM)) {
            next.remove();
        }

        if (device.ie && device.ie < 10) {
            options.elem.wrap('<div class="layui-upload-wrap"></div>');
        }

        that.isFile() ? (that.elemFile = options.elem, options.field = options.elem[0].name) : options.elem.after(elemFile);

        if (device.ie && device.ie < 10) {
            that.initIE();
        }
    };

    Class.prototype.initIE = function () {
        var that = this,
            options = that.config,
            iframe = $('<iframe id="' + ELEM_IFRAME + '" class="' + ELEM_IFRAME + '" name="' + ELEM_IFRAME + '" frameborder="0"></iframe>'),
            elemForm = $(['<form target="' + ELEM_IFRAME + '" class="' + ELEM_FORM + '" method="' + options.method, '" key="set-mine" enctype="multipart/form-data" action="' + options.url + '">', '</form>'].join(''));

        $('#' + ELEM_IFRAME)[0] || $('body').append(iframe);

        if (!options.elem.next().hasClass(ELEM_IFRAME)) {
            that.elemFile.wrap(elemForm);

            options.elem.next('.' + ELEM_IFRAME).append(function () {
                var arr = [];
                layui.each(options.data, function (key, value) {
                    arr.push('<input type="hidden" name="' + key + '" value="' + value + '">');
                });
                return arr.join('');
            }());
        }
    };

    Class.prototype.msg = function (content) {
        return layer.msg(content, {
            icon: 2,
            shift: 6
        });
    };

    Class.prototype.isFile = function () {
        var elem = this.config.elem[0];
        if (!elem) return;
        return elem.tagName.toLocaleLowerCase() === 'input' && elem.type === 'file';
    };

    Class.prototype.preview = function (callback) {
        var that = this;
        if (window.FileReader) {
            layui.each(that.chooseFiles, function (index, file) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    callback && callback(index, file, this.result);
                };
            });
        }
    };

    Class.prototype.upload = function (files, type) {
        var that = this,
            options = that.config,
            elemFile = that.elemFile[0],
            ajaxSend = function ajaxSend() {
            var successful = 0,
                aborted = 0,
                items = files || that.files || that.chooseFiles || elemFile.files,
                allDone = function allDone() {
                if (options.multiple && successful + aborted === that.fileLength) {
                    typeof options.allDone === 'function' && options.allDone({
                        total: that.fileLength,
                        successful: successful,
                        aborted: aborted
                    });
                }
            };
            layui.each(items, function (index, file) {
                var formData = new FormData();

                formData.append(options.field, file);

                layui.each(options.data, function (key, value) {
                    formData.append(key, value);
                });

                $.ajax({
                    url: options.url,
                    type: options.method,
                    data: formData,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    success: function success(res) {
                        successful++;
                        done(index, res);
                        allDone();
                    },
                    error: function error() {
                        aborted++;
                        that.msg('请求上传接口出现异常');
                        _error(index);
                        allDone();
                    }
                });
            });
        },
            iframeSend = function iframeSend() {
            var iframe = $('#' + ELEM_IFRAME);

            that.elemFile.parent().submit();

            clearInterval(Class.timer);
            Class.timer = setInterval(function () {
                var res = void 0,
                    iframeBody = iframe.contents().find('body');
                try {
                    res = iframeBody.text();
                } catch (e) {
                    that.msg('获取上传后的响应信息出现异常');
                    clearInterval(Class.timer);
                    _error();
                }
                if (res) {
                    clearInterval(Class.timer);
                    iframeBody.html('');
                    done(0, res);
                }
            }, 30);
        },
            done = function done(index, res) {
            that.elemFile.next('.' + ELEM_CHOOSE).remove();
            elemFile.value = '';
            if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) !== 'object') {
                try {
                    res = JSON.parse(res);
                } catch (e) {
                    res = {};
                    return that.msg('请对上传接口返回有效JSON');
                }
            }
            typeof options.done === 'function' && options.done(res, index || 0, function (files) {
                that.upload(files);
            });
        },
            _error = function _error(index) {
            if (options.auto) {
                elemFile.value = '';
            }
            typeof options.error === 'function' && options.error(index || 0, function (files) {
                that.upload(files);
            });
        },
            exts = options.exts,
            check = void 0,
            value = function () {
            var arr = [];
            layui.each(files || that.chooseFiles, function (i, item) {
                arr.push(item.name);
            });
            return arr;
        }(),
            args = {
            preview: function preview(callback) {
                that.preview(callback);
            },
            upload: function upload(index, file) {
                var thisFile = {};
                thisFile[index] = file;
                that.upload(thisFile);
            },
            pushFile: function pushFile() {
                that.files = that.files || {};
                layui.each(that.chooseFiles, function (index, item) {
                    that.files[index] = item;
                });
                return that.files;
            }
        },
            send = function send() {
            if (type === 'choose') {
                return options.choose && options.choose(args);
            }

            options.before && options.before(args);

            if (device.ie) {
                return device.ie > 9 ? ajaxSend() : iframeSend();
            }

            ajaxSend();
        };

        value = value.length === 0 ? elemFile.value.match(/[^/\\]+\..+/g) || [] || '' : value;

        if (value.length === 0) {
            return;
        }

        switch (options.accept) {
            case 'file':
                if (exts && !RegExp('\\w\\.(' + exts + ')$', 'i').test(escape(value))) {
                    that.msg('选择的文件中包含不支持的格式');
                    return elemFile.value = '';
                }
                break;
            case 'video':
                if (!RegExp('\\w\\.(' + (exts || 'avi|mp4|wma|rmvb|rm|flash|3gp|flv') + ')$', 'i').test(escape(value))) {
                    that.msg('选择的视频中包含不支持的格式');
                    return elemFile.value = '';
                }
                break;
            case 'audio':
                if (!RegExp('\\w\\.(' + (exts || 'mp3|wav|mid') + ')$', 'i').test(escape(value))) {
                    that.msg('选择的音频中包含不支持的格式');
                    return elemFile.value = '';
                }
                break;
            default:
                layui.each(value, function (i, item) {
                    if (!RegExp('\\w\\.(' + (exts || 'jpg|png|gif|bmp|jpeg$') + ')', 'i').test(escape(item))) {
                        check = true;
                    }
                });
                if (check) {
                    that.msg('选择的图片中包含不支持的格式');
                    return elemFile.value = '';
                }
                break;
        }

        that.fileLength = function () {
            var length = 0,
                items = files || that.files || that.chooseFiles || elemFile.files;
            layui.each(items, function () {
                length++;
            });
            return length;
        }();

        if (options.number && that.fileLength > options.number) {
            return that.msg('同时最多只能上传的数量为：' + options.number);
        }

        if (options.size > 0 && !(device.ie && device.ie < 10)) {
            var limitSize = void 0;

            layui.each(that.chooseFiles, function (index, file) {
                if (file.size > 1024 * options.size) {
                    var size = options.size / 1024;
                    size = size >= 1 ? Math.floor(size) + (size % 1 > 0 ? size.toFixed(1) : 0) + 'MB' : options.size + 'KB';
                    elemFile.value = '';
                    limitSize = size;
                }
            });
            if (limitSize) return that.msg('文件不能超过' + limitSize);
        }
        send();
    };

    Class.prototype.events = function () {
        var that = this,
            options = that.config,
            setChooseFile = function setChooseFile(files) {
            that.chooseFiles = {};
            layui.each(files, function (i, item) {
                var time = new Date().getTime();
                that.chooseFiles[time + '-' + i] = item;
            });
        },
            setChooseText = function setChooseText(files) {
            var elemFile = that.elemFile,
                value = files.length > 1 ? files.length + '个文件' : (files[0] || {}).name || elemFile[0].value.match(/[^/\\]+\..+/g) || [] || '';

            if (elemFile.next().hasClass(ELEM_CHOOSE)) {
                elemFile.next().remove();
            }
            that.upload(null, 'choose');
            if (that.isFile() || options.choose) return;
            elemFile.after('<span class="layui-inline ' + ELEM_CHOOSE + '">' + value + '</span>');
        };

        options.elem.off('upload.start').on('upload.start', function () {
            var othis = $(this),
                data = othis.attr('lay-data');

            if (data) {
                try {
                    data = new Function('return ' + data)();
                    that.config = $.extend({}, options, data);
                } catch (e) {
                    hint.error('Upload element property lay-data configuration item has a syntax error: ' + data);
                }
            }

            that.config.item = othis;
            that.elemFile[0].click();
        });

        if (!(device.ie && device.ie < 10)) {
            options.elem.off('upload.over').on('upload.over', function () {
                var othis = $(this);
                othis.attr('lay-over', '');
            }).off('upload.leave').on('upload.leave', function () {
                var othis = $(this);
                othis.removeAttr('lay-over');
            }).off('upload.drop').on('upload.drop', function (e, param) {
                var othis = $(this),
                    files = param.originalEvent.dataTransfer.files || [];

                othis.removeAttr('lay-over');
                setChooseFile(files);

                if (options.auto) {
                    that.upload(files);
                } else {
                    setChooseText(files);
                }
            });
        }

        that.elemFile.off('upload.change').on('upload.change', function () {
            var files = this.files || [];
            setChooseFile(files);
            options.auto ? that.upload() : setChooseText(files);
        });

        options.bindAction.off('upload.action').on('upload.action', function () {
            that.upload();
        });

        if (options.elem.data('haveEvents')) return;

        that.elemFile.on('change', function () {
            $(this).trigger('upload.change');
        });

        options.elem.on('click', function () {
            if (that.isFile()) return;
            $(this).trigger('upload.start');
        });

        if (options.drag) {
            options.elem.on('dragover', function (e) {
                e.preventDefault();
                $(this).trigger('upload.over');
            }).on('dragleave', function () {
                $(this).trigger('upload.leave');
            }).on('drop', function (e) {
                e.preventDefault();
                $(this).trigger('upload.drop', e);
            });
        }

        options.bindAction.on('click', function () {
            $(this).trigger('upload.action');
        });

        options.elem.data('haveEvents', true);
    };

    upload.render = function (options) {
        var inst = new Class(options);
        return thisUpload.call(inst);
    };

    exports(MOD_NAME, upload);
});function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

layui.define('jquery', function (exports) {
    'use strict';

    var $ = layui.$,
        hint = layui.hint();

    var enterSkin = 'layui-tree-enter',
        Tree = function Tree(options) {
        this.options = options;
    };

    var icon = {
        arrow: ['&#xe623;', '&#xe625;'],
        checkbox: ['&#xe626;', '&#xe627;'],
        radio: ['&#xe62b;', '&#xe62a;'],
        branch: ['&#xe622;', '&#xe624;'],
        leaf: '&#xe621;' };

    function toggleNode(el) {
        var ul = el.children('ul'),
            a = el.children('a'),
            arrow = el.children('.layui-tree-spread');

        if (el.data('spread')) {
            el.data('spread', null);
            ul.removeClass('layui-show');
            arrow.html(icon.arrow[0]);
            a.find('.layui-icon').html(icon.branch[0]);
        } else {
            el.data('spread', true);
            ul.addClass('layui-show');
            arrow.html(icon.arrow[1]);
            a.find('.layui-icon').html(icon.branch[1]);
        }
    }

    function foldNode(el, sameLevelNode) {
        if (sameLevelNode && $.contains(el[0], sameLevelNode[0])) {
            return;
        }

        var ul = el.children('ul'),
            a = el.children('a'),
            arrow = el.children('.layui-tree-spread');

        if (el.data('spread')) {
            el.data('spread', null);
            ul.removeClass('layui-show');
            arrow.html(icon.arrow[0]);
            a.find('.layui-icon').html(icon.branch[0]);
        }

        if (sameLevelNode) {
            foldNode(el.parent(), sameLevelNode);
        }
    }

    Tree.prototype.init = function (elem) {
        elem.addClass('layui-box layui-tree');
        if (this.options.skin) {
            elem.addClass('layui-tree-skin-' + this.options.skin);
        }
        this.options.currentExpandedNode = null;
        this.tree(elem);
        this.on(elem);
    };

    Tree.prototype.tree = function (elem, children) {
        var that = this,
            options = that.options;
        var nodes = children || options.nodes;

        layui.each(nodes, function (index, item) {
            var hasChild = item.children && item.children.length > 0;
            var ul = $('<ul class="' + (item.spread ? 'layui-show' : '') + '"></ul>');
            var li = $(['<li ' + (item.spread ? 'data-spread="' + item.spread + '"' : '') + '>', function () {
                return hasChild ? '<i class="layui-icon layui-tree-spread">' + (item.spread ? icon.arrow[1] : icon.arrow[0]) + '</i>' : '';
            }(), function () {
                return options.check ? '<i class="layui-icon layui-tree-check">' + (options.check === 'checkbox' ? icon.checkbox[0] : options.check === 'radio' ? icon.radio[0] : '') + '</i>' : '';
            }(), function () {
                var leaf = void 0;

                if (hasChild) {
                    leaf = item.spread ? icon.branch[1] : icon.branch[0];
                } else {
                    leaf = icon.leaf;
                }

                return '<a href="' + (item.href || 'javascript:;') + '" ' + (options.target && item.href ? 'target="' + options.target + '"' : '') + '><i class="layui-icon layui-tree-' + (hasChild ? 'branch' : 'leaf') + '">' + leaf + '</i><cite>' + (item.name || '未命名') + '</cite></a>';
            }(), '</li>'].join(''));

            if (hasChild) {
                li.append(ul);
                that.tree(ul, item.children);
            }

            elem.append(li);

            typeof options.click === 'function' && that.click(li, item);

            that.spread(li, item);

            options.drag && that.drag(li, item);
        });
    };

    Tree.prototype.click = function (elem, item) {
        var that = this,
            options = that.options;
        elem.children('a').on('click', function (e) {
            layui.stope(e);
            options.click(item);
        });
    };

    Tree.prototype.spread = function (elem) {
        var that = this;
        var accordion = this.options.accordion;

        var open = function open() {
            var node = that.options.currentExpandedNode;

            if (accordion) {
                if (!node) {
                    if (!elem.data('spread')) {
                        node = elem;
                    }
                } else {
                    if (node[0] !== elem[0] && !$.contains(node[0], elem[0])) {
                        foldNode(node, elem);
                        node = elem;
                    } else {
                        if (!elem.data('spread')) {
                            node = elem;
                        } else {
                            node = null;
                        }
                    }
                }
            }

            that.options.currentExpandedNode = node;

            toggleNode(elem);
        };

        if (!elem.children('ul')[0]) return;

        elem.children('.layui-tree-spread').on('click', open);
        elem.children('a').on('dblclick', open);
    };

    Tree.prototype.on = function (elem) {
        var that = this,
            options = that.options;
        var dragStr = 'layui-tree-drag';

        elem.find('i').on('selectstart', function () {
            return false;
        });

        if (options.drag) {
            $(document).on('mousemove', function (e) {
                var move = that.move;
                if (move.from) {
                    var treeMove = $('<div class="layui-box ' + dragStr + '"></div>');
                    e.preventDefault();
                    var $drag = $('.' + dragStr);
                    $drag[0] || $('body').append(treeMove);
                    $drag = $('.' + dragStr);
                    var dragElem = $drag[0] ? $drag : treeMove;
                    dragElem.addClass('layui-show').html(move.from.elem.children('a').html());
                    dragElem.css({
                        left: e.pageX + 10,
                        top: e.pageY + 10
                    });
                }
            }).on('mouseup', function () {
                var move = that.move;
                if (move.from) {
                    move.from.elem.children('a').removeClass(enterSkin);
                    move.to && move.to.elem.children('a').removeClass(enterSkin);
                    that.move = {};
                    $('.' + dragStr).remove();
                }
            });
        }
    };

    Tree.prototype.move = {};
    Tree.prototype.drag = function (elem, item) {
        var that = this;
        var a = elem.children('a'),
            mouseenter = function mouseenter() {
            var othis = $(this),
                move = that.move;
            if (move.from) {
                move.to = {
                    item: item,
                    elem: elem
                };
                othis.addClass(enterSkin);
            }
        };
        a.on('mousedown', function () {
            var move = that.move;
            move.from = {
                item: item,
                elem: elem
            };
        });
        a.on('mouseenter', mouseenter).on('mousemove', mouseenter).on('mouseleave', function () {
            var othis = $(this),
                move = that.move;
            if (move.from) {
                delete move.to;
                othis.removeClass(enterSkin);
            }
        });
    };

    exports('tree', function (options) {
        var tree = new Tree(options = options || {});
        var elem = $(options.elem);
        if (!elem[0]) {
            return hint.error('layui.tree 没有找到' + options.elem + '元素');
        }
        tree.init(elem);
    });
});var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

layui.define('jquery', function (exports) {
  "use strict";

  var $ = layui.$,
      hint = layui.hint(),
      device = layui.device(),
      carousel = {
    config: {}, set: function set(options) {
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    },

    on: function on(events, callback) {
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  },
      MOD_NAME = 'carousel',
      ELEM = '.layui-carousel',
      THIS = 'layui-this',
      SHOW = 'layui-show',
      HIDE = 'layui-hide',
      DISABLED = 'layui-disabled',
      ELEM_ITEM = '>*[carousel-item]>*',
      ELEM_LEFT = 'layui-carousel-left',
      ELEM_RIGHT = 'layui-carousel-right',
      ELEM_PREV = 'layui-carousel-prev',
      ELEM_NEXT = 'layui-carousel-next',
      ELEM_ARROW = 'layui-carousel-arrow',
      ELEM_IND = 'layui-carousel-ind',
      Class = function Class(options) {
    var that = this;
    that.config = $.extend({}, that.config, carousel.config, options);
    that.render();
  };

  Class.prototype.config = {
    width: '600px',
    height: '280px',
    full: false, arrow: 'hover', indicator: 'inside', autoplay: true, interval: 3000, anim: '', trigger: 'click', index: 0 };

  Class.prototype.render = function () {
    var that = this,
        options = that.config;

    options.elem = $(options.elem);
    if (!options.elem[0]) return;
    that.elemItem = options.elem.find(ELEM_ITEM);

    if (options.index < 0) options.index = 0;
    if (options.index >= that.elemItem.length) options.index = that.elemItem.length - 1;
    if (options.interval < 800) options.interval = 800;

    if (options.full) {
      options.elem.css({
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 9999
      });
    } else {
      options.elem.css({
        width: options.width,
        height: options.height
      });
    }

    options.elem.attr('lay-anim', options.anim);

    that.elemItem.eq(options.index).addClass(THIS);

    if (that.elemItem.length <= 1) return;
    that.indicator();
    that.arrow();
    that.autoplay();
    that.events();
  };

  Class.prototype.reload = function (options) {
    var that = this;
    clearInterval(that.timer);
    that.config = $.extend({}, that.config, options);
    that.render();
  };

  Class.prototype.prevIndex = function () {
    var that = this,
        options = that.config;

    var prevIndex = options.index - 1;
    if (prevIndex < 0) {
      prevIndex = that.elemItem.length - 1;
    }
    return prevIndex;
  };

  Class.prototype.nextIndex = function () {
    var that = this,
        options = that.config;

    var nextIndex = options.index + 1;
    if (nextIndex >= that.elemItem.length) {
      nextIndex = 0;
    }
    return nextIndex;
  };

  Class.prototype.addIndex = function (num) {
    var that = this,
        options = that.config;

    num = num || 1;
    options.index = options.index + num;

    if (options.index >= that.elemItem.length) {
      options.index = 0;
    }
  };

  Class.prototype.subIndex = function (num) {
    var that = this,
        options = that.config;

    num = num || 1;
    options.index = options.index - num;

    if (options.index < 0) {
      options.index = that.elemItem.length - 1;
    }
  };

  Class.prototype.autoplay = function () {
    var that = this,
        options = that.config;

    if (!options.autoplay) return;

    that.timer = setInterval(function () {
      that.slide();
    }, options.interval);
  };

  Class.prototype.arrow = function () {
    var that = this,
        options = that.config;

    var tplArrow = $(['<button class="layui-icon ' + ELEM_ARROW + '" lay-type="sub">' + (options.anim === 'updown' ? '&#xe619;' : '&#xe603;') + '</button>', '<button class="layui-icon ' + ELEM_ARROW + '" lay-type="add">' + (options.anim === 'updown' ? '&#xe61a;' : '&#xe602;') + '</button>'].join(''));

    options.elem.attr('lay-arrow', options.arrow);

    if (options.elem.find('.' + ELEM_ARROW)[0]) {
      options.elem.find('.' + ELEM_ARROW).remove();
    };
    options.elem.append(tplArrow);

    tplArrow.on('click', function () {
      var othis = $(this),
          type = othis.attr('lay-type');
      that.slide(type);
    });
  };

  Class.prototype.indicator = function () {
    var that = this,
        options = that.config;

    var tplInd = that.elemInd = $(['<div class="' + ELEM_IND + '"><ul>', function () {
      var li = [];
      layui.each(that.elemItem, function (index) {
        li.push('<li' + (options.index === index ? ' class="layui-this"' : '') + '></li>');
      });
      return li.join('');
    }(), '</ul></div>'].join(''));

    options.elem.attr('lay-indicator', options.indicator);

    if (options.elem.find('.' + ELEM_IND)[0]) {
      options.elem.find('.' + ELEM_IND).remove();
    };
    options.elem.append(tplInd);

    if (options.anim === 'updown') {
      tplInd.css('margin-top', -(tplInd.height() / 2));
    }

    tplInd.find('li').on(options.trigger === 'hover' ? 'mouseover' : options.trigger, function () {
      var othis = $(this),
          index = othis.index();
      if (index > options.index) {
        that.slide('add', index - options.index);
      } else if (index < options.index) {
        that.slide('sub', options.index - index);
      }
    });
  };

  Class.prototype.slide = function (type, num) {
    var that = this,
        elemItem = that.elemItem,
        options = that.config,
        thisIndex = options.index,
        filter = options.elem.attr('lay-filter');

    if (that.haveSlide) return;

    if (type === 'sub') {
      that.subIndex(num);
      elemItem.eq(options.index).addClass(ELEM_PREV);
      setTimeout(function () {
        elemItem.eq(thisIndex).addClass(ELEM_RIGHT);
        elemItem.eq(options.index).addClass(ELEM_RIGHT);
      }, 50);
    } else {
      that.addIndex(num);
      elemItem.eq(options.index).addClass(ELEM_NEXT);
      setTimeout(function () {
        elemItem.eq(thisIndex).addClass(ELEM_LEFT);
        elemItem.eq(options.index).addClass(ELEM_LEFT);
      }, 50);
    };

    setTimeout(function () {
      elemItem.removeClass(THIS + ' ' + ELEM_PREV + ' ' + ELEM_NEXT + ' ' + ELEM_LEFT + ' ' + ELEM_RIGHT);
      elemItem.eq(options.index).addClass(THIS);
      that.haveSlide = false;
    }, 300);

    that.elemInd.find('li').eq(options.index).addClass(THIS).siblings().removeClass(THIS);

    that.haveSlide = true;

    layui.event.call(this, MOD_NAME, 'change(' + filter + ')', {
      index: options.index,
      prevIndex: thisIndex,
      item: elemItem.eq(options.index)
    });
  };

  Class.prototype.events = function () {
    var that = this,
        options = that.config;

    if (options.elem.data('haveEvents')) return;

    options.elem.on('mouseenter', function () {
      clearInterval(that.timer);
    }).on('mouseleave', function () {
      that.autoplay();
    });

    options.elem.data('haveEvents', true);
  };

  carousel.render = function (options) {
    var inst = new Class(options);
    return inst;
  };

  exports(MOD_NAME, carousel);
});var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

layui.define('jquery', function (exports) {
    'use strict';

    var $ = layui.$,
        util = {
        fixbar: function fixbar(options) {
            var ELEM = 'layui-fixbar',
                TOP_BAR = 'layui-fixbar-top',
                dom = $(document),
                body = $('body'),
                is = void 0,
                timer = void 0;

            options = $.extend({
                showHeight: 200 }, options);

            options.bar1 = options.bar1 === true ? '&#xe606;' : options.bar1;
            options.bar2 = options.bar2 === true ? '&#xe607;' : options.bar2;
            options.bgcolor = options.bgcolor ? 'background-color:' + options.bgcolor : '';

            var icon = [options.bar1, options.bar2, '&#xe604;'],
                elem = $(['<ul class="' + ELEM + '">', options.bar1 ? '<li class="layui-icon" lay-type="bar1" style="' + options.bgcolor + '">' + icon[0] + '</li>' : '', options.bar2 ? '<li class="layui-icon" lay-type="bar2" style="' + options.bgcolor + '">' + icon[1] + '</li>' : '', '<li class="layui-icon ' + TOP_BAR + '" lay-type="top" style="' + options.bgcolor + '">' + icon[2] + '</li>', '</ul>'].join('')),
                topBar = elem.find('.' + TOP_BAR),
                scroll = function scroll() {
                var stop = dom.scrollTop();
                if (stop >= options.showHeight) {
                    is || (topBar.show(), is = 1);
                } else {
                    is && (topBar.hide(), is = 0);
                }
            };

            if ($('.' + ELEM)[0]) {
                return;
            }

            _typeof(options.css) === 'object' && elem.css(options.css);
            body.append(elem), scroll();

            elem.find('li').on('click', function () {
                var othis = $(this),
                    type = othis.attr('lay-type');

                if (type === 'top') {
                    $('html,body').animate({
                        scrollTop: 0
                    }, 200);
                }
                options.click && options.click.call(this, type);
            });

            dom.on('scroll', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    scroll();
                }, 100);
            });
        },

        countdown: function countdown(endTime, serverTime, callback) {
            var that = this,
                type = typeof serverTime === 'function',
                end = new Date(endTime).getTime(),
                now = new Date(!serverTime || type ? new Date().getTime() : serverTime).getTime(),
                count = end - now,
                time = [Math.floor(count / (1000 * 60 * 60 * 24)), Math.floor(count / (1000 * 60 * 60)) % 24, Math.floor(count / (1000 * 60)) % 60, Math.floor(count / 1000) % 60];

            if (type) callback = serverTime;

            var timer = setTimeout(function () {
                that.countdown(endTime, now + 1000, callback);
            }, 1000);

            callback && callback(count > 0 ? time : [0, 0, 0, 0], serverTime, timer);

            if (count <= 0) clearTimeout(timer);
            return timer;
        },

        timeAgo: function timeAgo(time, onlyDate) {
            var that = this,
                arr = [[], []],
                stamp = new Date().getTime() - new Date(time).getTime();

            if (stamp > 1000 * 60 * 60 * 24 * 8) {
                stamp = new Date(time);
                arr[0][0] = that.digit(stamp.getFullYear(), 4);
                arr[0][1] = that.digit(stamp.getMonth() + 1);
                arr[0][2] = that.digit(stamp.getDate());

                if (!onlyDate) {
                    arr[1][0] = that.digit(stamp.getHours());
                    arr[1][1] = that.digit(stamp.getMinutes());
                    arr[1][2] = that.digit(stamp.getSeconds());
                }
                return arr[0].join('-') + ' ' + arr[1].join(':');
            }

            if (stamp >= 1000 * 60 * 60 * 24) {
                return (stamp / 1000 / 60 / 60 / 24 | 0) + '天前';
            } else if (stamp >= 1000 * 60 * 60) {
                return (stamp / 1000 / 60 / 60 | 0) + '小时前';
            } else if (stamp >= 1000 * 60 * 2) {
                return (stamp / 1000 / 60 | 0) + '分钟前';
            } else if (stamp < 0) {
                return '未来';
            } else {
                return '刚刚';
            }
        },

        digit: function digit(num, length) {
            var str = '';
            num = String(num);
            length = length || 2;
            for (var i = num.length; i < length; i++) {
                str += '0';
            }
            return num < Math.pow(10, length) ? str + (num | 0) : num;
        },

        toDateString: function toDateString(time, format) {
            var that = this,
                date = new Date(parseInt(time) || new Date()),
                ymd = [that.digit(date.getFullYear(), 4), that.digit(date.getMonth() + 1), that.digit(date.getDate())],
                hms = [that.digit(date.getHours()), that.digit(date.getMinutes()), that.digit(date.getSeconds())];

            format = format || 'yyyy-MM-dd HH:mm:ss';

            return format.replace(/yyyy/g, ymd[0]).replace(/MM/g, ymd[1]).replace(/dd/g, ymd[2]).replace(/HH/g, hms[0]).replace(/mm/g, hms[1]).replace(/ss/g, hms[2]);
        }
    };

    exports('util', util);
});

layui.define('jquery', function (exports) {
  "use strict";

  var $ = layui.$,
      Flow = function Flow(options) {},
      ELEM_MORE = 'layui-flow-more',
      ELEM_LOAD = '<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon ">&#xe63e;</i>';

  Flow.prototype.load = function (options) {
    var that = this,
        page = 0,
        lock,
        isOver,
        lazyimg,
        timer;
    options = options || {};

    var elem = $(options.elem);if (!elem[0]) return;
    var scrollElem = $(options.scrollElem || document);
    var mb = options.mb || 50;
    var isAuto = 'isAuto' in options ? options.isAuto : true;
    var end = options.end || '没有更多了';
    var notDocment = options.scrollElem && options.scrollElem !== document;

    var ELEM_TEXT = '<cite>加载更多</cite>',
        more = $('<div class="layui-flow-more"><a href="javascript:;">' + ELEM_TEXT + '</a></div>');

    if (!elem.find('.layui-flow-more')[0]) {
      elem.append(more);
    }

    var next = function next(html, over) {
      html = $(html);
      more.before(html);
      over = over == 0 ? true : null;
      over ? more.html(end) : more.find('a').html(ELEM_TEXT);
      isOver = over;
      lock = null;
      lazyimg && lazyimg();
    };

    var done = function done() {
      lock = true;
      more.find('a').html(ELEM_LOAD);
      typeof options.done === 'function' && options.done(++page, next);
    };

    done();

    more.find('a').on('click', function () {
      var othis = $(this);
      if (isOver) return;
      lock || done();
    });

    if (options.isLazyimg) {
      var lazyimg = that.lazyimg({
        elem: options.elem + ' img',
        scrollElem: options.scrollElem
      });
    }

    if (!isAuto) return that;

    scrollElem.on('scroll', function () {
      var othis = $(this),
          top = othis.scrollTop();

      if (timer) clearTimeout(timer);
      if (isOver) return;

      timer = setTimeout(function () {
        var height = notDocment ? othis.height() : $(window).height();

        var scrollHeight = notDocment ? othis.prop('scrollHeight') : document.documentElement.scrollHeight;

        if (scrollHeight - top - height <= mb) {
          lock || done();
        }
      }, 100);
    });
    return that;
  };

  Flow.prototype.lazyimg = function (options) {
    var that = this,
        index = 0,
        haveScroll;
    options = options || {};

    var scrollElem = $(options.scrollElem || document);
    var elem = options.elem || 'img';

    var notDocment = options.scrollElem && options.scrollElem !== document;

    var show = function show(item, height) {
      var start = scrollElem.scrollTop(),
          end = start + height;
      var elemTop = notDocment ? function () {
        return item.offset().top - scrollElem.offset().top + start;
      }() : item.offset().top;

      if (elemTop >= start && elemTop <= end) {
        if (!item.attr('src')) {
          var src = item.attr('lay-src');
          layui.img(src, function () {
            var next = that.lazyimg.elem.eq(index);
            item.attr('src', src).removeAttr('lay-src');

            next[0] && render(next);
            index++;
          });
        }
      }
    },
        render = function render(othis, scroll) {
      var height = notDocment ? (scroll || scrollElem).height() : $(window).height();
      var start = scrollElem.scrollTop(),
          end = start + height;

      that.lazyimg.elem = $(elem);

      if (othis) {
        show(othis, height);
      } else {
        for (var i = 0; i < that.lazyimg.elem.length; i++) {
          var item = that.lazyimg.elem.eq(i),
              elemTop = notDocment ? function () {
            return item.offset().top - scrollElem.offset().top + start;
          }() : item.offset().top;

          show(item, height);
          index = i;

          if (elemTop > end) break;
        }
      }
    };

    render();

    if (!haveScroll) {
      var timer;
      scrollElem.on('scroll', function () {
        var othis = $(this);
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          render(null, othis);
        }, 50);
      });
      haveScroll = true;
    }
    return render;
  };

  exports('flow', new Flow());
});

layui.define(['layer', 'form'], function (exports) {
    'use strict';

    var $ = layui.$;
    var layer = layui.layer;
    var form = layui.form;
    var device = layui.device();
    var MOD_NAME = 'layedit';
    var SHOW = 'layui-show';
    var ABLED = 'layui-disabled';
    var Edit = function Edit() {
        var that = this;
        that.index = 0;

        that.config = {
            tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', '|', 'link', 'unlink', 'face', 'image'],
            hideTool: [],
            height: 280 };
    };

    Edit.prototype.set = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    };

    Edit.prototype.on = function (events, callback) {
        return layui.onevent(MOD_NAME, events, callback);
    };

    Edit.prototype.build = function (id, settings) {
        settings = settings || {};

        var that = this,
            config = that.config,
            ELEM = 'layui-layedit',
            textArea = $('#' + id),
            name = 'LAY_layedit_' + ++that.index,
            haveBuild = textArea.next('.' + ELEM),
            set = $.extend({}, config, settings),
            tool = function () {
            var node = [],
                hideTools = {};
            layui.each(set.hideTool, function (_, item) {
                hideTools[item] = true;
            });
            layui.each(set.tool, function (_, item) {
                if (tools[item] && !hideTools[item]) {
                    node.push(tools[item]);
                }
            });
            return node.join('');
        }(),
            editor = $(['<div class="' + ELEM + '">', '<div class="layui-unselect layui-layedit-tool">' + tool + '</div>', '<div class="layui-layedit-iframe">', '<iframe id="' + name + '" name="' + name + '" textarea="' + id + '" frameborder="0"></iframe>', '</div>', '</div>'].join(''));

        if (device.ie && device.ie < 8) {
            return textArea.removeClass('layui-hide').addClass(SHOW);
        }

        haveBuild[0] && haveBuild.remove();

        setIframe.call(that, editor, textArea[0], set);
        textArea.addClass('layui-hide').after(editor);

        return that.index;
    };

    Edit.prototype.getContent = function (index) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        return toLower(iframeWin[0].document.body.innerHTML);
    };

    Edit.prototype.getText = function (index) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        return $(iframeWin[0].document.body).text();
    };

    Edit.prototype.setContent = function (index, content, flag) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        if (flag) {
            $(iframeWin[0].document.body).append(content);
        } else {
            $(iframeWin[0].document.body).html(content);
        }

        this.sync(index);
    };

    Edit.prototype.sync = function (index) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        var textarea = $('#' + iframeWin[1].attr('textarea'));
        textarea.val(toLower(iframeWin[0].document.body.innerHTML));
    };

    Edit.prototype.getSelection = function (index) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        var range = Range(iframeWin[0].document);
        return document.selection ? range.text : range.toString();
    };

    var setIframe = function setIframe(editor, textArea, set) {
        var that = this,
            iframe = editor.find('iframe');

        iframe.css({
            height: set.height
        }).on('load', function () {
            var conts = iframe.contents(),
                iframeWin = iframe.prop('contentWindow'),
                head = conts.find('head'),
                style = $(['<style>', '*{margin: 0; padding: 0;}', 'body{padding: 10px; line-height: 20px; overflow-x: hidden; word-wrap: break-word; font: 14px Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Tahoma,Arial,sans-serif; -webkit-box-sizing: border-box !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important;}', 'a{color:#01AAED; text-decoration:none;}a:hover{color:#c00}', 'p{margin-bottom: 10px;}', 'img{display: inline-block; border: none; vertical-align: middle;}', 'pre{margin: 10px 0; padding: 10px; line-height: 20px; border: 1px solid #ddd; border-left-width: 6px; background-color: #F2F2F2; color: #333; font-family: Courier New; font-size: 12px;}', '</style>'].join('')),
                body = conts.find('body');

            head.append(style);
            body.attr('contenteditable', 'true').css({
                'min-height': set.height
            }).html(textArea.value || '');

            hotkey.apply(that, [iframeWin, iframe, textArea, set]);
            toolActive.call(that, iframeWin, editor, set);
        });
    },
        getWin = function getWin(index) {
        var iframe = $('#LAY_layedit_' + index),
            iframeWin = iframe.prop('contentWindow');
        return [iframeWin, iframe];
    },
        toLower = function toLower(html) {
        if (device.ie === 8) {
            html = html.replace(/<.+>/g, function (str) {
                return str.toLowerCase();
            });
        }
        return html;
    },
        hotkey = function hotkey(iframeWin, iframe, textArea) {
        var iframeDOM = iframeWin.document,
            body = $(iframeDOM.body);

        body.on('keydown', function (e) {
            var keycode = e.keyCode;

            if (keycode === 13) {
                var range = Range(iframeDOM);
                var container = getContainer(range),
                    parentNode = container.parentNode;

                if (parentNode.tagName.toLowerCase() === 'pre') {
                    if (e.shiftKey) return;
                    layer.msg('请暂时用shift+enter');
                    return false;
                }
                iframeDOM.execCommand('formatBlock', false, '<p>');
            }
        });

        $(textArea).parents('form').on('submit', function () {
            var html = body.html();

            if (device.ie == 8) {
                html = html.replace(/<.+>/g, function (str) {
                    return str.toLowerCase();
                });
            }
            textArea.value = html;
        });

        body.on('paste', function () {
            iframeDOM.execCommand('formatBlock', false, '<p>');
            setTimeout(function () {
                filter.call(iframeWin, body);
                textArea.value = body.html();
            }, 100);
        });
    },
        filter = function filter(body) {
        body.find('*[style]').each(function () {
            var textAlign = this.style.textAlign;
            this.removeAttribute('style');
            $(this).css({
                'text-align': textAlign || ''
            });
        });

        body.find('table').addClass('layui-table');

        body.find('script,link').remove();
    },
        Range = function Range(iframeDOM) {
        return iframeDOM.selection ? iframeDOM.selection.createRange() : iframeDOM.getSelection().getRangeAt(0);
    },
        getContainer = function getContainer(range) {
        return range.endContainer || range.parentElement().childNodes[0];
    },
        insertInline = function insertInline(tagName, attr, range) {
        var iframeDOM = this.document,
            elem = document.createElement(tagName);
        for (var key in attr) {
            if (attr.hasOwnProperty(key)) {
                elem.setAttribute(key, attr[key]);
            }
        }
        elem.removeAttribute('text');

        if (iframeDOM.selection) {
            var text = range.text || attr.text;

            if (tagName === 'a' && !text) return;

            if (text) {
                elem.innerHTML = text;
            }
            range.pasteHTML($(elem).prop('outerHTML'));
            range.select();
        } else {
            var _text = range.toString() || attr.text;

            if (tagName === 'a' && !_text) return;

            if (_text) {
                elem.innerHTML = _text;
            }
            range.deleteContents();
            range.insertNode(elem);
        }
    },
        toolCheck = function toolCheck(tools, othis) {
        var iframeDOM = this.document,
            CHECK = 'layedit-tool-active',
            container = getContainer(Range(iframeDOM)),
            item = function item(type) {
            return tools.find('.layedit-tool-' + type);
        };

        if (othis) {
            othis[othis.hasClass(CHECK) ? 'removeClass' : 'addClass'](CHECK);
        }

        tools.find('>i').removeClass(CHECK);
        item('unlink').addClass(ABLED);

        $(container).parents().each(function () {
            var tagName = this.tagName.toLowerCase(),
                textAlign = this.style.textAlign;

            if (tagName === 'b' || tagName === 'strong') {
                item('b').addClass(CHECK);
            }
            if (tagName === 'i' || tagName === 'em') {
                item('i').addClass(CHECK);
            }
            if (tagName === 'u') {
                item('u').addClass(CHECK);
            }
            if (tagName === 'strike') {
                item('d').addClass(CHECK);
            }

            if (tagName === 'p') {
                if (textAlign === 'center') {
                    item('center').addClass(CHECK);
                } else if (textAlign === 'right') {
                    item('right').addClass(CHECK);
                } else {
                    item('left').addClass(CHECK);
                }
            }

            if (tagName === 'a') {
                item('link').addClass(CHECK);
                item('unlink').removeClass(ABLED);
            }
        });
    },
        toolActive = function toolActive(iframeWin, editor, set) {
        var iframeDOM = iframeWin.document,
            body = $(iframeDOM.body),
            toolEvent = {
            link: function link(range) {
                var container = getContainer(range),
                    parentNode = $(container).parent();

                _link.call(body, {
                    href: parentNode.attr('href'),
                    target: parentNode.attr('target')
                }, function (field) {
                    var parent = parentNode[0];
                    if (parent.tagName === 'A') {
                        parent.href = field.url;
                    } else {
                        insertInline.call(iframeWin, 'a', {
                            target: field.target,
                            href: field.url,
                            text: field.url
                        }, range);
                    }
                });
            },

            unlink: function unlink() {
                iframeDOM.execCommand('unlink');
            },

            face: function face(range) {
                _face.call(this, function (img) {
                    insertInline.call(iframeWin, 'img', {
                        src: img.src,
                        alt: img.alt
                    }, range);
                });
            },

            image: function image(range) {
                var that = this;
                layui.use('upload', function (upload) {
                    var uploadImage = set.uploadImage || {};
                    upload.render({
                        url: uploadImage.url,
                        method: uploadImage.type,
                        elem: $(that).find('input')[0],
                        done: function done(res) {
                            if (res.code === 0) {
                                res.data = res.data || {};
                                insertInline.call(iframeWin, 'img', {
                                    src: res.data.src,
                                    alt: res.data.title
                                }, range);
                            } else {
                                layer.msg(res.msg || '上传失败');
                            }
                        }
                    });
                });
            },

            code: function code(range) {
                _code.call(body, function (pre) {
                    insertInline.call(iframeWin, 'pre', {
                        text: pre.code,
                        'lay-lang': pre.lang
                    }, range);
                });
            },

            help: function help() {
                layer.open({
                    type: 2,
                    title: '帮助',
                    area: ['600px', '380px'],
                    shadeClose: true,
                    shade: 0.1,
                    skin: 'layui-layer-msg',
                    content: ['http://www.layui.com/about/layedit/help.html', 'no']
                });
            }
        },
            tools = editor.find('.layui-layedit-tool'),
            click = function click() {
            var othis = $(this),
                events = othis.attr('layedit-event'),
                command = othis.attr('lay-command');

            if (othis.hasClass(ABLED)) return;

            body.focus();

            var range = Range(iframeDOM);

            if (command) {
                iframeDOM.execCommand(command);
                if (/justifyLeft|justifyCenter|justifyRight/.test(command)) {
                    iframeDOM.execCommand('formatBlock', false, '<p>');
                }
                setTimeout(function () {
                    body.focus();
                }, 10);
            } else {
                toolEvent[events] && toolEvent[events].call(this, range);
            }
            toolCheck.call(iframeWin, tools, othis);
        },
            isClick = /image/;

        tools.find('>i').on('mousedown', function () {
            var othis = $(this),
                events = othis.attr('layedit-event');
            if (isClick.test(events)) return;
            click.call(this);
        }).on('click', function () {
            var othis = $(this),
                events = othis.attr('layedit-event');
            if (!isClick.test(events)) return;
            click.call(this);
        });

        body.on('click', function () {
            toolCheck.call(iframeWin, tools);
            layer.close(_face.index);
        });
    },
        _link = function _link(options, callback) {
        var body = this;

        _link.index = layer.open({
            type: 1,
            id: 'LAY_layedit_link',
            area: '350px',
            shade: 0.05,
            shadeClose: true,
            moveType: 1,
            title: '超链接',
            skin: 'layui-layer-msg',
            content: ['<ul class="layui-form" style="margin: 15px;">', '<li class="layui-form-item">', '<label class="layui-form-label" style="width: 60px;">URL</label>', '<div class="layui-input-block" style="margin-left: 90px">', '<input name="url" lay-verify="url" value="' + (options.href || '') + '" autofocus="true" autocomplete="off" class="layui-input">', '</div>', '</li>', '<li class="layui-form-item">', '<label class="layui-form-label" style="width: 60px;">打开方式</label>', '<div class="layui-input-block" style="margin-left: 90px">', '<input type="radio" name="target" value="_self" class="layui-input" title="当前窗口"' + (options.target === '_self' || !options.target ? 'checked' : '') + '>', '<input type="radio" name="target" value="_blank" class="layui-input" title="新窗口" ' + (options.target === '_blank' ? 'checked' : '') + '>', '</div>', '</li>', '<li class="layui-form-item" style="text-align: center;">', '<button type="button" lay-submit lay-filter="layedit-link-yes" class="layui-btn"> 确定 </button>', '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>', '</li>', '</ul>'].join(''),
            success: function success(layero, index) {
                var eventFilter = 'submit(layedit-link-yes)';
                form.render('radio');
                layero.find('.layui-btn-primary').on('click', function () {
                    layer.close(index);
                    body.focus();
                });
                form.on(eventFilter, function (data) {
                    layer.close(_link.index);
                    callback && callback(data.field);
                });
            }
        });
    },
        _face = function _face(callback) {
        var faces = function () {
            var alt = ['[微笑]', '[嘻嘻]', '[哈哈]', '[可爱]', '[可怜]', '[挖鼻]', '[吃惊]', '[害羞]', '[挤眼]', '[闭嘴]', '[鄙视]', '[爱你]', '[泪]', '[偷笑]', '[亲亲]', '[生病]', '[太开心]', '[白眼]', '[右哼哼]', '[左哼哼]', '[嘘]', '[衰]', '[委屈]', '[吐]', '[哈欠]', '[抱抱]', '[怒]', '[疑问]', '[馋嘴]', '[拜拜]', '[思考]', '[汗]', '[困]', '[睡]', '[钱]', '[失望]', '[酷]', '[色]', '[哼]', '[鼓掌]', '[晕]', '[悲伤]', '[抓狂]', '[黑线]', '[阴险]', '[怒骂]', '[互粉]', '[心]', '[伤心]', '[猪头]', '[熊猫]', '[兔子]', '[ok]', '[耶]', '[good]', '[NO]', '[赞]', '[来]', '[弱]', '[草泥马]', '[神马]', '[囧]', '[浮云]', '[给力]', '[围观]', '[威武]', '[奥特曼]', '[礼物]', '[钟]', '[话筒]', '[蜡烛]', '[蛋糕]'],
                arr = {};
            layui.each(alt, function (index, item) {
                arr[item] = layui.cache.dir + 'images/face/' + index + '.gif';
            });
            return arr;
        }();

        _face.hide = _face.hide || function (e) {
            if ($(e.target).attr('layedit-event') !== 'face') {
                layer.close(_face.index);
            }
        };
        return _face.index = layer.tips(function () {
            var content = [];
            layui.each(faces, function (key, item) {
                content.push('<li title="' + key + '"><img src="' + item + '" alt="' + key + '"></li>');
            });
            return '<ul class="layui-clear">' + content.join('') + '</ul>';
        }(), this, {
            tips: 1,
            time: 0,
            skin: 'layui-box layui-util-face',
            maxWidth: 500,
            success: function success(layero, index) {
                layero.css({
                    marginTop: -4,
                    marginLeft: -10
                }).find('.layui-clear>li').on('click', function () {
                    callback && callback({
                        src: faces[this.title],
                        alt: this.title
                    });
                    layer.close(index);
                });
                $(document).off('click', _face.hide).on('click', _face.hide);
            }
        });
    },
        _code = function _code(callback) {
        var body = this;
        _code.index = layer.open({
            type: 1,
            id: 'LAY_layedit_code',
            area: '550px',
            shade: 0.05,
            shadeClose: true,
            moveType: 1,
            title: '插入代码',
            skin: 'layui-layer-msg',
            content: ['<ul class="layui-form layui-form-pane" style="margin: 15px;">', '<li class="layui-form-item">', '<label class="layui-form-label">请选择语言</label>', '<div class="layui-input-block">', '<select name="lang">', '<option value="JavaScript">JavaScript</option>', '<option value="HTML">HTML</option>', '<option value="CSS">CSS</option>', '<option value="Java">Java</option>', '<option value="PHP">PHP</option>', '<option value="C#">C#</option>', '<option value="Python">Python</option>', '<option value="Ruby">Ruby</option>', '<option value="Go">Go</option>', '</select>', '</div>', '</li>', '<li class="layui-form-item layui-form-text">', '<label class="layui-form-label">代码</label>', '<div class="layui-input-block">', '<textarea name="code" lay-verify="required" autofocus="true" class="layui-textarea" style="height: 200px;"></textarea>', '</div>', '</li>', '<li class="layui-form-item" style="text-align: center;">', '<button type="button" lay-submit lay-filter="layedit-code-yes" class="layui-btn"> 确定 </button>', '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>', '</li>', '</ul>'].join(''),
            success: function success(layero, index) {
                var eventFilter = 'submit(layedit-code-yes)';
                form.render('select');
                layero.find('.layui-btn-primary').on('click', function () {
                    layer.close(index);
                    body.focus();
                });
                form.on(eventFilter, function (data) {
                    layer.close(_code.index);
                    callback && callback(data.field);
                });
            }
        });
    },
        tools = {
        html: '<i class="layui-icon layedit-tool-html" title="HTML源代码" lay-command="html" layedit-event="html"">&#xe64b;</i><span class="layedit-tool-mid"></span>',
        strong: '<i class="layui-icon layedit-tool-b" title="加粗" lay-command="Bold" layedit-event="b"">&#xe62b;</i>',
        italic: '<i class="layui-icon layedit-tool-i" title="斜体" lay-command="italic" layedit-event="i"">&#xe644;</i>',
        underline: '<i class="layui-icon layedit-tool-u" title="下划线" lay-command="underline" layedit-event="u"">&#xe646;</i>',
        del: '<i class="layui-icon layedit-tool-d" title="删除线" lay-command="strikeThrough" layedit-event="d"">&#xe64f;</i>',
        '|': '<span class="layedit-tool-mid"></span>',
        left: '<i class="layui-icon layedit-tool-left" title="左对齐" lay-command="justifyLeft" layedit-event="left"">&#xe649;</i>',
        center: '<i class="layui-icon layedit-tool-center" title="居中对齐" lay-command="justifyCenter" layedit-event="center"">&#xe647;</i>',
        right: '<i class="layui-icon layedit-tool-right" title="右对齐" lay-command="justifyRight" layedit-event="right"">&#xe648;</i>',
        link: '<i class="layui-icon layedit-tool-link" title="插入链接" layedit-event="link"">&#xe64c;</i>',
        unlink: '<i class="layui-icon layedit-tool-unlink layui-disabled" title="清除链接" lay-command="unlink" layedit-event="unlink"">&#xe64d;</i>',
        face: '<i class="layui-icon layedit-tool-face" title="表情" layedit-event="face"">&#xe650;</i>',
        image: '<i class="layui-icon layedit-tool-image" title="图片" layedit-event="image">&#xe64a;<input type="file" name="file"></i>',
        code: '<i class="layui-icon layedit-tool-code" title="插入代码" layedit-event="code">&#xe64e;</i>',
        help: '<i class="layui-icon layedit-tool-help" title="帮助" layedit-event="help">&#xe607;</i>'
    },
        edit = new Edit();

    exports(MOD_NAME, edit);
});

layui.define('jquery', function (exports) {
  "use strict";

  var $ = layui.$;
  var about = 'http://www.layui.com/doc/modules/code.html';

  exports('code', function (options) {
    var elems = [];
    options = options || {};
    options.elem = $(options.elem || '.layui-code');
    options.about = 'about' in options ? options.about : true;

    options.elem.each(function () {
      elems.push(this);
    });

    layui.each(elems.reverse(), function (index, item) {
      var othis = $(item),
          html = othis.html();

      if (othis.attr('lay-encode') || options.encode) {
        html = html.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
      }

      othis.html('<ol class="layui-code-ol"><li>' + html.replace(/[\r\t\n]+/g, '</li><li>') + '</li></ol>');

      if (!othis.find('>.layui-code-h3')[0]) {
        othis.prepend('<h3 class="layui-code-h3">' + (othis.attr('lay-title') || options.title || 'code') + (options.about ? '<a href="' + about + '" target="_blank">layui.code</a>' : '') + '</h3>');
      }

      var ol = othis.find('>.layui-code-ol');
      othis.addClass('layui-box layui-code-view');

      if (othis.attr('lay-skin') || options.skin) {
        othis.addClass('layui-code-' + (othis.attr('lay-skin') || options.skin));
      }

      if ((ol.find('li').length / 100 | 0) > 0) {
        ol.css('margin-left', (ol.find('li').length / 100 | 0) + 'px');
      }

      if (othis.attr('lay-height') || options.height) {
        ol.css('max-height', othis.attr('lay-height') || options.height);
      }
    });
  });
}).addcss('modules/code.css', 'skincodecss');