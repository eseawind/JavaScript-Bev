<%@ page language="java" import="java.util.*"%>
<%@ page language="java" import="net.sf.json.JSONArray"%>
<%@ page language="java" import="net.sf.json.JSONObject"%>
<%@ page language="java" import="com.bev.ConfigInfo"%>
<%
    JSONObject configObject = null;
    String configObjectStr = null;
    try{
        //configInfo = (String) request.getAttribute("configInfo");
        //configObj = JSONObject.fromObject(configInfo);
        configObject = ConfigInfo.configObject;
        configObjectStr = configObject.toString();
    }
    catch (Exception e){
        System.out.println(e.getMessage());
    }
    //String configInfo1 = configInfo.replaceAll("\"","\\\"");
%>
<!DOCTYPE html>
<html>
<head>
    <META http-equiv=Content-Type content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1" />
    <title>SuperMap JavaScrpt Bev</title>
    <link rel="stylesheet" href="config/css/style.css"/>
    <script src="common/js/jquery.js"></script>
    <script src="config/js/init.js"></script>
    <link rel="stylesheet" href="demo/uithemes/bev-base/jquery.ui.all.css">
    <script type="text/javascript">
        window.iserverPath = "192.168.13.227:8090";
        window.resizeFunctions = [];
        //window.bevRoot = "../";
        window.configObject = <%=configObjectStr%>;


        function init(){
            //console.log("new ConfigTool");
            var myConfigTool = new Bev.ConfigTool({
                configObject:configObject,
                div:$("#toolbar")
            });
        }

    </script>
</head>
<body onload="init()">
<div id="toolbar"></div>
<div id="map">
    <iframe id="mapFrame" height="100%" width="100%" src='configWin.jsp'></iframe>
</div>
</body>
<script type="text/javascript">
    (function(){
        var a = function(){
            var b = document.body;
            var a = b.clientHeight;
            var w = b.clientWidth;
            var c = window.resizeFunctions;
            for(var i=0;i< c.length;c++){
                if(c[i]){
                    try{c[i](a);}catch(e){}
                }
            }
            document.getElementById("map").style.width = (w - 260) + "px";
        }
        //window.setTimeout(a,500);
        a();
        if(window.addEventListener){
            window.addEventListener("resize",a);
        }
        else{
            window.attachEvent("onresize",a);
        }
    })();
</script>
</html>