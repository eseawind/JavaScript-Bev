Bev.inputScript("demo/js/controls/WidgetControl.js");
Bev.inputScript("demo/js/controls/Navbar.js");
Bev.inputScript("demo/js/controls/Menu.js");
Bev.inputScript("demo/js/controls.js");
Bev.inputScript("demo/js/mapServices.js");
Bev.inputScript("demo/libs/control/BZoom.js");
Bev.inputScript("demo/libs/control/BevLayerSwitcher.js");
Bev.inputScript("demo/js/controls/loadFile/LoadFile.js");
Bev.inputScript("demo/js/controls/loadFile/LoadJSON.js");
Bev.inputScript("demo/js/controls/Icon.js");
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
    baseToolsMenu.addItem(param);
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
    baseToolsMenu.addItem(param);
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
    baseToolsMenu.addItem(param);
}
function addQueryControl(isSelect,options){
    if(isSelect=="0")return;
    var param = {
        "icon_class":"glyphicon-search",
        "text":"查&nbsp;&nbsp;&nbsp;&nbsp;询",
        "events":{//点击菜单中的一栏，创建一个绘制功能面板
            "click":function () {
                Bev.loader.js(["demo/js/controls/Dialog.js","demo/js/controls/Query.js"],function(){
                    if (!Bev.query) {
                        var dialog = new Bev.Dialog(null, {
                            "text":"查&nbsp;&nbsp;&nbsp;&nbsp;询"
                        });

                        if(!Bev.queryResultDom){
                            Bev.queryResultDom = $("<div>")
                            .attr({"id":"queryResult"})
                            .css({
                                "position":"absolute",
                                "bottom":"5px",
                                "left":"5px",
                                "background":"#fff"
                            })
                            .appendTo($("#bev_body"));
                        }

                        Bev.queryResultDom.html("");

                        var contentBody = dialog.getContentBody();
                        var param = {
                            "body":contentBody,
                            "map":window.map,
                            "datasetName":options.datasetName,
                            "queryField":options.queryField,
                            "url":options.url,
                            "resultBody":Bev.queryResultDom
                        };
                        var rf = options.resultTableFields;
                        if(rf&&rf!=""){
                            param.resultTableFields = rf;
                        }
                        var ct = options.resultTableColumnTitles;
                        if(ct&&ct!=""){
                            param.resultTableColumnTitles = ct;
                        }
                        Bev.query = new Bev.Query(param);
                        dialog.on("dialogclose",function(){
                            if (Bev.query) {
                                Bev.query.destroy();
                                Bev.query = null;
                            }
                        }) ;

                        myWidgetControl.addWidget(dialog);
                    }
                });
            }
        }
    };
    restMenu.addItem(param);
}
var myLoadJSON;
function addJSON(isSelect){
    if(isSelect=="0")return;

    var t=this;
    var param = {
        "icon_class":"glyphicon-json",
        "text":"JSON",
        "events":{
            "click":function () {
                Bev.loader.js("demo/js/controls/Dialog.js",function(){
                    if (!myLoadJSON) {
                        var dialog = new Bev.Dialog(null, {
                            "text":"JSON"
                        });
                        vectorLayer = new SuperMap.Layer.Vector("Vector Layer", {renderers: ["Canvas2"]});
                        map.addLayer(vectorLayer);
                        map.setCenter(new SuperMap.LonLat(106, 34), 2);
                        myLoadJSON=new Bev.LoadJSON({
                            "labelText":"选择JSON文件：",
                            "addToLayer":function(jsonObject){
                                var features=parseTempData(jsonObject);
                                vectorLayer.removeAllFeatures();
                                vectorLayer.addFeatures(features);
                            },
                            "clearLayer":function(){
                                vectorLayer.removeAllFeatures();
                            }});
                        var contentBody = dialog.getContentBody();

                        myLoadJSON.getControlBody().appendTo(contentBody);

                        dialog.on("dialogclose", function () {
                            if (myLoadJSON) {
                                myLoadJSON.destroy();
                                myLoadJSON = null;
                            }
                        }) ;

                        myWidgetControl.addWidget(dialog);
                    }
                });
            }
        }
    };
    baseToolsMenu.addItem(param);
}

function parseTempData(jsonObject){
    var colors=["#ccfffa","#a3f8b4","#79f26f","#2dd90b","#8aee1e","#c5ef0f","#fff100","#fcbd10","#fb8722","#d53b3b"];
    var result=SuperMap.REST.Recordset.fromJson(jsonObject);
    if (result && result.features) {
        var len = result.features.length;
        var style = {
            strokeColor: "#cccccc",
            strokeWidth: 1,
            fillOpacity: "0.5"
        };
        var styles=[];
        for(var i=0;i<colors.length;i++){
            var style0={
                strokeColor:style.strokeColor,
                strokeWidth:style.strokeWidth,
                fillColor:colors[i],
                fillOpacity:style.fillOpacity
            } ;
            styles.push(style0);
        }
        var features = [];
        for (i = 0; i < len; i++) {
            var feature = result.features[i];
            var data = feature.attributes;
            var value = data['DMAXVALUE'];
            if( value < -24){
                feature.style = styles[0];
            }
            else if( value < -18){
                feature.style = styles[1];
            }
            else if( value < -12){
                feature.style = styles[2];
            }
            else if( value < -6){
                feature.style = styles[3];
            }
            else if( value < 0){
                feature.style = styles[4];
            }
            else if( value < 6){
                feature.style = styles[5];
            }
            else if( value < 12){
                feature.style = styles[6];
            }
            else if( value < 18){
                feature.style = styles[7];
            }
            else if( value < 24){
                feature.style = styles[8];
            }
            else {
                feature.style = styles[9];
            }
            features.push(feature);
        }
    };
    return features;
}