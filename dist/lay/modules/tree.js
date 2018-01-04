/** layui-v2.2.4 MIT License By http://www.layui.com */
 ;

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
});