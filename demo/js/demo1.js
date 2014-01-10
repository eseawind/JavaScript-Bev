Bev.inputScript("demo/js/controls/WidgetControl.js");
Bev.inputScript("demo/js/controls/Navbar.js");
Bev.inputScript("demo/js/controls/Menu.js");
Bev.inputScript("demo/js/controls.js");
Bev.inputScript("demo/js/mapServices.js");
Bev.inputScript("demo/libs/control/BZoom.js");
function addMeasure(isSelect){
    if(isSelect=="0")return;
    var param = {
        "icon_class":"glyphicon-ruler-both",
        "text":"量&nbsp;&nbsp;&nbsp;&nbsp;算",
        "events":{
            "click":function () {
                Bev.loader.js(["demo/js/controls/Dialog.js","demo/js/controls/Measure.js"],function(){
                    if (!myMeasure) {//!myMeasure
                        var dialog = new Bev.Dialog(null, {
                            "text":"量&nbsp;&nbsp;&nbsp;&nbsp;算"
                        });

                        var contentBody = dialog.getContentBody();
                        myMeasure = new Bev.Measure({
                            "body":contentBody,
                            "map":map
                        });
                        dialog.on("dialogclose", function () {
                            if (myMeasure) {
                                myMeasure.destroy();
                                myMeasure = null;
                            }
                        });

                        myWidgetControl.addWidget(dialog);
                    }
                });
            }
        }
    };
    myMenu.addItem(param);
};
function addGeolocate(isSelect){
    if(isSelect=="0")return;
    var param = {
        "icon_class":"glyphicon-screenshot",
        "text":"定&nbsp;&nbsp;&nbsp;&nbsp;位",
        "events":{
            "click":function () {
                Bev.loader.js(["demo/js/controls/Dialog.js","demo/js/controls/Geolocate.js"],function(){
                    if (!myGeolocate) {
                        var dialog = new Bev.Dialog(null, {
                            "text":"定&nbsp;&nbsp;&nbsp;&nbsp;位"
                        });

                        var contentBody = dialog.getContentBody();
                        myGeolocate = new Bev.Geolocate({
                            "body":contentBody,
                            "map":map
                        });
                        dialog.on("dialogclose",function(){
                            if (myGeolocate) {
                                myGeolocate.destroy();
                                myGeolocate = null;
                            }
                        });

                        myWidgetControl.addWidget(dialog);
                    }
                });
            }
        }
    };
    myMenu.addItem(param);
};
function addDraw(isSelect){
    if(isSelect=="0")return;
    var param = {
        "icon_class":"glyphicon-edit",
        "text":"绘&nbsp;&nbsp;&nbsp;&nbsp;制",
        "events":{//点击菜单中的一栏，创建一个绘制功能面板
            "click":function () {
                Bev.loader.js(["demo/js/controls/Dialog.js","demo/js/controls/DrawFeature.js"],function(){
                    if (!myDrawFeature) {
                        var dialog = new Bev.Dialog(null, {
                            "text":"绘&nbsp;&nbsp;&nbsp;&nbsp;制"
                        });

                        var contentBody = dialog.getContentBody();
                        myDrawFeature = new Bev.DrawFeature({
                            "body":contentBody,
                            "map":map
                        });
                        dialog.on("dialogclose", function () {
                            if (myDrawFeature) {
                                myDrawFeature.destroy();
                                myDrawFeature = null;
                            }
                        }) ;

                        myWidgetControl.addWidget(dialog);
                    }
                });
            }
        }
    };
    myMenu.addItem(param);
}