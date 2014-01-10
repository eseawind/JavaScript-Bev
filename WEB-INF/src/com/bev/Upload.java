package com.bev;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

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
    private static String tempPath = null; // 临时文件目录
    File tempPathFile;

    @SuppressWarnings("unchecked")
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        String result = null;
        try {
            // Create a factory for disk-based file items
            DiskFileItemFactory factory = new DiskFileItemFactory();
            String fileName = request.getParameter("name");
//            String format = request.getParameter("format");
            // Set factory constraints
            factory.setSizeThreshold(4096); // 设置缓冲区大小，这里是4kb
            factory.setRepository(tempPathFile);// 设置缓冲区目录

            // Create a new file upload handler
            ServletFileUpload upload = new ServletFileUpload(factory);

            // Set overall request size constraint
            upload.setSizeMax(4194304); // 设置最大文件尺寸，这里是4MB

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
            }
            System.out.print("upload succeed");
            result = "{\"success\":true}";
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

    public void init() throws ServletException {
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
        String rootpath = sce.getServletContext().getRealPath("/");

        tempPath = sce.getServletContext().getInitParameter("tempUploadFilePath");
        tempPath = rootpath+tempPath;

        uploadPath = sce.getServletContext().getInitParameter("uploadFilePath");
        uploadPath = rootpath+uploadPath;
    }

    public void contextDestroyed(ServletContextEvent sce) {

    }
}
