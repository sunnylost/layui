/** layui-v2.2.4 MIT License By http://www.layui.com */
 ;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
});