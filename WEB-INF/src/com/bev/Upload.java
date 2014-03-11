package com.bev;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

@SuppressWarnings("serial")
public class Upload extends HttpServlet implements ServletContextListener {
    private static String uploadPath = null; // 上传文件的目录
    private static Map<String,String> uploadPathsMap = null;
    private static String tempPath = null; // 临时文件目录
    File tempPathFile;

    @SuppressWarnings("unchecked")
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        String result = "{\"success\":true}";
        try {
            // Create a factory for disk-based file items
            DiskFileItemFactory factory = new DiskFileItemFactory();
            String s_fileName = new String(request.getParameter("name").getBytes("iso-8859-1"),"utf-8");
            StringBuilder sb_fileName=new StringBuilder(s_fileName);
            String fileLocation=setLocationByFileName(sb_fileName);
            String fileName=sb_fileName.toString();
            if(fileName.equals(""))
            {
                fileName=null;
                result = "{\"success\":true}";
            }
            setUploadPathBylocation(fileLocation);
            initServlet();
//            String format = request.getParameter("format");
            // Set factory constraints
            factory.setSizeThreshold(1048576); // 设置缓冲区大小，这里是1MB
            factory.setRepository(tempPathFile);// 设置缓冲区目录

            // Create a new file upload handler
            ServletFileUpload upload = new ServletFileUpload(factory);

            // Set overall request size constraint
            upload.setSizeMax(10485760); // 设置最大文件尺寸，这里是10MB

            List<FileItem> items = upload.parseRequest(request);// 得到所有的文件
            Iterator<FileItem> i = items.iterator();
            while (i.hasNext()) {
                FileItem fi = (FileItem) i.next();
                //long size = fi.getSize();
                String fileName1 = fi.getName();
                if (fileName!=null&&fileName1!=null) {
                    //File fullFile = new File(fi.getName());
                    //File savedFile = new File(uploadPath, fullFile.getName());
                    File savedFile = new File(uploadPath, fileName);
                    fi.write(savedFile);
                }
                else{
                    System.out.print("upload failed");
                    result = "{\"success\":false}";
                    break;
                }
            }

        } catch (Exception e) {
            // 可以跳转出错页面
            e.printStackTrace();
            result = "{\"success\":false}";
        }
        if(result!=null){
            PrintWriter out = response.getWriter();
            out.print(result);
            out.flush();
            out.close();
        }
    }

    private void initServlet() throws ServletException {
        File uploadFile = new File(uploadPath);
        if (!uploadFile.exists()) {
            uploadFile.mkdirs();
        }
        File tempPathFile = new File(tempPath);
        if (!tempPathFile.exists()) {
            tempPathFile.mkdirs();
        }
    }

    public void contextInitialized(ServletContextEvent sce){
        uploadPathsMap=new HashMap<String, String>();
        String rootpath = sce.getServletContext().getRealPath("/");

        tempPath = sce.getServletContext().getInitParameter("tempUploadFilePath");
        tempPath = rootpath+tempPath;

        String imgPath= rootpath+sce.getServletContext().getInitParameter("uploadImgFilePath");
        uploadPathsMap.put("img",imgPath);

        String dataPath=rootpath+sce.getServletContext().getInitParameter("uploadDataFilePath");
        uploadPathsMap.put("data",dataPath);
    }

    public void contextDestroyed(ServletContextEvent sce) {

    }

    private void setUploadPathBylocation(String location){
        if(location.equals("img")){
            uploadPath= uploadPathsMap.get("img");
        }
        else  if(location.equals("data")){
            uploadPath=uploadPathsMap.get("data");
        }
        else{
            uploadPath= tempPath;
        }
    }

    private String setLocationByFileName(StringBuilder sb_fileName){
        String fileName=sb_fileName.toString();
         int dotLocation=fileName.lastIndexOf('.');
        String extend=fileName.substring(dotLocation+1);

        if(extend.equals("jpg")||extend.equals("png")||extend.equals("gif")||extend.equals("tiff")||extend.equals("bmp")){
            sb_fileName.replace(0,fileName.length(),"logo00.png");
             return "img";
        }
        else if(extend.equals("rss")||extend.equals("xml")||extend.equals("kml")||extend.equals("json")){
             return "data";
        }
        else{
            sb_fileName.replace(0,fileName.length(),"");
        }
        return "";
    }
}
