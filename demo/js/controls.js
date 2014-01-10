function getMapControlList(keys){
    var keyArray = keys.split(",");
    var mapControls = [];
    for(var i=0;i<keyArray.length;i++){
        var key = keyArray[i];
        if(key=="1"){
            mapControls.push(new SuperMap.Control.BZoom({
                "offsetPX":{
                    "top":"80px",
                    "left":"10px"
                }
            }));
        }
        else if(key == "2"){
            mapControls.push(new SuperMap.Control.ScaleLine());
        }
        else if(key == "3"){
            mapControls.push(new SuperMap.Control.Navigation({ dragPanOptions:{enableKinetic:true}}));
        }
        else if(key == "4"){
            mapControls.push(new SuperMap.Control.OverviewMap());
        }
    }
    return mapControls;
}