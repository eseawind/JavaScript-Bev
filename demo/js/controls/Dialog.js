/**
 * Class: Bev.Dialog
 * 窗口面板。
 */
Bev.Dialog = Bev.Class({

    /**
     * APIProperty: body
     * {HTMLElement} 父容器
     */
    body:null,

    /**
     * APIProperty: content_body
     * {HTMLElement} 放置内容的容器
     */
    content_body:null,

    /**
     * APIProperty: isHide
     * {Boolean} 是否隐藏
     */
    isHide:false,

    /**
     * Property: content
     * {HTMLElement} 所展现的内容元素
     */
    content:null,

    /**
     * APIProperty: head
     * {Object} 窗口头部符号和文字标题
     * (code)
     * var head = {
     *    "icon":"className",
     *    "text":"标题"
     * }
     * (end)
     */
    head:{
        "icon":"",
        "text":"test"
    },

    /**
     * Property: isFilesLoaded
     * {boolean} 依赖的文件是否加载完成
     *
     * */
    isFilesLoaded:false,

    isDialog:false,

    /**
     * Constructor: Bev.Dialog
     * 实例化 Dialog 类。
     *
     * Parameters:
     * content - {HTMLElement} 需要展现的内容
     * head - {Object} 标题参数。
     * isHide - {Boolean} 是否隐藏
     *
     * Examples:
     * (code)
     * var dialog = new Bev.Dialog(null,{
     *    "icon":"measure_16_16",
     *    "text":"量&nbsp;&nbsp;&nbsp;&nbsp;算"
     * });
     * (end)
     */
    initialize: function(content, head,isHide) {
        this.content = content;
        this.head = head;
        this.isHide = !!isHide;
        this.create();
    },

    /**
     * Method: create
     * 创建该控件的dom对象。
     */
    create:function () {
        var body, content,t = this;

        this.body = body = $("<div title=\""+t.head.text+"\" class=\"dialog\"></div>")
            .appendTo($("body"));
        this.content_body = content = $("<div class=\"jsBev_sample\"></div>");
        content.appendTo(body);
        if (this.content)content.append(this.content);

        this.loadFiles(function(){
            var body = t.body;
            if(!t.isDialog){
                body.dialog();
                if(t.isHide)body.dialog("hide");
                t.isDialog = true;
            }
        })
    },

    /**
     * APIMethod: getContentBody
     * 获取放置内容的容器。
     *
     * Returns:
     * {HTMLElement}  返回 Dom 对象。
     */
    getContentBody:function () {
        return this.content_body;
    },

    /**
     * APIMethod: show
     * 显示dialog
     */
    show:function () {
        var t = this;
        this.loadFiles(function(){
            if(t.isDialog&&t.isHide){
                t.body.dialog("show");
                t.isHide = false;
            }
        })
    },

    /**
     * APIMethod: hide
     * 隐藏dialog
     */
    hide:function () {
        var t = this;
        this.loadFiles(function(){
            if(t.isDialog&&!t.isHide){
                t.body.dialog("hide");
                t.isHide = true;
            }
        })
    },

    /**
     * APIMethod: on
     * 给dialog绑定事件。
     *
     * Parameters:
     * event - {String}事件类型
     * (code)
     * //目前提供如下事件类型
     * //dialogbeforeclose
     * //dialogclose
     * //dialogopen
     * (end)
     * fun - {Function} 方法
     *
     * Returns:
     * {HTMLElement}  返回 Dom 对象。
     */
    on:function (event, fun) {
        this.body.on(event, fun);
    },

    /**
     * Method: loadFiles
     * 加载依赖的脚本文件。
     *
     * Parameters:
     * cb - {Method} 加载完成后触发该方法
     */
    loadFiles:function (cb) {
        var t = this;
        if(!this.isFilesLoaded){
            Bev.loader.js([
                "demo/js/ui/jquery.ui.core.js",
                "demo/js/ui/jquery.ui.widget.js",
                "demo/js/ui/jquery.ui.position.js",
                "demo/js/ui/jquery.ui.mouse.js",
                "demo/js/ui/jquery.ui.draggable.js",
                "demo/js/ui/jquery.ui.bevbutton.js",
                "demo/js/ui/jquery.ui.dialog.js"
            ],function(){
                t.isFilesLoaded = true;
                if(cb)cb();
            });
        }
        else{
            if(cb)cb();
        }
    },

    CLASS_NAME: "Bev.Dialog"
});
