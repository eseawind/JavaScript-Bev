/**
 * Class: Bev.Accordion
 * 手风琴控件。
 */
Bev.Select = Bev.Class({

    nameValues:null,

    div:null,

    title:null,

    onSelect:function(){},

    defaultValue:null,

    /**
     * Constructor: SuperMap.Bev.Accordion
     * 实例化 Accordion 类。
     *
     * Parameters:
     * body - {HTMLElement} 父容器
     * config - {Array} 初始化参数
     *
     * Examples:
     * (code)
     * var myAccordion = new Bev.Accordion({
         *     "body":$("#divid"),
         *     "html":[
         *        {
         *            "title":"查询",
         *            "body":$("<p>this is a examples</p><br><p>this is a examples</p><br><p>this is a examples</p>")
         *        }
         *    ]
         * });
     * (end)
     */
    initialize: function(options) {
        for(var key in options){
            this[key] = options[key];
        }
        this.create();
    },

    create:function(){
        if(!this.div){
            this.div = $("<div>")
                .css({
                    "margin":"10px 0px 0px 0px"
                });
        }
        if(this.title){
            var d1 = $("<div>")
                .html(this.title)
                .appendTo(this.div);
        }

        var nvs = this.nameValues;
        if(nvs){
            this.createSelectBar(this.div,nvs,this.onSelect,30,150);
        }
    },

    createSelectBar:function(div,txtArr,onSelect,height,width){
        var s1,o1,me=this;

        s1 = $("<select>")
            .css({
                "height":height+"px",
                "width":width+"px"
            })
            .change(function(onSelect){
                return function(){
                    onSelect($(this).attr("value"));
                    //$(me.mapFrame).focus();
                }
            }(onSelect))
            .appendTo(div);

        for(var i=0;i<txtArr.length;i++){
            var curValue = txtArr[i].value||txtArr[i];
            if(curValue==this.defaultValue){
                o1 = $("<option>")
                    .html(txtArr[i].name||txtArr[i])
                    .attr({
                        "value":curValue,
                        //"disabled":true,
                        "selected":true
                    })
                    .appendTo(s1);
            }
            else{
                o1 = $("<option>")
                    .html(txtArr[i].name||txtArr[i])
                    .attr("value",curValue)
                    .appendTo(s1);
            }
        }

        return s1;
    },

    CLASS_NAME: "Bev.Select"
});
