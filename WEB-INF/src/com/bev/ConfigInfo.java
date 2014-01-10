package com.bev;

import com.bev.util.FileManger;
import flexjson.JSONSerializer;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: liuhong
 * Date: 13-12-5
 * Time: 上午9:56
 * To change this template use File | Settings | File Templates.
 */
public class ConfigInfo {
    public static JSONObject configObject = new JSONObject();

    public static JSONObject jsCodeMap = new JSONObject();

    public static String htmlStr = "";

    public static String configInfoPath = null;

    public static void getConfigInfo(){
        String context = null;
        try {
            context = FileManger.readTxt(configInfoPath);
            configObject = JSONObject.fromObject(context);
        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

    public static void resetJSCodeMap(){
        jsCodeMap = new JSONObject();
        JSONArray configArray = configObject.getJSONArray("configInfo");
        for(int i=0;i<configArray.size();i++){
             JSONObject categoryObj = configArray.getJSONObject(i);
             JSONArray contents = categoryObj.getJSONArray("contents");
             for(int j=0;j<contents.size();j++){
                  JSONObject obj1 = contents.getJSONObject(j);
                  JSONObject options = obj1.getJSONObject("options");
                  String jsCode = options.getString("jsCode");
                  String id = options.getString("id");
                  String defaultValue = options.getString("defaultValue");

                  JSONObject obj2 = new JSONObject();
                  obj2.put("code",jsCode);
                  obj2.put("defaultValue",defaultValue);
                  obj2.put("categoryIndex",i);
                  obj2.put("index",j);
                  jsCodeMap.put(id,obj2);
             }
        }
    }

    public static void saveCurConfig(){
        JSONObject configObj = ConfigInfo.configObject;
        JSONSerializer flexjson = new JSONSerializer();
        flexjson.prettyPrint(true);
        String configStr = flexjson.deepSerialize(configObj);
        FileManger.writeTxt(configInfoPath,configStr);
    }

    public static void modifyConfig(String id,String value){
        JSONObject jsCodeObj = jsCodeMap.getJSONObject(id);
//        if(value.toLowerCase().equals("false")){
//            jsCodeObj.put("defaultValue",false);
//        }
//        else if(value.toLowerCase().equals("true")){
//            jsCodeObj.put("defaultValue",true);
//        }
//        else {
//            jsCodeObj.put("defaultValue",value);
//        }
        jsCodeObj.put("defaultValue",value);

        String categoryIndex = jsCodeObj.getString("categoryIndex");
        String index = jsCodeObj.getString("index");
        JSONArray configArray = configObject.getJSONArray("configInfo");
        JSONObject categoryObj = configArray.getJSONObject(Integer.parseInt(categoryIndex));
        JSONArray contents = categoryObj.getJSONArray("contents");
        JSONObject obj1 = contents.getJSONObject(Integer.parseInt(index));
        JSONObject options = obj1.getJSONObject("options");
        options.put("defaultValue",value);
    }

//    public static void add_select(String id,String categoryid,String title,String[] names,String[] values,String jsCode,String defaultValue){
//        for(int i=0;i<configArray.size();i++){
//            JSONObject parent = configArray.getJSONObject(i);
//            String categoryid1 = parent.getString("id");
//            if(categoryid1.equals(categoryid)){
//                JSONArray childs = parent.getJSONArray("childs");
//
//                JSONObject obj = new JSONObject();
//                obj.put("type","select");
//                obj.put("id",id);
//                obj.put("title",title);
//                obj.put("names",names);
//                obj.put("values",values);
//                obj.put("jsCode",jsCode);
//                obj.put("defaultValue",defaultValue);
//                childs.add(obj);
//
//                JSONObject obj1 = new JSONObject();
//                obj1.put("code",jsCode);
//                obj1.put("defaultValue",defaultValue);
//                jsCodeMap.put(id,obj1);
//                break;
//            }
//        }
//    }
//
//    public static void add_category(String id,String title){
//        JSONObject obj = new JSONObject();
//        obj.put("id",id);
//        obj.put("title",title);
//        obj.put("childs",new JSONArray());
//        configArray.add(obj);
//    }
//
//    public static void reset(){
//        configArray = new JSONArray();
//        jsCodeMap = new JSONObject();
//    }
}
