package com.bev;

import com.bev.util.FileManger;
import flexjson.JSONSerializer;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

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
            System.out.println(context);
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
                  String type = obj1.getString("type");
                  JSONObject obj2 = new JSONObject();
                  obj2.put("categoryIndex",i);
                  obj2.put("index",j);
                  if(type.equals("select")){
                      //JSONObject options = obj1.getJSONObject("options");
                      String jsCode = obj1.getString("jsCode");
                      String id = obj1.getString("id");
                      String indexStr = obj1.getString("defaultValue");
                      int index = Integer.parseInt(indexStr);

                      JSONArray nameValues = obj1.getJSONArray("nameValues");
                      JSONObject selectValue = nameValues.getJSONObject(index);
                      String defaultValue = selectValue.getString("value");

                      if(selectValue.has("options")){
                          JSONArray selectedOptionsArray = selectValue.getJSONArray("options");
                          JSONObject valueOptions = controlOptionsToValueOptions(selectedOptionsArray);
                          obj2.put("options",valueOptions);
                      }

                      obj2.put("code",jsCode);
                      obj2.put("defaultValue",defaultValue);
                      jsCodeMap.put(id,obj2);
                  }
                  else{
                      //JSONObject options = obj1.getJSONObject("options");
                      String jsCode = obj1.getString("jsCode");
                      String id = obj1.getString("id");
                      String defaultValue = obj1.getString("defaultValue");


                      obj2.put("code",jsCode);
                      obj2.put("defaultValue",defaultValue);

                      if(obj1.has("options")){
                          JSONArray controlOptionsArray = obj1.getJSONArray("options");
                          JSONObject optionsObject = controlOptionsToValueOptions(controlOptionsArray);
                          obj2.put("options",optionsObject);
                      }
                      jsCodeMap.put(id,obj2);
                  }
             }
        }
    }

    public static JSONObject controlOptionsToValueOptions(JSONArray controlOptionsArray){
        JSONObject valueOptions = new JSONObject();

        for(int i=0;i<controlOptionsArray.size();i++){
            JSONObject controlOptions = controlOptionsArray.getJSONObject(i);
            String type = controlOptions.getString("type");
            if(type.equals("select")){
                String id = controlOptions.getString("id");

                String defaultValue = getSelectValue(controlOptions);
                valueOptions.put(id,defaultValue);
            }
            else{
                String id = controlOptions.getString("id");
                String defaultValue = controlOptions.getString("defaultValue");

                valueOptions.put(id,defaultValue);
            }
        }

        return valueOptions;
    }

    public static void saveCurConfig(){
        JSONObject configObj = ConfigInfo.configObject;
        JSONSerializer flexjson = new JSONSerializer();
        flexjson.prettyPrint(true);
        String configStr = flexjson.deepSerialize(configObj);
        FileManger.writeTxt(configInfoPath,configStr);
    }

    public static void modifyConfig(String id,String value,JSONObject otherOption){
        JSONObject jsCodeObj = jsCodeMap.getJSONObject(id);

        String categoryIndex = jsCodeObj.getString("categoryIndex");
        String index = jsCodeObj.getString("index");
        JSONArray configArray = configObject.getJSONArray("configInfo");
        JSONObject categoryObj = configArray.getJSONObject(Integer.parseInt(categoryIndex));
        JSONArray contents = categoryObj.getJSONArray("contents");
        JSONObject obj1 = contents.getJSONObject(Integer.parseInt(index));
        obj1.put("defaultValue",value);

        String type = obj1.getString("type");
        if(type.equals("select")){
            JSONArray nameValues = obj1.getJSONArray("nameValues");
            int index1 = Integer.parseInt(value);
            JSONObject obj = nameValues.getJSONObject(index1);

            String value2 = obj.getString("value");
            jsCodeObj.put("defaultValue",value2);
            if(otherOption!=null){
                if(obj.has("options")){
                    JSONArray options1 = obj.getJSONArray("options");
                    for(int i=0;i<options1.size();i++){
                        JSONObject obj2 = options1.getJSONObject(i);
                        //JSONObject option2 = obj2.getJSONObject("options");
                        String id1 = obj2.getString("id");
                        if(otherOption.has(id1)){
                            String value1 = otherOption.getString(id1);
                            obj2.put("defaultValue",value1);
                        }
                    }
                }
            }

            JSONObject obj3 = getSelectObj(obj1);
            if(obj3.has("options")){
                JSONArray options = obj3.getJSONArray("options");
                JSONObject options1 = controlOptionsToValueOptions(options);
                jsCodeObj.put("options",options1);
            }
            else{
                jsCodeObj.remove("options");
            }
        }
        else if(type.equals("configWindow")){
             if(otherOption!=null){
                 JSONArray configOptionsArray = obj1.getJSONArray("options");

                 for(int i=0;i<configOptionsArray.size();i++){
                     JSONObject configOption = configOptionsArray.getJSONObject(i);
                     String id1 = configOption.getString("id");
                     if(otherOption.has(id1)){
                         configOption.put("defaultValue",otherOption.getString(id1));
                     }
                 }
                 jsCodeObj.put("options",otherOption);
             }

             jsCodeObj.put("defaultValue",value);
        }
        else{
            jsCodeObj.put("defaultValue",value);
        }
    }

    public static String getSelectValue(JSONObject obj){
        JSONObject obj1 = getSelectObj(obj);

        String value2 = obj1.getString("value");

        return value2;
    }

    public static JSONObject getSelectObj(JSONObject obj){
        String defaultValue = obj.getString("defaultValue");
        JSONArray nameValues = obj.getJSONArray("nameValues");
        int index1 = Integer.parseInt(defaultValue);
        JSONObject obj1 = nameValues.getJSONObject(index1);

        //String value2 = obj1.getString("value");

        return obj1;
    }
}
