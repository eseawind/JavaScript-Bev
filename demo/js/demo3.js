Bev.inputScript("demo/js/controls/Navbar.js");
Bev.inputScript("demo/js/controls/Menu.js");
Bev.inputScript("demo/js/controls.js");
Bev.inputScript("demo/js/mapServices.js");
Bev.inputScript("demo/libs/control/BZoom.js");
function initDemo(){
        nav=new Bev.Navbar({
            "body":$("#toolbar")
        });
        menu = new Bev.Menu({
            "body":$("#toolbar")
        });
        nav.addNavItem({
            "icon_class":"tool-icon-20",
            "title":"基本操作"
        });
        nav.bindEvent(0,{
            "mouseover":function(){
                var position=$(this).position();
                menu.menuBody.css({"display":"block","position":"absolute","top":position.top+30,"left":position.left}) ;
                menu.menuBody.mouseover(function(){
                    menu.menuBody.css({"display":"block","position":"absolute","top":position.top+30,"left":position.left}) ;
                });
            },
            "mouseout":function(){
                menu.menuBody.css({"display":"none"});
                menu.menuBody.mouseout(function(){
                    menu.menuBody.css({"display":"none"});
                });
            }
        });

    $("body").addClass("ui-widget-content");
}

var measure,nav,menu,geolocate,drawFeature;
function addMeasure(isSelect){
    if(isSelect=="0")return;
    var param = {
        "icon_class":"glyphicon-ruler-both",
        "text":"量&nbsp;&nbsp;&nbsp;&nbsp;算",
        "events":{
            "click":function () {
                Bev.loader.js(["demo/js/controls/Dialog.js","demo/js/controls/Measure.js"],function(){
                    if (!measure) {//!myMeasure
                        var dialog = new Bev.Dialog(null, {
                            "text":"量&nbsp;&nbsp;&nbsp;&nbsp;算"
                        });

                        var contentBody = dialog.getContentBody();
                        measure = new Bev.Measure({
                            "body":contentBody,
                            "map":map
                        });
                        dialog.on("dialogclose", function () {
                            if (measure) {
                                measure.destroy();
                                measure = null;
                            }
                        });
                    }
                });
            }
        }
    };
    menu.addItem(param);
};
function addGeolocate(isSelect){
    if(isSelect=="0")return;
    var param = {
        "icon_class":"glyphicon-screenshot",
        "text":"定&nbsp;&nbsp;&nbsp;&nbsp;位",
        "events":{
            "click":function () {
                Bev.loader.js(["demo/js/controls/Dialog.js","demo/js/controls/Geolocate.js"],function(){
                    if (!geolocate) {
                        var dialog = new Bev.Dialog(null, {
                            "text":"定&nbsp;&nbsp;&nbsp;&nbsp;位"
                        });

                        var contentBody = dialog.getContentBody();
                        geolocate = new Bev.Geolocate({
                            "body":contentBody,
                            "map":map
                        });
                        dialog.on("dialogclose",function(){
                            if (geolocate) {
                                geolocate.destroy();
                                geolocate = null;
                            }
                        });
                    }
                });
            }
        }
    };
    menu.addItem(param);
};
function addDraw(isSelect){
    if(isSelect=="0")return;
    var param = {
        "icon_class":"glyphicon-edit",
        "text":"绘&nbsp;&nbsp;&nbsp;&nbsp;制",
        "events":{//点击菜单中的一栏，创建一个绘制功能面板
            "click":function () {
                Bev.loader.js(["demo/js/controls/Dialog.js","demo/js/controls/DrawFeature.js"],function(){
                    if (!drawFeature) {
                        var dialog = new Bev.Dialog(null, {
                            "text":"绘&nbsp;&nbsp;&nbsp;&nbsp;制"
                        });

                        var contentBody = dialog.getContentBody();
                        drawFeature = new Bev.DrawFeature({
                            "body":contentBody,
                            "map":map
                        });
                        dialog.on("dialogclose", function () {
                            if (drawFeature) {
                                drawFeature.destroy();
                                drawFeature = null;
                            }
                        }) ;
                    }
                });
            }
        }
    };
    menu.addItem(param);
}