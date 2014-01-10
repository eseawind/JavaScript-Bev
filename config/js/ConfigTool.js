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
                     else if(child.type == "checkbox_fileupload"){
                          this.createCheckBoxFileUpload(child,html);
                     }
                    else if(child.type == "checkbox_textArea"){
                        this.createCheckBoxTextArea(child,html);
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

    createSelect:function(obj){
         var t = this;
         var options = obj.options;
         var nameValues = options.nameValues;
         var id = options.id;
         var title = options.title;

        var mySelect = new Bev.Select({
            nameValues:nameValues,
            defaultValue:options.defaultValue,
            title:title,
            onSelect:function(id){
                return function(value){
                    var url = "config?id="+id+"&value="+value;
                    t.request(url,function(){
                        t.redrawMapFrame();
                    });
                }
            }(id)
        });

        return mySelect.div;
    },

    createTextArea:function(obj,div){
        var t = this;
        var options = obj.options;
        var title = options.title;
        var id = options.id;
        var defaultValue = options.defaultValue;

        this.createInput(div,title,defaultValue,null,null,null,function(id){
            return function(value){
                value = value||"";
                var url = "config?id="+id+"&value="+value;
                t.request(url,function(){
                    t.redrawMapFrame();
                });
            }
            //t.confParam.title = value;
        }(id));
    },

    createDisableTextArea:function(obj,div){
        var t = this;
        var options = obj.options;
        var title = options.title;
        var id = options.id;
        var defaultValue = options.defaultValue;
        var key = options.key;
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
        var options = obj.options;
        var title = options.title;
        var dValues = options.defaultValue.split(",");
        var isSelect = (dValues[0]+"")=="1"?true:false;
        var text = dValues[1];
        var id = options.id;
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

    createInput:function(container,title,defaultContent,width1,width2,isDisable,keyup){
        var d0,d1;
        var t = this;

        if(title){
            d0 = $("<div>")
                .css({
                    "width":width1||"100px",
                    "padding-top":"5px"
                })
                .html(title);
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
            })
        if(container)d1.appendTo(container);

        if(isDisable)d1.attr({
            "disabled":"disabled"
        });

        if(keyup){
            d1.keyup(function(keyup){
                return function(){
                    var target = this;
                    if(t._keyupTimeoutId){
                        window.clearTimeout(t._keyupTimeoutId)
                    }
                    t._keyupTimeoutId = window.setTimeout(function(target,keyup){
                        return function(){
                            keyup($(target).attr("value"));
                        }
                    }(target,keyup),2000);
                }
            }(keyup));
        }

        return [d0,d1];
    },

    createCheckBoxList:function(obj,div){
        var t = this;
        var options = obj.options;
        var title = options.title;
        var list = options.list;
        var defaultValue = options.defaultValue;
        var id = options.id;

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
        var options = obj.options;
        var title = options.title;
        var isSelect = (options.defaultValue+"")=="1"?true:false;
        var id = options.id;

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

    createCheckBoxFileUpload:function(obj,div){
        var t = this;
        var options = obj.options;
        var title = options.title;
        var dValues = options.defaultValue.split(",");
        var isSelect = (dValues[0]+"")=="1"?true:false;
        var imgSrc = dValues[1];
        var id = options.id;
        var checkBox;
        var curImgSrc = "logo"+Math.round(Math.random()*10000)+".png";

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
        var fileUpLoad = new Bev.FileUpload({
            "body":sp2,
            "fileName":curImgSrc,
            "onUpload":function(){
                request();
            },
            "clickSubmit":function(){
                curImgSrc = "logo"+Math.round(Math.random()*10000)+".png";
                fileUpLoad.setFileName(curImgSrc);
            }
        });

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
        this._mapFrame.src = "configWin.jsp?t="+Math.round(Math.random()*10000000);
        this.bindMapEvents(null,null,true);
    },

    request:function(url,callback){
        $.ajax({
            "dataType":"jsonp",
            "error":function(callback){return function(){callback&&callback();}}(callback),
            "success":function(callback){return function(data){callback&&callback(data);}}(callback),
            "type":"GET",
            "url":url
        });
    },

    CLASS_NAME: "Bev.ConfigTool"
});
