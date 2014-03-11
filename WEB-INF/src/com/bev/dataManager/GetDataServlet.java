package com.bev.dataManager;

import javax.servlet.ServletException;
//import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import java.io.IOException;
import java.io.PrintWriter;

import com.bev.util.FileManger;
import org.apache.commons.fileupload.FileItem;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: trojan
 * Date: 14-2-25
 * Time: 下午5:41
 * To change this template use File | Settings | File Templates.
 */
//@WebServlet(name = "GetDataServlet")
public class GetDataServlet extends HttpServlet implements ServletContextListener {
    public static String rootPath=null;
    public static String filePath=null;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws
            ServletException, IOException {

    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws
            ServletException, IOException {
        String fileStr=null;
        try{
            String fileName=new String(request.getParameter("data").getBytes("iso-8859-1"),"utf-8");
            if(!fileName.equals(""))
            {
                ArrayList fileNameList=FileManger.getFileList(filePath);
                if(fileName.equals("georss")){
                    fileStr=getFileNameList("xml",fileNameList);
                }
                else if(fileName.equals("kml")){
                    fileStr=getFileNameList("kml",fileNameList);
                }
                else if(fileName.equals("json")){
                    fileStr=getFileNameList("json",fileNameList);
                }
                else{
                    fileStr=FileManger.readTxt(filePath+"\\"+fileName);
                }
            }
            //System.out.println(fileStr);
            if(fileStr.equals("")||fileStr==null){
                fileStr="failed";
            }
        }
        catch(Exception ex){
            fileStr="failed";
        }

        if(fileStr!=null){
            PrintWriter out = response.getWriter();
            fileStr=new String(fileStr.getBytes("iso-8859-1"),"utf-8");
            out.print(fileStr);
            out.flush();
            out.close();
        }
    }

    public void contextInitialized(ServletContextEvent sce){
        rootPath = sce.getServletContext().getRealPath("/");

        filePath = sce.getServletContext().getInitParameter("uploadDataFilePath");
        filePath=rootPath+filePath;

        System.out.println("ex");
    }

    public void contextDestroyed(ServletContextEvent sce) {

    }

    private String getExtend(String fileName){
        int dotLocation=fileName.lastIndexOf('.');
        String extend=fileName.substring(dotLocation+1);
        return extend;
    }

    private String getFileNameList(String extendType,ArrayList fileNameList){
        String fileStr="";
        String extend=null;
        Iterator i = fileNameList.iterator();
        while(i.hasNext()){
            String file=(String)i.next();
            extend=getExtend(file);
            if(extend.equals(extendType)){
                if(i.hasNext())
                {
                    fileStr+='"'+file+"\",";
                }
                else{
                    fileStr+='"'+file+'"';
                }
            }
        }
        fileStr="["+fileStr+"]";

        return  fileStr;
    }
}
