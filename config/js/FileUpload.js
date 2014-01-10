/**
 * Class: Bev.FileUpload
 * 文件上传控件。
 */
Bev.FileUpload = Bev.Class({

    /**
     * APIProperty: body
     * {HTMLElement} 容器
     */
    body:null,

    /**
     * APIProperty: fileName
     * {String} 所存文件的名称
     */
    fileName:null,

    /**
     * APIProperty: title
     * {String} 该选项所显示的标题
     */
    title:null,

    /**
     * APIProperty: onUpload
     * {Function} 当图片上传成功后触发
     */
    onUpload:function(){},

    /**
     * APIProperty: clickSubmit
     * {Function} 点击提交按钮
     */
    clickSubmit:function(){},

    _iframe:null,

    _form:null,

    _fileInput:null,


    /**
     * Constructor: Bev.FileUpload
     * 实例化 FileUpload 类。
     *
     */
    initialize: function(options) {
        var t = this;
        for(var key in options){
            this[key] = options[key];
        }
        t.body = $(t.body);
        this.create();
        //this.bindEvent();
    },

    create:function(){
        var t = this;

        var frameName = "bevFormFrame"+Math.round(Math.random()*10000);

        var form = this._form = $("<form>")
            .appendTo(t.body)
            .attr({
                "name":"bevForm"+Math.round(Math.random()*10000),
                "method":"post",
                "enctype":"multipart/form-data",
                "target":frameName,
                "action":"fileupload?name="+(t.fileName||"test")
            });

        if(this.title){
            var titleDiv = $("<div>")
                .html(t.title+":")
                .appendTo(form);
        }


        var dv = $("<div>")
            .appendTo(form);
        var fileInput = this._fileInput = $("<input>")
            .attr({
                "type":"file",
                "name":"bevFile"
            })
            .css({
                "width":"150px"
            })
            .appendTo(dv);

        var dv = $("<div>")
            .appendTo(form);
        var submitInput = $("<input>")
            .attr({
                "type":"submit",
                "name":"submit",
                "value":"提交"
            })
            .click(this.clickSubmit)
            .appendTo(dv);

        var iframe = this._iframe = $("<iframe>")
            .attr({
                "id":frameName,
                "name":frameName
            })
            .css({
                "display":"none"
            })
            .bind("load",function(){
                t.bindEvent();
            })
            .appendTo(form);
    },

    bindEvent:function(){
        var t = this;
        this._iframe.unbind();
        this._iframe.bind("load",function(){
            t.onUpload();
        });
//        function eventPush(obj, event, handler) {
//            if (obj.addEventListener) {
//                obj.addEventListener(event, handler, false);
//            } else if (obj.attachEvent) {
//                obj.attachEvent('on'+event, handler);
//            }
//        }
//
//        eventPush(this._iframe[0],'load',function(){
//            t.onUpload();
//        });
    },

    setFileName:function(fileName){
        this.fileName = fileName;
        this._form.attr({
            "action":"fileupload?name="+this.fileName
        });
    },

    CLASS_NAME: "Bev.FileUpload"
});
