/**
 @Name：layui.tree 树组件
 @Author：贤心
 @License：MIT
 */

layui.define('jquery', function(exports) {
    'use strict'

    let $ = layui.$,
        hint = layui.hint()

    let enterSkin = 'layui-tree-enter',
        Tree = function(options) {
            this.options = options
        }

    //图标
    let icon = {
        arrow: ['&#xe623;', '&#xe625;'], //箭头
        checkbox: ['&#xe626;', '&#xe627;'], //复选框
        radio: ['&#xe62b;', '&#xe62a;'], //单选框
        branch: ['&#xe622;', '&#xe624;'], //父节点
        leaf: '&#xe621;' //叶节点
    }

    /**
     * 展开或收起 el
     * @param el
     */
    function toggleNode(el) {
        let ul = el.children('ul'),
            a = el.children('a'),
            arrow = el.children('.layui-tree-spread')

        if (el.data('spread')) {
            el.data('spread', null)
            ul.removeClass('layui-show')
            arrow.html(icon.arrow[0])
            a.find('.layui-icon').html(icon.branch[0])
        } else {
            el.data('spread', true)
            ul.addClass('layui-show')
            arrow.html(icon.arrow[1])
            a.find('.layui-icon').html(icon.branch[1])
        }
    }

    /**
     * 收起 el，如果传入 sameLevelNode，那么当 el 与它不是同级元素时，向上查找，直到找到和
     * sameLevelNode 同级的祖先元素
     * @param el
     * @param sameLevelNode
     */
    function foldNode(el, sameLevelNode) {
        if (sameLevelNode && $.contains(el[0], sameLevelNode[0])) {
            return
        }

        let ul = el.children('ul'),
            a = el.children('a'),
            arrow = el.children('.layui-tree-spread')

        if (el.data('spread')) {
            el.data('spread', null)
            ul.removeClass('layui-show')
            arrow.html(icon.arrow[0])
            a.find('.layui-icon').html(icon.branch[0])
        }

        if (sameLevelNode) {
            foldNode(el.parent(), sameLevelNode)
        }
    }

    //初始化
    Tree.prototype.init = function(elem) {
        elem.addClass('layui-box layui-tree') //添加tree样式
        if (this.options.skin) {
            elem.addClass('layui-tree-skin-' + this.options.skin)
        }
        this.options.currentExpandedNode = null
        this.tree(elem)
        this.on(elem)
    }

    //树节点解析
    Tree.prototype.tree = function(elem, children) {
        let that = this,
            options = that.options
        let nodes = children || options.nodes

        layui.each(nodes, function(index, item) {
            let hasChild = item.children && item.children.length > 0
            let ul = $('<ul class="' + (item.spread ? 'layui-show' : '') + '"></ul>')
            let li = $(
                [
                    '<li ' + (item.spread ? 'data-spread="' + item.spread + '"' : '') + '>',
                    //展开箭头
                    (function() {
                        return hasChild
                            ? '<i class="layui-icon layui-tree-spread">' +
                                  (item.spread ? icon.arrow[1] : icon.arrow[0]) +
                                  '</i>'
                            : ''
                    })(),

                    //复选框/单选框
                    (function() {
                        return options.check
                            ? '<i class="layui-icon layui-tree-check">' +
                                  (options.check === 'checkbox'
                                      ? icon.checkbox[0]
                                      : options.check === 'radio' ? icon.radio[0] : '') +
                                  '</i>'
                            : ''
                    })(),

                    //节点
                    (function() {
                        let leaf

                        if (hasChild) {
                            leaf = item.spread ? icon.branch[1] : icon.branch[0]
                        } else {
                            leaf = icon.leaf
                        }

                        return `<a href="${item.href || 'javascript:;'}" ${
                            options.target && item.href ? 'target="' + options.target + '"' : ''
                        }><i class="layui-icon layui-tree-${hasChild ? 'branch' : 'leaf'}">${
                            leaf
                        }</i><cite>${item.name || '未命名'}</cite></a>`
                    })(),

                    '</li>'
                ].join('')
            )

            //如果有子节点，则递归继续生成树
            if (hasChild) {
                li.append(ul)
                that.tree(ul, item.children)
            }

            elem.append(li)

            //触发点击节点回调
            typeof options.click === 'function' && that.click(li, item)

            //伸展节点
            that.spread(li, item)

            //拖拽节点
            options.drag && that.drag(li, item)
        })
    }

    //点击节点回调
    Tree.prototype.click = function(elem, item) {
        let that = this,
            options = that.options
        elem.children('a').on('click', function(e) {
            layui.stope(e)
            options.click(item)
        })
    }

    //伸展节点
    Tree.prototype.spread = function(elem) {
        let that = this
        let accordion = this.options.accordion
        //执行伸展
        let open = function() {
            let node = that.options.currentExpandedNode

            if (accordion) {
                if (!node) {
                    if (!elem.data('spread')) {
                        node = elem
                    }
                } else {
                    if (node[0] !== elem[0] && !$.contains(node[0], elem[0])) {
                        foldNode(node, elem)
                        node = elem
                    } else {
                        if (!elem.data('spread')) {
                            node = elem
                        } else {
                            node = null
                        }
                    }
                }
            }

            that.options.currentExpandedNode = node

            toggleNode(elem)
        }

        //如果没有子节点，则不执行
        if (!elem.children('ul')[0]) return

        elem.children('.layui-tree-spread').on('click', open)
        elem.children('a').on('dblclick', open)
    }

    //通用事件
    Tree.prototype.on = function(elem) {
        let that = this,
            options = that.options
        let dragStr = 'layui-tree-drag'

        //屏蔽选中文字
        elem.find('i').on('selectstart', function() {
            return false
        })

        //拖拽
        if (options.drag) {
            $(document)
                .on('mousemove', function(e) {
                    let move = that.move
                    if (move.from) {
                        let treeMove = $('<div class="layui-box ' + dragStr + '"></div>')
                        e.preventDefault()
                        let $drag = $('.' + dragStr)
                        $drag[0] || $('body').append(treeMove)
                        $drag = $('.' + dragStr)
                        let dragElem = $drag[0] ? $drag : treeMove
                        dragElem.addClass('layui-show').html(move.from.elem.children('a').html())
                        dragElem.css({
                            left: e.pageX + 10,
                            top: e.pageY + 10
                        })
                    }
                })
                .on('mouseup', function() {
                    let move = that.move
                    if (move.from) {
                        move.from.elem.children('a').removeClass(enterSkin)
                        move.to && move.to.elem.children('a').removeClass(enterSkin)
                        that.move = {}
                        $('.' + dragStr).remove()
                    }
                })
        }
    }

    //拖拽节点
    Tree.prototype.move = {}
    Tree.prototype.drag = function(elem, item) {
        let that = this
        let a = elem.children('a'),
            mouseenter = function() {
                let othis = $(this),
                    move = that.move
                if (move.from) {
                    move.to = {
                        item: item,
                        elem: elem
                    }
                    othis.addClass(enterSkin)
                }
            }
        a.on('mousedown', function() {
            let move = that.move
            move.from = {
                item: item,
                elem: elem
            }
        })
        a
            .on('mouseenter', mouseenter)
            .on('mousemove', mouseenter)
            .on('mouseleave', function() {
                let othis = $(this),
                    move = that.move
                if (move.from) {
                    delete move.to
                    othis.removeClass(enterSkin)
                }
            })
    }

    //暴露接口
    exports('tree', function(options) {
        let tree = new Tree((options = options || {}))
        let elem = $(options.elem)
        if (!elem[0]) {
            return hint.error('layui.tree 没有找到' + options.elem + '元素')
        }
        tree.init(elem)
    })
})
