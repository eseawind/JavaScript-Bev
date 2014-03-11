/**
 * Class: Bev.ConfigTool
 * 配置面板。
 */
Bev.ConfigTool = Bev.Class({
    configObject:null,
    div:null,
    onload:function(){},
    _mapFrame:null,
    _keyupTimeoutId:null,
    _eventMap:{},
    _mapLoaded:false,
    _body:null,
    /**
     * Constructor: Bev.ConfigTool
     * 实例化 ConfigTool 类。
     */
    initialize: function(options) {
        var t = this;
        for(var key in options){
            this[key] = options[key];
        }
        this._mapFrame = document.getElementById("mapFrame");
        Bev.loader.js("config/js/Select.js",function(){
            t.create();
            t.onload();
        });
    },

    create:function(){
        var t = this;
        if(!this.div){
            this.div = $("<div>");
        }
        this._body = $("<div>")
            .appendTo(this.div)
            .css({
               "overflow":"auto",
               "position":"absolute",
               "height":"100%",
               "width":"100%"
            });
        var ca = this.configObject;
        if(ca){
             var dv = $("<div>").appendTo(this._body);
             var myAccordion = new Bev.Accordion({
                 body:dv,
                 isRoundedCorner:false
             });
             var categoryArr = ca.configInfo;
             for(var i=0;i<categoryArr.length;i++){
                 var categoryObj = categoryArr[i];

                 var category = categoryObj.category;
                 var html = $("<div>");
                 var contents = categoryObj.contents;
                 for(var j=0;j<contents.length;j++){
                      var child = contents[j];
                      if(child.type == "select"){
                          var div = this.createSelect(child);
                          html.append(div);
                      }
                      else if(child.type == "textArea"){
                          this.createTextArea(child,html);
                      }
                      else if(child.type == "disableTextArea"){
                          this.createDisableTextArea(child,html);
                      }
                     else if(child.type == "checkboxList"){
                          this.createCheckBoxList(child,html);
                     }
                     else if(child.type == "checkbox"){
                          this.createCheckBox(child,html);
                     }
                      else if(child.type == "fileupload"){
                          this.createFileUpload(child,html);
                      }
                     else if(child.type == "checkbox_fileupload"){
                          this.createCheckBoxFileUpload(child,html);
                     }
                    else if(child.type == "checkbox_textArea"){
                        this.createCheckBoxTextArea(child,html);
                    }
                    else if(child.type == "add_select"){
                        this.createAddSelect(child,html);
                    }
                    else if(child.type == "configWindow"){
                        this.createConfigWindowBtn(child,html);
                    }
                 }

                 myAccordion.addItem({
                     title:category,
                     body:html
                 });
             }

             var d1 = $("<div>")
                 .css({
                     "padding":"5px",
                     "text-align":"right"
                 })
                 .prependTo(this._body);

             var btn = $("<a>")
                 .attr("href","#")
                 .html("生成页面>>")
                 .css({
                     "text-decoration":"underline",
                     "color":"#999999",
                     "cursor":"pointer"
                 })
                 .click(function(){
                     t.createPage();
                 })
                 .appendTo(d1);
        }
    },

    createPage:function(){
        var t = this;
        var url = "config?m=createPage";
        t.request(url,function(){
            window.location = "index.html";
        });
    },

    createConfigWindowBtn:function(obj,div1){
        var t = this;

        var div = $("<div>")
            .css({
                "margin":"10px 0px 0px 0px"
            })
            .appendTo(div1);

        var checkbox = $("<input>")
            .attr({
                "type":"checkbox"
            })
            .click(function(obj){
                return function(){
                    if($(this).attr("checked")=="checked"){
                        obj.defaultValue = 1;
                    }
                    else{
                        obj.defaultValue = 0;
                    }

                    request();
                }
            }(obj))
            .appendTo(div);

        if(obj.defaultValue+"" == "1"){
            checkbox.attr({
                "checked":"checked"
            });
        }

        var sp = $("<span>")
            .html(obj.title)
            .appendTo(div);

        var infoWinBtn = $("<button>")
            .bevbutton({
                icons:{
                    primary:"glyphicon-maximize"
                }
            })
            .attr({
                "title":"打开详细配置窗口"
            })
            .css({
                "height":" 30px",
                "width":"30px",
                "margin-left":"5px",
                "vertical-align":"top"
            })
            .click(function(obj){
                return function(){
                    createDialog(obj);
                }
            }(obj))
            .appendTo(div);


        function createDialog(obj){
            //var t=this;
            var dialog;
            var dialogParams={
                title: obj.title,
                autoOpen: false,
                height: 400,
                width: 500,
                modal: true,
                buttons: {
                    OK:function(){
                        request();
                        dialog.destroy();
                    },
                    Cancel:function(value,id){
                        dialog.destroy();
                    }
                },
                close:function(value,id){
                    dialog.destroy();
                }
            };
            dialog=new Bev.Dialog(null, {"text":""},null,dialogParams);
            var contentBody = dialog.getContentBody();

            var options = obj.options;
            obj.curOptions = {};
            if(options&&options.length){
                for(var i=0;i<options.length;i++){
                    var obj1 = options[i];
                    obj.curOptions[obj1.id] = obj1.defaultValue;
                    switch(obj1.type){
                        case "textArea":
                            t.createTextArea(obj1,contentBody,function(obj1,obj){
                                return function(value){
                                    if(value&&value!=""){
                                        obj.curOptions[obj1.id] = value;
                                        obj1.defaultValue = value;
                                    }
                                }
                            }(obj1,obj),true);
                            break;
                        case "select":
                            t.createSelect(obj1,function(obj1,obj){
                                return function(value){
                                    obj.curOptions[obj1.id] = value;
                                    obj1.defaultValue = value;
                                }
                            }(obj1,obj)).appendTo(contentBody);
                            break;
                        default:break;
                    }
                }
            }
        }

        function request(){
            var url="config?id="+obj.id+"&value="+obj.defaultValue;

            var ops = obj.curOptions;
            var tp = [];
            for(var key in ops){
                tp.push("\""+key+"\""+":\""+ops[key]+"\"");
            }
            var tp1 = "{"+tp.join(",")+"}";

            t.request(url,function(){
                t.redrawMapFrame();
            },"POST",{"options":tp1});
        }
    },

    createAddSelect:function(obj,div1){
         var t = this;
         var title = obj.title;
         var defaultValue1 = [];
         var curOption = {};

         var div = $("<div>")
             .css({
                 "margin":"10px 0px 0px 0px"
             })
             .appendTo(div1);
         if(title){
             var titleDom = $("<span>")
                 .css({
                     "display":"inline-block",
                     "padding":"7px 0px 0px 0px"
                 })
                 .html(title)
                 .appendTo(div);
         }

        var infoWinBtn = $("<button>")
            .bevbutton({
                icons:{
                    primary:"glyphicon-maximize"
                }
            })
            .attr({
                "title":"打开详细配置窗口"
            })
            .css({
                "height":" 30px",
                "width":"30px",
                "margin-left":"5px",
                "vertical-align":"top"
            })
            .click(function(obj){
                return function(){
                    createDialog(obj);
                }
            }(obj))
            .appendTo(div);

        function createDialog(obj){
            //var t=this;
            var dialog;
            var dialogParams={
                title: obj.title,
                autoOpen: false,
                height: 400,
                width: 500,
                modal: true,
                buttons: {
                    OK:function(obj,id){
                        return function(){
                            var url="config?id="+id;
                            var data=null;
                            var dataArray = [];
                            for(var i=0;i<defaultValue1.length;i++){
                                var option = defaultValue1[i];
                                var dataArray1 = [];
                                for(var key in option){
                                    var value1 = option[key];

                                    dataArray1.push("\""+key+"\":\""+value1+"\"");
                                }
                                dataArray.push("{"+dataArray1.join(",")+"}");
                            }
                            data = "["+dataArray.join(",")+"]";

                            t.request(url,function(){
                                t.redrawMapFrame();
                            },"POST",{"value":data});
                            dialog.destroy();
                        }
                    }(obj,obj.id),
                    Cancel:function(value,id){
                        dialog.destroy();
                    }
                },
                close:function(value,id){
                    dialog.destroy();
                }
            };
            dialog=new Bev.Dialog(null, {"text":""},null,dialogParams);
            var contentBody = dialog.getContentBody();

            var paramDiv = $("<div>");

            var mySelect = new Bev.Select({
                nameValues:obj.nameValues,
                onSelect:function(paramDiv,curOption,nameValues){
                    return function(value){
                        var index = parseInt(value);
                        var obj = nameValues[index];

                        paramDiv.html("");
                        t.destroyObject(curOption);
                        createOptionsDom(obj,paramDiv,curOption);
                    }
                }(paramDiv,curOption,obj.nameValues)
            });

            mySelect.div.appendTo(contentBody);
            paramDiv.appendTo(contentBody);

            if(obj.nameValues&&obj.nameValues[0]){
                createOptionsDom(obj.nameValues[0],paramDiv,curOption);
            }
            var tableDiv = $("<div>");
            var addBtn = $("<button>增加</button>")
                .bevbutton({
                    icons:{
                        primary:"glyphicon-plus"
                    }
                })
                .css({
                    "height":" 30px",
                    "margin":"10px 0px 0px 0px"
                })
                .click(function(){
                    defaultValue1.push(t.cloneObject(curOption));
                    createList(defaultValue1,tableDiv);

                    obj.defaultValue = defaultValue1;
                })
                .appendTo($("<div>").appendTo(contentBody));

            tableDiv.appendTo(contentBody);

            var defaultValue = obj.defaultValue;
            if(defaultValue&&defaultValue!="null"&&defaultValue!=""){
                defaultValue1 = eval(defaultValue);

                createList(defaultValue1,tableDiv);
            }
        }

        function createOptionsDom(obj,paramDiv,curOption){
            var options = obj.options;
            curOption.type = obj.value;
            curOption.typeName = obj.name;
            if(options&&options.length){
                for(var i=0;i<options.length;i++){
                    var obj1 = options[i];
                    curOption[obj1.id] = obj1.defaultValue;
                    switch(obj1.type){
                        case "textArea":
                            t.createTextArea(obj1,paramDiv,function(id,curOption){
                                return function(value){
                                    if(value&&value!=""){
                                        curOption[id] = value;
                                    };
                                }
                            }(obj1.id,curOption),true);
                            break;
                        case "select":
                            t.createSelect(obj1,function(id,curOption){
                                return function(value){
                                    curOption[id] = value;
                                }
                            }(obj1.id,curOption)).appendTo(paramDiv);
                            break;
                        default:break;
                    }
                }
            }
        }

        function createList(defaultValue1,tableDiv){
            tableDiv.html("");
            if(defaultValue1.length&&defaultValue1.length>0){
                var table = $("<table>").appendTo(tableDiv);
                for(var i=0;i<defaultValue1.length;i++){
                    obj1 = defaultValue1[i];
                    var type = obj1.typeName;
                    var title = obj1.layerName||"";

                    var tr = $("<tr>").appendTo(table);
                    var css = {"border":"1px solid #333","margin":"0px"};
                    $("<td>").css(css).html(i+1).appendTo(tr);
                    $("<td>").css(css).html(type).appendTo(tr);
                    $("<td>").css(css).html(title).appendTo(tr);

                    createBtn("glyphicon-minus",function(i){
                        return function(){
                            defaultValue1.splice(i,1);
                            createList(defaultValue1,tableDiv);
                        }
                    }(i),tr);

                    if(i!=defaultValue1.length-1){
                        createBtn("glyphicon-chevron-down",function(i){
                            return function(){
                                var tp = defaultValue1.splice(i,1);
                                tp = tp[0];
                                defaultValue1.splice(i+1,0,tp);
                                createList(defaultValue1,tableDiv);
                            }
                        }(i),tr);
                    }

                    if(i!=0){
                        createBtn("glyphicon-chevron-up",function(i){
                            return function(){
                                var tp = defaultValue1.splice(i,1);
                                tp = tp[0];
                                defaultValue1.splice(i-1,0,tp);
                                createList(defaultValue1,tableDiv);
                            }
                        }(i),tr);
                    }
                }
            }
            function createBtn(classN,click,tr){
                var minusBtn = $("<button>")
                    .bevbutton({icons:{primary:classN}})
                    .css({
                        "height":" 20px",
                        "width":" 20px"
                    })
                    .click(click)
                    .appendTo($("<td>").appendTo(tr));

                minusBtn.children("span").css("left","2px");
            }
        }
    },

    createSelect:function(obj,onselect){
         var t = this;
         //var options = obj.options;
         var nameValues = obj.nameValues;
         var id = obj.id;
         var title = obj.title;
         var mySelect;

        mySelect = new Bev.Select({
            nameValues:nameValues,
            defaultValue:obj.defaultValue,
            title:title,
            onSelect:function(id){
                if(onselect){
                    return onselect;
                }
                return function(value){
                    var index = parseInt(value);

                    var obj = nameValues[index];
                    if(obj.options){
                        mySelect.infoWinBtn.css({
                            "display":"inline"
                        });
                        mySelect.infoWinBtn.dialogParam = {
                            "obj":obj,
                            "id":id,
                            "value":value
                        };
                        t.createDialog(obj,$("body"),id,value);
                    }
                    else{
                        mySelect.infoWinBtn.css({
                            "display":"none"
                        });
                        try{if(Bev.configDialog)Bev.configDialog.destroy();}catch(e){};
                    }
                    var url = "config?id="+id+"&value="+value;
                    t.request(url,function(){
                        t.redrawMapFrame();
                    });
                }
            }(id)
        });

        mySelect.infoWinBtn = $("<button>")
            .bevbutton({
                icons:{
                    primary:"glyphicon-maximize"
                }
            })
            .attr({
                "title":"打开详细配置窗口"
            })
            .css({
                "display":"none",
                "height":" 30px",
                "width":"30px",
                "margin-left":"5px",
                "vertical-align":"top"
            })
            .click(function(){
                var obj = mySelect.infoWinBtn.dialogParam.obj;
                var id = mySelect.infoWinBtn.dialogParam.id;
                var value = mySelect.infoWinBtn.dialogParam.value;
                t.createDialog(obj,$("body"),id,value);
            })
            .appendTo(mySelect.div);

        var index = parseInt(obj.defaultValue);
        var obj1 = nameValues[index];
        if(obj1.options){
            mySelect.infoWinBtn.css({
                "display":"inline"
            });
            mySelect.infoWinBtn.dialogParam = {
                "obj":obj1,
                "id":id,
                "value":obj.defaultValue
            };
        }

        return mySelect.div;
    },

    createDialog: function(option,div,id,value){
        var t=this;
        var dialogParams={
            title: option.name+"设置",
            autoOpen: false,
            height: 200,
            width: 350,
            modal: true,
            buttons: {
                OK:function(obj,id,value){
                    return function(){
                        var url="config?id="+id+"&value="+value;
                        var data=null;
                        var dataArray = [];
                        var option = obj.options
                        for(var i=0;i<option.length;i++){
                             var key = option[i].id;
                             var value1 = option[i].defaultValue;

                            dataArray.push("\""+key+"\":\""+value1+"\"");
                        }
                        data = "{"+dataArray.join(",")+"}";

                        t.request(url,function(){
                            t.redrawMapFrame();
                        },"POST",{"option":data});
                        dialog.destroy();
                    }
                }(option,id,value),
                Cancel:function(value,id){
                    return function(){
//                        var url="config?id="+id+"$value="+value;
//                        t.request(url,function(){
//                            t.redrawMapFrame();
//                        });
                        dialog.destroy();
                    }
                }(value,id)
            },
            close:function(value,id){
                return function(){
//                    var url="config?id="+id+"$value="+value;
//                    t.request(url,function(){
//                        t.redrawMapFrame();
//                    });
                    dialog.destroy();
                }
            }(value,id)
        };
        var dialog=Bev.configDialog=new Bev.Dialog(null, {"text":""},null,dialogParams);
        var contentBody = dialog.getContentBody();
        for(var i=0;i<option.options.length;i++){
            var obj=option.options[i];
            switch(obj.type){
                case "textArea":
                    t.createTextArea(obj,contentBody,function(obj){
                        return function(value){
                            if(value&&value!=""){
                                obj.defaultValue = value;
                            };
                        }
                    }(obj),true);
                    break;
                case "select":
                    this.createSelect(obj,function(obj){
                         return function(value){
//                             var index = parseInt(value);
//
//                             var obj1 = obj.nameValues[index];
//                             var value1 = obj
                             obj.defaultValue = value;
                         }
                    }(obj)).appendTo(contentBody);
//                    if(obj.id=="resolution"){
//                        resolutions=obj.nameValues;
//                    }
                    break;
                default:
                    throw new Error("暂不支持创建此类型");
                    break;
            }
        }
    },

    createTextArea:function(obj,div,callback,isNotDelay){
        var t = this;
        //var options = obj.options;
        var title = obj.title;
        var id = obj.id;
        var defaultValue = obj.defaultValue;

        this.createInput(div,title,defaultValue,null,null,null,function(id,callback){
            return function(value){
                value = value||"";
                if(callback){
                    callback(value);
                }
                else{
                    var url = "config?id="+id+"&value="+value;
                    t.request(url,function(){
                        t.redrawMapFrame();
                    });
                }
            }
            //t.confParam.title = value;
        }(id,callback),isNotDelay);

        if(obj.info){
            var d = $("<div>")
                .css({
                    "fontSize":"10px",
                    "opacity":0.8
                })
                .html(obj.info)
                .appendTo(div);
        }
    },

    createDisableTextArea:function(obj,div){
        var t = this;
        //var options = obj.options;
        var title = obj.title;
        var id = obj.id;
        var defaultValue = obj.defaultValue;
        var key = obj.key;
        var temp = this.createInput(div,title,defaultValue,null,null,true,null);
        var input = temp[1];
        this.bindMapEvents("moveend",function(key,input,id){
            return function(map){
                setMapStatus(key,input,map);
                var url = "config?id="+id+"&value="+input.attr("value");
                t.request(url);
            }
        }(key,input,id));

        function setMapStatus(key,input,map){
            if(key){
                var center = map.getCenter();
                var zoom = map.getZoom();
                if(key=="centerLon"){
                    input.attr("value",center.lon);
                }
                else if(key=="centerLat"){
                    input.attr("value",center.lat);
                }
                else if(key=="zoom"){
                    input.attr("value",zoom);
                }
            }
        }
    },

    createCheckBoxTextArea:function(obj,div){
        var t = this;
        //var options = obj.options;
        var title = obj.title;
        var dValues = obj.defaultValue.split(",");
        var isSelect = (dValues[0]+"")=="1"?true:false;
        var text = dValues[1];
        var id = obj.id;
        var checkBox;

        var bd = $("<div>")
            .css({
                "margin":"10px 0px 0px 0px"
            })
            .html(title);

        if(div)div.append(bd);

        var bd = $("<div>")
            .css({
                "margin":"10px 0px 0px 0px"
            });
        if(div)div.append(bd);

        var sp1 = $("<span>")
            .css({
                "display":"inline-block"
            })
            .appendTo(bd);
        checkBox = this.createCheckBoxDom(null,isSelect,sp1,function(id){
            return function(box){
                request();
            }
        }(id));

        var sp2 = $("<span>")
            .css({
                "display":"inline-block",
                "width":"150px"
            })
            .appendTo(bd);
        this.createInput(sp2,null,text,null,null,null,function(id){
            return function(value){
                text = value||"";
                request();
//                var url = "config?id="+id+"&value="+value;
//                t.request(url,function(){
//                    t.redrawMapFrame();
//                });
            }
            //t.confParam.title = value;
        }(id));

        function request(){
            var isSelect = "0";
            if(checkBox.attr("checked")=="checked"){
                isSelect = "1";
            }

            var url = "config?id="+id+"&value="+isSelect+","+text;
            t.request(url,function(){
                t.redrawMapFrame();
            });
        }
    },

    bindMapEvents:function(type,event,isForce){
        var t = this;
        if(event){
            if(!this._eventMap[type]){
                this._eventMap[type] = [];
            }
            this._eventMap[type].push(event);
        }
        if(isForce)this._mapLoaded=false;
        if(this._mapLoaded==false){
            this.checkMapLoaded(function(map){
                t._mapLoaded = true;
                for(var key in t._eventMap){
                     var eventList = t._eventMap[key];
                     map.events.register("moveend", map, function(eventList){
                         return function(){
                             for(var i=0;i<eventList.length;i++){
                                 try{eventList[i](this);}catch(e){};
                             }
                         }
                     }(eventList));
                }
            });
        }
    },

    checkMapLoaded:function(callback){
        var t = this;
        var map = this._mapFrame.contentWindow.map;
        if(map){
            callback(map);
        }
        else{
            window.setTimeout(function(callback){
                return function(){
                    t.checkMapLoaded(callback);
                }
            }(callback),2000);
        }
    },

    createInput:function(container,title,defaultContent,width1,width2,isDisable,keyup,isNotDelay){
        var d0,d1;
        var t = this;

        if(title){
            d0 = $("<div>")
                .css({
                    "padding-top":"5px"
                })
                .html(title);

            if(width1)d0.css("width",width1);
            if(container)d0.appendTo(container);
        }

        d1 = $("<input>")
            .attr({
                "value":defaultContent||"",
                "type":"text"
            })
            .css({
                "width":width2||"200px",
                "margin-right":"5px"
            });
        if(container)d1.appendTo(container);

        if(isDisable)d1.attr({
            "disabled":"disabled"
        });

        if(keyup){
            d1.keyup(function(keyup,isNotDelay){
                return function(){
                    var target = this;

                    if(!isNotDelay){
                        if(t._keyupTimeoutId){
                            window.clearTimeout(t._keyupTimeoutId)
                        }
                        t._keyupTimeoutId = window.setTimeout(function(target,keyup){
                            return function(){
                                keyup($(target).attr("value"));
                            }
                        }(target,keyup),2000);
                    }
                    else{
                        keyup($(target).attr("value"));
                    }
                }
            }(keyup,isNotDelay));
        }

        return [d0,d1];
    },

    createCheckBoxList:function(obj,div){
        var t = this;
        //var options = obj.options;
        var title = obj.title;
        var list = obj.list;
        var defaultValue = obj.defaultValue;
        var id = obj.id;

        var bd = $("<div>")
            .css({
                "margin":"10px 0px 0px 0px"
            });

        if(div)div.append(bd);

        var d1 = $("<div>")
            .html(title)
            .appendTo(bd);

        d1 = $("<div>")
            .appendTo(bd);

        var boxList = [];
        var checkBoxChange = function(boxList,id){
            return function(){
                var checkedArray = [];
                for(var i=0;i<boxList.length;i++){
                    var checkBox = boxList[i];
                    if(checkBox.attr("checked")=="checked"){
                        checkedArray.push((i+1)+"");
                    }
                }
                var checkedStr = checkedArray.join(",");

                var url = "config?id="+id+"&value="+checkedStr;
                t.request(url,function(){
                    t.redrawMapFrame();
                });
            }
        }(boxList,id)
        for(var i=0;i<list.length;i++){
            var isSelect = defaultValue.indexOf((i+1)+"")>=0?true:false;
            var checkBox = this.createCheckBoxDom(list[i].title,isSelect,d1,checkBoxChange);
            boxList.push(checkBox);
        }

        return bd;
    },

    createCheckBox:function(obj,div){
        var t = this;
        //var options = obj.options;
        var title = obj.title;
        var isSelect = (obj.defaultValue+"")=="1"?true:false;
        var id = obj.id;

        var bd = $("<div>")
            .css({
                "margin":"10px 0px 0px 0px"
            });

        if(div)div.append(bd);

        this.createCheckBoxDom(title,isSelect,bd,function(id){
           return function(box){
               var isSelect = "0";
               if(box.attr("checked")=="checked"){
                   isSelect = "1";
               }

               var url = "config?id="+id+"&value="+isSelect;
               t.request(url,function(){
                   t.redrawMapFrame();
               });
           }
        }(id));
    },

    createFileUpload:function(obj,div,callbacks){
        var t = this;
        //var options = obj.options;
        var title = obj.title;
        var dValues = obj.defaultValue;

        var bd = $("<div>")
            .css({
                "margin":"10px 0px 0px 0px"
            })
            .html(title);

        if(div)div.append(bd);

        var bd = $("<div>")
            .css({
                "margin":"10px 0px 0px 0px"
            });
        if(div)div.append(bd);

        var sp1 = $("<span>")
            .css({
                "display":"inline-block",
                "vertical-align":"top"
            })
            .appendTo(bd);

        var sp2 = $("<span>")
            .css({
                "display":"inline-block",
                "width":"150px"
            })
            .appendTo(bd);
        var onUpload=callbacks&&callbacks["onUpload"]||null;
        var clickSubmit=callbacks&&callbacks["clickSubmit"]||null;
        var fileUpLoad = new Bev.FileUpload({
            "body":sp2,
            "submitbtText":"提交",
            "onUpload":onUpload,
            "clickSubmit":clickSubmit
        });

        return sp1;
    },

    createCheckBoxFileUpload:function(obj,div){
        var t=this;

        var dValues = obj.defaultValue.split(",");
        var isSelect = (dValues[0]+"")=="1"?true:false;
        var imgSrc = dValues[1];
        var id=obj.id;
        var checkBox;
        var curImgSrc = "logo00.png";

         var sp1=t.createFileUpload(obj,div,{"onUpload":function(){
            request();
        },"clickSubmit":null});

        checkBox = t.createCheckBoxDom(null,isSelect,sp1,function(id){
            return function(box){
                request();
            }
        }(id));

        function request(){
            var isSelect = "0";
            if(checkBox.attr("checked")=="checked"){
                isSelect = "1";
            }

            var url = "config?id="+id+"&value="+isSelect+","+curImgSrc;
            t.request(url,function(){
                t.redrawMapFrame();
            });
        }
    },


    /**
     * 创建复选框
     * */
    createCheckBoxDom:function(title,isChecked,body,onChange){
        var d1,d2;

        d1 = $("<div>")
            .appendTo(body);

        d3 = $("<input>")
            .attr({
                "type":"checkbox",
                "name":title
            })
            .change(function(){
                if(onChange)onChange($(this));
            })
            .appendTo(d1);

        if(isChecked){
            d3.attr({
                "checked":"checked"
            });
        }
        if(title){
            d2 = $("<span>")
                .html(title)
                .appendTo(d1);
        }

        return d3;
    },

    redrawMapFrame:function(){
        if(this._mapFrame.contentWindow.map){this._mapFrame.contentWindow.map = null}
        this._mapFrame.src = "configWin.jsp?t="+Math.round(Math.random()*1000);
        this.bindMapEvents(null,null,true);
    },

    request:function(url,callback,type,data){
        $.ajax({
            "dataType":type=="GET"?"jsonp":"json",
            "error":function(callback){return function(){callback&&callback();}}(callback),
            "success":function(callback){return function(data){callback&&callback(data);}}(callback),
            "type":type||"GET",
            "url":url,
            "data":data||null
        });
    },

    destroyObject:function(obj){
        for(var key in obj){
           obj[key] = null;
        }
    },

    cloneObject:function(source){
         var a = {};
         for(var key in source){
              a[key] = source[key];
         }
         return a;
    },

    CLASS_NAME: "Bev.ConfigTool"
});
