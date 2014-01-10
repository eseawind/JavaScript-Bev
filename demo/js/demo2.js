Bev.inputScript("demo/js/controls/Icon.js");
Bev.inputScript("demo/js/controls/Accordion.js");
Bev.inputScript("demo/js/controls.js");
Bev.inputScript("demo/js/mapServices.js");
Bev.inputScript("demo/libs/control/BZoom.js");
Bev.inputScript("demo/js/ui/jquery.ui.core.js");
Bev.inputScript("demo/js/ui/jquery.ui.widget.js");
Bev.inputScript("demo/js/ui/jquery.ui.button.js");
Bev.inputScript("demo/js/ui/jquery.ui.bevbutton.js");

var measure,tooltip,geolocate,drawFeature,accordion,isLeftHide=false;
function initDemo(){
        accordion = new Bev.Accordion({"body":$("#left_menu"),"html":
                [
                    {
                        "title":"查询",
                        "body":$("<p>this is a examples</p><br><p>this is a examples</p><br><p>this is a examples</p>")
                    },
                    {
                        "title":"分析",
                        "body":$("<p>this is a examples</p><br><p>this is a examples</p><br><p>this is a examples</p>")
                    },
                    {
                        "title":"专题图",
                        "body":$("<p>this is a examples</p><br><p>this is a examples</p><br><p>this is a examples</p>")
                    },
                    {
                        "title":"公交查询",
                        "body":$("<p>this is a examples</p><br><p>this is a examples</p><br><p>this is a examples</p>")
                    }
                ]
        });
//    Bev.loader.js([
//        "demo/js/ui/jquery.ui.core.js",
//        "demo/js/ui/jquery.ui.widget.js",
//        "demo/js/ui/jquery.ui.button.js",
//        "demo/js/ui/jquery.ui.bevbutton.js"
//    ],function(){toolBarHideBtn($("#bd_left"),$("#bd_right"));});
    toolBarHideBtn($("#bd_left"),$("#bd_right"));
};
function getGeolocate(){
    if(!geolocate){
        geolocate = new Bev.Geolocate({"map":map});
    }

    return geolocate;
} ;
function getMesure(){
    var me=this;
    if(!measure){
        measure = new Bev.Measure({"map":map});
        measure.showResult = function(txt){
            var tooltip = me.getTooltip();
            tooltip.show(txt);
        }

        measure.clearResult = function(txt){
            var tooltip = me.getTooltip();
            tooltip.close();
        }
    }

    return measure;
};
function getTooltip(){
    if(!tooltip){
        tooltip = new Bev.Tooltip($("#bd_right"),{
            "position":["center","top"],
            "offset":{"x":0,"y":40}
        });
    }
    return tooltip;
} ;
function toolBarHideBtn(leftDiv,rightDiv){
    var a, b, h, t;

    leftDiv.css({
//                    "background":"#fff",
        "height":"100%",
        "z-index":5
    });

    a = $("<div id='hideBtn'>")
        .css({
            "position":"absolute",
            "width":"20px",
            "height":"60px",
            "right":"-23px",
//                        "border":"1px solid #ddd",
//                        "background":"#fff",
            "z-index":-5,
            "cursor":"pointer"
        })
        .addClass("ui-corner-right ui-state-default");
//        .bevbutton({
//            icons: {
//                primary: "glyphicon-circle-arrow-left"
//            },
//            text: false
//        });



    b = $("<button>")
        .bevbutton({
            icons: {
                primary: "glyphicon-circle-arrow-left"
            },
            text: false
        })
        .css({
            "border":"0px solid #000",
            "background":"none",
            "position":"absolute",
            "width":"16px",
            "height":"16px",
            "left":"2px",
            "top":"22px"
        })
        .appendTo(a);

    a.appendTo(leftDiv);

    a.click(function(){
        if(isLeftHide){
            show();
        }
        else{
            hide();
        }
    });

    if(window.resizeFunctions){
        window.resizeFunctions.push(resizeHide)
    }
    resizeHide();

    function resizeHide(){
        if(document.body.clientWidth<=950&&!isLeftHide){
            leftDiv.css({
                "left":"-340px"
            });
            rightDiv.css({
                "margin-left":"0px"
            });
            b.bevbutton( "option", "icons" ,{
                primary: "glyphicon-circle-arrow-right"
            });
            isLeftHide = true;
        }
        h = Bev.Util.getSize(leftDiv).h;
        t = (h/2 - 30) + "px";
        a.css("top",t);
    }

    function hide(){
        leftDiv.animate({
            "left":"-340px"
        }, "fast", "linear", function(){
//                        $("#left_menu").css({
//                            "display":"none"
//                        });
            rightDiv.css({
                "margin-left":"0px"
            });
            changeIcon();
            isLeftHide = true;
            map.updateSize();
        });
    }

    function show(){
        leftDiv.animate({
            "left":"0px"
        }, "fast", "linear", function(){
//                        $("#left_menu").css({
//                            "display":"none"
//                        });
            rightDiv.css({
                "margin-left":"341px"
            });
            changeIcon();
            isLeftHide = false;
            map.updateSize();
        });
    }

    function changeIcon(){
        b.bevbutton( "option", "icons" ,{
            primary: !isLeftHide?"glyphicon-circle-arrow-right":"glyphicon-circle-arrow-left"
        });
        //a.removeClass("ui-state-focus");
    }
};

function addMeasure(isSelect){
    if(isSelect==0)return;
    Bev.loader.js([
        "demo/js/ui/jquery.ui.core.js",
        "demo/js/ui/jquery.ui.widget.js",
        "demo/js/ui/jquery.ui.bevbutton.js"
    ],function(){
        var myIcon1 = $("<button id='measureArea'>面积量算</button>").bevbutton({
            icons:{
                primary:"glyphicon-ruler-triangle"
            }
        }).click(function () {
                Bev.loader.js(["demo/js/controls/Measure.js","demo/js/controls/Tooltip.js"],function(){
                    var m = getMesure();
                    m.measureArea();
                });
        }).appendTo($("#bd_toolbar"));

        var myIcon2 = $("<button id='measureDistance'>距离量算</button>").bevbutton({
            icons:{
                primary:"glyphicon-ruler-straight"
            }
        }).click(function () {
                Bev.loader.js(["demo/js/controls/Measure.js","demo/js/controls/Tooltip.js"],function(){
                    var m = getMesure();
                    m.measureDistance();
                });
            }).appendTo($("#bd_toolbar"));
    });
}

function addGeolocate(isSelect){
    if(isSelect==0)return;
    Bev.loader.js([
        "demo/js/ui/jquery.ui.core.js",
        "demo/js/ui/jquery.ui.widget.js",
        "demo/js/ui/jquery.ui.bevbutton.js"
    ],function(){
//        var myIcon3 = new Bev.Icon($("#bd_toolbar"),{
//            "title":"定位",
//            "icon_class":"glyphicon-screenshot",
//            "click":function(){
//                Bev.loader.js("demo/js/controls/Geolocate.js",function(){
//                    var g = getGeolocate();
//                    g.geolocateMe();
//                });
//            },
//            "isDisplayTitle":true
//        });
//
//        var myIcon4 = new Bev.Icon($("#bd_toolbar"),{
//            "title":"清除标记",
//            "icon_class":"glyphicon-trash",
//            "click":function(){
//                Bev.loader.js("demo/js/controls/Geolocate.js",function(){
//                    var g = getGeolocate();
//                    g.clearGeoMarkers();
//                });
//            },
//            "isDisplayTitle":true
//        });

        var myIcon3 = $("<button id='geolocate'>定位</button>").bevbutton({
            icons:{
                primary:"glyphicon-screenshot"
            }
        }).click(function () {
                Bev.loader.js("demo/js/controls/Geolocate.js",function(){
                    var g = getGeolocate();
                    g.geolocateMe();
                });
            }).appendTo($("#bd_toolbar"));

        var myIcon4 = $("<button id='clearTip'>清除标记</button>").bevbutton({
            icons:{
                primary:"glyphicon-trash"
            }
        }).click(function () {
                Bev.loader.js("demo/js/controls/Geolocate.js",function(){
                    var g = getGeolocate();
                    g.clearGeoMarkers();
                });
            }).appendTo($("#bd_toolbar"));
    });
}

function addDraw(isSelect){
    if(isSelect==0)return;
    Bev.loader.js("demo/js/controls/DrawFeature.js",function(){
        drawFeature = new Bev.DrawFeature({"body":$("<div>"),"map":map});
        var drawFeatureBody = drawFeature.body;
        window.setTimeout(function(){
            drawFeature.setMap(map);},30);
        var drawItem= {
            "title":"绘制",
            "body":drawFeatureBody
        };
        accordion.addItem(drawItem);
    });
}