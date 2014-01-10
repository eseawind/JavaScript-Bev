package com.bev;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bev.util.FileManger;

import flexjson.JSONSerializer;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.util.JSONUtils;

import com.bev.util.*;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

public class PageConfig extends HttpServlet implements ServletContextListener {

    public static String template = null;
    public static String demoPath = null;
    public static String templatePath = null;

	public PageConfig(){
        super();
	}

    /**
     * The doGet method of the servlet. <br>
     *
     * This method is called when a form has its tag value method equals to get.
     *
     * @param request the request send by the client to the server
     * @param response the response send by the server to the client
     * @throws javax.servlet.ServletException if an error occurred
     * @throws IOException if an error occurred
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.doRequest(request, response);
    }

    /**
     * The doPost method of the servlet. <br>
     *
     * This method is called when a form has its tag value method equals to post.
     *
     * @param request the request send by the client to the server
     * @param response the response send by the server to the client
     * @throws ServletException if an error occurred
     * @throws IOException if an error occurred
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.doRequest(request, response);
    }

    public void doRequest(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
        String id = request.getParameter("id");
        String value = request.getParameter("value");
        String m = request.getParameter("m");
        String result = null;

        if(id!=null&&value!=null){
            this.modifyConfig(id,value);
            result = "succed";
        }
        else if(m!=null&&m.equals("createPage")){
             this.createPage();
             //result = "{\"src\":\"\"}"
        }
        if(result!=null){
            PrintWriter out = response.getWriter();
            out.print(result);
            out.flush();
            out.close();
        }
    }

    public void destroy() {
        super.destroy(); // Just puts "destroy" string in log
        // Put your code here
    }

    public void getTempLate(){
        String templateName = "template1.html";
        JSONArray configInfo1 = ConfigInfo.configObject.getJSONArray("configInfo");
        for(int i=0;i<configInfo1.size();i++){
             JSONObject obj = configInfo1.getJSONObject(i);
             String category = obj.getString("category");
             if(category.equals("选择模板")){
                  JSONArray contents = obj.getJSONArray("contents");
                  JSONObject contObj = contents.getJSONObject(0);
                  JSONObject options = contObj.getJSONObject("options");
                  templateName = options.getString("defaultValue");
                  break;
             }
        }

        String path = templatePath + templateName;
        String context = null;
        try {
            context = FileManger.readTxt(path);
            this.template = context;
            //System.out.println(context);
        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

    /**
     * Initialization of the servlet. <br>
     *
     * @throws ServletException if an error occurs
     */
    public void init() throws ServletException {

    }

    public void contextInitialized(ServletContextEvent sce){
        String rootpath = sce.getServletContext().getRealPath("/");

        templatePath = sce.getServletContext().getInitParameter("templatePath");
        templatePath = rootpath+templatePath;
        //getTempLate(templatePath);

        demoPath = sce.getServletContext().getInitParameter("demopath");
        demoPath = rootpath+demoPath;

        String configInfoPath = sce.getServletContext().getInitParameter("configinfopath");
        ConfigInfo.configInfoPath = rootpath+configInfoPath;
        ConfigInfo.getConfigInfo();
        ConfigInfo.resetJSCodeMap();

        getTempLate();
        modiyDomeHtml();
    }

    public void contextDestroyed(ServletContextEvent sce) {

    }

    public void modiyDomeHtml(){
        String template1 = this.template;

        for(Iterator ite = ConfigInfo.jsCodeMap.entrySet().iterator(); ite.hasNext();){
            Map.Entry entry = (Map.Entry) ite.next();
            String id1 = (String) entry.getKey();
            JSONObject codeObj = (JSONObject) entry.getValue();
            String code = codeObj.getString("code");
            String defaultValue = codeObj.getString("defaultValue");

            code = code.replaceAll("\\$key",defaultValue);
            template1 = template1.replaceAll("\\{_"+id1+"_\\}", code);
        }

        ConfigInfo.htmlStr = template1;
    }

    public void createPage(){
         FileManger.writeTxt(this.demoPath,ConfigInfo.htmlStr);
    }

    public void modifyConfig(String id,String value){
        ConfigInfo.modifyConfig(id,value);
        getTempLate();
        modiyDomeHtml();
        //ConfigInfo.resetJSCodeMap();
        ConfigInfo.saveCurConfig();
    }
}
