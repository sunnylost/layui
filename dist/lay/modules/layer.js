/** layui-v2.2.4 MIT License By http://www.layui.com */
 ;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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