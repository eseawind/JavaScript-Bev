function createMap(key){
     if(key==1){//SuperMap云服务
         createSuperMapCloud();
     }
     else if(key==2){//SuperMap iServer Java服务
         createiServer();
     }
     else if(key==3){//Google地图
         createGoogleMap();
     }
     else if(key==4){//OpenStreet Map
         createOpenStreetMap();
     }
     else if(key==5){//天地图
         createTiandituMap();
     }
     else if(key==6){//ArcGis Online
         createArcGisMap();
     }
     else if(key==7){//百度地图
         createBaiduMap();
     }
     else if(key==8){//Bing 地图
         createBingMap();
     }
}
function createSuperMapCloud(){
    var map = new SuperMap.Map(
        'mapContainer',
        {
            controls:window.mapControlList||[],
            units: 'm',
            projection: 'EPSG:3857',
            allOverlays: true
        }
    );
    var layer0 = new SuperMap.Layer.CloudLayer();
    map.addLayer(layer0);
    map.setCenter(window.center,window.zoom);
    window.map = map;
}
function createiServer(){
    var url = "http://support.supermap.com.cn:8090/iserver/services/map-china400/rest/maps/China";
    var map = new SuperMap.Map(
        'mapContainer',
        {
            controls:window.mapControlList||[],
            units: 'm',
            projection: 'EPSG:3857',
            allOverlays: true
        }
    );
    var layer0 = new SuperMap.Layer.TiledDynamicRESTLayer("China",url, {transparent: true, cacheEnabled: true, redirect: true}, {maxResolution:"auto"});
    layer0.events.on({"layerInitialized": addLayer});

    function addLayer(){
        map.addLayer(layer0);
        map.setCenter(window.center,window.zoom);
    }
    window.map = map;
}
function createGoogleMap(){
    LazyLoad.js([
        "http://maps.google.com/maps/api/js?v=3.5&amp;sensor=false",
        "demo/libs/layer/SphericalMercator.js",
        "demo/libs/layer/EventPane.js",
        "demo/libs/layer/FixedZoomLevels.js",
        "demo/libs/layer/Google.js",
        "demo/libs/layer/Google.v3.js"
    ],function(){
        var map = new SuperMap.Map("map", { controls: window.mapControlList||[]
        });

        //初始化google的四种图层
        var gphy = new SuperMap.Layer.Google(
            "Google Physical",
            {type: google.maps.MapTypeId.TERRAIN}
        );
        var gmap = new SuperMap.Layer.Google(
            "Google Streets", // the default
            {numZoomLevels: 20}
        );
        var ghyb = new SuperMap.Layer.Google(
            "Google Hybrid",
            {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
        );
        var gsat = new SuperMap.Layer.Google(
            "Google Satellite",
            {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
        );

        map.addLayers([gphy, gmap, ghyb, gsat]);
        //设置地图中心点，显示地图
        map.setCenter(window.center,window.zoom);
        window.map = map;
    });
}
function createOpenStreetMap(){
    LazyLoad.js([
        "demo/libs/layer/OSM.js"
    ],function(){
        var map = new SuperMap.Map(
            'mapContainer',
            {
                controls:window.mapControlList||[],
                units: 'm',
                projection: 'EPSG:3857',
                allOverlays: true
            }
        );
        var layer0 = new SuperMap.Layer.OSM("osmLayer");
        map.addLayer(layer0);
        map.setCenter(window.center,window.zoom);
        window.map = map;
    });
}
function createTiandituMap(){
    LazyLoad.js("demo/libs/layer/Tianditu.js",function(){
        var map = new SuperMap.Map(
            'mapContainer',
            {
                controls:window.mapControlList||[],
                units: 'm',
                projection: 'EPSG:3857',
                allOverlays: true
            }
        );

        var layer1 = new SuperMap.Layer.Tianditu({"layerType":"vec"});//img,ter
        var layer2 = new SuperMap.Layer.Tianditu({"layerType":"vec","isLabel":true});

        map.addLayers([layer1,layer2]);
        map.setCenter(window.center,window.zoom);
        window.map = map;
    });
}
function createArcGisMap(){
    LazyLoad.js("demo/libs/layer/ArcGIS93Rest.js",function(){
        var url = "http://www.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/export";
        var map = new SuperMap.Map(
            'mapContainer',
            {
                controls:window.mapControlList||[],
                units: 'm',
                projection: 'EPSG:3857',
                allOverlays: true
            }
        );
        var layer0 = new SuperMap.Layer.ArcGIS93Rest("World", url, {layers:"show:0,1,2,4"}, {projection:"EPSG:3857",useCanvas:true});
        map.addLayer(layer0);
        map.setCenter(window.center,window.zoom);
        window.map = map;
    });
}
function createBaiduMap(){
    LazyLoad.js("demo/libs/layer/Baidu.js",function(){
        var map = new SuperMap.Map(
            'mapContainer',
            {
                controls:window.mapControlList||[],
                units: 'm',
                allOverlays: true
            }
        );
        var layer0 = new SuperMap.Layer.Baidu();
        map.addLayer(layer0);
        map.setCenter(window.center,window.zoom);
        window.map = map;
    });
}
function createBingMap(){
    LazyLoad.js("demo/libs/layer/Bing.js",function(){
        var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
        var map = new SuperMap.Map(
            'mapContainer',
            {
                controls:window.mapControlList||[],
                units: 'm',
                projection: 'EPSG:3857',
                allOverlays: true
            }
        );
        var road = new SuperMap.Layer.Bing({
            name: "Road",
            key: apiKey,
            type: "Road"
        });
        var hybrid = new SuperMap.Layer.Bing({
            name: "Hybrid",
            key: apiKey,
            type: "AerialWithLabels"
        });
        var aerial = new SuperMap.Layer.Bing({
            name: "Aerial",
            key: apiKey,
            type: "Aerial"
        });
        map.addLayers([road, hybrid, aerial]);
        map.setCenter(window.center,window.zoom);
        window.map = map;
    });
}