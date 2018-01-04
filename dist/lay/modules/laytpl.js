/** layui-v2.2.4 MIT License By http://www.layui.com */
 ;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
});