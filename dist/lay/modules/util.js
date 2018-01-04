/** layui-v2.2.4 MIT License By http://www.layui.com */
 ;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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